import BookingForm from '@/components/booking/BookingForm'
import PageIntro from '@/components/marketing/PageIntro'
import { PRIMARY_CLINIC_PHONE_HREF } from '@/lib/clinic'
import { Phone } from 'lucide-react'

export const metadata = { title: 'Book a consultation — Yashraj Clinic' }
export default function BookPage() {
  return (
    <>
      <PageIntro
        eyebrow="Appointments"
        title="Let’s take the first step."
        description="Choose your consultation, date and preferred time, then send your request on WhatsApp. The clinic will reply to confirm availability."
      />
      <section className="clinic-section">
        <div className="clinic-container clinic-booking-grid">
          <aside className="clinic-booking-aside">
            <p className="clinic-eyebrow">Your visit, made simple</p>
            <h2 className="mt-4">
              A conversation.
              <br />A plan.
              <br />A way forward.
            </h2>
            <p>
              Bring any relevant reports and a list of your current medicines to
              your consultation.
            </p>
            <p>
              Choose an in-clinic visit or online consultation in the form.
              Your details will be added to a WhatsApp message for you to review
              and send. No appointment is confirmed until the clinic replies.
            </p>
            <a
              className="clinic-text-link"
              href={'tel:' + PRIMARY_CLINIC_PHONE_HREF}
            >
              <Phone size={16} /> Need help booking? Call us
            </a>
          </aside>
          <div>
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  )
}
