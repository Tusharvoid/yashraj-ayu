'use client'
import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { getTomorrowKey } from '@/lib/appointments/doctor-portal'
import { PRIMARY_CLINIC_PHONE } from '@/lib/clinic'
import {
  buildBookingMessage,
  buildBookingWhatsAppUrl,
  getBookingDetailsError,
  getBookingScheduleError,
  type WhatsAppBooking,
} from '@/lib/booking-whatsapp'
import { ORDERED_SERVICES, TIME_SLOTS } from '@/lib/utils'
import { CheckCircle, MessageCircle } from 'lucide-react'

const stepLabels = ['Your Details', 'Pick a Time', 'WhatsApp']
const fieldLabel = 'text-sm font-medium text-charcoal mb-1.5 block'
const selectStyle =
  'flex w-full rounded-md border border-border bg-panel px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary'

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const [form, setForm] = useState<WhatsAppBooking>({
    name: '',
    email: '',
    phone: '',
    consultationMode: 'In-clinic',
    date: '',
    timeSlot: '',
    service: '',
    notes: '',
  })

  const set = <K extends keyof WhatsAppBooking>(
    key: K,
    value: WhatsAppBooking[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }
  const minDate = getTomorrowKey()
  const changeStep = (next: number) => {
    setError('')
    setStep(next)
    requestAnimationFrame(() => heading.current?.focus())
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const detailsError = getBookingDetailsError(form)
    const scheduleError =
      step > 1 ? getBookingScheduleError(form, getTomorrowKey()) : ''
    if (detailsError || scheduleError) {
      setStep(detailsError ? 1 : 2)
      setError(detailsError || scheduleError)
      return
    }
    if (step < 3) {
      changeStep(step + 1)
      return
    }
    // No API submission, record creation or automatic message sending.
    window.location.assign(buildBookingWhatsAppUrl(form))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ol
        className="mb-8 flex items-center justify-between gap-2"
        aria-label="Booking steps"
      >
        {stepLabels.map((label, index) => (
          <li
            key={label}
            className="flex min-w-0 items-center gap-2"
            aria-current={step === index + 1 ? 'step' : undefined}
          >
            <span
              className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium ${step >= index + 1 ? 'bg-primary text-white' : 'bg-border text-muted'}`}
              aria-hidden="true"
            >
              {step > index + 1 ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={`text-sm hidden sm:block ${step === index + 1 ? 'text-charcoal font-medium' : 'text-muted'}`}
            >
              {label}
            </span>
            <span className="sr-only sm:hidden">{label}</span>
          </li>
        ))}
      </ol>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <h2
              ref={heading}
              tabIndex={-1}
              className="text-lg font-semibold text-charcoal mb-4"
            >
              {step === 1
                ? 'Your Details'
                : step === 2
                  ? 'Pick a Date & Time'
                  : 'Review Your WhatsApp Request'}
            </h2>
            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {step === 1 && (
              <>
                <div>
                  <label htmlFor="booking-name" className={fieldLabel}>
                    Full Name *
                  </label>
                  <Input
                    id="booking-name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="booking-phone" className={fieldLabel}>
                    Phone Number (optional)
                  </label>
                  <Input
                    id="booking-phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={25}
                    placeholder="+91 or international"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="booking-email" className={fieldLabel}>
                    Email Address (optional)
                  </label>
                  <Input
                    id="booking-email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="booking-service" className={fieldLabel}>
                    Consultation / Service
                  </label>
                  <select
                    id="booking-service"
                    className={selectStyle}
                    value={form.service}
                    onChange={(e) => set('service', e.target.value)}
                  >
                    <option value="">
                      General consultation / help me choose
                    </option>
                    {ORDERED_SERVICES.map((service) => (
                      <option key={service.slug} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="booking-mode" className={fieldLabel}>
                    Consultation Type
                  </label>
                  <select
                    id="booking-mode"
                    className={selectStyle}
                    value={form.consultationMode}
                    onChange={(e) =>
                      set(
                        'consultationMode',
                        e.target.value as WhatsAppBooking['consultationMode'],
                      )
                    }
                  >
                    <option value="In-clinic">In-clinic visit</option>
                    <option value="Online">Online consultation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="booking-notes" className={fieldLabel}>
                    Consultation Message (optional)
                  </label>
                  <Textarea
                    id="booking-notes"
                    maxLength={1000}
                    aria-describedby="booking-notes-help"
                    placeholder="What would you like to discuss?"
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                  />
                  <p
                    id="booking-notes-help"
                    className="text-xs text-muted mt-2"
                  >
                    This will be included in your WhatsApp message. Share only
                    details you are comfortable sending.
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-muted">
                  Choose your preferred slot. All times are in Goa time (IST,
                  UTC+05:30). Availability is confirmed by the clinic on
                  WhatsApp.
                </p>
                <div>
                  <label htmlFor="booking-date" className={fieldLabel}>
                    Preferred Date *
                  </label>
                  <Input
                    id="booking-date"
                    type="date"
                    required
                    min={minDate}
                    max="9999-12-31"
                    value={form.date}
                    onChange={(e) => set('date', e.target.value)}
                  />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium text-charcoal mb-3">
                    Preferred Time *
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        aria-pressed={form.timeSlot === slot}
                        onClick={() => set('timeSlot', slot)}
                        className={`min-h-11 py-2 px-3 rounded-md text-sm border transition-colors ${form.timeSlot === slot ? 'bg-primary text-white border-primary' : 'border-border text-charcoal hover:border-primary/50'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-sm text-muted">
                  To Yashraj Clinic · {PRIMARY_CLINIC_PHONE}
                </p>
                <div
                  className="bg-surface rounded-lg p-4 text-sm whitespace-pre-wrap [overflow-wrap:anywhere]"
                  aria-label="WhatsApp message preview"
                >
                  {buildBookingMessage(form)}
                </div>
                <p className="text-sm text-muted">
                  Continue to WhatsApp, review the message and tap Send. Your
                  appointment is only confirmed when the clinic replies.
                </p>
                <p className="text-xs text-muted">
                  Your details will be passed to WhatsApp when you continue.
                  This form does not save a booking on the website or send an
                  email.
                </p>
              </>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => changeStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button type="submit" className="w-full sm:flex-1">
                {step === 3 && <MessageCircle size={18} aria-hidden="true" />}
                {step === 3 ? 'Continue to WhatsApp' : 'Continue'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
