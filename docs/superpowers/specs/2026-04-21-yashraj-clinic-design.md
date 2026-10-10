# Yashraj Clinic — New Site Design Spec
**Date:** 2026-04-21

## Stack
- Next.js 15 App Router, TypeScript, standalone Docker output
- PostgreSQL 16 + Drizzle ORM
- Resend (email)
- Jitsi as a Service via `8x8.vc` (embedded production video rooms)
- Clerk (auth — doctor protected routes + patient magic links)
- Tailwind CSS + shadcn/ui
- Docker Compose: postgres + app + nginx
- Cloudflare DNS/CDN/SSL in front of VPS

## Routes
### Marketing
`/` `/about` `/services` `/services/[slug]` `/gallery` `/testimonials` `/contact` `/book`

### Patient Portal
`/patient/appointments` `/patient/appointments/[id]` `/patient/prescriptions/[id]`

### Doctor Portal (Clerk-protected)
`/doctor` `/doctor/appointments` `/doctor/appointments/[id]` `/doctor/prescriptions/new` `/doctor/patients`

### Video
`/room/[appointmentId]` — Jitsi as a Service embedded room

## Database Schema
- patients, doctors, appointments, prescriptions, email_logs

## Appointment Flow
1. Patient books → Resend confirmation email + Jitsi room assigned
2. Doctor confirms → second email to patient with join link
3. Both join /room/[id] → video call
4. Doctor writes prescription → patient emailed PDF link

## Colors
- Background: #FFFFFF, Surface: #F9F7F4
- Primary: #2D6A4F (green), Accent: #C9861C (gold)
- Text: #1C1C1C, Muted: #6B7280, Border: #E8E4DF
