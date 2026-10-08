import type { Doc, ModelId } from '../data/types.ts'
import { MODEL_COLOR, MODEL_LABEL } from './models.ts'

type Props = { model: ModelId; out: Doc['out'][ModelId]; primary?: boolean }

export function ModelCard({ model, out, primary = false }: Props) {
  return (
    <article className={`model-card rv${primary ? ' is-primary' : ''}`}>
      <div className="model-row">
        <h3>{MODEL_LABEL[model]}</h3>
        <div className="bar" aria-hidden="true">
          <div className="bar-fill" style={{ transform: `scaleX(${out.rl})`, background: MODEL_COLOR[model] }} />
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
