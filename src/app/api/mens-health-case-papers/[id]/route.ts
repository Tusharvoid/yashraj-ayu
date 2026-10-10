import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { mensHealthCasePapers, patients } from '@/lib/db/schema'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import type { MensHealthCasePaperInput } from '@/lib/mens-health/types'
import { buildMensHealthCasePaperPdf } from '@/lib/pdf/mensHealthCasePaper'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await auth()
    if (!authState.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctorContext = await getSignedInDoctor()
    if (!doctorContext) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const [record] = await db.select({
      id: mensHealthCasePapers.id,
      doctorId: mensHealthCasePapers.doctorId,
      patientId: mensHealthCasePapers.patientId,
      appointmentId: mensHealthCasePapers.appointmentId,
      caseDate: mensHealthCasePapers.caseDate,
      patientInitials: mensHealthCasePapers.patientInitials,
      patientAge: mensHealthCasePapers.patientAge,
      maritalStatus: mensHealthCasePapers.maritalStatus,
      occupation: mensHealthCasePapers.occupation,
      contactNumber: mensHealthCasePapers.contactNumber,
      chiefComplaints: mensHealthCasePapers.chiefComplaints,
      presentIllness: mensHealthCasePapers.presentIllness,
      sexualHistory: mensHealthCasePapers.sexualHistory,
      maritalFertilityHistory: mensHealthCasePapers.maritalFertilityHistory,
      medicalHistory: mensHealthCasePapers.medicalHistory,
      lifestyleFactors: mensHealthCasePapers.lifestyleFactors,
      examination: mensHealthCasePapers.examination,
      investigations: mensHealthCasePapers.investigations,
      diagnosis: mensHealthCasePapers.diagnosis,
      treatmentPlan: mensHealthCasePapers.treatmentPlan,
      confidentialNotes: mensHealthCasePapers.confidentialNotes,
      consentAcknowledged: mensHealthCasePapers.consentAcknowledged,
      patientSignature: mensHealthCasePapers.patientSignature,
      createdAt: mensHealthCasePapers.createdAt,
      patientName: patients.name,
    }).from(mensHealthCasePapers)
      .leftJoin(patients, eq(mensHealthCasePapers.patientId, patients.id))
      .where(and(eq(mensHealthCasePapers.id, id), eq(mensHealthCasePapers.doctorId, doctorContext.doctor.id)))

    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const mode = req.nextUrl.searchParams.get('mode')
    if (mode === 'pdf') {
      const pdfBuffer = buildMensHealthCasePaperPdf(record as MensHealthCasePaperInput, record.patientName ?? 'Patient')
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="mens-health-case-paper-${record.id}.pdf"`,
        },
      })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
