import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { prescriptions, appointments, patients } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendPrescriptionEmail } from '@/lib/email/mailer'
import { getSignedInDoctor } from '@/lib/auth/doctor'

export async function POST(req: NextRequest) {
  try {
    const authState = await auth()
    if (!authState.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctorContext = await getSignedInDoctor()
    if (!doctorContext) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { appointmentId, diagnosis, medicines, instructions, followUpDate } = await req.json()
    if (!appointmentId || !diagnosis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [appt] = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
    if (!appt) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    if (appt.doctorId !== doctorContext.doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [existingPrescription] = await db.select({
      id: prescriptions.id,
    }).from(prescriptions).where(eq(prescriptions.appointmentId, appointmentId))
    if (existingPrescription) {
      return NextResponse.json({ error: 'Prescription already exists', prescriptionId: existingPrescription.id }, { status: 409 })
    }

    const [rx] = await db.insert(prescriptions).values({
      appointmentId,
      doctorId: doctorContext.doctor.id,
      patientId: appt.patientId,
      diagnosis,
      medicines: medicines ?? [],
      instructions: instructions ?? null,
      followUpDate: followUpDate ?? null,
    }).returning()

    // Mark appointment completed
    await db.update(appointments).set({ status: 'completed' }).where(eq(appointments.id, appointmentId))

    // Email prescription to patient
    const [patient] = await db.select().from(patients).where(eq(patients.id, appt.patientId))
    if (patient) {
      await sendPrescriptionEmail({
        patientName: patient.name,
        patientEmail: patient.email,
        diagnosis,
        medicines: medicines ?? [],
        instructions: instructions ?? '',
        followUpDate: followUpDate ?? undefined,
        prescriptionId: rx.id,
      })
    }

    return NextResponse.json(rx)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
