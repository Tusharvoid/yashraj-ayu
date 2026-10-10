import { and, desc, eq, isNotNull } from 'drizzle-orm'
import MensHealthCasePaperForm from '@/components/doctor/MensHealthCasePaperForm'
import { db } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import { requireSignedInDoctor } from '@/lib/auth/doctor'

export const dynamic = 'force-dynamic'

export default async function NewMensHealthCasePaperPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string }>
}) {
  const { doctor } = await requireSignedInDoctor()
  const { appointmentId } = await searchParams

  const patientRows = await db.select({
    id: patients.id,
    name: patients.name,
    email: patients.email,
    phone: patients.phone,
  }).from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(eq(appointments.doctorId, doctor.id), isNotNull(appointments.patientId)))
    .orderBy(desc(appointments.createdAt))

  const patientMap = new Map(patientRows.map((patient) => [patient.id, patient]))
  const allPatients = Array.from(patientMap.values())

  let prefilledPatientId: string | undefined = undefined
  if (appointmentId) {
    const [appointment] = await db.select({
      id: appointments.id,
      patientId: appointments.patientId,
    }).from(appointments).where(and(eq(appointments.id, appointmentId), eq(appointments.doctorId, doctor.id)))
    prefilledPatientId = appointment?.patientId ?? undefined
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">New Men&apos;s Health Case Paper</h1>
        <p className="mt-1 text-sm text-muted">Create a complete OPD record and email PDF to the patient.</p>
      </div>
      <MensHealthCasePaperForm
        patients={allPatients}
        prefilledPatientId={prefilledPatientId}
        prefilledAppointmentId={appointmentId}
      />
    </div>
  )
}
