import { describe, expect, it } from 'vitest'
import { toCsv, toJson, type ExportRow } from './export.ts'

const rows: ExportRow[] = [
  { doc: 68, model: 'hybrid', rougeL: 0.8123, output: 'Ibu masak, "sayur"\nbaru' },
]

describe('toCsv', () => {
  it('writes a header and quotes fields that contain separators, quotes or newlines', () => {
    expect(toCsv(rows)).toBe(
      'doc,model,rouge_l,output\r\n68,hybrid,0.8123,"Ibu masak, ""sayur""\nbaru"',
    )
  })
})

describe('toJson', () => {
  it('serialises the same rows as an array', () => {
    expect(JSON.parse(toJson(rows))).toEqual(rows)
  })
})
