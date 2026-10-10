import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { doctors } from '@/lib/db/schema'

const DEFAULT_DOCTOR = {
  name: process.env.DEFAULT_DOCTOR_NAME ?? 'Dr. Raju Bhusanar',
  email: process.env.DEFAULT_DOCTOR_EMAIL ?? 'rajubhusanar@gmail.com',
  specialty: 'Ayurvedic Medicine',
}

export async function getOrCreatePrimaryDoctor() {
  const [existing] = await db.select().from(doctors).where(eq(doctors.email, DEFAULT_DOCTOR.email)).limit(1)
  if (existing) return existing

  const [created] = await db.insert(doctors).values(DEFAULT_DOCTOR).returning()
  return created
}
