'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SERVICE_CATEGORIES, getServicesByCategory } from '@/lib/utils'

export default function HeroServicesInteractive() {
  const [activeId, setActiveId] = useState<string | null>(SERVICE_CATEGORIES[0].id)

  return (
    <div className="mt-6 flex h-full min-h-0 flex-col">
      <div className="mb-4 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
        Explore Our Services
      </div>
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
        {SERVICE_CATEGORIES.map((category) => {
          const isActive = activeId === category.id
          const services = getServicesByCategory(category.id)

          return (
            <div 
              key={category.id} 
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? 'border-primary/20 bg-primary/5 shadow-sm' 
                  : 'border-border bg-white hover:border-primary/20 hover:bg-surface/50'
              }`}
            >
              <button
                onClick={() => setActiveId(isActive ? null : category.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className={`font-semibold transition-colors ${isActive ? 'text-primary' : 'text-charcoal'}`}>
                  {category.eyebrow}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 text-muted transition-transform duration-300 ${isActive ? 'rotate-180 text-primary' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-1">
                      <div className="flex flex-col gap-2 border-t border-primary/10 pt-3">
                        {services.map(service => (
                          <Link 
                            key={service.slug} 
                            href={`/services/${service.slug}`}
                            className="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white hover:shadow-sm"
                          >
                            <span className="text-sm font-medium text-charcoal group-hover:text-primary transition-colors line-clamp-1">
                              {service.name}
                            </span>
                            <ArrowRight className="h-3 w-3 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
