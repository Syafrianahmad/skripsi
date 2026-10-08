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
