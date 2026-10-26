import AxeBuilder from '@axe-core/playwright'
import { expect, test, open } from './helpers'

const pages = ['/', '/models', '/models/talagon', '/get-a-quote', '/test-drive', '/dealers', '/financing', '/compare', '/contact']

for (const path of pages) {
  test(`no critical accessibility violations: ${path}`, async ({ page, problems }, info) => {
    void problems
    test.skip(info.project.name !== 'desktop', 'run once')
    await open(page, path)
    await expect(page.locator('h1').first()).toBeVisible()
    const results = await new AxeBuilder({ page }).exclude('iframe').analyze()
    const critical = results.violations.filter((v) => v.impact === 'critical')
    expect(critical.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
}
