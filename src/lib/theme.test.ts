import { describe, expect, it } from 'vitest'
import { resolveTheme, systemPrefersDark } from './theme.ts'

describe('resolveTheme', () => {
  it('follows the system when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })

  it('lets a stored choice win over the system', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('ignores an unknown stored value', () => {
    expect(resolveTheme('sepia', false)).toBe('light')
    expect(resolveTheme('sepia', true)).toBe('dark')
  })
})

describe('systemPrefersDark', () => {
  it('is false when matchMedia is unavailable', () => {
    expect(systemPrefersDark()).toBe(false)
  })
})
