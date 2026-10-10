import { db } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { requireSignedInDoctor } from '@/lib/auth/doctor'

export const dynamic = 'force-dynamic'

export default async function DoctorPatientsPage() {
  const { doctor } = await requireSignedInDoctor()
  const patientRows = await db.select({
    id: patients.id,
    name: patients.name,
    email: patients.email,
    phone: patients.phone,
    createdAt: patients.createdAt,
  }).from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .where(eq(appointments.doctorId, doctor.id))
    .orderBy(desc(patients.createdAt))

  const allPatients = Array.from(new Map(patientRows.map(patient => [patient.id, patient])).values())

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">Patients</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />{allPatients.length} patients</CardTitle></CardHeader>
        <CardContent>
          {allPatients.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No patients registered yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {allPatients.map(p => (
                <div key={p.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-charcoal">{p.name}</div>
                    <div className="text-sm text-muted">{p.email} {p.phone ? `· ${p.phone}` : ''}</div>
                  </div>
                  <div className="text-xs text-muted">
                    Registered {new Date(p.createdAt).toLocaleDateString()}
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
