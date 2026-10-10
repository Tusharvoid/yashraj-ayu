'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import ServiceVisual from '@/components/services/ServiceVisual'
import { ORDERED_SERVICES, SERVICE_CATEGORIES } from '@/lib/utils'

export default function ServicesSection({
  featured = false,
}: {
  featured?: boolean
}) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const featuredServices = SERVICE_CATEGORIES.slice(0, 6).flatMap((category) =>
    ORDERED_SERVICES.filter(
      (service) => service.category === category.id,
    ).slice(0, 1),
  )
  const services = featured
    ? featuredServices
    : ORDERED_SERVICES.filter(
        (service) =>
          (filter === 'all' || service.category === filter) &&
          (service.name + ' ' + service.summary)
            .toLowerCase()
            .includes(search.toLowerCase().trim()),
      )
  return (
    <section className="clinic-section clinic-section-alt" id="care">
      <div className="clinic-container">
        {featured ? (
          <div className="clinic-section-heading">
            <div>
              <p className="clinic-eyebrow">Ways we can help</p>
              <h2 className="clinic-display">Care for every chapter.</h2>
            </div>
            <div>
              <p className="clinic-lead">
                Explore the support that feels right for you. We’ll help you
                find the next step.
              </p>
              <Link href="/services" className="clinic-text-link">
                View all services <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="clinic-catalog-top">
              <h2 className="clinic-display">Find your care.</h2>
              <label className="clinic-search">
                <Search size={18} />
                <span className="sr-only">Search services</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search treatments & services"
                />
              </label>
            </div>
            <div className="clinic-filters" aria-label="Filter services">
              <button
                type="button"
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All services
              </button>
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  aria-pressed={filter === category.id}
                  onClick={() => setFilter(category.id)}
                >
                  {category.eyebrow}
                </button>
              ))}
            </div>
            <p className="clinic-result-count" role="status">
              {services.length} service{services.length === 1 ? '' : 's'} found
            </p>
          </>
        )}
        <div className="clinic-service-grid">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={'/services/' + service.slug}
              className="clinic-service-card"
            >
              <div className="clinic-service-visual">
                <ServiceVisual
                  service={service}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[8/5] w-full"
                />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="clinic-service-copy">
                <p className="clinic-eyebrow">{service.tag}</p>
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
                <div className="clinic-service-link">
                  Explore this service <ArrowUpRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {!services.length && (
          <div className="clinic-empty">
            <h3>No matching services</h3>
            <p>Try another phrase or browse all services.</p>
            <button
              className="clinic-button clinic-button-outline"
              onClick={() => {
                setFilter('all')
                setSearch('')
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
