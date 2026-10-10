import { CheckCircle2, Circle, Clock3, Video, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/lib/appointments/doctor-portal'

type TimelineStep = {
  key: string
  label: string
  description: string
  state: 'done' | 'current' | 'upcoming' | 'cancelled'
}

function buildTimeline(status: AppointmentStatus, hasPrescription: boolean): TimelineStep[] {
  if (status === 'cancelled') {
    return [
      {
        key: 'requested',
        label: 'Requested',
        description: 'Patient submitted the appointment request.',
        state: 'done',
      },
      {
        key: 'cancelled',
        label: 'Cancelled',
        description: 'This consultation was cancelled and the room is no longer active.',
        state: 'cancelled',
      },
    ]
  }

  const steps: TimelineStep[] = [
    {
      key: 'requested',
      label: 'Requested',
      description: 'Booking received and waiting for doctor review.',
      state: 'done',
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      description: 'Appointment approved and room details are ready.',
      state: status === 'pending' ? 'upcoming' : 'done',
    },
    {
      key: 'consultation',
      label: 'Consultation',
      description: 'Doctor and patient join the website video room.',
      state: status === 'in_progress'
        ? 'current'
        : status === 'completed'
          ? 'done'
          : 'upcoming',
    },
    {
      key: 'completed',
      label: hasPrescription ? 'Completed + Prescription' : 'Completed',
      description: hasPrescription
        ? 'Visit is complete and the prescription has been issued.'
        : 'Visit is complete. Prescription can still be added if needed.',
      state: status === 'completed' ? 'done' : 'upcoming',
    },
  ]

  if (status === 'confirmed') {
    steps[1].state = 'current'
  }

  return steps
}

export default function AppointmentStatusTimeline({
  status,
  hasPrescription,
}: {
  status: AppointmentStatus
  hasPrescription: boolean
}) {
  const steps = buildTimeline(status, hasPrescription)

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.state === 'done'
          ? CheckCircle2
          : step.state === 'current'
            ? (step.key === 'consultation' ? Video : Clock3)
            : step.state === 'cancelled'
              ? XCircle
              : Circle

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border',
                  step.state === 'done' && 'border-green-200 bg-green-50 text-green-700',
                  step.state === 'current' && 'border-accent/30 bg-accent/10 text-accent',
                  step.state === 'upcoming' && 'border-border bg-white text-muted',
                  step.state === 'cancelled' && 'border-red-200 bg-red-50 text-red-600'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}
            </div>
            <div className="pb-5">
              <div className="text-sm font-medium text-charcoal">{step.label}</div>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
