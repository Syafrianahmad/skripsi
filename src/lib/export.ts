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

export function toJson(rows: readonly ExportRow[]): string {
  return JSON.stringify(rows, null, 2)
}
