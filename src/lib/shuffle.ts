/** Random story that is neither the current one nor a featured chip. `rand` is injectable for tests. */
export function pickRandomId(
  ids: readonly number[],
  currentId: number,
  featured: readonly number[],
  rand: () => number = Math.random,
): number {
  const pool = ids.filter((id) => id !== currentId && !featured.includes(id))
  if (pool.length === 0) throw new Error('no story left to pick')
  return pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))]
}
