import { expect, test } from '@playwright/test'
import { measureLayout, PAGES } from './support.ts'

// Soft assertions: one failing category does not hide the others on the same page and width.
// Widths cover phone sizes (320-400), the 480 and 768 breakpoints, the results grid switch (992-1100) and desktop.
const WIDTHS = [320, 330, 345, 360, 374, 375, 390, 400, 480, 520, 767, 768, 786, 800, 1024, 1056, 1072, 1100, 1279, 1280, 1440] as const
// the header is two rows on every width up to 767 (brand + language + theme, then the links): the bound holds on all of them
const HEADER_MAX = 120
const HEADER_MAX_WIDTH = 767

for (const { name, hash } of PAGES) {
  for (const width of WIDTHS) {
    test(`${name} ${width}px: overflow, grid yatim, font SVG, target, tab, header`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(hash)
      await expect(page.locator('h1')).toBeVisible()
      const m = await measureLayout(page)

      expect.soft(m.overflow.scrollWidth, `overflow, elemen keluar: ${m.overflow.offenders.join(' | ') || '-'}`).toBeLessThanOrEqual(m.overflow.clientWidth)
      expect.soft(m.orphans, 'grid yatim (n % kolom == 1)').toEqual([])
      if (m.minSvgFont) {
        expect.soft(m.minSvgFont.effPx, `font SVG terkecil: "${m.minSvgFont.text}" di ${m.minSvgFont.svg}`).toBeGreaterThanOrEqual(12)
      }
      expect.soft(m.smallTargets, 'target interaktif < 44px').toEqual([])
      expect.soft(m.tabsPastEdge.filter((t) => t.px > 0.5), '.tabs melewati tepi kartu (px)').toEqual([])

      if (width <= HEADER_MAX_WIDTH) {
        // the measured height is in the message so the number is visible even when it passes
        expect.soft(m.headerH, `tinggi header terukur ${m.headerH}px, batas ${HEADER_MAX}px`).toBeLessThanOrEqual(HEADER_MAX)
      }
    })
  }
}
