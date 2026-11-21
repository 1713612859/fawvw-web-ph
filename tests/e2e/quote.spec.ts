import { variantNames } from '../../app/data/variants'
import { expect, test, open } from './helpers'

const invalid = (selector: string) => `document.querySelector('${selector}') && !document.querySelector('${selector}').validity.valid`

test('full quote flow: validation, region → dealer cascade, success', async ({ page, problems }) => {
  void problems
  await open(page, '/get-a-quote')

  // Step 1: a model is required
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('Please choose a model.')).toBeVisible()
  await page.locator('label').filter({ has: page.locator('input[value="bestune-t90"]') }).click()
  await expect(page.getByText('Please choose a model.')).toBeHidden()
  await page.locator('#variant').selectOption('1')
  const variant = variantNames['bestune-t90']![1]!
  await expect(page.locator('aside')).toContainText(variant)
  // No prices on the site: the dealer sends them.
  await expect(page.locator('aside')).toContainText('Your dealer will send the Philippine price')
  await expect(page.locator('aside')).not.toContainText('₱')
  await page.getByRole('button', { name: 'Continue' }).click()

  // Step 2: region and dealer are required, dealer list follows region
  await expect(page.locator('#region')).toBeVisible()
  await expect(page.locator('#dealer')).toBeDisabled()
  await page.getByRole('button', { name: 'Continue' }).click()
  expect(await page.evaluate(invalid('#region'))).toBe(true)
  await expect(page.locator('#region option:not([disabled])')).toHaveText(['Metro Manila (NCR)', 'North & South Luzon'])
  await page.locator('#region').selectOption('luzon')
  await expect(page.locator('#dealer option:not([disabled])')).toHaveText(['FAWCAR Angeles', 'FAWCAR Bulacan'])
  await page.locator('#dealer').selectOption('angeles')
  await page.locator('#timeline').selectOption('Within 30 days')
  await page.getByRole('button', { name: 'Continue' }).click()

  // Step 3: contact details, PH mobile format, consent
  await page.locator('#first-name').fill('Maria')
  await page.locator('#last-name').fill('Santos')
  await page.locator('#email').fill('maria.test@example.com')
  await page.locator('#mobile').fill('12345')
  await page.getByRole('button', { name: 'Request my quote' }).click()
  expect(await page.evaluate(invalid('#mobile'))).toBe(true)
  await page.locator('#mobile').fill('0917 123 4567')
  await page.getByRole('button', { name: 'Request my quote' }).click()
  expect(await page.evaluate(`!document.querySelector('input[type=checkbox]').checked`)).toBe(true)
  await expect(page.getByRole('status')).toHaveCount(0)
  await page.getByRole('checkbox').check()
  await page.getByText('Viber', { exact: true }).click()
  await page.getByRole('button', { name: 'Request my quote' }).click()

  const success = page.getByRole('status')
  await expect(success).toContainText('Thank you! Your quote request is in.')
  await expect(success).toContainText(/QT-[A-Z0-9]{6}/)
  await expect(success).toContainText('FAWCAR Angeles')
  await expect(success).toContainText(`BESTUNE T90 ${variant}`)
  await expect(success).toContainText('by viber')

  await success.getByRole('button', { name: 'Submit another request' }).click()
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()
  await expect(page.locator('input[value="bestune-t90"]')).toBeChecked()
})

test('Back returns to the previous step with answers kept', async ({ page, problems }) => {
  void problems
  await open(page, '/get-a-quote?model=joyee-n01')
  await expect(page.locator('input[value="joyee-n01"]')).toBeChecked()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.locator('#region').selectOption('ncr')
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.locator('input[value="joyee-n01"]')).toBeChecked()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('#region')).toHaveValue('ncr')
})

test('dealer link preselects region and dealer', async ({ page, problems }) => {
  void problems
  await open(page, '/get-a-quote?dealer=bulacan&model=joyee-s04')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('#region')).toHaveValue('luzon')
  await expect(page.locator('#dealer')).toHaveValue('bulacan')
})
