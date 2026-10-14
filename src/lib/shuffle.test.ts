import { describe, expect, it } from 'vitest'
import { nextStoryId } from './shuffle.ts'

// Stories featured as chips (docs.json ids), and the 9 Hybrid stories scoring ROUGE-L below 0.5.
const FEATURED = [68, 40, 69, 60, 50]
const LOW_HYBRID = [29, 31, 41, 45, 50, 52, 54, 63, 65]

/** Park-Miller generator: deterministic draws in (0, 1). */
function seededRng(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
}

describe('nextStoryId without a filter', () => {
  it('never picks a featured story or the current one over many draws', () => {
    const rng = seededRng(1)
    for (let i = 0; i < 300; i++) {
      const picked = nextStoryId(2, null, rng)
      expect(FEATURED).not.toContain(picked)
      expect(picked).not.toBe(2)
    }
  })

  it('takes the lowest eligible id when the random source returns 0', () => {
    expect(nextStoryId(2, null, () => 0)).toBe(1)
  })

  it('takes the highest eligible id when the random source returns 1', () => {
    expect(nextStoryId(2, null, () => 1)).toBe(70)
  })
})

describe('nextStoryId with a filter', () => {
  it('stays inside the filtered stories and never returns the current one', () => {
    const rng = seededRng(7)
    for (let i = 0; i < 300; i++) {
      const picked = nextStoryId(29, 'low:hybrid', rng)
      expect(LOW_HYBRID).toContain(picked)
      expect(picked).not.toBe(29)
    }
  })

  it('may pick a featured story that matches the filter', () => {
    // pool without the current 29: [31, 41, 45, 50, 52, 54, 63, 65]; 0.375 * 8 = index 3
    expect(nextStoryId(29, 'low:hybrid', () => 0.375)).toBe(50)
  })

  it('throws when the filter leaves nothing to pick', () => {
    expect(() => nextStoryId(1, 'quote:murni', () => 0)).toThrow()
  })
})
