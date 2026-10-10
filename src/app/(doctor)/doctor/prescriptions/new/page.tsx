import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Calendar, FileText, Mail, Stethoscope } from 'lucide-react'
import { db } from '@/lib/db'
import { appointments, patients, prescriptions } from '@/lib/db/schema'
import PrescriptionForm from '@/components/prescription/PrescriptionForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireSignedInDoctor } from '@/lib/auth/doctor'
import { getAppointmentStatusLabel, getAppointmentStatusVariant } from '@/lib/appointments/doctor-portal'

export const dynamic = 'force-dynamic'

export default async function NewPrescriptionPage({ searchParams }: { searchParams: Promise<{ appt?: string }> }) {
  const { doctor } = await requireSignedInDoctor()
  const { appt } = await searchParams

  if (!appt) notFound()

  const [appointment] = await db.select({
    id: appointments.id,
    doctorId: appointments.doctorId,
    date: appointments.date,
    timeSlot: appointments.timeSlot,
    status: appointments.status,
    patientNotes: appointments.patientNotes,
    patientName: patients.name,
    patientEmail: patients.email,
    patientPhone: patients.phone,
  }).from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.id, appt))

  if (!appointment) notFound()
  if (appointment.doctorId !== doctor.id) notFound()

  const [existingPrescription] = await db.select({
    id: prescriptions.id,
    createdAt: prescriptions.createdAt,
  }).from(prescriptions).where(eq(prescriptions.appointmentId, appt))

  if (existingPrescription) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Prescription Already Issued</h1>
          <p className="mt-1 text-sm text-muted">
            Patient: <strong>{appointment.patientName}</strong> · {appointment.date} {appointment.timeSlot}
          </p>
        </div>

        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Existing Prescription Found</CardTitle>
            <CardDescription>
              A prescription for this consultation was already created on {new Date(existingPrescription.createdAt).toLocaleString()}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/patient/prescriptions/${existingPrescription.id}`}>View Prescription</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/doctor/appointments/${appt}`}>Back to Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Write Prescription</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Complete the clinical summary, add medicines, and email a polished prescription directly to the patient from the doctor portal.
          </p>
        </div>
        <Badge variant={getAppointmentStatusVariant(appointment.status)}>
          {getAppointmentStatusLabel(appointment.status)}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted">Patient</div>
              <div className="text-lg font-semibold text-charcoal">{appointment.patientName}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted">Consultation Slot</div>
              <div className="text-lg font-semibold text-charcoal">{appointment.date} · {appointment.timeSlot}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted">Prescription Flow</div>
              <div className="text-lg font-semibold text-charcoal">Save, complete, and email</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Context</CardTitle>
          <CardDescription>Keep the relevant consultation context visible while writing the prescription.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
              <Mail className="h-4 w-4 text-primary" />
              Contact
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted">
              <div>{appointment.patientEmail || 'No email on file'}</div>
              <div>{appointment.patientPhone || 'No phone number on file'}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-surface/60 p-4">
            <div className="text-sm font-medium text-charcoal">Doctor</div>
            <div className="mt-3 rounded-xl border border-border bg-white px-3 py-2 text-sm text-muted">
              {doctor.name}
            </div>
          </div>
          <div className="rounded-2xl bg-surface/60 p-4">
            <div className="text-sm font-medium text-charcoal">Booking Notes</div>
            <div className="mt-3 text-sm text-muted whitespace-pre-line">
              {appointment.patientNotes || 'No patient notes were added during booking.'}
            </div>
          </div>
        </CardContent>
      </Card>

      <PrescriptionForm
        appointmentId={appt}
        doctorName={doctor.name}
        patientName={appointment.patientName ?? 'Patient'}
        patientEmail={appointment.patientEmail}
        patientNotes={appointment.patientNotes}
        appointmentDate={appointment.date}
        appointmentTime={appointment.timeSlot}
      />
    </div>
  )
}
