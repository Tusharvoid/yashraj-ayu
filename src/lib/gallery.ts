import type { Dirent } from 'node:fs'
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const galleryUploadDir = path.join(process.cwd(), 'public', 'gallery', 'uploads')
const uploadUrlPrefix = '/gallery/uploads'
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const legacyGalleryItems = [
  { src: '/img1.jpeg', caption: 'Dr. Bhusanar with a visitor', order: 1 },
  { src: '/img2.jpeg', caption: 'Consultation Room', order: 2 },
  { src: '/img3.jpeg', caption: 'Blood pressure assessment', order: 3 },
  { src: '/img4.jpeg', caption: 'A consultation at Yashraj Clinic', order: 4 },
  { src: '/img5.jpeg', caption: 'From the clinic', order: 5 },
  { src: '/img6.jpeg', caption: 'Relaxation Room', order: 6 },
  { src: '/img7.jpeg', caption: 'Treatment Lobby', order: 7 },
  { src: '/img8.jpeg', caption: 'Dr. Bhusanar during a consultation', order: 8 },
  { src: '/img9.jpeg', caption: 'Clinic Exterior', order: 9 },
  { src: '/img10.jpeg', caption: 'Consultation notes and patient discussion', order: 10 },
  { src: '/img11.jpeg', caption: 'Natural Light Therapy Room', order: 11 },
  { src: '/img12.jpeg', caption: 'Recovery Suite', order: 12 },
] as const

export type GalleryItem = {
  id: string
  src: string
  alt: string
  caption: string
  createdAt: string
  source: 'legacy' | 'upload'
}

function titleize(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, character => character.toUpperCase())
}

function sanitizeBaseName(value: string) {
  return value
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'gallery-image'
}

async function ensureGalleryUploadDir() {
  await mkdir(galleryUploadDir, { recursive: true })
}

async function getUploadedGalleryItems(): Promise<GalleryItem[]> {
  let fileEntries: Dirent[]
  try {
    fileEntries = (await readdir(galleryUploadDir, { withFileTypes: true })).filter(entry => entry.isFile())
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = String((error as { code?: string }).code)
      if (code === 'ENOENT' || code === 'ENOTDIR' || code === 'EROFS') {
        return []
      }
    }

    throw error
  }

  const items: Array<GalleryItem | null> = await Promise.all(fileEntries.map(async entry => {
    const extension = path.extname(entry.name).toLowerCase()
    if (!supportedExtensions.has(extension)) {
      return null
    }

    const absolutePath = path.join(galleryUploadDir, entry.name)
    const fileStats = await stat(absolutePath)
    const fileNameWithoutExtension = entry.name.slice(0, -extension.length)
    const caption = titleize(fileNameWithoutExtension.replace(/^\d{8,}-/, ''))

    return {
      id: `upload-${fileNameWithoutExtension}`,
      src: `${uploadUrlPrefix}/${entry.name}`,
      alt: `Yashraj Clinic — ${caption}`,
      caption,
      createdAt: fileStats.mtime.toISOString(),
      source: 'upload' as const,
    }
  }))

  return items
    .filter((item): item is GalleryItem => Boolean(item))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

function getLegacyGalleryItems(): GalleryItem[] {
  return legacyGalleryItems.map(item => ({
    id: `legacy-${item.order}`,
    src: item.src,
    alt: `Yashraj Clinic — ${item.caption}`,
    caption: item.caption,
    createdAt: new Date(Date.UTC(2025, 0, item.order)).toISOString(),
    source: 'legacy',
  }))
}

export async function getAllGalleryItems() {
  const uploads = await getUploadedGalleryItems()
  return [...uploads, ...getLegacyGalleryItems()]
}

export async function getGalleryPage(offset = 0, limit = 8) {
  const allItems = await getAllGalleryItems()
  const items = allItems.slice(offset, offset + limit)

  return {
    items,
    total: allItems.length,
    nextOffset: offset + items.length,
    hasMore: offset + items.length < allItems.length,
  }
}

export async function saveGalleryImages(files: File[]) {
  try {
    await ensureGalleryUploadDir()
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = String((error as { code?: string }).code)
      if (code === 'EROFS' || code === 'EACCES' || code === 'EPERM') {
        throw new Error('Gallery uploads are not available on this server storage.')
      }
    }

    throw error
  }

  const savedItems: GalleryItem[] = []

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      continue
    }

    const extension = path.extname(file.name).toLowerCase()
    const normalizedExtension = supportedExtensions.has(extension) ? extension : '.jpg'
    const timestamp = Date.now()
    const baseName = sanitizeBaseName(file.name)
    const fileName = `${timestamp}-${baseName}${normalizedExtension}`
    const absolutePath = path.join(galleryUploadDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      await writeFile(absolutePath, buffer)
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = String((error as { code?: string }).code)
        if (code === 'EROFS' || code === 'EACCES' || code === 'EPERM') {
          throw new Error('Gallery uploads are not available on this server storage.')
        }
      }

      throw error
    }

    savedItems.push({
      id: `upload-${fileName}`,
      src: `${uploadUrlPrefix}/${fileName}`,
      alt: `Yashraj Clinic — ${titleize(baseName)}`,
      caption: titleize(baseName),
      createdAt: new Date(timestamp).toISOString(),
      source: 'upload',
    })
  }

  return savedItems
}
