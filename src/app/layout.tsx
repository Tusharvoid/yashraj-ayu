import type { Metadata } from 'next'
import SiteProviders from '@/components/auth/SiteProviders'
import { Inter, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-source-serif-4',
})

export const metadata: Metadata = {
  title: 'Yashraj Clinic — Advanced Care for Fertility & Sexual Health',
  description: 'Comprehensive fertility, sexual health, general physician consultations, blood tests, and online care in Calangute, Goa. Book your appointment online.',
  metadataBase: new URL('https://yashrajclinic.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Yashraj Clinic — Advanced Care for Fertility & Sexual Health',
    description:
      'Comprehensive fertility, sexual health, general physician consultations, blood tests, and online care in Calangute, Goa. Book your appointment online.',
    url: '/',
    siteName: 'Yashraj Clinic',
    type: 'website',
    images: ['/yashrajlogo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yashraj Clinic — Advanced Care for Fertility & Sexual Health',
    description:
      'Comprehensive fertility, sexual health, general physician consultations, blood tests, and online care in Calangute, Goa. Book your appointment online.',
    images: ['/yashrajlogo.png'],
  },
  icons: {
    icon: '/yashrajlogo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif4.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-charcoal font-sans">
        <SiteProviders>
          <div className="page-enter">{children}</div>
        </SiteProviders>
      </body>
    </html>
  )
}
