// SAMPLE specifications, variants and highlights per model for the demo.
// Figures are indicative (based on the China-market line-up) until the
// Philippine-spec data sheet is supplied by FAW-Volkswagen.
import type { IconName } from '~/utils/icons'

export interface Variant {
  name: string
  price: number
  features: string[]
}

export interface ModelSpec {
  length: number
  width: number
  height: number
  wheelbase: number
  seats: number
  powertrain: string
  power: string
  torque: string
  transmission: string
  drive: string
  efficiency: string
  airbags: number
  adas: string
  screen: string
  connectivity: string
  climate: string
}

export interface ModelDetail {
  intro: string
  highlights: { icon: IconName; title: string; copy: string }[]
  variants: Variant[]
  spec: ModelSpec
}

const connectivity = 'Wireless Apple CarPlay & Android Auto'

export const modelDetails: Record<string, ModelDetail> = {
  'talagon': {
    intro: 'The Talagon is FAW-Volkswagen’s flagship three-row SUV: long, wide and serene, with genuine adult space in every row and 4MOTION all-wheel drive for wet-season roads and mountain weekends.',
    highlights: [
      { icon: 'award', title: 'Three rows, real space', copy: 'A 2,980 mm wheelbase gives the third row proper legroom, and the seats fold flat for airport runs and balikbayan boxes.' },
      { icon: 'shield', title: '4MOTION all-wheel drive', copy: 'Torque is shifted between axles in milliseconds for confident grip in heavy rain and on rough provincial roads.' },
      { icon: 'cpu', title: 'IQ.DRIVE assistance', copy: 'Adaptive cruise control, lane assist and 360° cameras make long highway drives and tight parking easier.' },
    ],
    variants: [
      { name: '2.0 TSI Comfort', price: 2998000, features: ['7 seats', 'Panoramic sunroof', '12-inch touchscreen'] },
      { name: '2.0 TSI Premium 4MOTION', price: 3398000, features: ['4MOTION AWD', 'Ventilated front seats', 'Head-up display'] },
    ],
    spec: { length: 5152, width: 1991, height: 1801, wheelbase: 2980, seats: 7, powertrain: '2.0 TSI turbo petrol', power: '162 kW', torque: '350 Nm', transmission: '7-speed DSG', drive: '4MOTION AWD', efficiency: '8.6 L/100 km', airbags: 9, adas: 'IQ.DRIVE (ACC, lane assist, 360° camera)', screen: '12-inch touchscreen', connectivity, climate: 'Tri-zone automatic' },
  },
  'tayron': {
    intro: 'The Tayron L is the do-it-all family SUV: roomy, efficient and easy to live with, from school runs in the city to long drives up north.',
    highlights: [
      { icon: 'award', title: 'Family-sized cabin', copy: 'Generous rear legroom and a wide, flat cargo floor for strollers, groceries and weekend luggage.' },
      { icon: 'leaf', title: 'Efficient TSI power', copy: 'A refined 2.0 TSI engine and 7-speed DSG balance strong overtaking power with everyday fuel economy.' },
      { icon: 'shield', title: 'Safety as standard', copy: 'Six airbags, autonomous emergency braking and blind-spot monitoring across the range.' },
    ],
    variants: [
      { name: '2.0 TSI Comfort', price: 2198000, features: ['LED headlights', '10-inch touchscreen', 'Rear camera'] },
      { name: '2.0 TSI Highline', price: 2448000, features: ['Panoramic sunroof', 'Power tailgate', '360° camera'] },
    ],
    spec: { length: 4770, width: 1880, height: 1690, wheelbase: 2791, seats: 5, powertrain: '2.0 TSI turbo petrol', power: '137 kW', torque: '320 Nm', transmission: '7-speed DSG', drive: 'Front-wheel drive', efficiency: '7.4 L/100 km', airbags: 6, adas: 'AEB, blind-spot monitor, lane assist', screen: '10-inch touchscreen', connectivity, climate: 'Dual-zone automatic' },
  },
  'magotan': {
    intro: 'The new Magotan brings executive-class comfort to the mid-size sedan: a long wheelbase, a quiet cabin and a cockpit built around the latest Volkswagen digital experience.',
    highlights: [
      { icon: 'award', title: 'Executive rear seat', copy: 'Long-wheelbase proportions give rear passengers the space and comfort of a larger luxury sedan.' },
      { icon: 'cpu', title: 'Digital cockpit', copy: 'A large central display and digital instrument cluster with voice control and over-the-air updates.' },
      { icon: 'leaf', title: 'Refined 2.0 TSI', copy: 'Smooth, quiet turbocharged power with the efficiency of a 7-speed DSG transmission.' },
    ],
    variants: [
      { name: '2.0 TSI Comfortline', price: 1898000, features: ['Digital cockpit', 'Keyless entry', 'LED headlights'] },
      { name: '2.0 TSI Highline', price: 2148000, features: ['Leather seats', 'Ambient lighting', 'Harman Kardon audio'] },
    ],
    spec: { length: 4917, width: 1866, height: 1475, wheelbase: 2841, seats: 5, powertrain: '2.0 TSI turbo petrol', power: '137 kW', torque: '320 Nm', transmission: '7-speed DSG', drive: 'Front-wheel drive', efficiency: '6.8 L/100 km', airbags: 6, adas: 'ACC, lane assist, parking assist', screen: '15-inch touchscreen', connectivity, climate: 'Tri-zone automatic' },
  },
  'sagitar': {
    intro: 'The Sagitar L is the confident compact sedan: turbocharged, well-equipped and engineered to German standards, with the space of a class above.',
    highlights: [
      { icon: 'leaf', title: 'Turbocharged efficiency', copy: 'The 1.5 TSI engine delivers brisk acceleration while keeping fuel costs low in daily traffic.' },
      { icon: 'award', title: 'Room to stretch', copy: 'A long wheelbase gives the Sagitar L rear-seat space usually found in larger sedans.' },
      { icon: 'shield', title: 'Built to protect', copy: 'A high-strength steel body and six airbags provide a strong foundation of safety.' },
    ],
    variants: [
      { name: '1.5 TSI Comfort', price: 1398000, features: ['10-inch touchscreen', 'Cruise control', 'Rear camera'] },
      { name: '1.5 TSI Premium', price: 1548000, features: ['Sunroof', 'Wireless charging', 'Digital cockpit'] },
    ],
    spec: { length: 4796, width: 1815, height: 1471, wheelbase: 2731, seats: 5, powertrain: '1.5 TSI turbo petrol', power: '118 kW', torque: '250 Nm', transmission: '7-speed DSG', drive: 'Front-wheel drive', efficiency: '5.9 L/100 km', airbags: 6, adas: 'AEB, lane departure warning', screen: '10-inch touchscreen', connectivity, climate: 'Automatic' },
  },
  'bora': {
    intro: 'The Bora is smart value done the Volkswagen way: solid, spacious and simple to own, with low running costs for first-time buyers and growing families.',
    highlights: [
      { icon: 'tag', title: 'Smart value', copy: 'A well-equipped compact sedan at an accessible price, with affordable maintenance.' },
      { icon: 'leaf', title: 'Easy on fuel', copy: 'A proven 1.5-litre engine and 6-speed automatic tuned for city traffic.' },
      { icon: 'award', title: 'Practical space', copy: 'A large trunk and comfortable rear seat for family errands and provincial trips.' },
    ],
    variants: [
      { name: '1.5 Comfort AT', price: 1098000, features: ['8-inch touchscreen', 'Rear parking sensors', 'Alloy wheels'] },
      { name: '1.5 Premium AT', price: 1198000, features: ['Sunroof', 'Rear camera', 'Automatic climate'] },
    ],
    spec: { length: 4672, width: 1815, height: 1478, wheelbase: 2688, seats: 5, powertrain: '1.5 L petrol', power: '83 kW', torque: '145 Nm', transmission: '6-speed automatic', drive: 'Front-wheel drive', efficiency: '5.7 L/100 km', airbags: 4, adas: 'ESC, hill-start assist', screen: '8-inch touchscreen', connectivity: 'Apple CarPlay & Android Auto', climate: 'Automatic' },
  },
  'magotan-phev': {
    intro: 'The Magotan PHEV drives on electric power for the daily commute, then switches seamlessly to hybrid for long trips — a combined range of up to 1,510 km (CLTC).',
    highlights: [
      { icon: 'leaf', title: 'Electric for the city', copy: 'A 22 kWh battery covers most daily commutes on electricity alone, quietly and with zero tailpipe emissions.' },
      { icon: 'award', title: '1,510 km combined range', copy: 'P1 + P3 dual-motor architecture with a 1.5 TSI EVO II engine: no range anxiety on long drives.' },
      { icon: 'cpu', title: 'Power out, too', copy: 'DC fast charging, plus 3.5 kW vehicle-to-load to power appliances during brownouts or camping trips.' },
    ],
    variants: [
      { name: '1.5 TSI PHEV Comfort', price: 2048000, features: ['DC fast charging', 'Vehicle-to-load', 'Digital cockpit'] },
      { name: '1.5 TSI PHEV Premium', price: 2248000, features: ['Navigate on Autopilot', 'Memory parking', 'Premium audio'] },
    ],
    spec: { length: 4917, width: 1866, height: 1475, wheelbase: 2841, seats: 5, powertrain: '1.5 TSI plug-in hybrid', power: '150 kW (system)', torque: '220 Nm (engine)', transmission: 'Single-speed hybrid', drive: 'Front-wheel drive', efficiency: '1,510 km (CLTC)', airbags: 6, adas: 'Highway NOA, memory parking', screen: '15-inch touchscreen', connectivity, climate: 'Tri-zone automatic' },
  },
  'id-aura-t6': {
    intro: 'The ID. AURA T6 is a fully electric family SUV: spacious, near-silent and quick to charge, designed for the way Filipino families drive today.',
    highlights: [
      { icon: 'leaf', title: 'Zero tailpipe emissions', copy: 'Fully electric driving with low running costs and no fuel stops in city traffic.' },
      { icon: 'award', title: 'Lounge-like interior', copy: 'A flat floor and long wheelbase open up a calm, airy cabin for five.' },
      { icon: 'cpu', title: 'Fast charging', copy: 'DC fast charging tops up the battery during a coffee stop on the expressway.' },
    ],
    variants: [
      { name: 'Pro', price: 2498000, features: ['Rear-wheel drive', 'Panoramic glass roof', 'Digital cockpit'] },
      { name: 'Pro Max', price: 2798000, features: ['Long-range battery', 'Head-up display', 'Premium audio'] },
    ],
    spec: { length: 4900, width: 1920, height: 1680, wheelbase: 2900, seats: 5, powertrain: 'Battery electric', power: '170 kW', torque: '310 Nm', transmission: 'Single-speed', drive: 'Rear-wheel drive', efficiency: '600+ km range (CLTC)', airbags: 7, adas: 'IQ.DRIVE (ACC, lane assist, auto parking)', screen: '15-inch touchscreen', connectivity, climate: 'Dual-zone automatic, heat pump' },
  },
}

export const specRows: { group: string; rows: { key: keyof ModelSpec; label: string; unit?: string }[] }[] = [
  {
    group: 'Dimensions',
    rows: [
      { key: 'length', label: 'Length', unit: 'mm' },
      { key: 'width', label: 'Width', unit: 'mm' },
      { key: 'height', label: 'Height', unit: 'mm' },
      { key: 'wheelbase', label: 'Wheelbase', unit: 'mm' },
      { key: 'seats', label: 'Seating capacity' },
    ],
  },
  {
    group: 'Powertrain',
    rows: [
      { key: 'powertrain', label: 'Powertrain' },
      { key: 'power', label: 'Maximum power' },
      { key: 'torque', label: 'Maximum torque' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'drive', label: 'Drive' },
      { key: 'efficiency', label: 'Fuel economy / range' },
    ],
  },
  {
    group: 'Safety & technology',
    rows: [
      { key: 'airbags', label: 'Airbags' },
      { key: 'adas', label: 'Driver assistance' },
      { key: 'screen', label: 'Infotainment' },
      { key: 'connectivity', label: 'Smartphone' },
      { key: 'climate', label: 'Climate control' },
    ],
  },
]

const mm = new Intl.NumberFormat('en-PH')

export function formatSpec(spec: ModelSpec, key: keyof ModelSpec, unit?: string) {
  const v = spec[key]
  return typeof v === 'number' ? `${mm.format(v)}${unit ? ` ${unit}` : ''}` : v
}
