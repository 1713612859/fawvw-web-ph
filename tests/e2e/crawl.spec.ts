import { expectHealthyPage, expect, routes, test, open } from './helpers'

// 1) Follow every internal link in the generated HTML (including ?model= / ?dealer= links)
//    and make sure each one resolves. Runs once (desktop project).
test('every internal link resolves with HTTP 200', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop', 'link crawl runs once')
  const seen = new Map<string, number>()
  const queue = ['/']
  while (queue.length) {
    const path = queue.shift()!
    if (seen.has(path)) continue
    const res = await request.get(path)
    seen.set(path, res.status())
    const html = await res.text()
    for (const m of html.matchAll(/href="(\/[^"#]*)/g)) {
      const href = m[1]!.replace(/&amp;/g, '&')
      if (href.startsWith('/_nuxt') || /\.(css|js|png|ico|svg|json|webp)(\?|$)/.test(href)) continue
      if (!seen.has(href)) queue.push(href)
    }
    for (const m of html.matchAll(/src="(\/images\/[^"]+)"/g)) {
      const img = await request.head(m[1]!)
      expect(img.status(), m[1]).toBe(200)
    }
  }
  const failures = [...seen].filter(([, s]) => s !== 200)
  expect(failures).toEqual([])
  // Every canonical page must be reachable by following links from the home page.
  for (const r of routes) expect([...seen.keys()], `${r} is linked`).toContain(r)
  expect(seen.size).toBeGreaterThanOrEqual(routes.length)
})

// 2) Render every page in a real browser: no errors, no broken images, no sideways scroll.
for (const route of routes) {
  test(`page renders cleanly: ${route}`, async ({ page, problems }) => {
    void problems
    const res = await open(page, route)
    expect(res?.status()).toBe(200)
    await expectHealthyPage(page)
  })
}

test('unknown URLs show the branded 404 page with working shortcuts', async ({ page }) => {
  const res = await open(page, '/this-page-does-not-exist')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: "We can't find that page" })).toBeVisible()
  await page.getByRole('button', { name: 'All models' }).click()
  await expect(page).toHaveURL(/\/models$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Find your Volkswagen' })).toBeVisible()
})

test('unknown model slug shows the 404 page', async ({ page }) => {
  const res = await open(page, '/models/not-a-car')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: "We can't find that page" })).toBeVisible()
  await page.getByRole('button', { name: 'Back to home' }).click()
  await expect(page).toHaveURL(/\/$/)
})
