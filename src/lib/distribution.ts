export const BIN_COUNT = 10

/** Counts scores into ten 0.1-wide bins; 1.0 falls into the last bin. */
export function binScores(scores: readonly number[]): number[] {
  const bins = new Array<number>(BIN_COUNT).fill(0)
  for (const s of scores) bins[Math.min(BIN_COUNT - 1, Math.floor(s * BIN_COUNT))] += 1
  return bins
}
