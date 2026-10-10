'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type PatientOption = {
  id: string
  name: string
  email: string
  phone: string | null
}

type Props = {
  patients: PatientOption[]
  prefilledPatientId?: string
  prefilledAppointmentId?: string
}

type Choice = 'yes' | 'no'

export default function MensHealthCasePaperForm({
  patients,
  prefilledPatientId,
  prefilledAppointmentId,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ id: string; emailSent: boolean } | null>(null)

  const [patientId, setPatientId] = useState(prefilledPatientId ?? '')
  const [caseDate, setCaseDate] = useState(new Date().toISOString().slice(0, 10))
  const [patientInitials, setPatientInitials] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [occupation, setOccupation] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [edDuration, setEdDuration] = useState('')
  const [peDuration, setPeDuration] = useState('')
  const [lowLibidoDuration, setLowLibidoDuration] = useState('')
  const [infertilityYears, setInfertilityYears] = useState('')
  const [nightfallOrDhat, setNightfallOrDhat] = useState(false)
  const [otherComplaint, setOtherComplaint] = useState('')
  const [onset, setOnset] = useState<'sudden' | 'gradual' | ''>('')
  const [illnessDuration, setIllnessDuration] = useState('')
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | ''>('')
  const [morningErection, setMorningErection] = useState<Choice>('yes')
  const [rigidity, setRigidity] = useState<'poor' | 'moderate' | 'good'>('moderate')
  const [maintain, setMaintain] = useState<Choice>('yes')
  const [ejaculationTime, setEjaculationTime] = useState('')
  const [ejaculationControl, setEjaculationControl] = useState<'poor' | 'average'>('average')
  const [frequency, setFrequency] = useState('')
  const [partnerIssues, setPartnerIssues] = useState<Choice>('no')
  const [pornHistory, setPornHistory] = useState('')
  const [performanceAnxiety, setPerformanceAnxiety] = useState<Choice>('no')
  const [yearsMarried, setYearsMarried] = useState('')
  const [tryingForPregnancy, setTryingForPregnancy] = useState<Choice>('no')
  const [previousChildren, setPreviousChildren] = useState<Choice>('no')
  const [wifeEvaluationDone, setWifeEvaluationDone] = useState<Choice>('no')
  const [diabetes, setDiabetes] = useState(false)
  const [hypertension, setHypertension] = useState(false)
  const [thyroid, setThyroid] = useState(false)
  const [psychiatricIllness, setPsychiatricIllness] = useState(false)
  const [surgeryHistory, setSurgeryHistory] = useState(false)
  const [medications, setMedications] = useState('')
  const [smoking, setSmoking] = useState<Choice>('no')
  const [alcohol, setAlcohol] = useState<Choice>('no')
  const [sleep, setSleep] = useState<'poor' | 'average' | 'good'>('average')
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('moderate')
  const [exercise, setExercise] = useState<Choice>('no')
  const [bp, setBp] = useState('')
  const [pulse, setPulse] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState('')
  const [localExam, setLocalExam] = useState('')
  const [bloodSugar, setBloodSugar] = useState(false)
  const [testosterone, setTestosterone] = useState(false)
  const [semenAnalysis, setSemenAnalysis] = useState(false)
  const [otherInvestigations, setOtherInvestigations] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [counselingDone, setCounselingDone] = useState<Choice>('yes')
  const [medicinesPrescribed, setMedicinesPrescribed] = useState('')
  const [lifestyleAdvice, setLifestyleAdvice] = useState('')
  const [followUpAfterDays, setFollowUpAfterDays] = useState('')
  const [confidentialNotes, setConfidentialNotes] = useState('')
  const [patientSignature, setPatientSignature] = useState('')

  const selectedPatient = useMemo(() => patients.find(patient => patient.id === patientId), [patients, patientId])

  async function submit() {
    if (!patientId) {
      setError('Please select a patient.')
      return
    }

    setLoading(true)
    setError(null)

    const response = await fetch('/api/mens-health-case-papers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        appointmentId: prefilledAppointmentId || undefined,
        caseDate,
        patientInitials,
        patientAge,
        maritalStatus,
        occupation,
        contactNumber,
        chiefComplaints: {
          erectileDysfunctionDuration: edDuration,
          prematureEjaculationDuration: peDuration,
          lowLibidoDuration,
          infertilityYears,
          nightfallOrDhat,
          other: otherComplaint,
        },
        presentIllness: {
          onset: onset || undefined,
          duration: illnessDuration,
          severity: severity || undefined,
          morningErection,
          erectionRigidity: rigidity,
          erectionMaintain: maintain,
          ejaculationTime,
          ejaculationControl,
        },
        sexualHistory: {
          frequency,
          partnerIssues,
          pornMasturbationHistory: pornHistory,
          performanceAnxiety,
        },
        maritalFertilityHistory: {
          yearsMarried,
          tryingForPregnancy,
          previousChildren,
          wifeEvaluationDone,
        },
        medicalHistory: {
          diabetes,
          hypertension,
          thyroid,
          psychiatricIllness,
          surgeryHistory,
          medications,
        },
        lifestyleFactors: {
          smoking,
          alcohol,
          sleep,
          stressLevel,
          exercise,
        },
        examination: {
          bp,
          pulse,
          weight,
          bmi,
          localExam,
        },
        investigations: {
          bloodSugar,
          testosterone,
          semenAnalysis,
          other: otherInvestigations,
        },
        diagnosis,
        treatmentPlan: {
          counselingDone,
          medicinesPrescribed,
          lifestyleAdvice,
          followUpAfterDays,
        },
        confidentialNotes,
        consentAcknowledged: 'yes',
        patientSignature,
      }),
    })

    const data = await response.json().catch(() => null)
    setLoading(false)

    if (!response.ok) {
      setError(data?.error ?? 'Could not save case paper.')
      return
    }

    setDone({ id: data.id, emailSent: Boolean(data.emailSent) })
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Case Paper Saved</CardTitle>
          <CardDescription>
            PDF has been generated. Email delivery status: {done.emailSent ? 'sent' : 'failed (check mail credentials)'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={`/api/mens-health-case-papers/${done.id}?mode=pdf`} target="_blank" rel="noreferrer">Download PDF</a>
          </Button>
          <Button variant="outline" onClick={() => router.push('/doctor')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Men&apos;s Health OPD Case Paper</CardTitle>
          <CardDescription>Fill all relevant details and send PDF copy to patient email.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Patient</label>
            <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={patientId} onChange={(event) => setPatientId(event.target.value)}>
              <option value="">Select patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name} ({patient.email})</option>
              ))}
            </select>
            {selectedPatient ? <p className="mt-1 text-xs text-muted">{selectedPatient.phone ? `Phone: ${selectedPatient.phone}` : 'No phone on file'}</p> : null}
          </div>
          <div><label className="mb-1 block text-sm font-medium">Date</label><Input type="date" value={caseDate} onChange={event => setCaseDate(event.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Name (Initials)</label><Input value={patientInitials} onChange={event => setPatientInitials(event.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Age</label><Input value={patientAge} onChange={event => setPatientAge(event.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Marital Status</label><Input value={maritalStatus} onChange={event => setMaritalStatus(event.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Occupation</label><Input value={occupation} onChange={event => setOccupation(event.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Contact Number</label><Input value={contactNumber} onChange={event => setContactNumber(event.target.value)} /></div>
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Chief Complaints</CardTitle></CardHeader><CardContent className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Input placeholder="ED duration" value={edDuration} onChange={event => setEdDuration(event.target.value)} />
        <Input placeholder="PE duration" value={peDuration} onChange={event => setPeDuration(event.target.value)} />
        <Input placeholder="Low libido duration" value={lowLibidoDuration} onChange={event => setLowLibidoDuration(event.target.value)} />
        <Input placeholder="Infertility years" value={infertilityYears} onChange={event => setInfertilityYears(event.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={nightfallOrDhat} onChange={event => setNightfallOrDhat(event.target.checked)} />Nightfall / Dhat syndrome</label>
        <Input placeholder="Other complaint" value={otherComplaint} onChange={event => setOtherComplaint(event.target.value)} />
      </CardContent></Card>

      <Card><CardHeader><CardTitle>History, Sexual & Fertility</CardTitle></CardHeader><CardContent className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={onset} onChange={event => setOnset(event.target.value as 'sudden' | 'gradual' | '')}>
          <option value="">Onset</option>
          <option value="sudden">Sudden</option>
          <option value="gradual">Gradual</option>
        </select>
        <Input placeholder="Duration" value={illnessDuration} onChange={event => setIllnessDuration(event.target.value)} />
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={severity} onChange={event => setSeverity(event.target.value as 'mild' | 'moderate' | 'severe' | '')}>
          <option value="">Severity</option>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={morningErection} onChange={event => setMorningErection(event.target.value as Choice)}>
          <option value="yes">Morning erection: Yes</option>
          <option value="no">Morning erection: No</option>
        </select>
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={rigidity} onChange={event => setRigidity(event.target.value as 'poor' | 'moderate' | 'good')}>
          <option value="poor">Rigidity: Poor</option>
          <option value="moderate">Rigidity: Moderate</option>
          <option value="good">Rigidity: Good</option>
        </select>
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={maintain} onChange={event => setMaintain(event.target.value as Choice)}>
          <option value="yes">Maintain erection: Yes</option>
          <option value="no">Maintain erection: No</option>
        </select>
        <Input placeholder="Ejaculation time" value={ejaculationTime} onChange={event => setEjaculationTime(event.target.value)} />
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={ejaculationControl} onChange={event => setEjaculationControl(event.target.value as 'poor' | 'average')}>
          <option value="poor">Control: Poor</option>
          <option value="average">Control: Average</option>
        </select>
        <Input placeholder="Frequency" value={frequency} onChange={event => setFrequency(event.target.value)} />
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={partnerIssues} onChange={event => setPartnerIssues(event.target.value as Choice)}>
          <option value="no">Partner issues: No</option>
          <option value="yes">Partner issues: Yes</option>
        </select>
        <Input placeholder="Porn/masturbation history" value={pornHistory} onChange={event => setPornHistory(event.target.value)} />
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={performanceAnxiety} onChange={event => setPerformanceAnxiety(event.target.value as Choice)}>
          <option value="no">Performance anxiety: No</option>
          <option value="yes">Performance anxiety: Yes</option>
        </select>
        <Input placeholder="Years married" value={yearsMarried} onChange={event => setYearsMarried(event.target.value)} />
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={tryingForPregnancy} onChange={event => setTryingForPregnancy(event.target.value as Choice)}>
          <option value="no">Trying for pregnancy: No</option>
          <option value="yes">Trying for pregnancy: Yes</option>
        </select>
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={previousChildren} onChange={event => setPreviousChildren(event.target.value as Choice)}>
          <option value="no">Previous children: No</option>
          <option value="yes">Previous children: Yes</option>
        </select>
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={wifeEvaluationDone} onChange={event => setWifeEvaluationDone(event.target.value as Choice)}>
          <option value="no">Wife evaluation done: No</option>
          <option value="yes">Wife evaluation done: Yes</option>
        </select>
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Medical, Lifestyle, Examination</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={diabetes} onChange={event => setDiabetes(event.target.checked)} />Diabetes</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hypertension} onChange={event => setHypertension(event.target.checked)} />Hypertension</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={thyroid} onChange={event => setThyroid(event.target.checked)} />Thyroid</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={psychiatricIllness} onChange={event => setPsychiatricIllness(event.target.checked)} />Psychiatric illness</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={surgeryHistory} onChange={event => setSurgeryHistory(event.target.checked)} />Surgery history</label>
        </div>
        <Input placeholder="Medications" value={medications} onChange={event => setMedications(event.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={smoking} onChange={event => setSmoking(event.target.value as Choice)}>
            <option value="no">Smoking: No</option>
            <option value="yes">Smoking: Yes</option>
          </select>
          <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={alcohol} onChange={event => setAlcohol(event.target.value as Choice)}>
            <option value="no">Alcohol: No</option>
            <option value="yes">Alcohol: Yes</option>
          </select>
          <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={sleep} onChange={event => setSleep(event.target.value as 'poor' | 'average' | 'good')}>
            <option value="poor">Sleep: Poor</option>
            <option value="average">Sleep: Average</option>
            <option value="good">Sleep: Good</option>
          </select>
          <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={stressLevel} onChange={event => setStressLevel(event.target.value as 'low' | 'moderate' | 'high')}>
            <option value="low">Stress: Low</option>
            <option value="moderate">Stress: Moderate</option>
            <option value="high">Stress: High</option>
          </select>
          <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={exercise} onChange={event => setExercise(event.target.value as Choice)}>
            <option value="no">Exercise: No</option>
            <option value="yes">Exercise: Yes</option>
          </select>
          <Input placeholder="BP" value={bp} onChange={event => setBp(event.target.value)} />
          <Input placeholder="Pulse" value={pulse} onChange={event => setPulse(event.target.value)} />
          <Input placeholder="Weight" value={weight} onChange={event => setWeight(event.target.value)} />
          <Input placeholder="BMI" value={bmi} onChange={event => setBmi(event.target.value)} />
        </div>
        <Textarea placeholder="Genital/local exam notes" value={localExam} onChange={event => setLocalExam(event.target.value)} rows={3} />
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Investigations, Diagnosis & Plan</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bloodSugar} onChange={event => setBloodSugar(event.target.checked)} />Blood sugar</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={testosterone} onChange={event => setTestosterone(event.target.checked)} />Testosterone</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={semenAnalysis} onChange={event => setSemenAnalysis(event.target.checked)} />Semen analysis</label>
        </div>
        <Input placeholder="Other investigations" value={otherInvestigations} onChange={event => setOtherInvestigations(event.target.value)} />
        <Textarea placeholder="Provisional diagnosis" value={diagnosis} onChange={event => setDiagnosis(event.target.value)} rows={3} />
        <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={counselingDone} onChange={event => setCounselingDone(event.target.value as Choice)}>
          <option value="yes">Counseling done: Yes</option>
          <option value="no">Counseling done: No</option>
        </select>
        <Textarea placeholder="Medicines prescribed" value={medicinesPrescribed} onChange={event => setMedicinesPrescribed(event.target.value)} rows={2} />
        <Textarea placeholder="Lifestyle advice" value={lifestyleAdvice} onChange={event => setLifestyleAdvice(event.target.value)} rows={2} />
        <Input placeholder="Follow-up after days" value={followUpAfterDays} onChange={event => setFollowUpAfterDays(event.target.value)} />
        <Textarea placeholder="Confidential doctor notes" value={confidentialNotes} onChange={event => setConfidentialNotes(event.target.value)} rows={3} />
        <Input placeholder="Patient signature" value={patientSignature} onChange={event => setPatientSignature(event.target.value)} />
      </CardContent></Card>

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <Button className="w-full sm:w-auto" disabled={loading} onClick={submit}>
        {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Saving & Emailing PDF...</>) : 'Save Men’s Health Case Paper'}
      </Button>
    </div>
  )
}
