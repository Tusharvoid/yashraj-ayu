import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { appointments, mensHealthCasePapers, patients } from '@/lib/db/schema'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import type { MensHealthCasePaperInput } from '@/lib/mens-health/types'
import { buildMensHealthCasePaperPdf } from '@/lib/pdf/mensHealthCasePaper'
import { sendMensHealthCasePaperEmail } from '@/lib/email/mailer'

export async function GET(req: NextRequest) {
  try {
    const authState = await auth()
    if (!authState.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctorContext = await getSignedInDoctor()
    if (!doctorContext) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const appointmentId = req.nextUrl.searchParams.get('appointmentId')
    const patientId = req.nextUrl.searchParams.get('patientId')

    const records = await db.select({
      id: mensHealthCasePapers.id,
      caseDate: mensHealthCasePapers.caseDate,
      diagnosis: mensHealthCasePapers.diagnosis,
      patientId: mensHealthCasePapers.patientId,
      appointmentId: mensHealthCasePapers.appointmentId,
      patientName: patients.name,
      createdAt: mensHealthCasePapers.createdAt,
    }).from(mensHealthCasePapers)
      .leftJoin(patients, eq(mensHealthCasePapers.patientId, patients.id))
      .where(
        and(
          eq(mensHealthCasePapers.doctorId, doctorContext.doctor.id),
          appointmentId ? eq(mensHealthCasePapers.appointmentId, appointmentId) : undefined,
          patientId ? eq(mensHealthCasePapers.patientId, patientId) : undefined
        )
      )
      .orderBy(desc(mensHealthCasePapers.createdAt))

    return NextResponse.json(records)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const payload = (await req.json()) as MensHealthCasePaperInput
    if (!payload.patientId || !payload.caseDate) {
      return NextResponse.json({ error: 'patientId and caseDate are required' }, { status: 400 })
    }

    const [patient] = await db.select({
      id: patients.id,
      name: patients.name,
      email: patients.email,
    }).from(patients).where(eq(patients.id, payload.patientId))

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    if (payload.appointmentId) {
      const [appointment] = await db.select({
        id: appointments.id,
        doctorId: appointments.doctorId,
        patientId: appointments.patientId,
      }).from(appointments).where(eq(appointments.id, payload.appointmentId))

      if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
      }

      if (appointment.doctorId !== doctorContext.doctor.id || appointment.patientId !== payload.patientId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const [created] = await db.insert(mensHealthCasePapers).values({
      doctorId: doctorContext.doctor.id,
      patientId: payload.patientId,
      appointmentId: payload.appointmentId ?? null,
      caseDate: payload.caseDate,
      patientInitials: payload.patientInitials ?? null,
      patientAge: payload.patientAge ?? null,
      maritalStatus: payload.maritalStatus ?? null,
      occupation: payload.occupation ?? null,
      contactNumber: payload.contactNumber ?? null,
      chiefComplaints: payload.chiefComplaints ?? {},
      presentIllness: payload.presentIllness ?? {},
      sexualHistory: payload.sexualHistory ?? {},
      maritalFertilityHistory: payload.maritalFertilityHistory ?? {},
      medicalHistory: payload.medicalHistory ?? {},
      lifestyleFactors: payload.lifestyleFactors ?? {},
      examination: payload.examination ?? {},
      investigations: payload.investigations ?? {},
      diagnosis: payload.diagnosis ?? null,
      treatmentPlan: payload.treatmentPlan ?? {},
      confidentialNotes: payload.confidentialNotes ?? null,
      consentAcknowledged: payload.consentAcknowledged ?? 'yes',
      patientSignature: payload.patientSignature ?? null,
    }).returning()

    const pdfBuffer = buildMensHealthCasePaperPdf(payload, patient.name)
    const emailSent = await sendMensHealthCasePaperEmail({
      patientName: patient.name,
      patientEmail: patient.email,
      caseDate: payload.caseDate,
      diagnosis: payload.diagnosis,
      pdfBuffer,
      casePaperId: created.id,
    })

    return NextResponse.json({ ...created, emailSent })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
