'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { PRIMARY_CLINIC_PHONE_HREF } from '@/lib/clinic'

const links = [
  ['/clinic', 'Home'],
  ['/about', 'Our story'],
  ['/services', 'Our care'],
  ['/gallery', 'Gallery'],
  ['/testimonials', 'Patient stories'],
  ['/contact', 'Visit us'],
  ['/doctors', 'Our doctors'],
] as const

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 1200px)')
    const resize = () => {
      if (wide.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', outside)
    wide.addEventListener('change', resize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', outside)
      wide.removeEventListener('change', resize)
    }
  }, [open])
  const active = (href: string) =>
    href === '/clinic' ? pathname === '/clinic' : pathname.startsWith(href)
  return (
    <>
      <header ref={header} className="clinic-header">
        <div className="clinic-container clinic-header-row">
          <Link
            href="/clinic"
            className="clinic-brand"
            onClick={() => setOpen(false)}
            aria-label="Yashraj Clinic home"
          >
            <Image
              src="/yashrajlogo.png"
              alt=""
              width={46}
              height={46}
              className="clinic-logo"
            />
            <span>
              Yashraj <em>Clinic</em>
              <small>Care rooted in understanding</small>
            </span>
          </Link>
          <nav className="clinic-desktop-nav" aria-label="Main navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={active(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/book" className="clinic-button clinic-header-book">
            Book a visit <ArrowUpRight size={16} />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="clinic-menu-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="clinic-mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <nav
          id="clinic-mobile-nav"
          className="clinic-mobile-nav"
          aria-label="Mobile navigation"
          hidden={!open}
        >
          {links.map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="clinic-nav-index">0{index + 1}</span>
              {label}
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <Link href="/vision" onClick={() => setOpen(false)}>
            Our vision <ArrowUpRight size={17} />
          </Link>
          <div className="clinic-actions">
            <Link
              href="/book"
              className="clinic-button"
              onClick={() => setOpen(false)}
            >
              Book a consultation
            </Link>
            <a
              href={'tel:' + PRIMARY_CLINIC_PHONE_HREF}
              className="clinic-button clinic-button-outline"
            >
              <Phone size={16} /> Call us
            </a>
          </div>
        </nav>
      </header>
    </>
  )
}
