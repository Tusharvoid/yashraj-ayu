'use client'

import { useTransition } from 'react'
import { updateSiteSettings } from './actions'

type SiteSetting = {
  videoPopupEnabled: boolean
  videoPopupUrl: string | null
}

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSetting | null }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateSiteSettings(formData)
      alert('Settings saved successfully!')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-border shadow-sm max-w-2xl space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-charcoal">Marketing Site Video Popup</h2>
          <p className="text-sm text-muted">Configure the video popup that appears for first-time visitors.</p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="videoPopupEnabled" 
            name="videoPopupEnabled" 
            defaultChecked={initialSettings?.videoPopupEnabled}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="videoPopupEnabled" className="text-sm font-medium text-charcoal">
            Enable Video Popup
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="videoPopupUrl" className="block text-sm font-medium text-charcoal">
            Video Embed URL
          </label>
          <input
            type="url"
            id="videoPopupUrl"
            name="videoPopupUrl"
            defaultValue={initialSettings?.videoPopupUrl || ''}
            placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
            className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-charcoal placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted">
            Provide the embed URL for the video (e.g. YouTube or Vimeo embed link).
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
