import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import { getCallDeskState, getMinutesUntilAppointment, sortDoctorAppointments } from '@/lib/appointments/doctor-portal'
import { getDoctorPortalAppointments } from '@/lib/appointments/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const authState = await auth()
    if (!authState.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctorContext = await getSignedInDoctor()
    if (!doctorContext) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const now = new Date()
    const liveAppointments = sortDoctorAppointments(
      (await getDoctorPortalAppointments(doctorContext.doctor.id))
        .filter(appointment => getCallDeskState(appointment, now) !== null),
      'workflow',
      now
    )
      .slice(0, 8)
      .map(appointment => {
        const queueState = getCallDeskState(appointment, now)

        return {
          id: appointment.id,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          status: appointment.status,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          queueState,
          minutesUntilStart: getMinutesUntilAppointment(appointment, now),
        }
      })

    return NextResponse.json({ appointments: liveAppointments })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
