export type ClinicLocation = {
  label: string
  address: string
  mapUrl: string
}

export const CLINIC_TIME_ZONE = 'Asia/Kolkata'

const buildGoogleMapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

/** Single line for cards, footer, emails (brand name is shown separately where needed). */
export const CLINIC_STREET_ADDRESS =
  'Shop No. CS-4, Ground Floor, Benson Complex, Opp. SBI Bank, Naikawaddo, Calangute, Goa 403516'

/** Full query for Maps links and matching Google reviews to the practice location. */
export const PRIMARY_REVIEW_SOURCE_QUERY = `Yashraj Clinic, ${CLINIC_STREET_ADDRESS}`

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    label: 'Clinic',
    address: CLINIC_STREET_ADDRESS,
    mapUrl: buildGoogleMapsSearchUrl(PRIMARY_REVIEW_SOURCE_QUERY),
  },
]

export const PRIMARY_CLINIC_ADDRESS = CLINIC_STREET_ADDRESS

export const PRIMARY_CLINIC_MAP_OPEN_URL = CLINIC_LOCATIONS[0].mapUrl

export const CLINIC_PHONES = ['+91 9011932151', '+91 9637711394']

export const CLINIC_EMAILS = ['rajubhusanar@gmail.com']

export const PRIMARY_CLINIC_PHONE = CLINIC_PHONES[0]

export const PRIMARY_CLINIC_PHONE_HREF = PRIMARY_CLINIC_PHONE.replace(/\s+/g, '')

export const PRIMARY_CLINIC_WHATSAPP = PRIMARY_CLINIC_PHONE_HREF.replace(/^\+/, '')

export const PRIMARY_CLINIC_WHATSAPP_MESSAGE =
  'Hi, I would like to book a consultation. Please share the available details.'

export const PRIMARY_CLINIC_WHATSAPP_URL =
  `https://wa.me/${PRIMARY_CLINIC_WHATSAPP}?text=${encodeURIComponent(PRIMARY_CLINIC_WHATSAPP_MESSAGE)}`

export const PRIMARY_CLINIC_EMAIL = CLINIC_EMAILS[0]

export const PRIMARY_DOCTOR = {
  name: 'Dr. Raju Bhusanar',
  title: 'B.A.M.S · Sexologist · Ayurvedacharya',
  summary: 'Leads the clinic with a personal approach to sexual health consultations, fertility guidance, general consultations, and follow-up care.',
  image: '/clinical-team/dr-raju-bhusnar.jpeg',
}

export type ClinicalTeamMember = {
  name: string
  role: string
  image: string
  focus?: string
}

export const CLINICAL_TEAM: ClinicalTeamMember[] = [
  {
    name: 'Dr. Raju Bhusanar',
    role: 'B.A.M.S · Sexologist · Ayurvedacharya',
    image: '/clinical-team/dr-raju-bhusnar.jpeg',
    focus: 'Leads the clinic with a personal approach to sexual health consultations, fertility guidance, general consultations, and follow-up care.',
  },
  {
    name: 'Dr. Punam Raju Bhusanar',
    role: 'General Physician · Secretary',
    image: '/clinical-team/dr-punam-raju-bhusanar.jpeg',
  },
  {
    name: 'Dr. Vardhan Bhobe',
    role: 'MS Surgeon · General Surgery',
    image: '/clinical-team/dr-vardhan-bhobe.jpeg',
  },
  {
    name: 'Dr. Anil Kumar Vaidhya',
    role: 'MD (Kayachikitsa)',
    image: '/clinical-team/dr-anil-kumar-vaidhya.jpeg',
  },
  {
    name: 'Dr. Sarika Swapnil Arsekar',
    role: 'MBBS, MD, DNB · Obstetrics & Gynaecology',
    image: '/clinical-team/dr-sarika-swapnil-arsekar.jpeg',
  },
  {
    name: 'Dr. Sachin Arun Ambre',
    role: 'MS, MCh (AIIMS) · Cancer & Onco-surgery',
    image: '/clinical-team/dr-sachin-arun-ambre.jpeg',
  },
  {
    name: 'Dr. Suraj Rane',
    role: 'MS, MCh · Plastic & Reconstructive Surgery',
    image: '/clinical-team/dr-suraj-rane.jpeg',
  },
  {
    name: 'Dr. Amruta Dinkar',
    role: 'MBBS, DVD · Dermatologist & Cosmetologist',
    image: '/clinical-team/dr-amruta-dinkar.jpeg',
  },
  {
    name: 'Dr. Ketan Naik',
    role: 'MS Orthopaedics, MRCS (Glasgow)',
    image: '/clinical-team/dr-ketan-naik.jpeg',
  },
  {
    name: 'Dr. Jayesh Rane',
    role: 'MBBS, MS · ENT',
    image: '/clinical-team/dr-jayesh-rane.jpeg',
  },
  {
    name: 'Mayuri Hoble',
    role: 'DHL, BASLP · Audiologist',
    image: '/clinical-team/mayuri-hoble.jpeg',
  },
  {
    name: 'Dr. Nikhil',
    role: 'Physiotherapist',
    image: '/clinical-team/dr-nikhil.jpeg',
  },
  {
    name: 'Dr. Manoja Chodankar',
    role: 'BHMS · Homoeopathy',
    image: '/clinical-team/dr-manoja-chodankar.jpeg',
  },
  {
    name: 'Dr. Saiel A. Kumarjuvekar',
    role: 'MS (Ortho), FIJR',
    image: '/clinical-team/dr-saiel-a-kumarjuvekar.jpeg',
  },
  {
    name: 'Dr. Ajit Shinde',
    role: 'BDS · Implantologist',
    image: '/clinical-team/dr-ajit-shinde.jpeg',
  },
  {
    name: 'Shridhar Katkar',
    role: 'Pathologist',
    image: '/clinical-team/shridhar-katkar.jpeg',
  },
  {
    name: 'Yaashiika Y Sawant',
    role: 'MA Yogshastra',
    image: '/clinical-team/yaashiika-y-sawant.jpg',
  },
  {
    name: 'Dr. Sahil M.K.',
    role: 'Consultant Physiotherapist',
    image: '/clinical-team/dr-sahil-mk.jpg',
  },
]
