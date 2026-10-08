import type { Doc, ModelId } from '../data/types.ts'

// Proper nouns for the three training scenarios, not translated.
const LABEL: Record<ModelId, string> = { murni: 'Murni', gtrans: 'GTrans', hybrid: 'Hybrid' }
const BAR_COLOR: Record<ModelId, string> = { murni: '#94a3b8', gtrans: '#64748b', hybrid: 'var(--primary)' }

type Props = { model: ModelId; out: Doc['out'][ModelId]; primary?: boolean }

export function ModelCard({ model, out, primary = false }: Props) {
  return (
    <article className={`model-card rv${primary ? ' is-primary' : ''}`}>
      <div className="model-row">
        <h3>{LABEL[model]}</h3>
        <div className="bar" aria-hidden="true">
          <div className="bar-fill" style={{ transform: `scaleX(${out.rl})`, background: BAR_COLOR[model] }} />
        </div>
        <span className="score">{out.rl.toFixed(2)}</span>
      </div>
      <p lang="jv">
        {out.parts.map((p, i) =>
          p.d ? (
            <mark key={i} className="diff">
              {p.t}
            </mark>
          ) : (
            <span key={i}>{p.t}</span>
          ),
        )}
      </p>
    </article>
  )
}
