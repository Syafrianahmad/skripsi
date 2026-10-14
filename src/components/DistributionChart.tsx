import { DOCS, MODEL_IDS } from '../data/results.ts'
import type { ModelId } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import { BIN_COUNT, binScores } from '../lib/distribution.ts'
import { PLOT_BOTTOM, PLOT_LEFT, PLOT_RIGHT, PLOT_TOP } from '../lib/chart.ts'
import { formatDec } from '../lib/format.ts'
import { ChartTable } from './ChartTable.tsx'
import { MODEL_COLOR, MODEL_LABEL } from './models.ts'

const LOW_BINS = 5 // 0.0 to 0.5
const BIN_WIDTH = (PLOT_RIGHT - PLOT_LEFT) / BIN_COUNT
const BAR_WIDTH = 14
const BAR_GAP = 2
// Murni and GTrans get hatch and dot patterns; Hybrid stays solid. Ids are prefixed for this chart only.
const PATTERN_PREFIX = 'dist-pat-'

const series = MODEL_IDS.map((m) => ({ id: m, bins: binScores(DOCS.map((d) => d.out[m].rl)) }))
const lowCount = (bins: readonly number[]) => bins.slice(0, LOW_BINS).reduce((a, b) => a + b, 0)
const maxCount = Math.max(...series.flatMap((s) => s.bins))
const yMax = Math.ceil(maxCount / 10) * 10
const yOf = (n: number) => PLOT_BOTTOM - (n / yMax) * (PLOT_BOTTOM - PLOT_TOP)
const barFill = (m: ModelId) => (m === 'hybrid' ? MODEL_COLOR[m] : `url(#${PATTERN_PREFIX}${m})`)

export function DistributionChart() {
  const { lang, t } = useLang()
  const c = t.results.distribution
  const d = t.results.chartData
  const groupWidth = MODEL_IDS.length * BAR_WIDTH + (MODEL_IDS.length - 1) * BAR_GAP
  const offset = (BIN_WIDTH - groupWidth) / 2
  const summary = series.map((s) => `${MODEL_LABEL[s.id]} ${lowCount(s.bins)}`).join(', ')
  const edge = (i: number) => formatDec(i / BIN_COUNT, lang, 1)

  return (
    <figure className="chart-card sr">
      <figcaption>
        <h2>{c.title}</h2>
        <p>{c.subtitle}</p>
        <ul className="dist-legend" role="list">
          {MODEL_IDS.map((m) => (
            <li key={m}>
              <svg className="dist-swatch" viewBox="0 0 12 12" aria-hidden="true">
                <rect width="12" height="12" rx="3" style={{ fill: barFill(m) }} />
              </svg>
              {MODEL_LABEL[m]}
            </li>
          ))}
        </ul>
      </figcaption>
      <div className="chart-scroll" role="region" aria-label={t.results.scrollRegion(c.title)} tabIndex={0}>
        <svg className="chart" viewBox="0 0 680 330" role="img" aria-label={c.alt(summary)}>
          <defs>
            <pattern id={`${PATTERN_PREFIX}murni`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" style={{ fill: MODEL_COLOR.murni, fillOpacity: 0.35 }} />
              <line x1="3" y1="0" x2="3" y2="6" strokeWidth="2" style={{ stroke: MODEL_COLOR.murni }} />
            </pattern>
            <pattern id={`${PATTERN_PREFIX}gtrans`} width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" style={{ fill: MODEL_COLOR.gtrans, fillOpacity: 0.35 }} />
              <circle cx="3" cy="3" r="1.5" style={{ fill: MODEL_COLOR.gtrans }} />
            </pattern>
          </defs>
          <rect className="dist-low" x={PLOT_LEFT} y={PLOT_TOP} width={LOW_BINS * BIN_WIDTH} height={PLOT_BOTTOM - PLOT_TOP} />
          <text className="chart-muted" x={PLOT_LEFT + 8} y={PLOT_TOP + 14}>
            {c.lowBand}
          </text>
          <g className="chart-grid">
            {[0.5, 1].map((f) => (
              <line key={f} x1={PLOT_LEFT} y1={yOf(yMax * f)} x2={PLOT_RIGHT} y2={yOf(yMax * f)} />
            ))}
          </g>
          <line className="chart-axis" x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} />
          <g className="chart-ticks" textAnchor="end">
            {[0, 0.5, 1].map((f) => (
              <text key={f} x="50" y={yOf(yMax * f) + 4}>
                {Math.round(yMax * f)}
              </text>
            ))}
          </g>
          {series.map((s, mi) =>
            s.bins.map((n, b) => {
              const x = PLOT_LEFT + b * BIN_WIDTH + offset + mi * (BAR_WIDTH + BAR_GAP)
              return (
                <rect
                  key={`${s.id}-${b}`}
                  x={x}
                  y={yOf(n)}
                  width={BAR_WIDTH}
                  height={PLOT_BOTTOM - yOf(n)}
                  rx="2"
                  style={{ fill: barFill(s.id) }}
                >
                  <title>{c.barTitle(MODEL_LABEL[s.id], edge(b), edge(b + 1), n)}</title>
                </rect>
              )
            }),
          )}
          <g className="chart-ticks" textAnchor="middle">
            {Array.from({ length: BIN_COUNT }, (_, b) => (
              <text key={b} x={PLOT_LEFT + b * BIN_WIDTH + BIN_WIDTH / 2} y="302">
                {edge(b)}
              </text>
            ))}
          </g>
          <text className="chart-axis-title" x="330" y="324" textAnchor="middle">
            {c.xAxis}
          </text>
        </svg>
      </div>
      <details className="chart-data">
        <summary>
          {d.summary}
          <span className="sr-only">: {c.title}</span>
        </summary>
        <ChartTable
          caption={c.title}
          headers={[d.range, ...MODEL_IDS.map((m) => MODEL_LABEL[m])]}
          rows={Array.from({ length: BIN_COUNT }, (_, b) => ({
            label: `${edge(b)}–${edge(b + 1)}`,
            cells: series.map((s) => d.stories(s.bins[b])),
          }))}
        />
      </details>
    </figure>
  )
}
