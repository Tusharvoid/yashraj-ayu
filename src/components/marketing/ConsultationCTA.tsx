import Link from 'next/link'
import { ArrowUpRight, Phone } from 'lucide-react'
import { PRIMARY_CLINIC_PHONE_HREF } from '@/lib/clinic'

export default function ConsultationCTA() {
  return (
    <section className="clinic-cta">
      <div className="clinic-container clinic-cta-inner">
        <div>
          <p className="clinic-eyebrow">Your next chapter</p>
          <h2>
            Good care starts
            <br />
            with a conversation.
          </h2>
          <p>Visit us in Calangute or ask about an online consultation.</p>
        </div>
        <div className="clinic-actions">
          <Link className="clinic-button" href="/book">
            Book a consultation <ArrowUpRight size={17} />
          </Link>
          <a
            className="clinic-button clinic-button-outline"
            href={'tel:' + PRIMARY_CLINIC_PHONE_HREF}
          >
            <Phone size={16} /> Call the clinic
          </a>
        </div>
      </div>
    </section>
  )
}
