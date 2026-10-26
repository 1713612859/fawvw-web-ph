import { localDateFromToday } from '../../app/utils/format'
import { expect, test, open } from './helpers'

const isInvalid = (selector: string) => `!document.querySelector('${selector}').validity.valid`

async function fillContact(page: import('@playwright/test').Page) {
  await page.locator('#first-name').fill('Jose')
  await page.locator('#last-name').fill('Reyes')
  await page.locator('#email').fill('jose.test@example.com')
  await page.locator('#mobile').fill('+63 917 765 4321')
}

test('test drive: prefill, date limits, required license, success', async ({ page, problems }) => {
  void problems
  await open(page, '/test-drive?model=id-aura-t6&dealer=cebu')
  await expect(page.locator('#td-model')).toHaveValue('id-aura-t6')
  await expect(page.locator('#region')).toHaveValue('visayas')
  await expect(page.locator('#dealer')).toHaveValue('cebu')
  await expect(page.locator('#td-date')).toHaveAttribute('min', localDateFromToday(1))

  // Empty submit is blocked
  await page.locator('#td-model').selectOption('magotan')
  await page.getByRole('button', { name: 'Book my test drive' }).click()
  expect(await page.evaluate(isInvalid('#td-date'))).toBe(true)

  const date = localDateFromToday(3)
  await page.locator('#td-date').fill(date)
  await page.locator('#td-slot').selectOption({ index: 2 })
  await fillContact(page)
  await page.getByLabel(/I agree that my personal data/).check()
  // License confirmation is required
  await page.getByRole('button', { name: 'Book my test drive' }).click()
  await expect(page.getByRole('status')).toHaveCount(0)
  await page.getByLabel(/valid driver's license/).check()
  await page.getByRole('button', { name: 'Book my test drive' }).click()

  const success = page.getByRole('status')
  await expect(success).toContainText('Your test drive request is booked.')
  await expect(success).toContainText(/TD-[A-Z0-9]{6}/)
  await expect(success).toContainText('Magotan')
  await expect(success).toContainText('FAW-VW Cebu')
})

test('service booking: service centers only, plate and mileage required, success', async ({ page, problems }) => {
  void problems
  await open(page, '/owners/service')
  await page.locator('#sv-model').selectOption('sagitar')
  await page.locator('#sv-plate').fill('nbc 1234')
  await page.locator('#sv-mileage').fill('20500')
  await page.locator('#sv-type').selectOption('Preventive maintenance (PMS)')
  await page.locator('#sv-date').fill(localDateFromToday(2))
  await page.locator('#sv-slot').selectOption({ index: 1 })
  await page.locator('#region').selectOption('ncr')
  await expect(page.locator('#dealer option:not([disabled])')).toHaveCount(3)
  await page.locator('#dealer').selectOption('alabang')
  await fillContact(page)
  await page.getByRole('button', { name: 'Request appointment' }).click()
  await expect(page.getByRole('status')).toHaveCount(0)
  await page.getByLabel(/I agree that my personal data/).check()
  await page.getByRole('button', { name: 'Request appointment' }).click()

  const success = page.getByRole('status')
  await expect(success).toContainText('Your service appointment is requested.')
  await expect(success).toContainText(/SV-[A-Z0-9]{6}/)
  await expect(success).toContainText('NBC 1234')
  await expect(success).toContainText('FAW-VW Alabang')
})

test('contact form: message length check and success', async ({ page, problems }) => {
  void problems
  await open(page, '/contact')
  await page.locator('#topic').selectOption('Service & maintenance')
  await fillContact(page)
  await page.locator('#message').fill('Hi')
  await page.getByLabel(/I agree that my personal data/).check()
  await page.getByRole('button', { name: 'Send message' }).click()
  expect(await page.evaluate(isInvalid('#message'))).toBe(true)
  await page.locator('#message').fill('When is the next available PMS slot in Taguig?')
  await page.getByRole('button', { name: 'Send message' }).click()
  const success = page.getByRole('status')
  await expect(success).toContainText('Message received. Salamat!')
  await expect(success).toContainText(/CT-[A-Z0-9]{6}/)
  await success.getByRole('button', { name: 'Submit another request' }).click()
  await expect(page.locator('#topic')).toHaveValue('')
})
