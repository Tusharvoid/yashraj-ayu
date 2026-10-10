import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { patients, appointments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { tryCreateJitsiRoom } from '@/lib/jitsi/client'
import { sendBookingConfirmation, sendDoctorBookingAlert } from '@/lib/email/mailer'
import { getOrCreatePrimaryDoctor } from '@/lib/db/doctors'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, date, timeSlot, service, notes } = await req.json()
    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert patient
    let patient = (await db.select().from(patients).where(eq(patients.email, email)))[0]
    if (!patient) {
      const [p] = await db.insert(patients).values({ name, email, phone }).returning()
      patient = p
    }

    const doctor = await getOrCreatePrimaryDoctor()
    const appointmentId = crypto.randomUUID()
    const room = tryCreateJitsiRoom(appointmentId)
    const patientNotes = [service ? `Treatment of interest: ${service}` : null, notes?.trim() || null]
      .filter(Boolean)
      .join('\n\n')

    // Create appointment
    const [appt] = await db.insert(appointments).values({
      id: appointmentId,
      patientId: patient.id,
      doctorId: doctor.id,
      date,
      timeSlot,
      status: 'pending',
      jitsiRoomUrl: room?.url ?? null,
      jitsiRoomName: room?.name ?? null,
      patientNotes: patientNotes || null,
    }).returning()

    // Send confirmation email to patient and alert to doctor
    await sendBookingConfirmation({ patientName: name, patientEmail: email, date, timeSlot, appointmentId: appt.id })
    await sendDoctorBookingAlert({ patientName: name, patientEmail: email, date, timeSlot, service, notes, appointmentId: appt.id })

    return NextResponse.json({ appointmentId: appt.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const appts = await db.select().from(appointments).orderBy(appointments.createdAt)
    return NextResponse.json(appts)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
