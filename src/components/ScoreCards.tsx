import { BASELINE, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { MODEL_HUB } from '../links.ts'
import { formatDec, formatInt, gainPercent } from '../lib/format.ts'
import { MODEL_LABEL } from './models.ts'

const murniScore = SCENARIOS.find((s) => s.id === 'murni')!.rougeL

export function ScoreCards() {
  const { lang, t } = useLang()
  const r = t.results

  return (
    <section className="score-cards" aria-labelledby="score-cards-title">
      <h2 id="score-cards-title" className="sr-only">{r.scoresLabel}</h2>
      {SCENARIOS.map((s, i) => {
        const hybrid = s.id === 'hybrid'
        const note =
          s.id === 'murni'
            ? r.startingPoint
            : hybrid
              ? r.bestGain(gainPercent(s.rougeL, murniScore, lang))
              : r.gainFromMurni(gainPercent(s.rougeL, murniScore, lang))
        return (
          <article
            key={s.id}
            className={`score-card rv${hybrid ? ' is-best' : ''}`}
            style={{ animationDelay: `${350 + i * 70}ms` }}
          >
            <div className="score-card-head">
              <h3>{MODEL_LABEL[s.id]}</h3>
              <span>{r.pairsCount(formatInt(s.pairs, lang))}</span>
            </div>
            <div className="score-card-value">{formatDec(s.rougeL, lang, 4)}</div>
            <div className={`score-card-note${s.id === 'murni' ? '' : ' is-gain'}`}>{note}</div>
            {MODEL_HUB[s.id] !== '' && (
              <a className="score-card-link" href={MODEL_HUB[s.id]} target="_blank" rel="noopener noreferrer">
                {r.modelOnHub}
                <span className="sr-only"> {MODEL_LABEL[s.id]} {r.newTab}</span>
              </a>
            )}
          </article>
        )
      })}
      <article className="score-card is-baseline rv" style={{ animationDelay: `${350 + SCENARIOS.length * 70}ms` }}>
        <div className="score-card-head">
          <h3>{r.baselineName}</h3>
          <span>{r.noModel}</span>
        </div>
        <div className="score-card-value">{formatDec(BASELINE.rougeL, lang, 3)}</div>
        <div className="score-card-note">{r.baselineNote}</div>
      </article>
    </section>
  )
}
