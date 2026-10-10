import { SignIn } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/auth/clerk'

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-charcoal">Doctor sign-in is not configured yet</h1>
          <p className="mt-3 text-sm text-muted">
            Add valid Clerk publishable and secret keys to enable the doctor portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
}
