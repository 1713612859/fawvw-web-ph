import { heroSlides, homeModels, promos } from '../../app/data/home'
import { media } from '../../app/data/media'
import { dealers } from '../../app/data/dealers'
import { findModel, models } from '../../app/data/models'
import { expect, test, open } from './helpers'

const heroNames = heroSlides.map((s) => findModel(s.model)!.name)

test('hero carousel: buttons, slide picker and autoplay', async ({ page, problems }, info) => {
  void problems
  await open(page, '/')
  const hero = page.getByRole('region', { name: 'Featured models' })
  const current = () => hero.locator('button[aria-current="true"]')
  await expect(current()).toHaveAccessibleName(`Show ${heroNames[0]}`)
  // On-demand loading: only the visible slide's photo is on the page at first.
  await expect(hero.locator('img')).toHaveCount(1)

  // Autoplay advances on its own (6.5 s per slide) while the pointer is elsewhere.
  await expect(current()).toHaveAccessibleName(`Show ${heroNames[1]}`, { timeout: 9_000 })

  // The next slide was preloaded before it appeared.
  await expect(hero.locator(`img[src="${media[heroSlides[1]!.model]!.hero!.src}"]`)).toBeAttached()

  // Jump to the last slide: its photo loads on demand.
  const last = heroSlides.length - 1
  await hero.getByRole('button', { name: `Show ${heroNames[last]}` }).click()
  await expect(current()).toHaveAccessibleName(`Show ${heroNames[last]}`)
  await expect(hero.locator(`img[src="${media[heroSlides[last]!.model]!.hero!.src}"]`)).toBeAttached()
  await expect(hero.getByRole('link', { name: `View ${heroNames[last]}` })).toBeVisible()

  if (info.project.name === 'desktop') {
    // Next wraps around to the first slide, Previous back to the last.
    await hero.getByRole('button', { name: 'Next slide' }).click()
    await expect(current()).toHaveAccessibleName(`Show ${heroNames[0]}`)
    await hero.getByRole('button', { name: 'Previous slide' }).click()
    await expect(current()).toHaveAccessibleName(`Show ${heroNames[last]}`)
  }

  await hero.getByRole('link', { name: `View ${heroNames[last]}` }).click()
  await expect(page).toHaveURL(new RegExp(`/models/${heroSlides[last]!.model}$`))
})

test('line-up cards show the home page models in order, and View all opens every model', async ({ page, problems }) => {
  void problems
  await open(page, '/')
  const section = page.locator('#models')
  await expect(section.locator('article h3')).toHaveText(homeModels.map((m) => m.name))
  await section.getByRole('link', { name: 'View all models' }).click()
  await expect(page).toHaveURL(/\/models$/)
  await expect(page.locator('main article')).toHaveCount(models.length)
})

test('quick actions and promo cards lead to the right pages', async ({ page, problems }) => {
  void problems
  await open(page, '/')
  await page.getByRole('link', { name: /Financing Calculator/ }).first().click()
  await expect(page).toHaveURL(/\/financing$/)
  await open(page, '/')
  await page.getByRole('link', { name: new RegExp(promos[1]!.title) }).click()
  await expect(page).toHaveURL(new RegExp(`/promos#${promos[1]!.slug}$`))
  await expect(page.locator(`#${promos[1]!.slug}`)).toBeInViewport()
})

test('home lead form: request type, model picker, dealer, confirmation', async ({ page, problems }) => {
  void problems
  await open(page, '/')
  const section = page.locator('#contact')
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByRole('heading', { name: 'How can we help you?' })).toBeVisible()

  await section.getByText('Get a quote', { exact: true }).click()
  await expect(section.getByRole('button', { name: 'Request my quote' })).toBeVisible()
  // Only the home page models are offered; picking one shows its photo.
  await expect(section.locator('input[name="lead-model"]')).toHaveCount(homeModels.length)
  await section.locator('label').filter({ hasText: 'JOYEE S08' }).click()
  await expect(section.getByRole('img', { name: 'JOYEE S08' })).toBeVisible()

  // Contact details, dealer and consent are required.
  await section.getByRole('button', { name: 'Request my quote' }).click()
  await expect(page.getByRole('status')).toHaveCount(0)
  await section.locator('#first-name').fill('Ana')
  await section.locator('#last-name').fill('Cruz')
  await section.locator('#email').fill('ana.test@example.com')
  await section.locator('#mobile').fill('0918 555 1234')
  await section.locator('#region').selectOption('ncr')
  await section.locator('#dealer').selectOption('caloocan')
  await section.getByLabel(/I agree that my personal data/).check()
  await section.getByRole('button', { name: 'Request my quote' }).click()

  const success = page.getByRole('status')
  await expect(success).toContainText('Thank you! Your request is in.')
  await expect(success).toContainText(/QT-[A-Z0-9]{6}/)
  await expect(success).toContainText('JOYEE S08')
  await expect(success).toContainText(dealers.find((d) => d.id === 'caloocan')!.name)
})
