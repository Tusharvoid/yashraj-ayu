import { PRIMARY_CLINIC_ADDRESS, PRIMARY_CLINIC_PHONE, PRIMARY_DOCTOR } from '@/lib/clinic'
import type { MensHealthCasePaperInput } from '@/lib/mens-health/types'

function toSafe(value: unknown) {
  if (value === undefined || value === null || value === '') return 'N/A'
  return String(value)
}

function yesNo(value?: boolean) {
  return value ? 'Yes' : 'No'
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function splitLine(value: string, max = 95) {
  const words = value.trim().split(/\s+/)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > max) {
      if (line) lines.push(line)
      line = word
    } else {
      line = next
    }
  }

  if (line) lines.push(line)
  return lines.length ? lines : ['N/A']
}

function buildTextRows(casePaper: MensHealthCasePaperInput, patientName: string) {
  const rows: string[] = [
    'YASHRAJ CLINIC - MEN\'S HEALTH OPD CASE PAPER',
    `Doctor: ${PRIMARY_DOCTOR.name}`,
    `Patient: ${toSafe(patientName)} | Date: ${toSafe(casePaper.caseDate)}`,
    '',
    '1. Basic Details',
    `Initials: ${toSafe(casePaper.patientInitials)} | Age: ${toSafe(casePaper.patientAge)} | Marital status: ${toSafe(casePaper.maritalStatus)}`,
    `Occupation: ${toSafe(casePaper.occupation)} | Contact: ${toSafe(casePaper.contactNumber)}`,
    '',
    '2. Chief Complaints',
    `ED: ${toSafe(casePaper.chiefComplaints?.erectileDysfunctionDuration)} | PE: ${toSafe(casePaper.chiefComplaints?.prematureEjaculationDuration)} | Low libido: ${toSafe(casePaper.chiefComplaints?.lowLibidoDuration)}`,
    `Infertility years: ${toSafe(casePaper.chiefComplaints?.infertilityYears)} | Nightfall/Dhat: ${casePaper.chiefComplaints?.nightfallOrDhat ? 'Yes' : 'No'}`,
    `Other: ${toSafe(casePaper.chiefComplaints?.other)}`,
    '',
    '3. History of Present Illness',
    `Onset: ${toSafe(casePaper.presentIllness?.onset)} | Duration: ${toSafe(casePaper.presentIllness?.duration)} | Severity: ${toSafe(casePaper.presentIllness?.severity)}`,
    `Morning erection: ${toSafe(casePaper.presentIllness?.morningErection)} | Rigidity: ${toSafe(casePaper.presentIllness?.erectionRigidity)} | Maintain: ${toSafe(casePaper.presentIllness?.erectionMaintain)}`,
    `Ejaculation time: ${toSafe(casePaper.presentIllness?.ejaculationTime)} | Control: ${toSafe(casePaper.presentIllness?.ejaculationControl)}`,
    '',
    '4. Sexual History',
    `Frequency: ${toSafe(casePaper.sexualHistory?.frequency)} | Partner issues: ${toSafe(casePaper.sexualHistory?.partnerIssues)}`,
    `Porn/masturbation history: ${toSafe(casePaper.sexualHistory?.pornMasturbationHistory)} | Performance anxiety: ${toSafe(casePaper.sexualHistory?.performanceAnxiety)}`,
    '',
    '5. Marital & Fertility History',
    `Years married: ${toSafe(casePaper.maritalFertilityHistory?.yearsMarried)} | Trying for pregnancy: ${toSafe(casePaper.maritalFertilityHistory?.tryingForPregnancy)}`,
    `Previous children: ${toSafe(casePaper.maritalFertilityHistory?.previousChildren)} | Wife evaluation done: ${toSafe(casePaper.maritalFertilityHistory?.wifeEvaluationDone)}`,
    '',
    '6. Medical History',
    `Diabetes: ${yesNo(casePaper.medicalHistory?.diabetes)} | Hypertension: ${yesNo(casePaper.medicalHistory?.hypertension)} | Thyroid: ${yesNo(casePaper.medicalHistory?.thyroid)}`,
    `Psychiatric illness: ${yesNo(casePaper.medicalHistory?.psychiatricIllness)} | Surgery history: ${yesNo(casePaper.medicalHistory?.surgeryHistory)}`,
    `Medications: ${toSafe(casePaper.medicalHistory?.medications)}`,
    '',
    '7. Lifestyle Factors',
    `Smoking: ${toSafe(casePaper.lifestyleFactors?.smoking)} | Alcohol: ${toSafe(casePaper.lifestyleFactors?.alcohol)} | Sleep: ${toSafe(casePaper.lifestyleFactors?.sleep)}`,
    `Stress level: ${toSafe(casePaper.lifestyleFactors?.stressLevel)} | Exercise: ${toSafe(casePaper.lifestyleFactors?.exercise)}`,
    '',
    '8. General Examination',
    `BP: ${toSafe(casePaper.examination?.bp)} | Pulse: ${toSafe(casePaper.examination?.pulse)} | Weight: ${toSafe(casePaper.examination?.weight)} | BMI: ${toSafe(casePaper.examination?.bmi)}`,
    '',
    '9. Systemic / Local Examination',
    `Genital exam: ${toSafe(casePaper.examination?.localExam)}`,
    '',
    '10. Investigations',
    `Blood sugar: ${yesNo(casePaper.investigations?.bloodSugar)} | Testosterone: ${yesNo(casePaper.investigations?.testosterone)} | Semen analysis: ${yesNo(casePaper.investigations?.semenAnalysis)}`,
    `Other: ${toSafe(casePaper.investigations?.other)}`,
    '',
    '11. Diagnosis (Provisional)',
    toSafe(casePaper.diagnosis),
    '',
    '12. Treatment Plan',
    `Counseling done: ${toSafe(casePaper.treatmentPlan?.counselingDone)} | Follow-up after days: ${toSafe(casePaper.treatmentPlan?.followUpAfterDays)}`,
    `Medicines prescribed: ${toSafe(casePaper.treatmentPlan?.medicinesPrescribed)}`,
    `Lifestyle advice: ${toSafe(casePaper.treatmentPlan?.lifestyleAdvice)}`,
    '',
    '13. Confidential Notes (Doctor Only)',
    toSafe(casePaper.confidentialNotes),
    '',
    '14. Consent',
    `Confidentiality acknowledged: ${toSafe(casePaper.consentAcknowledged || 'Yes')} | Signature: ${toSafe(casePaper.patientSignature)}`,
    '',
    `Clinic Contact: ${PRIMARY_CLINIC_PHONE}`,
    `Clinic Address: ${PRIMARY_CLINIC_ADDRESS}`,
  ]

  return rows.flatMap(line => splitLine(line))
}

export function buildMensHealthCasePaperPdf(casePaper: MensHealthCasePaperInput, patientName: string) {
  const rows = buildTextRows(casePaper, patientName)
  const textLines = rows
    .map((line, index) => `BT /F1 10 Tf 42 ${800 - index * 14} Td (${escapePdfText(line)}) Tj ET`)
    .join('\n')

  const contentStream = `${textLines}\n`
  const contentLength = Buffer.byteLength(contentStream, 'utf-8')

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${contentLength} >> stream\n${contentStream}endstream endobj`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'))
    pdf += `${object}\n`
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf-8')
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return Buffer.from(pdf, 'utf-8')
}
