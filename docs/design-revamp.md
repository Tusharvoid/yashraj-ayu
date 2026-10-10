# Public website redesign

The public clinic now takes its visual direction from the sibling
`ghpages-yashraj-ayu` site: near-black surfaces, restrained gold accents,
serif headlines, real clinic photography and consistent section spacing.

## Structure

- `/` is now a standalone two-card website chooser. `/clinic` preserves the
  fertility and sexual-health homepage; its navigation and breadcrumbs point
  there. The clinic footer links back to the chooser.
- Both chooser cards are full-card links with no separate visit buttons.
  `/clinic` opens the clinical site; `/ayurveda` serves the locally bundled
  Ayurvedic site on the same domain, via an internal rewrite to its index HTML.
- `public/ayurveda` contains a standalone copy of the sibling Ayurvedic site's
  seven HTML pages and assets. Its base URL keeps assets and navigation under
  `/ayurveda/`; its footers return to the chooser. The source sibling is unchanged.
  Use a normal anchor for the static HTML site (not Next.js client navigation).
- `src/app/marketing.css`: public design system, responsive layouts and dark tokens.
- `src/app/(marketing)/layout.tsx`: theme scope, shared navigation, footer and skip link.
- `PageIntro` and `ConsultationCTA`: shared inner-page patterns.
- `ServicesSection`: featured home services and the searchable/filterable catalogue.
- Existing service data, clinical team, booking APIs, gallery uploads and vision
  image storage remain the sources of content.
- The design reference supplies visual styling only, not Ayurvedic branding.
  The hero uses the existing illustrative consultation photo; the story section
  shows a real blood pressure assessment from the clinic. Actual doctor
  qualifications remain unchanged; the reference project is untouched.

Public theme variables are scoped to `.marketing-shell`. Shared card and form
controls use a semantic panel colour that remains white in clinical workspaces.
The doctor and patient portals retain their existing light presentation.

## Content and behaviour

- Updated shared contact information to the supplied Benson Complex address;
  removed the obsolete Almita branch.
- Added the Rudransh Cortex footer credit.
- Testimonials show Google-sourced reviews when available; otherwise a link to
  the clinic listing is shown instead of the unverified hard-coded fallback.
- Navigation supports mobile disclosure, Escape dismissal, active-page labels
  and visible keyboard focus.
- Public booking now hands off to WhatsApp at the shared clinic number. The
  visitor reviews their name, optional contact details, service, consultation
  mode, date, time (IST) and optional message before opening WhatsApp, then taps
  Send there. Date/time and contact validation run before the handoff.
- Public booking does not POST to the appointments API, save a patient record,
  send an email or claim an appointment is confirmed. The clinic confirms the
  request in WhatsApp. Existing staff/patient APIs are unchanged.
- WhatsApp message/URL regression checks: `node --import tsx --test tests/booking-whatsapp.test.ts`.
- Browser regression checks (requires Python Playwright and localhost:3000):
  `python tests/booking-whatsapp.browser.py`. These intercept WhatsApp navigation
  and assert that no appointment API request or real WhatsApp message is sent.
- Vision images have manual previous/next controls rather than timed autoplay.

## Verification

- Production Next.js build and TypeScript checks passed.
- All ten public route samples responded successfully at 390px and 1440px.
- Additional home layout checks at 320px, 768px, 1024px and 1200px found no
  horizontal document overflow.
- Browser checks covered mobile navigation, Escape, category filters, search,
  empty results, gallery pagination and the booking steps.
- Booking success/failure requests were intercepted in the browser: no real
  appointment, patient record or email was created.
- Automated axe checks on home, booking, services, a service detail, contact and
  doctors found no WCAG 2 A/AA or WCAG 2.1 AA violations. This is not a substitute
  for a complete manual accessibility audit.

## Before production use

This was a visual revamp, not a security remediation or deployment.
The previously identified doctor-role fallback and unauthenticated patient
record lookup remain launch blockers for real patient data. Configure and test
Clerk, PostgreSQL, email and Jitsi separately. Without a database the build logs
the existing site-settings fallback warning; it still completes.

The initial redesign was local-only. Subsequent user-authorized publication
combined both websites in `Tusharvoid/yashraj-ayu` on `main`.

## Cloudflare Pages export

`npm run build:pages` now produces a public-only `dist/` artifact. Its committed
copy supports the existing no-build Pages deployment; `wrangler.jsonc` declares
that output directory. Do not upload the repository root as website assets.

The original full-stack app remains in source and Docker; its Worker config is
`wrangler.worker.jsonc`. No private routes or API handlers are exported to Pages.
Gallery pagination runs locally, booking hands off to WhatsApp, and no Clerk or
database setup is required for public visitors. Dynamic vision uploads and live
Google review fetching remain server-only features.

To test the exported files, serve `dist/` on port 3001, set `SITE_TEST_ORIGIN` to
`http://127.0.0.1:3001`, then run `tests/site-entry.browser.py`,
`tests/booking-whatsapp.browser.py` and `tests/pages-export.browser.py` with Python.
