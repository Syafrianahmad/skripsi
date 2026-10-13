import { DOCS } from '../data/results.ts'
import type { Doc, ModelId } from '../data/types.ts'

export type FilterKind = 'extraId' | 'aku' | 'quote' | 'low'
export type FilterKey = `${FilterKind}:${ModelId}`

const text = (d: Doc, m: ModelId) => d.out[m].parts.map((p) => p.t).join('')

/** The same definitions as the Temuan cards and their tests. Each key is one stat on the cards. */
const MATCH: Record<FilterKind, (d: Doc, m: ModelId) => boolean> = {
  extraId: (d, m) => text(d, m).includes('<extra_id_'),
  aku: (d, m) => /^\s*Aku/i.test(text(d, m)),
  quote: (d, m) => /^\s*["“]/.test(text(d, m)),
  low: (d, m) => d.out[m].rl < 0.5,
}

/** Ids of the stories whose output for `filter` matches; every story when no filter is set. */
export function storyIds(filter: FilterKey | null): number[] {
  if (!filter) return DOCS.map((d) => d.id)
  const [kind, model] = filter.split(':') as [FilterKind, ModelId]
  return DOCS.filter((d) => MATCH[kind](d, model)).map((d) => d.id)
}
