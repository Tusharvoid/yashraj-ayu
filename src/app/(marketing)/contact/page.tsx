import Link from 'next/link'
import { ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import PageIntro from '@/components/marketing/PageIntro'
import {
  CLINIC_STREET_ADDRESS,
  CLINIC_PHONES,
  PRIMARY_CLINIC_EMAIL,
  PRIMARY_CLINIC_MAP_OPEN_URL,
  PRIMARY_CLINIC_WHATSAPP_URL,
  PRIMARY_CLINIC_PHONE_HREF,
} from '@/lib/clinic'

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Visit us"
        title="We’re here when you need us."
        description="Have a question, planning a visit, or joining us from outside Goa? Start a conversation with the clinic."
      />
      <section className="clinic-section">
        <div className="clinic-container clinic-contact-grid">
          <div className="clinic-contact-panel">
            <p className="clinic-eyebrow">Calangute · Goa</p>
            <h2>A place for personal care.</h2>
            <address>{CLINIC_STREET_ADDRESS}</address>
            <a
              href={PRIMARY_CLINIC_MAP_OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="clinic-button"
            >
              Get directions <ArrowUpRight size={18} />
            </a>
            <p className="clinic-body-copy">
              Please contact the clinic to confirm your appointment and your
              doctor’s availability before travelling.
            </p>
            <Link href="/book" className="clinic-text-link">
              Plan your appointment <ArrowUpRight size={17} />
            </Link>
          </div>
          <div>
            <div className="clinic-contact-row">
              <h2>Call the clinic</h2>
              {CLINIC_PHONES.map((phone) => (
                <a key={phone} href={'tel:' + phone.replace(/\s/g, '')}>
                  {phone}
                </a>
              ))}
            </div>
            <div className="clinic-contact-row">
              <h2>Email us</h2>
              <a href={'mailto:' + PRIMARY_CLINIC_EMAIL}>
                {PRIMARY_CLINIC_EMAIL}
              </a>
            </div>
            <div className="clinic-contact-row">
              <h2>Care from wherever you are</h2>
              <p className="text-muted">
                Ask about online consultations and follow-up appointments.
              </p>
            </div>
            <div className="clinic-actions">
              <a
                href={PRIMARY_CLINIC_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="clinic-button"
              >
                <MessageCircle size={17} /> WhatsApp us
              </a>
              <a
                href={'tel:' + PRIMARY_CLINIC_PHONE_HREF}
                className="clinic-button clinic-button-outline"
              >
                <Phone size={17} /> Call now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
