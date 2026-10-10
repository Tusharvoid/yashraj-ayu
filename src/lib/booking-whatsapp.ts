import { PRIMARY_CLINIC_WHATSAPP } from '@/lib/clinic'
import { TIME_SLOTS } from '@/lib/utils'

export type WhatsAppBooking = {
  name: string
  email: string
  phone: string
  consultationMode: 'In-clinic' | 'Online'
  date: string
  timeSlot: string
  service: string
  notes: string
}

export function getBookingDetailsError(form: WhatsAppBooking) {
  if (!form.name.trim()) return 'Please enter your name.'
  if (
    form.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    return 'Please enter a valid email address or leave it blank.'
  }
  if (
    form.phone.trim() &&
    (!/^\+?[\d\s().-]+$/.test(form.phone.trim()) ||
      !/^\d{7,15}$/.test(form.phone.replace(/\D/g, '')))
  ) {
    return 'Please enter a phone number with 7 to 15 digits or leave it blank.'
  }
  return ''
}

export function getBookingScheduleError(
  form: WhatsAppBooking,
  minDate: string,
) {
  const date = new Date(`${form.date}T00:00:00Z`)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(form.date) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== form.date ||
    form.date < minDate
  )
    return 'Please choose a date from tomorrow onwards.'
  if (!TIME_SLOTS.includes(form.timeSlot))
    return 'Please choose a preferred time.'
  return ''
}

export function buildBookingMessage(form: WhatsAppBooking) {
  const date = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${form.date}T00:00:00Z`))

  return [
    'Hello Yashraj Clinic, I would like to request a consultation.',
    '',
    `Name: ${form.name.trim()}`,
    ...(form.phone.trim() ? [`Phone: ${form.phone.trim()}`] : []),
    ...(form.email.trim() ? [`Email: ${form.email.trim()}`] : []),
    `Consultation: ${form.service || 'General consultation'}`,
    `Consultation type: ${form.consultationMode}`,
    `Preferred date: ${date}`,
    `Preferred time: ${form.timeSlot} IST (Goa, UTC+05:30)`,
    ...(form.notes.trim() ? ['', `Message: ${form.notes.trim()}`] : []),
    '',
    'Please confirm availability and let me know the next steps. Thank you.',
  ].join('\n')
}

export function buildBookingWhatsAppUrl(form: WhatsAppBooking) {
  return `https://wa.me/${PRIMARY_CLINIC_WHATSAPP}?text=${encodeURIComponent(buildBookingMessage(form))}`
}
