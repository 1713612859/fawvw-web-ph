// Model photos from fawcar.com (CDN originals, reviewed: no Chinese text), converted by
// scripts/process-fawcar-photos.mjs into /public/images/models/<slug>/.
// The feature-block photos of the model pages are hosted elsewhere on fawcar.com and
// can't be downloaded by script, so there are none yet.
export interface Photo {
  src: string
  // ~240 px wide version for the gallery thumbnail strip
  thumb: string
  alt: string
  kind: 'exterior' | 'interior'
}

export interface ModelMedia {
  // Full-screen hero background.
  hero: Photo
  gallery: Photo[]
}

const photo = (slug: string, file: string, alt: string, kind: Photo['kind'] = 'exterior'): Photo => ({
  src: `/images/models/${slug}/${file}.webp`,
  thumb: `/images/models/${slug}/${file}-thumb.webp`,
  alt,
  kind,
})

// Colour cut-out (alpha) for the colour picker, matching modelDetails[slug].colors[n - 1].
export const colorImage = (slug: string, n: number) => `/images/models/${slug}/color-${n}.webp`

function set(slug: string, heroAlt: string, more: [file: string, alt: string, kind?: Photo['kind']][]): ModelMedia {
  const hero = photo(slug, 'hero', heroAlt)
  return { hero, gallery: [hero, ...more.map(([f, a, k]) => photo(slug, f, a, k ?? (f.startsWith('interior') ? 'interior' : 'exterior')))] }
}

export const media: Record<string, ModelMedia> = {
  'joyee-n09': set('joyee-n09', 'JOYEE N09 in purple outside a modern house by a pool', [
    ['scene-2', 'JOYEE N09 with the trunk and rear door open'],
    ['scene-3', 'JOYEE N09 under a concrete canopy'],
    ['scene-4', 'JOYEE N09 in green on a driveway'],
    ['interior-1', 'JOYEE N09 dashboard and central screen, pink interior'],
    ['scene-1', 'Passenger relaxing on the reclined front seat of the JOYEE N09', 'interior'],
  ]),
  'joyee-s08': set('joyee-s08', 'JOYEE S08 in green on a beach', [
    ['interior-1', 'JOYEE S08 cockpit, beige interior'],
    ['interior-2', 'JOYEE S08 cockpit, brown interior'],
    ['interior-3', 'JOYEE S08 cockpit, black interior'],
  ]),
  'joyee-s04': set('joyee-s04', 'Two JOYEE S04, pink and green, in front of a white building', [
    ['interior-1', 'JOYEE S04 cockpit, white interior'],
    ['interior-2', 'JOYEE S04 cockpit, gray interior'],
    ['interior-3', 'JOYEE S04 cockpit, orange interior'],
  ]),
  'joyee-n01': set('joyee-n01', 'JOYEE N01 in orange and light blue in front of arched windows', [
    ['interior-1', 'JOYEE N01 dashboard, gray interior'],
    ['interior-2', 'JOYEE N01 dashboard, green interior'],
  ]),
  'bestune-b70': set('bestune-b70', 'BESTUNE B70 on a rooftop terrace above the city', [
    ['interior-1', 'BESTUNE B70 cockpit with curved displays, black interior'],
  ]),
  'bestune-t90': set('bestune-t90', 'BESTUNE T90 in silver beside a garden and house', [
    ['scene-1', 'BESTUNE T90 by palm trees on the seafront'],
    ['scene-2', 'BESTUNE T90 on a coastal road'],
    ['scene-3', 'BESTUNE T90 on a residential street'],
    ['scene-4', 'BESTUNE T90 at night outside a lit building'],
    ['interior-1', 'BESTUNE T90 cockpit, red and white interior'],
  ]),
  'bestune-t77': set('bestune-t77', 'BESTUNE T77 in yellow in a studio with neon lights', [
    ['interior-1', 'BESTUNE T77 cockpit with dual screens, black interior'],
  ]),
  'bestune-m9': set('bestune-m9', 'BESTUNE M9 parked by a lake', [
    ['interior-1', 'BESTUNE M9 dashboard, beige interior'],
  ]),
  'bestune-xiaoma': set('bestune-xiaoma', 'BESTUNE XIAOMA in beige on a city street', [
    ['interior-1', 'BESTUNE XIAOMA dashboard, blue interior'],
    ['interior-2', 'BESTUNE XIAOMA dashboard, gold interior'],
  ]),
}

// Promo card photos (by promo slug).
export const promoPhotos: Record<string, string> = {
  'low-down-payment': media['joyee-s04']!.hero.src,
  'free-pms': media['joyee-s08']!.gallery[1]!.src,
  'trade-in-bonus': media['bestune-t90']!.gallery[2]!.src,
}
