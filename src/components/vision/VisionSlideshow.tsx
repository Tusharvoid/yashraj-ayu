'use client'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { VisionImage } from '@/lib/vision'

export default function VisionSlideshow({ images }: { images: VisionImage[] }) {
  const [current, setCurrent] = useState(0)
  if (!images.length) return null
  const slide = current % images.length
  const previous = () =>
    setCurrent((value) => (value - 1 + images.length) % images.length)
  const next = () => setCurrent((value) => (value + 1) % images.length)
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Our vision in pictures"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') previous()
        if (event.key === 'ArrowRight') next()
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface sm:aspect-[16/9]">
        {images.map((image, index) => (
          <div
            key={image.id}
            hidden={index !== slide}
            className="absolute inset-0"
            role="group"
            aria-roledescription="slide"
            aria-label={index + 1 + ' of ' + images.length}
          >
            {/* Uploaded images are served by the existing vision API. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={'Clinic vision image ' + (index + 1)}
              className="h-full w-full object-contain"
              loading={index ? 'lazy' : 'eager'}
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs text-muted" aria-live="polite">
          Image {slide + 1} / {images.length}
        </p>
        {images.length > 1 && (
          <div className="flex gap-3">
            <button
              onClick={previous}
              className="clinic-button clinic-button-outline"
              aria-label="Previous image"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={next}
              className="clinic-button clinic-button-outline"
              aria-label="Next image"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
