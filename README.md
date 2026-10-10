This is a [Next.js](https://nextjs.org) project for Yashraj Clinic.

## Combined Yashraj website

- `/`: two clickable cards for choosing a website.
- `/clinic`: fertility, sexual-health and general-care website.
- `/ayurveda`: bundled Ayurvedic website, including its therapy pages and videos.
- `/book`: WhatsApp booking request with consultation, date, time and message.
  Visitors send the message themselves; the clinic confirms availability.

This replaces the previous static-only root of `Tusharvoid/yashraj-ayu`.
The former site is preserved under `public/ayurveda` and in Git history.

**Hosting migration:** this repository now requires a Next.js runtime. The old
static Cloudflare Pages upload/build settings are not sufficient. The existing
OpenNext configuration targets Cloudflare Workers (`npm run cf:build`,
`npm run cf:deploy`); review `wrangler.jsonc` for the intended Worker name,
self-reference binding and domain before deploying. No Cloudflare settings or
domains are changed by committing this code. A connected Git integration may
automatically attempt a build when `main` is pushed.

Public WhatsApp booking needs no database. Staff/patient features are separate:
do not enable them with real patient data until the documented authorization
and patient-record access issues in `docs/design-revamp.md` are resolved.

## Getting Started

First, configure the required environment variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
JITSI_JAAS_APP_ID=...
JITSI_JAAS_KID=...
JITSI_JAAS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JITSI_PATIENT_LINK_SECRET=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For local development, put these values in `.env.local` and restart the server.
Do not commit credentials. `/doctor` is the staff portal; `/doctors` is the public
team page. If Clerk is not configured, the staff portal redirects to the sign-in
setup screen. Actual dashboard use also requires PostgreSQL and the database
schema. The existing doctor-role authorization fallback must be secured before
using real patient data.

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
