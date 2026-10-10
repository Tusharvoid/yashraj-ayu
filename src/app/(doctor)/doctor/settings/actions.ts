'use server'

import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateSiteSettings(formData: FormData) {
  const enabled = formData.get('videoPopupEnabled') === 'true' || formData.get('videoPopupEnabled') === 'on'
  const url = formData.get('videoPopupUrl') as string

  // Fetch existing setting (assuming id '1' or we just update the first row we find, or we create one)
  const existing = await db.select().from(siteSettings).limit(1)

  if (existing.length > 0) {
    await db.update(siteSettings)
      .set({
        videoPopupEnabled: enabled,
        videoPopupUrl: url || null,
        updatedAt: new Date()
      })
      .where(eq(siteSettings.id, existing[0].id))
  } else {
    await db.insert(siteSettings).values({
      videoPopupEnabled: enabled,
      videoPopupUrl: url || null,
    })
  }

  revalidatePath('/doctor/settings')
  revalidatePath('/', 'layout') // Revalidate marketing site so the layout picks up the new setting
}
