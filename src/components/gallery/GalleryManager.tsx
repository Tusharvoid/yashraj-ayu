'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, RefreshCcw, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { GalleryItem } from '@/lib/gallery'

type GalleryManagerProps = {
  initialItems: GalleryItem[]
}

export default function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState(initialItems)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const previews = useMemo(
    () => files.map(file => ({ file, url: URL.createObjectURL(file) })),
    [files]
  )

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  async function submit() {
    if (!files.length) {
      setError('Select one or more images first.')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        setError(data?.error ?? 'Upload failed.')
        return
      }

      setItems(current => [...(data?.uploaded ?? []), ...current])
      setFiles([])
      setSuccess(`${data?.uploaded?.length ?? files.length} image${(data?.uploaded?.length ?? files.length) === 1 ? '' : 's'} uploaded to the gallery.`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            Multi-image Upload
          </CardTitle>
          <CardDescription>
            Add several gallery photos in one go. Supported formats: JPG, PNG, WEBP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-6">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <ImagePlus className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-medium text-charcoal">Choose gallery images</div>
                <p className="mt-1 text-sm text-muted">You can select multiple photos at once.</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={event => setFiles(Array.from(event.target.files ?? []))}
              />
            </label>
          </div>

          {files.length ? (
            <div className="space-y-3">
              <div className="text-sm font-medium text-charcoal">
                {files.length} file{files.length === 1 ? '' : 's'} ready to upload
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {previews.map(({ file, url }) => (
                  <div key={`${file.name}-${file.lastModified}`} className="overflow-hidden rounded-xl border border-border bg-white">
                    <div className="relative aspect-square w-full bg-surface">
                      <Image src={url} alt={file.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="border-t border-border px-3 py-2 text-xs text-muted">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => void submit()} disabled={uploading || !files.length}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload to Gallery'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setFiles([])} disabled={uploading || !files.length}>
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-4">
          <div>
            <CardTitle>Current Gallery</CardTitle>
            <CardDescription>
              Recently uploaded images appear first. Public gallery loads these in batches.
            </CardDescription>
          </div>
          <Button type="button" variant="ghost" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {items.map(image => (
              <div key={image.id} className="overflow-hidden rounded-xl border border-border bg-white">
                <div className="relative aspect-square w-full bg-surface">
                  <Image src={image.src} alt={image.alt} fill className="object-cover" />
                </div>
                <div className="space-y-1 border-t border-border px-3 py-2">
                  <div className="text-sm font-medium text-charcoal">{image.caption}</div>
                  <div className="text-xs text-muted">
                    {image.source === 'upload' ? 'Uploaded image' : 'Original gallery image'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
