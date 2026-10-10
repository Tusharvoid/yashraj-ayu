'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GalleryItem } from '@/lib/gallery'

type PublicGalleryFeedProps = {
  initialItems: GalleryItem[]
  initialNextOffset: number
  initialHasMore: boolean
  staticItems?: GalleryItem[]
}

export default function PublicGalleryFeed({
  initialItems,
  initialNextOffset,
  initialHasMore,
  staticItems,
}: PublicGalleryFeedProps) {
  const [items, setItems] = useState(initialItems)
  const [nextOffset, setNextOffset] = useState(initialNextOffset)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  async function loadMore() {
    if (staticItems) {
      const nextItems = staticItems.slice(nextOffset, nextOffset + 8)
      setItems((current) => [...current, ...nextItems])
      setNextOffset(nextOffset + nextItems.length)
      setHasMore(nextOffset + nextItems.length < staticItems.length)
      return
    }
    setLoadingMore(true)
    setError('')

    try {
      const response = await fetch(
        `/api/gallery?offset=${nextOffset}&limit=8`,
        { cache: 'no-store' },
      )
      if (!response.ok) throw new Error('Gallery request failed')

      const data = await response.json()
      setItems((current) => [...current, ...(data.items ?? [])])
      setNextOffset(data.nextOffset ?? nextOffset)
      setHasMore(Boolean(data.hasMore))
    } catch {
      setError('The photos could not be loaded. Please try again.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((image) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-xl border border-border bg-panel transition-colors hover:border-primary/30"
          >
            <div className="relative aspect-[4/3] w-full bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="border-t border-border px-5 py-4 text-sm text-muted">
              {image.caption}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-center text-sm text-muted">
          {error}
        </p>
      )}
      {hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadMore()}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more
              </>
            ) : (
              'Load More Photos'
            )}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
