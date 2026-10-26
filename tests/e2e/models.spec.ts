import { media } from '../../app/data/media'
import { modelDetails } from '../../app/data/modelDetails'
import { formatPrice, models } from '../../app/data/models'
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
    const d = modelDetails[m.slug]!
    await open(page, `/models/${m.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: m.name })).toBeVisible()
    await expect(page.getByText(formatPrice(m.priceFrom)).first()).toBeVisible()
    await expect(page.getByRole('img', { name: m.name }).first()).toBeVisible()
    // Variants with prices
    for (const v of d.variants) {
      await expect(page.getByRole('heading', { name: v.name, exact: true })).toBeAttached()
      await expect(page.getByText(formatPrice(v.price)).first()).toBeAttached()
    }
    // Specification groups
    for (const g of ['Dimensions', 'Powertrain', 'Safety & technology']) {
      await expect(page.locator('#specs').getByRole('heading', { name: g })).toBeAttached()
    }
    await expect(page.locator('#specs')).toContainText(d.spec.transmission)
    // Call-to-action tiles
    await expect(page.locator(`main a[href="/compare?models=${m.slug}"]`).filter({ hasText: 'Compare Models' })).toBeAttached()
    await expect(page.getByRole('link', { name: /Take a Test Drive/ })).toHaveAttribute('href', `/test-drive?model=${m.slug}`)
  })
}

test('section nav jumps to Specifications and highlights it', async ({ page, problems }) => {
  void problems
  await open(page, '/models/talagon')
  const nav = page.getByRole('navigation', { name: 'Sections' })
  await nav.getByRole('link', { name: 'Specifications' }).click()
  await expect(page.locator('#specs')).toBeInViewport()
  await expect(nav.getByRole('link', { name: 'Specifications' })).toHaveAttribute('aria-current', 'true')
})

test('variant "Get a Quote" carries model and variant into the form', async ({ page, problems }) => {
  void problems
  await open(page, '/models/sagitar')
  await page.locator('#variants').getByRole('link', { name: 'Get a Quote' }).nth(1).click()
  await expect(page).toHaveURL(/\/get-a-quote\?model=sagitar&variant=1$/)
  await expect(page.locator('#variant')).toHaveValue('1')
  await expect(page.locator('input[name="model"][value="sagitar"]')).toBeChecked()
})

test('gallery loads only the current and next photo, with small thumbnails', async ({ page, problems }) => {
  void problems
  const exterior = media.talagon!.gallery.filter((p) => p.kind === 'exterior')
  expect(exterior.length).toBeGreaterThan(2)
  await open(page, '/models/talagon')
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
