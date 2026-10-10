import { pgTable, text, timestamp, uuid, json, pgEnum, boolean, integer } from 'drizzle-orm/pg-core'

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled',
])

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const doctors = pgTable('doctors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  specialty: text('specialty').default('Ayurvedic Medicine'),
  clerkUserId: text('clerk_user_id').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  doctorId: uuid('doctor_id').references(() => doctors.id),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  status: appointmentStatusEnum('status').default('pending').notNull(),
  jitsiRoomUrl: text('daily_room_url'),
  jitsiRoomName: text('daily_room_name'),
  patientNotes: text('patient_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const prescriptions = pgTable('prescriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id').references(() => appointments.id).notNull(),
  doctorId: uuid('doctor_id').references(() => doctors.id).notNull(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  diagnosis: text('diagnosis').notNull(),
  medicines: json('medicines').$type<Array<{ name: string; dosage: string; frequency: string; duration: string }>>().notNull().default([]),
  instructions: text('instructions'),
  followUpDate: text('follow_up_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const mensHealthCasePapers = pgTable('mens_health_case_papers', {
  id: uuid('id').primaryKey().defaultRandom(),
  doctorId: uuid('doctor_id').references(() => doctors.id).notNull(),
  patientId: uuid('patient_id').references(() => patients.id).notNull(),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  caseDate: text('case_date').notNull(),
  patientInitials: text('patient_initials'),
  patientAge: text('patient_age'),
  maritalStatus: text('marital_status'),
  occupation: text('occupation'),
  contactNumber: text('contact_number'),
  chiefComplaints: json('chief_complaints').$type<{
    erectileDysfunctionDuration?: string
    prematureEjaculationDuration?: string
    lowLibidoDuration?: string
    infertilityYears?: string
    nightfallOrDhat?: boolean
    other?: string
  }>().notNull().default({}),
  presentIllness: json('present_illness').$type<{
    onset?: 'sudden' | 'gradual'
    duration?: string
    severity?: 'mild' | 'moderate' | 'severe'
    morningErection?: 'yes' | 'no'
    erectionRigidity?: 'poor' | 'moderate' | 'good'
    erectionMaintain?: 'yes' | 'no'
    ejaculationTime?: string
    ejaculationControl?: 'poor' | 'average'
  }>().notNull().default({}),
  sexualHistory: json('sexual_history').$type<{
    frequency?: string
    partnerIssues?: 'yes' | 'no'
    pornMasturbationHistory?: string
    performanceAnxiety?: 'yes' | 'no'
  }>().notNull().default({}),
  maritalFertilityHistory: json('marital_fertility_history').$type<{
    yearsMarried?: string
    tryingForPregnancy?: 'yes' | 'no'
    previousChildren?: 'yes' | 'no'
    wifeEvaluationDone?: 'yes' | 'no'
  }>().notNull().default({}),
  medicalHistory: json('medical_history').$type<{
    diabetes?: boolean
    hypertension?: boolean
    thyroid?: boolean
    psychiatricIllness?: boolean
    surgeryHistory?: boolean
    medications?: string
  }>().notNull().default({}),
  lifestyleFactors: json('lifestyle_factors').$type<{
    smoking?: 'yes' | 'no'
    alcohol?: 'yes' | 'no'
    sleep?: 'poor' | 'average' | 'good'
    stressLevel?: 'low' | 'moderate' | 'high'
    exercise?: 'yes' | 'no'
  }>().notNull().default({}),
  examination: json('examination').$type<{
    bp?: string
    pulse?: string
    weight?: string
    bmi?: string
    localExam?: string
  }>().notNull().default({}),
  investigations: json('investigations').$type<{
    bloodSugar?: boolean
    testosterone?: boolean
    semenAnalysis?: boolean
    other?: string
  }>().notNull().default({}),
  diagnosis: text('diagnosis'),
  treatmentPlan: json('treatment_plan').$type<{
    counselingDone?: 'yes' | 'no'
    medicinesPrescribed?: string
    lifestyleAdvice?: string
    followUpAfterDays?: string
  }>().notNull().default({}),
  confidentialNotes: text('confidential_notes'),
  consentAcknowledged: text('consent_acknowledged').default('yes').notNull(),
  patientSignature: text('patient_signature'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const emailLogs = pgTable('email_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  type: text('type').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  status: text('status').default('sent'),
})

export type Patient = typeof patients.$inferSelect
export type Doctor = typeof doctors.$inferSelect
export type Appointment = typeof appointments.$inferSelect
export type Prescription = typeof prescriptions.$inferSelect
export type MensHealthCasePaper = typeof mensHealthCasePapers.$inferSelect

export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  videoPopupEnabled: boolean('video_popup_enabled').default(false).notNull(),
  videoPopupUrl: text('video_popup_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type SiteSetting = typeof siteSettings.$inferSelect

export const visionImages = pgTable('vision_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  sortOrder: integer('sort_order').notNull().default(0),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  contentBase64: text('content_base64').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type VisionImageRow = typeof visionImages.$inferSelect
