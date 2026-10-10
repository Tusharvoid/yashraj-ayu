import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ServiceVisual from '@/components/services/ServiceVisual'
import {
  ORDERED_SERVICES,
  getCareModeMeta,
  getCategoryMeta,
  getRelatedServices,
  getServiceBySlug,
} from '@/lib/utils'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const category = getCategoryMeta(service.category)
  const careModes = service.careModes
    .map((mode) => getCareModeMeta(mode))
    .filter((mode): mode is NonNullable<ReturnType<typeof getCareModeMeta>> =>
      Boolean(mode),
    )
  const relatedServices = getRelatedServices(service.slug)

  return (
    <div>
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center lg:px-8">
          <div>
            <div className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {category?.eyebrow}
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-charcoal sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
              {service.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {service.careModes.map((mode) => {
                const meta = getCareModeMeta(mode)
                return (
                  <span
                    key={mode}
                    className="rounded-full border border-border bg-panel px-3 py-1.5 text-sm text-charcoal"
                  >
                    {meta?.title ?? mode}
                  </span>
                )
              })}
            </div>

            <div className="clinic-actions">
              <Link href="/book" className="clinic-button">
                Arrange a consultation <ArrowRight size={17} />
              </Link>
              <Link
                href="/services"
                className="clinic-button clinic-button-outline"
              >
                All services
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-panel p-4 shadow-[0_18px_40px_-34px_rgba(28,28,28,0.35)]">
            <ServiceVisual
              service={service}
              sizes="(min-width: 1024px) 480px, 100vw"
              className="aspect-[4/3] w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold text-charcoal">
                  Who This Service Is For
                </h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.whoItsFor.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-border bg-panel p-4 text-sm leading-6 text-muted"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-semibold text-charcoal">
                    Expected Benefits
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {service.benefits.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-muted"
                      >
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-charcoal">
                    Common Symptoms &amp; Situations
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {service.concerns.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-muted"
                      >
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {service.conditionGroups?.length ? (
                <section>
                  <h2 className="text-2xl font-semibold text-charcoal">
                    Conditions We Commonly Discuss
                  </h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {service.conditionGroups.map((group) => (
                      <Card
                        key={group.title}
                        className="rounded-lg border border-border bg-panel shadow-none"
                      >
                        <CardContent className="p-5">
                          <h3 className="text-sm font-semibold text-charcoal">
                            {group.title}
                          </h3>
                          <ul className="mt-4 space-y-2">
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-sm leading-6 text-muted"
                              >
                                <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ) : null}

              {service.detailSections?.length ? (
                <section>
                  <h2 className="text-2xl font-semibold text-charcoal">
                    Detailed Guidance
                  </h2>
                  <div className="mt-6 space-y-4">
                    {service.detailSections.map((section) => (
                      <Card
                        key={section.title}
                        className="rounded-lg border border-border bg-surface/50 shadow-none"
                      >
                        <CardContent className="p-5">
                          <h3 className="text-base font-semibold text-charcoal">
                            {section.title}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-muted">
                            {section.body}
                          </p>
                          {section.items?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {section.items.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-medium text-charcoal"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ) : null}

              <section>
                <h2 className="text-2xl font-semibold text-charcoal">
                  Available Care Modes
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {careModes.map((mode) => (
                    <Card
                      key={mode.id}
                      className="rounded-lg border border-border bg-surface/70 shadow-none"
                    >
                      <CardContent className="p-5">
                        <div className="text-sm font-semibold text-charcoal">
                          {mode.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {mode.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-lg border border-border bg-surface p-6">
                <div className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  Book This Service
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-charcoal">
                  Start with a consultation and receive the right plan.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Dr. Bhusanar can guide whether this service fits your concern
                  directly or whether another care path should come first.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 h-auto w-full whitespace-normal rounded-[1.25rem] py-3.5 text-center leading-snug"
                >
                  <Link href="/book">Book {service.name}</Link>
                </Button>
              </div>

              {relatedServices.length > 0 && (
                <div className="rounded-lg border border-border bg-panel p-6">
                  <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                    Related Services
                  </div>
                  <div className="mt-4 space-y-3">
                    {relatedServices.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/services/${related.slug}`}
                        className="flex items-start justify-between gap-3 rounded-[1.1rem] border border-border px-4 py-3 text-sm transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        <div>
                          <div className="font-semibold text-charcoal">
                            {related.name}
                          </div>
                          <div className="mt-1 text-muted">
                            {related.summary}
                          </div>
                        </div>
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateStaticParams() {
  return ORDERED_SERVICES.map((service) => ({ slug: service.slug }))
}
