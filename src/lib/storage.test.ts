import { afterEach, describe, expect, it, vi } from 'vitest'
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

// Private mode or blocked site data: the property exists but every call throws.
describe('storage with a throwing localStorage', () => {
  const blocked = {
    getItem() {
      throw new Error('blocked')
    },
    setItem() {
      throw new Error('blocked')
    },
  }

  afterEach(() => vi.unstubAllGlobals())

  it('reads null instead of throwing', () => {
    vi.stubGlobal('localStorage', blocked)
    expect(readStored('theme')).toBeNull()
  })

  it('ignores writes instead of throwing', () => {
    vi.stubGlobal('localStorage', blocked)
    expect(() => writeStored('theme', 'dark')).not.toThrow()
  })
})

// The storage layer does not validate: it returns what is stored and callers (resolveTheme) reject bad values.
describe('storage with unexpected values', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns null for a missing key', () => {
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} })
    expect(readStored('theme')).toBeNull()
  })

  it('returns an invalid stored value unchanged', () => {
    vi.stubGlobal('localStorage', { getItem: () => 'sepia', setItem: () => {} })
    expect(readStored('theme')).toBe('sepia')
  })
})
