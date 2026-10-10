import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { isClerkConfigured } from '@/lib/auth/clerk'
import { doctors } from '@/lib/db/schema'
import { getOrCreatePrimaryDoctor } from '@/lib/db/doctors'

function getPrimaryEmail(clerkUser: NonNullable<Awaited<ReturnType<typeof currentUser>>>) {
  return clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)?.emailAddress
    ?? clerkUser.emailAddresses[0]?.emailAddress
    ?? null
}

async function findDoctorForCurrentClerkUser(userId: string) {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const primaryEmail = getPrimaryEmail(clerkUser)

  let [doctor] = await db.select().from(doctors).where(eq(doctors.clerkUserId, userId)).limit(1)

  if (!doctor && primaryEmail) {
    ;[doctor] = await db.select().from(doctors).where(eq(doctors.email, primaryEmail)).limit(1)

    if (!doctor) {
      const primaryDoctor = await getOrCreatePrimaryDoctor()
      if (primaryDoctor.email.toLowerCase() === primaryEmail.toLowerCase()) {
        doctor = primaryDoctor
      }
    }

    if (doctor && doctor.clerkUserId !== userId) {
      const [updatedDoctor] = await db.update(doctors)
        .set({ clerkUserId: userId })
        .where(eq(doctors.id, doctor.id))
        .returning()

      doctor = updatedDoctor
    }
  }

  // Temporary fallback: allow any signed-in Clerk user to access the
  // doctor portal through the clinic's primary doctor record.
  if (!doctor) {
    doctor = await getOrCreatePrimaryDoctor()
  }

  return {
    clerkUser,
    doctor,
    primaryEmail,
  }
}

export async function getSignedInDoctor() {
  if (!isClerkConfigured()) return null

  const authState = await auth()
  if (!authState.userId) return null

  return findDoctorForCurrentClerkUser(authState.userId)
}

export async function requireSignedInDoctor() {
  if (!isClerkConfigured()) {
    // A missing local auth configuration is a setup issue, not a missing route.
    // Keep the dashboard protected and use the existing sign-in setup screen.
    redirect('/sign-in')
  }

  const authState = await auth()
  if (!authState.userId) {
    authState.redirectToSignIn()
  }

  const doctorContext = await findDoctorForCurrentClerkUser(authState.userId as string)
  if (!doctorContext) {
    notFound()
  }

  return doctorContext
}
