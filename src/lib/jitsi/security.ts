import { createHmac, createPrivateKey, createSign, timingSafeEqual } from 'node:crypto'

const JITSI_JAAS_DOMAIN = '8x8.vc'
const JAAS_JWT_LIFETIME_SECONDS = 60 * 60 * 2
const FALLBACK_PATIENT_LINK_LIFETIME_SECONDS = 60 * 60 * 24 * 7
let hasWarnedAboutFallbackSecret = false

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString('base64url')
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

function getPatientLinkSecret() {
  const configuredSecret = process.env.JITSI_PATIENT_LINK_SECRET?.trim()
  if (configuredSecret) {
    return configuredSecret
  }

  const fallbackSecret = process.env.CLERK_SECRET_KEY?.trim()
    || process.env.GMAIL_APP_PASSWORD?.trim()
    || 'local-jaas-patient-link-secret'

  if (!hasWarnedAboutFallbackSecret) {
    hasWarnedAboutFallbackSecret = true
    console.warn('[Jitsi] JITSI_PATIENT_LINK_SECRET is not configured. Falling back to a server-side secret source.')
  }

  return fallbackSecret
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, '\n')
}

function buildPatientJoinPayload(appointmentId: string, exp: number) {
  return `patient:${appointmentId}:${exp}`
}

function signPatientJoinPayload(appointmentId: string, exp: number) {
  return createHmac('sha256', getPatientLinkSecret())
    .update(buildPatientJoinPayload(appointmentId, exp))
    .digest('base64url')
}

function timingSafeMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function getJitsiDomain() {
  return JITSI_JAAS_DOMAIN
}

export function getJaaSAppId() {
  return getRequiredEnv('JITSI_JAAS_APP_ID')
}

export function createPatientRoomJoinUrl(opts: {
  appointmentId: string
  appointmentDate: string
}) {
  const appointmentDate = new Date(`${opts.appointmentDate}T23:59:59.999Z`)
  const fallbackExpiry = Math.floor(Date.now() / 1000) + FALLBACK_PATIENT_LINK_LIFETIME_SECONDS
  const expiresAt = Number.isNaN(appointmentDate.getTime())
    ? fallbackExpiry
    : Math.floor(appointmentDate.getTime() / 1000) + 60 * 60 * 12
  const signature = signPatientJoinPayload(opts.appointmentId, expiresAt)
  const url = new URL(`/room/${opts.appointmentId}`, getAppUrl())

  url.searchParams.set('access', 'patient')
  url.searchParams.set('exp', String(expiresAt))
  url.searchParams.set('sig', signature)

  return url.toString()
}

export function validatePatientRoomAccess(opts: {
  appointmentId: string
  access?: string
  exp?: string
  sig?: string
}) {
  if (opts.access !== 'patient' || !opts.exp || !opts.sig) {
    return { valid: false, reason: 'missing' as const }
  }

  const expiresAt = Number(opts.exp)
  if (!Number.isFinite(expiresAt)) {
    return { valid: false, reason: 'invalid' as const }
  }

  if (expiresAt < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: 'expired' as const }
  }

  const expectedSignature = signPatientJoinPayload(opts.appointmentId, expiresAt)
  if (!timingSafeMatch(expectedSignature, opts.sig)) {
    return { valid: false, reason: 'invalid' as const }
  }

  return { valid: true, expiresAt }
}

export function createJaaSMeetingJwt(opts: {
  roomName: string
  userId: string
  name: string
  email?: string | null
  moderator: boolean
}) {
  const appId = getJaaSAppId()
  const kid = getRequiredEnv('JITSI_JAAS_KID')
  const privateKey = createPrivateKey(normalizePrivateKey(getRequiredEnv('JITSI_JAAS_PRIVATE_KEY')))
  const now = Math.floor(Date.now() / 1000)

  const header = {
    alg: 'RS256',
    kid,
    typ: 'JWT',
  }

  const payload = {
    aud: 'jitsi',
    iss: 'chat',
    sub: appId,
    room: opts.roomName,
    nbf: now - 60,
    exp: now + JAAS_JWT_LIFETIME_SECONDS,
    context: {
      user: {
        id: opts.userId,
        name: opts.name,
        email: opts.email ?? undefined,
        moderator: opts.moderator ? 'true' : 'false',
      },
      features: {
        recording: false,
        livestreaming: false,
        transcription: false,
        'outbound-call': false,
      },
      room: {
        regex: false,
      },
    },
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const signature = createSign('RSA-SHA256').update(signingInput).end().sign(privateKey).toString('base64url')

  return `${signingInput}.${signature}`
}
