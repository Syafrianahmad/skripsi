import type { Lang } from '../data/types.ts'

const LOCALE: Record<Lang, string> = { id: 'id-ID', en: 'en-US' }

/** Integer with the thousands separator of the active language (1.633 in id, 1,633 in en). */
export function formatInt(n: number, lang: Lang): string {
  return n.toLocaleString(LOCALE[lang])
}

/** Percent gain of `value` over `base`, one decimal (e.g. "61.8"). */
export function gainPercent(value: number, base: number): string {
  return ((value / base - 1) * 100).toFixed(1)
}
