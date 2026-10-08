import { CONFIG } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'

export function ConfigList() {
  const { t } = useLang()
  const c = t.results.config

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: c.model, value: CONFIG.model, mono: true },
    { label: c.epochs, value: c.epochsValue(CONFIG.epochs, CONFIG.earlyStoppingPatience) },
    { label: c.split, value: c.splitValue(CONFIG.trainSplitPercent) },
    { label: c.test, value: c.testValue(CONFIG.testDocs) },
    { label: c.reference, value: c.referenceValue },
    { label: c.io, value: c.ioValue(CONFIG.maxInputTokens, CONFIG.maxOutputTokens, CONFIG.prefix) },
    { label: c.optimizer, value: c.optimizerValue(CONFIG.learningRate, CONFIG.batchSize, CONFIG.gradientAccumulation) },
    { label: c.decoding, value: c.decodingValue(CONFIG.beams, CONFIG.noRepeatNgram) },
    { label: c.hardware, value: `${CONFIG.hardware}, ${CONFIG.precision}` },
    { label: c.metrics, value: 'ROUGE-1, ROUGE-2, ROUGE-L' },
  ]

  return (
    <div className="side-card">
      <h2>{c.title}</h2>
      <dl className="config-list">
        {rows.map((r) => (
          <div key={r.label} className="config-row">
            <dt>{r.label}</dt>
            <dd className={r.mono ? 'mono' : undefined}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
