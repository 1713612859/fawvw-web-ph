// Guards the site content: every model, spec sheet, photo, link and dealer reference must
// resolve, and nothing read from fawcar.com may show up untranslated or half-cleaned.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { accessories, faqs, news, newsCover, warranty } from '~/data/content'
import { dealers, regions } from '~/data/dealers'
import { brandStats, heroSlides, promos } from '~/data/home'
import { colorImage, media, promoPhotos } from '~/data/media'
import { modelDetails } from '~/data/modelDetails'
import { categories, models, modelsByPowertrain } from '~/data/models'
import { companyLinks, legalLinks, ownerLinks, shoppingTools } from '~/data/site'
import { cardSpecs, compareRows, compareValue, headlineStats, sources, specSheets, variantDifferences, variantNames } from '~/data/specs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const publicFile = (p: string) => join(root, 'public', p)

function pageExists(route: string) {
  const path = route.split(/[?#]/)[0]!.replace(/^\//, '')
  const base = join(root, 'app/pages', path)
  return path === '' ? existsSync(join(root, 'app/pages/index.vue')) : existsSync(`${base}.vue`) || existsSync(join(base, 'index.vue'))
}

const unique = (xs: string[]) => new Set(xs).size === xs.length
const cjk = /[　-〿぀-ヿ㐀-鿿＀-￯]/
const slugs = models.map((m) => m.slug)

describe('models', () => {
  it('have unique slugs and valid categories', () => {
    expect(unique(slugs)).toBe(true)
    for (const m of models) expect(categories.map((c) => c.key)).toContain(m.category)
    for (const c of categories) expect(models.some((m) => m.category === c.key)).toBe(true)
  })

  it('appear exactly once in the menu grouping (body type → powertrain)', () => {
    const listed = categories.flatMap((c) => modelsByPowertrain(c.key).flatMap((g) => g.models.map((m) => m.slug)))
    expect([...listed].sort()).toEqual([...slugs].sort())
  })

  it('follow the distributor’s line-up order', () => {
    expect(slugs).toEqual([
      'joyee-n01', 'joyee-n09', 'joyee-s08', 'joyee-s04', 'bestune-xiaoma',
      'bestune-b70', 'bestune-t90', 'bestune-t77', 'bestune-m9',
    ])
  })

  it('keep the line-up order in the menus: body types and powertrain groups by first-listed model', () => {
    expect(categories.map((c) => c.key)).toEqual([...new Set(models.map((m) => m.category))])
    for (const c of categories) {
      const inCategory = models.filter((m) => m.category === c.key)
      const grouped = modelsByPowertrain(c.key)
      expect(grouped[0]!.models[0]).toBe(inCategory[0])
      // Within a group, models keep their line-up order.
      for (const g of grouped) {
        const order = g.models.map((m) => inCategory.indexOf(m))
        expect(order).toEqual([...order].sort((a, b) => a - b))
      }
    }
  })

  it('are exactly the models with a fawcar.com spec sheet (no BESTUNE NAT or B70S)', () => {
    expect([...slugs].sort()).toEqual(Object.keys(sources).sort())
    expect(slugs.some((s) => s.includes('nat') || s === 'bestune-b70s')).toBe(false)
  })

  it.each(models.map((m) => [m.slug, m] as const))('%s has a cut-out photo on disk', (_, m) => {
    expect(m.image).toBe(`/images/models/${m.slug}/card.webp`)
    expect(existsSync(publicFile(m.image))).toBe(true)
  })

  it.each(models.map((m) => [m.slug, m] as const))('%s card figures match its spec sheet', (slug, m) => {
    expect(m.keySpecs).toEqual(cardSpecs(slug))
    for (const k of m.keySpecs) expect(k.value).not.toMatch(/^–|undefined/)
    expect(m.tagline.length).toBeGreaterThan(10)
  })
})

describe('spec sheets', () => {
  it.each(slugs.map((s) => [s] as const))('%s: one named variant per fawcar.com variant', (slug) => {
    const names = variantNames[slug]!
    expect(names, `variantNames.${slug}`).toBeDefined()
    expect(names).toHaveLength(sources[slug]!.variants.length)
    expect(unique(names)).toBe(true)
    expect(specSheets[slug]!.variants).toEqual(names)
  })

  it.each(slugs.map((s) => [s] as const))('%s: every row is clean and complete', (slug) => {
    const sheet = specSheets[slug]!
    expect(sheet.groups.length).toBeGreaterThan(3)
    for (const g of sheet.groups) {
      expect(g.name).not.toMatch(cjk)
      for (const r of g.rows) {
        const where = `${slug} / ${g.name} / ${r.label}`
        expect(r.label, where).not.toMatch(cjk)
        expect(r.values, where).toHaveLength(sheet.variants.length)
        expect(r.values.some((v) => v !== ''), where).toBe(true)
        for (const v of r.values) {
          expect(v, where).not.toMatch(cjk)
          for (const line of v.split('\n')) expect(line, where).not.toMatch(/^[●⚪○]\s*\S/)
        }
      }
    }
  })

  it.each(slugs.map((s) => [s] as const))('%s: headline figures, comparison and variant summaries', (slug) => {
    const stats = headlineStats(slug)
    expect(stats.length).toBeGreaterThanOrEqual(3)
    for (const s of stats) expect(s.value).toBeTruthy()
    expect(compareValue(slug, compareRows[0]!.rows.find((r) => r.label === 'Maximum power')!)).not.toBe('–')
    expect(compareValue(slug, compareRows[1]!.rows.find((r) => r.label === 'Seats')!)).not.toBe('–')
    const n = specSheets[slug]!.variants.length
    for (let i = 0; i < n; i++) {
      const diffs = variantDifferences(slug, i)
      // The base variant may have nothing extra (the page then says "Base variant").
      if (i > 0) expect(diffs.length, `${slug} variant ${i}`).toBeGreaterThan(0)
      for (const d of diffs) expect(d).not.toMatch(cjk)
    }
  })
})

describe('model pages', () => {
  it.each(slugs.map((s) => [s] as const))('%s: copy is English and complete', (slug) => {
    const d = modelDetails[slug]!
    expect(d, `modelDetails.${slug}`).toBeDefined()
    const texts = [d.design.title, d.design.copy, d.interior.title, d.interior.copy]
    for (const g of d.highlights) {
      expect(g.items.length, `${slug} / ${g.title}`).toBeGreaterThan(0)
      texts.push(g.title)
      for (const h of g.items) {
        texts.push(h.title)
        // Some fawcar.com features are a title and a photo only: copy may be empty.
        expect(h.copy, `${slug} / ${h.title}`).not.toMatch(cjk)
      }
    }
    for (const t of texts) {
      expect(t.trim(), slug).not.toBe('')
      expect(t, slug).not.toMatch(cjk)
    }
  })

  it.each(slugs.map((s) => [s] as const))('%s: every photo exists and has alt text', (slug) => {
    const m = media[slug]!
    expect(m, `media.${slug}`).toBeDefined()
    expect(m.gallery[0]).toBe(m.hero)
    for (const p of m.gallery) {
      expect(existsSync(publicFile(p.src)), p.src).toBe(true)
      expect(existsSync(publicFile(p.thumb)), p.thumb).toBe(true)
      expect(p.alt.length).toBeGreaterThan(10)
    }
  })

  it.each(slugs.map((s) => [s] as const))('%s: each color has a swatch and a photo', (slug) => {
    const colors = modelDetails[slug]!.colors
    expect(colors.length).toBeGreaterThan(0)
    expect(unique(colors.map((c) => c.name))).toBe(true)
    colors.forEach((c, i) => {
      expect(c.hex).toMatch(/^#[0-9a-f]{6}$/i)
      expect(existsSync(publicFile(colorImage(slug, i + 1))), `${slug} color-${i + 1}`).toBe(true)
    })
    // No photo without a swatch either.
    expect(existsSync(publicFile(colorImage(slug, colors.length + 1)))).toBe(false)
  })

  it('promo photos exist for every promo', () => {
    for (const p of promos) {
      expect(promoPhotos[p.slug], p.slug).toBeDefined()
      expect(existsSync(publicFile(promoPhotos[p.slug]!))).toBe(true)
    }
  })

  it('brand assets exist', () => {
    for (const f of ['/images/brand/fawcar-logo.webp', '/images/brand/fawcar-logo-white.webp', '/favicon.png', '/apple-touch-icon.png']) {
      expect(existsSync(publicFile(f)), f).toBe(true)
    }
  })
})

describe('home and editorial content', () => {
  it('home carousel shows the new-energy models only, in line-up order', () => {
    expect(heroSlides.map((s) => s.model)).toEqual(['joyee-n01', 'joyee-n09', 'joyee-s08', 'joyee-s04', 'bestune-xiaoma'])
    const order = heroSlides.map((s) => slugs.indexOf(s.model))
    expect(order).toEqual([...order].sort((a, b) => a - b))
    for (const s of heroSlides) expect(models.find((m) => m.slug === s.model)!.powertrains).not.toContain('Gasoline')
  })

  it('news items point to real models', () => {
    for (const n of news) expect(slugs).toContain(n.model)
  })

  it('news items link to their fawcar.com original and have a cover', () => {
    expect(unique(news.map((n) => n.slug))).toBe(true)
    for (const n of news) {
      expect(Number.isNaN(Date.parse(n.date))).toBe(false)
      expect(n.body.length).toBeGreaterThanOrEqual(2)
      expect(n.source).toMatch(/^https:\/\/www\.fawcar\.com\/news\/[0-9a-f]{32}$/)
      expect(existsSync(publicFile(newsCover(n).src)), n.slug).toBe(true)
    }
    // Newest first.
    expect(news.map((n) => n.date)).toEqual([...news.map((n) => n.date)].sort().reverse())
  })

  it('promos, FAQ, accessories and warranty are filled in', () => {
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
  it('have unique ids, an address and valid regions', () => {
    expect(unique(dealers.map((d) => d.id))).toBe(true)
    for (const d of dealers) {
      expect(regions.map((r) => r.key)).toContain(d.region)
      expect(d.address.length).toBeGreaterThan(10)
      expect(d.services).toContain('Showroom')
    }
  })

  it('only regions with a dealer are offered', () => {
    for (const r of regions) expect(dealers.some((d) => d.region === r.key), r.label).toBe(true)
  })
})

describe('navigation', () => {
  const links = [...shoppingTools, ...ownerLinks, ...companyLinks, ...legalLinks]
  it.each(links.map((l) => [l.to, l] as const))('%s has a page', (to) => {
    expect(pageExists(to)).toBe(true)
  })
})
