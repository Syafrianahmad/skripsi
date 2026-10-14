import { expect, test } from '@playwright/test'

// The production build ships a Content-Security-Policy <meta>. A blocked inline script or style shows up as a
// console error that names the policy, so a page that loads with no such message is one the policy does not break.
test.describe('Content-Security-Policy', () => {
  for (const { name, hash } of [
    { name: 'demo', hash: '#/' },
    { name: 'hasil', hash: '#/hasil' },
  ]) {
    test(`${name}: tidak ada pelanggaran CSP di konsol dan tidak ada error halaman`, async ({ page }) => {
      const messages: string[] = []
      const errors: string[] = []
      page.on('console', (msg) => messages.push(msg.text()))
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(hash)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1)

      expect(messages.filter((m) => m.includes('Content Security Policy')), 'pesan konsol CSP').toEqual([])
      expect(errors, 'error halaman').toEqual([])
    })
  }
})
