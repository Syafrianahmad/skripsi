import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { CONFIG, DATASET, DOCS, FEATURED_IDS } from '../data/results.ts'
import type { Doc, Lang, ModelId, Part } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import { markAgainst, outputText, wordSet } from '../lib/compare.ts'
import { csvDownload, download, type ExportRow } from '../lib/export.ts'
import { FILTER_KEYS, type FilterKey, storyIds } from '../lib/findings.ts'
import { ModelCard } from './ModelCard.tsx'
import { MODEL_LABEL } from './models.ts'

// strongest model first
const MODEL_ORDER: readonly ModelId[] = ['hybrid', 'gtrans', 'murni']

// how long a status message stays in the live region before it is cleared
const MESSAGE_MS = 6000

type Compare = 'ref' | 'models'

type Seen = { id: number; filter: FilterKey | null; lang: Lang }

// a new object per announcement restarts the timer, even when the text repeats
type Status = { text: string }

type Props = {
  id: number
  filter: FilterKey | null
  onPick: (id: number) => void
  onFilter: (filter: FilterKey | null) => void
  onShuffle: () => void
}

function ShuffleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" />
    </svg>
  )
}

export function Summarizer({ id, filter, onPick, onFilter, onShuffle }: Props) {
  const { lang, t } = useLang()
  const [compare, setCompare] = useState<Compare>('ref')
  const [seen, setSeen] = useState<Seen>({ id, filter, lang })
  const [status, setStatus] = useState<Status>({ text: '' })
  const doc = DOCS.find((d) => d.id === id)!
  const matches = storyIds(filter)
  // the current story stays listed even when a featured chip picked it outside the filter
  const options = DOCS.filter((d) => d.id === doc.id || matches.includes(d.id))
  // the copy button reads "copied" only while that message is up, so the 6 s timer below resets it
  const copied = status.text === t.demo.linkCopied

  // Announce only what changed in the story or filter. A filter change that also moves the
  // story says both. A language switch clears the message instead of re-announcing it translated.
  // Compared against the last render, not an effect.
  if (seen.lang !== lang || seen.id !== id || seen.filter !== filter) {
    const count = seen.filter !== filter && filter ? t.demo.matchCount(matches.length, DOCS.length) : ''
    const story = seen.id !== id || !count ? t.demo.nowShowing(doc.id, doc.title) : ''
    setSeen({ id, filter, lang })
    if (seen.lang !== lang) setStatus({ text: '' })
    else setStatus({ text: [count, story].filter(Boolean).join('. ') })
  }

  useEffect(() => {
    if (!status.text) return
    const timer = window.setTimeout(() => setStatus({ text: '' }), MESSAGE_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  // a repeated text is not read again, so the region is blanked in a commit of its own first
  function announce(text: string) {
    flushSync(() => setStatus({ text: '' }))
    setStatus({ text })
  }

  function partsFor(d: Doc, m: ModelId): readonly Part[] {
    if (compare === 'ref') return d.out[m].parts
    const others = MODEL_ORDER.filter((x) => x !== m).map((x) => wordSet(outputText(d.out[x].parts)))
    return markAgainst(outputText(d.out[m].parts), others)
  }

  async function handleCopyLink() {
    const link = `${window.location.origin}${window.location.pathname}#/demo#story=${doc.id}`
    try {
      await navigator.clipboard.writeText(link)
      announce(t.demo.linkCopied)
    } catch {
      announce(t.demo.copyFailed)
    }
  }

  const rows: ExportRow[] = MODEL_ORDER.map((m) => ({
    doc: doc.id,
    model: m,
    rougeL: doc.out[m].rl,
    output: outputText(doc.out[m].parts),
  }))
  const handleDownloadCsv = () => download(`ringkas-jawa-${doc.id}.csv`, 'text/csv', csvDownload(rows))
  const handleDownloadJson = () => download(`ringkas-jawa-${doc.id}.json`, 'application/json', JSON.stringify(rows, null, 2))

  return (
    <section id="alat" className="tool rv" aria-label={t.demo.sectionLabel} tabIndex={-1} style={{ animationDelay: '150ms' }}>
      <div className="picker">
        <div className="picker-chips" role="radiogroup" aria-labelledby="picker-label">
          <span id="picker-label" className="picker-label">
            {t.demo.pickStory(CONFIG.testDocs)}
          </span>
          {FEATURED_IDS.map((fid) => {
            const d = DOCS.find((x) => x.id === fid)!
            return (
              <label key={fid} className="chip">
                <input
                  type="radio"
                  name="story"
                  className="sr-only"
                  checked={id === fid}
                  onChange={() => onPick(fid)}
                />
                <span lang="jv">{d.title}</span>
                <span className={`tag tag-${d.tag}`}>{t.demo.tags[d.tag]}</span>
              </label>
            )
          })}
        </div>
        <div className="picker-row" role="group">
          <label className="picker-other">
            <span className="picker-label">{t.demo.pickOther}</span>
            <select className="picker-select" value={doc.id} onChange={(e) => onPick(Number(e.target.value))}>
              {options.map((d) => (
                <option key={d.id} value={d.id} lang="jv">
                  {`#${d.id} · ${d.title}`}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn-dashed" onClick={onShuffle} disabled={matches.length < 2}>
            <ShuffleIcon />
            {t.demo.shuffle}
          </button>
        </div>
      </div>

      <div className="picker picker-filter">
        <label className="picker-other">
          <span className="picker-label">{t.demo.filterLabel}</span>
          <select
            className="picker-select"
            value={filter ?? ''}
            onChange={(e) => onFilter((e.target.value || null) as FilterKey | null)}
          >
            <option value="">{t.demo.filterAll}</option>
            {FILTER_KEYS.map((key) => {
              const [kind, model] = key.split(':') as [keyof typeof t.demo.filterKinds, ModelId]
              return (
                <option key={key} value={key}>
                  {`${t.demo.filterKinds[kind]} · ${MODEL_LABEL[model]}`}
                </option>
              )
            })}
          </select>
        </label>
        {filter && <span className="meta">{t.demo.matchCount(matches.length, DOCS.length)}</span>}
      </div>

      {/* one live region for copy and filter/story changes; it stays in the DOM so the first change is heard */}
      <span role="status" className="sr-only">{status.text}</span>

      <div className="tool-body">
        <div className="tool-col">
          <div>
            <div className="story-head">
              <h2>{t.demo.storyLabel}</h2>
              <span className="meta">
                {t.demo.storyMeta(doc.id, doc.words, doc.sentences)}
              </span>
            </div>
            <p className="excerpt" lang="jv">
              {doc.excerpt}
            </p>
            <p className="source-line">
              {t.demo.sourceLabel}{' '}
              <a href={DATASET.url} target="_blank" rel="noopener noreferrer">
                {DATASET.name}
              </a>{' '}
              ({DATASET.author}, Kaggle)
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
          <div className="actions">
            <button type="button" className="btn-dashed" onClick={handleCopyLink}>
              {copied ? t.demo.linkCopied : t.demo.copyLink}
            </button>
            <button type="button" className="btn-dashed" onClick={handleDownloadCsv}>
              {t.demo.downloadCsv}
            </button>
            <button type="button" className="btn-dashed" onClick={handleDownloadJson}>
              {t.demo.downloadJson}
            </button>
          </div>
        </div>

        <div className="tool-col tool-col-out">
          <div className="outputs-head">
            <h2>{t.demo.outputsTitle}</h2>
            <div className="segmented" role="group" aria-label={t.demo.compareLabel}>
              <button type="button" aria-pressed={compare === 'ref'} onClick={() => setCompare('ref')}>
                {t.demo.compareRef}
              </button>
              <button type="button" aria-pressed={compare === 'models'} onClick={() => setCompare('models')}>
                {t.demo.compareModels}
              </button>
            </div>
          </div>
          {MODEL_ORDER.map((m) => (
            <ModelCard
              key={`${doc.id}-${m}`}
              model={m}
              rl={doc.out[m].rl}
              parts={partsFor(doc, m)}
              primary={m === 'hybrid'}
            />
          ))}
          <p className="legend">
            <mark className="diff">{t.demo.highlightKey}</mark>{' '}
            {compare === 'ref' ? t.demo.highlightText : t.demo.highlightModelsText}. {t.demo.savedNote}.
            <span className="sr-only"> {t.demo.diffLegend}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
