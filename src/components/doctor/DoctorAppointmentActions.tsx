import Link from 'next/link'
import { CalendarClock, CheckCheck, FileText, Video, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AppointmentStatus } from '@/lib/appointments/doctor-portal'

type DoctorAppointmentActionsProps = {
  appointmentId: string
  status: AppointmentStatus
  prescriptionId?: string | null
  viewHref?: string
  layout?: 'compact' | 'stacked'
  showViewButton?: boolean
}

export default function DoctorAppointmentActions({
  appointmentId,
  status,
  prescriptionId,
  viewHref = `/doctor/appointments/${appointmentId}`,
  layout = 'compact',
  showViewButton = true,
}: DoctorAppointmentActionsProps) {
  const containerClass = layout === 'stacked'
    ? 'flex flex-col gap-2'
    : 'flex flex-wrap gap-2'

  const buttonClass = layout === 'stacked' ? 'w-full' : undefined
  const formClass = layout === 'stacked' ? 'w-full' : undefined

  return (
    <div className={containerClass}>
      {status === 'pending' ? (
        <>
          <form action={`/api/appointments/${appointmentId}/confirm`} method="POST" className={formClass}>
            <Button type="submit" size="sm" className={buttonClass}>
              Confirm
            </Button>
          </form>
          <form action={`/api/appointments/${appointmentId}/reject`} method="POST" className={formClass}>
            <Button type="submit" size="sm" variant="outline" className={buttonClass}>
              Cancel
            </Button>
          </form>
          <Button asChild size="sm" variant="ghost" className={buttonClass}>
            <Link href={`/doctor/appointments/${appointmentId}/reschedule`}>
              <CalendarClock className="h-3.5 w-3.5" />
              Reschedule
            </Link>
          </Button>
        </>
      ) : null}

      {(status === 'confirmed' || status === 'in_progress') ? (
        <>
          <Button asChild size="sm" variant={status === 'in_progress' ? 'accent' : 'default'} className={buttonClass}>
            <Link href={`/room/${appointmentId}`}>
              <Video className="h-3.5 w-3.5" />
              Join Call
            </Link>
          </Button>
          {status === 'confirmed' ? (
            <Button asChild size="sm" variant="ghost" className={buttonClass}>
              <Link href={`/doctor/appointments/${appointmentId}/reschedule`}>
                <CalendarClock className="h-3.5 w-3.5" />
                Reschedule
              </Link>
            </Button>
          ) : null}
          <form action={`/api/appointments/${appointmentId}/complete`} method="POST" className={formClass}>
            <Button type="submit" size="sm" variant="outline" className={buttonClass}>
              <CheckCheck className="h-3.5 w-3.5" />
              Mark Complete
            </Button>
          </form>
        </>
      ) : null}

      {status !== 'pending' && status !== 'cancelled' && !prescriptionId ? (
        <Button asChild size="sm" variant="outline" className={buttonClass}>
          <Link href={`/doctor/prescriptions/new?appt=${appointmentId}`}>
            <FileText className="h-3.5 w-3.5" />
            Write Prescription
          </Link>
        </Button>
      ) : null}

      {prescriptionId ? (
        <Button asChild size="sm" variant="outline" className={buttonClass}>
          <Link href={`/patient/prescriptions/${prescriptionId}`}>
            <FileText className="h-3.5 w-3.5" />
            View Prescription
          </Link>
        </Button>
      ) : null}

      {(status === 'confirmed' || status === 'in_progress') ? (
        <form action={`/api/appointments/${appointmentId}/reject`} method="POST" className={formClass}>
          <Button type="submit" size="sm" variant="ghost" className={buttonClass}>
            <XCircle className="h-3.5 w-3.5" />
            Cancel Visit
          </Button>
        </form>
      ) : null}

      {showViewButton ? (
        <Button asChild size="sm" variant="ghost" className={buttonClass}>
          <Link href={viewHref}>View Details</Link>
        </Button>
      ) : null}
    </div>
  )
}
