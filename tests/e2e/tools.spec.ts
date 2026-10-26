import { dealers } from '../../app/data/dealers'
import { modelDetails } from '../../app/data/modelDetails'
import { formatPrice, models } from '../../app/data/models'
import { monthlyPayment } from '../../app/utils/finance'
import { expect, test, open } from './helpers'

test('financing calculator matches the amortization formula', async ({ page, problems }) => {
  void problems
  await open(page, '/financing?model=sagitar')
  await expect(page.locator('#fin-model')).toHaveValue('sagitar')
  const price = modelDetails.sagitar!.variants[0]!.price
  const result = page.locator('aside')
  await expect(result).toContainText(formatPrice(Math.round(monthlyPayment(price * 0.8, 8, 60))))

  // Range inputs can't be typed into; set the value and fire the input event like a drag would.
  await page.locator('#fin-down').evaluate((el: HTMLInputElement) => {
    el.value = '30'
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await page.getByRole('button', { name: /^36/ }).click()
  await expect(result).toContainText(formatPrice(Math.round(monthlyPayment(price - Math.round(price * 0.3), 8, 36))))
  await expect(result).toContainText(formatPrice(Math.round(price * 0.3)))

  await page.locator('#fin-rate').fill('0')
  await expect(result).toContainText(formatPrice(Math.round((price - Math.round(price * 0.3)) / 36)))

  await page.locator('#fin-variant').selectOption('1')
  await expect(result).toContainText(formatPrice(modelDetails.sagitar!.variants[1]!.price))

  await result.getByRole('link', { name: 'Get an official quote' }).click()
  await expect(page).toHaveURL(/\/get-a-quote\?model=sagitar&variant=1$/)
})

test('compare: prefill from link, no duplicate picks, switching models', async ({ page, problems }) => {
  void problems
  await open(page, '/compare?models=bora')
  await expect(page.locator('#cmp-0')).toHaveValue('bora')
  // A model already shown in another column cannot be picked again.
  await expect(page.locator('#cmp-0 option[value="talagon"]')).toBeDisabled()
  await page.locator('#cmp-1').selectOption('id-aura-t6')
  const table = page.locator('table')
  await expect(table).toContainText('Battery electric')
  await expect(table).toContainText(formatPrice(models.find((m) => m.slug === 'bora')!.priceFrom))
})

test('price list shows every variant with a quote link', async ({ page, problems }) => {
  void problems
  await open(page, '/price-list')
  const total = Object.values(modelDetails).reduce((n, d) => n + d.variants.length, 0)
  await expect(page.locator('tbody tr')).toHaveCount(total)
  await expect(page.getByRole('link', { name: 'Get a quote →' })).toHaveCount(total)
})

test('dealer locator: filters, map follows selection, test drive link', async ({ page, problems }) => {
  void problems
  await open(page, '/dealers')
  const cards = page.locator('main ul > li [role="button"]')
  await expect(cards).toHaveCount(dealers.length)
  await page.getByLabel('Filter by region').selectOption('visayas')
  await expect(cards).toHaveCount(dealers.filter((d) => d.region === 'visayas').length)
  await page.getByLabel('Filter by region').selectOption('')
  await page.getByLabel('Filter by service').selectOption('Parts')
  await expect(cards).toHaveCount(dealers.filter((d) => d.services.includes('Parts')).length)
  await page.getByLabel('Filter by service').selectOption('')

  const davao = dealers.find((d) => d.id === 'davao')!
  await cards.filter({ hasText: davao.name }).click()
  await expect(page.locator('iframe[title^="Map of"]')).toHaveAttribute('src', new RegExp(encodeURIComponent(davao.address).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  await cards.filter({ hasText: davao.name }).getByRole('link', { name: 'Book a test drive' }).click()
  await expect(page).toHaveURL(/\/test-drive\?dealer=davao$/)
  await expect(page.locator('#dealer')).toHaveValue('davao')
})

test('owner FAQ accordion opens one answer at a time', async ({ page, problems }) => {
  void problems
  await open(page, '/owners/faq')
  const buttons = page.locator('main button[aria-expanded]')
  await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
  await buttons.nth(2).click()
  await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'true')
  await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false')
})

test('legal pages link to each other', async ({ page, problems }) => {
  void problems
  await open(page, '/privacy-notice')
  await expect(page.getByText('Data Privacy Act of 2012').first()).toBeVisible()
  await page.getByRole('navigation', { name: 'Legal pages' }).getByRole('link', { name: 'Cookie Policy' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeVisible()
})
