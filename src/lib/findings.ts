import { DOCS } from '../data/results.ts'
import type { Doc, ModelId } from '../data/types.ts'
import { outputText } from './compare.ts'

type FilterKind = 'extraId' | 'aku' | 'quote' | 'low'
export type FilterKey = `${FilterKind}:${ModelId}`

/** The same definitions as the Temuan cards and their tests. Each key is one stat on the cards. */
const MATCH: Record<FilterKind, (d: Doc, m: ModelId) => boolean> = {
  extraId: (d, m) => outputText(d.out[m].parts).includes('<extra_id_'),
  // prefix match, not whole word: it also counts "Akuangkala" or "AkuCIL" (12 of the 50 Hybrid stories); the card count depends on it
  aku: (d, m) => /^\s*Aku/i.test(outputText(d.out[m].parts)),
  // checked apart from "aku": a curly-quoted “Aku opens with a quote mark, so it is not an aku
  quote: (d, m) => /^\s*["“]/.test(outputText(d.out[m].parts)),
  low: (d, m) => d.out[m].rl < 0.5,
}

/** Filters offered in the demo's filter select, in display order. */
export const FILTER_KEYS: readonly FilterKey[] = [
  'extraId:murni',
  'extraId:gtrans',
  'aku:hybrid',
  'quote:hybrid',
  'low:murni',
  'low:gtrans',
  'low:hybrid',
]

/** Whether one story's output matches `filter`. */
export function matchesFilter(d: Doc, filter: FilterKey): boolean {
  const [kind, model] = filter.split(':') as [FilterKind, ModelId]
  return MATCH[kind](d, model)
}

/** Ids of the stories whose output for `filter` matches; every story when no filter is set. */
export function storyIds(filter: FilterKey | null): number[] {
  if (!filter) return DOCS.map((d) => d.id)
  return DOCS.filter((d) => matchesFilter(d, filter)).map((d) => d.id)
}
