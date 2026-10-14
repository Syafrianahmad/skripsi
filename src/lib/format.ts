import type { Lang } from '../data/types.ts'

const LOCALE: Record<Lang, string> = { id: 'id-ID', en: 'en-US' }

// one formatter per (lang, digits): the page formats hundreds of numbers per render
const formatters = new Map<string, Intl.NumberFormat>()

const decimalFormatter = (lang: Lang, digits: number): Intl.NumberFormat => {
  const key = `${lang}:${digits}`
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE[lang], { minimumFractionDigits: digits, maximumFractionDigits: digits })
    formatters.set(key, formatter)
  }
  return formatter
}

/** Fixed decimals in the active language (0,7976 in id, 0.7976 in en). NaN and infinities show "-". */
export function formatDec(n: number, lang: Lang, digits: number): string {
  if (!Number.isFinite(n)) return '-'
  // toFixed does the rounding (Intl alone rounds 1.45 to 1.5); Intl only localises the result.
  const rounded = Number(n.toFixed(digits))
  // -0.00004 rounds to -0: write +0 so no minus sign shows
  return decimalFormatter(lang, digits).format(rounded === 0 ? 0 : rounded)
}

/** Integer with the thousands separator of the active language (1.633 in id, 1,633 in en). */
export function formatInt(n: number, lang: Lang): string {
  return formatDec(n, lang, 0)
}

/** Percent gain of `value` over `base`, one decimal ("61.8" in en, "61,8" in id). */
export function gainPercent(value: number, base: number, lang: Lang): string {
  return formatDec((value / base - 1) * 100, lang, 1)
}
