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
  const tokens = text.split(/(\s+)/).filter(Boolean)
  // null marks a gap (whitespace); it is resolved from its neighbours below
  const marks = tokens.map((t): 0 | 1 | null => {
    if (/^\s+$/.test(t)) return null
    const word = normalize(t)
    const shared = word === '' || others.some((set) => set.has(word))
    return shared ? 0 : 1
  })
  const parts: Part[] = []
  tokens.forEach((t, i) => {
    // a gap between two differing words joins their run, so a run of differing words is one mark
    const d = marks[i] ?? (marks[i - 1] === 1 && marks[i + 1] === 1 ? 1 : 0)
    const last = parts[parts.length - 1]
    if (d === 1 && last?.d === 1) last.t += t
    else parts.push({ t, d })
  })
  return parts
}

export function wordSet(text: string): Set<string> {
  return new Set(text.split(/\s+/).map(normalize).filter(Boolean))
}
