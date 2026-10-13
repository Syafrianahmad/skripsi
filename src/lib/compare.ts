import type { Part } from '../data/types.ts'

export function outputText(parts: readonly Part[]): string {
  return parts.map((p) => p.t).join('')
}

const normalize = (word: string) => word.toLowerCase().replace(/^[^\p{L}\p{N}<]+|[^\p{L}\p{N}>]+$/gu, '')

/**
 * Splits `text` into parts and marks each word as differing (d = 1) when none of the
 * `others` word sets contains it. Whitespace is kept so the text reads the same.
 */
export function markAgainst(text: string, others: readonly Set<string>[]): Part[] {
  return text.split(/(\s+)/).filter(Boolean).map((t) => {
    if (/^\s+$/.test(t)) return { t, d: 0 }
    const word = normalize(t)
    const shared = word === '' || others.some((set) => set.has(word))
    return { t, d: shared ? 0 : 1 }
  })
}

export function wordSet(text: string): Set<string> {
  return new Set(text.split(/\s+/).map(normalize).filter(Boolean))
}
