import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { Calendar, Clock, Mail, Phone, Video } from 'lucide-react'
import { db } from '@/lib/db'
import { appointments, patients, prescriptions } from '@/lib/db/schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppointmentStatusTimeline from '@/components/doctor/AppointmentStatusTimeline'
import DoctorAppointmentActions from '@/components/doctor/DoctorAppointmentActions'
import { requireSignedInDoctor } from '@/lib/auth/doctor'
import { getAppointmentStatusLabel, getAppointmentStatusVariant } from '@/lib/appointments/doctor-portal'

export const dynamic = 'force-dynamic'

export default async function DoctorAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { doctor } = await requireSignedInDoctor()
  const { id } = await params

  const [appointment] = await db.select({
    id: appointments.id,
    date: appointments.date,
    timeSlot: appointments.timeSlot,
    status: appointments.status,
    roomUrl: appointments.jitsiRoomUrl,
    patientNotes: appointments.patientNotes,
    patientName: patients.name,
    patientEmail: patients.email,
    patientPhone: patients.phone,
  }).from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(eq(appointments.id, id), eq(appointments.doctorId, doctor.id)))

  if (!appointment) notFound()

  const [prescription] = await db.select({
    id: prescriptions.id,
    createdAt: prescriptions.createdAt,
  }).from(prescriptions).where(eq(prescriptions.appointmentId, id))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Appointment Details</h1>
          <p className="mt-1 text-sm text-muted">
            {appointment.date} · {appointment.timeSlot}
          </p>
        </div>
        <Badge variant={getAppointmentStatusVariant(appointment.status)}>
          {getAppointmentStatusLabel(appointment.status)}
        </Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>Contact details and notes captured during booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="text-lg font-semibold text-charcoal">{appointment.patientName}</div>
                <div className="mt-3 space-y-2 text-sm text-muted">
                  <div className="flex items-center gap-2 break-all">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                  {appointment.patientPhone ? (
                    <div className="flex items-center gap-2 break-all">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{appointment.patientPhone}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl bg-surface p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{appointment.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-semibold text-charcoal">Notes from Patient</h2>
                <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                  {appointment.patientNotes || 'No notes were shared for this appointment.'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visit Timeline</CardTitle>
              <CardDescription>Clear status progression for this appointment.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentStatusTimeline
                status={appointment.status}
                hasPrescription={Boolean(prescription)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Controls</CardTitle>
              <CardDescription>Use the practical doctor actions from one panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(appointment.status === 'confirmed' || appointment.status === 'in_progress') && appointment.roomUrl ? (
                <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                  The patient joins directly on the clinic website through the secure Jitsi room. Attend the consultation here when ready.
                </div>
              ) : null}

              <DoctorAppointmentActions
                appointmentId={appointment.id}
                status={appointment.status}
                prescriptionId={prescription?.id}
                layout="stacked"
                showViewButton={false}
              />

              <Button asChild variant="outline" className="w-full">
                <Link href={`/doctor/mens-health/new?appointmentId=${appointment.id}`}>
                  Create Men&apos;s Health OPD Case Paper
                </Link>
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link href="/doctor/appointments">Back to Appointment Desk</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Snapshot</CardTitle>
              <CardDescription>Helpful status signals for the doctor portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted">
              <div className="rounded-xl bg-surface p-4">
                <div className="font-medium text-charcoal">Appointment ID</div>
                <div className="mt-1 break-all">{appointment.id}</div>
              </div>

              <div className="rounded-xl bg-surface p-4">
                <div className="font-medium text-charcoal">Room Access</div>
                <div className="mt-1">
                  {appointment.roomUrl ? 'Website room provisioned and ready for doctor access.' : 'Room details not available yet.'}
                </div>
                {appointment.roomUrl ? (
                  <Button asChild size="sm" variant="outline" className="mt-3 w-full">
                    <Link href={`/room/${appointment.id}`}>
                      <Video className="h-4 w-4" />
                      Open Consultation Room
                    </Link>
                  </Button>
                ) : null}
              </div>

              <div className="rounded-xl bg-surface p-4">
                <div className="font-medium text-charcoal">Prescription</div>
                <div className="mt-1">
                  {prescription
                    ? `Issued on ${prescription.createdAt?.toLocaleString?.() ?? 'this visit'}.`
                    : 'No prescription has been issued yet.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
