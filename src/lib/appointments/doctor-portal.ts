import type { BadgeProps } from '@/components/ui/badge'
import { CLINIC_TIME_ZONE } from '@/lib/clinic'

export const appointmentStatuses = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const

export type AppointmentStatus = (typeof appointmentStatuses)[number]
export type DashboardFilter = 'all' | 'pending' | 'today' | 'active' | 'completed' | 'cancelled'
export type AppointmentSort = 'workflow' | 'schedule' | 'recent'
export type CallDeskState = 'waiting' | 'ready'

export type DoctorPortalAppointment = {
  id: string
  date: string
  timeSlot: string
  status: AppointmentStatus
  createdAt: Date
  patientName: string | null
  patientEmail: string | null
  patientPhone?: string | null
  patientNotes?: string | null
  jitsiRoomUrl?: string | null
  prescriptionId?: string | null
}

export function getAppointmentStatusVariant(status: AppointmentStatus): BadgeProps['variant'] {
  const variants: Record<AppointmentStatus, BadgeProps['variant']> = {
    pending: 'pending',
    confirmed: 'confirmed',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
  }

  return variants[status]
}

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  return status
    .split('_')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function getClinicDateParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(now)
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '00'

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  }
}

export function getTodayKey(now = new Date()) {
  const clinicNow = getClinicDateParts(now)
  return `${clinicNow.year}-${clinicNow.month}-${clinicNow.day}`
}

export function getTomorrowKey(now = new Date()) {
  const todayKey = getTodayKey(now)
  const clinicMidnight = new Date(`${todayKey}T00:00:00.000Z`)
  clinicMidnight.setUTCDate(clinicMidnight.getUTCDate() + 1)

  return clinicMidnight.toISOString().slice(0, 10)
}

export function isTodayAppointment(date: string, now = new Date()) {
  return date === getTodayKey(now)
}

function parseTimeSlotToMinutes(timeSlot: string) {
  const match = timeSlot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) {
    return 0
  }

  const [, rawHour, rawMinute, meridiem] = match
  let hour = Number(rawHour) % 12
  if (meridiem.toUpperCase() === 'PM') hour += 12

  return hour * 60 + Number(rawMinute)
}

function getDayDifference(fromDate: string, toDate: string) {
  const from = new Date(`${fromDate}T00:00:00.000Z`)
  const to = new Date(`${toDate}T00:00:00.000Z`)
  return Math.round((to.getTime() - from.getTime()) / 86400000)
}

export function parseAppointmentStart(date: string, timeSlot: string) {
  const appointmentMinutes = parseTimeSlotToMinutes(timeSlot)
  const appointmentDate = new Date(`${date}T00:00:00.000Z`)
  appointmentDate.setUTCMinutes(appointmentMinutes)
  return appointmentDate
}

export function getMinutesUntilAppointment(appointment: Pick<DoctorPortalAppointment, 'date' | 'timeSlot'>, now = new Date()) {
  const clinicNow = getClinicDateParts(now)
  const currentDate = `${clinicNow.year}-${clinicNow.month}-${clinicNow.day}`
  const currentMinutes = clinicNow.hour * 60 + clinicNow.minute
  const appointmentMinutes = parseTimeSlotToMinutes(appointment.timeSlot)
  const dayDifference = getDayDifference(currentDate, appointment.date)

  return dayDifference * 1440 + appointmentMinutes - currentMinutes
}

export function getCallDeskState(appointment: Pick<DoctorPortalAppointment, 'date' | 'timeSlot' | 'status'>, now = new Date()): CallDeskState | null {
  if (!isTodayAppointment(appointment.date, now)) return null
  if (appointment.status !== 'confirmed' && appointment.status !== 'in_progress') return null

  const minutesUntilStart = getMinutesUntilAppointment(appointment, now)

  if (appointment.status === 'in_progress') {
    if (minutesUntilStart < -240 || minutesUntilStart > 90) return null
    return 'waiting'
  }

  if (minutesUntilStart < -20 || minutesUntilStart > 90) return null
  return 'ready'
}

export function matchesDashboardFilter(
  appointment: Pick<DoctorPortalAppointment, 'date' | 'timeSlot' | 'status'>,
  filter: DashboardFilter,
  now = new Date()
) {
  switch (filter) {
    case 'pending':
      return appointment.status === 'pending'
    case 'today':
      return isTodayAppointment(appointment.date, now)
    case 'active':
      return getCallDeskState(appointment, now) !== null
    case 'completed':
      return appointment.status === 'completed'
    case 'cancelled':
      return appointment.status === 'cancelled'
    case 'all':
    default:
      return true
  }
}

function getWorkflowPriority(status: AppointmentStatus) {
  const priorities: Record<AppointmentStatus, number> = {
    in_progress: 0,
    pending: 1,
    confirmed: 2,
    completed: 3,
    cancelled: 4,
  }

  return priorities[status]
}

function compareSchedule(left: Pick<DoctorPortalAppointment, 'date' | 'timeSlot'>, right: Pick<DoctorPortalAppointment, 'date' | 'timeSlot'>) {
  return parseAppointmentStart(left.date, left.timeSlot).getTime()
    - parseAppointmentStart(right.date, right.timeSlot).getTime()
}

export function sortDoctorAppointments(
  appointments: DoctorPortalAppointment[],
  sort: AppointmentSort,
  now = new Date()
) {
  const nextAppointments = [...appointments]

  nextAppointments.sort((left, right) => {
    if (sort === 'recent') {
      return right.createdAt.getTime() - left.createdAt.getTime()
    }

    if (sort === 'schedule') {
      return compareSchedule(left, right)
    }

    const leftDeskState = getCallDeskState(left, now)
    const rightDeskState = getCallDeskState(right, now)

    if (leftDeskState !== rightDeskState) {
      if (leftDeskState === 'waiting') return -1
      if (rightDeskState === 'waiting') return 1
      if (leftDeskState === 'ready') return -1
      if (rightDeskState === 'ready') return 1
    }

    const workflowPriority = getWorkflowPriority(left.status) - getWorkflowPriority(right.status)
    if (workflowPriority !== 0) return workflowPriority

    if (left.status === 'completed' || left.status === 'cancelled') {
      return right.createdAt.getTime() - left.createdAt.getTime()
    }

    return compareSchedule(left, right)
  })

  return nextAppointments
}

export function getDoctorDashboardMetrics(appointments: DoctorPortalAppointment[], now = new Date()) {
  return appointments.reduce(
    (metrics, appointment) => {
      metrics.total += 1
      metrics[appointment.status] += 1
      if (isTodayAppointment(appointment.date, now)) metrics.today += 1
      if (getCallDeskState(appointment, now) === 'waiting') metrics.waiting += 1
      return metrics
    },
    {
      total: 0,
      today: 0,
      waiting: 0,
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    } as Record<'total' | 'today' | 'waiting' | AppointmentStatus, number>
  )
}

export function getFilterLabel(filter: DashboardFilter) {
  const labels: Record<DashboardFilter, string> = {
    all: 'All activity',
    pending: 'Pending approval',
    today: "Today's schedule",
    active: 'Active call desk',
    completed: 'Completed visits',
    cancelled: 'Cancelled visits',
  }

  return labels[filter]
}

export function getSortLabel(sort: AppointmentSort) {
  const labels: Record<AppointmentSort, string> = {
    workflow: 'Workflow',
    schedule: 'Schedule',
    recent: 'Most recent',
  }

  return labels[sort]
}
