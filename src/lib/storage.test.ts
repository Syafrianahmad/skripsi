import { describe, expect, it } from 'vitest'
import { readStored, writeStored } from './storage.ts'

// The test environment has no localStorage, which is exactly the "storage unavailable" case.
describe('storage without localStorage', () => {
  it('reads null instead of throwing', () => {
    expect(readStored('lang')).toBeNull()
  })

  it('ignores writes instead of throwing', () => {
    expect(() => writeStored('lang', 'id')).not.toThrow()
  })
})
