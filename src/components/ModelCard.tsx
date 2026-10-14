import type { ModelId, Part } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import { formatDec } from '../lib/format.ts'
import { MODEL_COLOR, MODEL_LABEL } from './models.ts'

type Props = { model: ModelId; rl: number; parts: readonly Part[]; primary?: boolean }

export function ModelCard({ model, rl, parts, primary = false }: Props) {
  const { lang, t } = useLang()
  return (
    <article className={`model-card rv${primary ? ' is-primary' : ''}`}>
      <div className="model-row">
        <h3>{MODEL_LABEL[model]}</h3>
        <div className="bar" aria-hidden="true">
          <div className="bar-fill" style={{ transform: `scaleX(${rl})`, background: MODEL_COLOR[model] }} />
        </div>
        <span className="score">
          <span className="sr-only">{t.demo.rougeLabel} </span>
          {formatDec(rl, lang, 2)}
        </span>
      </div>
      <p lang="jv">
        {parts.map((p, i) =>
          p.d ? (
            <mark key={i} className="diff">
              <span className="sr-only" lang={lang}>{t.demo.diffMarker}{' '}</span>
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
