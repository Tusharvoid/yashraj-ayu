import { CLINIC_LOCATIONS, PRIMARY_REVIEW_SOURCE_QUERY } from '@/lib/clinic'

export type TestimonialItem = {
  name: string
  location: string
  stars: number
  text: string
  reviewUrl?: string
}

export type TestimonialsResult = {
  items: TestimonialItem[]
  featuredItems: TestimonialItem[]
  source: 'google' | 'fallback'
  placeName?: string
  placeRating?: number
  userRatingCount?: number
  googleMapsUri?: string
}

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    stars: 5,
    text: "Dr. Bhusanar’s approach is truly holistic and reassuring. From the very first consultation, everything felt personalized, well-structured, and thoughtfully explained. I’ve seen a noticeable improvement in my overall health and energy levels, and I feel much more confident about my long-term well-being.",
  },
  {
    name: 'James Wilson',
    location: 'London, UK',
    stars: 5,
    text: "I traveled to Goa after hearing about the clinic, and it was absolutely worth it. The entire process—from booking to consultation—was seamless, professional, and stress-free. The care and attention to detail really stood out, making the whole experience comfortable and trustworthy.",
  },
  {
    name: 'Anita Reddy',
    location: 'Hyderabad, India',
    stars: 5,
    text: "We had almost lost hope, but the care and guidance we received here changed everything for us. Dr. Bhusanar is incredibly compassionate and takes time to truly understand each concern. The personalized approach made us feel supported at every step of the journey.",
  },
  {
    name: 'Marco Rossi',
    location: 'Milan, Italy',
    stars: 5,
    text: "Even through online consultation, the experience was excellent and highly professional. The guidance was clear, prescriptions were detailed, and the follow-up support was consistent. It truly felt like receiving in-person care despite being in a different country.",
  },
  {
    name: 'Sunita Patil',
    location: 'Pune, India',
    stars: 5,
    text: "The doctor is extremely knowledgeable, patient, and genuinely caring. Every interaction felt comfortable and reassuring, and all our doubts were addressed with clarity. We felt confident and supported throughout the entire treatment process.",
  },
  {
    name: 'Lisa Chen',
    location: 'Singapore',
    stars: 5,
    text: "Professional, trustworthy, and very well-organized. The consultation provided clear direction and practical solutions, helping me understand my health better. I left feeling informed, confident, and positive about the next steps.",
  },
]

const GOOGLE_REVIEWS_REVALIDATE_SECONDS = 60 * 60 * 6

function buildFallbackResult(): TestimonialsResult {
  return {
    items: FALLBACK_TESTIMONIALS,
    featuredItems: FALLBACK_TESTIMONIALS.slice(0, 3),
    source: 'fallback',
  }
}

type GooglePlacesTextSearchResponse = {
  places?: Array<{
    id?: string
    displayName?: { text?: string }
    formattedAddress?: string
  }>
}

type GooglePlaceDetailsResponse = {
  displayName?: { text?: string }
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: Array<{
    rating?: number
    relativePublishTimeDescription?: string
    text?: { text?: string }
    originalText?: { text?: string }
    googleMapsUri?: string
    authorAttribution?: {
      displayName?: string
    }
  }>
}

async function findPlaceId(apiKey: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) {
    return process.env.GOOGLE_PLACE_ID
  }

  const queries = [
    process.env.GOOGLE_PLACE_QUERY,
    PRIMARY_REVIEW_SOURCE_QUERY,
    'Yashraj Clinic Calangute Goa',
    ...CLINIC_LOCATIONS.map((location) => `Yashraj Clinic ${location.address}`),
  ].filter((query): query is string => Boolean(query))

  for (const query of queries) {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
      },
      body: JSON.stringify({ textQuery: query }),
      next: { revalidate: GOOGLE_REVIEWS_REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      continue
    }

    const data = (await response.json()) as GooglePlacesTextSearchResponse
    const match = data.places?.find((place) => {
      const name = place.displayName?.text?.toLowerCase() ?? ''
      const address = place.formattedAddress?.toLowerCase() ?? ''
      return name.includes('yashraj') || address.includes('naikawaddo') || address.includes('calangute')
    })

    if (match?.id) {
      return match.id
    }
  }

  return null
}

export async function getTestimonials(): Promise<TestimonialsResult> {
  if (process.env.YASHRAJ_STATIC_BUILD === '1') {
    return { items: [], featuredItems: [], source: 'fallback' }
  }
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return buildFallbackResult()
  }

  try {
    const placeId = await findPlaceId(apiKey)
    if (!placeId) {
      return buildFallbackResult()
    }

    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
      next: { revalidate: GOOGLE_REVIEWS_REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      return buildFallbackResult()
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse
    const items = (data.reviews ?? [])
      .map((review) => ({
        name: review.authorAttribution?.displayName ?? 'Google Reviewer',
        location: review.relativePublishTimeDescription ?? 'Google Review',
        stars: Math.max(1, Math.min(5, Math.round(review.rating ?? 5))),
        text: review.originalText?.text ?? review.text?.text ?? '',
        reviewUrl: review.googleMapsUri,
      }))
      .filter((review) => review.text)

    if (!items.length) {
      return buildFallbackResult()
    }

    return {
      items,
      featuredItems: items.slice(0, 3),
      source: 'google',
      placeName: data.displayName?.text,
      placeRating: data.rating,
      userRatingCount: data.userRatingCount,
      googleMapsUri: data.googleMapsUri,
    }
  } catch {
    return buildFallbackResult()
  }
}

export const TESTIMONIALS = FALLBACK_TESTIMONIALS
export const FEATURED_TESTIMONIALS = FALLBACK_TESTIMONIALS.slice(0, 3)
