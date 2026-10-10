import PublicGalleryFeed from '@/components/gallery/PublicGalleryFeed'
import { getAllGalleryItems } from '@/lib/gallery'
import { connection } from 'next/server'
import PageIntro from '@/components/marketing/PageIntro'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'

export default async function GalleryPage() {
  const staticBuild = process.env.YASHRAJ_STATIC_BUILD === '1'
  if (!staticBuild) await connection()
  const allItems = await getAllGalleryItems()
  const initialItems = allItems.slice(0, 8)
  return (
    <>
      <PageIntro
        eyebrow="Gallery"
        title="A closer look at care."
        description="Explore moments from the clinic, our treatment spaces and the people who make Yashraj feel personal."
      />
      <section className="clinic-section">
        <div className="clinic-container">
          <PublicGalleryFeed
            initialItems={initialItems}
            initialNextOffset={initialItems.length}
            initialHasMore={allItems.length > initialItems.length}
            staticItems={staticBuild ? allItems : undefined}
          />
        </div>
      </section>
      <ConsultationCTA />
    </>
  )
}
