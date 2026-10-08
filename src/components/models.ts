import type { ModelId } from '../data/types.ts'

// Proper nouns for the three training scenarios, not translated.
export const MODEL_LABEL: Record<ModelId, string> = { murni: 'Murni', gtrans: 'GTrans', hybrid: 'Hybrid' }

export const MODEL_COLOR: Record<ModelId, string> = {
  murni: '#94a3b8',
  gtrans: '#64748b',
  hybrid: 'var(--primary)',
}
