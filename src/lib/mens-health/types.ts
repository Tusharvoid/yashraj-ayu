export type YesNo = 'yes' | 'no'
export type Onset = 'sudden' | 'gradual'
export type Severity = 'mild' | 'moderate' | 'severe'
export type Rigidity = 'poor' | 'moderate' | 'good'
export type EjaculationControl = 'poor' | 'average'
export type SleepQuality = 'poor' | 'average' | 'good'
export type StressLevel = 'low' | 'moderate' | 'high'

export type MensHealthCasePaperInput = {
  patientId: string
  appointmentId?: string
  caseDate: string
  patientInitials?: string
  patientAge?: string
  maritalStatus?: string
  occupation?: string
  contactNumber?: string
  chiefComplaints?: {
    erectileDysfunctionDuration?: string
    prematureEjaculationDuration?: string
    lowLibidoDuration?: string
    infertilityYears?: string
    nightfallOrDhat?: boolean
    other?: string
  }
  presentIllness?: {
    onset?: Onset
    duration?: string
    severity?: Severity
    morningErection?: YesNo
    erectionRigidity?: Rigidity
    erectionMaintain?: YesNo
    ejaculationTime?: string
    ejaculationControl?: EjaculationControl
  }
  sexualHistory?: {
    frequency?: string
    partnerIssues?: YesNo
    pornMasturbationHistory?: string
    performanceAnxiety?: YesNo
  }
  maritalFertilityHistory?: {
    yearsMarried?: string
    tryingForPregnancy?: YesNo
    previousChildren?: YesNo
    wifeEvaluationDone?: YesNo
  }
  medicalHistory?: {
    diabetes?: boolean
    hypertension?: boolean
    thyroid?: boolean
    psychiatricIllness?: boolean
    surgeryHistory?: boolean
    medications?: string
  }
  lifestyleFactors?: {
    smoking?: YesNo
    alcohol?: YesNo
    sleep?: SleepQuality
    stressLevel?: StressLevel
    exercise?: YesNo
  }
  examination?: {
    bp?: string
    pulse?: string
    weight?: string
    bmi?: string
    localExam?: string
  }
  investigations?: {
    bloodSugar?: boolean
    testosterone?: boolean
    semenAnalysis?: boolean
    other?: string
  }
  diagnosis?: string
  treatmentPlan?: {
    counselingDone?: YesNo
    medicinesPrescribed?: string
    lifestyleAdvice?: string
    followUpAfterDays?: string
  }
  confidentialNotes?: string
  consentAcknowledged?: string
  patientSignature?: string
}
