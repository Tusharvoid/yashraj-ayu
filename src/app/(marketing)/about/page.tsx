import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import PageIntro from '@/components/marketing/PageIntro'
import ConsultationCTA from '@/components/marketing/ConsultationCTA'
import { PRIMARY_DOCTOR } from '@/lib/clinic'

const qualifications = [
  'Bachelor of Ayurvedic Medicine & Surgery (B.A.M.S)',
  'Sexologist · Ayurvedacharya',
  'Diploma in Sex Therapy & Counselling',
]
export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our story"
        title="Personal attention. Clear guidance."
        description="A clinic in Calangute with a personal approach to health, practical guidance and thoughtful follow-up."
      />
      <section className="clinic-section">
        <div className="clinic-container clinic-story-grid">
          <div>
            <p className="clinic-eyebrow">The person behind the practice</p>
            <h2 className="clinic-display">{PRIMARY_DOCTOR.name}</h2>
            <p className="clinic-lead">B.A.M.S · Sexologist · Ayurvedacharya</p>
            <p className="clinic-body-copy">
              Yashraj Clinic was founded by Dr. Raju Bhusanar to bring
              accessible reproductive and sexual health care to local residents
              and visitors to Goa.
            </p>
            <p className="clinic-body-copy">
              Alongside reproductive and sexual health consultations, the clinic
              supports general consultations, blood test follow-up and online
              appointments where suitable. The starting point is always a
              conversation about you.
            </p>
            <p className="clinic-body-copy">
              The clinic also offers homeopathic consultations and medicines.
              Patients can discuss their concerns and available options with
              the homeopathy practitioner during an individual consultation.
            </p>
            <ul className="mt-7 space-y-3">
              {qualifications.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <Check size={17} className="mt-1 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/doctors" className="clinic-text-link">
              Meet the wider clinical team <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="clinic-founder-photo">
            <Image
              src={PRIMARY_DOCTOR.image}
              alt={PRIMARY_DOCTOR.name}
              fill
              sizes="(min-width: 900px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>
      <section className="clinic-section clinic-section-alt">
        <div className="clinic-container">
          <p className="clinic-eyebrow">What guides us</p>
          <h2 className="clinic-display">A more personal kind of care.</h2>
          <div className="clinic-steps mt-10">
            {[
              [
                'See the whole person',
                'Your health history, routine and concerns are all part of the conversation.',
              ],
              [
                'Make things clear',
                'Understand the assessments, options and next steps in your care.',
              ],
              [
                'Keep the connection',
                'Build on each consultation with practical guidance and follow-up.',
              ],
            ].map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </>
  )
}
