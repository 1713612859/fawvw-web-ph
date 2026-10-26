// Site-wide settings. Contact details are demo placeholders: replace them with the
// distributor's real company name, address, phone, e-mail and social pages before launch.
export const site = {
  name: 'FAW-VW Philippines',
  // Legal company name of the distributor, shown in the footer and legal pages when set.
  distributor: '',
  address: 'Bonifacio Global City, Taguig City, Metro Manila',
  hotline: '+63 2 8000 0000',
  hotlineHref: 'tel:+63280000000',
  email: 'hello@example.ph',
  hours: 'Mon–Sat 8:00 AM – 6:00 PM',
  messenger: 'https://m.me/',
  viber: 'viber://chat?number=%2B639000000000',
  socials: [
    { name: 'Facebook', href: 'https://www.facebook.com/' },
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/' },
    { name: 'YouTube', href: 'https://www.youtube.com/' },
  ],
}

export const companyName = site.distributor || site.name

export interface NavLink {
  label: string
  to: string
  desc?: string
}

export const shoppingTools: NavLink[] = [
  { label: 'Get a Quote', to: '/get-a-quote', desc: 'Fast price quote from your nearest dealer' },
  { label: 'Book a Test Drive', to: '/test-drive', desc: 'Pick a model, date and showroom' },
  { label: 'Price List', to: '/price-list', desc: 'Latest SRP for every variant' },
  { label: 'Compare Models', to: '/compare', desc: 'Side-by-side specs' },
  { label: 'Financing Calculator', to: '/financing', desc: 'Estimate your monthly amortization' },
  { label: 'Promos & Offers', to: '/promos', desc: 'Current deals and programs' },
]

export const ownerLinks: NavLink[] = [
  { label: 'Book a Service (PMS)', to: '/owners/service', desc: 'Preventive maintenance booking' },
  { label: 'Warranty', to: '/owners/warranty', desc: 'Coverage and terms' },
  { label: 'Genuine Accessories', to: '/owners/accessories', desc: 'Personalize your Volkswagen' },
  { label: 'Owner FAQ', to: '/owners/faq', desc: 'Answers to common questions' },
]

export const companyLinks: NavLink[] = [
  { label: 'About Us', to: '/about' },
  { label: 'News & Events', to: '/news' },
  { label: 'Find a Dealer', to: '/dealers' },
  { label: 'Contact Us', to: '/contact' },
]

export const legalLinks: NavLink[] = [
  { label: 'Privacy Notice', to: '/privacy-notice' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
]
