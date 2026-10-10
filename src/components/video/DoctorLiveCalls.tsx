'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, PhoneCall, RefreshCw, Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAppointmentStatusVariant, type AppointmentStatus } from '@/lib/appointments/doctor-portal'

type LiveAppointment = {
  id: string
  date: string
  timeSlot: string
  status: AppointmentStatus
  patientName: string | null
  patientEmail: string | null
  queueState: 'waiting' | 'ready' | null
  minutesUntilStart: number
}

export default function DoctorLiveCalls() {
  const [appointments, setAppointments] = useState<LiveAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true)

    try {
      const response = await fetch('/api/appointments/live', { cache: 'no-store' })
      if (!response.ok) return

      const data = await response.json()
      setAppointments(data.appointments ?? [])
    } finally {
      setLoading(false)
      if (isRefresh) setRefreshing(false)
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void load()
    }, 0)

    const interval = window.setInterval(() => {
      void load(true)
    }, 10000)

    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(interval)
    }
  }, [])

  const waitingCount = appointments.filter(appointment => appointment.queueState === 'waiting').length

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-primary" />
            Website Call Desk
          </CardTitle>
          <p className="mt-1 text-sm text-muted">
            Patients join the consultation directly on the website. The doctor can attend from this dashboard.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void load(true)} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="rounded-xl bg-surface p-4 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading live consultation queue...
            </span>
          </div>
        ) : waitingCount > 0 ? (
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-charcoal">
            {waitingCount} patient{waitingCount === 1 ? ' is' : 's are'} already inside the room and waiting for the doctor.
          </div>
        ) : (
          <div className="rounded-xl bg-surface p-4 text-sm text-muted">
            No patient is waiting right now. Only sessions happening now or starting soon appear in this desk.
          </div>
        )}

        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
              No upcoming confirmed consultations to show in the website call desk yet.
            </div>
          ) : (
            appointments.map(appointment => (
              <div
                key={appointment.id}
                className={`rounded-xl border p-4 ${
                  appointment.queueState === 'waiting'
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-border bg-white'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium text-charcoal">{appointment.patientName || 'Patient'}</div>
                      <Badge variant={getAppointmentStatusVariant(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <div className="text-sm text-muted">{appointment.date} · {appointment.timeSlot}</div>
                    <div className="text-xs text-muted">
                      {appointment.queueState === 'waiting'
                        ? 'Patient has entered the website consultation room. Doctor can attend now.'
                        : appointment.minutesUntilStart <= 15
                          ? 'Consultation is about to start. Room is ready on the site.'
                          : `Consultation is coming up in ${appointment.minutesUntilStart} minutes.`}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant={appointment.queueState === 'waiting' ? 'accent' : 'default'}>
                      <Link href={`/room/${appointment.id}`}>
                        <Video className="h-4 w-4" />
                        Attend Call
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/doctor/appointments/${appointment.id}`}>Open Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
