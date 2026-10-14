import type { ModelId } from '../data/types.ts'

// Proper nouns for the three training scenarios, not translated.
export const MODEL_LABEL: Record<ModelId, string> = { murni: 'Murni', gtrans: 'GTrans', hybrid: 'Hybrid' }

export const MODEL_COLOR: Record<ModelId, string> = {
  murni: 'var(--series-murni)',
  gtrans: 'var(--series-gtrans)',
  hybrid: 'var(--primary)',
}

/** Line dash per series, so the three lines differ by pattern as well as colour. */
export const MODEL_DASH: Record<ModelId, string | undefined> = { murni: '6 5', gtrans: '2 3', hybrid: undefined }

/** Marker shape per series, so the points differ by shape as well as colour. */
export const MODEL_SHAPE: Record<ModelId, 'circle' | 'square' | 'triangle'> = {
  murni: 'circle',
  gtrans: 'square',
  hybrid: 'triangle',
}
