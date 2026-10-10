import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { appointments, patients, prescriptions } from '@/lib/db/schema'
import type { DoctorPortalAppointment } from '@/lib/appointments/doctor-portal'

export async function getDoctorPortalAppointments(doctorId: string): Promise<DoctorPortalAppointment[]> {
  return db.select({
    id: appointments.id,
    date: appointments.date,
    timeSlot: appointments.timeSlot,
    status: appointments.status,
    createdAt: appointments.createdAt,
    patientName: patients.name,
    patientEmail: patients.email,
    patientPhone: patients.phone,
    patientNotes: appointments.patientNotes,
    jitsiRoomUrl: appointments.jitsiRoomUrl,
    prescriptionId: prescriptions.id,
  }).from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .leftJoin(prescriptions, eq(prescriptions.appointmentId, appointments.id))
    .where(eq(appointments.doctorId, doctorId))
    .orderBy(desc(appointments.createdAt))
}
