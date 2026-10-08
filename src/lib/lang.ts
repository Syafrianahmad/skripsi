import type { Lang } from '../data/types.ts'

const SUPPORTED: readonly Lang[] = ['id', 'en']

const asLang = (value: string | null | undefined): Lang | undefined =>
  SUPPORTED.find((l) => l === value)

/** First supported language in the browser's preference order; English otherwise. */
export function detectLang(langs: readonly string[] | undefined): Lang {
  for (const tag of langs ?? []) {
    const found = asLang(tag.toLowerCase().split('-')[0])
    if (found) return found
  }
  return 'en'
}

/** A valid stored choice wins over the browser language. */
export function resolveLang(stored: string | null, langs: readonly string[] | undefined): Lang {
  return asLang(stored) ?? detectLang(langs)
}
