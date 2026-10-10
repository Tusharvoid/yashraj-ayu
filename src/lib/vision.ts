import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { visionImages } from '@/lib/db/schema'

const supportedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])

const maxImageBytes = 10 * 1024 * 1024

export type VisionImage = {
  id: string
  fileName: string
  src: string
  sortOrder: number
}

export async function getVisionImages(): Promise<VisionImage[]> {
  try {
    const rows = await db
      .select({
        id: visionImages.id,
        fileName: visionImages.fileName,
        sortOrder: visionImages.sortOrder,
      })
      .from(visionImages)
      .orderBy(asc(visionImages.sortOrder), asc(visionImages.createdAt))

    return rows.map(row => ({
      id: row.id,
      fileName: row.fileName,
      sortOrder: row.sortOrder,
      src: `/api/vision/file/${row.id}`,
    }))
  } catch {
    return []
  }
}

export async function saveVisionImage(file: File): Promise<VisionImage> {
  const mime = file.type.toLowerCase()
  if (!supportedMimeTypes.has(mime)) {
    throw new Error('Only image files (JPEG, PNG, WebP, GIF) are supported.')
  }

  if (file.size > maxImageBytes) {
    throw new Error(`Each image must be smaller than ${maxImageBytes / (1024 * 1024)} MB.`)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const contentBase64 = buffer.toString('base64')

  const countResult = await db.select({ id: visionImages.id }).from(visionImages)
  const nextOrder = countResult.length

  const [row] = await db
    .insert(visionImages)
    .values({
      fileName: file.name,
      mimeType: mime,
      sizeBytes: file.size,
      contentBase64,
      sortOrder: nextOrder,
    })
    .returning({
      id: visionImages.id,
      fileName: visionImages.fileName,
      sortOrder: visionImages.sortOrder,
    })

  return {
    id: row.id,
    fileName: row.fileName,
    sortOrder: row.sortOrder,
    src: `/api/vision/file/${row.id}`,
  }
}

export async function deleteVisionImage(id: string): Promise<void> {
  const { eq } = await import('drizzle-orm')
  await db.delete(visionImages).where(eq(visionImages.id, id))
}
