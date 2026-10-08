import { describe, expect, it } from 'vitest'
import { formatInt, gainPercent } from './format.ts'

describe('formatInt', () => {
  it('uses the thousands separator of the active language', () => {
    expect(formatInt(1633, 'id')).toBe('1.633')
    expect(formatInt(1633, 'en')).toBe('1,633')
    expect(formatInt(633, 'id')).toBe('633')
  })
})

// The score cards on the results page quote these gains over the Murni scenario.
describe('gainPercent', () => {
  it('matches the gains shown in the design', () => {
    expect(gainPercent(0.6437, 0.3978)).toBe('61.8')
    expect(gainPercent(0.7976, 0.3978)).toBe('100.5')
  })

  it('is zero against itself', () => {
    expect(gainPercent(0.3978, 0.3978)).toBe('0.0')
  })
})
