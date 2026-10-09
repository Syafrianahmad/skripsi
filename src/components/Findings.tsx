import { BASELINE, CONFIG, FINDINGS, NGRAM_NEW, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'

const hybridScore = SCENARIOS.find((s) => s.id === 'hybrid')!.rougeL

export function Findings() {
  const { t } = useLang()
  const total = CONFIG.testDocs

  return (
    <section id="temuan" className="findings" tabIndex={-1}>
      <h2 className="section-title sr">{t.findings.title}</h2>
      <div className="finding-grid">
        <article className="finding sr">
          <div className="finding-key">&lt;extra_id_0&gt;</div>
          <h3>{t.findings.extraIdTitle}</h3>
          <p>{t.findings.extraIdBody}</p>
          <div className="finding-stats">
            <span>
              <strong>{FINDINGS.extraIdToken.murni}</strong>/{total} Murni
            </span>
            <span>
              <strong>{FINDINGS.extraIdToken.gtrans}</strong>/{total} GTrans
            </span>
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
            <span>
              <strong>{FINDINGS.akuOpening.hybrid}</strong>/{total} "Aku"
            </span>
            <span>
              <strong>{FINDINGS.akuOpening.quoted}</strong>/{total} {t.findings.quoteMark}
            </span>
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
            <span>
              <strong>{FINDINGS.shortLead2.murni}</strong> Murni
            </span>
            <span>
              <strong>{FINDINGS.shortLead2.gtrans}</strong> GTrans
            </span>
            <span>
              <strong>{FINDINGS.shortLead2.hybrid}</strong> Hybrid
            </span>
          </div>
          <div className="finding-meta">{t.findings.shortLead2Meta}</div>
        </article>
      </div>

      <div className="baseline sr">
        <div className="baseline-score">
          {BASELINE.rougeL.toFixed(3)} &gt; {hybridScore.toFixed(3)}
          <small>{t.findings.baselineCaption}</small>
        </div>
        <p>{t.findings.baselineBody}</p>
      </div>
    </section>
  )
}
