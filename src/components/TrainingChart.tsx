import { BASELINE, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { polyline, xPairs, yScore } from '../lib/chart.ts'
import { formatInt } from '../lib/format.ts'
import { YAxis } from './ChartAxes.tsx'
import { MODEL_COLOR, MODEL_LABEL } from './models.ts'

const X_TICKS = [0, 500, 1000, 1500]

export function TrainingChart() {
  const { lang, t } = useLang()
  const c = t.results.training
  const points = SCENARIOS.map((s) => ({ ...s, x: xPairs(s.pairs), y: yScore(s.rougeL) }))
  const alt = SCENARIOS.map(
    (s) => `${MODEL_LABEL[s.id]} ${formatInt(s.pairs, lang)} ${t.results.pairsUnit} ${s.rougeL.toFixed(4)}`,
  ).join('; ')
  const baselineY = yScore(BASELINE.rougeL)

  return (
    <figure className="chart-card chart-main sr">
      <figcaption>
        <h2>{c.title}</h2>
        <p>{c.subtitle}</p>
      </figcaption>
      <div className="chart-scroll">
      <svg className="chart" viewBox="0 0 640 330" role="img" aria-label={c.alt(alt)}>
        <YAxis right={620} />
        <g className="chart-ticks" textAnchor="middle">
          {X_TICKS.map((n) => (
            <text key={n} x={xPairs(n)} y="302">
              {formatInt(n, lang)}
            </text>
          ))}
        </g>
        <text className="chart-axis-title" x="340" y="324" textAnchor="middle">
          {c.xAxis}
        </text>
        <line className="chart-baseline" x1="60" y1={baselineY} x2="620" y2={baselineY} />
        <text className="chart-note-text" x="62" y={baselineY - 8}>
          {c.baselineLabel(BASELINE.rougeL.toFixed(3))}
        </text>
        <polyline
          className="line"
          fill="none"
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ stroke: 'var(--primary)' }}
          points={polyline(points.map((p) => [p.x, p.y]))}
        />
        {points.map((p, i) => (
          <circle
            key={p.id}
            className="pt"
            cx={p.x}
            cy={p.y}
            r={p.id === 'hybrid' ? 9 : 7}
            strokeWidth="2"
            style={{ fill: MODEL_COLOR[p.id], stroke: 'var(--surface)', animationDelay: `${500 + i * 250}ms` }}
          >
            <title>{`${MODEL_LABEL[p.id]}: ${formatInt(p.pairs, lang)} ${t.results.pairsUnit}, ROUGE-L ${p.rougeL.toFixed(4)}`}</title>
          </circle>
        ))}
        <g className="pt chart-label" style={{ animationDelay: '1100ms' }} fontSize="13">
          {points.map((p) =>
            p.id === 'hybrid' ? (
              <text key={p.id} x={p.x} y={p.y + 28} textAnchor="middle" fontWeight="500">
                {MODEL_LABEL[p.id]} {p.rougeL.toFixed(4)}
              </text>
            ) : (
              <text key={p.id} x={p.x + 12} y={p.y + 19}>
                {MODEL_LABEL[p.id]} {p.rougeL.toFixed(4)}
              </text>
            ),
          )}
        </g>
      </svg>
      </div>
    </figure>
  )
}
