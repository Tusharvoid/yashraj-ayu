import Link from 'next/link'
import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { CalendarClock, Mail, Phone } from 'lucide-react'
import { db } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import { requireSignedInDoctor } from '@/lib/auth/doctor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAppointmentStatusLabel, getAppointmentStatusVariant, getTodayKey } from '@/lib/appointments/doctor-portal'
import { TIME_SLOTS } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DoctorAppointmentReschedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { doctor } = await requireSignedInDoctor()
  const { id } = await params

  const [appointment] = await db.select({
    id: appointments.id,
    doctorId: appointments.doctorId,
    date: appointments.date,
    timeSlot: appointments.timeSlot,
    status: appointments.status,
    patientName: patients.name,
    patientEmail: patients.email,
    patientPhone: patients.phone,
    patientNotes: appointments.patientNotes,
  }).from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(and(eq(appointments.id, id), eq(appointments.doctorId, doctor.id)))

  if (!appointment) notFound()

  const canReschedule = appointment.status === 'pending' || appointment.status === 'confirmed'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Reschedule Appointment</h1>
          <p className="mt-1 text-sm text-muted">
            Update the visit slot and notify the patient by email automatically.
          </p>
        </div>
        <Badge variant={getAppointmentStatusVariant(appointment.status)}>
          {getAppointmentStatusLabel(appointment.status)}
        </Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Choose New Slot
            </CardTitle>
            <CardDescription>
              Current appointment: {appointment.date} · {appointment.timeSlot}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canReschedule ? (
              <form action={`/api/appointments/${appointment.id}/reschedule`} method="POST" className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal">New Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={appointment.date}
                    min={getTodayKey()}
                    className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-charcoal">New Time Slot</label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {TIME_SLOTS.map(slot => (
                      <label
                        key={slot}
                        className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors ${
                          appointment.timeSlot === slot
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-charcoal hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          defaultChecked={appointment.timeSlot === slot}
                          className="sr-only"
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Save Reschedule & Email Patient</Button>
                  <Button asChild variant="outline">
                    <Link href={`/doctor/appointments/${appointment.id}`}>Back to Appointment</Link>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
                This appointment cannot be rescheduled now. Only pending or confirmed appointments can be moved to a new slot.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
              <CardDescription>Reschedule notice will be emailed automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-lg font-semibold text-charcoal">{appointment.patientName}</div>
                <div className="mt-3 space-y-2 text-sm text-muted">
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

              {appointment.patientNotes ? (
                <div className="rounded-xl bg-surface p-4 text-sm text-muted whitespace-pre-line">
                  {appointment.patientNotes}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
              <CardDescription>The patient will receive the updated schedule immediately after save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted">
              <div className="rounded-xl bg-surface p-4">
                <div className="font-medium text-charcoal">Current Slot</div>
                <div className="mt-1">{appointment.date} · {appointment.timeSlot}</div>
              </div>
              <div className="rounded-xl bg-surface p-4">
                <div className="font-medium text-charcoal">Notification</div>
                <div className="mt-1">
                  Email includes the previous slot, the new slot, and a direct link back to the updated appointment page.
                </div>
              </div>
              <div className="rounded-xl bg-surface p-4">
                <div className="font-medium text-charcoal">Status</div>
                <div className="mt-1">
                  Rescheduling keeps the existing appointment status and only changes date/time.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
