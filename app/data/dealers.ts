// SAMPLE dealer network for the demo. Replace with the real showroom list
// (name, full address, phone, hours, coordinates) before launch.

export type Region = 'ncr' | 'luzon' | 'visayas' | 'mindanao'
export type DealerService = 'Showroom' | 'Service' | 'Parts'

export const regions: { key: Region; label: string }[] = [
  { key: 'ncr', label: 'Metro Manila (NCR)' },
  { key: 'luzon', label: 'North & South Luzon' },
  { key: 'visayas', label: 'Visayas' },
  { key: 'mindanao', label: 'Mindanao' },
]

export interface Dealer {
  id: string
  name: string
  region: Region
  city: string
  address: string
  phone: string
  hours: string
  services: DealerService[]
}

const weekday = 'Mon–Sat 8:00 AM – 6:00 PM · Sun 9:00 AM – 5:00 PM'

export const dealers: Dealer[] = [
  { id: 'bgc', name: 'FAW-VW Bonifacio Global City', region: 'ncr', city: 'Taguig City', address: 'Bonifacio Global City, Taguig City, Metro Manila', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service', 'Parts'] },
  { id: 'quezon-city', name: 'FAW-VW Quezon City', region: 'ncr', city: 'Quezon City', address: 'Quezon Avenue, Quezon City, Metro Manila', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service', 'Parts'] },
  { id: 'alabang', name: 'FAW-VW Alabang', region: 'ncr', city: 'Muntinlupa City', address: 'Alabang, Muntinlupa City, Metro Manila', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service'] },
  { id: 'pampanga', name: 'FAW-VW Pampanga', region: 'luzon', city: 'San Fernando', address: 'City of San Fernando, Pampanga', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service'] },
  { id: 'batangas', name: 'FAW-VW Batangas', region: 'luzon', city: 'Batangas City', address: 'Batangas City, Batangas', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service'] },
  { id: 'cebu', name: 'FAW-VW Cebu', region: 'visayas', city: 'Mandaue City', address: 'Mandaue City, Cebu', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service', 'Parts'] },
  { id: 'iloilo', name: 'FAW-VW Iloilo', region: 'visayas', city: 'Iloilo City', address: 'Mandurriao, Iloilo City, Iloilo', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service'] },
  { id: 'davao', name: 'FAW-VW Davao', region: 'mindanao', city: 'Davao City', address: 'Lanang, Davao City, Davao del Sur', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service', 'Parts'] },
  { id: 'cdo', name: 'FAW-VW Cagayan de Oro', region: 'mindanao', city: 'Cagayan de Oro', address: 'Cagayan de Oro City, Misamis Oriental', phone: '+63 2 8000 0000', hours: weekday, services: ['Showroom', 'Service'] },
]

export function dealersIn(region: Region | '') {
  return region ? dealers.filter((d) => d.region === region) : dealers
}

export function mapEmbedUrl(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
}

export function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
