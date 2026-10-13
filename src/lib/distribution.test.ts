import { describe, expect, it } from 'vitest'
import { DOCS, FINDINGS } from '../data/results.ts'
import { binScores } from './distribution.ts'

describe('binScores', () => {
  it('puts each score in its 0.1-wide bin and 1.0 in the last one', () => {
    const bins = binScores([0, 0.05, 0.1, 0.49, 0.5, 1])
    expect(bins).toEqual([2, 1, 0, 0, 1, 1, 0, 0, 0, 1])
  })

  it('has ten bins and keeps every document', () => {
    const bins = binScores(DOCS.map((d) => d.out.hybrid.rl))
    expect(bins).toHaveLength(10)
    expect(bins.reduce((a, b) => a + b, 0)).toBe(70)
  })

  it('bins below 0.5 match the Temuan counts', () => {
    for (const m of ['murni', 'gtrans', 'hybrid'] as const) {
      const bins = binScores(DOCS.map((d) => d.out[m].rl))
      expect(bins.slice(0, 5).reduce((a, b) => a + b, 0)).toBe(FINDINGS.shortLead2[m])
    }
  })
})
