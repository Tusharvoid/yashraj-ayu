import { db } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import VideoRoom from '@/components/video/VideoRoom'
import { getJitsiDomain, getJitsiRoomName, hasJaaSAppId, isJitsiRoomUrl, tryCreateJitsiRoom } from '@/lib/jitsi/client'
import { getSignedInDoctor } from '@/lib/auth/doctor'
import { createJaaSMeetingJwt, validatePatientRoomAccess } from '@/lib/jitsi/security'

export const dynamic = 'force-dynamic'

export default async function RoomPage({ params, searchParams }: {
  params: Promise<{ appointmentId: string }>
  searchParams: Promise<{ access?: string; exp?: string; sig?: string }>
}) {
  const { appointmentId } = await params
  const { access, exp, sig } = await searchParams
  const [appt] = await db.select({
    id: appointments.id,
    date: appointments.date,
    timeSlot: appointments.timeSlot,
    status: appointments.status,
    doctorId: appointments.doctorId,
    patientId: appointments.patientId,
    jitsiRoomUrl: appointments.jitsiRoomUrl,
    jitsiRoomName: appointments.jitsiRoomName,
    patientName: patients.name,
    patientEmail: patients.email,
  }).from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.id, appointmentId))

  if (!appt) notFound()
  const generatedRoom = tryCreateJitsiRoom(appt.id)
  const existingRoomDomain = getJitsiDomain(appt.jitsiRoomName, appt.jitsiRoomUrl)
  const shouldUseStoredRoom = isJitsiRoomUrl(appt.jitsiRoomUrl)
    && (existingRoomDomain !== '8x8.vc' || hasJaaSAppId())

  const resolvedRoom = shouldUseStoredRoom
    ? {
        url: appt.jitsiRoomUrl,
        name: getJitsiRoomName(appt.jitsiRoomName, appt.jitsiRoomUrl) ?? generatedRoom?.name ?? '',
      }
    : generatedRoom

  if (resolvedRoom && (resolvedRoom.url !== appt.jitsiRoomUrl || resolvedRoom.name !== appt.jitsiRoomName)) {
    await db.update(appointments)
      .set({
        jitsiRoomUrl: resolvedRoom.url,
        jitsiRoomName: resolvedRoom.name,
      })
      .where(eq(appointments.id, appointmentId))
  }

  if (!resolvedRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-charcoal">Consultation room is not ready yet</h1>
          <p className="mt-3 text-sm text-muted">
            Please ask the clinic to finish the video room setup for this appointment.
          </p>
        </div>
      </div>
    )
  }

  const doctorContext = await getSignedInDoctor()
  const patientAccess = validatePatientRoomAccess({ appointmentId, access, exp, sig })

  let participant: {
    isDoctor: boolean
    displayName: string
    email?: string | null
    participantId: string
  } | null = null

  if (doctorContext && doctorContext.doctor.id === appt.doctorId) {
    participant = {
      isDoctor: true,
      displayName: doctorContext.doctor.name,
      email: doctorContext.primaryEmail,
      participantId: doctorContext.doctor.id,
    }
  } else if (patientAccess.valid) {
    participant = {
      isDoctor: false,
      displayName: appt.patientName || 'Patient',
      email: appt.patientEmail,
      participantId: appt.patientId,
    }
  }

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-charcoal">This consultation room is protected</h1>
          <p className="mt-3 text-sm text-muted">
            Please join from the doctor portal or use the signed patient link from your appointment confirmation email.
          </p>
        </div>
      </div>
    )
  }

  let meetingJwt: string | null = null
  if (getJitsiDomain(resolvedRoom.name, resolvedRoom.url) === '8x8.vc') {
    try {
      meetingJwt = createJaaSMeetingJwt({
        roomName: resolvedRoom.name,
        userId: participant.participantId,
        name: participant.displayName,
        email: participant.email,
        moderator: participant.isDoctor,
      })
    } catch (error) {
      console.error('[JaaS] configuration error', error)
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface px-4">
          <div className="max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-charcoal">Video consultation is not configured yet</h1>
            <p className="mt-3 text-sm text-muted">
              Please add the Jitsi as a Service credentials before joining 8x8 consultation rooms.
            </p>
          </div>
        </div>
      )
    }
  }

  if (appt.status === 'confirmed') {
    await db.update(appointments).set({ status: 'in_progress' }).where(eq(appointments.id, appointmentId))
  }

  return (
    <div className="h-screen flex flex-col bg-charcoal">
      <div className="flex items-center justify-between px-4 py-3 bg-black/50">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-medium font-serif">Yashraj Clinic — Video Consultation</span>
        </div>
        <span className="text-white/60 text-xs">{appt.date} · {appt.timeSlot}</span>
      </div>
      <VideoRoom
        appointmentId={appointmentId}
        roomUrl={resolvedRoom.url}
        roomName={resolvedRoom.name}
        roomJwt={meetingJwt}
        displayName={participant.displayName}
        isDoctor={participant.isDoctor}
      />
    </div>
  )
}
