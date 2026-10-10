import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import SettingsForm from './SettingsForm'

export const metadata = {
  title: 'Settings - Yashraj Clinic',
}

export default async function SettingsPage() {
  let currentSettings = null
  try {
    const settings = await db.select().from(siteSettings).limit(1)
    currentSettings = settings.length > 0 ? settings[0] : null
  } catch (error) {
    console.warn('Failed to fetch site settings, proceeding with defaults:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Settings</h1>
          <p className="text-sm text-muted">Manage global configuration for the marketing site.</p>
        </div>
      </div>
      
      <SettingsForm initialSettings={currentSettings} />
    </div>
  )
}
