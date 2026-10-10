import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSignedInDoctor } from '@/lib/auth/doctor'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const authState = await auth()
    if (!authState.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctorContext = await getSignedInDoctor()
    if (!doctorContext) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [existing] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.doctorId && existing.doctorId !== doctorContext.doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [appt] = await db.update(appointments)
      .set({ status: 'cancelled' })
      .where(eq(appointments.id, id))
      .returning()

    if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const referer = req.headers.get('referer')
    return NextResponse.redirect(new URL(referer || '/doctor/appointments', req.url), { status: 303 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
