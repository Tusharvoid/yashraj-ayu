'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TestimonialItem } from '@/lib/testimonials'
import { cn } from '@/lib/utils'

export default function TestimonialSlider({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [items, setItems] = useState(testimonials)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [direction, setDirection] = useState(1) // 1 for next, -1 for prev

  // Only run on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMounted(true), 0)
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.clearTimeout(mountTimer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleNext = useCallback(() => {
    setDirection(1)
    setItems((prev) => {
      const newItems = [...prev]
      const first = newItems.shift()!
      newItems.push(first)
      return newItems
    })
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setItems((prev) => {
      const newItems = [...prev]
      const last = newItems.pop()!
      newItems.unshift(last)
      return newItems
    })
  }, [])

  useEffect(() => {
    if (isHovered || !mounted) return
    const timer = setInterval(handleNext, 5000)
    return () => clearInterval(timer)
  }, [isHovered, handleNext, mounted])

  if (!mounted) {
    return <div className="min-h-[400px] w-full" /> // Placeholder for SSR
  }

  const visibleCount = isMobile ? 1 : 3
  const visibleItems = items.slice(0, visibleCount)

  // Find original index of the active center item for pagination
  const activeCenterItem = isMobile ? items[0] : items[1]
  const activeOriginalIndex = testimonials.findIndex(t => t.name === activeCenterItem?.name)

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-stretch justify-center w-full min-h-[450px] sm:min-h-[350px] overflow-hidden pt-8 pb-12">
        <AnimatePresence mode="popLayout" custom={direction}>
          {visibleItems.map((item, index) => {
            const isCenter = isMobile ? true : index === 1

            return (
              <motion.div
                key={item.name + item.location}
                layout
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.9 }}
                animate={{ 
                  opacity: isCenter ? 1 : 0.4, 
                  x: 0, 
                  scale: isCenter ? 1.05 : 0.9,
                  zIndex: isCenter ? 10 : 0
                }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.9 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.35, 1] }}
                className={cn(
                  "w-full shrink-0 px-3 md:px-4",
                  isMobile ? "max-w-md" : "lg:w-1/3"
                )}
              >
                <Card className={cn(
                  "h-full group border-border bg-white transition-all duration-500 rounded-[1.75rem] overflow-hidden",
                  "hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(28,28,28,0.12)]",
                  isCenter ? "shadow-[0_10px_30px_-15px_rgba(28,28,28,0.08)] border-primary/20" : ""
                )}>
                  <CardContent className="p-8 lg:p-10 flex flex-col h-full">
                    <div className="flex gap-1 mb-6">
                      {Array(item.stars).fill(0).map((_, j) => (
                        <Star key={j} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-base lg:text-lg text-charcoal/80 italic mb-8 leading-relaxed flex-grow">
                      &ldquo;{item.text}&rdquo;
                    </p>
                    <div className="mt-auto pt-6 border-t border-border/60">
                      <div className="font-bold text-charcoal text-base">{item.name}</div>
                      <div className="text-sm text-muted">{item.location}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button 
          onClick={handlePrev}
          className="h-12 w-12 rounded-full border border-border bg-white flex items-center justify-center text-charcoal hover:bg-surface hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-x-1"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Pagination Dots */}
        <div className="flex items-center gap-2 px-2">
          {testimonials.map((_, i) => (
            <button 
              key={i} 
              onClick={() => {
                // Determine direction based on index jump
                const jumpDir = i > activeOriginalIndex ? 1 : -1
                setDirection(jumpDir)
                // Just do a simple rotation until it matches
                setItems(prev => {
                  const newArr = [...prev]
                  while (testimonials.findIndex(t => t.name === (isMobile ? newArr[0].name : newArr[1].name)) !== i) {
                    if (jumpDir > 0) {
                      const first = newArr.shift()!
                      newArr.push(first)
                    } else {
                      const last = newArr.pop()!
                      newArr.unshift(last)
                    }
                  }
                  return newArr
                })
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                activeOriginalIndex === i
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/50"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="h-12 w-12 rounded-full border border-border bg-white flex items-center justify-center text-charcoal hover:bg-surface hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-1"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
