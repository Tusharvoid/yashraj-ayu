import { getVisionImages } from '@/lib/vision'
import VisionSlideshow from '@/components/vision/VisionSlideshow'
import PageIntro from '@/components/marketing/PageIntro'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'

export const dynamic = 'force-dynamic'
export default async function VisionPage() {
  const images = await getVisionImages()
  return (
    <>
      <PageIntro
        eyebrow="Our vision"
        title="Wellbeing, with a wider perspective."
        description="Care that begins with understanding the individual and continues through practical guidance, personal attention and follow-up."
      />
      <section className="clinic-section">
        <div className="clinic-container">
          {images.length ? (
            <VisionSlideshow images={images} />
          ) : (
            <div className="clinic-steps">
              {[
                [
                  'Listen first',
                  'Give each person space to share their story and ask questions.',
                ],
                [
                  'Guide clearly',
                  'Help patients understand their care and make informed choices.',
                ],
                [
                  'Care together',
                  'Connect the right people and support around each patient’s needs.',
                ],
              ].map(([title, description], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h2 className="text-2xl mt-4 mb-3">{title}</h2>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <ConsultationCTA />
    </>
  )
}
