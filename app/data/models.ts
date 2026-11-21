// FAWCAR line-up: China FAW passenger cars (JOYEE and BESTUNE) as listed on fawcar.com,
// GCC-market versions where several markets are listed. Specifications are in
// app/data/fawcar/<slug>.json (read by specs.ts); photos are fawcar.com originals
// converted by scripts/process-fawcar-photos.mjs. No prices: Philippine prices come from
// the dealers, so every model links to a quote request instead.

export type Category = 'sedan' | 'suv' | 'mpv' | 'city'
export type Brand = 'JOYEE' | 'BESTUNE'
export type Powertrain = 'EV' | 'EREV' | 'PHEV' | 'MHEV' | 'Gasoline'

export interface KeySpec {
  label: string
  value: string
}

export interface CarModel {
  slug: string
  name: string
  brand: Brand
  category: Category
  // Body type shown on cards ("Compact SUV").
  body: string
  powertrains: Powertrain[]
  // Model line from fawcar.com.
  tagline: string
  // Shown at the Philippine launch (World Trade Center Manila, 22 October 2026).
  launchedPH: boolean
  // From the spec sheet (specs.ts `cardSpecs`; the unit tests check they match).
  keySpecs: KeySpec[]
  // Transparent side-view cut-out, used for cards, menus and the studio view (920 × 459).
  image: string
}

export const categories: { key: Category; label: string }[] = [
  { key: 'sedan', label: 'Sedans' },
  { key: 'suv', label: 'SUVs' },
  { key: 'mpv', label: 'MPV' },
  { key: 'city', label: 'City cars' },
]

export const powertrainLabels: Record<Powertrain, string> = {
  EV: 'Electric',
  EREV: 'Range-extended electric',
  PHEV: 'Plug-in hybrid',
  MHEV: '48V mild hybrid',
  Gasoline: 'Gasoline',
}

export const powertrainLabel = (m: CarModel) => m.powertrains.map((p) => powertrainLabels[p]).join(' / ')

// Coarse grouping for menus ("Electric / Hybrid / Gasoline" under each body type).
export type PowertrainGroup = 'electric' | 'hybrid' | 'gasoline'
export const powertrainGroups: { key: PowertrainGroup; label: string }[] = [
  { key: 'electric', label: 'Electric' },
  { key: 'hybrid', label: 'Hybrid' },
  { key: 'gasoline', label: 'Gasoline' },
]
export function powertrainGroup(m: CarModel): PowertrainGroup {
  if (m.powertrains.some((p) => p === 'EV' || p === 'EREV')) return 'electric'
  if (m.powertrains.some((p) => p === 'PHEV' || p === 'MHEV')) return 'hybrid'
  return 'gasoline'
}

// Models of one body type, grouped by powertrain (empty groups left out).
export function modelsByPowertrain(category: Category) {
  const inCategory = models.filter((m) => m.category === category)
  return powertrainGroups
    .map((g) => ({ ...g, models: inCategory.filter((m) => powertrainGroup(m) === g.key) }))
    .filter((g) => g.models.length)
}

export const isCategory = (v: unknown): v is Category => categories.some((c) => c.key === v)

const img = (slug: string) => `/images/models/${slug}/card.webp`

export const models: CarModel[] = [
  {
    slug: 'joyee-n09',
    name: 'JOYEE N09',
    brand: 'JOYEE',
    category: 'sedan',
    body: 'Electric sedan',
    powertrains: ['EREV', 'EV'],
    tagline: 'Next-gen tech-luxury family coupe',
    launchedPH: true,
    keySpecs: [
      { label: 'Range (CLTC)', value: '240–565 km' },
      { label: 'Max power', value: '202 kW' },
      { label: 'Seats', value: '5 seats' },
    ],
    image: img('joyee-n09'),
  },
  {
    slug: 'joyee-s08',
    name: 'JOYEE S08',
    brand: 'JOYEE',
    category: 'suv',
    body: 'Hybrid SUV',
    powertrains: ['PHEV'],
    tagline: 'Long Range T-Power Hybrid SUV',
    launchedPH: true,
    keySpecs: [
      { label: 'Range (CLTC)', value: '210 km' },
      { label: 'Max power', value: '168 kW' },
      { label: 'Seats', value: '5 seats' },
    ],
    image: img('joyee-s08'),
  },
  {
    slug: 'joyee-s04',
    name: 'JOYEE S04',
    brand: 'JOYEE',
    category: 'suv',
    body: 'Urban SUV',
    powertrains: ['EV'],
    tagline: 'Enjoyable Urban Pure Electric SUV',
    launchedPH: true,
    keySpecs: [
      { label: 'Range (CLTC)', value: '445–565 km' },
      { label: 'Max power', value: '124 kW' },
      { label: 'Seats', value: '5 seats' },
    ],
    image: img('joyee-s04'),
  },
  {
    slug: 'joyee-n01',
    name: 'JOYEE N01',
    brand: 'JOYEE',
    category: 'city',
    body: '5-door city car',
    powertrains: ['EV'],
    tagline: 'Graceful New Look, Born to Own the Spotlight',
    launchedPH: false,
    keySpecs: [
      { label: 'Range (CLTC)', value: '222–328 km' },
      { label: 'Max power', value: '30 kW' },
      { label: 'Seats', value: '4 seats' },
    ],
    image: img('joyee-n01'),
  },
  {
    slug: 'bestune-b70',
    name: 'BESTUNE B70',
    brand: 'BESTUNE',
    category: 'sedan',
    body: 'Mid-size sedan',
    powertrains: ['Gasoline'],
    tagline: 'Ultra-Safe Smart Luxury Sedan',
    launchedPH: false,
    keySpecs: [
      { label: 'Engine', value: '1.5T / 2.0T' },
      { label: 'Max power', value: '124–165 kW' },
      { label: 'Transmission', value: '7-Speed Wet DCT / 6-Speed Automatic' },
    ],
    image: img('bestune-b70'),
  },
  {
    slug: 'bestune-t90',
    name: 'BESTUNE T90',
    brand: 'BESTUNE',
    category: 'suv',
    body: 'Compact SUV',
    powertrains: ['Gasoline'],
    tagline: 'Technology Enhances Life. Enjoy Intelligent Drive.',
    launchedPH: false,
    keySpecs: [
      { label: 'Engine', value: '1.5T / 2.0T' },
      { label: 'Max power', value: '124–185 kW' },
      { label: 'Transmission', value: 'DCT / 8AT' },
    ],
    image: img('bestune-t90'),
  },
  {
    slug: 'bestune-t77',
    name: 'BESTUNE T77',
    brand: 'BESTUNE',
    category: 'suv',
    body: 'Compact SUV',
    powertrains: ['Gasoline'],
    tagline: 'A Stylish & High-Quality Vehicle',
    launchedPH: false,
    keySpecs: [
      { label: 'Engine', value: '1.5T' },
      { label: 'Max power', value: '118 kW' },
      { label: 'Transmission', value: '7DCT' },
    ],
    image: img('bestune-t77'),
  },
  {
    slug: 'bestune-b70s',
    name: 'BESTUNE B70S',
    brand: 'BESTUNE',
    category: 'suv',
    body: 'Coupe SUV',
    powertrains: ['Gasoline'],
    tagline: 'Sculpted Light & Shadow Aesthetic Coupe SUV',
    launchedPH: false,
    keySpecs: [
      { label: 'Engine', value: '1.5T / 2.0T' },
      { label: 'Max power', value: '118–160 kW' },
      { label: 'Transmission', value: '7DCT Transmission (7DCT270) / 6AT Transmission' },
    ],
    image: img('bestune-b70s'),
  },
  {
    slug: 'bestune-m9',
    name: 'BESTUNE M9',
    brand: 'BESTUNE',
    category: 'mpv',
    body: '7-seat MPV',
    powertrains: ['MHEV'],
    tagline: 'Efficient Travel, Full of Potential',
    launchedPH: false,
    keySpecs: [
      { label: 'Engine', value: '2.0T' },
      { label: 'Max power', value: '185 kW' },
      { label: 'Transmission', value: '8AT' },
    ],
    image: img('bestune-m9'),
  },
  {
    slug: 'bestune-xiaoma',
    name: 'BESTUNE XIAOMA',
    brand: 'BESTUNE',
    category: 'city',
    body: '3-door city car',
    powertrains: ['EV'],
    tagline: 'Great Looks · Great Fun · Easy Drive · Great Value',
    launchedPH: false,
    keySpecs: [
      { label: 'Range (CLTC)', value: '222 km' },
      { label: 'Max power', value: '30 kW' },
      { label: 'Seats', value: '4 seats' },
    ],
    image: img('bestune-xiaoma'),
  },
]

export function findModel(slug: string) {
  return models.find((m) => m.slug === slug)
}
