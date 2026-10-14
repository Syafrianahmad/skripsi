import { expect, test } from '@playwright/test'
import { FEATURED } from './support.ts'

// Demo tool, highlights, and charts (locale en-US, the browser default).
test.use({ locale: 'en-US' })

test('tombol acak: Math.random tetap 0 memilih cerita id terkecil yang layak (bukan featured, bukan yang aktif)', async ({ page }) => {
  // The pool rules are covered by shuffle.test.ts (seeded, 300 draws). Here only the wiring is checked, with a fixed draw.
  await page.addInitScript(() => {
    Math.random = () => 0
  })
  await page.goto('#/')
  const select = page.locator('.picker-row select')
  await expect(select).toHaveValue(String(FEATURED[0]))

  await page.getByRole('button', { name: 'Random story' }).click()
  // nextStoryId(68, null, () => 0): the lowest eligible id, id 1
  await expect(select).toHaveValue('1')
})

test('sorotan: mark di kartu model punya penanda sr-only, del.cut ada di hero', async ({ page }) => {
  await page.goto('#/')
  const marks = page.locator('article.model-card mark')
  expect(await marks.count()).toBeGreaterThan(0)
  for (const mark of await marks.all()) {
    await expect(mark.locator('.sr-only')).toHaveCount(1)
  }
  expect(await page.locator('.hero del.cut').count()).toBeGreaterThan(0)
})

test.describe('grafik', () => {
  test('tiap svg role=img punya details.chart-data berisi tabel data', async ({ page }) => {
    await page.goto('#/hasil')
    const charts = page.locator('svg[role="img"]')
    const count = await charts.count()
    expect(count).toBeGreaterThanOrEqual(3)

    for (let i = 0; i < count; i++) {
      // nearest ancestor that holds a chart-data block is the chart's own card
      const owner = await charts.nth(i).evaluate((svg) => {
        let node: Element | null = svg
        while (node && !node.querySelector('details.chart-data')) node = node.parentElement
        if (!node) return { found: false, details: 0, rows: 0 }
        const table = node.querySelector('details.chart-data table')
        return {
          found: true,
          details: node.querySelectorAll('details.chart-data').length,
          rows: table ? table.querySelectorAll('tbody tr').length : 0,
        }
      })
      expect(owner, `svg ke-${i} (${await charts.nth(i).getAttribute('aria-label')})`).toEqual({
        found: true,
        details: 1,
        rows: expect.any(Number),
      })
      expect(owner.rows, `svg ke-${i}: tabel tanpa baris`).toBeGreaterThan(0)
    }
  })

  test('tab metrik kurva: ArrowRight, Home, End memindah pilihan dan fokus', async ({ page }) => {
    await page.goto('#/hasil')
    const rouge = page.locator('#curve-tab-rouge')
    const loss = page.locator('#curve-tab-loss')
    await rouge.focus()

    await page.keyboard.press('ArrowRight')
    await expect(loss).toHaveAttribute('aria-selected', 'true')
    await expect(loss).toBeFocused()

    await page.keyboard.press('Home')
    await expect(rouge).toHaveAttribute('aria-selected', 'true')
    await expect(rouge).toBeFocused()

    await page.keyboard.press('End')
    await expect(loss).toHaveAttribute('aria-selected', 'true')
    await expect(loss).toBeFocused()
  })

  test('.chart-scroll (role=region, berlabel unik) dapat difokus keyboard; tabpanel tidak menjadi tab stop kedua', async ({ page }) => {
    await page.goto('#/hasil')
    const scrolls = page.locator('.chart-scroll')
    expect(await scrolls.count()).toBeGreaterThan(0)

    // every scrollable chart is a named region, and no two share a name
    const names: string[] = []
    for (const el of await scrolls.all()) {
      await expect(el).toHaveAttribute('tabindex', '0')
      await expect(el).toHaveAttribute('role', 'region')
      names.push((await el.getAttribute('aria-label')) ?? '')
    }
    expect(names.every((n) => n.trim() !== '')).toBe(true)
    expect(new Set(names).size, `aria-label region ganda: ${names.join(' | ')}`).toBe(names.length)

    // the tabpanel is deliberately not focusable (its tabindex was removed to avoid a second stop)
    expect(await page.locator('#curve-panel').getAttribute('tabindex')).toBeNull()

    // from the selected metric tab, one Tab press lands on the chart region, and Shift+Tab goes back to the tab
    const region = page.locator('#curve-panel .chart-scroll')
    await page.locator('#curve-tab-rouge').focus()
    await page.keyboard.press('Tab')
    await expect(region).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('#curve-tab-rouge')).toBeFocused()
  })

  test('summary chart-data tiap grafik bernama unik (tiga di halaman Hasil)', async ({ page }) => {
    await page.goto('#/hasil')
    const summaries = page.locator('details.chart-data > summary')
    await expect(summaries).toHaveCount(3)
    const names = await summaries.evaluateAll((els) => els.map((el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim()))
    expect(names.every((n) => n !== '')).toBe(true)
    expect(new Set(names).size, `nama summary ganda: ${names.join(' | ')}`).toBe(3)
  })
})

test.describe('kartu model (aksesibilitas)', () => {
  test.use({ locale: 'id-ID' })

  test('id: tiap kartu model memuat "ROUGE-L" di pohon aksesibilitas', async ({ page }) => {
    await page.goto('#/')
    const cards = page.locator('article.model-card')
    await expect(cards).toHaveCount(3)
    for (const card of await cards.all()) {
      // the article itself has no name of its own; its score text (sr-only label + value) is in the accessible tree
      expect(await card.ariaSnapshot()).toContain('ROUGE-L')
    }
  })
})

test.describe('kartu model (aksesibilitas, en)', () => {
  test.use({ locale: 'en-US' })

  test('en: tiap kartu model memuat "ROUGE-L" di pohon aksesibilitas', async ({ page }) => {
    await page.goto('#/')
    const cards = page.locator('article.model-card')
    await expect(cards).toHaveCount(3)
    for (const card of await cards.all()) {
      expect(await card.ariaSnapshot()).toContain('ROUGE-L')
    }
  })
})
