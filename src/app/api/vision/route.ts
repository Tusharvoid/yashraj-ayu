import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { visionImages } from '@/lib/db/schema'
import { getVisionImages, saveVisionImage } from '@/lib/vision'
import { isClerkConfigured } from '@/lib/auth/clerk'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

async function checkAuth(): Promise<boolean> {
  if (!isClerkConfigured()) return true
  const { userId } = await auth()
  return Boolean(userId)
}

export async function GET() {
  const images = await getVisionImages()
  return NextResponse.json({ images })
}

export async function POST(request: Request) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('images') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 })
  }

  const saved = []
  for (const file of files) {
    try {
      const image = await saveVisionImage(file)
      saved.push(image)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  return NextResponse.json({ images: saved })
}

export async function DELETE(request: Request) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  await db.delete(visionImages).where(eq(visionImages.id, id))
  return NextResponse.json({ ok: true })
}
