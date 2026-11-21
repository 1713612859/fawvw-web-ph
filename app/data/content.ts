// Editorial content: news, owner FAQ, accessories and warranty.
// News items are short summaries written for this site from FAWCAR announcements on
// fawcar.com, each linking to the original. Owner programs that the distributor has not
// confirmed yet say "to be confirmed" instead of stating terms.
import type { IconName } from '~/utils/icons'
import { media } from './media'

export interface NewsItem {
  slug: string
  category: string
  date: string
  title: string
  excerpt: string
  // Featured model (card fallback photo and "featured in this story" box).
  model: string
  // Cover photo; without one the featured model's photo is used.
  cover?: { src: string; alt: string }
  // Original announcement on fawcar.com.
  source: string
  body: string[]
}

const fawcarNews = (id: string) => `https://www.fawcar.com/news/${id}`

export const news: NewsItem[] = [
  {
    slug: 'joyee-philippine-launch',
    category: 'Events',
    date: '2026-10-22',
    title: 'JOYEE N09, S08 and S04 launch in the Philippines',
    excerpt: 'Three JOYEE models made their Philippine debut at the World Trade Center in Manila.',
    model: 'joyee-n09',
    cover: { src: '/images/news/ph-launch.webp', alt: 'JOYEE N09, S08 and S04 on stage at the FAWCAR launch in Manila' },
    source: fawcarNews('46a66a22afcf4e0b9fdb72b1eb50acbd'),
    body: [
      'On October 22, FAWCAR launched its JOYEE series at the World Trade Center in Manila. The JOYEE S04 electric SUV, the JOYEE S08 plug-in hybrid SUV and the JOYEE N09 sedan, in its first appearance outside China, made their official Philippine debut.',
      'More than 400 guests attended. FAWCAR signed agreements with seven Philippine dealers at the event, and around 1,400 intended orders were recorded.',
      'Explore the three models, compare their specifications and request a quote from your nearest dealer.',
    ],
  },
  {
    slug: 'joyee-cambodia-launch',
    category: 'News',
    date: '2026-08-22',
    title: 'JOYEE S04 and S08 launch in Cambodia',
    excerpt: 'The second stop of a cross-border test drive and launch tour, held in Phnom Penh.',
    model: 'joyee-s08',
    source: fawcarNews('c2bf43bb81754e6db73daea9daebe8c7'),
    body: [
      'On August 22, the JOYEE S04 and JOYEE S08 launched in Phnom Penh, the second stop of a cross-border long-distance test drive and launch tour through Southeast Asia.',
      'According to FAWCAR, orders taken at the launch reached 175% of the target.',
    ],
  },
  {
    slug: 'joyee-laos-launch',
    category: 'News',
    date: '2026-08-17',
    title: 'JOYEE S04 and S08 launch in Laos with a new Vientiane dealership',
    excerpt: 'A launch event and the grand opening of a new showroom in Vientiane.',
    model: 'joyee-s04',
    source: fawcarNews('9bce716497524679953f93b8bf6a8398'),
    body: [
      'On August 17, FAWCAR launched the JOYEE S04 and JOYEE S08 in Laos and opened a new dealership in Vientiane.',
      'FAWCAR reports that sales leads reached 120% and orders 180% of their targets for the event.',
    ],
  },
]

// The story's cover photo, falling back to the featured model's hero photo.
export function newsCover(item: NewsItem): { src: string; alt: string } {
  return item.cover ?? media[item.model]!.hero
}

export const faqs: { q: string; a: string }[] = [
  { q: 'How often should I bring my vehicle in for preventive maintenance (PMS)?', a: 'Your maintenance schedule is listed in the owner’s manual and service booklet. Service intervals for Philippine models are to be confirmed.' },
  { q: 'Will servicing outside an authorized dealer void my warranty?', a: 'To keep full warranty coverage, scheduled maintenance should be performed at an authorized FAWCAR dealer using genuine parts. Warranty terms are to be confirmed.' },
  { q: 'What do I need to bring for my service appointment?', a: 'Please bring your vehicle registration (OR/CR), service booklet and the key. Arrive 10 minutes early so our service advisor can check your vehicle in.' },
  { q: 'Can I charge an electric or plug-in hybrid model at home?', a: 'The JOYEE electric and plug-in hybrid models support AC charging and DC fast charging. Ask your dealer about home charging equipment and installation.' },
  { q: 'What payment and financing options are available?', a: 'Cash and bank financing. Use the financing calculator with the price from your dealer quote to estimate your monthly amortization.' },
  { q: 'How long does vehicle registration with the LTO take?', a: 'Your dealer handles LTO registration as part of the purchase. Plates and registration documents are usually released within the period set by the LTO.' },
  { q: 'Do you offer roadside assistance?', a: 'Roadside assistance coverage for new vehicles is to be confirmed. Your dealer will give you the details at handover.' },
  { q: 'Can I trade in my current car?', a: 'Ask your dealer: trade-in programs and appraisal are to be confirmed per showroom.' },
]

export const accessories: { icon: IconName; title: string; items: string[] }[] = [
  { icon: 'award', title: 'Exterior styling', items: ['Window trims', 'Alloy wheel upgrades', 'Rear spoilers', 'Side steps (SUVs)'] },
  { icon: 'shield', title: 'Protection', items: ['All-weather floor mats', 'Trunk liners', 'Mud flaps', 'Paint protection film'] },
  { icon: 'tag', title: 'Cargo & travel', items: ['Roof bars and roof boxes', 'Bike carriers', 'Cargo organizers', 'Tow bars'] },
  { icon: 'cpu', title: 'Tech & comfort', items: ['Dash cameras', 'Wireless phone chargers', 'Rear seat tablet holders', 'Sunshades'] },
]

export const warranty: { icon: IconName; title: string; term: string; copy: string }[] = [
  { icon: 'shield', title: 'Vehicle warranty', term: 'To be confirmed', copy: 'Covers manufacturing defects in materials and workmanship.' },
  { icon: 'leaf', title: 'High-voltage battery', term: 'To be confirmed', copy: 'For electric, range-extended and plug-in hybrid models.' },
  { icon: 'wrench', title: 'Genuine parts', term: 'To be confirmed', copy: 'Genuine parts and accessories installed by an authorized dealer.' },
  { icon: 'phone', title: 'Roadside assistance', term: 'To be confirmed', copy: 'Towing, jump-start, flat tire and lockout assistance.' },
]
