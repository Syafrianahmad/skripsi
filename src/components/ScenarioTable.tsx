import { BASELINE, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { formatInt } from '../lib/format.ts'
import { MODEL_LABEL } from './models.ts'

const delta = (d: number) => (d === 0 ? '0' : `+${d.toFixed(4)}`)

export function ScenarioTable() {
  const { lang, t } = useLang()
  const s = t.results.scenarios

  return (
    <div className="table-wrap sr" role="region" aria-label={s.caption} tabIndex={0}>
      <table className="data-table wide">
        <caption>{s.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{s.scenario}</th>
            <th scope="col">{s.source}</th>
            <th scope="col" className="num">{s.pairs}</th>
            <th scope="col" className="num">ROUGE-1</th>
            <th scope="col" className="num">ROUGE-2</th>
            <th scope="col" className="num">{s.delta}</th>
            <th scope="col" className="num">ROUGE-L</th>
          </tr>
        </thead>
        <tbody>
          {SCENARIOS.map((sc) => (
            <tr key={sc.id} className={sc.id === 'hybrid' ? 'is-best' : undefined}>
              <th scope="row">{MODEL_LABEL[sc.id]}</th>
              <td>{s.sources[sc.id]}</td>
              <td className="num">{formatInt(sc.pairs, lang)}</td>
              <td className="num">{sc.rouge1.toFixed(4)}</td>
              <td className="num">{sc.rouge2.toFixed(4)}</td>
              <td className={`num${sc.deltaFromMurni === 0 ? ' muted' : ''}`}>{delta(sc.deltaFromMurni)}</td>
              <td className="num strong">{sc.rougeL.toFixed(4)}</td>
            </tr>
          ))}
          <tr className="is-baseline">
            <th scope="row">{t.results.baselineName}</th>
            <td>{s.sources.baseline}</td>
            <td className="num">0</td>
            <td className="num">-</td>
            <td className="num">-</td>
            <td className="num">{delta(BASELINE.deltaFromMurni)}</td>
            <td className="num strong">{BASELINE.rougeL.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
