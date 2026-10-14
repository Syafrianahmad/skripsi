import { useRef, useState, type KeyboardEvent } from 'react'
import { EPOCH_LOSS, EPOCH_ROUGE, MODEL_IDS, TRAIN_MINUTES, VALIDATION_DOCS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { type ChartMetric, METRIC_ORDER, nextMetric, polyline, xEpoch, yScore } from '../lib/chart.ts'
import { formatDec } from '../lib/format.ts'
import { SeriesMarker, YAxis } from './ChartAxes.tsx'
import { ChartTable } from './ChartTable.tsx'
import { MODEL_COLOR, MODEL_DASH, MODEL_LABEL } from './models.ts'

const EPOCHS = [1, 2, 3, 4, 5, 6, 7, 8]

// loss above the 1.0 axis ceiling gets a note at the top. Notes take rows in draw order (model, then epoch),
// not by series index: Murni epochs 1 and 2 would otherwise share a baseline and overlap.
const CLIP_NOTES = MODEL_IDS.flatMap((m) => EPOCH_LOSS[m].map((v, i) => ({ m, i, v })).filter((n) => n.v > 1))

export function CurveChart() {
  const { lang, t } = useLang()
  const c = t.results.curve
  const d = t.results.chartData
  const [metric, setMetric] = useState<ChartMetric>('rouge')
  const tabs = useRef<Partial<Record<ChartMetric, HTMLButtonElement | null>>>({})
  const data = metric === 'rouge' ? EPOCH_ROUGE : EPOCH_LOSS
  const digits = metric === 'rouge' ? 4 : 3
  const labels: Record<ChartMetric, string> = { rouge: 'ROUGE-L', loss: c.lossLabel }

  const onKeyDown = (e: KeyboardEvent) => {
    const next = nextMetric(metric, e.key)
    if (next === null) return
    e.preventDefault()
    setMetric(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="kurva" className="chart-card sr" aria-labelledby="curve-title" tabIndex={-1}>
      <div className="chart-head">
        <div>
          <h2 id="curve-title">{c.title}</h2>
          <p>{c.subtitle(VALIDATION_DOCS.murni, VALIDATION_DOCS.gtrans, VALIDATION_DOCS.hybrid)}</p>
        </div>
        <div className="tabs" role="tablist" aria-label={c.tabsLabel} onKeyDown={onKeyDown}>
          <span
            className="tab-thumb"
            aria-hidden="true"
            style={{ transform: `translateX(${METRIC_ORDER.indexOf(metric) * 100}%)` }}
          />
          {METRIC_ORDER.map((m) => (
            <button
              key={m}
              ref={(el) => {
                tabs.current[m] = el
              }}
              type="button"
              role="tab"
              id={`curve-tab-${m}`}
              aria-selected={metric === m}
              aria-controls="curve-panel"
              tabIndex={metric === m ? 0 : -1}
              className="tab"
              onClick={() => setMetric(m)}
            >
              {labels[m]}
            </button>
          ))}
        </div>
      </div>

      <div id="curve-panel" role="tabpanel" aria-labelledby={`curve-tab-${metric}`}>
        <div className="chart-scroll" role="region" aria-label={t.results.scrollRegion(c.title)} tabIndex={0}>
          <svg
            className="chart"
            viewBox="0 0 680 330"
            role="img"
            aria-label={metric === 'rouge' ? c.rougeAlt : c.lossAlt}
          >
            <YAxis right={600} lang={lang} />
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
              return (
                <g key={`${metric}-${m}`}>
                  <polyline
                    className={MODEL_DASH[m] ? 'pt' : 'line'}
                    fill="none"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeDasharray={MODEL_DASH[m]}
                    style={{ stroke: MODEL_COLOR[m], animationDelay: `${mi * 150}ms` }}
                    points={polyline(values.map((v, i) => [xEpoch(i + 1), yScore(v)]))}
                  />
                  {values.map((v, i) => (
                    <SeriesMarker
                      key={i}
                      model={m}
                      className="pt"
                      cx={xEpoch(i + 1)}
                      cy={yScore(v)}
                      r={5}
                      title={c.pointTitle(MODEL_LABEL[m], i + 1, formatDec(v, lang, digits))}
                      style={{ animationDelay: `${600 + i * 60}ms` }}
                    />
                  ))}
                  {metric === 'loss' &&
                    CLIP_NOTES.filter((n) => n.m === m).map((n) => (
                      <text
                        key={`clip-${n.i}`}
                        className="pt chart-muted"
                        x={xEpoch(n.i + 1) + 8}
                        y={24 + CLIP_NOTES.indexOf(n) * 16}
                        fontSize="12"
                        style={{ animationDelay: '900ms' }}
                      >
                        {MODEL_LABEL[m]} {formatDec(n.v, lang, 2)} ↑
                      </text>
                    ))}
                  <text className="pt chart-label" x="612" y={yScore(last) + 4} fontSize="13" style={{ animationDelay: '1100ms' }}>
                    {MODEL_LABEL[m]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <details className="chart-data">
          <summary>
            {d.summary}
            <span className="sr-only">: {c.title}</span>
          </summary>
          <ChartTable
            caption={`${c.title}: ${labels[metric]}`}
            headers={[d.epoch, ...MODEL_IDS.map((m) => MODEL_LABEL[m])]}
            rows={EPOCHS.map((e, i) => ({
              label: String(e),
              cells: MODEL_IDS.map((m) => formatDec(data[m][i], lang, digits)),
            }))}
          />
        </details>
        {metric === 'loss' && <p className="chart-note">{c.clipNote}</p>}
      </div>

      <div className="legend-row">
        {MODEL_IDS.map((m) => (
          <span key={m} className="legend-item">
            <svg width="26" height="12" aria-hidden="true">
              <line
                x1="0"
                y1="6"
                x2="26"
                y2="6"
                strokeWidth="2"
                style={{ stroke: MODEL_COLOR[m] }}
                strokeDasharray={MODEL_DASH[m]}
              />
              <SeriesMarker model={m} cx={13} cy={6} r={4} />
            </svg>
            {MODEL_LABEL[m]}
          </span>
        ))}
        <span>{c.trainTime(TRAIN_MINUTES.murni, TRAIN_MINUTES.gtrans, TRAIN_MINUTES.hybrid)}</span>
      </div>
    </section>
  )
}
