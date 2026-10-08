import { describe, expect, it } from 'vitest'
import { DOCS } from '../data/results.ts'
import { countWords, splitSentences } from './words.ts'

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('  a  b ')).toBe(2)
    expect(countWords('')).toBe(0)
    expect(countWords('satu\ndua\ttiga')).toBe(3)
  })
})

describe('splitSentences', () => {
  it('splits after sentence-ending punctuation', () => {
    expect(splitSentences('Satu. Dua? Tiga!')).toEqual(['Satu.', 'Dua?', 'Tiga!'])
  })

  it('keeps text without punctuation as one sentence and drops empty input', () => {
    expect(splitSentences('tanpa titik')).toEqual(['tanpa titik'])
    expect(splitSentences('  ')).toEqual([])
  })
})

// The hero card shrinks story #68 from its 4 sentences to the 2-sentence lead-2 reference.
describe('hero story #68', () => {
  const doc = DOCS.find((d) => d.id === 68)!

  it('has 4 sentences, the first 2 being the reference', () => {
    expect(splitSentences(doc.excerpt)).toHaveLength(4)
    expect(splitSentences(doc.ref)).toHaveLength(2)
    expect(doc.excerpt.startsWith(doc.ref)).toBe(true)
  })

  it('shrinks from 46 to 29 words (the design said 30, which was a miscount)', () => {
    expect(countWords(doc.excerpt)).toBe(46)
    expect(countWords(doc.ref)).toBe(29)
  })
})
