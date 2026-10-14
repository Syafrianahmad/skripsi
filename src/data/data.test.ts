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
const text = (d: (typeof DOCS)[number], m: (typeof MODELS)[number]) => d.out[m].parts.map((p) => p.t).join('')

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

  it('has exactly three model outputs per document, with scores in [0, 1]', () => {
    for (const d of DOCS) {
      expect(Object.keys(d.out).sort()).toEqual([...MODELS].sort())
      for (const m of MODELS) {
        expect(d.out[m].rl).toBeGreaterThanOrEqual(0)
        expect(d.out[m].rl).toBeLessThanOrEqual(1)
        expect(d.out[m].parts.length).toBeGreaterThan(0)
      }
    }
  })

  it('has a story length at least the excerpt length for every document', () => {
    expect(DOCS.filter((d) => d.words >= d.excerpt.trim().split(/\s+/).length)).toHaveLength(70)
  })
})

// Literal values below were computed outside this code (plain node script over docs.json, 2026-10-14).
// They pin the data; they do not prove the data matches the notebook.
describe('data contract', () => {
  const mean = (m: (typeof MODELS)[number]) => DOCS.reduce((sum, d) => sum + d.out[m].rl, 0) / DOCS.length

  it('averages per-document ROUGE-L near the literal values (tolerance 0.0005)', () => {
    expect(Math.abs(mean('murni') - 0.4184)).toBeLessThanOrEqual(0.0005)
    expect(Math.abs(mean('gtrans') - 0.6691)).toBeLessThanOrEqual(0.0005)
    expect(Math.abs(mean('hybrid') - 0.7967)).toBeLessThanOrEqual(0.0005)
  })

  it('lists the Hybrid stories scoring below 0.5', () => {
    const ids = DOCS.filter((d) => d.out.hybrid.rl < 0.5).map((d) => d.id)
    expect(ids).toEqual([29, 31, 41, 45, 50, 52, 54, 63, 65])
  })

  it('counts Hybrid outputs that open with a quote mark', () => {
    expect(DOCS.filter((d) => /^\s*["“]/.test(text(d, 'hybrid')))).toHaveLength(17)
  })

  it('opens the Hybrid output of story 69 with "AkuCIL LAN MERAK"', () => {
    expect(text(DOCS.find((d) => d.id === 69)!, 'hybrid')).toMatch(/^AkuCIL LAN MERAK/)
  })
})

// The "Temuan" cards quote these counts; they must match what is actually in the outputs.
describe('findings match the stored outputs', () => {
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

// Snapshot locks: these literals were copied from the thesis notebook. They catch accidental edits
// to results.ts, not a wrong copy from the notebook (that needs a manual check against the notebook).
describe('results (snapshot of the notebook numbers)', () => {
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

  it('has 8 epochs per series; the last epoch of each scenario has the literal ROUGE-L', () => {
    // array index 0 to 7 is epoch 1 to 8
    for (const m of MODELS) {
      expect(EPOCH_ROUGE[m]).toHaveLength(8)
      expect(EPOCH_LOSS[m]).toHaveLength(8)
      for (const v of EPOCH_ROUGE[m]) expect(v).toBeGreaterThanOrEqual(0)
    }
    expect(EPOCH_ROUGE.murni[7]).toBe(0.428)
    expect(EPOCH_ROUGE.gtrans[7]).toBe(0.6744)
    expect(EPOCH_ROUGE.hybrid[7]).toBe(0.8521)
    expect(EPOCH_LOSS.murni[0]).toBe(6.881)
  })

  it('reports Hybrid as the most abstractive scenario', () => {
    expect(NGRAM_NEW.hybrid.oneGram).toBe(3.0)
    expect(NGRAM_NEW.murni.oneGram).toBeLessThan(NGRAM_NEW.gtrans.oneGram)
    expect(NGRAM_NEW.gtrans.oneGram).toBeLessThan(NGRAM_NEW.hybrid.oneGram)
  })
})
