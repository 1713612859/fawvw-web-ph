import { heroSlides, promos } from '../../app/data/home'
import { media } from '../../app/data/media'
import { findModel, models } from '../../app/data/models'
import { expect, test, open } from './helpers'

const inHero = new Set(heroSlides.map((s) => s.model))
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

  await hero.getByRole('button', { name: `Show ${heroNames[3]}` }).click()
  await expect(current()).toHaveAccessibleName(`Show ${heroNames[3]}`)
  // Jumping ahead loads that slide's photo on demand.
  await expect(hero.locator(`img[src="${media[heroSlides[3]!.model]!.hero!.src}"]`)).toBeAttached()
  await expect(hero.getByRole('link', { name: `View ${heroNames[3]}` })).toBeVisible()

  if (info.project.name === 'desktop') {
    await hero.getByRole('button', { name: 'Next slide' }).click()
    await expect(current()).toHaveAccessibleName(`Show ${heroNames[0]}`)
    await hero.getByRole('button', { name: 'Previous slide' }).click()
    await expect(current()).toHaveAccessibleName(`Show ${heroNames[3]}`)
  }

  await hero.getByRole('link', { name: `View ${heroNames[3]}` }).click()
  await expect(page).toHaveURL(new RegExp(`/models/${heroSlides[3]!.model}$`))
})

test('"More vehicles" shows every model not in the hero, and View all opens the line-up', async ({ page, problems }) => {
  void problems
  await open(page, '/')
  const section = page.locator('#models')
  const others = models.filter((m) => !inHero.has(m.slug))
  await expect(section.locator('article')).toHaveCount(others.length)
  for (const m of others) await expect(section.getByRole('heading', { name: m.name, exact: true })).toBeVisible()
  await section.getByRole('link', { name: 'View all' }).click()
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
