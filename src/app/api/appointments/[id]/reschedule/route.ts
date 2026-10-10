import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import { sendAppointmentRescheduledEmail } from '@/lib/email/mailer'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import { TIME_SLOTS } from '@/lib/utils'

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

    const formData = await req.formData()
    const date = String(formData.get('date') ?? '').trim()
    const timeSlot = String(formData.get('timeSlot') ?? '').trim()

    if (!date || !timeSlot) {
      return NextResponse.json({ error: 'Date and time are required' }, { status: 400 })
    }

    if (!TIME_SLOTS.includes(timeSlot)) {
      return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })
    }

    const [existing] = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1)
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (existing.doctorId && existing.doctorId !== doctorContext.doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (existing.status === 'cancelled' || existing.status === 'completed' || existing.status === 'in_progress') {
      return NextResponse.json({ error: 'This appointment cannot be rescheduled now' }, { status: 409 })
    }

    const [updatedAppointment] = await db.update(appointments)
      .set({
        date,
        timeSlot,
        doctorId: doctorContext.doctor.id,
      })
      .where(eq(appointments.id, id))
      .returning()

    const [patient] = await db.select().from(patients).where(eq(patients.id, updatedAppointment.patientId)).limit(1)

    if (patient) {
      await sendAppointmentRescheduledEmail({
        patientName: patient.name,
        patientEmail: patient.email,
        oldDate: existing.date,
        oldTimeSlot: existing.timeSlot,
        newDate: updatedAppointment.date,
        newTimeSlot: updatedAppointment.timeSlot,
        appointmentId: updatedAppointment.id,
      })
    }

    return NextResponse.redirect(new URL(`/doctor/appointments/${id}`, req.url), { status: 303 })
  } catch (error) {
    console.error('[Appointment][Reschedule]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
