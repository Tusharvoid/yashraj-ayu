'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type VideoPopupProps = {
  enabled: boolean
  videoUrl: string | null
}

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url)

    // Vimeo: vimeo.com/VIDEO_ID or player.vimeo.com/video/VIDEO_ID
    if (u.hostname === 'vimeo.com' || u.hostname === 'www.vimeo.com') {
      const videoId = u.pathname.split('/').filter(Boolean)[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }

    // YouTube: youtu.be/ID or youtube.com/watch?v=ID
    if (u.hostname === 'youtu.be') {
      const videoId = u.pathname.split('/').filter(Boolean)[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      if (u.pathname.startsWith('/watch')) {
        const videoId = u.searchParams.get('v')
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1`
      }
    }
  } catch {
    // fall through
  }
  // Already an embed URL or unknown format — use as-is
  return url
}

export default function VideoPopup({ enabled, videoUrl }: VideoPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(mountTimer)
  }, [])

  useEffect(() => {
    if (!mounted || !enabled || !videoUrl) return

    const openTimer = window.setTimeout(() => setIsOpen(true), 0)

    const interval = setInterval(() => {
      setIsOpen(true)
    }, 2 * 60 * 1000)

    return () => {
      window.clearTimeout(openTimer)
      clearInterval(interval)
    }
  }, [mounted, enabled, videoUrl])

  const handleClose = () => {
    setIsOpen(false)
  }

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted || !isOpen || !enabled || !videoUrl) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-primary"
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={toEmbedUrl(videoUrl)}
            title="Welcome Video"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
