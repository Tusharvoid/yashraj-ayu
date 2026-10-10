'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ClipboardList, Loader2, Plus, Sparkles, Stethoscope, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Medicine = {
  name: string
  dosage: string
  frequency: string
  duration: string
}

type PrescriptionFormProps = {
  appointmentId: string
  doctorName: string
  patientName: string
  patientEmail: string | null
  patientNotes?: string | null
  appointmentDate: string
  appointmentTime: string
}

const frequencyPresets = ['Once daily', 'Twice daily', 'Thrice daily', 'After meals', 'Before meals', 'At bedtime']
const durationPresets = ['3 days', '5 days', '7 days', '14 days', '21 days', '1 month']
const quickGuidance = [
  'Hydration and light meals encouraged.',
  'Avoid oily, spicy, and very heavy food.',
  'Take adequate rest and maintain regular sleep.',
  'Contact the clinic if symptoms worsen or new symptoms appear.',
]

const diagnosisTemplates = [
  'Primary diagnosis',
  'Clinical findings',
  'Ayurvedic assessment',
]

function createMedicine(): Medicine {
  return { name: '', dosage: '', frequency: '', duration: '' }
}

function guidanceLabel(text: string) {
  if (text.startsWith('Hydration')) return 'Hydration'
  if (text.startsWith('Avoid oily')) return 'Avoid heavy food'
  if (text.startsWith('Take adequate')) return 'Rest advice'
  if (text.startsWith('Contact the clinic')) return 'Warning signs'
  return text
}

export default function PrescriptionForm({
  appointmentId,
  doctorName,
  patientName,
  patientEmail,
  patientNotes,
  appointmentDate,
  appointmentTime,
}: PrescriptionFormProps) {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chiefComplaint, setChiefComplaint] = useState('')
  const [clinicalFindings, setClinicalFindings] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [instructions, setInstructions] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([createMedicine()])

  const populatedMedicines = medicines.filter(medicine => medicine.name.trim())
  const diagnosisSections = [
    chiefComplaint.trim() ? `Chief complaint:\n${chiefComplaint.trim()}` : null,
    clinicalFindings.trim() ? `Clinical findings:\n${clinicalFindings.trim()}` : null,
    diagnosis.trim() ? `Assessment / diagnosis:\n${diagnosis.trim()}` : null,
  ].filter(Boolean)
  const compiledDiagnosis = diagnosisSections.join('\n\n')
  const compiledInstructions = [
    instructions.trim() || null,
    followUpDate ? `Recommended follow-up: ${followUpDate}` : null,
  ].filter(Boolean).join('\n\n')

  function setMedicine(index: number, key: keyof Medicine, value: string) {
    setMedicines(current =>
      current.map((medicine, medicineIndex) =>
        medicineIndex === index ? { ...medicine, [key]: value } : medicine
      )
    )
  }

  function addMedicine() {
    setMedicines(current => [...current, createMedicine()])
  }

  function removeMedicine(index: number) {
    setMedicines(current => current.filter((_, medicineIndex) => medicineIndex !== index))
  }

  function appendGuidance(text: string) {
    setInstructions(current => {
      if (current.includes(text)) return current
      return current.trim() ? `${current.trim()}\n• ${text}` : `• ${text}`
    })
  }

  function injectDiagnosisTemplate(template: string) {
    if (template === 'Primary diagnosis') {
      setDiagnosis(current => current || 'Likely diagnosis / working impression')
      return
    }

    if (template === 'Clinical findings') {
      setClinicalFindings(current => current || 'Vitals stable. Relevant examination findings...')
      return
    }

    setDiagnosis(current =>
      current
        ? `${current}\nAyurvedic assessment: `
        : 'Ayurvedic assessment: '
    )
  }

  async function submit() {
    const finalDiagnosis = compiledDiagnosis.trim()
    if (!finalDiagnosis) {
      setError('Please add at least one diagnosis or findings section before saving.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          diagnosis: finalDiagnosis,
          medicines: populatedMedicines,
          instructions: compiledInstructions || undefined,
          followUpDate: followUpDate || undefined,
        }),
      })

      if (response.ok) {
        setDone(true)
        return
      }

      const data = await response.json().catch(() => null)
      setError(data?.error ?? 'Failed to save prescription.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary" />
          <h2 className="mt-5 text-3xl font-semibold text-charcoal">Prescription Saved</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            The consultation has been marked complete and the prescription has been emailed to {patientEmail || patientName}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push(`/doctor/appointments/${appointmentId}`)}>
              Return to Appointment
            </Button>
            <Button asChild variant="outline">
              <Link href="/doctor/appointments">Back to Appointment Desk</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-surface/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Clinical Assessment
                </CardTitle>
                <CardDescription>
                  Build a complete record of the visit before issuing the prescription.
                </CardDescription>
              </div>
              <Badge variant="outline">Appointment {appointmentDate} · {appointmentTime}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">Chief Complaint</label>
                <Textarea
                  placeholder="Main symptoms, onset, duration, or reason for consultation..."
                  value={chiefComplaint}
                  onChange={event => setChiefComplaint(event.target.value)}
                  rows={5}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">Clinical Findings</label>
                <Textarea
                  placeholder="Examination notes, vitals, observations, and relevant findings..."
                  value={clinicalFindings}
                  onChange={event => setClinicalFindings(event.target.value)}
                  rows={5}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-medium text-charcoal">Assessment / Diagnosis *</label>
                <div className="flex flex-wrap gap-2">
                  {diagnosisTemplates.map(template => (
                    <Button
                      key={template}
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => injectDiagnosisTemplate(template)}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Primary diagnosis, differential notes, and Ayurvedic interpretation..."
                value={diagnosis}
                onChange={event => setDiagnosis(event.target.value)}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Medicines / Herbs
                </CardTitle>
                <CardDescription>Add one or more medicines with dosage guidance.</CardDescription>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={addMedicine}>
                <Plus className="h-3.5 w-3.5" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {medicines.map((medicine, index) => (
              <div key={index} className="rounded-2xl border border-border bg-surface/50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-charcoal">Medicine #{index + 1}</div>
                  {medicines.length > 1 ? (
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeMedicine(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  ) : null}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Medicine / formulation name"
                    value={medicine.name}
                    onChange={event => setMedicine(index, 'name', event.target.value)}
                  />
                  <Input
                    placeholder="Dosage, e.g. 2 tablets / 10 ml"
                    value={medicine.dosage}
                    onChange={event => setMedicine(index, 'dosage', event.target.value)}
                  />
                  <div className="space-y-2">
                    <Input
                      placeholder="Frequency, e.g. Twice daily"
                      value={medicine.frequency}
                      onChange={event => setMedicine(index, 'frequency', event.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      {frequencyPresets.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMedicine(index, 'frequency', preset)}
                          className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Duration, e.g. 14 days"
                      value={medicine.duration}
                      onChange={event => setMedicine(index, 'duration', event.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      {durationPresets.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMedicine(index, 'duration', preset)}
                          className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions & Follow-up</CardTitle>
            <CardDescription>Diet, rest, lifestyle, and next review guidance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {quickGuidance.map(guidance => (
                  <Button
                    key={guidance}
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => appendGuidance(guidance)}
                    disabled={instructions.includes(guidance)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {guidanceLabel(guidance)}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Diet advice, lifestyle recommendations, warning signs, or Ayurvedic guidance..."
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
                rows={6}
              />
            </div>

            <div className="max-w-xs">
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Follow-up Date</label>
              <Input type="date" value={followUpDate} onChange={event => setFollowUpDate(event.target.value)} />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button className="w-full" disabled={loading || !compiledDiagnosis.trim()} onClick={submit}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Prescription...
                </>
              ) : (
                'Save & Email Prescription to Patient'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Live Prescription Preview</CardTitle>
            <CardDescription>Review what the patient will effectively receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl bg-surface p-4">
              <div className="text-sm font-medium text-charcoal">{patientName}</div>
              <div className="mt-1 text-xs text-muted">{patientEmail || 'No email on file'}</div>
              <div className="mt-3 text-xs text-muted">
                Consultation: {appointmentDate} · {appointmentTime}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-charcoal">Doctor</div>
              <Input value={doctorName} readOnly aria-readonly="true" className="bg-white" />
            </div>

            {patientNotes ? (
              <div>
                <div className="mb-2 text-sm font-medium text-charcoal">Booking Notes</div>
                <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                  {patientNotes}
                </div>
              </div>
            ) : null}

            <div>
              <div className="mb-2 text-sm font-medium text-charcoal">Diagnosis Summary</div>
              <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                {compiledDiagnosis || 'Add complaint, findings, or diagnosis details to build the final summary.'}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-charcoal">Medicines Count</div>
              <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted">
                {populatedMedicines.length === 0
                  ? 'No medicines added yet.'
                  : `${populatedMedicines.length} medicine${populatedMedicines.length === 1 ? '' : 's'} ready for this prescription.`}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-charcoal">Patient Instructions</div>
              <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted whitespace-pre-line">
                {compiledInstructions || 'No lifestyle or follow-up instructions added yet.'}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => router.push(`/doctor/appointments/${appointmentId}`)}>
                Back to Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
