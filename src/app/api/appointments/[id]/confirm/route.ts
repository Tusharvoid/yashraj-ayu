import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import { sendAppointmentConfirmedEmail } from '@/lib/email/mailer'
import { tryCreateJitsiRoom } from '@/lib/jitsi/client'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import { createPatientRoomJoinUrl } from '@/lib/jitsi/security'

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

    const [existing] = await db.select().from(appointments).where(eq(appointments.id, id))
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.doctorId && existing.doctorId !== doctorContext.doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const room = tryCreateJitsiRoom(existing.id)

    const [appt] = await db.update(appointments)
      .set({
        status: 'confirmed',
        doctorId: doctorContext.doctor.id,
        jitsiRoomUrl: existing.jitsiRoomUrl ?? room?.url ?? null,
        jitsiRoomName: existing.jitsiRoomName ?? room?.name ?? null,
      })
      .where(eq(appointments.id, id))
      .returning()

    const [patient] = await db.select().from(patients).where(eq(patients.id, appt.patientId))
    if (patient && appt.jitsiRoomUrl) {
      const joinUrl = createPatientRoomJoinUrl({ appointmentId: appt.id, appointmentDate: appt.date })
      await sendAppointmentConfirmedEmail({
        patientName: patient.name,
        patientEmail: patient.email,
        date: appt.date,
        timeSlot: appt.timeSlot,
        appointmentId: appt.id,
        joinUrl,
      })
    }

    const referer = req.headers.get('referer')
    return NextResponse.redirect(new URL(referer || '/doctor/appointments', req.url), { status: 303 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
