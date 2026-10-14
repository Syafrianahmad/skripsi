import { expect, test } from '@playwright/test'

// "Model lain" marks the words that the other two models do not produce. A run of differing words is one
// mark, not one mark per word. Story 2 (Hybrid) has the run "Ana 2 wit ringin", checked against the data
// with the same markAgainst logic; this spec checks what the page renders for it.
test.use({ locale: 'id-ID' })

test.describe('mode "Model lain"', () => {
  test('rangkaian kata beda yang berurutan digabung dalam satu mark', async ({ page }) => {
    await page.goto('#/demo#story=2')
    await expect(page.locator('h1')).toBeVisible()
    await page.getByRole('button', { name: 'Model lain' }).click()
    await expect(page.getByRole('button', { name: 'Model lain' })).toHaveAttribute('aria-pressed', 'true')

    // the run is one mark whose visible text (without the sr-only "(beda)" prefix) is the whole phrase
    const run = page.locator('article.model-card mark.diff', { hasText: 'Ana 2 wit ringin' })
    await expect(run).toHaveCount(1)
    const visible = await run.evaluate((el) =>
      [...el.childNodes].filter((n) => !(n instanceof Element && n.classList.contains('sr-only'))).map((n) => n.textContent).join(''),
    )
    expect(visible).toBe('Ana 2 wit ringin')

    // two differing words in a row are never two marks: no mark directly follows another mark
    await expect(page.locator('article.model-card p > mark.diff + mark.diff')).toHaveCount(0)
  })
})
