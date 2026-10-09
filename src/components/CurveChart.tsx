import { useRef, useState, type KeyboardEvent } from 'react'
import { EPOCH_LOSS, EPOCH_ROUGE, MODEL_IDS, TRAIN_MINUTES, VALIDATION_DOCS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { isClipped, polyline, xEpoch, yScore } from '../lib/chart.ts'
import { YAxis } from './ChartAxes.tsx'
import { MODEL_COLOR, MODEL_LABEL } from './models.ts'

type Metric = 'rouge' | 'loss'
const METRICS: readonly { id: Metric; label: string }[] = [
  { id: 'rouge', label: 'ROUGE-L' },
  { id: 'loss', label: 'Loss' },
]
const EPOCHS = [1, 2, 3, 4, 5, 6, 7, 8]

export function CurveChart() {
  const { t } = useLang()
  const c = t.results.curve
  const [metric, setMetric] = useState<Metric>('rouge')
  const tabs = useRef<Partial<Record<Metric, HTMLButtonElement | null>>>({})
  const data = metric === 'rouge' ? EPOCH_ROUGE : EPOCH_LOSS
  const fmt = (v: number) => (metric === 'rouge' ? v.toFixed(4) : v.toFixed(3))

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next: Metric = metric === 'rouge' ? 'loss' : 'rouge'
    setMetric(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="kurva" className="chart-card sr" aria-labelledby="curve-title">
      <div className="chart-head">
        <div>
          <h2 id="curve-title">{c.title}</h2>
          <p>{c.subtitle(VALIDATION_DOCS.murni, VALIDATION_DOCS.gtrans, VALIDATION_DOCS.hybrid)}</p>
        </div>
        <div className="tabs" role="tablist" aria-label={c.tabsLabel} onKeyDown={onKeyDown}>
          <span
            className="tab-thumb"
            aria-hidden="true"
            style={{ transform: `translateX(${METRICS.findIndex((m) => m.id === metric) * 100}%)` }}
          />
          {METRICS.map((m) => (
            <button
              key={m.id}
              ref={(el) => {
                tabs.current[m.id] = el
              }}
              type="button"
              role="tab"
              id={`curve-tab-${m.id}`}
              aria-selected={metric === m.id}
              aria-controls="curve-panel"
              tabIndex={metric === m.id ? 0 : -1}
              className="tab"
              onClick={() => setMetric(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div id="curve-panel" role="tabpanel" aria-labelledby={`curve-tab-${metric}`}>
        <div className="chart-scroll">
        <svg
          className="chart"
          viewBox="0 0 680 330"
          role="img"
          aria-label={metric === 'rouge' ? c.rougeAlt : c.lossAlt}
        >
          <YAxis right={600} />
          <g className="chart-ticks" textAnchor="middle">
            {EPOCHS.map((e) => (
              <text key={e} x={xEpoch(e)} y="302">
                {e}
              </text>
            ))}
          </g>
          <text className="chart-axis-title" x="330" y="324" textAnchor="middle">
            {c.xAxis}
          </text>
          {MODEL_IDS.map((m, mi) => {
            const values = data[m]
            const last = values[values.length - 1]
            const dashed = m === 'murni'
            return (
              <g key={`${metric}-${m}`}>
                <polyline
                  className={dashed ? 'pt' : 'line'}
                  fill="none"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeDasharray={dashed ? '6 5' : undefined}
                  style={{ stroke: MODEL_COLOR[m], animationDelay: `${mi * 150}ms` }}
                  points={polyline(values.map((v, i) => [xEpoch(i + 1), yScore(v)]))}
                />
                {values.map((v, i) => (
                  <circle
                    key={i}
                    className="pt"
                    cx={xEpoch(i + 1)}
                    cy={yScore(v)}
                    r="5"
                    strokeWidth="2"
                    style={{ fill: MODEL_COLOR[m], stroke: 'var(--surface)', animationDelay: `${600 + i * 60}ms` }}
                  >
                    <title>{c.pointTitle(MODEL_LABEL[m], i + 1, fmt(v))}</title>
                  </circle>
                ))}
                {metric === 'loss' &&
                  values.map((v, i) =>
                    isClipped(v) ? (
                      <text
                        key={`clip-${i}`}
                        className="pt chart-muted"
                        x={xEpoch(i + 1) + 8}
                        y={24 + mi * 12}
                        fontSize="11"
                        style={{ animationDelay: '900ms' }}
                      >
                        {MODEL_LABEL[m]} {v.toFixed(2)} ↑
                      </text>
                    ) : null,
                  )}
                <text className="pt chart-label" x="612" y={yScore(last) + 4} fontSize="13" style={{ animationDelay: '1100ms' }}>
                  {MODEL_LABEL[m]}
                </text>
              </g>
            )
          })}
        </svg>
        </div>
        {metric === 'loss' && <p className="chart-note">{c.clipNote}</p>}
      </div>

      <div className="legend-row">
        {MODEL_IDS.map((m) => (
          <span key={m} className="legend-item">
            <svg width="22" height="6" aria-hidden="true">
              <line
                x1="0"
                y1="3"
                x2="22"
                y2="3"
                strokeWidth="2"
                style={{ stroke: MODEL_COLOR[m] }}
                strokeDasharray={m === 'murni' ? '6 5' : undefined}
              />
            </svg>
            {MODEL_LABEL[m]}
          </span>
        ))}
        <span>{c.trainTime(TRAIN_MINUTES.murni, TRAIN_MINUTES.gtrans, TRAIN_MINUTES.hybrid)}</span>
      </div>
    </section>
  )
}
