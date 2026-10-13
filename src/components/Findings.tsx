import type { ReactNode } from 'react'
import { BASELINE, CONFIG, FINDINGS, NGRAM_NEW, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import type { FilterKey } from '../lib/findings.ts'

const hybridScore = SCENARIOS.find((s) => s.id === 'hybrid')!.rougeL

type Props = { onShow: (filter: FilterKey) => void }

/** A count on a Temuan card that filters the Demo to the stories it counts. */
function StatButton({ filter, onShow, children }: { filter: FilterKey; onShow: Props['onShow']; children: ReactNode }) {
  return (
    <button type="button" className="stat-link" onClick={() => onShow(filter)}>
      {children}
    </button>
  )
}

export function Findings({ onShow }: Props) {
  const { t } = useLang()
  const total = CONFIG.testDocs

  return (
    <section id="temuan" className="findings" tabIndex={-1}>
      <h2 className="section-title sr">{t.findings.title}</h2>
      <p className="findings-hint">{t.findings.showHint}</p>
      <div className="finding-grid">
        <article className="finding sr">
          <div className="finding-key">&lt;extra_id_0&gt;</div>
          <h3>{t.findings.extraIdTitle}</h3>
          <p>{t.findings.extraIdBody}</p>
          <div className="finding-stats">
            <StatButton filter="extraId:murni" onShow={onShow}>
              <strong>{FINDINGS.extraIdToken.murni}</strong>/{total} Murni
            </StatButton>
            <StatButton filter="extraId:gtrans" onShow={onShow}>
              <strong>{FINDINGS.extraIdToken.gtrans}</strong>/{total} GTrans
            </StatButton>
          </div>
        </article>

        <article className="finding sr">
          {/* real Hybrid output for story #69 */}
          <div className="finding-key" lang="jv">
            AkuCIL LAN MERAK
          </div>
          <h3>{t.findings.akuTitle}</h3>
          <p>{t.findings.akuBody}</p>
          <div className="finding-stats">
            <StatButton filter="aku:hybrid" onShow={onShow}>
              <strong>{FINDINGS.akuOpening.hybrid}</strong>/{total} "Aku"
            </StatButton>
            <StatButton filter="quote:hybrid" onShow={onShow}>
              <strong>{FINDINGS.akuOpening.quoted}</strong>/{total} {t.findings.quoteMark}
            </StatButton>
          </div>
        </article>

        <article className="finding sr">
          <div className="finding-key">novel 1-gram</div>
          <h3>{t.findings.noveltyTitle}</h3>
          <p>{t.findings.noveltyBody}</p>
          <div className="finding-stats">
            <span>
              <strong>{NGRAM_NEW.murni.oneGram.toFixed(1)}%</strong> Murni
            </span>
            <span>
              <strong>{NGRAM_NEW.gtrans.oneGram.toFixed(1)}%</strong> GTrans
            </span>
            <span>
              <strong>{NGRAM_NEW.hybrid.oneGram.toFixed(1)}%</strong> Hybrid
            </span>
          </div>
        </article>

        <article className="finding finding-strong sr">
          <div className="finding-key">lead-2 &lt; 20 char</div>
          <h3>{t.findings.shortLead2Title}</h3>
          <p>{t.findings.shortLead2Body}</p>
          <div className="finding-stats">
            <StatButton filter="low:murni" onShow={onShow}>
              <strong>{FINDINGS.shortLead2.murni}</strong> Murni
            </StatButton>
            <StatButton filter="low:gtrans" onShow={onShow}>
              <strong>{FINDINGS.shortLead2.gtrans}</strong> GTrans
            </StatButton>
            <StatButton filter="low:hybrid" onShow={onShow}>
              <strong>{FINDINGS.shortLead2.hybrid}</strong> Hybrid
            </StatButton>
          </div>
          <div className="finding-meta">{t.findings.shortLead2Meta}</div>
        </article>
      </div>

      <div className="baseline sr">
        <div className="baseline-score">
          {BASELINE.rougeL.toFixed(3)} &gt; {hybridScore.toFixed(4)}
          <small>{t.findings.baselineCaption}</small>
        </div>
        <p>{t.findings.baselineBody}</p>
      </div>
    </section>
  )
}
