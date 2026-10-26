// SAMPLE DATA. Model names and photos follow the current FAW-Volkswagen line-up
// (official images from vw.faw-vw.com, 1580×580 transparent PNG). Prices, specs and
// availability are placeholders until the Philippine-spec data is confirmed.

export type Category = 'sedan' | 'suv' | 'electrified'

export interface KeySpec {
  label: string
  value: string
}

export interface CarModel {
  slug: string
  name: string
  category: Category
  tagline: string
  priceFrom: number
  badges: string[]
  keySpecs: KeySpec[]
  // Transparent cut-out photo, used for hero, cards and menus.
  image: string
}

export const categories: { key: Category; label: string }[] = [
  { key: 'sedan', label: 'Sedans' },
  { key: 'suv', label: 'SUVs' },
  { key: 'electrified', label: 'Electrified' },
]

// WebP generated from the official PNGs by scripts/optimize-images.mjs (~10× smaller).
const img = (slug: string) => `/images/models/${slug}/card.webp`

export const models: CarModel[] = [
  {
    slug: 'talagon',
    name: 'Talagon',
    category: 'suv',
    tagline: 'Seven seats. Zero compromise.',
    priceFrom: 2998000,
    badges: ['Full-size SUV', '7 seats'],
    keySpecs: [
      { label: 'Engine', value: '2.0 TSI' },
      { label: 'Power', value: '162 kW' },
      { label: 'Drive', value: '4MOTION AWD' },
    ],
    image: img('talagon'),
  },
  {
    slug: 'tayron',
    name: 'Tayron L',
    category: 'suv',
    tagline: 'The family SUV that does it all.',
    priceFrom: 2198000,
    badges: ['Mid-size SUV', '5 seats'],
    keySpecs: [
      { label: 'Engine', value: '2.0 TSI' },
      { label: 'Power', value: '137 kW' },
      { label: 'Gearbox', value: '7-speed DSG' },
    ],
    image: img('tayron'),
  },
  {
    slug: 'magotan',
    name: 'Magotan',
    category: 'sedan',
    tagline: 'Executive comfort, redefined.',
    priceFrom: 1898000,
    badges: ['Executive sedan'],
    keySpecs: [
      { label: 'Engine', value: '2.0 TSI' },
      { label: 'Power', value: '137 kW' },
      { label: 'Gearbox', value: '7-speed DSG' },
    ],
    image: img('magotan'),
  },
  {
    slug: 'sagitar',
    name: 'Sagitar L',
    category: 'sedan',
    tagline: 'The confident compact sedan.',
    priceFrom: 1398000,
    badges: ['Compact sedan'],
    keySpecs: [
      { label: 'Engine', value: '1.5 TSI' },
      { label: 'Power', value: '118 kW' },
      { label: 'Gearbox', value: '7-speed DSG' },
    ],
    image: img('sagitar'),
  },
  {
    slug: 'bora',
    name: 'Bora',
    category: 'sedan',
    tagline: 'Smart value for every day.',
    priceFrom: 1098000,
    badges: ['Compact sedan'],
    keySpecs: [
      { label: 'Engine', value: '1.5 L' },
      { label: 'Power', value: '83 kW' },
      { label: 'Gearbox', value: '6-speed AT' },
    ],
    image: img('bora'),
  },
  {
    slug: 'magotan-phev',
    name: 'Magotan PHEV',
    category: 'electrified',
    tagline: 'Plug in for the city, go far on the open road.',
    priceFrom: 2048000,
    badges: ['Plug-in hybrid'],
    keySpecs: [
      { label: 'Combined range', value: '1,510 km (CLTC)' },
      { label: '0–100 km/h', value: '8.2 s' },
      { label: 'Engine', value: '1.5 TSI PHEV' },
    ],
    image: img('magotan-phev'),
  },
  {
    slug: 'id-aura-t6',
    name: 'ID. AURA T6',
    category: 'electrified',
    tagline: 'The all-electric family SUV.',
    priceFrom: 2498000,
    badges: ['Full electric', 'SUV'],
    keySpecs: [
      { label: 'Powertrain', value: 'Battery electric' },
      { label: 'Body', value: 'Mid-size SUV' },
      { label: 'Charging', value: 'DC fast' },
    ],
    image: img('id-aura-t6'),
  },
]

const php = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export function formatPrice(value: number) {
  return php.format(value)
}

export function findModel(slug: string) {
  return models.find((m) => m.slug === slug)
}
