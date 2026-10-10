import { Images, UploadCloud } from 'lucide-react'
import GalleryManager from '@/components/gallery/GalleryManager'
import { Card, CardContent } from '@/components/ui/card'
import { getAllGalleryItems } from '@/lib/gallery'

export const dynamic = 'force-dynamic'

export default async function DoctorGalleryPage() {
  const galleryItems = await getAllGalleryItems()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Gallery Manager</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Upload clinic images in batches from the doctor dashboard and keep the public gallery fresh without loading every photo at once.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-charcoal">{galleryItems.filter(item => item.source === 'upload').length}</div>
              <div className="text-sm text-muted">Uploaded photos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary">
              <Images className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-charcoal">{galleryItems.length}</div>
              <div className="text-sm text-muted">Total gallery images</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GalleryManager initialItems={galleryItems} />
    </div>
  )
}
