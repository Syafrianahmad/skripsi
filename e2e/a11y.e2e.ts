import { AxeBuilder } from '@axe-core/playwright'
import { expect, test, type Locator } from '@playwright/test'
import { PAGES } from './support.ts'

// WCAG 2.0/2.1/2.2 A and AA rules. Best-practice rules (such as "region") are outside these tags and are not run here.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

test.describe('axe: 0 pelanggaran WCAG A/AA', () => {
  for (const { name, hash } of PAGES) {
    for (const scheme of ['light', 'dark'] as const) {
      for (const width of [1280, 390]) {
        test(`${name} ${scheme} ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 })
          await page.emulateMedia({ colorScheme: scheme })
          await page.goto(hash)
          await expect(page.locator('h1')).toBeVisible()

          const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
          // incomplete = axe could not decide (mostly contrast over images or gradients); reported, not a failure
          test.info().annotations.push({
            type: 'axe-incomplete',
            description: `${results.incomplete.length} aturan: ${results.incomplete.map((i) => `${i.id}(${i.nodes.length})`).join(', ') || '-'}`,
          })
          expect(
            results.violations.map((v) => ({ id: v.id, impact: v.impact, targets: v.nodes.map((n) => n.target.join(' ')) })),
          ).toEqual([])
        })
      }
    }
  }
})

test.describe('skip link', () => {
  test.use({ locale: 'id-ID' })

  test('Tab pertama memfokus tautan lewati, Enter memfokus #main tanpa mengubah hash', async ({ page }) => {
    await page.goto('#/hasil')
    await expect(page.locator('h1')).toBeVisible()
    const hashBefore = await page.evaluate(() => location.hash)

    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()

    await page.keyboard.press('Enter')
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main')
    expect(await page.evaluate(() => location.hash)).toBe(hashBefore)
    expect(hashBefore).toBe('#/hasil')
  })
})

test.describe('landmark bernama unik', () => {
  for (const { name, hash } of PAGES) {
    test(`${name}: axe landmark-unique 0 pelanggaran`, async ({ page }) => {
      await page.goto(hash)
      await expect(page.locator('h1')).toBeVisible()
      const results = await new AxeBuilder({ page }).withRules(['landmark-unique']).analyze()
      expect(results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target.join(' ')) }))).toEqual([])
    })
  }

  test('wilayah gulir tabel: nama tidak sama dengan caption, dan nama wilayah di halaman Hasil unik', async ({ page }) => {
    await page.goto('#/hasil')
    await expect(page.locator('h1')).toBeVisible()
    const regions = await page.locator('[role="region"][aria-label]').evaluateAll((els) =>
      els.map((el) => ({ name: el.getAttribute('aria-label') ?? '', caption: el.querySelector('caption')?.textContent?.trim() ?? null })),
    )
    const names = regions.map((r) => r.name)
    // the scrollable tables and charts all live on the results page
    expect(regions.filter((r) => r.caption !== null), 'wilayah gulir dengan tabel').toHaveLength(2)
    for (const r of regions) {
      if (r.caption !== null) expect(r.name, 'nama wilayah = caption').not.toBe(r.caption)
    }
    expect(new Set(names).size, `nama wilayah ganda: ${names.join(' | ')}`).toBe(names.length)
  })
})

test.describe('forced colors', () => {
  // the pick is a bar drawn with ::after (content '""'); outline is reserved for focus
  const state = (locator: Locator) =>
    locator.evaluate((el) => ({
      outline: getComputedStyle(el).outlineStyle,
      bar: getComputedStyle(el, '::after').content !== 'none',
    }))

  test('pilihan punya penanda, yang tak terpilih tidak; fokus memberi outline', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' })
    await page.goto('#/')

    const cases = [
      { name: 'chip', picked: 'label.chip:has(input:checked)', other: 'label.chip:has(input:not(:checked))', focus: 'label.chip:has(input:checked) input' },
      { name: 'segmented', picked: '.segmented button[aria-pressed="true"]', other: '.segmented button[aria-pressed="false"]', focus: '.segmented button[aria-pressed="true"]' },
      { name: 'tombol bahasa', picked: '.lang-btn[aria-pressed="true"]', other: '.lang-btn[aria-pressed="false"]', focus: '.lang-btn[aria-pressed="true"]' },
    ]
    for (const c of cases) {
      const picked = await state(page.locator(c.picked).first())
      expect(picked.bar, `${c.name} terpilih punya penanda`).toBe(true)
      expect(picked.outline, `${c.name} terpilih tanpa fokus tidak punya outline`).toBe('none')

      const other = await state(page.locator(c.other).first())
      expect(other, `${c.name} tak terpilih: tanpa penanda dan tanpa outline`).toEqual({ outline: 'none', bar: false })

      const target = page.locator(c.focus).first()
      await target.focus()
      await expect.poll(() => target.evaluate((el) => el.matches(':focus-visible'))).toBe(true)
      const focused = await state(page.locator(c.picked).first())
      expect(focused.outline, `${c.name} terpilih yang fokus punya outline`).not.toBe('none')
      expect(focused.bar, `${c.name} terpilih yang fokus tetap punya penanda`).toBe(true)
    }
  })
})

test.describe('pengumuman lewat wilayah status', () => {
  test.use({ locale: 'id-ID', permissions: ['clipboard-read', 'clipboard-write'] })

  test('label tombol salin kembali ke label awal setelah 6 detik', async ({ page }) => {
    await page.clock.install()
    await page.goto('#/')
    await page.getByRole('button', { name: 'Salin tautan cerita' }).click()
    await expect(page.getByRole('button', { name: 'Tautan disalin' })).toBeVisible()

    await page.clock.runFor(5000)
    await expect(page.getByRole('button', { name: 'Tautan disalin' })).toBeVisible()

    await page.clock.runFor(1500)
    await expect(page.getByRole('button', { name: 'Salin tautan cerita' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tautan disalin' })).toHaveCount(0)
  })

  test('salin tautan mengumumkan "Tautan disalin", ganti bahasa tidak membunyikan pesan baru', async ({ page }) => {
    await page.goto('#/')
    const status = page.getByRole('status')
    await expect(status).toHaveText('')

    await page.getByRole('button', { name: 'Salin tautan cerita' }).click()
    await expect(status).toContainText('disalin')
    const announced = await status.textContent()

    await page.getByRole('button', { name: 'EN, English' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    // the message is cleared on a language switch, or left as it was; it must never be re-announced in English
    const after = await status.textContent()
    expect(['', announced]).toContain(after)
    expect(after).not.toContain('copied')
  })

  test('salin dua kali dalam 6 detik: wilayah status menerima "Tautan disalin" lagi', async ({ page }) => {
    // a stub, so the result does not depend on clipboard permissions
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } })
    })
    await page.clock.install()
    await page.goto('#/')
    await expect(page.locator('h1')).toBeVisible()
    // every text node the live region receives, recorded by a MutationObserver (a blank removes the node, a new text adds one)
    await page.evaluate(() => {
      const w = window as unknown as { __status: string[] }
      const el = document.querySelector('[role="status"]')!
      w.__status = []
      new MutationObserver((records) => {
        for (const r of records) for (const n of r.addedNodes) w.__status.push(n.textContent ?? '')
      }).observe(el, { childList: true, subtree: true })
    })

    await page.getByRole('button', { name: 'Salin tautan cerita' }).click()
    await expect(page.getByRole('status')).toHaveText('Tautan disalin')
    await page.clock.runFor(2000)
    await page.getByRole('button', { name: 'Tautan disalin' }).click()
    // 7 s after the first copy, 5 s after the second: the timer restarted, so the text is still up
    await page.clock.runFor(5000)
    await expect(page.getByRole('status')).toHaveText('Tautan disalin')

    // the region is blanked and set again on the second copy: two "Tautan disalin" text nodes, not one
    const said = await page.evaluate(() => (window as unknown as { __status: string[] }).__status)
    expect(said.filter((s) => s === 'Tautan disalin')).toHaveLength(2)
  })

  test.describe('bahasa Inggris', () => {
    test.use({ locale: 'en-US', permissions: ['clipboard-read', 'clipboard-write'] })

    test('salin tautan mengumumkan "copied" dalam bahasa Inggris', async ({ page }) => {
      await page.goto('#/')
      await page.getByRole('button', { name: 'Copy story link' }).click()
      await expect(page.getByRole('status')).toContainText('copied')
    })

    test('salin yang ditolak browser mengumumkan "Could not copy the link."', async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } })
      })
      await page.goto('#/')
      await page.getByRole('button', { name: 'Copy story link' }).click()
      await expect(page.getByRole('status')).toHaveText('Could not copy the link.')
      // the button keeps its own label: nothing says "copied"
      await expect(page.getByRole('button', { name: 'Copy story link' })).toBeVisible()
    })
  })
})
