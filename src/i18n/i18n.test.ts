import { describe, expect, it } from 'vitest'
import { en } from './en.ts'
import { id } from './id.ts'

// Path, kind, and arity/length for every node, so id and en can be compared without listing keys by hand.
function shape(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'function') return [[path, `fn/${value.length}`]]
  if (Array.isArray(value)) {
    return [[path, `array/${value.length}`], ...value.flatMap((item, i) => shape(item, `${path}[${i}]`))]
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => shape(item, path ? `${path}.${key}` : key))
  }
  return [[path, typeof value]]
}

// Every string a dictionary can show. Functions are called with each sample for every argument:
// 1 (plain) and 1633 (large integer). No fraction sample: integer fields (docId, counts) are typed
// number and printed raw, so 0.5 there is out of contract and fails for the wrong reason. Decimals
// reach the UI as strings already formatted by formatDec.
const SAMPLE_ARGS = [1, 1633]

function texts(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (typeof value === 'function') {
    return SAMPLE_ARGS.flatMap((arg) =>
      texts((value as (...args: number[]) => unknown)(...Array<number>(value.length).fill(arg))),
    )
  }
  if (Array.isArray(value)) return value.flatMap(texts)
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(texts)
  return []
}

// Indonesian prose writes decimals with a comma and thousands with a dot, so no dot between digits
// is allowed at all. No exemptions: "1.234" is a three-digit decimal here, not a thousands group.
const DECIMAL_DOT = /\d\.\d/

// English prose writes decimals with a dot, so a comma between digits is only allowed as a thousands
// separator: a comma followed by exactly three digits that end there. "1,633" passes, "1,6" and "0,7976"
// fail. The lookahead inside is what keeps "1,633" from matching as a decimal.
const DECIMAL_COMMA = /\d,(?!\d{3}(?!\d))\d/

// Prose must have a space after every comma. "uji,ukur" is the typo this guards against.
const MISSING_SPACE_AFTER_COMMA = /[A-Za-z],[A-Za-z]/

describe('i18n dictionaries', () => {
  it('id and en have the same keys, function arity, array lengths, and leaf types', () => {
    expect(shape(en).sort()).toEqual(shape(id).sort())
  })

  it('id prose writes decimals with a comma', () => {
    for (const line of texts(id)) {
      expect(line).not.toMatch(DECIMAL_DOT)
    }
  })

  it('en prose writes decimals with a dot, so a comma between digits must be a thousands separator', () => {
    for (const line of texts(en)) {
      expect(line).not.toMatch(DECIMAL_COMMA)
    }
  })

  it('every comma in id and en prose is followed by a space, not a letter', () => {
    for (const line of [...texts(id), ...texts(en)]) {
      expect(line).not.toMatch(MISSING_SPACE_AFTER_COMMA)
    }
  })

  it('has no em dash in either dictionary', () => {
    for (const line of [...texts(id), ...texts(en)]) {
      expect(line).not.toContain('—')
    }
  })

  it('en pluralizes story counts: 1 story, n stories', () => {
    expect(en.results.chartData.stories(1)).toBe('1 story')
    expect(en.results.chartData.stories(2)).toBe('2 stories')
    expect(en.results.distribution.barTitle('Murni', '0.1', '0.2', 1)).toBe('Murni, 0.1–0.2: 1 story')
    expect(en.results.distribution.barTitle('Murni', '0.1', '0.2', 2)).toBe('Murni, 0.1–0.2: 2 stories')
  })

  it('scrollable chart areas get a label that differs from the section title', () => {
    for (const [dict, title] of [[id, 'Kurva pelatihan per epoch'], [en, 'Training curve per epoch']] as const) {
      const label = dict.results.scrollRegion(title)
      expect(label).toContain(title)
      expect(label).not.toBe(title)
    }
  })

  it('the Aku card gives the attached-token example in both languages', () => {
    expect(id.findings.akuBody).toContain('AkuCIL')
    expect(en.findings.akuBody).toContain('AkuCIL')
  })

  it('screen-reader labels for the score, the diff marker, and empty cells exist in both dictionaries', () => {
    expect(id.demo.rougeLabel).toBe('ROUGE-L')
    expect(en.demo.rougeLabel).toBe('ROUGE-L')
    expect(id.demo.diffLegend).toMatch(/\(beda\)/)
    expect(en.demo.diffLegend).toMatch(/\(differs\)/)
    expect(id.results.scenarios.none).toBe('tidak ada')
    expect(en.results.scenarios.none).toBe('none')
  })

  it('stat labels for Aku and quote openings both say "diawali" (starts with)', () => {
    expect(id.findings.akuMark).toBe('diawali "Aku"')
    expect(id.findings.quoteMark).toMatch(/^diawali /)
    expect(en.findings.akuMark).toBe('start with "Aku"')
    expect(en.findings.quoteMark).toMatch(/^start with /)
  })

  it('nav.langNames is the same literal in both dictionaries', () => {
    const langNames = { id: 'ID, Bahasa Indonesia', en: 'EN, English' }
    expect(id.nav.langNames).toEqual(langNames)
    expect(en.nav.langNames).toEqual(langNames)
  })
})
