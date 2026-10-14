import { describe, expect, it } from 'vitest'
import { FINDINGS } from '../data/results.ts'
import type { Doc } from '../data/types.ts'
import { matchesFilter, storyIds } from './findings.ts'

/** A synthetic story whose Hybrid output is `hybridText`; the other models are irrelevant here. */
const story = (hybridText: string): Doc => {
  const filler = { t: 'x', d: 0 as const }
  return {
    id: 1,
    title: 'uji',
    tag: 'rand',
    words: 10,
    sentences: 1,
    excerpt: 'uji',
    ref: 'uji',
    out: {
      murni: { rl: 0.9, parts: [filler] },
      gtrans: { rl: 0.9, parts: [filler] },
      hybrid: { rl: 0.9, parts: [{ t: hybridText, d: 0 }] },
    },
  }
}

describe('storyIds', () => {
  it('returns every story when no filter is set', () => {
    expect(storyIds(null)).toHaveLength(70)
  })

  it('matches the counts quoted on the Temuan cards', () => {
    expect(storyIds('extraId:murni')).toHaveLength(FINDINGS.extraIdToken.murni)
    expect(storyIds('extraId:gtrans')).toHaveLength(FINDINGS.extraIdToken.gtrans)
    expect(storyIds('aku:hybrid')).toHaveLength(FINDINGS.akuOpening.hybrid)
    expect(storyIds('quote:hybrid')).toHaveLength(FINDINGS.akuOpening.quoted)
    for (const m of ['murni', 'gtrans', 'hybrid'] as const) {
      expect(storyIds(`low:${m}`)).toHaveLength(FINDINGS.shortLead2[m])
    }
  })

  it('keeps the real-data counts: 50 Aku openings and 17 quoted openings', () => {
    expect(storyIds('aku:hybrid')).toHaveLength(50)
    expect(storyIds('quote:hybrid')).toHaveLength(17)
  })
})

describe('aku and quote predicates on synthetic stories', () => {
  it('counts a leading "aku" in any letter case, after spaces', () => {
    expect(matchesFilter(story(' aku sendiri'), 'aku:hybrid')).toBe(true)
    expect(matchesFilter(story('Aku sendiri'), 'aku:hybrid')).toBe(true)
  })

  it('counts a curly-quoted “Aku as a quote and not as an aku', () => {
    const doc = story('“Aku sendiri')
    expect(matchesFilter(doc, 'quote:hybrid')).toBe(true)
    expect(matchesFilter(doc, 'aku:hybrid')).toBe(false)
  })

  it('counts a straight-quoted "Aku as a quote and not as an aku', () => {
    const doc = story('"Aku sendiri')
    expect(matchesFilter(doc, 'quote:hybrid')).toBe(true)
    expect(matchesFilter(doc, 'aku:hybrid')).toBe(false)
  })
})
