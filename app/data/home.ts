// SAMPLE home page content (hero, promos, brand facts). Replace with real campaigns.
export { news } from './content'

export interface HeroSlide {
  model: string
  eyebrow: string
  headline: string
  copy: string
}

export const heroSlides: HeroSlide[] = [
  {
    model: 'talagon',
    eyebrow: 'Flagship SUV',
    headline: 'Room for the whole barkada.',
    copy: 'Three rows, seven seats and 4MOTION all-wheel drive for every road from Manila to Mindanao.',
  },
  {
    model: 'magotan-phev',
    eyebrow: 'Plug-in Hybrid',
    headline: 'Electric in the city. Unstoppable beyond.',
    copy: 'Commute on electric power, then cruise past 1,000 km on a single tank and charge.',
  },
  {
    model: 'id-aura-t6',
    eyebrow: 'Full Electric SUV',
    headline: 'Electric, the Volkswagen way.',
    copy: 'Quiet, spacious and fully electric, with fast charging for long weekends out of the city.',
  },
  {
    model: 'sagitar',
    eyebrow: 'Compact Sedan',
    headline: 'German engineering, everyday confidence.',
    copy: 'Turbocharged efficiency, a refined cabin and safety tech you can count on.',
  },
]

export interface Promo {
  slug: string
  tag: string
  title: string
  copy: string
  details: string[]
  validUntil: string
  models: string
}

export const promos: Promo[] = [
  {
    slug: 'low-down-payment',
    tag: 'Financing',
    title: 'Low all-in down payment',
    copy: 'Drive home your Volkswagen with flexible bank financing from partner banks.',
    details: [
      'All-in down payment from 20% of the vehicle price',
      'Terms of 12 to 60 months with partner banks',
      'Fast approval: pre-qualify online in minutes',
    ],
    validUntil: '2026-12-31',
    models: 'All models',
  },
  {
    slug: 'free-pms',
    tag: 'After-sales',
    title: 'Free 3-year PMS package',
    copy: 'Preventive maintenance at any authorized service center, on us.',
    details: [
      'Covers scheduled preventive maintenance for 3 years or 30,000 km',
      'Genuine parts, oil and labor included',
      'Redeemable at any authorized FAW-VW service center',
    ],
    validUntil: '2026-12-31',
    models: 'Talagon, Tayron L, Magotan',
  },
  {
    slug: 'trade-in-bonus',
    tag: 'Trade-in',
    title: 'Trade-in bonus',
    copy: 'Upgrade from your current car and get extra value on top of the appraisal.',
    details: [
      'Additional trade-in bonus on top of the appraised value',
      'Free on-site appraisal at any showroom',
      'Any brand accepted, subject to inspection',
    ],
    validUntil: '2026-12-31',
    models: 'All models',
  },
]

// Group facts as published on faw-vw.com.
export const brandStats = [
  { value: '1991', label: 'Founded in Changchun' },
  { value: '5', label: 'Production bases' },
  { value: '30M+', label: 'Vehicle owners' },
  { value: '30+', label: 'Models produced' },
]
