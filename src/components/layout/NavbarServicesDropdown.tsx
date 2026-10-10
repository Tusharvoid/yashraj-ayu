'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  Activity, 
  Users, 
  Baby, 
  HeartHandshake, 
  Leaf,
  ChevronDown
} from 'lucide-react'
import { SERVICE_CATEGORIES, getServicesByCategory, type ServiceCategory } from '@/lib/utils'

// Mapping categories to specific icons
const categoryIcons: Record<ServiceCategory, React.ElementType> = {
  'sexual-health-men': Activity,
  'sexual-health-women': HeartHandshake,
  'male-fertility': Users,
  'female-fertility': Baby,
  'couple-care': HeartHandshake,
  'infection-screening': Activity,
  'lifestyle-wellness': Leaf,
}

export function NavbarServicesDropdown() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(SERVICE_CATEGORIES[0].id)
  
  // Get services for active category
  const activeServices = getServicesByCategory(activeCategory)

  return (
    <div className="relative group/nav-item">
      <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-charcoal transition-colors hover:text-primary py-5">
        Services <ChevronDown className="h-4 w-4 transition-transform group-hover/nav-item:rotate-180" />
      </Link>
      
      {/* Dropdown Container */}
      <div className="absolute left-1/2 top-full z-50 hidden w-[800px] max-w-[94vw] -translate-x-1/2 pt-2 group-hover/nav-item:block">
        <div className="flex overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_20px_40px_-20px_rgba(28,28,28,0.15)] ring-1 ring-black/5">
          
          {/* Left Sidebar: Categories */}
          <div className="w-1/3 bg-surface/40 p-4 border-r border-border">
            <div className="mb-4 px-3 text-xs font-semibold tracking-[0.15em] text-accent uppercase">
              Main Categories
            </div>
            <div className="flex flex-col space-y-1">
              {SERVICE_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category.id]
                const isActive = activeCategory === category.id

                return (
                  <button
                    key={category.id}
                    onMouseEnter={() => setActiveCategory(category.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                      isActive 
                        ? 'bg-white shadow-sm ring-1 ring-primary/20' 
                        : 'hover:bg-black/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-primary/10 text-primary' : 'bg-black/5 text-muted group-hover:bg-black/10 group-hover:text-charcoal'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        isActive ? 'text-primary' : 'text-charcoal group-hover:text-primary'
                      }`}>
                        {category.eyebrow}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="text-primary"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 px-3">
              <Link href="/services" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                View all services <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Sub-services */}
          <div className="w-2/3 bg-white p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-full"
              >
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-charcoal">
                    {SERVICE_CATEGORIES.find(c => c.id === activeCategory)?.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {SERVICE_CATEGORIES.find(c => c.id === activeCategory)?.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {activeServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="group flex flex-col justify-center rounded-xl border border-transparent bg-surface/30 p-4 transition-all duration-200 hover:scale-[1.02] hover:border-primary/20 hover:bg-white hover:shadow-md"
                    >
                      <div className="text-sm font-semibold text-charcoal group-hover:text-primary transition-colors line-clamp-1">
                        {service.name}
                      </div>
                      <div className="mt-1 text-xs text-muted line-clamp-2">
                        {service.summary}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  )
}
