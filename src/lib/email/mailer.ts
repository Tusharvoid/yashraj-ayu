import nodemailer from 'nodemailer'
import {
  PRIMARY_CLINIC_ADDRESS,
  PRIMARY_CLINIC_EMAIL,
  PRIMARY_CLINIC_PHONE,
  PRIMARY_DOCTOR,
} from '@/lib/clinic'

const FROM = `"Yashraj Clinic" <${process.env.GMAIL_USER}>`

type MedicineRow = {
  name: string
  dosage: string
  frequency: string
  duration: string
}

type MailAttachment = {
  filename: string
  content: Buffer
  contentType?: string
}

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000'
}

function getLogoUrl() {
  return `${getAppUrl()}/yashrajlogo.png`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

function renderDetailCard(items: Array<{ label: string; value: string }>) {
  return `
    <div style="background:#f8f3ea;border:1px solid #eadfce;border-radius:18px;padding:20px 22px;margin:24px 0;">
      ${items.map(item => `
        <div style="padding:${item === items[0] ? '0 0 12px' : '12px 0'};${item !== items[items.length - 1] ? 'border-bottom:1px solid #e7dbc8;' : ''}">
          <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7f73;font-weight:700;margin-bottom:4px;">
            ${escapeHtml(item.label)}
          </div>
          <div style="font-size:15px;line-height:1.6;color:#2d2a26;">
            ${escapeHtml(item.value)}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function renderButton(label: string, href: string, tone: 'primary' | 'accent' = 'primary') {
  const background = tone === 'accent' ? '#c9861c' : '#2d6a4f'

  return `
    <div style="margin-top:28px;">
      <a
        href="${href}"
        style="display:inline-block;background:${background};color:#ffffff;padding:14px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.01em;"
      >
        ${escapeHtml(label)}
      </a>
    </div>
  `
}

function renderEmailShell(opts: {
  eyebrow: string
  title: string
  intro: string
  body: string
}) {
  return `
    <div style="margin:0;padding:32px 16px;background:#f4efe7;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e8dfd2;border-radius:28px;overflow:hidden;box-shadow:0 16px 40px rgba(59,45,28,0.08);">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#214f3d 0%,#2d6a4f 52%,#3b8463 100%);text-align:center;">
          <img
            src="${getLogoUrl()}"
            alt="Yashraj Clinic"
            width="72"
            height="72"
            style="display:block;margin:0 auto 16px;background:#ffffff;border-radius:50%;padding:10px;object-fit:contain;"
          />
          <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#cfe4d6;font-weight:700;">
            ${escapeHtml(opts.eyebrow)}
          </div>
          <h1 style="margin:14px 0 8px;font-size:28px;line-height:1.2;color:#ffffff;font-family:Georgia,'Times New Roman',serif;">
            ${escapeHtml(opts.title)}
          </h1>
          <p style="margin:0 auto;max-width:460px;font-size:15px;line-height:1.7;color:#e5f1e9;">
            ${escapeHtml(opts.intro)}
          </p>
        </div>

        <div style="padding:32px;">
          ${opts.body}
        </div>

        <div style="padding:22px 32px;background:#fbf8f3;border-top:1px solid #ece4d8;">
          <div style="font-size:13px;line-height:1.8;color:#6d6358;">
            <strong style="color:#2d2a26;">Yashraj Clinic</strong><br />
            ${escapeHtml(PRIMARY_CLINIC_ADDRESS)}<br />
            ${escapeHtml(PRIMARY_CLINIC_PHONE)} · ${escapeHtml(PRIMARY_CLINIC_EMAIL)}
          </div>
        </div>
      </div>
    </div>
  `
}

async function send(to: string, subject: string, html: string, attachments?: MailAttachment[]) {
  const transporter = getTransporter()
  if (!transporter) {
    console.error('[Mailer] GMAIL_USER or GMAIL_APP_PASSWORD not set')
    return false
  }
  try {
    await transporter.sendMail({ from: FROM, to, subject, html, attachments })
    return true
  } catch (err: unknown) {
    console.error('[Mailer] email failed:', err instanceof Error ? err.message : err)
    return false
  }
}

export async function sendBookingConfirmation(opts: {
  patientName: string
  patientEmail: string
  date: string
  timeSlot: string
  appointmentId: string
}) {
  await send(
    opts.patientEmail,
    'Appointment Booking Confirmed — Yashraj Clinic',
    renderEmailShell({
      eyebrow: 'Appointment Request Received',
      title: 'Your Booking Is In Review',
      intro: 'We have received your appointment request and the clinic will confirm the slot shortly.',
      body: `
        <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#3d372f;">
          Dear <strong>${escapeHtml(opts.patientName)}</strong>,
        </p>
        <p style="margin:0;font-size:15px;line-height:1.8;color:#3d372f;">
          Your appointment request has been recorded successfully. Once ${escapeHtml(PRIMARY_DOCTOR.name)} confirms the consultation, we will send the next email with your joining details and visit guidance.
        </p>
        ${renderDetailCard([
          { label: 'Consultation Date', value: opts.date },
          { label: 'Time Slot', value: opts.timeSlot },
          { label: 'Mode', value: 'Clinic website video consultation' },
        ])}
        <p style="margin:0;font-size:14px;line-height:1.8;color:#6d6358;">
          You can review the booking status anytime using your appointment page below.
        </p>
        ${renderButton('View Appointment', `${getAppUrl()}/patient/appointments/${opts.appointmentId}`)}
      `,
    })
  )
}

export async function sendDoctorBookingAlert(opts: {
  patientName: string
  patientEmail: string
  date: string
  timeSlot: string
  service?: string
  notes?: string
  appointmentId: string
}) {
  const doctorEmail = process.env.GMAIL_USER ?? PRIMARY_CLINIC_EMAIL

  await send(
    doctorEmail,
    `New Appointment Request — ${opts.patientName}`,
    renderEmailShell({
      eyebrow: 'Doctor Alert',
      title: 'A New Appointment Needs Review',
      intro: 'A patient has requested a new consultation slot and is waiting for doctor action.',
      body: `
        <p style="margin:0;font-size:15px;line-height:1.8;color:#3d372f;">
          Please review this booking request from the doctor portal and confirm or reject it.
        </p>
        ${renderDetailCard([
          { label: 'Patient Name', value: opts.patientName },
          { label: 'Patient Email', value: opts.patientEmail },
          { label: 'Requested Date', value: opts.date },
          { label: 'Requested Time', value: opts.timeSlot },
          ...(opts.service ? [{ label: 'Service', value: opts.service }] : []),
          ...(opts.notes ? [{ label: 'Notes', value: opts.notes }] : []),
        ])}
        ${renderButton('Review Appointment', `${getAppUrl()}/doctor/appointments/${opts.appointmentId}`)}
      `,
    })
  )
}

export async function sendAppointmentConfirmedEmail(opts: {
  patientName: string
  patientEmail: string
  date: string
  timeSlot: string
  appointmentId: string
  joinUrl: string
}) {
  await send(
    opts.patientEmail,
    'Your Video Consultation is Confirmed — Yashraj Clinic',
    renderEmailShell({
      eyebrow: 'Consultation Confirmed',
      title: 'Your Video Visit Is Ready',
      intro: 'Your appointment has been approved and your consultation room is now available.',
      body: `
        <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#3d372f;">
          Dear <strong>${escapeHtml(opts.patientName)}</strong>,
        </p>
        <p style="margin:0;font-size:15px;line-height:1.8;color:#3d372f;">
          ${escapeHtml(PRIMARY_DOCTOR.name)} has confirmed your video consultation. Please join from the clinic website at the scheduled time using the secure room link below.
        </p>
        ${renderDetailCard([
          { label: 'Consultation Date', value: opts.date },
          { label: 'Time Slot', value: opts.timeSlot },
          { label: 'Mode', value: 'Secure website consultation room' },
        ])}
        <p style="margin:0;font-size:14px;line-height:1.8;color:#6d6358;">
          Please keep your camera and microphone permissions enabled before joining.
        </p>
        ${renderButton('Join Video Consultation', opts.joinUrl, 'accent')}
      `,
    })
  )
}

export async function sendAppointmentRescheduledEmail(opts: {
  patientName: string
  patientEmail: string
  oldDate: string
  oldTimeSlot: string
  newDate: string
  newTimeSlot: string
  appointmentId: string
}) {
  await send(
    opts.patientEmail,
    'Your Appointment Has Been Rescheduled — Yashraj Clinic',
    renderEmailShell({
      eyebrow: 'Schedule Updated',
      title: 'Your Appointment Time Has Changed',
      intro: 'The clinic has updated your consultation schedule. Please review the new appointment timing below.',
      body: `
        <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#3d372f;">
          Dear <strong>${escapeHtml(opts.patientName)}</strong>,
        </p>
        <p style="margin:0;font-size:15px;line-height:1.8;color:#3d372f;">
          ${escapeHtml(PRIMARY_DOCTOR.name)} has rescheduled your appointment. Please use the updated consultation slot below going forward.
        </p>
        ${renderDetailCard([
          { label: 'Previous Slot', value: `${opts.oldDate} · ${opts.oldTimeSlot}` },
          { label: 'New Slot', value: `${opts.newDate} · ${opts.newTimeSlot}` },
          { label: 'Mode', value: 'Clinic website consultation' },
        ])}
        <p style="margin:0;font-size:14px;line-height:1.8;color:#6d6358;">
          Your appointment page will always show the latest confirmed timing and visit details.
        </p>
        ${renderButton('View Updated Appointment', `${getAppUrl()}/patient/appointments/${opts.appointmentId}`)}
      `,
    })
  )
}

export async function sendPrescriptionEmail(opts: {
  patientName: string
  patientEmail: string
  diagnosis: string
  medicines: MedicineRow[]
  instructions: string
  followUpDate?: string
  prescriptionId: string
}) {
  const medicineTable = opts.medicines.length
    ? `
      <div style="margin-top:24px;border:1px solid #eadfce;border-radius:18px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">
          <thead style="background:#f8f3ea;">
            <tr>
              <th style="padding:12px 14px;text-align:left;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#7b6f61;">Medicine</th>
              <th style="padding:12px 14px;text-align:left;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#7b6f61;">Dosage</th>
              <th style="padding:12px 14px;text-align:left;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#7b6f61;">Frequency</th>
              <th style="padding:12px 14px;text-align:left;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#7b6f61;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${opts.medicines.map(medicine => `
              <tr>
                <td style="padding:12px 14px;border-top:1px solid #efe5d8;font-size:14px;color:#3d372f;">${escapeHtml(medicine.name)}</td>
                <td style="padding:12px 14px;border-top:1px solid #efe5d8;font-size:14px;color:#3d372f;">${escapeHtml(medicine.dosage || 'As advised')}</td>
                <td style="padding:12px 14px;border-top:1px solid #efe5d8;font-size:14px;color:#3d372f;">${escapeHtml(medicine.frequency || 'As advised')}</td>
                <td style="padding:12px 14px;border-top:1px solid #efe5d8;font-size:14px;color:#3d372f;">${escapeHtml(medicine.duration || 'As advised')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    : `
      <div style="margin-top:24px;border:1px solid #eadfce;border-radius:18px;padding:18px;background:#fbf8f3;font-size:14px;color:#6d6358;">
        No medicine list was added to this prescription.
      </div>
    `

  await send(
    opts.patientEmail,
    'Your Prescription — Yashraj Clinic',
    renderEmailShell({
      eyebrow: 'Prescription Issued',
      title: 'Your Treatment Plan Is Ready',
      intro: 'Your consultation has been completed and your prescription is now available online.',
      body: `
        <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#3d372f;">
          Dear <strong>${escapeHtml(opts.patientName)}</strong>,
        </p>
        <p style="margin:0;font-size:15px;line-height:1.8;color:#3d372f;">
          Please review the prescription details below and continue your medicines exactly as advised by ${escapeHtml(PRIMARY_DOCTOR.name)}.
        </p>
        ${renderDetailCard([
          { label: 'Diagnosis', value: opts.diagnosis },
          ...(opts.followUpDate ? [{ label: 'Follow-up Date', value: opts.followUpDate }] : []),
        ])}
        ${medicineTable}
        ${opts.instructions ? `
          <div style="margin-top:24px;">
            <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7f73;font-weight:700;margin-bottom:8px;">
              Instructions
            </div>
            <div style="border:1px solid #eadfce;border-radius:18px;padding:18px;background:#fbf8f3;font-size:14px;line-height:1.8;color:#3d372f;">
              ${nl2br(opts.instructions)}
            </div>
          </div>
        ` : ''}
        ${renderButton('View Full Prescription', `${getAppUrl()}/patient/prescriptions/${opts.prescriptionId}`)}
      `,
    })
  )
}

export async function sendMensHealthCasePaperEmail(opts: {
  patientName: string
  patientEmail: string
  caseDate: string
  diagnosis?: string
  pdfBuffer: Buffer
  casePaperId: string
}) {
  return send(
    opts.patientEmail,
    'Men’s Health OPD Case Paper — Yashraj Clinic',
    renderEmailShell({
      eyebrow: 'Case Paper Issued',
      title: 'Your Men’s Health Case Paper Is Ready',
      intro: 'Your doctor has prepared your OPD case paper and attached it as a PDF for your records.',
      body: `
        <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#3d372f;">
          Dear <strong>${escapeHtml(opts.patientName)}</strong>,
        </p>
        <p style="margin:0;font-size:15px;line-height:1.8;color:#3d372f;">
          Please find your men’s health OPD case paper attached with this email. Keep this document confidential and carry it during your follow-up visits.
        </p>
        ${renderDetailCard([
          { label: 'Case Date', value: opts.caseDate },
          { label: 'Provisional Diagnosis', value: opts.diagnosis || 'As discussed during consultation' },
          { label: 'Case Paper Reference', value: opts.casePaperId },
        ])}
      `,
    }),
    [{
      filename: `mens-health-case-paper-${opts.casePaperId}.pdf`,
      content: opts.pdfBuffer,
      contentType: 'application/pdf',
    }]
  )
}
