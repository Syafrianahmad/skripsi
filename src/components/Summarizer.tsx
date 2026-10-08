import { useState } from 'react'
import { DOCS, FEATURED_IDS } from '../data/results.ts'
import type { ModelId } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import { pickRandomId } from '../lib/shuffle.ts'
import { ModelCard } from './ModelCard.tsx'

const FEATURED: readonly number[] = FEATURED_IDS
const ALL_IDS = DOCS.map((d) => d.id)
// strongest model first
const MODEL_ORDER: readonly ModelId[] = ['hybrid', 'gtrans', 'murni']

function ShuffleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" />
    </svg>
  )
}

export function Summarizer() {
  const { lang, t } = useLang()
  const [selectedId, setSelectedId] = useState<number>(FEATURED_IDS[0])
  const doc = DOCS.find((d) => d.id === selectedId)!

  return (
    <section className="tool rv" aria-label={t.demo.sectionLabel} style={{ animationDelay: '150ms' }}>
      <div className="picker" role="radiogroup" aria-labelledby="picker-label">
        <span id="picker-label" className="picker-label">
          {t.demo.pickStory}
        </span>
        {FEATURED_IDS.map((id) => {
          const d = DOCS.find((x) => x.id === id)!
          return (
            <label key={id} className="chip">
              <input
                type="radio"
                name="story"
                className="sr-only"
                checked={selectedId === id}
                onChange={() => setSelectedId(id)}
              />
              <span>{d.title}</span>
              <span className={`tag tag-${d.tag}`}>{t.demo.tags[d.tag]}</span>
            </label>
          )
        })}
        {!FEATURED.includes(selectedId) && (
          <span className="chip is-active">{t.demo.randomLabel(doc.id, doc.title)}</span>
        )}
        <button
          type="button"
          className="btn-dashed"
          onClick={() => setSelectedId(pickRandomId(ALL_IDS, selectedId, FEATURED))}
        >
          <ShuffleIcon />
          {t.demo.shuffle}
        </button>
      </div>

      <div className="tool-body">
        <div className="tool-col">
          <div>
            <div className="story-head">
              <h2>{t.demo.storyLabel}</h2>
              <span className="meta">
                {t.demo.storyMeta(doc.id, doc.words, doc.sentences)} · {t.demo.datasetSource}
              </span>
            </div>
            <p className="excerpt" lang="jv">
              {doc.excerpt}
            </p>
          </div>
          <div className="ref-box">
            <div className="ref-label">{t.demo.refLabel}</div>
            <p lang="jv">{doc.ref}</p>
            <p className="translation">
              {doc.tr ? (
                <>
                  <strong>{t.demo.translationLabel}</strong> {doc.tr[lang]}
                </>
              ) : (
                t.demo.noTranslation
              )}
            </p>
          </div>
        </div>

        <div className="tool-col tool-col-out" aria-live="polite">
          <h2>{t.demo.outputsTitle}</h2>
          {MODEL_ORDER.map((m) => (
            <ModelCard key={`${doc.id}-${m}`} model={m} out={doc.out[m]} primary={m === 'hybrid'} />
          ))}
          <p className="legend">
            <mark className="diff">{t.demo.highlightKey}</mark> {t.demo.highlightText}. {t.demo.savedNote}.
          </p>
        </div>
      </div>
    </section>
  )
}
