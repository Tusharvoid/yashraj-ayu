'use client'
import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getJitsiApiScriptUrl, getJitsiDomain } from '@/lib/jitsi/client'

type JitsiMeetConstructor = new (
  domain: string,
  options: {
    roomName: string
    parentNode: HTMLElement
    width: string
    height: string
    onload?: () => void
    jwt?: string
    configOverwrite?: Record<string, unknown>
    interfaceConfigOverwrite?: Record<string, unknown>
  }
) => JitsiMeetApi

type JitsiMeetApi = {
  addListener: (event: string, listener: (payload?: unknown) => void) => void
  executeCommand: (command: string, ...args: unknown[]) => void
  dispose: () => void
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: JitsiMeetConstructor
  }
}

interface Props {
  appointmentId: string
  roomUrl: string | null
  roomName: string | null
  roomJwt?: string | null
  displayName: string
  isDoctor: boolean
}

function loadJitsiApi(roomName: string, roomUrl: string | null) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Jitsi can only load in the browser'))
  }

  if (window.JitsiMeetExternalAPI) {
    return Promise.resolve(window.JitsiMeetExternalAPI)
  }

  return new Promise<JitsiMeetConstructor>((resolve, reject) => {
    const src = getJitsiApiScriptUrl(roomName, roomUrl)
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)

    const handleLoad = () => {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI)
        return
      }

      reject(new Error('Jitsi API script loaded without exposing the API'))
    }

    const handleError = () => reject(new Error('Failed to load Jitsi API script'))

    if (existing) {
      existing.addEventListener('load', handleLoad, { once: true })
      existing.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = handleLoad
    script.onerror = handleError
    document.body.appendChild(script)
  })
}

export default function VideoRoom({ appointmentId, roomUrl, roomName, roomJwt, displayName, isDoctor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'ended'>('loading')

  useEffect(() => {
    if (!roomUrl || !roomName) return

    const activeRoomName = roomName
    const domain = getJitsiDomain(activeRoomName, roomUrl)
    let api: JitsiMeetApi | null = null
    let cancelled = false

    async function init() {
      try {
        const JitsiMeetExternalAPI = await loadJitsiApi(activeRoomName, roomUrl)
        if (cancelled) return

        const el = containerRef.current
        if (!el) return

        const options: ConstructorParameters<JitsiMeetConstructor>[1] = {
          roomName: activeRoomName,
          parentNode: el,
          width: '100%',
          height: '100%',
          onload: () => {
            if (!cancelled) setStatus('ready')
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            MOBILE_APP_PROMO: false,
          },
        }

        if (roomJwt) {
          options.jwt = roomJwt
        }

        api = new JitsiMeetExternalAPI(domain, options)

        api.addListener('videoConferenceJoined', () => {
          api?.executeCommand('displayName', displayName)
          if (!cancelled) setStatus('ready')
        })

        api.addListener('videoConferenceLeft', () => {
          if (!cancelled) setStatus('ended')
        })

        api.addListener('readyToClose', () => {
          if (!cancelled) setStatus('ended')
        })

        api.addListener('cameraError', (event) => {
          console.error('[Jitsi] cameraError', event)
          if (!cancelled) setStatus('error')
        })

        api.addListener('browserSupport', (event) => {
          const supported = typeof event === 'object' && event !== null && 'supported' in event
            ? Boolean((event as { supported?: boolean }).supported)
            : true

          if (!supported && !cancelled) {
            setStatus('error')
          }
        })
      } catch (err) {
        console.error('[Jitsi] join failed', err)
        if (!cancelled) setStatus('error')
      }
    }

    init()
    return () => {
      cancelled = true
      api?.dispose()
    }
  }, [displayName, isDoctor, roomJwt, roomName, roomUrl])

  if (!roomUrl || !roomName) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="text-5xl mb-4">📵</div>
        <h2 className="text-xl font-semibold mb-2">Unable to join the call</h2>
        <p className="text-white/60 text-sm mb-6">The consultation room is not ready yet. Please try again.</p>
        <Button variant="outline" className="border-white text-white" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="text-5xl mb-4">📵</div>
        <h2 className="text-xl font-semibold mb-2">Unable to join the call</h2>
        <p className="text-white/60 text-sm mb-6">Camera, microphone, or the secure consultation room could not be loaded. Please try again.</p>
        <Button variant="outline" className="border-white text-white" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (status === 'ended') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold mb-2">Call ended</h2>
        {isDoctor ? (
          <Button asChild className="mt-4" variant="accent">
            <Link href={`/doctor/prescriptions/new?appt=${appointmentId}`}>Write Prescription</Link>
          </Button>
        ) : (
          <Button asChild className="mt-4">
            <Link href="/patient/appointments">View My Appointments</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal z-10">
          <div className="text-center text-white">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3" />
            <p>Connecting to consultation room...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
