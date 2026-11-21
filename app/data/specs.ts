// Specification sheets from China FAW's global site (fawcar.com → model → Specifications),
// stored as read in app/data/fawcar/<slug>.json: GCC-market variants where fawcar.com lists
// regional versions, otherwise the only version listed. A source row is [label, value] when every
// variant shares the value, or [label, v1, v2, …] with one value per variant.
//
// For display the sheets are tidied up here, never in the JSON (so the source stays comparable):
//   - data-entry slips found on fawcar.com are corrected in `fixes`, each with the reason;
//   - a "●" in front of a value is dropped ("●225/55 R19" → "225/55 R19");
//   - rows with no value for any variant are left out.
// Symbols that remain: ● standard, ○ optional, - not available.
import b70 from './fawcar/bestune-b70.json' with { type: 'json' }
import m9 from './fawcar/bestune-m9.json' with { type: 'json' }
import t77 from './fawcar/bestune-t77.json' with { type: 'json' }
import t90 from './fawcar/bestune-t90.json' with { type: 'json' }
import xiaoma from './fawcar/bestune-xiaoma.json' with { type: 'json' }
import n01 from './fawcar/joyee-n01.json' with { type: 'json' }
import n09 from './fawcar/joyee-n09.json' with { type: 'json' }
import s04 from './fawcar/joyee-s04.json' with { type: 'json' }
import s08 from './fawcar/joyee-s08.json' with { type: 'json' }
import { variantNames } from './variants'

export { variantNames }

export interface FawcarSource {
  seriesId: number
  name: string
  describe: string
  appearance: { title: string; subtitle: string }
  interior: { title: string; subtitle: string }
  // Feature blocks of the model page. Their photos (www.fawcar.com/file_cos/…) are not on the CDN.
  sections: { type: string; title: string; items: { title: string; copy: string; img: string }[] }[]
  variants: string[]
  groups: { name: string; rows: string[][] }[]
}

export const sources: Record<string, FawcarSource> = {
  'joyee-n09': n09,
  'joyee-s08': s08,
  'joyee-s04': s04,
  'joyee-n01': n01,
  'bestune-b70': b70,
  'bestune-t90': t90,
  'bestune-t77': t77,
  'bestune-m9': m9,
  'bestune-xiaoma': xiaoma,
}

// fawcar.com spec page of each model, for "source" links.
export const sourceUrl = (slug: string) => `https://www.fawcar.com/product/${sources[slug]!.seriesId}/setting`

interface Fix {
  group: string
  label: string
  // New values: one for all variants, or one per variant.
  values?: string[]
  rename?: string
  drop?: true
  why: string
}

const shifted = 'values on fawcar.com are shifted one row'
const fixes: Record<string, Fix[]> = {
  'joyee-s08': [
    { group: 'Basic Specifications', label: 'Electric Motor (Ps)', rename: 'Engine', why: 'the value is the 1.5T engine of the plug-in hybrid' },
    { group: 'Body', label: 'Number of Doors', values: ['5'], why: 'fawcar.com shows the door type ("Hinged door")' },
    { group: 'Body', label: 'Trunk Volume (L)', values: ['590-1800'], why: 'fawcar.com shows 5; its S08 page states 590 L, expandable to 1,800 L' },
    { group: 'Electric motor', label: 'Rear Motor Max Power (kW)', rename: 'Front Motor Max Power (kW)', why: 'single front-mounted motor' },
    { group: 'Electric motor', label: 'Rear Motor Max Torque (N·m)', rename: 'Front Motor Max Torque (N·m)', why: 'single front-mounted motor' },
    { group: 'Driving Hardware', label: 'Driving Assistance Camera', values: ['360° panoramic camera'], why: 'second value is in Chinese' },
  ],
  'joyee-s04': [
    { group: 'Electric motor', label: 'Rear Motor Max Power (kW)', rename: 'Front Motor Max Power (kW)', why: 'single front-mounted motor' },
    { group: 'Electric motor', label: 'Rear Motor Max Torque (N·m)', rename: 'Front Motor Max Torque (N·m)', why: 'single front-mounted motor' },
    { group: 'Chassis & Steering', label: 'Drive Type', values: ['Front-motor, front-wheel drive'], why: 'electric car listed as "front-engine"' },
    { group: 'Exterior & Anti-Theft', label: 'Power Tailgate', drop: true, why: `${shifted}; no value for this row` },
    { group: 'Exterior & Anti-Theft', label: 'Key Type', values: ['Remote key\nBluetooth key\nNFC/RFID key'], why: shifted },
    { group: 'Exterior & Anti-Theft', label: 'Keyless Start System', values: ['●'], why: shifted },
    { group: 'Exterior & Anti-Theft', label: 'Keyless Entry Function', values: ['Driver seat'], why: shifted },
    { group: 'Exterior & Anti-Theft', label: 'Active Grille Shutter', values: ['●'], why: `${shifted}; the S04 page lists active grille shutters` },
    { group: 'Exterior & Anti-Theft', label: 'Battery Preheating', values: ['●'], why: shifted },
    { group: 'Exterior & Anti-Theft', label: 'External Power Discharge', values: ['●'], why: `${shifted}; 3.3 kW V2L` },
    { group: 'Steering Wheel / Interior Mirror', label: 'Trip Computer Display', values: ['Color'], why: `${shifted} for the 445 km variants` },
    { group: 'Steering Wheel / Interior Mirror', label: 'Full LCD Instrument Panel', values: ['●'], why: `${shifted} for the 445 km variants` },
    { group: 'Steering Wheel / Interior Mirror', label: 'LCD Instrument Size', values: ['8 inches'], why: `${shifted} for the 445 km variants` },
    { group: 'Steering Wheel / Interior Mirror', label: 'Interior Mirror Function', values: ['Manual anti-glare'], why: `${shifted} for the 445 km variants` },
  ],
  'joyee-n09': [
    { group: 'Basic Specifications', label: 'Range Extender Continuous Power (kW)', values: ['40', '-'], why: 'unit repeated in the value' },
  ],
  'joyee-n01': [
    { group: 'Screen / System', label: 'Carplay', rename: 'Apple CarPlay', values: ['Available from December 2026'], why: 'value written as "CP (…)"' },
  ],
  'bestune-xiaoma': [
    { group: 'Battery / Charging', label: 'Fast Charging Function', values: ['-', '●'], why: 'value in Chinese ("supported")' },
    { group: 'Battery / Charging', label: 'Battery Fast Charging Time (h)', values: ['-', '1.25 (30%-80%)'], why: 'fast and slow times swapped for the Premium; matches Basic Specifications' },
    { group: 'Battery / Charging', label: 'Battery Slow Charging Time (h)', values: ['6'], why: 'fast and slow times swapped for the Premium; matches Basic Specifications' },
    { group: 'Chassis & Steering', label: 'Front Suspension Type', values: ['MacPherson'], why: 'both suspension rows hold the combined front/rear value' },
    { group: 'Chassis & Steering', label: 'Rear Suspension Type', values: ['3-link non-independent'], why: 'both suspension rows hold the combined front/rear value' },
    { group: 'Exterior & Anti-Theft', label: 'Power Tailgate', drop: true, why: `${shifted}; no value for this row` },
    { group: 'Exterior & Anti-Theft', label: 'Key Type', values: ['Mechanical key\nRemote key'], why: shifted },
    { group: 'Exterior & Anti-Theft', label: 'Keyless Start System', values: ['-'], why: shifted },
    { group: 'Exterior & Anti-Theft', label: 'Keyless Entry Function', values: ['-'], why: shifted },
  ],
  'bestune-b70': [
    { group: 'Wheels & Brakes', label: 'Spare Tire Size', values: ['Temporary spare tire'], why: 'word repeated' },
  ],
  'bestune-t77': [
    { group: 'Basic Specifications', label: 'Emission Standard', drop: true, why: 'fawcar.com shows only "●"' },
    { group: 'Passive Safety', label: 'Driver & Passenger Airbags', values: ['Driver ● / Passenger ●'], why: 'written as "Front / Rear"' },
  ],
}

// Labels without a unit get one, so rows read the same across models.
const labelUnits: Record<string, string> = {
  'Wheelbase': 'Wheelbase (mm)',
  'Max Speed': 'Max Speed (km/h)',
}

export interface SpecRow {
  label: string
  // One value per variant.
  values: string[]
}
export interface SpecGroup {
  name: string
  rows: SpecRow[]
}
export interface SpecSheet {
  variants: string[]
  groups: SpecGroup[]
}

function cleanValue(v: string) {
  return v
    .split('\n')
    .map((line) =>
      line
        .trim()
        .replace(/^[●⚪○](?=\s*\S)\s*/, '') // "●Sport" → "Sport", "⚪Alpine White" → "Alpine White"
        .replace(/([A-Za-z])●/g, '$1 ●') // "Front●" → "Front ●"
        .replace(/●\s*\/\s*/g, '● / ') // "Driver ●/Passenger" → "Driver ● / Passenger"
        .replace(/(^|\s)–(?=\s|$)/g, '$1-'), // en dash used as "not available"
    )
    .filter(Boolean)
    .join('\n')
}

export function buildSheet(slug: string): SpecSheet {
  const src = sources[slug]
  if (!src) throw new Error(`No spec sheet for ${slug}`)
  const n = src.variants.length
  const todo = [...(fixes[slug] ?? [])]
  const groups: SpecGroup[] = []
  for (const g of src.groups) {
    const rows: SpecRow[] = []
    for (const [rawLabel, ...raw] of g.rows) {
      let label = rawLabel!.trim()
      let values = raw.length === 1 ? Array<string>(n).fill(raw[0]!) : raw
      const fixIndex = todo.findIndex((f) => f.group === g.name && f.label === label)
      if (fixIndex >= 0) {
        const fix = todo.splice(fixIndex, 1)[0]!
        if (fix.drop) continue
        if (fix.rename) label = fix.rename
        if (fix.values) values = fix.values.length === 1 ? Array<string>(n).fill(fix.values[0]!) : fix.values
      }
      values = values.map(cleanValue)
      if (label === 'L×W×H (mm)') values = values.map((v) => v.split(/\s*[*×]\s*/).join(' × '))
      if (values.every((v) => v === '')) continue
      rows.push({ label: labelUnits[label] ?? label, values })
    }
    if (rows.length) groups.push({ name: g.name, rows })
  }
  // A fix that matched nothing means the source changed: fail loudly instead of showing old data.
  if (todo.length) throw new Error(`${slug}: unused spec fixes: ${todo.map((f) => `${f.group} / ${f.label}`).join(', ')}`)
  return { variants: variantNames[slug] ?? src.variants, groups }
}

export const specSheets: Record<string, SpecSheet> = Object.fromEntries(Object.keys(sources).map((slug) => [slug, buildSheet(slug)]))

// Values of the first row with one of these labels (groups in fawcar.com order, so
// "Basic Specifications" wins over later groups that reuse a label).
export function specValues(slug: string, labels: string[]): string[] | undefined {
  const sheet = specSheets[slug]
  if (!sheet) return undefined
  for (const label of labels) {
    for (const g of sheet.groups) {
      const row = g.rows.find((r) => r.label === label)
      if (row) return row.values
    }
  }
  return undefined
}

const nf = new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 })
const isNumber = (v: string) => /^\d+(\.\d+)?$/.test(v)

// One line for several variants: "118–160" for numbers, "1.5T / 2.0T" otherwise.
export function summarize(values: string[] | undefined, unit = '') {
  if (!values) return undefined
  const unique = [...new Set(values)].filter((v) => v !== '-')
  if (!unique.length) return undefined
  const u = unit ? ` ${unit}` : ''
  if (unique.every(isNumber)) {
    const nums = unique.map(Number)
    const lo = Math.min(...nums)
    const hi = Math.max(...nums)
    return lo === hi ? `${nf.format(lo)}${u}` : `${nf.format(lo)}–${nf.format(hi)}${u}`
  }
  return unique.map((v) => v.replace(/\n/g, ', ')).join(' / ') + u
}

// Rows of the side-by-side comparison, read from each model's sheet. Labels differ between
// fawcar.com's electric and petrol templates, hence several candidates per row.
export const compareRows: { group: string; rows: { label: string; labels: string[]; unit?: string }[] }[] = [
  {
    group: 'Powertrain',
    rows: [
      { label: 'Engine', labels: ['Engine'] },
      { label: 'Electric range (CLTC)', labels: ['CLTC Pure Electric Range (km)'], unit: 'km' },
      { label: 'Battery', labels: ['Battery Energy (kWh)'], unit: 'kWh' },
      { label: 'Maximum power', labels: ['Max Power (kW)', 'Maximum Power (kW)'], unit: 'kW' },
      { label: 'Maximum torque', labels: ['Max Torque (N·m)', 'Maximum Torque (N·m)'], unit: 'N·m' },
      { label: 'Transmission', labels: ['Transmission Type'] },
      { label: 'Fuel consumption (WLTC)', labels: ['WLTC Combined Fuel Consumption (L/100km)'], unit: 'L/100 km' },
      { label: '0–100 km/h', labels: ['Official 0-100 km/h Acceleration (s)'], unit: 's' },
      { label: 'Top speed', labels: ['Max Speed (km/h)', 'Top Speed (km/h)'], unit: 'km/h' },
    ],
  },
  {
    group: 'Size',
    rows: [
      { label: 'Body', labels: ['Body Structure'] },
      { label: 'L × W × H', labels: ['L×W×H (mm)'], unit: 'mm' },
      { label: 'Wheelbase', labels: ['Wheelbase (mm)'], unit: 'mm' },
      { label: 'Seats', labels: ['Number of Seats'] },
      { label: 'Trunk', labels: ['Trunk Volume (L)'], unit: 'L' },
      { label: 'Curb weight', labels: ['Curb Weight (kg)'], unit: 'kg' },
    ],
  },
  {
    group: 'Equipment',
    rows: [
      { label: 'Central screen', labels: ['Central Control Screen Size'] },
      { label: 'Cruise control', labels: ['Cruise Control', 'Cruise Control System'] },
      { label: 'Driving camera', labels: ['Driving Assistance Camera'] },
      { label: 'Sunroof', labels: ['Sunroof Type'] },
      { label: 'Climate control', labels: ['Air Conditioning Control', 'Air Conditioning Temperature Control', 'Air Conditioning'] },
    ],
  },
]

export function compareValue(slug: string, row: { labels: string[]; unit?: string }) {
  return summarize(specValues(slug, row.labels), row.unit) ?? '–'
}

// Headline figures for the model page hero and the model cards.
export function headlineStats(slug: string) {
  const v = (labels: string[], unit?: string) => summarize(specValues(slug, labels), unit)
  const range = v(['CLTC Pure Electric Range (km)'], 'km')
  const power = v(['Max Power (kW)', 'Maximum Power (kW)'], 'kW')
  const seats = v(['Number of Seats'])
  const stats: { label: string; value: string }[] = []
  if (range) stats.push({ label: 'Electric range (CLTC)', value: range })
  if (power) stats.push({ label: 'Max power', value: power })
  if (range) {
    const sprint = v(['Official 0-100 km/h Acceleration (s)'], 's')
    const top = v(['Top Speed (km/h)', 'Max Speed (km/h)'], 'km/h')
    if (sprint) stats.push({ label: '0–100 km/h', value: sprint })
    else if (top) stats.push({ label: 'Top speed', value: top })
  } else {
    const torque = v(['Max Torque (N·m)', 'Maximum Torque (N·m)'], 'N·m')
    const fuel = v(['WLTC Combined Fuel Consumption (L/100km)'], 'L/100 km')
    if (torque) stats.push({ label: 'Max torque', value: torque })
    if (fuel) stats.push({ label: 'Fuel use (WLTC)', value: fuel })
  }
  if (seats) stats.push({ label: 'Seating', value: `${seats} seats` })
  return stats
}

// Key figures for model cards and menus (copied into models.ts, checked by the unit tests).
export function cardSpecs(slug: string) {
  const v = (labels: string[], unit?: string) => summarize(specValues(slug, labels), unit) ?? '–'
  const power = { label: 'Max power', value: v(['Max Power (kW)', 'Maximum Power (kW)'], 'kW') }
  if (specValues(slug, ['CLTC Pure Electric Range (km)'])) {
    return [
      { label: 'Range (CLTC)', value: v(['CLTC Pure Electric Range (km)'], 'km') },
      power,
      { label: 'Seats', value: `${v(['Number of Seats'])} seats` },
    ]
  }
  return [
    { label: 'Engine', value: v(['Engine']) },
    power,
    { label: 'Transmission', value: v(['Transmission Type']) },
  ]
}

// Rows that differ between variants but say little to a buyer.
const minorRows = /^(Curb Weight|Gross Load Mass|Battery (Fast|Slow) Charging Time|Max Speed|Top Speed|Front Track|Max Torque|Max Net Power|Maximum Torque|Engine Model|Cylinder Block Material|Fuel Grade|Displacement|Number of Gears|Abbreviation|Drag Coefficient|Cell Brand|Rear Tire Size|Power Consumption|Official 0-100|WLTC Combined|Number of Ultrasonic)/
const units = new Set(['km', 'kWh', 'kW', 'N·m', 'L', 'mm', 'kg', 's', 'h', 'min'])

// What sets each variant apart: rows whose value differs between variants, for this variant.
export function variantDifferences(slug: string, index: number, limit = 6) {
  const sheet = specSheets[slug]
  if (!sheet) return []
  const out: string[] = []
  const seen = new Set<string>()
  for (const g of sheet.groups) {
    if (g.name === 'Color') continue
    for (const r of g.rows) {
      if (seen.has(r.label) || minorRows.test(r.label) || new Set(r.values).size === 1) continue
      seen.add(r.label) // Basic Specifications repeats rows of later groups
      const v = r.values[index]!
      if (v === '-' || v === '') continue
      const unit = r.label.match(/\(([^)]*)\)$/)?.[1]
      const label = r.label.replace(/\s*\([^)]*\)$/, '')
      const value = v.replace(/\n/g, ', ') + (unit && units.has(unit) && isNumber(v) ? ` ${unit}` : '')
      out.push(v === '●' ? label : `${label}: ${value}`)
      if (out.length >= limit) return out
    }
  }
  return out
}
