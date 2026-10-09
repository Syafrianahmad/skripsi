import { describe, expect, it } from 'vitest'
import { detectLang, resolveLang } from './lang.ts'

describe('detectLang', () => {
  it('maps Indonesian locales to id', () => {
    expect(detectLang(['id-ID', 'en'])).toBe('id')
    expect(detectLang(['ID'])).toBe('id')
  })

  it('maps English locales to en', () => {
    expect(detectLang(['en-US'])).toBe('en')
  })

  it('falls back to en for unsupported, empty, or missing languages', () => {
    expect(detectLang(['jv'])).toBe('en')
    expect(detectLang([])).toBe('en')
    expect(detectLang(undefined)).toBe('en')
  })

  it('takes the first supported language in preference order', () => {
    expect(detectLang(['fr', 'id'])).toBe('id')
    expect(detectLang(['fr', 'en', 'id'])).toBe('en')
  })
})

describe('resolveLang', () => {
  it('prefers a valid stored choice over the browser language', () => {
    expect(resolveLang('en', ['id-ID'])).toBe('en')
    expect(resolveLang('id', ['en-US'])).toBe('id')
  })

  it('ignores an invalid stored value', () => {
    expect(resolveLang('xx', ['id'])).toBe('id')
    expect(resolveLang(null, ['id'])).toBe('id')
  })
})
