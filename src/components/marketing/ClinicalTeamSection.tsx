import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CLINICAL_TEAM, PRIMARY_DOCTOR } from '@/lib/clinic'

const [leadDoctor, ...supportingDoctors] = CLINICAL_TEAM

export default function ClinicalTeamSection() {
  return (
    <section className="bg-surface py-20">
      <div className="clinic-container">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-primary/15 bg-panel px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
            Our Clinical Team
          </span>
          <h2 className="mt-5 text-3xl font-semibold text-charcoal sm:text-4xl">
            Specialists and supporting clinicians connected to your care.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            Yashraj Clinic works with a wider medical network across general
            medicine, surgery, gynaecology, orthopaedics, diagnostics,
            physiotherapy, homoeopathy, dentistry, and yoga so patients can
            continue care with the right expertise when needed.
          </p>
        </div>

        <div className="mt-12 mb-12 rounded-lg border border-border bg-panel p-3 shadow-sm sm:p-4 lg:p-5">
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10 lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-surface">
              <Image
                src={leadDoctor.image}
                alt={leadDoctor.name}
                fill
                sizes="(min-width: 1024px) 320px, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col justify-center px-2 pb-4 sm:px-4 sm:pb-6 lg:pb-0 lg:pr-8">
              <div className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                Lead Doctor
              </div>
              <h3 className="mt-3 text-3xl font-semibold text-charcoal sm:text-4xl">
                {PRIMARY_DOCTOR.name}
              </h3>
              <p className="mt-2 text-base font-medium text-primary">
                {leadDoctor.role}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
                {PRIMARY_DOCTOR.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  'Sexology',
                  'Sexual Health',
                  'Fertility Guidance',
                  'Patient-first Consultations',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-charcoal"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/book">Book an Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supportingDoctors.map((member) => (
            <article
              key={member.name}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square bg-surface">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl leading-tight text-charcoal">
                  {member.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
