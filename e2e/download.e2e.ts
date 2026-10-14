import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

// The downloaded files themselves: CSV carries a UTF-8 BOM for Excel, JSON carries none and must parse.
test.use({ locale: 'id-ID' })

test('unduhan CSV berawalan BOM UTF-8 dan memuat header kolom; JSON tanpa BOM dan valid', async ({ page }) => {
  await page.goto('#/')

  const [csv] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Unduh CSV' }).click(),
  ])
  expect(csv.suggestedFilename()).toMatch(/^ringkas-jawa-\d+\.csv$/)
  const csvBytes = await readFile((await csv.path())!)
  expect([...csvBytes.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
  const csvText = csvBytes.subarray(3).toString('utf8')
  expect(csvText.split(/\r?\n/)[0]).toBe('doc,model,rouge_l,output')
  expect(csvText.split(/\r?\n/).length).toBeGreaterThan(1)

  const [json] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Unduh JSON' }).click(),
  ])
  expect(json.suggestedFilename()).toMatch(/^ringkas-jawa-\d+\.json$/)
  const jsonBytes = await readFile((await json.path())!)
  expect(jsonBytes[0] === 0xef && jsonBytes[1] === 0xbb && jsonBytes[2] === 0xbf, 'JSON berawalan BOM').toBe(false)
  const rows = JSON.parse(jsonBytes.toString('utf8')) as { doc: number; model: string; rougeL: number; output: string }[]
  expect(rows).toHaveLength(3)
  expect(rows.map((r) => r.model).sort()).toEqual(['gtrans', 'hybrid', 'murni'])
})
