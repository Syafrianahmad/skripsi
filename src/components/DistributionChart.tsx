import { DOCS } from '../data/results.ts'
import type { ModelId } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import { BIN_COUNT, binScores } from '../lib/distribution.ts'
import { MODEL_COLOR, MODEL_LABEL } from './models.ts'

const MODELS: readonly ModelId[] = ['murni', 'gtrans', 'hybrid']
const LOW_BINS = 5 // 0.0 to 0.5
const TOP = 20
const BOTTOM = 280
const LEFT = 60
const RIGHT = 600
const BIN_WIDTH = (RIGHT - LEFT) / BIN_COUNT
const BAR_WIDTH = 14
const BAR_GAP = 2

const series = MODELS.map((m) => ({ id: m, bins: binScores(DOCS.map((d) => d.out[m].rl)) }))
const lowCount = (bins: readonly number[]) => bins.slice(0, LOW_BINS).reduce((a, b) => a + b, 0)
const maxCount = Math.max(...series.flatMap((s) => s.bins))
const yMax = Math.ceil(maxCount / 10) * 10
const yOf = (n: number) => BOTTOM - (n / yMax) * (BOTTOM - TOP)
const edge = (i: number) => (i / BIN_COUNT).toFixed(1)

export function DistributionChart() {
  const { t } = useLang()
  const c = t.results.distribution
  const groupWidth = MODELS.length * BAR_WIDTH + (MODELS.length - 1) * BAR_GAP
  const offset = (BIN_WIDTH - groupWidth) / 2
  const summary = series.map((s) => `${MODEL_LABEL[s.id]} ${lowCount(s.bins)}`).join(', ')

  return (
    <figure className="chart-card sr">
      <figcaption>
        <h2>{c.title}</h2>
        <p>{c.subtitle}</p>
        <ul className="dist-legend">
          {MODELS.map((m) => (
            <li key={m}>
              <span className="dist-swatch" style={{ background: MODEL_COLOR[m] }} aria-hidden="true" />
              {MODEL_LABEL[m]}
            </li>
          ))}
        </ul>
      </figcaption>
      <div className="chart-scroll">
        <svg className="chart" viewBox="0 0 680 330" role="img" aria-label={c.alt(summary)}>
          <rect className="dist-low" x={LEFT} y={TOP} width={LOW_BINS * BIN_WIDTH} height={BOTTOM - TOP} />
          <text className="chart-muted" x={LEFT + 8} y={TOP + 14}>
            {c.lowBand}
          </text>
          <g className="chart-grid">
            {[0.5, 1].map((f) => (
              <line key={f} x1={LEFT} y1={yOf(yMax * f)} x2={RIGHT} y2={yOf(yMax * f)} />
            ))}
          </g>
          <line className="chart-axis" x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM} />
          <g className="chart-ticks" textAnchor="end">
            {[0, 0.5, 1].map((f) => (
              <text key={f} x="50" y={yOf(yMax * f) + 4}>
                {Math.round(yMax * f)}
              </text>
            ))}
          </g>
          {series.map((s, mi) =>
            s.bins.map((n, b) => {
              const x = LEFT + b * BIN_WIDTH + offset + mi * (BAR_WIDTH + BAR_GAP)
              return (
                <rect
                  key={`${s.id}-${b}`}
                  x={x}
                  y={yOf(n)}
                  width={BAR_WIDTH}
                  height={BOTTOM - yOf(n)}
                  rx="2"
                  style={{ fill: MODEL_COLOR[s.id] }}
                >
                  <title>{c.barTitle(MODEL_LABEL[s.id], edge(b), edge(b + 1), n)}</title>
                </rect>
              )
            }),
          )}
          <g className="chart-ticks" textAnchor="middle">
            {Array.from({ length: BIN_COUNT }, (_, b) => (
              <text key={b} x={LEFT + b * BIN_WIDTH + BIN_WIDTH / 2} y="302">
                {edge(b)}
              </text>
            ))}
          </g>
          <text className="chart-axis-title" x="330" y="324" textAnchor="middle">
            {c.xAxis}
          </text>
        </svg>
      </div>
    </figure>
  )
}
