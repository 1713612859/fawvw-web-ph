import { type Page, expect, test as base } from '@playwright/test'
import { news } from '../../app/data/content'
import { models } from '../../app/data/models'
import { companyLinks, legalLinks, ownerLinks, shoppingTools } from '../../app/data/site'

// Every page of the demo, derived from the same data the site is built from.
export const routes = [
  ...new Set([
    '/',
    '/models',
    ...models.map((m) => `/models/${m.slug}`),
    '/news',
    ...news.map((n) => `/news/${n.slug}`),
    ...[...shoppingTools, ...ownerLinks, ...companyLinks, ...legalLinks].map((l) => l.to),
  ]),
]

// Fixture that records console errors/warnings and uncaught page errors, and fails the
// test if any occurred. The cookie banner is pre-dismissed unless a test opts out.
export const test = base.extend<{ problems: string[]; keepCookieBanner: boolean }>({
  keepCookieBanner: [false, { option: true }],
  problems: async ({ page, keepCookieBanner }, use) => {
    const problems: string[] = []
    page.on('console', (msg) => {
      // Only our own site's messages count; embedded third-party frames (Google Maps) are excluded.
      const src = msg.location().url
      const ours = !src || src.startsWith('http://localhost:3211')
      if (ours && (msg.type() === 'error' || msg.type() === 'warning')) problems.push(`console.${msg.type()}: ${msg.text()} (${src})`)
    })
    page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`))
    page.on('response', (res) => {
      const url = res.url()
      if (url.startsWith('http://localhost:3211') && res.status() >= 400 && !res.request().isNavigationRequest()) {
        problems.push(`HTTP ${res.status()}: ${url}`)
      }
    })
    if (!keepCookieBanner) {
      await page.addInitScript(() => {
        try {
          localStorage.setItem('cookie-consent', 'necessary')
        }
        catch {}
      })
    }
    await use(problems)
    expect(problems, 'console errors, page errors or failed requests').toEqual([])
  },
})
export { expect }

// Navigate and wait until the app has hydrated (see app/plugins/hydrated.client.ts).
export async function open(page: Page, url: string) {
  // Don't wait for every image / the Google Maps iframe ("load"); wait for the app to be interactive.
  const res = await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.locator('html[data-hydrated="true"]').waitFor({ state: 'attached' })
  return res
}

// Scroll through the page so lazy images load, then return to the top.
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, window.innerHeight * 0.8)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((r) => setTimeout(r, 150))
    window.scrollTo(0, 0)
  })
}

// Layout/content health checks shared by every page.
export async function expectHealthyPage(page: Page) {
  await expect(page.locator('h1').first()).toBeVisible()
  await scrollThrough(page)
  // Lazy images only load near the viewport: bring any straggler into view, as a visitor would.
  await expect
    .poll(() => page.evaluate(() => {
      const pending = [...document.images].filter((i) => !i.complete)
      pending[0]?.scrollIntoView({ block: 'center' })
      return pending.map((i) => i.currentSrc || i.src)
    }), {
      message: 'images still loading',
      timeout: 15_000,
    })
    .toEqual([])
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.naturalWidth === 0).map((i) => i.currentSrc || i.src))
  expect(broken, 'broken images').toEqual([])
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(0)
  await expect(page.getByText('This page is coming in a later step')).toHaveCount(0)
}

export const isMobile = (projectName: string) => projectName === 'mobile'
