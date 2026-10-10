import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { Calendar, FileText } from 'lucide-react'
import { db } from '@/lib/db'
import { appointments, patients, prescriptions } from '@/lib/db/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function PatientPrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [prescription] = await db.select({
    id: prescriptions.id,
    diagnosis: prescriptions.diagnosis,
    medicines: prescriptions.medicines,
    instructions: prescriptions.instructions,
    followUpDate: prescriptions.followUpDate,
    createdAt: prescriptions.createdAt,
    appointmentId: appointments.id,
    appointmentDate: appointments.date,
    appointmentTime: appointments.timeSlot,
    patientName: patients.name,
  }).from(prescriptions)
    .leftJoin(appointments, eq(prescriptions.appointmentId, appointments.id))
    .leftJoin(patients, eq(prescriptions.patientId, patients.id))
    .where(eq(prescriptions.id, id))

  if (!prescription) notFound()

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Prescription</h1>
          <p className="text-sm text-muted mt-2">
            For {prescription.patientName} · {new Date(prescription.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Consultation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <Calendar className="h-4 w-4 text-primary" />
                Consultation Date
              </div>
              <p className="text-sm text-muted mt-2">
                {prescription.appointmentDate} · {prescription.appointmentTime}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-charcoal mb-2">Diagnosis</h2>
              <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                {prescription.diagnosis}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-charcoal mb-2">Medicines</h2>
              {prescription.medicines.length ? (
                <div className="overflow-x-auto rounded-xl border border-border bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="bg-surface text-left text-charcoal">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Medicine</th>
                        <th className="px-4 py-3 font-semibold">Dosage</th>
                        <th className="px-4 py-3 font-semibold">Frequency</th>
                        <th className="px-4 py-3 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.medicines.map((medicine, index) => (
                        <tr key={`${medicine.name}-${index}`} className="border-t border-border">
                          <td className="px-4 py-3 text-muted">{medicine.name}</td>
                          <td className="px-4 py-3 text-muted">{medicine.dosage || 'As advised'}</td>
                          <td className="px-4 py-3 text-muted">{medicine.frequency || 'As advised'}</td>
                          <td className="px-4 py-3 text-muted">{medicine.duration || 'As advised'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
                  No medicines were listed in this prescription.
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-charcoal mb-2">Instructions</h2>
              <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                {prescription.instructions || 'No additional instructions were added.'}
              </div>
            </div>

            {prescription.followUpDate ? (
              <div>
                <h2 className="text-sm font-semibold text-charcoal mb-2">Follow-up</h2>
                <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
                  {prescription.followUpDate}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Button asChild variant="outline">
          <Link href={`/patient/appointments/${prescription.appointmentId}`}>Back to Appointment</Link>
        </Button>
      </div>
    </div>
  )
}
