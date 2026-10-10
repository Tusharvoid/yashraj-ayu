import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { visionImages } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const rows = await db
    .select({
      fileName: visionImages.fileName,
      mimeType: visionImages.mimeType,
      contentBase64: visionImages.contentBase64,
    })
    .from(visionImages)
    .where(eq(visionImages.id, id))
    .limit(1)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { fileName, mimeType, contentBase64 } = rows[0]
  const buffer = Buffer.from(contentBase64, 'base64')

  return new Response(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
