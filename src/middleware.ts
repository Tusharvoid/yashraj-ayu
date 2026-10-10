import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isClerkConfigured } from '@/lib/auth/clerk'

function isProtectedPath(pathname: string) {
  return pathname.startsWith('/doctor')
    || pathname === '/api/appointments/live'
    || pathname === '/api/prescriptions'
    || /^\/api\/appointments\/[^/]+\/(confirm|reject|complete|reschedule)$/.test(pathname)
}

const clerkEnabled = isClerkConfigured()

export default clerkEnabled
  ? clerkMiddleware(async (auth, request) => {
      if (isProtectedPath(request.nextUrl.pathname)) {
        await auth.protect()
      }
    })
  : function proxy() {
      return NextResponse.next()
  }

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
