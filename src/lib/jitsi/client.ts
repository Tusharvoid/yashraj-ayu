const JITSI_JAAS_DOMAIN = '8x8.vc'
const JITSI_PUBLIC_DOMAIN = 'meet.jit.si'

function buildRoomSlug(appointmentId: string) {
  return `yashraj-clinic-${appointmentId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`
}

export function getJitsiDomain(roomName?: string | null, roomUrl?: string | null) {
  if (roomUrl) {
    try {
      const hostname = new URL(roomUrl).hostname
      if (hostname === JITSI_JAAS_DOMAIN || hostname === JITSI_PUBLIC_DOMAIN) {
        return hostname
      }
    } catch {
      // ignore invalid URL and fall back below
    }
  }

  if (roomName?.includes('/')) {
    return JITSI_JAAS_DOMAIN
  }

  return hasJaaSAppId() ? JITSI_JAAS_DOMAIN : JITSI_PUBLIC_DOMAIN
}

export function getJaaSAppId() {
  const appId = process.env.JITSI_JAAS_APP_ID?.trim()
  if (!appId) {
    throw new Error('JITSI_JAAS_APP_ID is not configured')
  }

  return appId
}

export function hasJaaSAppId() {
  return Boolean(process.env.JITSI_JAAS_APP_ID?.trim())
}

export function isJitsiRoomUrl(roomUrl: string | null) {
  if (!roomUrl) return false

  try {
    const hostname = new URL(roomUrl).hostname
    return hostname === JITSI_JAAS_DOMAIN || hostname === JITSI_PUBLIC_DOMAIN
  } catch {
    return false
  }
}

export function createJitsiRoom(appointmentId: string): { url: string; name: string } {
  const roomSlug = buildRoomSlug(appointmentId)

  if (hasJaaSAppId()) {
    const domain = JITSI_JAAS_DOMAIN
    const appId = getJaaSAppId()
    const name = `${appId}/${roomSlug}`

    return {
      url: `https://${domain}/${name}`,
      name,
    }
  }

  return {
    url: `https://${JITSI_PUBLIC_DOMAIN}/${roomSlug}`,
    name: roomSlug,
  }
}

export function tryCreateJitsiRoom(appointmentId: string) {
  return createJitsiRoom(appointmentId)
}

export function getJitsiApiScriptUrl(roomName: string | null, roomUrl?: string | null) {
  const domain = getJitsiDomain(roomName, roomUrl)

  if (domain === JITSI_JAAS_DOMAIN) {
    const appId = roomName?.split('/')[0] || getJaaSAppId()
    return `https://${domain}/${appId}/external_api.js`
  }

  return `https://${domain}/external_api.js`
}

export function getJitsiRoomName(roomName: string | null, roomUrl: string | null) {
  if (roomName) return roomName
  if (!roomUrl) return null

  try {
    const url = new URL(roomUrl)
    const segments = url.pathname.split('/').filter(Boolean)
    if (segments.length < 2) {
      return segments.at(-1) ?? null
    }

    return `${segments[0]}/${segments.slice(1).join('/')}`
  } catch {
    return null
  }
}
