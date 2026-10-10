import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildBookingMessage,
  buildBookingWhatsAppUrl,
  getBookingDetailsError,
  getBookingScheduleError,
  type WhatsAppBooking,
} from '../src/lib/booking-whatsapp'

const booking: WhatsAppBooking = {
  name: 'Test Visitor',
  email: '',
  phone: '',
  consultationMode: 'In-clinic',
  date: '2030-10-12',
  timeSlot: '10:00 AM',
  service: '',
  notes: '',
}

test('optional contact fields and general consultation work', () => {
  assert.equal(getBookingDetailsError(booking), '')
  assert.equal(getBookingScheduleError(booking, '2030-10-11'), '')
  const message = buildBookingMessage(booking)
  assert.match(message, /Consultation: General consultation/)
  assert.match(message, /Consultation type: In-clinic/)
  assert.match(message, /Preferred date: 12 October 2030/)
  assert.match(message, /10:00 AM IST \(Goa, UTC\+05:30\)/)
  assert.doesNotMatch(message, /Email:|Phone:|undefined/)
})

test('all details and special characters survive the WhatsApp URL', () => {
  const filled: WhatsAppBooking = {
    ...booking,
    name: ' Test & Visitor ',
    email: 'test+booking@example.com',
    phone: '+91 90000 00000',
    service: 'Homeopathic Consultation & Medicines',
    consultationMode: 'Online',
    notes: 'Question & follow-up? #1 + details\nनमस्ते 👋',
  }
  const url = new URL(buildBookingWhatsAppUrl(filled))
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/919011932151')
  assert.equal(url.searchParams.size, 1)
  assert.equal(url.searchParams.get('text'), buildBookingMessage(filled))
  assert.match(url.searchParams.get('text')!, /Consultation type: Online/)
  assert.match(url.searchParams.get('text')!, /Please confirm availability/)
  assert.ok(url.searchParams.get('text')!.includes(filled.notes))
})

test('invalid name, email, phone, date or time is rejected', () => {
  for (const invalid of [
    { name: ' ' },
    { email: 'invalid' },
    { phone: '123' },
    { phone: 'abc123456789' },
  ]) {
    assert.notEqual(getBookingDetailsError({ ...booking, ...invalid }), '')
  }
  for (const date of ['', 'not-a-date', '2030-02-30', '2030-10-10']) {
    assert.notEqual(
      getBookingScheduleError({ ...booking, date }, '2030-10-11'),
      '',
    )
  }
  for (const timeSlot of ['', '99:00 AM']) {
    assert.notEqual(
      getBookingScheduleError({ ...booking, timeSlot }, '2030-10-11'),
      '',
    )
  }
})
