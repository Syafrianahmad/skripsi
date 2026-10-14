import { MODEL_IDS, NGRAM_NEW } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { formatDec } from '../lib/format.ts'
import { MODEL_LABEL } from './models.ts'

export function NgramTable() {
  const { lang, t } = useLang()
  const pct = (v: number) => `${formatDec(v, lang, 1)}%`

  return (
    <div className="table-wrap" role="region" aria-label={t.results.scrollRegion(t.results.abstractive.caption)} tabIndex={0}>
      <table className="data-table">
        <caption>{t.results.abstractive.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.results.scenarios.scenario}</th>
            <th scope="col" className="num">1-gram</th>
            <th scope="col" className="num">2-gram</th>
            <th scope="col" className="num">3-gram</th>
          </tr>
        </thead>
        <tbody>
          {MODEL_IDS.map((m) => (
            <tr key={m}>
              <th scope="row">{MODEL_LABEL[m]}</th>
              <td className="num">{pct(NGRAM_NEW[m].oneGram)}</td>
              <td className="num">{pct(NGRAM_NEW[m].twoGram)}</td>
              <td className="num">{pct(NGRAM_NEW[m].threeGram)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
