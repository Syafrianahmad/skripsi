export type Lang = 'id' | 'en'

export type ModelId = 'murni' | 'gtrans' | 'hybrid'

/** A span of model output. `d` is 1 when it differs from the lead-2 reference (highlighted in the UI). */
export type Part = { t: string; d: 0 | 1 }

export type Doc = {
  id: number
  title: string
  tag: 'best' | 'mid' | 'worst' | 'rand'
  words: number
  sentences: number
  excerpt: string
  ref: string
  out: Record<ModelId, { rl: number; parts: Part[] }>
  /** Helper translation of the reference (AI, unverified). Only the featured stories have one. */
  tr?: Record<Lang, string>
}
