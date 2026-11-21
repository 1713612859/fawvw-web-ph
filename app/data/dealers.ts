// FAWCAR authorized retailers in the Philippines, as listed on fawcar.com (Authorized
// Retailers, country "Philippines"). fawcar.com also gives a contact person and a mobile
// number for each; those are not published here until the retailers confirm what to show.
// Services other than sales, phone numbers and the Bulacan address are to be confirmed.

export type Region = 'ncr' | 'luzon' | 'visayas' | 'mindanao'
export type DealerService = 'Showroom' | 'Service' | 'Parts'

export interface Dealer {
  id: string
  name: string
  region: Region
  city: string
  address: string
  // Empty until confirmed: the page then points to the hotline.
  phone: string
  hours: string
  services: DealerService[]
  // Shown under the address when part of the listing is not confirmed yet.
  note?: string
}

export const dealers: Dealer[] = [
  {
    id: 'caloocan',
    name: 'FAWCAR Manila (Caloocan)',
    region: 'ncr',
    city: 'Caloocan City',
    address: '116C3 Road corner 6th St., Barangay 123, Caloocan City, Metro Manila',
    phone: '',
    hours: 'Weekdays 9:00 AM – 5:00 PM',
    services: ['Showroom'],
  },
  {
    id: 'angeles',
    name: 'FAWCAR Angeles',
    region: 'luzon',
    city: 'Angeles City',
    address: 'Friendship Highway, Santo Domingo, Angeles City, Pampanga',
    phone: '',
    hours: 'Weekdays 9:00 AM – 5:00 PM',
    services: ['Showroom'],
  },
  {
    id: 'bulacan',
    name: 'FAWCAR Bulacan',
    region: 'luzon',
    city: 'Doña Remedios Trinidad',
    address: 'Doña Remedios Trinidad, Bulacan',
    phone: '',
    hours: 'To be confirmed',
    services: ['Showroom'],
    note: 'Street address to be confirmed.',
  },
]

const allRegions: { key: Region; label: string }[] = [
  { key: 'ncr', label: 'Metro Manila (NCR)' },
  { key: 'luzon', label: 'North & South Luzon' },
  { key: 'visayas', label: 'Visayas' },
  { key: 'mindanao', label: 'Mindanao' },
]

// Only regions with at least one dealer, so the forms never offer an empty choice.
export const regions = allRegions.filter((r) => dealers.some((d) => d.region === r.key))

export function dealersIn(region: Region | '') {
  return region ? dealers.filter((d) => d.region === region) : dealers
}

export function mapEmbedUrl(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
}

export function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
