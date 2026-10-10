import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { Calendar, Clock, Mail, Search } from 'lucide-react'
import { db } from '@/lib/db'
import { appointments, patients, prescriptions } from '@/lib/db/schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

export default async function PatientAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  const normalizedEmail = email?.trim().toLowerCase()
  const [patient] = normalizedEmail
    ? await db.select().from(patients).where(eq(patients.email, normalizedEmail)).limit(1)
    : []

  const patientAppointments = patient
    ? await db.select({
        id: appointments.id,
        date: appointments.date,
        timeSlot: appointments.timeSlot,
        status: appointments.status,
      }).from(appointments)
        .where(eq(appointments.patientId, patient.id))
        .orderBy(desc(appointments.createdAt))
    : []

  const prescriptionsByAppointment = patientAppointments.length
    ? await Promise.all(patientAppointments.map(async appointment => {
        const [prescription] = await db.select({
          id: prescriptions.id,
        }).from(prescriptions).where(eq(prescriptions.appointmentId, appointment.id)).limit(1)

        return [appointment.id, prescription?.id ?? null] as const
      }))
    : []

  const prescriptionMap = new Map(prescriptionsByAppointment)
  const patientJoinUrlMap = new Map(
    patientAppointments.map(appointment => [
      appointment.id,
      createPatientRoomJoinUrl({
        appointmentId: appointment.id,
        appointmentDate: appointment.date,
      }),
    ])
  )

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Patient Appointments</h1>
          <p className="text-muted mt-2">
            Enter the same email you used while booking to view your appointments and prescriptions.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input name="email" type="email" defaultValue={normalizedEmail ?? ''} placeholder="you@example.com" />
              <Button type="submit">
                <Search className="h-4 w-4" />
                Find Appointments
              </Button>
            </form>
          </CardContent>
        </Card>

        {!normalizedEmail ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted">
              Use the form above, or open the direct appointment link from your email confirmation.
            </CardContent>
          </Card>
        ) : patient ? (
          <Card>
            <CardHeader>
              <CardTitle>{patientAppointments.length} appointment{patientAppointments.length === 1 ? '' : 's'} for {patient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {patientAppointments.length === 0 ? (
                <p className="text-sm text-muted">No appointments were found for this email yet.</p>
              ) : (
                <div className="divide-y divide-border">
                  {patientAppointments.map(appointment => (
                    <div key={appointment.id} className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={statusVariant(appointment.status)}>{appointment.status}</Badge>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{appointment.timeSlot}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted">Appointment ID: {appointment.id}</div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {(appointment.status === 'confirmed' || appointment.status === 'in_progress') ? (
                          <Button asChild>
                            <Link href={patientJoinUrlMap.get(appointment.id) ?? `/patient/appointments/${appointment.id}`}>Join Call</Link>
                          </Button>
                        ) : null}
                        <Button asChild variant="outline">
                          <Link href={`/patient/appointments/${appointment.id}`}>View Details</Link>
                        </Button>
                        {prescriptionMap.get(appointment.id) ? (
                          <Button asChild>
                            <Link href={`/patient/prescriptions/${prescriptionMap.get(appointment.id)}`}>Prescription</Link>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted">No patient record was found for <strong>{normalizedEmail}</strong>.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
