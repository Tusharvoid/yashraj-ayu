import { Images } from 'lucide-react'
import VisionImageManager from '@/components/vision/VisionImageManager'
import { Card, CardContent } from '@/components/ui/card'
import { getVisionImages } from '@/lib/vision'

export const dynamic = 'force-dynamic'

export default async function DoctorVisionPage() {
  const images = await getVisionImages()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Vision</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Upload images that appear as a fullscreen slideshow on the public Vision page.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary">
              <Images className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-charcoal">{images.length}</div>
              <div className="text-sm text-muted">{images.length === 1 ? 'Slide live' : 'Slides live'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <VisionImageManager initialImages={images} />
    </div>
  )
}
