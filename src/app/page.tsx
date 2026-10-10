import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Leaf, Stethoscope } from 'lucide-react'
import { PRIMARY_DOCTOR } from '@/lib/clinic'
import { AYURVEDA_SITE_URL, CLINIC_SITE_PATH } from '@/lib/site-destinations'
import styles from './gateway.module.css'

export const metadata: Metadata = {
  title: 'Yashraj — Choose Your Care',
  description:
    'Choose the Yashraj Clinic website for fertility and sexual health, or Yashraj Ayu for Ayurveda and Panchakarma.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Yashraj — Choose Your Care',
    description: 'Two dedicated websites. Find the care you are looking for.',
    url: '/',
  },
  twitter: {
    title: 'Yashraj — Choose Your Care',
    description: 'Explore Yashraj Clinic and Yashraj Ayu.',
  },
}

export default function ChooseWebsitePage() {
  return (
    <div className={`marketing-shell ${styles.gateway}`}>
      <a className="clinic-skip" href="#choose-website">
        Skip to website choices
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Yashraj home">
          <Image src="/yashrajlogo.png" alt="" width={48} height={48} />
          <span>
            Yashraj<small>Health & wellbeing</small>
          </span>
        </Link>
        <span className={styles.location}>Calangute, Goa</span>
      </header>

      <main id="choose-website" tabIndex={-1} className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Welcome to Yashraj</p>
          <h1>
            Choose your <em>path to care.</em>
          </h1>
        </div>

        <div className={styles.cards}>
          <Link
            href={CLINIC_SITE_PATH}
            className={styles.card}
            aria-labelledby="clinic-choice-title"
          >
            <div className={`${styles.visual} ${styles.doctorVisual}`}>
              <span className={styles.number}>01 / CLINIC</span>
              <Image
                src={PRIMARY_DOCTOR.image}
                alt="Dr. Raju Bhusanar"
                fill
                sizes="(min-width: 760px) 240px, 200px"
                preload
                className={styles.portrait}
              />
              <span className={styles.photoLabel}>Dr. Raju Bhusanar</span>
            </div>
            <div className={styles.copy}>
              <p className={styles.cardBrand}>
                <Stethoscope size={17} aria-hidden="true" /> Yashraj Clinic
              </p>
              <h2 id="clinic-choice-title">
                Sexual health <span>& fertility.</span>
              </h2>
              <p className={styles.description}>
                Explore consultations for sexual health, fertility and general
                medical care.
              </p>
              <ArrowUpRight
                className={styles.cardArrow}
                size={24}
                aria-hidden="true"
              />
            </div>
          </Link>

          <a
            href={AYURVEDA_SITE_URL}
            className={`${styles.card} ${styles.ayuCard}`}
            aria-labelledby="ayu-choice-title"
          >
            <div className={styles.visual}>
              <span className={styles.number}>02 / AYURVEDA</span>
              <Image
                src="/editorial/ayurveda.jpg"
                alt="Ayurvedic oil, a brass vessel and traditional lamps"
                fill
                sizes="(min-width: 1160px) 540px, (min-width: 760px) 47vw, 100vw"
                className={styles.ayuPhoto}
              />
            </div>
            <div className={styles.copy}>
              <p className={styles.cardBrand}>
                <Leaf size={17} aria-hidden="true" /> Yashraj Ayu
              </p>
              <h2 id="ayu-choice-title">
                Ayurveda <span>& Panchakarma.</span>
              </h2>
              <p className={styles.description}>
                Explore Ayurvedic consultations, traditional therapies,
                Panchakarma and yoga.
              </p>
              <ArrowUpRight
                className={styles.cardArrow}
                size={24}
                aria-hidden="true"
              />
            </div>
          </a>
        </div>
        <p className={styles.hint}>
          Choose either website to explore its services and consultation
          options.
        </p>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Yashraj</span>
        <a
          href="https://rudranshcortex.live"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by <span>Rudransh Cortex ↗</span>
        </a>
      </footer>
    </div>
  )
}
