import { expect, test, type Page } from '@playwright/test'

// Language switch and number formatting. ID uses a decimal comma and dot thousands separators,
// EN uses a decimal point. The dot-decimal form must not remain anywhere in the Indonesian UI.
const LANG_ID = { name: 'ID, Bahasa Indonesia' }
const LANG_EN = { name: 'EN, English' }

// Thousands in the Indonesian UI are exact counts written with a dot. Only these values are exempt:
// 1.000 (GTrans pairs, training axis tick), 1.500 (training axis tick), 1.633 (Hybrid pairs). Any other dotted
// number, such as the loss 6.881 or a three-digit decimal like 2.811, is a dotted decimal and fails the scan.
const KNOWN_THOUSANDS = new Set(['1.000', '1.500', '1.633'])
const VERSION = /^\d+(\.\d+){2,}$/

/** Text the scan reads: table caption, th and td (inside closed details too), and the loss chart's SVG labels. */
const SCAN_TEXT = 'table caption, table th, table td, #curve-panel svg text'

/** Dotted decimals ("0.7976", "6.881") in what a user sees: visible text, data tables, chart labels. */
async function dottedDecimals(page: Page): Promise<string[]> {
  const found = await page.evaluate((sel) => {
    const visible = document.body.innerText
    const cells = [...document.querySelectorAll(sel)].map((c) => c.textContent ?? '').join(' | ')
    // a whole dotted number, not part of a word, a longer number, or a version-like run
    return [...`${visible} | ${cells}`.matchAll(/(?<![\w.])\d+(?:\.\d+)+(?![\w]|\.\d)/g)].map((m) => m[0])
  }, SCAN_TEXT)
  return found.filter((n) => !KNOWN_THOUSANDS.has(n) && !VERSION.test(n))
}

/** Opens the loss tab, the one place where three-digit decimals (6.881) appear. */
async function openLossTab(page: Page) {
  await page.locator('#curve-tab-loss').click()
  await expect(page.locator('#curve-tab-loss')).toHaveAttribute('aria-selected', 'true')
}

test.describe('bahasa Indonesia (locale browser id-ID)', () => {
  test.use({ locale: 'id-ID' })

  test('halaman Hasil memakai koma desimal dan titik ribuan', async ({ page }) => {
    await page.goto('#/hasil')
    await expect(page.locator('html')).toHaveAttribute('lang', 'id')

    await expect(page.locator('.score-card-value', { hasText: '0,7976' })).toHaveCount(1)
    await expect(page.locator('.score-card-note', { hasText: '+61,8%' })).toHaveCount(1)
    await expect(page.locator('body')).toContainText('1.633')
  })

  test('grafik Loss memakai koma desimal tiga digit: "6,881"', async ({ page }) => {
    await page.goto('#/hasil')
    await openLossTab(page)
    await expect(page.locator('#curve-panel details.chart-data table')).toContainText('6,881')
    await expect(page.locator('#curve-panel details.chart-data table')).not.toContainText('6.881')
  })

  test('tidak ada desimal bertitik tersisa di UI Indonesia (kecuali ribuan)', async ({ page }) => {
    for (const hash of ['#/', '#/hasil']) {
      await page.goto(hash)
      await expect(page.locator('h1')).toBeVisible()
      expect(await dottedDecimals(page), `desimal bertitik di ${hash}`).toEqual([])
    }
    // the loss tab is the only place with three-digit decimals: scan it too
    await page.goto('#/hasil')
    await openLossTab(page)
    expect(await dottedDecimals(page), 'desimal bertitik di grafik Loss').toEqual([])
  })

  test('pengecualian ribuan hanya untuk angka yang dikenal: "1.633" lolos, "6.881" dan "1.2.3" tidak', () => {
    // checked on the rules themselves, with literal strings
    expect(KNOWN_THOUSANDS.has('1.633')).toBe(true)
    expect(KNOWN_THOUSANDS.has('6.881')).toBe(false)
    expect(KNOWN_THOUSANDS.has('2.811')).toBe(false)
    expect(VERSION.test('1.2.3')).toBe(true)
    expect(VERSION.test('0.764')).toBe(false)
  })
})

test.describe('bahasa Inggris (locale browser en-US)', () => {
  test.use({ locale: 'en-US' })

  test('klik EN lalu ID mengganti html[lang] dan format skor', async ({ page }) => {
    await page.goto('#/hasil')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')

    await page.getByRole('button', LANG_ID).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'id')
    await expect(page.locator('.score-card-value', { hasText: '0,7976' })).toHaveCount(1)
    await expect(page.locator('.score-card-note', { hasText: '+61,8%' })).toHaveCount(1)

    await page.getByRole('button', LANG_EN).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('.score-card-value', { hasText: '0.7976' })).toHaveCount(1)
    await expect(page.locator('.score-card-note', { hasText: '+61.8%' })).toHaveCount(1)
    await expect(page.locator('.score-card-value', { hasText: '0,7976' })).toHaveCount(0)
  })

  test('UI Inggris tidak memakai koma desimal pada skor dan tabel data', async ({ page }) => {
    await page.goto('#/hasil')
    await expect(page.locator('h1')).toBeVisible()
    const scores = await page.locator('.score-card-value, .score-card-note').allTextContents()
    expect(scores.length).toBeGreaterThan(0)
    const cells = await page.locator('details.chart-data').locator('table caption, table th, table td').allTextContents()
    expect(cells.length).toBeGreaterThan(0)
    // a comma followed by one or more digits is a decimal, except a thousands group ("1,633"): one to three digits, then groups of three
    const decimalComma = (text: string) => text.replace(/\d{1,3}(,\d{3})+(?!\d)/g, '').match(/\d,\d/g) ?? []
    expect(scores.flatMap(decimalComma), 'koma desimal pada skor').toEqual([])
    expect(cells.flatMap(decimalComma), 'koma desimal pada tabel data').toEqual([])
  })

  test('grafik Loss memakai titik desimal tiga digit: "6.881"', async ({ page }) => {
    await page.goto('#/hasil')
    await openLossTab(page)
    await expect(page.locator('#curve-panel details.chart-data table')).toContainText('6.881')
    await expect(page.locator('#curve-panel details.chart-data table')).not.toContainText('6,881')
  })

  test('tombol bahasa menandai pilihan aktif lewat aria-pressed', async ({ page }) => {
    await page.goto('#/')
    await expect(page.getByRole('button', LANG_EN)).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', LANG_ID).click()
    await expect(page.getByRole('button', LANG_ID)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', LANG_EN)).toHaveAttribute('aria-pressed', 'false')
  })
})
