import Link from 'next/link'
import { Activity, Calendar, CheckCircle2, ClipboardList, Clock3, Ban } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DoctorAppointmentActions from '@/components/doctor/DoctorAppointmentActions'
import DoctorLiveCalls from '@/components/video/DoctorLiveCalls'
import { requireSignedInDoctor } from '@/lib/auth/doctor'
import {
  getAppointmentStatusLabel,
  getAppointmentStatusVariant,
  getDoctorDashboardMetrics,
  getFilterLabel,
  getSortLabel,
  isTodayAppointment,
  matchesDashboardFilter,
  sortDoctorAppointments,
  type AppointmentSort,
  type DashboardFilter,
} from '@/lib/appointments/doctor-portal'
import { getDoctorPortalAppointments } from '@/lib/appointments/queries'

export const dynamic = 'force-dynamic'

const filters: DashboardFilter[] = ['all', 'pending', 'today', 'active', 'completed', 'cancelled']
const sorts: AppointmentSort[] = ['workflow', 'schedule', 'recent']

function buildDashboardHref(filter: DashboardFilter, sort: AppointmentSort) {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('filter', filter)
  if (sort !== 'workflow') params.set('sort', sort)

  const query = params.toString()
  return query ? `/doctor?${query}` : '/doctor'
}

export default async function DoctorDashboard({
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
  const pendingApprovals = sortDoctorAppointments(
    appointments.filter(appointment => appointment.status === 'pending'),
    'schedule',
    now
  ).slice(0, 6)
  const todaySchedule = sortDoctorAppointments(
    appointments.filter(appointment => isTodayAppointment(appointment.date, now)),
    'schedule',
    now
  ).slice(0, 8)
  const activityFeed = sortDoctorAppointments(
    appointments.filter(appointment => matchesDashboardFilter(appointment, activeFilter, now)),
    activeSort,
    now
  ).slice(0, 12)

  const summaryCards = [
    {
      label: "Today's Appointments",
      value: metrics.today,
      icon: Calendar,
      tone: 'text-primary',
      hint: 'All appointments scheduled for today',
    },
    {
      label: 'Pending Approval',
      value: metrics.pending,
      icon: Clock3,
      tone: 'text-accent',
      hint: 'Requests still waiting for doctor action',
    },
    {
      label: 'Confirmed',
      value: metrics.confirmed,
      icon: CheckCircle2,
      tone: 'text-green-600',
      hint: 'Approved visits not yet started',
    },
    {
      label: 'Live Now',
      value: metrics.waiting,
      icon: Activity,
      tone: 'text-accent',
      hint: 'Patients already inside the website room',
    },
    {
      label: 'Completed',
      value: metrics.completed,
      icon: ClipboardList,
      tone: 'text-blue-600',
      hint: 'Visits already closed out',
    },
    {
      label: 'Cancelled',
      value: metrics.cancelled,
      icon: Ban,
      tone: 'text-red-600',
      hint: 'Cancelled or rejected bookings',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Doctor Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Monitor urgent approvals, active website consultations, today&apos;s schedule, and the latest appointment outcomes from one place.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/doctor/appointments">Open Full Appointment Desk</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon, tone, hint }) => (
          <Card key={label}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-surface ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-charcoal">{value}</div>
                <div className="text-sm font-medium text-charcoal">{label}</div>
                <div className="mt-1 text-xs text-muted">{hint}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Urgent Actions</CardTitle>
            <CardDescription>Pending bookings that still need a doctor decision.</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
                No pending approvals right now. New booking requests will appear here as soon as they arrive.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map(appointment => (
                  <div key={appointment.id} className="rounded-xl border border-border bg-white p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-medium text-charcoal">{appointment.patientName || 'Patient'}</div>
                          <Badge variant={getAppointmentStatusVariant(appointment.status)}>
                            {getAppointmentStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted">{appointment.date} · {appointment.timeSlot}</div>
                        <div className="text-xs text-muted">
                          {appointment.patientEmail || 'No patient email on file'}
                        </div>
                        {appointment.patientNotes ? (
                          <p className="rounded-lg bg-surface px-3 py-2 text-xs text-muted">
                            {appointment.patientNotes}
                          </p>
                        ) : null}
                      </div>
                      <DoctorAppointmentActions
                        appointmentId={appointment.id}
                        status={appointment.status}
                        prescriptionId={appointment.prescriptionId}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>Quick view of every booking scheduled for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {todaySchedule.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
                No appointments are scheduled for today yet.
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedule.map(appointment => (
                  <div
                    key={appointment.id}
                    className={`rounded-xl border p-4 ${
                      appointment.status === 'completed' || appointment.status === 'cancelled'
                        ? 'border-border bg-surface/60 opacity-80'
                        : 'border-border bg-white'
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-charcoal">{appointment.patientName || 'Patient'}</span>
                          <Badge variant={getAppointmentStatusVariant(appointment.status)}>
                            {getAppointmentStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted">{appointment.timeSlot}</div>
                      </div>
                      <DoctorAppointmentActions
                        appointmentId={appointment.id}
                        status={appointment.status}
                        prescriptionId={appointment.prescriptionId}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DoctorLiveCalls />

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Appointment Activity Feed</CardTitle>
            <CardDescription>
              Filter and sort the appointment stream without leaving the dashboard.
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
                  <Link href={buildDashboardHref(filterOption, activeSort)}>
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
                  <Link href={buildDashboardHref(activeFilter, sortOption)}>
                    Sort: {getSortLabel(sortOption)}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activityFeed.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
              No appointments match the current dashboard filter.
            </div>
          ) : (
            <div className="space-y-3">
              {activityFeed.map(appointment => (
                <div
                  key={appointment.id}
                  className={`rounded-xl border p-4 ${
                    appointment.status === 'completed' || appointment.status === 'cancelled'
                      ? 'border-border bg-surface/60'
                      : 'border-border bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-charcoal">{appointment.patientName || 'Patient'}</span>
                        <Badge variant={getAppointmentStatusVariant(appointment.status)}>
                          {getAppointmentStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted">
                        {appointment.date} · {appointment.timeSlot}
                      </div>
                      <div className="text-xs text-muted">
                        {appointment.patientEmail || 'No patient email on file'}
                        {appointment.patientPhone ? ` · ${appointment.patientPhone}` : ''}
                      </div>
                    </div>
                    <DoctorAppointmentActions
                      appointmentId={appointment.id}
                      status={appointment.status}
                      prescriptionId={appointment.prescriptionId}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
