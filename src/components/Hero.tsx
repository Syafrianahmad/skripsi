import { useState } from 'react'
import { BASELINE, CONFIG, DOCS, NGRAM_NEW, SCENARIOS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { formatDec } from '../lib/format.ts'
import { countWords, splitSentences } from '../lib/words.ts'

const HERO_DOC = DOCS.find((d) => d.id === 68)!
const SENTENCES = splitSentences(HERO_DOC.excerpt)
const KEPT = splitSentences(HERO_DOC.ref).length
const WORDS_BEFORE = countWords(HERO_DOC.excerpt)
const WORDS_AFTER = countWords(HERO_DOC.ref)

// "ringkesan" in Javanese script, one glyph cluster per reveal step
const AKSARA = ['ꦫꦶꦁ', 'ꦏꦼ', 'ꦱ', 'ꦤ꧀']

const hybridScore = SCENARIOS.find((s) => s.id === 'hybrid')!.rougeL

function ReplayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export function Hero() {
  const { lang, t } = useLang()
  const [round, setRound] = useState(0)

  const stats = [
    { value: formatDec(hybridScore, lang, 4), label: t.hero.statBest },
    { value: formatDec(BASELINE.rougeL, lang, 3), label: t.hero.statBaseline, accent: true },
    { value: `${Math.floor(100 - NGRAM_NEW.hybrid.oneGram)}%+`, label: t.hero.statCopied },
    { value: String(CONFIG.testDocs), label: t.hero.statDocs },
  ]

  return (
    <section className="masthead-body hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="aksara" role="img" aria-label={t.hero.aksaraLabel}>
          {AKSARA.map((g, i) => (
            <span
              key={g}
              lang="jv"
              className="glyph"
              style={{ animationDelay: `${(i + 1) * 100}ms`, color: i === AKSARA.length - 1 ? 'var(--accent-soft)' : undefined }}
            >
              {g}
            </span>
          ))}
        </div>
        <h1 id="hero-title" className="rv" tabIndex={-1}>
          {t.hero.h1}
        </h1>
        <p className="hero-sub rv" style={{ animationDelay: '100ms' }}>
          {t.hero.sub}
        </p>
        <p className="hero-stack rv" style={{ animationDelay: '150ms' }}>
          {t.hero.stack}
        </p>
        <dl className="hero-stats">
          {stats.map((s, i) => (
            <div key={s.label} className="rv" style={{ animationDelay: `${200 + i * 60}ms` }}>
              <dt>{s.label}</dt>
              <dd style={s.accent ? { color: 'var(--accent-soft)' } : undefined}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="hero-card rv" style={{ animationDelay: '300ms' }} aria-labelledby="hero-caption">
        <div className="hero-card-head">
          <span id="hero-caption">{t.hero.caption(HERO_DOC.id, SENTENCES.length, CONFIG.testDocs)}</span>
          <button type="button" className="btn-ghost" onClick={() => setRound((r) => r + 1)}>
            <ReplayIcon />
            {t.hero.replay}
          </button>
        </div>
        {/* the key restarts the cut animation on replay */}
        <div key={round}>
          <p className="hero-text" lang="jv">
            {SENTENCES.map((s, i) => (
              <span key={s}>
                {i < KEPT ? (
                  <span className="keep">{s}</span>
                ) : (
                  <del className="cut" style={{ animationDelay: `${400 + (i - KEPT) * 100}ms` }}>
                    {s}
                  </del>
                )}{' '}
              </span>
            ))}
          </p>
          <div className="hero-card-foot">
            <div className="rv" style={{ animationDelay: '1000ms' }}>
              <span className="hero-shrink">
                {WORDS_BEFORE} → {WORDS_AFTER}
              </span>{' '}
              {t.hero.words}
            </div>
            <div className="rv" style={{ animationDelay: '1100ms' }}>
              {t.hero.note}
            </div>
          </div>
        </div>
      </figure>
    </section>
  )
}
