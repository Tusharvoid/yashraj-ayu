import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  ClipboardCheck,
  Stethoscope,
  Video,
  HeartHandshake,
} from 'lucide-react'
import ServicesSection from '@/components/marketing/ServicesSection'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'
import { PRIMARY_DOCTOR } from '@/lib/clinic'

export const metadata = {
  title: 'Yashraj Clinic — Fertility & Sexual Health',
  alternates: { canonical: '/clinic' },
  openGraph: { url: '/clinic' },
}

const steps = [
  [
    'A conversation first',
    'Tell us what brings you here. We take time to understand your concerns, history and everyday life.',
  ],
  [
    'A plan, made for you',
    'Your clinician explains the next steps, from assessments and reports to treatment options and practical guidance.',
  ],
  [
    'Care that continues',
    'Continue with follow-up consultations and review your progress with the clinic, in person or online where suitable.',
  ],
]
const care = [
  { icon: Stethoscope, label: 'Doctor-led care' },
  { icon: HeartHandshake, label: 'Personal attention' },
  { icon: ClipboardCheck, label: 'Clear next steps' },
  { icon: Video, label: 'Clinic & online' },
]

export default function HomePage() {
  return (
    <>
      <section className="clinic-hero">
        <div className="clinic-hero-content">
          <p className="clinic-eyebrow">
            Fertility · Sexual health · General care
          </p>
          <h1>
            Your health.
            <br />
            <em>Your future.</em>
          </h1>
          <p className="clinic-hero-description">
            Personal care for fertility, sexual health and everyday medical
            concerns. Talk through your questions, understand your options and
            plan your next step at Yashraj Clinic, Calangute.
          </p>
          <div className="clinic-actions">
            <Link href="/book" className="clinic-button">
              Book a consultation <ArrowUpRight size={18} />
            </Link>
            <Link
              href="/services"
              className="clinic-button clinic-button-outline"
            >
              Explore our care
            </Link>
          </div>
          <p className="clinic-hero-note">
            In-clinic visits & online consultations
          </p>
        </div>
        <figure className="clinic-hero-media">
          <div className="clinic-hero-portrait">
            <Image
              src={PRIMARY_DOCTOR.image}
              alt="Dr. Raju Bhusanar at Yashraj Clinic"
              fill
              sizes="(min-width: 420px) 380px, calc(100vw - 40px)"
              preload
              className="clinic-hero-image"
            />
          </div>
          <figcaption className="clinic-hero-caption">
            <p className="clinic-eyebrow">Meet your doctor</p>
            <Link href="/about" className="clinic-hero-doctor-link">
              <span>{PRIMARY_DOCTOR.name}</span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </Link>
            <p className="clinic-hero-credentials">{PRIMARY_DOCTOR.title}</p>
          </figcaption>
        </figure>
      </section>
      <div className="clinic-care-strip">
        <div className="clinic-container">
          {care.map(({ icon: Icon, label }) => (
            <div key={label}>
              <Icon size={21} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <section className="clinic-section">
        <div className="clinic-container clinic-story-grid">
          <div className="clinic-story-image">
            <Image
              src="/img10.jpeg"
              alt="Dr. Raju Bhusanar reviewing consultation notes with a patient at Yashraj Clinic"
              fill
              sizes="(min-width: 900px) 48vw, 100vw"
            />
            <span>Personal attention, at every appointment.</span>
          </div>
          <div>
            <p className="clinic-eyebrow">Welcome to Yashraj</p>
            <h2 className="clinic-display">
              A little more time.
              <br />
              <em>A lot more understanding.</em>
            </h2>
            <p className="clinic-lead">
              Health is personal. Your care should be, too.
            </p>
            <p className="clinic-body-copy">
              From fertility and sexual health to diagnostic support and general
              consultations, we help you understand your options and take the
              next step with clarity.
            </p>
            <p className="clinic-body-copy">
              Homeopathic consultations and medicines are also available at the
              clinic following an individual consultation.
              {' '}<Link href="/services/homeopathy-consultation" className="text-primary underline underline-offset-4">Explore homeopathic care</Link>.
            </p>
            <div className="clinic-signature">
              <Image src={PRIMARY_DOCTOR.image} alt="" width={54} height={54} />
              <div>
                <strong>{PRIMARY_DOCTOR.name}</strong>
                <span>B.A.M.S · Sexologist</span>
              </div>
            </div>
            <Link href="/about" className="clinic-text-link">
              Get to know the clinic <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <ServicesSection featured />
      <section className="clinic-section">
        <div className="clinic-container">
          <div className="clinic-section-heading">
            <div>
              <p className="clinic-eyebrow">Simple, considered, personal</p>
              <h2 className="clinic-display">Your care, step by step.</h2>
            </div>
            <p className="clinic-lead">
              From your first question to your next appointment, know what comes
              next.
            </p>
          </div>
          <div className="clinic-steps">
            {steps.map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="clinic-quote-band">
        <div className="clinic-container">
          <p className="clinic-eyebrow">Questions about your health?</p>
          <h2 className="clinic-display">Start with a conversation.</h2>
          <p className="clinic-lead mx-auto">
            Fertility, sexual health or a general medical concern — we’re here
            to listen and help you understand the next steps.
          </p>
          <Link href="/vision" className="clinic-text-link">
            Explore our vision <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="clinic-section">
        <div className="clinic-container clinic-discover-grid">
          <div>
            <p className="clinic-eyebrow">A closer look</p>
            <h2 className="clinic-display">
              Know the people.
              <br />
              Feel at ease.
            </h2>
          </div>
          <Link href="/testimonials" className="clinic-discover-link">
            <span>01</span>
            <div>
              <h3>Patient stories</h3>
              <p>Explore feedback and experiences of care.</p>
            </div>
            <ArrowUpRight />
          </Link>
          <Link href="/doctors" className="clinic-discover-link">
            <span>02</span>
            <div>
              <h3>Meet our doctors</h3>
              <p>The people connected to your care.</p>
            </div>
            <ArrowUpRight />
          </Link>
        </div>
      </section>
      <ConsultationCTA />
    </>
  )
}
