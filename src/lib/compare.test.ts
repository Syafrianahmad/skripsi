import { describe, expect, it } from 'vitest'
import { markAgainst, outputText } from './compare.ts'

describe('outputText', () => {
  it('joins the parts back into the model output', () => {
    expect(outputText([{ t: 'Aku ', d: 1 }, { t: 'mlaku', d: 0 }])).toBe('Aku mlaku')
  })
})

describe('markAgainst', () => {
  it('marks words that no other output contains and keeps the spacing', () => {
    const parts = markAgainst('Ibu masak sayur', [new Set(['ibu', 'masak'])])
    expect(parts).toEqual([
      { t: 'Ibu', d: 0 },
      { t: ' ', d: 0 },
      { t: 'masak', d: 0 },
      { t: ' ', d: 0 },
      { t: 'sayur', d: 1 },
    ])
  })

  it('ignores case and surrounding punctuation when comparing', () => {
    const parts = markAgainst('Ibu, masak.', [new Set(['ibu', 'masak'])])
    expect(parts.every((p) => p.d === 0)).toBe(true)
  })

  it('a word counts as shared if any other output has it', () => {
    const parts = markAgainst('a b', [new Set(['a']), new Set(['b'])])
    expect(parts.filter((p) => p.d === 1)).toEqual([])
  })

  it('joins neighbouring differing words, gap included, into one mark', () => {
    const parts = markAgainst('Ibu sayur kacang masak', [new Set(['ibu', 'masak'])])
    expect(parts).toEqual([
      { t: 'Ibu', d: 0 },
      { t: ' ', d: 0 },
      { t: 'sayur kacang', d: 1 },
      { t: ' ', d: 0 },
      { t: 'masak', d: 0 },
    ])
  })

  it('keeps marks apart when a shared word sits between them', () => {
    const parts = markAgainst('sayur ibu kacang', [new Set(['ibu'])])
    expect(parts).toEqual([
      { t: 'sayur', d: 1 },
      { t: ' ', d: 0 },
      { t: 'ibu', d: 0 },
      { t: ' ', d: 0 },
      { t: 'kacang', d: 1 },
    ])
  })
})
