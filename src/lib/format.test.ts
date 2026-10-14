import { describe, expect, it, vi } from 'vitest'
import { formatDec, formatInt, gainPercent } from './format.ts'

describe('formatInt', () => {
  it('uses the thousands separator of the active language', () => {
    expect(formatInt(1633, 'id')).toBe('1.633')
    expect(formatInt(1633, 'en')).toBe('1,633')
    expect(formatInt(633, 'id')).toBe('633')
  })

  it('shows a dash for NaN and infinities, like formatDec', () => {
    expect(formatInt(NaN, 'id')).toBe('-')
    expect(formatInt(-Infinity, 'en')).toBe('-')
  })

  it('reuses the cached formatter instead of building one per call', () => {
    formatInt(1, 'en')
    const spy = vi.spyOn(Intl, 'NumberFormat')
    for (let i = 0; i < 50; i++) formatInt(i, 'en')
    expect(spy.mock.calls.length).toBe(0)
    spy.mockRestore()
  })
})

describe('formatDec', () => {
  it('uses a decimal comma in id and a decimal point in en', () => {
    expect(formatDec(0.7976, 'id', 4)).toBe('0,7976')
    expect(formatDec(0.7976, 'en', 4)).toBe('0.7976')
    expect(formatDec(0.867, 'id', 3)).toBe('0,867')
  })

  it('groups thousands with a point in id and a comma in en', () => {
    expect(formatDec(1633.5, 'id', 1)).toBe('1.633,5')
    expect(formatDec(1633.5, 'en', 1)).toBe('1,633.5')
  })

  it('rounds like toFixed before localisation (1.45 is below the half, so 1.4)', () => {
    expect(formatDec(1.45, 'en', 1)).toBe('1.4')
    expect(formatDec(1.45, 'id', 1)).toBe('1,4')
  })

  it('drops the minus sign when rounding leaves zero', () => {
    expect(formatDec(-0.00004, 'id', 4)).toBe('0,0000')
    expect(formatDec(-0.04, 'id', 1)).toBe('0,0')
    expect(formatDec(-0.04, 'en', 1)).toBe('0.0')
  })

  it('keeps the minus sign when the value does not round to zero', () => {
    expect(formatDec(-0.0432, 'id', 2)).toBe('-0,04')
  })

  it('shows a dash for NaN and infinities instead of "NaN" or "Infinity"', () => {
    expect(formatDec(NaN, 'id', 2)).toBe('-')
    expect(formatDec(Infinity, 'en', 1)).toBe('-')
    expect(formatDec(-Infinity, 'en', 1)).toBe('-')
  })

  it('builds at most one Intl.NumberFormat per language and digit count', () => {
    const spy = vi.spyOn(Intl, 'NumberFormat')
    for (let i = 0; i < 50; i++) formatDec(0.5, 'id', 3)
    expect(spy.mock.calls.length).toBeLessThanOrEqual(1)
    spy.mockRestore()
  })
})

// The score cards on the results page quote these gains over the Murni scenario.
describe('gainPercent', () => {
  it('matches the gains shown in the design', () => {
    expect(gainPercent(0.6437, 0.3978, 'en')).toBe('61.8')
    expect(gainPercent(0.7976, 0.3978, 'en')).toBe('100.5')
  })

  it('is zero against itself', () => {
    expect(gainPercent(0.3978, 0.3978, 'en')).toBe('0.0')
  })

  it('shows a dash when the base is zero', () => {
    expect(gainPercent(0.5, 0, 'id')).toBe('-')
  })

  it('uses a decimal comma for id and a decimal point for en', () => {
    expect(gainPercent(0.6437, 0.3978, 'id')).toBe('61,8')
    expect(gainPercent(0.6437, 0.3978, 'en')).toBe('61.8')
    expect(gainPercent(0.7976, 0.3978, 'id')).toBe('100,5')
  })

  it('is zero against itself in id', () => {
    expect(gainPercent(0.3978, 0.3978, 'id')).toBe('0,0')
  })
})
