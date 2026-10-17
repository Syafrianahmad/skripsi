import { describe, expect, it } from 'vitest'
import { MODEL_HUB } from './links.ts'

describe('MODEL_HUB', () => {
  it('has a key for each of the three models', () => {
    expect(Object.keys(MODEL_HUB).sort()).toEqual(['gtrans', 'hybrid', 'murni'])
  })

  it('every filled URL points at huggingface.co (empty means no link is shown)', () => {
    for (const url of Object.values(MODEL_HUB)) {
      if (url !== '') expect(url).toMatch(/^https:\/\/huggingface\.co\//)
    }
  })
})
