import { expect, test } from '@playwright/test'
import { PAGES } from './support.ts'

// localStorage that throws (private mode, blocked site data): the app must still render and work.
test.describe('localStorage diblokir', () => {
  for (const { name, hash } of PAGES) {
    test(`${name}: halaman tetap render dan konten utama terlihat`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.addInitScript(() => {
        const blocked = () => {
          throw new DOMException('blocked by test', 'SecurityError')
        }
        Storage.prototype.getItem = blocked
        Storage.prototype.setItem = blocked
      })

      await page.goto(hash)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('main#main')).toBeVisible()

      // the theme toggle still works without storage (the choice just does not persist)
      const before = await page.evaluate(() => document.documentElement.dataset.theme)
      await page.getByRole('button', { name: /Switch to (dark|light) mode/ }).click()
      await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).not.toBe(before)

      expect(errors).toEqual([])
    })
  }
})
