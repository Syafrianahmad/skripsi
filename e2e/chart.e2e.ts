import { expect, test } from '@playwright/test'

test.describe('grafik Loss', () => {
  test('label catatan klip tidak tumpang tindih (kotak <text> tidak beririsan)', async ({ page }) => {
    await page.goto('#/hasil')
    await expect(page.locator('h1')).toBeVisible()
    await page.locator('#curve-tab-loss').click()
    await expect(page.locator('#curve-tab-loss')).toHaveAttribute('aria-selected', 'true')

    // loss above the 1.0 ceiling: Murni epoch 1 and 2, GTrans epoch 1 (see CLIP_NOTES in CurveChart.tsx)
    const notes = await page.locator('#curve-panel svg text.chart-muted').evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect()
        return { text: el.textContent ?? '', left: r.left, right: r.right, top: r.top, bottom: r.bottom }
      }),
    )
    expect(notes.map((n) => n.text)).toHaveLength(3)

    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const a = notes[i]
        const b = notes[j]
        const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
        expect(overlap, `"${a.text}" menimpa "${b.text}"`).toBe(false)
      }
    }
  })
})
