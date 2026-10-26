// Guards the demo content: every link, model, image and dealer reference must resolve.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { accessories, faqs, news, warranty } from '~/data/content'
import { dealers, regions } from '~/data/dealers'
import { brandStats, heroSlides, promos } from '~/data/home'
import { media, promoPhotos } from '~/data/media'
import { modelDetails, specRows } from '~/data/modelDetails'
import { categories, models } from '~/data/models'
import { companyLinks, legalLinks, ownerLinks, shoppingTools } from '~/data/site'

const root = fileURLToPath(new URL('../../', import.meta.url))
const publicFile = (p: string) => join(root, 'public', p)

function pageExists(route: string) {
  const path = route.split(/[?#]/)[0]!.replace(/^\//, '')
  const base = join(root, 'app/pages', path)
  return path === '' ? existsSync(join(root, 'app/pages/index.vue')) : existsSync(`${base}.vue`) || existsSync(join(base, 'index.vue'))
}

const unique = (xs: string[]) => new Set(xs).size === xs.length

describe('models', () => {
  it('have unique slugs and valid categories', () => {
    expect(unique(models.map((m) => m.slug))).toBe(true)
    for (const m of models) expect(categories.map((c) => c.key)).toContain(m.category)
    for (const c of categories) expect(models.some((m) => m.category === c.key)).toBe(true)
  })

  it.each(models.map((m) => [m.slug, m] as const))('%s has an official photo on disk', (_, m) => {
    expect(m.image).toMatch(/^\/images\/models\/[a-z0-9-]+\/card\.webp$/)
    expect(existsSync(publicFile(m.image))).toBe(true)
  })

  it.each(models.map((m) => [m.slug, m] as const))('%s has complete details', (slug, m) => {
    const d = modelDetails[slug]
    expect(d, `modelDetails.${slug}`).toBeDefined()
    expect(d!.intro.length).toBeGreaterThan(40)
    expect(d!.highlights).toHaveLength(3)
    expect(d!.variants.length).toBeGreaterThanOrEqual(1)
    // "Starts at" must equal the cheapest variant.
    expect(Math.min(...d!.variants.map((v) => v.price))).toBe(m.priceFrom)
    for (const v of d!.variants) expect(v.features.length).toBeGreaterThan(0)
    for (const g of specRows) for (const r of g.rows) expect(d!.spec[r.key], `${slug}.${r.key}`).toBeTruthy()
    expect(m.keySpecs).toHaveLength(3)
  })
})

describe('official photos', () => {
  it.each(models.map((m) => [m.slug] as const))('%s: every page photo exists and has alt text', (slug) => {
    const m = media[slug]
    expect(m, `media.${slug}`).toBeDefined()
    const all = [m!.hero, ...m!.features, ...m!.gallery].filter((p): p is NonNullable<typeof p> => !!p)
    expect(m!.gallery.length).toBeGreaterThan(0)
    expect(m!.features).toHaveLength(modelDetails[slug]!.highlights.length)
    for (const p of all) {
      expect(existsSync(publicFile(p.src)), p.src).toBe(true)
      expect(existsSync(publicFile(p.thumb)), p.thumb).toBe(true)
      expect(p.alt.length).toBeGreaterThan(10)
    }
  })

  it('promo photos exist for every promo', () => {
    for (const p of promos) {
      expect(promoPhotos[p.slug], p.slug).toBeDefined()
      expect(existsSync(publicFile(promoPhotos[p.slug]!))).toBe(true)
    }
  })
})

describe('home and editorial content', () => {
  it('hero slides and news point to real models', () => {
    const slugs = models.map((m) => m.slug)
    for (const s of heroSlides) expect(slugs).toContain(s.model)
    for (const n of news) expect(slugs).toContain(n.model)
  })

  it('news, promos, FAQ, accessories and warranty are filled in', () => {
    expect(unique(news.map((n) => n.slug))).toBe(true)
    for (const n of news) {
      expect(Number.isNaN(Date.parse(n.date))).toBe(false)
      expect(n.body.length).toBeGreaterThanOrEqual(3)
    }
    expect(unique(promos.map((p) => p.slug))).toBe(true)
    for (const p of promos) {
      expect(Date.parse(p.validUntil)).toBeGreaterThan(Date.parse('2026-01-01'))
      expect(p.details.length).toBeGreaterThan(0)
    }
    expect(faqs.length).toBeGreaterThanOrEqual(6)
    expect(accessories.length).toBe(4)
    expect(warranty.length).toBe(4)
    expect(brandStats).toHaveLength(4)
  })
})

describe('dealers', () => {
  it('have unique ids and valid regions', () => {
    expect(unique(dealers.map((d) => d.id))).toBe(true)
    for (const d of dealers) expect(regions.map((r) => r.key)).toContain(d.region)
  })

  it.each(regions.map((r) => [r.label, r.key] as const))('%s has a showroom and a service center', (_, key) => {
    const inRegion = dealers.filter((d) => d.region === key)
    expect(inRegion.some((d) => d.services.includes('Showroom'))).toBe(true)
    expect(inRegion.some((d) => d.services.includes('Service'))).toBe(true)
  })
})

describe('navigation', () => {
  const links = [...shoppingTools, ...ownerLinks, ...companyLinks, ...legalLinks]
  it.each(links.map((l) => [l.to, l] as const))('%s has a page', (to) => {
    expect(pageExists(to)).toBe(true)
  })
})
