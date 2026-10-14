import type { ModelId } from '../data/types.ts'

export type ExportRow = { doc: number; model: ModelId; rougeL: number; output: string }

const csvField = (value: string | number) => {
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(rows: readonly ExportRow[]): string {
  const lines = rows.map((r) => [r.doc, r.model, r.rougeL, r.output].map(csvField).join(','))
  return ['doc,model,rouge_l,output', ...lines].join('\r\n')
}

/** Body of the downloaded CSV file. The BOM (U+FEFF, written as an escape so it stays visible in source) makes Excel read it as UTF-8. */
export function csvDownload(rows: readonly ExportRow[]): string {
  return '﻿' + toCsv(rows)
}

/** Saves `body` as a file named `name` through a temporary object URL. */
export function download(name: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
