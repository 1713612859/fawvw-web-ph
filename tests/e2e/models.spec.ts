import { media } from '../../app/data/media'
import { modelDetails } from '../../app/data/modelDetails'
import { models } from '../../app/data/models'
import { sourceUrl, specSheets } from '../../app/data/specs'
import { expect, test, open } from './helpers'

test('all-models page filters by category', async ({ page, problems }) => {
  void problems
  await open(page, '/models')
  const cards = page.locator('main article')
  await expect(cards).toHaveCount(models.length)
  await page.getByRole('tab', { name: 'SUVs' }).click()
  await expect(cards).toHaveCount(models.filter((m) => m.category === 'suv').length)
  await expect(page.getByText(`${models.filter((m) => m.category === 'suv').length} models`)).toBeVisible()
})

for (const m of models) {
  test(`model page is complete: ${m.name}`, async ({ page, problems }) => {
    void problems
    const sheet = specSheets[m.slug]!
    await open(page, `/models/${m.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: m.name })).toBeVisible()
    await expect(page.getByRole('img', { name: m.name }).first()).toBeVisible()
    // No prices anywhere: quotes come from the dealers.
    await expect(page.locator('main')).not.toContainText('₱')
    // One card per variant, each with a quote link for that variant.
    const variants = page.locator('#variants')
    for (const [i, name] of sheet.variants.entries()) {
      await expect(variants.getByRole('heading', { name, exact: true })).toBeAttached()
      await expect(variants.locator(`a[href="/get-a-quote?model=${m.slug}&variant=${i}"]`)).toBeAttached()
    }
    // Every specification group from fawcar.com, with the source link.
    const specs = page.locator('#specs')
    for (const g of sheet.groups) await expect(specs.locator('summary', { hasText: g.name }).first()).toBeAttached()
    await expect(specs).toContainText(sheet.groups[0]!.rows[0]!.label)
    await expect(specs.locator(`a[href="${sourceUrl(m.slug)}"]`)).toBeAttached()
    // Call-to-action tiles
    await expect(page.locator(`main a[href="/compare?models=${m.slug}"]`).filter({ hasText: 'Compare Models' })).toBeAttached()
    await expect(page.getByRole('link', { name: /Take a Test Drive/ })).toHaveAttribute('href', `/test-drive?model=${m.slug}`)
  })
}

test('section nav jumps to Specifications and highlights it', async ({ page, problems }) => {
  void problems
  await open(page, '/models/joyee-s04')
  const nav = page.getByRole('navigation', { name: 'Sections' })
  await nav.getByRole('link', { name: 'Specifications' }).click()
  await expect(page.locator('#specs')).toBeInViewport()
  await expect(nav.getByRole('link', { name: 'Specifications' })).toHaveAttribute('aria-current', 'true')
})

test('color picker switches the studio photo', async ({ page, problems }) => {
  void problems
  const colors = modelDetails['joyee-s04']!.colors
  await open(page, '/models/joyee-s04')
  const picker = page.getByRole('radiogroup', { name: 'JOYEE S04 colors' })
  await picker.scrollIntoViewIfNeeded()
  await expect(picker.getByRole('radio')).toHaveCount(colors.length)
  await picker.getByRole('radio', { name: colors[2]!.name }).click()
  await expect(picker.getByRole('radio', { name: colors[2]!.name })).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('[data-color-photo]:visible')).toHaveAttribute('src', '/images/models/joyee-s04/color-3.webp')
})

test('spec sheet: differences only, expand and collapse', async ({ page, problems }) => {
  void problems
  const sheet = specSheets['joyee-s04']!
  const differing = sheet.groups.flatMap((g) => g.rows).filter((r) => new Set(r.values).size > 1).length
  await open(page, '/models/joyee-s04')
  const specs = page.locator('#specs')
  await specs.getByRole('button', { name: 'Expand all' }).click()
  const rows = specs.locator('tbody tr')
  await expect(rows).toHaveCount(sheet.groups.reduce((n, g) => n + g.rows.length, 0))
  await specs.locator('[data-diff-toggle]').check()
  await expect(rows).toHaveCount(differing)
  await specs.locator('[data-diff-toggle]').uncheck()
  await specs.getByRole('button', { name: 'Collapse all' }).click()
  await expect(specs.locator('details[open]')).toHaveCount(0)
})

test('variant "Get a Quote" carries model and variant into the form', async ({ page, problems }) => {
  void problems
  await open(page, '/models/joyee-s04')
  await page.locator('#variants').getByRole('link', { name: 'Get a Quote' }).nth(1).click()
  await expect(page).toHaveURL(/\/get-a-quote\?model=joyee-s04&variant=1$/)
  await expect(page.locator('#variant')).toHaveValue('1')
  await expect(page.locator('input[name="model"][value="joyee-s04"]')).toBeChecked()
})

test('gallery loads only the current and next photo, with small thumbnails', async ({ page, problems }) => {
  void problems
  const exterior = media['bestune-t90']!.gallery.filter((p) => p.kind === 'exterior')
  expect(exterior.length).toBeGreaterThan(2)
  await open(page, '/models/bestune-t90')
  const gallery = page.locator('#gallery')
  await gallery.scrollIntoViewIfNeeded()
  const large = gallery.locator('[data-gallery-photo]')
  await expect(large).toHaveCount(2)
  // Thumbnails are the small files, not the full-size photos.
  const thumbs = gallery.locator('button[aria-label^="Show photo"] img')
  await expect(thumbs).toHaveCount(exterior.length)
  for (const src of await thumbs.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute('src')))) {
    expect(src).toMatch(/-thumb\.webp$/)
  }
  // Moving on adds the following photo, one at a time.
  await gallery.getByRole('button', { name: 'Next photo' }).click()
  await expect(large).toHaveCount(3)
  await expect(gallery.locator('[data-gallery-photo]:not([aria-hidden="true"])')).toHaveAttribute('src', exterior[1]!.src)
})
