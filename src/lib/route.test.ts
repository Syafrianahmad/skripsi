import { describe, expect, it } from 'vitest'
import { parseRoute } from './route.ts'

describe('parseRoute', () => {
  it('falls back to the demo page for empty or unknown hashes', () => {
    expect(parseRoute('')).toEqual({ page: 'demo' })
    expect(parseRoute('#/')).toEqual({ page: 'demo' })
    expect(parseRoute('#/zzz')).toEqual({ page: 'demo' })
    expect(parseRoute('#temuan')).toEqual({ page: 'demo' })
  })

  it('opens the results page', () => {
    expect(parseRoute('#/hasil')).toEqual({ page: 'hasil' })
  })

  it('reads a section after a second hash', () => {
    expect(parseRoute('#/#temuan')).toEqual({ page: 'demo', section: 'temuan' })
    expect(parseRoute('#/hasil#kurva')).toEqual({ page: 'hasil', section: 'kurva' })
  })
})

describe('parseRoute story links', () => {
  it('reads a story id from #/demo#story=N', () => {
    expect(parseRoute('#/demo#story=68')).toEqual({ page: 'demo', story: 68 })
    expect(parseRoute('#/#story=7')).toEqual({ page: 'demo', story: 7 })
  })

  it('ignores story values that are not a whole number', () => {
    expect(parseRoute('#/demo#story=abc')).toEqual({ page: 'demo', section: 'story=abc' })
  })
})
