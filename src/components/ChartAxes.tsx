import { yScore } from '../lib/chart.ts'

const TICKS = [1, 0.75, 0.5, 0.25, 0]

/** Horizontal grid, baseline, and 0..1 tick labels shared by both charts. `right` is the plot's right edge. */
export function YAxis({ right }: { right: number }) {
  return (
    <>
      <g className="chart-grid">
        {TICKS.slice(0, -1).map((v) => (
          <line key={v} x1="60" y1={yScore(v)} x2={right} y2={yScore(v)} />
        ))}
      </g>
      <line className="chart-axis" x1="60" y1={yScore(0)} x2={right} y2={yScore(0)} />
      <g className="chart-ticks" textAnchor="end">
        {TICKS.map((v) => (
          <text key={v} x="50" y={yScore(v) + 4}>
            {v === 0 ? '0' : v.toFixed(2)}
          </text>
        ))}
      </g>
    </>
  )
}
