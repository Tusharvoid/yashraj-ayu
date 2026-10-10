import Link from 'next/link'
import { Calendar, ClipboardList, Filter, LayoutList, RefreshCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DoctorAppointmentActions from '@/components/doctor/DoctorAppointmentActions'
import { requireSignedInDoctor } from '@/lib/auth/doctor'
import {
  getAppointmentStatusLabel,
  getAppointmentStatusVariant,
  getDoctorDashboardMetrics,
  getFilterLabel,
  getSortLabel,
  matchesDashboardFilter,
  sortDoctorAppointments,
  type AppointmentSort,
  type DashboardFilter,
} from '@/lib/appointments/doctor-portal'
import { getDoctorPortalAppointments } from '@/lib/appointments/queries'

export const dynamic = 'force-dynamic'

const filters: DashboardFilter[] = ['all', 'pending', 'today', 'active', 'completed', 'cancelled']
const sorts: AppointmentSort[] = ['workflow', 'schedule', 'recent']

function buildAppointmentsHref(filter: DashboardFilter, sort: AppointmentSort) {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('filter', filter)
  if (sort !== 'workflow') params.set('sort', sort)

  const query = params.toString()
  return query ? `/doctor/appointments?${query}` : '/doctor/appointments'
}

export default async function DoctorAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>
}) {
  const { doctor } = await requireSignedInDoctor()
  const { filter, sort } = await searchParams
  const activeFilter = filters.includes(filter as DashboardFilter) ? (filter as DashboardFilter) : 'all'
  const activeSort = sorts.includes(sort as AppointmentSort) ? (sort as AppointmentSort) : 'workflow'
  const now = new Date()

  const appointments = await getDoctorPortalAppointments(doctor.id)
  const metrics = getDoctorDashboardMetrics(appointments, now)
  const filteredAppointments = sortDoctorAppointments(
    appointments.filter(appointment => matchesDashboardFilter(appointment, activeFilter, now)),
    activeSort,
    now
  )

  const summaryCards = [
    { label: 'Total', value: metrics.total, icon: ClipboardList },
    { label: 'Pending', value: metrics.pending, icon: Filter },
    { label: 'Today', value: metrics.today, icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Appointment Desk</h1>
          <p className="mt-2 text-sm text-muted">
            Manage confirmations, live sessions, prescriptions, and completed visits from one filtered list.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/doctor">
              <LayoutList className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={buildAppointmentsHref(activeFilter, activeSort)}>
              <RefreshCcw className="h-4 w-4" />
              Refresh View
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-charcoal">{value}</div>
                <div className="text-sm text-muted">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>{filteredAppointments.length} matching appointment{filteredAppointments.length === 1 ? '' : 's'}</CardTitle>
            <CardDescription>
              Filter: {getFilterLabel(activeFilter)} · Sort: {getSortLabel(activeSort)}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap gap-2">
              {filters.map(filterOption => (
                <Button
                  key={filterOption}
                  asChild
                  size="sm"
                  variant={filterOption === activeFilter ? 'default' : 'outline'}
                >
                  <Link href={buildAppointmentsHref(filterOption, activeSort)}>
                    {getFilterLabel(filterOption)}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {sorts.map(sortOption => (
                <Button
                  key={sortOption}
                  asChild
                  size="sm"
                  variant={sortOption === activeSort ? 'secondary' : 'ghost'}
                >
                  <Link href={buildAppointmentsHref(activeFilter, sortOption)}>
                    Sort: {getSortLabel(sortOption)}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No appointments match the current desk filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(appointment => {
                const isClosed = appointment.status === 'completed' || appointment.status === 'cancelled'

                return (
                  <div
                    key={appointment.id}
                    className={`rounded-xl border p-4 ${isClosed ? 'border-border bg-surface/60' : 'border-border bg-white'}`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-medium text-charcoal">{appointment.patientName || 'Patient'}</div>
                          <Badge variant={getAppointmentStatusVariant(appointment.status)}>
                            {getAppointmentStatusLabel(appointment.status)}
                          </Badge>
                        </div>

                        <div className="grid gap-2 text-sm text-muted sm:grid-cols-2">
                          <div>{appointment.date} · {appointment.timeSlot}</div>
                          <div>
                            {appointment.patientEmail || 'No patient email'}
                            {appointment.patientPhone ? ` · ${appointment.patientPhone}` : ''}
                          </div>
                        </div>

                        {appointment.patientNotes ? (
                          <div className="rounded-lg bg-white/70 px-3 py-2 text-sm text-muted">
                            {appointment.patientNotes}
                          </div>
                        ) : (
                          <div className="text-xs text-muted">No booking notes shared by the patient.</div>
                        )}

                        <div className="text-xs text-muted">Appointment ID: {appointment.id}</div>
                      </div>

                      <DoctorAppointmentActions
                        appointmentId={appointment.id}
                        status={appointment.status}
                        prescriptionId={appointment.prescriptionId}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
