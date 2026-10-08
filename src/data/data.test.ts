import { describe, expect, it } from 'vitest'
import {
  BASELINE,
  DOCS,
  EPOCH_LOSS,
  EPOCH_ROUGE,
  FEATURED_IDS,
  FINDINGS,
  NGRAM_NEW,
  SCENARIOS,
} from './results.ts'

const MODELS = ['murni', 'gtrans', 'hybrid'] as const
const scenario = (id: (typeof MODELS)[number]) => SCENARIOS.find((s) => s.id === id)!

describe('docs', () => {
  it('has 70 test documents with unique ids', () => {
    expect(DOCS).toHaveLength(70)
    expect(new Set(DOCS.map((d) => d.id)).size).toBe(70)
  })

  it('tags the featured stories best, best, mid, mid, worst', () => {
    const tags = FEATURED_IDS.map((id) => DOCS.find((d) => d.id === id)?.tag)
    expect(tags).toEqual(['best', 'best', 'mid', 'mid', 'worst'])
  })

  it('translates only the featured stories', () => {
    for (const d of DOCS) {
      const featured = (FEATURED_IDS as readonly number[]).includes(d.id)
      expect(Boolean(d.tr?.id && d.tr.en)).toBe(featured)
    }
  })

  it('has three model outputs per document with scores in [0, 1]', () => {
    for (const d of DOCS) {
      for (const m of MODELS) {
        expect(d.out[m].rl).toBeGreaterThanOrEqual(0)
        expect(d.out[m].rl).toBeLessThanOrEqual(1)
        expect(d.out[m].parts.length).toBeGreaterThan(0)
      }
    }
  })
})

// The "Temuan" cards quote these counts; they must match what is actually in the outputs.
describe('findings match the stored outputs', () => {
  const text = (d: (typeof DOCS)[number], m: (typeof MODELS)[number]) => d.out[m].parts.map((p) => p.t).join('')
  const count = (pred: (d: (typeof DOCS)[number]) => boolean) => DOCS.filter(pred).length

  it('counts sentinel tokens, "Aku" openings, and quoted openings', () => {
    expect(count((d) => text(d, 'murni').includes('<extra_id_'))).toBe(FINDINGS.extraIdToken.murni)
    expect(count((d) => text(d, 'gtrans').includes('<extra_id_'))).toBe(FINDINGS.extraIdToken.gtrans)
    expect(count((d) => /^\s*Aku/i.test(text(d, 'hybrid')))).toBe(FINDINGS.akuOpening.hybrid)
    expect(count((d) => /^\s*["“]/.test(text(d, 'hybrid')))).toBe(FINDINGS.akuOpening.quoted)
  })

  it('counts documents scoring below 0.5 per scenario', () => {
    for (const m of MODELS) expect(count((d) => d.out[m].rl < 0.5)).toBe(FINDINGS.shortLead2[m])
  })
})

describe('results', () => {
  it('matches the thesis scores', () => {
    expect(scenario('murni').rougeL).toBe(0.3978)
    expect(scenario('gtrans').rougeL).toBe(0.6437)
    expect(scenario('hybrid').rougeL).toBe(0.7976)
    expect(scenario('hybrid').pairs).toBe(1633)
  })

  it('keeps the honest finding: lead-2 baseline beats every model', () => {
    for (const m of MODELS) expect(BASELINE.rougeL).toBeGreaterThan(scenario(m).rougeL)
  })

  it('keeps stored deltas consistent with the scores', () => {
    for (const m of MODELS) {
      const delta = scenario(m).rougeL - scenario('murni').rougeL
      expect(scenario(m).deltaFromMurni).toBeCloseTo(delta, 4)
    }
    expect(BASELINE.deltaFromMurni).toBeCloseTo(BASELINE.rougeL - scenario('murni').rougeL, 4)
  })

  it('has 8 epochs per series with the known endpoints', () => {
    for (const m of MODELS) {
      expect(EPOCH_ROUGE[m]).toHaveLength(8)
      expect(EPOCH_LOSS[m]).toHaveLength(8)
    }
    expect(EPOCH_ROUGE.hybrid[7]).toBe(0.8521)
    expect(EPOCH_LOSS.murni[0]).toBe(6.881)
  })

  it('reports Hybrid as the most abstractive scenario', () => {
    expect(NGRAM_NEW.hybrid.oneGram).toBe(3.0)
    expect(NGRAM_NEW.murni.oneGram).toBeLessThan(NGRAM_NEW.gtrans.oneGram)
    expect(NGRAM_NEW.gtrans.oneGram).toBeLessThan(NGRAM_NEW.hybrid.oneGram)
  })
})
