import { describe, expect, it } from 'vitest'
import { polyline, xEpoch, xPairs, yScore } from './chart.ts'

// Expected values are the hand-placed coordinates in docs/design/Hasil.dc.html.
describe('yScore', () => {
  it('maps 0 to the baseline and 1 to the top of the plot', () => {
    expect(yScore(0)).toBe(280)
    expect(yScore(1)).toBe(20)
  })

  it('matches the design points', () => {
    expect(yScore(0.0278)).toBeCloseTo(272.8, 1)
    expect(yScore(0.8521)).toBeCloseTo(58.5, 1)
    expect(yScore(0.867)).toBeCloseTo(54.6, 1)
    expect(yScore(0.944)).toBeCloseTo(34.6, 1)
  })

  it('clamps values above 1 to the top (loss axis is cut at 1.0)', () => {
    expect(yScore(6.881)).toBe(20)
  })
})

describe('xEpoch', () => {
  it('spreads epochs 1..8 across 60..600', () => {
    expect(xEpoch(1)).toBe(60)
    expect(xEpoch(8)).toBe(600)
    expect(xEpoch(2)).toBeCloseTo(137.1, 1)
  })
})

describe('xPairs', () => {
  it('places training-set sizes on the scatter axis', () => {
    expect(xPairs(0)).toBe(60)
    expect(xPairs(633)).toBeCloseTo(250, 0)
    expect(xPairs(1633)).toBeCloseTo(550, 0)
  })
})

describe('polyline', () => {
  it('joins points with one decimal and no trailing zeros', () => {
    expect(
      polyline([
        [60, 272.8],
        [137.14, 267.7],
      ]),
    ).toBe('60,272.8 137.1,267.7')
  })

  it('returns an empty string for no points', () => {
    expect(polyline([])).toBe('')
  })
})
