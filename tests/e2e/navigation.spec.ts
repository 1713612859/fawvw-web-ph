import { models } from '../../app/data/models'
import { site } from '../../app/data/site'
import { expect, isMobile, test, open } from './helpers'

// Menu links read "<Model> From ₱…": anchor the name so "Magotan" doesn't also match "Magotan PHEV".
const modelLink = (name: string) => new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} From`)

test.describe('desktop header', () => {
  test.beforeEach(({}, info) => test.skip(isMobile(info.project.name), 'desktop only'))

  test('Models mega menu lists every model and navigates', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const header = page.locator('header')
    await header.getByRole('button', { name: 'Models' }).click()
    const panel = header.locator('div.absolute.top-full')
    await expect(panel).toBeVisible()
    for (const m of models) await expect(panel.getByRole('link', { name: modelLink(m.name) })).toBeVisible()
    await panel.getByRole('link', { name: /Magotan PHEV/ }).click()
    await expect(page).toHaveURL(/\/models\/magotan-phev$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Magotan PHEV' })).toBeVisible()
    await expect(panel).toBeHidden()
  })

  test('menus open on hover and close with Escape or an outside click', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const header = page.locator('header')
    const panel = header.locator('div.absolute.top-full')
    await header.getByRole('button', { name: 'Shopping Tools' }).hover()
    await expect(panel.getByRole('link', { name: /Financing Calculator/ })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()

    await header.getByRole('button', { name: 'Owners' }).click()
    await expect(panel.getByRole('link', { name: /Book a Service/ })).toBeVisible()
    await page.mouse.move(700, 600)
    await page.mouse.click(700, 600)
    await expect(panel).toBeHidden()
  })

  test('header call-to-action buttons work', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    await page.locator('header').getByRole('link', { name: 'Book a Test Drive' }).click()
    await expect(page).toHaveURL(/\/test-drive$/)
    await page.locator('header').getByRole('link', { name: 'Get a Quote' }).click()
    await expect(page).toHaveURL(/\/get-a-quote$/)
  })

  test('floating contact buttons point to Messenger, Viber and the hotline', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    await expect(page.getByRole('link', { name: 'Chat on Messenger' })).toHaveAttribute('href', site.messenger)
    await expect(page.getByRole('link', { name: 'Chat on Viber' })).toHaveAttribute('href', site.viber)
    await expect(page.getByRole('link', { name: `Call ${site.hotline}` })).toHaveAttribute('href', site.hotlineHref)
  })
})

test.describe('mobile header', () => {
  test.beforeEach(({}, info) => test.skip(!isMobile(info.project.name), 'mobile only'))

  test('drawer opens, locks scrolling, expands sections and closes on navigation', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const drawer = page.getByRole('dialog', { name: 'Menu' })
    await expect(drawer).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden')
    // Models section is open by default and lists every model.
    for (const m of models) await expect(drawer.getByRole('link', { name: modelLink(m.name) })).toBeVisible()
    await drawer.getByRole('button', { name: 'Shopping Tools' }).click()
    await drawer.getByRole('link', { name: 'Price List' }).click()
    await expect(page).toHaveURL(/\/price-list$/)
    await expect(drawer).toBeHidden()
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('')
  })

  test('drawer closes with the close button', async ({ page, problems }) => {
    void problems
    await open(page, '/about')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden()
  })

  test('contact button expands Messenger, Viber and Call', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const messenger = page.getByRole('link', { name: 'Chat on Messenger' })
    await expect(messenger).toBeHidden()
    await page.getByRole('button', { name: 'Contact us' }).click()
    await expect(messenger).toBeVisible()
    await expect(page.getByRole('link', { name: `Call ${site.hotline}` })).toBeVisible()
    await page.getByRole('button', { name: 'Close contact options' }).click()
    await expect(messenger).toBeHidden()
  })
})

test.describe('cookie banner', () => {
  test.use({ keepCookieBanner: true })

  test('shows on first visit and remembers "Necessary only"', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const banner = page.getByRole('dialog', { name: 'Cookie preferences' })
    await expect(banner).toBeVisible()
    await banner.getByRole('button', { name: 'Necessary only' }).click()
    await expect(banner).toBeHidden()
    await page.reload()
    await page.locator('html[data-hydrated="true"]').waitFor({ state: 'attached' })
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await expect(banner).toBeHidden()
  })
})

test('footer links navigate', async ({ page, problems }) => {
  void problems
  await open(page, '/')
  const footer = page.locator('footer')
  await footer.getByRole('link', { name: 'Owner FAQ' }).click()
  await expect(page).toHaveURL(/\/owners\/faq$/)
  await page.locator('footer').getByRole('link', { name: 'Privacy Notice' }).click()
  await expect(page).toHaveURL(/\/privacy-notice$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy Notice' })).toBeVisible()
})
