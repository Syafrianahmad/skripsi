// Numbers below are copied verbatim from the thesis notebook / docs/design/Hasil.dc.html.
// Do not round or "fix" them; report discrepancies instead.
import docs from './docs.json'
import type { Doc, ModelId } from './types.ts'

export const DOCS = docs as Doc[]

/** Where the stories come from. The uploader states no license ("Unknown" on Kaggle), so credit it and show excerpts only. */
export const DATASET = {
  name: 'GPT2 Javanese Dataset',
  author: 'Lutfi Andriyanto',
  url: 'https://www.kaggle.com/datasets/lutfiandri/gpt2-javanese-dataset',
}

/** Test stories shown as chips: best, best, mid, mid, worst. */
export const FEATURED_IDS = [68, 40, 69, 60, 50] as const

export const MODEL_IDS: readonly ModelId[] = ['murni', 'gtrans', 'hybrid']

export type Scenario = {
  id: ModelId
  pairs: number
  rouge1: number
  rouge2: number
  rougeL: number
  deltaFromMurni: number
}

export const SCENARIOS: readonly Scenario[] = [
  { id: 'murni', pairs: 633, rouge1: 0.4035, rouge2: 0.3662, rougeL: 0.3978, deltaFromMurni: 0 },
  { id: 'gtrans', pairs: 1000, rouge1: 0.6457, rouge2: 0.6188, rougeL: 0.6437, deltaFromMurni: 0.2459 },
  { id: 'hybrid', pairs: 1633, rouge1: 0.8029, rouge2: 0.7745, rougeL: 0.7976, deltaFromMurni: 0.3998 },
]

/** Lead-2 (first two sentences), no model. Beats every model on its own proxy reference. */
export const BASELINE = { rougeL: 0.867, deltaFromMurni: 0.4692 }

/** Validation scores at the end of each epoch (1..8). */
export const EPOCH_ROUGE: Record<ModelId, readonly number[]> = {
  murni: [0.0278, 0.0472, 0.1097, 0.1936, 0.2617, 0.393, 0.4058, 0.428],
  gtrans: [0.0414, 0.2696, 0.5629, 0.6029, 0.6313, 0.6605, 0.6555, 0.6744],
  hybrid: [0.2078, 0.621, 0.7077, 0.74, 0.7784, 0.8257, 0.847, 0.8521],
}

export const EPOCH_LOSS: Record<ModelId, readonly number[]> = {
  murni: [6.881, 2.811, 0.944, 0.646, 0.564, 0.487, 0.456, 0.445],
  gtrans: [2.918, 0.764, 0.536, 0.454, 0.401, 0.369, 0.351, 0.343],
  hybrid: [0.788, 0.419, 0.297, 0.249, 0.22, 0.209, 0.204, 0.198],
}

export const VALIDATION_DOCS: Record<ModelId, number> = { murni: 64, gtrans: 100, hybrid: 164 }

export const TRAIN_MINUTES: Record<ModelId, number> = { murni: 36, gtrans: 51, hybrid: 70 }

/** Percent of output n-grams absent from the source story, averaged over 70 documents. */
export const NGRAM_NEW: Record<ModelId, { oneGram: number; twoGram: number; threeGram: number }> = {
  murni: { oneGram: 0.9, twoGram: 2.3, threeGram: 5.7 },
  gtrans: { oneGram: 1.5, twoGram: 2.7, threeGram: 4.1 },
  hybrid: { oneGram: 3.0, twoGram: 6.0, threeGram: 7.8 },
}

/** Counts out of 70 test documents, behind the "Temuan" cards. */
export const FINDINGS = {
  extraIdToken: { murni: 70, gtrans: 67 },
  akuOpening: { hybrid: 50, quoted: 17 },
  shortLead2: { murni: 36, gtrans: 16, hybrid: 9 },
}

export const CONFIG = {
  model: 'google/mt5-small',
  epochs: 8,
  earlyStoppingPatience: 2,
  trainSplitPercent: 90,
  testDocs: 70,
  maxInputTokens: 384,
  maxOutputTokens: 128,
  prefix: 'ringkas: ',
  learningRate: '1e-4',
  batchSize: 1,
  gradientAccumulation: 16,
  beams: 4,
  noRepeatNgram: 3,
  hardware: 'Google Colab, GPU T4',
  precision: 'fp32',
}
