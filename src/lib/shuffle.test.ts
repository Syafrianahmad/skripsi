import { describe, expect, it } from 'vitest'
import { pickRandomId } from './shuffle.ts'

describe('pickRandomId', () => {
  it('skips the current story and the featured ones', () => {
    expect(pickRandomId([1, 2, 3, 4, 5, 6], 1, [2, 3], () => 0)).toBe(4)
    expect(pickRandomId([1, 2, 3, 4, 5, 6], 4, [2, 3], () => 0)).toBe(1)
  })

  it('never returns an excluded id over many random draws', () => {
    const ids = Array.from({ length: 20 }, (_, i) => i + 1)
    for (let i = 0; i < 300; i++) {
      const picked = pickRandomId(ids, 7, [1, 2, 3])
      expect([1, 2, 3, 7]).not.toContain(picked)
    }
  })

  it('stays in range when the random source returns exactly 1', () => {
    expect(pickRandomId([1, 2, 3], 1, [], () => 1)).toBe(3)
  })

  it('throws when there is nothing left to pick', () => {
    expect(() => pickRandomId([1, 2], 1, [2])).toThrow()
  })
})
