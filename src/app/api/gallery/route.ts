import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import { getGalleryPage, saveGalleryImages } from '@/lib/gallery'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = Number(searchParams.get('offset') ?? '0')
    const limit = Number(searchParams.get('limit') ?? '8')

    const page = await getGalleryPage(
      Number.isFinite(offset) && offset > 0 ? offset : 0,
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 24) : 8
    )

    return NextResponse.json(page)
  } catch (error) {
    console.error('[Gallery][GET]', error)
    return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authState = await auth()
    if (!authState.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctorContext = await getSignedInDoctor()
    if (!doctorContext) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images').filter((item): item is File => item instanceof File)

    if (!files.length) {
      return NextResponse.json({ error: 'No images were uploaded' }, { status: 400 })
    }

    const savedItems = await saveGalleryImages(files)

    if (!savedItems.length) {
      return NextResponse.json({ error: 'No supported image files were uploaded' }, { status: 400 })
    }

    return NextResponse.json({ uploaded: savedItems })
  } catch (error) {
    console.error('[Gallery][POST]', error)
    return NextResponse.json({ error: 'Failed to upload gallery images' }, { status: 500 })
  }
}
