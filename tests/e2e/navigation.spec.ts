import { categories, models, powertrainLabel } from '../../app/data/models'
import { site } from '../../app/data/site'
import { expect, isMobile, test, open } from './helpers'

// Menu links read "<Model> <powertrain>": match the whole name so "BESTUNE B70" doesn't also match "BESTUNE B70S".
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const modelLink = (m: (typeof models)[number]) => new RegExp(`^${esc(m.name)} ${esc(powertrainLabel(m))}$`)

test.describe('desktop header', () => {
  test.beforeEach(({}, info) => test.skip(isMobile(info.project.name), 'desktop only'))

  test('Models mega menu lists every model and navigates', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const header = page.locator('header')
    await header.getByRole('button', { name: 'Models' }).click()
    const panel = header.locator('div.absolute.top-full')
    await expect(panel).toBeVisible()
    for (const m of models) await expect(panel.getByRole('link', { name: modelLink(m) })).toBeVisible()
    await panel.getByRole('link', { name: modelLink(models.find((m) => m.slug === 'joyee-s08')!) }).click()
    await expect(page).toHaveURL(/\/models\/joyee-s08$/)
    await expect(page.getByRole('heading', { level: 1, name: 'JOYEE S08' })).toBeVisible()
    await expect(panel).toBeHidden()
  })

  test('home header is transparent over the hero and turns solid on scroll', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const header = page.locator('header')
    await expect(header).toHaveAttribute('data-overlay', 'true')
    // The hero starts under the header.
    const heroTop = await page.getByRole('region', { name: 'Featured models' }).evaluate((el) => el.getBoundingClientRect().top)
    expect(heroTop).toBe(0)
    await page.evaluate(() => window.scrollTo(0, 400))
    await expect(header).not.toHaveAttribute('data-overlay', 'true')
    // Other pages have the solid header.
    await open(page, '/models')
    await expect(header).not.toHaveAttribute('data-overlay', 'true')
  })

  test('mega menu category headings open the filtered line-up', async ({ page, problems }) => {
    void problems
    await open(page, '/')
    const header = page.locator('header')
    await header.getByRole('button', { name: 'Models' }).click()
    await header.locator('div.absolute.top-full').getByRole('link', { name: /^SUVs/ }).click()
    await expect(page).toHaveURL(/\/models\?category=suv$/)
    await expect(page.getByRole('tab', { name: 'SUVs' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('main article')).toHaveCount(models.filter((m) => m.category === 'suv').length)
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
    // "Book a Test Drive" joins "Get a Quote" in the header on wide screens only.
    await page.setViewportSize({ width: 1600, height: 900 })
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
    // Models section is open by default with one row per body type; each opens its models,
    // grouped by powertrain. One body type is open at a time.
    const categoryRow = (label: string) => drawer.getByRole('button', { name: new RegExp(`^${label} \\(`) })
    let previous: (typeof categories)[number] | undefined
    for (const c of categories) {
      const row = categoryRow(c.label)
      await row.click()
      await expect(row).toHaveAttribute('aria-expanded', 'true')
      if (previous) await expect(categoryRow(previous.label)).toHaveAttribute('aria-expanded', 'false')
      for (const m of models.filter((x) => x.category === c.key)) {
        await expect(drawer.getByRole('link', { name: m.name, exact: true })).toBeVisible()
      }
      previous = c
    }
    await categoryRow(categories.find((c) => c.key === 'suv')!.label).click()
    await drawer.getByRole('link', { name: 'JOYEE S04', exact: true }).click()
    await expect(page).toHaveURL(/\/models\/joyee-s04$/)
    await expect(drawer).toBeHidden()
    await page.getByRole('button', { name: 'Open menu' }).click()
    await drawer.getByRole('button', { name: 'Shopping Tools' }).click()
    await drawer.getByRole('link', { name: 'Compare Models' }).click()
    await expect(page).toHaveURL(/\/compare$/)
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

test('footer links navigate (accordion on phones)', async ({ page, problems }, info) => {
  void problems
  await open(page, '/')
  const footer = page.locator('footer')
  if (isMobile(info.project.name)) {
    // Groups are collapsed on phones: one row each, tap to open.
    await expect(footer.getByRole('link', { name: 'Owner FAQ' })).toBeHidden()
    await footer.getByRole('button', { name: 'Owners' }).click()
    await expect(footer.getByRole('button', { name: 'Owners' })).toHaveAttribute('aria-expanded', 'true')
  }
  await footer.getByRole('link', { name: 'Owner FAQ' }).click()
  await expect(page).toHaveURL(/\/owners\/faq$/)
  await page.locator('footer').getByRole('link', { name: 'Privacy Notice' }).click()
  await expect(page).toHaveURL(/\/privacy-notice$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy Notice' })).toBeVisible()
})
