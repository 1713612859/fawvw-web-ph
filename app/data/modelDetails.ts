// Model page copy from fawcar.com: the design and interior lines, and the feature blocks
// (title + short text) of each model page, read from app/data/fawcar/<slug>.json.
// Image-only blocks are skipped. The feature photos are not available yet (see media.ts),
// so features show as text. Colour names follow the fawcar.com colour list where the
// cut-out clearly matches one, otherwise a plain colour name.
import { sources } from './specs'

export interface Highlight {
  title: string
  copy: string
}
export interface HighlightGroup {
  title: string
  items: Highlight[]
}
export interface Swatch {
  name: string
  hex: string
}
export interface ModelDetail {
  design: { title: string; copy: string }
  interior: { title: string; copy: string }
  highlights: HighlightGroup[]
  // One per /images/models/<slug>/color-<n>.webp, in order.
  colors: Swatch[]
}

const tidy = (s: string) =>
  s
    .replace(/[‧・]/g, '·')
    .replace(/㎡/g, 'm²')
    .replace(/\s+/g, ' ')
    .trim()

// fawcar.com copy that is cut off mid-sentence, finished here.
const copyFixes: Record<string, Partial<Record<'design' | 'interior', string>>> = {
  'bestune-b70s': { interior: 'Built with the “sleek, lightweight floating” design philosophy.' },
  'joyee-n01': {
    design: 'Comfortable living space, a versatile interior and a five-door design.',
    interior: 'A 10.1-inch central screen with a lively, customizable interactive desktop.',
  },
}

// Feature blocks published without titles on fawcar.com ("空" placeholders): titles written
// from their text, in block order.
const missingTitles: Record<string, string[]> = {
  'bestune-t90': [
    'Adaptive cruise control',
    'Smart lane change',
    'Lane keeping assist',
    'Automatic parking',
    'High-strength body',
    'FMA architecture',
    'Independent suspension',
  ],
}

// The N09 page on fawcar.com is made of image-only blocks, so its highlights are
// written here from its specification sheet (app/data/fawcar/joyee-n09.json).
const n09Highlights: HighlightGroup[] = [
  {
    title: 'Two ways to drive electric',
    items: [
      { title: '240 Plus EREV', copy: '240 km of CLTC electric range, with a range extender for up to 1,400 km combined (CLTC).' },
      { title: '565 Pro BEV', copy: '565 km of CLTC electric range from a 59.04 kWh CATL battery, and a 0.208 Cd drag coefficient.' },
      { title: '20-minute fast charging', copy: 'From 30% to 80% in about 20 minutes with fast charging.' },
    ],
  },
  {
    title: 'Comfort and technology',
    items: [
      { title: '15.6-inch central screen', copy: 'A 15.6-inch touchscreen plus a slim full-LCD driver display.' },
      { title: 'Lounge-grade front seats', copy: '12-way power front seats with heating, ventilation, massage and memory.' },
      { title: '23-speaker audio', copy: 'Immersive sound throughout the cabin, with 64-color ambient lighting.' },
      { title: '6 kW vehicle-to-load', copy: 'Power appliances and devices from the charging port.' },
    ],
  },
  {
    title: 'Performance and safety',
    items: [
      { title: '202 kW rear motor', copy: '300 N·m and 0–100 km/h in 6.42 seconds.' },
      { title: 'Adaptive cruise and lane centering', copy: 'ACC with low-speed follow, LCC, lane change and lane keeping assist.' },
      { title: '540° camera view', copy: 'Transparent-chassis view for tight parking and rough roads.' },
    ],
  },
]

const colors: Record<string, Swatch[]> = {
  'joyee-n09': [{ name: 'Refreshing Purple', hex: '#b9a6c9' }],
  'joyee-s08': [
    { name: 'Whitespace Green', hex: '#b5c7ab' },
    { name: 'Pearl White', hex: '#f1f1ee' },
    { name: 'Midnight Black', hex: '#1d1e21' },
    { name: 'Artistic Gray', hex: '#8b8e92' },
  ],
  'joyee-s04': [
    { name: 'White', hex: '#eceef3' },
    { name: 'Silver', hex: '#cfcac2' },
    { name: 'Sparrow Green', hex: '#b9cbb5' },
    { name: 'Blue', hex: '#4f8ea3' },
  ],
  'joyee-n01': [
    { name: 'Persimmon Orange', hex: '#e8722c' },
    { name: 'Nebula White', hex: '#f2f2f0' },
    { name: 'Impression Blue', hex: '#b3d3e3' },
    { name: 'Jade Green', hex: '#bfd8bf' },
    { name: 'Gilded Apricot', hex: '#e4dac3' },
  ],
  'bestune-b70': [
    { name: 'Pearl White', hex: '#f0f0ee' },
    { name: 'Midnight Black', hex: '#1f2023' },
    { name: 'Quantum Red', hex: '#c8161d' },
    { name: 'Fuller Silver', hex: '#a9abae' },
  ],
  'bestune-t90': [
    { name: 'Pearl White', hex: '#f0f0ee' },
    { name: 'Midnight Black', hex: '#1f2023' },
    { name: 'Gray', hex: '#c9c6bf' },
  ],
  'bestune-t77': [
    { name: 'White', hex: '#f0f0ee' },
    { name: 'Black', hex: '#1f2023' },
    { name: 'Yellow', hex: '#e9b200' },
    { name: 'Brown', hex: '#7a5532' },
  ],
  'bestune-b70s': [{ name: 'Midnight Black', hex: '#26272a' }],
  'bestune-m9': [{ name: 'Quantum Silver Gray', hex: '#8f8a91' }],
  'bestune-xiaoma': [
    { name: 'Blue / White two-tone', hex: '#7cc4ea' },
    { name: 'Gold / White two-tone', hex: '#d9c48b' },
  ],
}

function build(slug: string): ModelDetail {
  const src = sources[slug]!
  const fix = copyFixes[slug] ?? {}
  const titles = [...(missingTitles[slug] ?? [])]
  const highlights =
    slug === 'joyee-n09'
      ? n09Highlights
      : src.sections
          .filter((s) => s.type !== 'BigImage')
          .map((s) => ({
            title: tidy(s.title),
            items: s.items.map((i) => ({ title: i.title === '空' ? titles.shift()! : tidy(i.title), copy: tidy(i.copy) })),
          }))
          .filter((g) => g.items.length)
  return {
    design: { title: tidy(src.appearance.title), copy: fix.design ?? tidy(src.appearance.subtitle) },
    interior: { title: tidy(src.interior.title), copy: fix.interior ?? tidy(src.interior.subtitle) },
    highlights,
    colors: colors[slug] ?? [],
  }
}

export const modelDetails: Record<string, ModelDetail> = Object.fromEntries(Object.keys(sources).map((slug) => [slug, build(slug)]))
