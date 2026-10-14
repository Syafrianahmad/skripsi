import type { CSSProperties } from 'react'
import type { Lang, ModelId } from '../data/types.ts'
import { PLOT_LEFT, polyline, yScore } from '../lib/chart.ts'
import { formatDec } from '../lib/format.ts'
import { MODEL_COLOR, MODEL_SHAPE } from './models.ts'

const TICKS = [1, 0.75, 0.5, 0.25, 0]

/** Horizontal grid, baseline, and 0..1 tick labels shared by both charts. `right` is the plot's right edge. */
export function YAxis({ right, lang }: { right: number; lang: Lang }) {
  return (
    <>
      <g className="chart-grid">
        {TICKS.slice(0, -1).map((v) => (
          <line key={v} x1={PLOT_LEFT} y1={yScore(v)} x2={right} y2={yScore(v)} />
        ))}
      </g>
      <line className="chart-axis" x1={PLOT_LEFT} y1={yScore(0)} x2={right} y2={yScore(0)} />
      <g className="chart-ticks" textAnchor="end">
        {TICKS.map((v) => (
          <text key={v} x="50" y={yScore(v) + 4}>
            {v === 0 ? '0' : formatDec(v, lang, 2)}
          </text>
        ))}
      </g>
    </>
  )
}

type SeriesMarkerProps = {
  model: ModelId
  cx: number
  cy: number
  r: number
  /** Tooltip text; omit for legend swatches. */
  title?: string
  className?: string
  style?: CSSProperties
}

/** Point marker in the model's shape (circle, square, triangle) and colour. */
export function SeriesMarker({ model, cx, cy, r, title, className, style }: SeriesMarkerProps) {
  const paint: CSSProperties = { fill: MODEL_COLOR[model], stroke: 'var(--surface)', ...style }
  const label = title === undefined ? null : <title>{title}</title>
  switch (MODEL_SHAPE[model]) {
    case 'square':
      return (
        <rect className={className} x={cx - r} y={cy - r} width={2 * r} height={2 * r} strokeWidth="2" style={paint}>
          {label}
        </rect>
      )
    case 'triangle':
      return (
        <polygon
          className={className}
          points={polyline([
            [cx, cy - r],
            [cx + r, cy + r * 0.8],
            [cx - r, cy + r * 0.8],
          ])}
          strokeWidth="2"
          style={paint}
        >
          {label}
        </polygon>
      )
    case 'circle':
      return (
        <circle className={className} cx={cx} cy={cy} r={r} strokeWidth="2" style={paint}>
          {label}
        </circle>
      )
  }
}
