// Home page content: hero slides, promos (to be confirmed) and brand facts from fawcar.com.
export { news } from './content'

export interface HeroSlide {
  model: string
  eyebrow: string
  headline: string
  copy: string
}

// The three JOYEE models launched in the Philippines (October 2026) lead, then two BESTUNE.
// Figures are from each model's fawcar.com specification sheet.
export const heroSlides: HeroSlide[] = [
  {
    model: 'joyee-n09',
    eyebrow: 'New in the Philippines',
    headline: 'Electric, your way: EREV or BEV.',
    copy: 'Up to 565 km of CLTC electric range, or 1,400 km combined with the range extender. Inside: a 15.6-inch screen and 23 speakers.',
  },
  {
    model: 'joyee-s08',
    eyebrow: 'New in the Philippines',
    headline: 'Plug in for the city. Go far beyond.',
    copy: 'A plug-in hybrid family SUV with 210 km of CLTC electric range, 168 kW and a 590 L trunk.',
  },
  {
    model: 'joyee-s04',
    eyebrow: 'New in the Philippines',
    headline: 'The enjoyable urban electric SUV.',
    copy: 'Up to 565 km of CLTC range, a 14.6-inch touchscreen and 3.3 kW vehicle-to-load for camping trips and brownouts.',
  },
  {
    model: 'bestune-b70',
    eyebrow: 'BESTUNE',
    headline: 'Ultra-safe smart luxury sedan.',
    copy: '1.5T or 2.0T turbo power, a power liftback tailgate and available L2+ driver assistance.',
  },
  {
    model: 'bestune-t90',
    eyebrow: 'BESTUNE',
    headline: 'Technology that enhances life.',
    copy: 'A five-seat SUV with up to 185 kW from its 2.0T engine and 8-speed automatic, and six airbags as standard.',
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

// Programs to be confirmed by the distributor: the structure is kept, figures are not stated.
export const promos: Promo[] = [
  {
    slug: 'low-down-payment',
    tag: 'Financing',
    title: 'Low all-in down payment',
    copy: 'Drive home your FAWCAR with flexible financing from partner banks.',
    details: [
      'All-in down payment and terms: to be confirmed',
      'Partner banks: to be confirmed',
      'Ask your dealer for a computation for your chosen variant',
    ],
    validUntil: '2026-12-31',
    models: 'All models',
  },
  {
    slug: 'free-pms',
    tag: 'After-sales',
    title: 'Free PMS package',
    copy: 'Preventive maintenance at authorized FAWCAR dealers.',
    details: [
      'Coverage period and mileage: to be confirmed',
      'Genuine parts and labor at authorized dealers',
      'Participating models: to be confirmed',
    ],
    validUntil: '2026-12-31',
    models: 'To be confirmed',
  },
  {
    slug: 'trade-in-bonus',
    tag: 'Trade-in',
    title: 'Trade-in bonus',
    copy: 'Upgrade from your current car and get extra value on top of the appraisal.',
    details: [
      'Bonus amount: to be confirmed',
      'Free on-site appraisal at participating showrooms',
      'Any brand accepted, subject to inspection',
    ],
    validUntil: '2026-12-31',
    models: 'All models',
  },
]

// Company facts as published on fawcar.com (About FAWCAR). Its cumulative-sales counter
// ("209 Million+") is left out: it reads like a mistranslation of 209万 (2.09 million).
export const brandStats = [
  { value: '1997', label: 'FAW Car Co., Ltd. listed' },
  { value: '2006', label: 'Brand founded' },
  { value: '40+', label: 'Countries in the sales network' },
  { value: '4', label: 'R&D cities in China and Germany' },
]
