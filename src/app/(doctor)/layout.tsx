import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { Leaf, LayoutDashboard, Calendar, Users, LogOut, Images, FileText, Presentation, Settings } from 'lucide-react'
import { requireSignedInDoctor } from '@/lib/auth/doctor'

const nav = [
  { href: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/doctor/mens-health/new', icon: FileText, label: 'Men Health OPD' },
  { href: '/doctor/patients', icon: Users, label: 'Patients' },
  { href: '/doctor/gallery', icon: Images, label: 'Gallery' },
  { href: '/doctor/vision', icon: Presentation, label: 'Vision' },
  { href: '/doctor/settings', icon: Settings, label: 'Settings' },
]

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { doctor } = await requireSignedInDoctor()

  return (
    <div className="min-h-screen bg-surface lg:flex lg:h-screen">
      <aside className="border-b border-border bg-white lg:flex lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="border-b border-border px-4 py-4 lg:p-5">
          <Link href="/doctor" className="flex items-center gap-2 text-primary font-semibold">
            <Leaf className="h-5 w-5" />
            <span className="font-serif">Yashraj Clinic</span>
          </Link>
          <p className="text-xs text-muted mt-1">Doctor Portal</p>
          <p className="text-sm text-charcoal mt-3 font-medium">{doctor.name}</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-3 py-3 lg:hidden">
          {nav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-charcoal"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>
        <nav className="hidden flex-1 p-3 space-y-1 lg:block">
          {nav.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-charcoal hover:bg-surface hover:text-primary transition-colors">
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:space-y-3 lg:border-t lg:border-border lg:p-3">
          <div className="lg:px-3">
            <UserButton />
          </div>
          <Link href="/" className="flex items-center gap-2 text-xs text-muted hover:text-charcoal transition-colors lg:rounded-lg lg:px-3 lg:py-2 lg:text-sm">
            <LogOut className="h-4 w-4" />Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6">{children}</main>
    </div>
  )
}
