import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  CLINIC_STREET_ADDRESS,
  CLINIC_PHONES,
  PRIMARY_CLINIC_EMAIL,
  PRIMARY_CLINIC_MAP_OPEN_URL,
} from '@/lib/clinic'

export default function Footer() {
  return (
    <footer className="clinic-footer">
      <div className="clinic-container">
        <div className="clinic-footer-grid">
          <div>
            <Link href="/clinic" className="clinic-brand">
              <Image
                src="/yashrajlogo.png"
                alt=""
                width={46}
                height={46}
                className="clinic-logo"
              />
              <span>
                Yashraj <em>Clinic</em>
                <small>Calangute · Goa · India</small>
              </span>
            </Link>
            <p className="clinic-footer-description">
              Personal care for your health, your wellbeing and the life ahead.
            </p>
            <div className="clinic-social">
              <a
                href="https://instagram.com/ayu_goa__india"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.facebook.com/yashrj2151/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook ↗
              </a>
            </div>
          </div>
          <div>
            <h2>Explore</h2>
            <nav aria-label="Footer navigation">
              {[
                ['Choose a website', '/'],
                ['Our story', '/about'],
                ['Our care', '/services'],
                ['Our vision', '/vision'],
                ['Gallery', '/gallery'],
                ['Patient stories', '/testimonials'],
                ['Our doctors', '/doctors'],
              ].map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2>Get in touch</h2>
            {CLINIC_PHONES.map((phone) => (
              <a
                className="clinic-footer-contact"
                key={phone}
                href={'tel:' + phone.replace(/\s/g, '')}
              >
                {phone}
              </a>
            ))}
            <a
              className="clinic-footer-contact"
              href={'mailto:' + PRIMARY_CLINIC_EMAIL}
            >
              {PRIMARY_CLINIC_EMAIL}
            </a>
            <Link href="/book" className="clinic-text-link">
              Arrange a consultation <ArrowUpRight size={16} />
            </Link>
          </div>
          <div>
            <h2>Find us in Goa</h2>
            <address>{CLINIC_STREET_ADDRESS}</address>
            <a
              href={PRIMARY_CLINIC_MAP_OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="clinic-text-link"
            >
              Get directions <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="clinic-footer-bottom">
          <span>© {new Date().getFullYear()} Yashraj Clinic</span>
          <Link href="/doctor">Staff portal</Link>
          <a
            href="https://rudranshcortex.live"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built by <span>Rudransh Cortex ↗</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
