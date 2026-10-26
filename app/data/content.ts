// SAMPLE editorial content: news articles, owner FAQ, accessories and warranty.
import type { IconName } from '~/utils/icons'

export interface NewsItem {
  slug: string
  category: string
  date: string
  title: string
  excerpt: string
  model: string
  body: string[]
}

export const news: NewsItem[] = [
  {
    slug: 'flagship-showroom-opening',
    category: 'Events',
    date: '2026-10-20',
    title: 'Our flagship showroom opens its doors',
    excerpt: 'Explore the full line-up, book a test drive and meet our product specialists.',
    model: 'talagon',
    body: [
      'Our flagship showroom in Bonifacio Global City is now open, bringing the complete FAW-Volkswagen line-up under one roof: from the Bora and Sagitar L sedans to the seven-seat Talagon and the fully electric ID. AURA T6.',
      'Visitors can explore every model up close, compare variants with our product specialists, and take a test drive on the same day. A dedicated financing desk helps customers pre-qualify with partner banks in minutes.',
      'The showroom also houses a full-service workshop with factory-trained technicians and genuine parts, so owners can schedule preventive maintenance and repairs at the same location.',
      'Opening weekend guests can enjoy launch offers, including a free three-year PMS package on selected models.',
    ],
  },
  {
    slug: 'electrified-lineup-preview',
    category: 'News',
    date: '2026-10-08',
    title: 'A first look at the electrified line-up',
    excerpt: 'Plug-in hybrid and full electric models headed for Philippine roads.',
    model: 'id-aura-t6',
    body: [
      'Two electrified models lead our line-up: the Magotan PHEV plug-in hybrid sedan and the fully electric ID. AURA T6 SUV.',
      'The Magotan PHEV pairs a 1.5 TSI engine with a dual-motor hybrid system and a 22 kWh battery, covering most daily commutes on electricity alone while offering a combined range of up to 1,510 km (CLTC) for long trips.',
      'The ID. AURA T6 is a spacious, near-silent family SUV with DC fast charging and a flat-floor cabin designed for comfort on long drives.',
      'Electrified vehicles may also benefit from incentives under the Electric Vehicle Industry Development Act (RA 11697), such as exemption from number coding. Ask your dealer for details, including charging solutions for your home.',
    ],
  },
  {
    slug: 'road-trip-luzon',
    category: 'Lifestyle',
    date: '2026-09-25',
    title: 'Manila to Baguio: a weekend road trip',
    excerpt: 'Winding mountain roads, cool air and a full tank to spare.',
    model: 'tayron',
    body: [
      'We took the Tayron L north on a classic weekend run from Manila to Baguio: around 250 km via NLEX, SCTEX and TPLEX, then up Marcos Highway into the mountains.',
      'On the expressway, adaptive cruise control and lane assist made the long stretch relaxed. Climbing into the Cordilleras, the 2.0 TSI engine and 7-speed DSG pulled cleanly through the switchbacks without fuss.',
      'With five adults and luggage on board, the cabin stayed quiet and comfortable, and the wide cargo area swallowed everything plus a box of strawberries from La Trinidad for the trip home.',
      'Thinking about your own road trip? Book a test drive and feel the difference on your favorite route.',
    ],
  },
]

export const faqs: { q: string; a: string }[] = [
  { q: 'How often should I bring my vehicle in for preventive maintenance (PMS)?', a: 'We recommend PMS every 10,000 km or 6 months, whichever comes first. Your exact schedule is listed in the owner’s manual and service booklet.' },
  { q: 'Will servicing outside an authorized dealer void my warranty?', a: 'To keep full warranty coverage, scheduled maintenance should be performed at an authorized FAW-VW service center using genuine parts.' },
  { q: 'What do I need to bring for my service appointment?', a: 'Please bring your vehicle registration (OR/CR), service booklet and the key. Arrive 10 minutes early so our service advisor can check your vehicle in.' },
  { q: 'Can I charge an electric or plug-in hybrid model at home?', a: 'Yes. Every electrified model can charge from a standard outlet, and our dealers can arrange a home wall-box installation for faster charging.' },
  { q: 'What payment and financing options are available?', a: 'We accept cash, bank financing through partner banks and in-house financing programs. Use the financing calculator to estimate your monthly amortization.' },
  { q: 'How long does vehicle registration with the LTO take?', a: 'Your dealer handles LTO registration as part of the purchase. Plates and registration documents are usually released within the period set by the LTO.' },
  { q: 'Do you offer roadside assistance?', a: 'Yes. New vehicles include 24/7 roadside assistance during the warranty period. The hotline is printed in your owner’s welcome kit.' },
  { q: 'Can I trade in my current car?', a: 'Yes. Any brand is accepted, subject to inspection. Bring your car to any showroom for a free appraisal.' },
]

export const accessories: { icon: IconName; title: string; items: string[] }[] = [
  { icon: 'award', title: 'Exterior styling', items: ['Chrome window trims', 'Alloy wheel upgrades', 'Rear spoilers', 'Side steps (SUVs)'] },
  { icon: 'shield', title: 'Protection', items: ['All-weather floor mats', 'Trunk liners', 'Mud flaps', 'Paint protection film'] },
  { icon: 'tag', title: 'Cargo & travel', items: ['Roof bars and roof boxes', 'Bike carriers', 'Cargo organizers', 'Tow bars'] },
  { icon: 'cpu', title: 'Tech & comfort', items: ['Dash cameras', 'Wireless phone chargers', 'Rear seat tablet holders', 'Sunshades'] },
]

export const warranty: { icon: IconName; title: string; term: string; copy: string }[] = [
  { icon: 'shield', title: 'Vehicle warranty', term: '5 years or 150,000 km', copy: 'Covers manufacturing defects in materials and workmanship, whichever comes first.' },
  { icon: 'leaf', title: 'High-voltage battery', term: '8 years or 160,000 km', copy: 'For plug-in hybrid and electric models, including battery capacity retention.' },
  { icon: 'wrench', title: 'Genuine parts', term: '1 year, unlimited km', copy: 'Genuine parts and accessories installed by an authorized service center.' },
  { icon: 'phone', title: 'Roadside assistance', term: '24/7 during warranty', copy: 'Towing, jump-start, flat tire and lockout assistance nationwide.' },
]
