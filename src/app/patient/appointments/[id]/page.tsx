import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { Calendar, Clock, FileText, Mail, Phone, Video } from 'lucide-react'
import { db } from '@/lib/db'
import { appointments, patients, prescriptions } from '@/lib/db/schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createPatientRoomJoinUrl } from '@/lib/jitsi/security'
import type { BadgeProps } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

function statusVariant(status: string): BadgeProps['variant'] {
  const variants: Record<AppointmentStatus, BadgeProps['variant']> = {
    pending: 'pending',
    confirmed: 'confirmed',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
  }

  return variants[status as AppointmentStatus] ?? 'secondary'
}

export default async function PatientAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
    .where(eq(appointments.id, id))

  if (!appointment) notFound()

  const [prescription] = await db.select({
    id: prescriptions.id,
  }).from(prescriptions).where(eq(prescriptions.appointmentId, id))
  const patientJoinUrl = createPatientRoomJoinUrl({ appointmentId: appointment.id, appointmentDate: appointment.date })

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Appointment Details</h1>
            <p className="text-sm text-muted mt-2">Appointment ID: {appointment.id}</p>
          </div>
          <Badge variant={statusVariant(appointment.status)}>{appointment.status}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </div>
                  <p className="text-sm text-muted mt-2">{appointment.date}</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                    <Clock className="h-4 w-4 text-primary" />
                    Time
                  </div>
                  <p className="text-sm text-muted mt-2">{appointment.timeSlot}</p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-charcoal mb-2">Your Details</h2>
                <div className="rounded-xl border border-border bg-white p-4 space-y-2 text-sm text-muted">
                  <div>{appointment.patientName}</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                  {appointment.patientPhone ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{appointment.patientPhone}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-charcoal mb-2">Notes Shared While Booking</h2>
                <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                  {appointment.patientNotes || 'No additional notes were added to this booking.'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join Consultation On This Website</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(appointment.status === 'confirmed' || appointment.status === 'in_progress') && appointment.roomUrl ? (
                <>
                  <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                    Your video consultation happens directly inside this website using the secure clinic room.
                  </div>
                  <Button asChild className="w-full" variant="accent">
                    <Link href={patientJoinUrl}>
                      <Video className="h-4 w-4" />
                      Enter Consultation Room
                    </Link>
                  </Button>
                </>
              ) : null}

              {appointment.status === 'pending' ? (
                <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                  The doctor still needs to confirm this booking. Once confirmed, this page will show your website call button here.
                </div>
              ) : null}

              {appointment.status === 'cancelled' ? (
                <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                  This appointment was cancelled, so the consultation room is no longer available.
                </div>
              ) : null}

              {prescription ? (
                <Button asChild className="w-full">
                  <Link href={`/patient/prescriptions/${prescription.id}`}>
                    <FileText className="h-4 w-4" />
                    View Prescription
                  </Link>
                </Button>
              ) : null}

              {appointment.status === 'completed' && !prescription ? (
                <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                  Your consultation is complete. The prescription will appear here once it is issued.
                </div>
              ) : null}

              <Button asChild variant="ghost" className="w-full">
                <Link href={`/patient/appointments?email=${encodeURIComponent(appointment.patientEmail ?? '')}`}>Back to Appointments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
