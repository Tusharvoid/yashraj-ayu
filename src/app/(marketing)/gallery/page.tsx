import PublicGalleryFeed from '@/components/gallery/PublicGalleryFeed'
import { getGalleryPage } from '@/lib/gallery'
import PageIntro from '@/components/marketing/PageIntro'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'

export const dynamic = 'force-dynamic'
export default async function GalleryPage() {
  const initialGallery = await getGalleryPage(0, 8)
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
            initialItems={initialGallery.items}
            initialNextOffset={initialGallery.nextOffset}
            initialHasMore={initialGallery.hasMore}
          />
        </div>
      </section>
      <ConsultationCTA />
    </>
  )
}
