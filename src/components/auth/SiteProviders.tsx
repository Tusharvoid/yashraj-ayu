import { ClerkProvider } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/auth/clerk'

export default function SiteProviders({ children }: { children: React.ReactNode }) {
  return isClerkConfigured() ? <ClerkProvider>{children}</ClerkProvider> : children
}
