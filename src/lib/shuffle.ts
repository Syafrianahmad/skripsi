import { FEATURED_IDS } from '../data/results.ts'
import { type FilterKey, storyIds } from './findings.ts'

const featured: readonly number[] = FEATURED_IDS

/**
 * Random story for the shuffle button: never the current one, and without a filter never a featured chip.
 * `rng` returns a number in [0, 1); injectable so tests can fix the draw.
 */
export function nextStoryId(currentId: number, filter: FilterKey | null, rng: () => number): number {
  const excluded = filter ? [] : featured
  const pool = storyIds(filter).filter((id) => id !== currentId && !excluded.includes(id))
  if (pool.length === 0) throw new Error('no story left to pick')
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))]
}
