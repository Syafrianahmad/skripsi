import { expect, test, type Page } from '@playwright/test'

// Hash routing, section anchors, shared story links, focus after navigation, page titles.
// The dictionary text in these tests is Indonesian, so the browser locale is id-ID.
test.use({ locale: 'id-ID' })

const navLink = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('link', { name, exact: true })

const activeId = (page: Page) => page.evaluate(() => document.activeElement?.id)

test('nav Temuan memfokus bagian temuan dan menggulir ke sana walau hash sudah sama', async ({ page }) => {
  await page.goto('#/#temuan')
  // pick a story chip first so the page is not left at the anchor by accident
  await page.locator('label.chip').nth(1).click()
  await navLink(page, 'Temuan').click()

  await expect.poll(() => activeId(page)).toBe('temuan')
  // the section top lands at the top of the viewport (scrollIntoView default)
  await expect
    .poll(() => page.locator('#temuan').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(2)
  await expect
    .poll(() => page.locator('#temuan').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeGreaterThanOrEqual(-2)
})

test('regresi S1: nav Temuan tidak mengubah cerita; tautan cerita baru menggantinya lalu ke #alat', async ({ page }) => {
  await page.goto('#/demo#story=12')
  const select = page.locator('.picker-row select')
  const filter = page.locator('.picker-filter select')
  const modes = page.locator('.segmented button')
  await expect(select).toHaveValue('12')

  // a Temuan link keeps the chosen story and focuses the findings section
  await navLink(page, 'Temuan').click()
  await expect.poll(() => activeId(page)).toBe('temuan')
  await expect(select).toHaveValue('12')

  // set a filter and the compare mode, so a story link must reset both
  await filter.selectOption('aku:hybrid')
  await modes.nth(1).click()
  await expect(modes.nth(1)).toHaveAttribute('aria-pressed', 'true')

  // a second story link pasted into the same tab: switches to story 40, scrolls to the tool, resets filter and mode
  await page.evaluate(() => {
    location.hash = '#/demo#story=40'
  })
  await expect(select).toHaveValue('40')
  await expect.poll(() => activeId(page)).toBe('alat')
  await expect
    .poll(() => page.locator('#alat').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(2)
  await expect(filter).toHaveValue('')
  await expect(modes.nth(0)).toHaveAttribute('aria-pressed', 'true')
  await expect(modes.nth(1)).toHaveAttribute('aria-pressed', 'false')

  // back to the findings, then a link to story 12 again: 12
  await navLink(page, 'Temuan').click()
  await expect.poll(() => activeId(page)).toBe('temuan')
  await expect(select).toHaveValue('40')
  await page.evaluate(() => {
    location.hash = '#/demo#story=12'
  })
  await expect(select).toHaveValue('12')
})

test('tautan cerita di luar daftar (#/demo#story=999) menampilkan cerita 68 dan mengumumkan pesannya', async ({ page }) => {
  await page.goto('#/demo#story=999')
  await expect(page.locator('.picker-row select')).toHaveValue('68')
  await expect(page.getByRole('status').filter({ hasText: 'tidak ditemukan' })).toHaveText('Cerita #999 tidak ditemukan, menampilkan #68.')
})

test('tautan cerita yang ada (#/demo#story=7) tidak memunculkan pesan', async ({ page }) => {
  await page.goto('#/demo#story=7')
  await expect(page.locator('.picker-row select')).toHaveValue('7')
  // the region itself is always in the DOM; only its text stays empty
  await expect(page.locator('.story-notice')).toBeEmpty()
  await expect(page.getByRole('status').filter({ hasText: 'tidak ditemukan' })).toHaveCount(0)
})

test('navigasi ke Detail eksperimen memfokus h1 halaman hasil', async ({ page }) => {
  await page.goto('#/')
  await navLink(page, 'Detail eksperimen').click()

  await expect(page.locator('h1')).toBeFocused()
  await expect(page.locator('h1')).toHaveText('Detail eksperimen')
  expect(new URL(page.url()).hash).toBe('#/hasil')
})

test.describe('klik pertama tanpa hash', () => {
  for (const [name, selector] of [
    ['brand', 'a.brand'],
    ['Demo', '.nav-link[href="#/"]'],
  ] as const) {
    test(`${name}: halaman menggulir ke atas`, async ({ page }) => {
      await page.goto('./')
      expect(await page.evaluate(() => location.hash)).toBe('')
      await page.evaluate(() => window.scrollTo(0, 400))
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

      // synthetic click: Playwright would otherwise scroll the (not sticky) header back into view first
      await page.locator(selector).dispatchEvent('click')
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    })
  }

  test('Ctrl+klik brand tidak di-preventDefault (tab baru tetap dibuka browser)', async ({ page }) => {
    await page.goto('./')
    const prevented = await page.locator('a.brand').evaluate((el) => {
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, button: 0 })
      el.dispatchEvent(ev)
      return ev.defaultPrevented
    })
    expect(prevented).toBe(false)
  })
})

test('judul tab berganti sesuai halaman', async ({ page }) => {
  await page.goto('#/')
  await expect(page).toHaveTitle('Ringkas Jawa: demo peringkas cerita Jawa')

  await page.goto('#/hasil')
  await expect(page).toHaveTitle('Detail eksperimen · Ringkas Jawa')
})
