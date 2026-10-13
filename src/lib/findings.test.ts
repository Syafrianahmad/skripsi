import { describe, expect, it } from 'vitest'
import { FINDINGS } from '../data/results.ts'
import { storyIds } from './findings.ts'

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
})
