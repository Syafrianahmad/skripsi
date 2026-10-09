// Plot geometry shared by the SVG charts (viewBox 640-680 x 330, plot area x 60..600, y 20..280).
// Constants come from the hand-placed coordinates in docs/design/Hasil.dc.html.

const PLOT_TOP = 20
const PLOT_BOTTOM = 280
const PLOT_LEFT = 60
const PLOT_RIGHT = 600

/** Score (0..1) to SVG y. Values above 1 are clamped to the top edge. */
export function yScore(v: number): number {
  return Math.min(PLOT_BOTTOM, Math.max(PLOT_TOP, PLOT_BOTTOM - v * (PLOT_BOTTOM - PLOT_TOP)))
}

/** Epoch 1..8 to SVG x. */
export function xEpoch(e: number): number {
  return PLOT_LEFT + ((e - 1) * (PLOT_RIGHT - PLOT_LEFT)) / 7
}

/** Training pairs (0..~1800) to SVG x on the data-vs-score chart. */
export function xPairs(n: number): number {
  return PLOT_LEFT + n * 0.3
}

/** SVG `points` attribute: one decimal, trailing zeros dropped. */
export function polyline(points: readonly (readonly [number, number])[]): string {
  return points.map(([x, y]) => `${+x.toFixed(1)},${+y.toFixed(1)}`).join(' ')
}
