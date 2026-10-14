import { describe, expect, it } from 'vitest'
import { csvDownload, toCsv, type ExportRow } from './export.ts'

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

describe('csvDownload', () => {
  it('starts the file with the UTF-8 BOM bytes so Excel reads curly quotes and Javanese text as UTF-8', () => {
    const bytes = [...new TextEncoder().encode(csvDownload(rows))]
    expect(bytes.slice(0, 3)).toEqual([0xef, 0xbb, 0xbf])
  })

  it('is the same body as toCsv after the BOM', () => {
    expect(csvDownload(rows)).toBe('﻿' + toCsv(rows))
  })
})
