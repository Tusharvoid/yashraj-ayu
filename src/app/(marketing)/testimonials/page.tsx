import { Star, ArrowUpRight, MessageCircle } from 'lucide-react'
import { getTestimonials } from '@/lib/testimonials'
import { PRIMARY_CLINIC_MAP_OPEN_URL } from '@/lib/clinic'
import PageIntro from '@/components/marketing/PageIntro'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  const reviews = testimonials.source === 'google' ? testimonials.items : []
  return (
    <>
      <PageIntro
        eyebrow="Patient stories"
        title="Care, in their own words."
        description="Every experience is personal. Read feedback shared by people who have visited Yashraj Clinic."
      />
      <section className="clinic-section">
        <div className="clinic-container">
          {reviews.length ? (
            <>
              <div className="clinic-section-heading">
                <div>
                  <p className="clinic-eyebrow">From Google reviews</p>
                  <h2 className="clinic-display">Experiences that matter.</h2>
                </div>
                <a
                  href={
                    testimonials.googleMapsUri ?? PRIMARY_CLINIC_MAP_OPEN_URL
                  }
                  className="clinic-text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read reviews on Google <ArrowUpRight size={17} />
                </a>
              </div>
              <div className="clinic-review-grid">
                {reviews.map((review, index) => (
                  <article
                    key={review.name + index}
                    className="clinic-review-card"
                  >
                    <div
                      className="flex gap-1 text-primary"
                      aria-label={review.stars + ' out of 5 stars'}
                    >
                      {Array.from({ length: review.stars }, (_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <blockquote>“{review.text}”</blockquote>
                    <footer>
                      <strong className="font-medium">{review.name}</strong>
                      <span>{review.location}</span>
                    </footer>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="clinic-empty">
              <MessageCircle size={32} className="mx-auto mb-5 text-primary" />
              <h2 className="clinic-display">Every experience has a story.</h2>
              <p>
                Visit our Google listing to read patient feedback or share your
                own experience with the clinic.
              </p>
              <a
                href={PRIMARY_CLINIC_MAP_OPEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="clinic-button"
              >
                Explore patient reviews <ArrowUpRight size={17} />
              </a>
            </div>
          )}
          <p className="mt-8 text-xs text-muted">
            Individual experiences vary. Patient feedback is not a guarantee of
            treatment outcomes.
          </p>
        </div>
      </section>
      <ConsultationCTA />
    </>
  )
}
