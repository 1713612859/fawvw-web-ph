import { dealers, regions } from '../../app/data/dealers'
import { models } from '../../app/data/models'
import { variantNames } from '../../app/data/variants'
import { monthlyPayment } from '../../app/utils/finance'
import { formatPeso } from '../../app/utils/format'
import { expect, test, open } from './helpers'

test('financing calculator: entered price, amortization formula, quote link', async ({ page, problems }) => {
  void problems
  await open(page, '/financing?model=joyee-s08')
  await expect(page.locator('#fin-model')).toHaveValue('joyee-s08')
  const result = page.locator('[data-finance-result]')
  // The site lists no prices: nothing is estimated until the visitor enters one.
  await expect(result).toContainText('Enter the vehicle price')
  const price = 1_500_000
  await page.locator('#fin-price').fill(String(price))
  await expect(result).toContainText(formatPeso(Math.round(monthlyPayment(price * 0.8, 8, 60))))

  // Range inputs can't be typed into; set the value and fire the input event like a drag would.
  await page.locator('#fin-down').evaluate((el: HTMLInputElement) => {
    el.value = '30'
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await page.getByRole('button', { name: /^36/ }).click()
  await expect(result).toContainText(formatPeso(Math.round(monthlyPayment(price - Math.round(price * 0.3), 8, 36))))
  await expect(result).toContainText(formatPeso(Math.round(price * 0.3)))

  await page.locator('#fin-rate').fill('0')
  await expect(result).toContainText(formatPeso(Math.round((price - Math.round(price * 0.3)) / 36)))

  await expect(page.locator('#fin-variant option')).toHaveText(variantNames['joyee-s08']!)
  await page.locator('#fin-variant').selectOption('1')
  await result.getByRole('link', { name: 'Get an official quote' }).click()
  await expect(page).toHaveURL(/\/get-a-quote\?model=joyee-s08&variant=1$/)
})

test('compare: prefill from link, no duplicate picks, switching models', async ({ page, problems }) => {
  void problems
  await open(page, '/compare?models=bestune-b70')
  await expect(page.locator('#cmp-0')).toHaveValue('bestune-b70')
  // A model already shown in another column cannot be picked again.
  await expect(page.locator('#cmp-0 option[value="joyee-s04"]')).toBeDisabled()
  await page.locator('#cmp-1').selectOption('joyee-n09')
  const table = page.locator('table')
  await expect(table).toContainText('1.5T / 2.0T')
  await expect(table).toContainText('240–565 km')
  await expect(table).not.toContainText('₱')
  await expect(page.locator('a[href="/models/joyee-n09#specs"]')).toBeAttached()
  expect(models.length).toBeGreaterThan(3)
})

test('price list page is gone', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop', 'run once')
  expect((await request.get('/price-list')).status()).toBe(404)
})

test('dealer locator: regions, map follows selection, test drive link', async ({ page, problems }) => {
  void problems
  await open(page, '/dealers')
  const cards = page.locator('main ul > li [role="button"]')
  await expect(cards).toHaveCount(dealers.length)
  // Only regions with a dealer are offered; there is no service filter while every dealer is a showroom.
  await expect(page.getByLabel('Filter by region').locator('option')).toHaveCount(regions.length + 1)
  await expect(page.getByLabel('Filter by service')).toHaveCount(0)
  await page.getByLabel('Filter by region').selectOption('luzon')
  await expect(cards).toHaveCount(dealers.filter((d) => d.region === 'luzon').length)
  await page.getByLabel('Filter by region').selectOption('')

  // Phone numbers are not published yet: no Call button, the hotline instead.
  await expect(page.locator('main a[href^="tel:"]').filter({ hasText: 'Call' })).toHaveCount(0)

  const angeles = dealers.find((d) => d.id === 'angeles')!
  await cards.filter({ hasText: angeles.name }).click()
  await expect(page.locator('iframe[title^="Map of"]')).toHaveAttribute('src', new RegExp(encodeURIComponent(angeles.address).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  await cards.filter({ hasText: angeles.name }).getByRole('link', { name: 'Book a test drive' }).click()
  await expect(page).toHaveURL(/\/test-drive\?dealer=angeles$/)
  await expect(page.locator('#dealer')).toHaveValue('angeles')
})

test('news article links to the fawcar.com original', async ({ page, problems }) => {
  void problems
  await open(page, '/news/joyee-philippine-launch')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Philippines')
  await expect(page.getByRole('link', { name: 'Read the original on fawcar.com' })).toHaveAttribute('href', /^https:\/\/www\.fawcar\.com\/news\/[0-9a-f]{32}$/)
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
