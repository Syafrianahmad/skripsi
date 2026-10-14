import type { ReactNode } from 'react'
import { BASELINE, CONFIG, DOCS, FINDINGS, NGRAM_NEW, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { outputText } from '../lib/compare.ts'
import type { FilterKey } from '../lib/findings.ts'
import { formatDec } from '../lib/format.ts'
import { MODEL_LABEL } from './models.ts'

const hybridScore = SCENARIOS.find((s) => s.id === 'hybrid')!.rougeL
// first three words of the real Hybrid output for story #69
const AKU_OPENING = outputText(DOCS.find((d) => d.id === 69)!.out.hybrid.parts).split(/\s+/).slice(0, 3).join(' ')

type Props = { onShow: (filter: FilterKey) => void }

/** A count on a Temuan card that filters the Demo to the stories it counts. */
function StatButton({ filter, onShow, children }: { filter: FilterKey; onShow: Props['onShow']; children: ReactNode }) {
  return (
    <button type="button" className="stat-link" aria-describedby="findings-hint" onClick={() => onShow(filter)}>
      {children}
    </button>
  )
}

export function Findings({ onShow }: Props) {
  const { lang, t } = useLang()
  const total = CONFIG.testDocs

  return (
    <section id="temuan" className="findings" aria-labelledby="temuan-judul" tabIndex={-1}>
      <h2 id="temuan-judul" className="section-title sr">{t.findings.title}</h2>
      <p className="findings-hint" id="findings-hint">{t.findings.showHint}</p>
      <div className="finding-grid">
        <article className="finding sr">
          <div className="finding-key">&lt;extra_id_0&gt;</div>
          <h3>{t.findings.extraIdTitle}</h3>
          <p>{t.findings.extraIdBody}</p>
          <div className="finding-stats">
            <StatButton filter="extraId:murni" onShow={onShow}>
              <strong>{FINDINGS.extraIdToken.murni}</strong>/{total} {MODEL_LABEL.murni}
            </StatButton>
            <StatButton filter="extraId:gtrans" onShow={onShow}>
              <strong>{FINDINGS.extraIdToken.gtrans}</strong>/{total} {MODEL_LABEL.gtrans}
            </StatButton>
          </div>
        </article>

        <article className="finding sr">
          <div className="finding-key" lang="jv">
            {AKU_OPENING}
          </div>
          <h3>{t.findings.akuTitle}</h3>
          <p>{t.findings.akuBody}</p>
          <div className="finding-stats">
            <StatButton filter="aku:hybrid" onShow={onShow}>
              <strong>{FINDINGS.akuOpening.hybrid}</strong>/{total} {t.findings.akuMark}
            </StatButton>
            <StatButton filter="quote:hybrid" onShow={onShow}>
              <strong>{FINDINGS.akuOpening.quoted}</strong>/{total} {t.findings.quoteMark}
            </StatButton>
          </div>
        </article>

        <article className="finding sr">
          <div className="finding-key">{t.findings.noveltyKey}</div>
          <h3>{t.findings.noveltyTitle}</h3>
          <p>{t.findings.noveltyBody}</p>
          <div className="finding-stats">
            <span>
              <strong>{formatDec(NGRAM_NEW.murni.oneGram, lang, 1)}%</strong> {MODEL_LABEL.murni}
            </span>
            <span>
              <strong>{formatDec(NGRAM_NEW.gtrans.oneGram, lang, 1)}%</strong> {MODEL_LABEL.gtrans}
            </span>
            <span>
              <strong>{formatDec(NGRAM_NEW.hybrid.oneGram, lang, 1)}%</strong> {MODEL_LABEL.hybrid}
            </span>
          </div>
        </article>

        <article className="finding finding-strong sr">
          <div className="finding-key">{t.findings.shortLead2Key}</div>
          <h3>{t.findings.shortLead2Title}</h3>
          <p>{t.findings.shortLead2Body}</p>
          <div className="finding-stats">
            <StatButton filter="low:murni" onShow={onShow}>
              <strong>{FINDINGS.shortLead2.murni}</strong> {MODEL_LABEL.murni}
            </StatButton>
            <StatButton filter="low:gtrans" onShow={onShow}>
              <strong>{FINDINGS.shortLead2.gtrans}</strong> {MODEL_LABEL.gtrans}
            </StatButton>
            <StatButton filter="low:hybrid" onShow={onShow}>
              <strong>{FINDINGS.shortLead2.hybrid}</strong> {MODEL_LABEL.hybrid}
            </StatButton>
          </div>
          <div className="finding-meta">{t.findings.shortLead2Meta}</div>
        </article>
      </div>

      <div className="baseline sr">
        <div className="baseline-score">
          {formatDec(BASELINE.rougeL, lang, 3)} &gt; {formatDec(hybridScore, lang, 4)}
          <small>{t.findings.baselineCaption}</small>
        </div>
        <p>{t.findings.baselineBody}</p>
      </div>
    </section>
  )
}
