'use client'

import { useState } from 'react'
import { Loader2, Trash2, UploadCloud, Images } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { VisionImage } from '@/lib/vision'

export default function VisionImageManager({ initialImages }: { initialImages: VisionImage[] }) {
  const [images, setImages] = useState<VisionImage[]>(initialImages)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function upload() {
    if (!files.length) { setError('Select at least one image.'); return }
    setUploading(true); setError(null); setSuccess(null)

    const formData = new FormData()
    files.forEach(f => formData.append('images', f))

    const res = await fetch('/api/vision', { method: 'POST', body: formData })
    const data = await res.json().catch(() => null)
    setUploading(false)

    if (!res.ok) { setError(data?.error ?? 'Upload failed.'); return }

    setImages(prev => [...prev, ...(data.images as VisionImage[])])
    setFiles([])
    setSuccess(`${data.images.length} image(s) added.`)
  }

  async function remove(id: string) {
    setDeletingId(id)
    const res = await fetch(`/api/vision?id=${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) setImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            Upload slide images
          </CardTitle>
          <CardDescription>
            Select one or more images (JPEG, PNG, WebP, GIF — max 10 MB each).
            They appear as a fullscreen auto-playing slideshow on the public Vision page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Images className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-charcoal">Choose images</div>
              <p className="mt-1 text-sm text-muted">Multiple selection supported</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={e => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>

          {files.length > 0 && (
            <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal">
              {files.length} file(s) selected: {files.map(f => f.name).join(', ')}
            </div>
          )}

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

          <div className="flex gap-3">
            <Button onClick={() => void upload()} disabled={uploading || !files.length}>
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : 'Upload'}
            </Button>
            <Button variant="outline" onClick={() => setFiles([])} disabled={uploading || !files.length}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slideshow images</CardTitle>
          <CardDescription>
            {images.length === 0
              ? 'No images uploaded yet.'
              : `${images.length} image(s) — shown in order, auto-advancing every 4 seconds.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
              Upload images above to build the slideshow.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img, i) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.fileName}
                    className="aspect-video w-full object-contain"
                  />
                  <div className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                    {i + 1}
                  </div>
                  <button
                    onClick={() => void remove(img.id)}
                    disabled={deletingId === img.id}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600 disabled:opacity-50"
                    aria-label="Delete image"
                  >
                    {deletingId === img.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                  <p className="truncate px-2 py-1.5 text-xs text-muted">{img.fileName}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
