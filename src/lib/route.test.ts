import { afterEach, describe, expect, it, vi } from 'vitest'
import { goToSection, isSamePageClick, linkedStory, parseRoute, scrollTargetId, shortStoryId } from './route.ts'

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
    expect(parseRoute('#/demo#story=12')).toEqual({ page: 'demo', story: 12 })
  })

  it('ignores story values that are not a whole number', () => {
    expect(parseRoute('#/demo#story=abc')).toEqual({ page: 'demo', section: 'story=abc' })
    expect(parseRoute('#/demo#story=68.5')).toEqual({ page: 'demo', section: 'story=68.5' })
  })

  it('ignores story ids that are not positive', () => {
    expect(parseRoute('#/demo#story=0')).toEqual({ page: 'demo', section: 'story=0' })
  })

  it('ignores story ids with a leading zero', () => {
    expect(parseRoute('#/demo#story=007')).toEqual({ page: 'demo', section: 'story=007' })
  })

  it('reads numbers past the story count as ids; the demo page falls back to the known ones', () => {
    expect(parseRoute('#/demo#story=71')).toEqual({ page: 'demo', story: 71 })
    expect(parseRoute('#/demo#story=999')).toEqual({ page: 'demo', story: 999 })
  })

  it('ignores story ids too large to be a safe integer', () => {
    expect(parseRoute('#/demo#story=99999999999999999999')).toEqual({ page: 'demo', section: 'story=99999999999999999999' })
  })
})

describe('shortStoryId', () => {
  it('shows ids up to six digits as they are, cuts longer ones', () => {
    expect(shortStoryId(7)).toBe('7')
    expect(shortStoryId(999999)).toBe('999999')
    expect(shortStoryId(1000000)).toBe('999999+')
    expect(shortStoryId(Number.MAX_SAFE_INTEGER)).toBe('999999+')
  })
})

describe('linkedStory', () => {
  it('switches only when a story link names a different story', () => {
    expect(linkedStory(undefined, 12)).toBe(12)
    expect(linkedStory(12, 40)).toBe(40)
    expect(linkedStory(12, 12)).toBeUndefined()
  })

  it('leaves the choice alone when the route carries no story (nav to #/#temuan)', () => {
    expect(linkedStory(12, undefined)).toBeUndefined()
    expect(linkedStory(undefined, undefined)).toBeUndefined()
  })

  it('treats a story link pasted again after leaving it as a change', () => {
    // #/demo#story=12 -> #/#temuan -> #/demo#story=12
    const seen = [12, undefined, 12]
    expect(seen.slice(1).map((next, i) => linkedStory(seen[i], next))).toEqual([undefined, 12])
  })
})

describe('scrollTargetId', () => {
  it('prefers the section over a story link', () => {
    expect(scrollTargetId(parseRoute('#/#temuan'), true)).toBe('temuan')
  })

  it('brings the tool into view for a story link only after navigating', () => {
    expect(scrollTargetId(parseRoute('#/demo#story=40'), true)).toBe('alat')
    expect(scrollTargetId(parseRoute('#/demo#story=40'), false)).toBeUndefined()
    expect(scrollTargetId(parseRoute('#/'), true)).toBeUndefined()
  })
})

describe('isSamePageClick', () => {
  const plain = { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false }

  it('treats an empty location hash as the root route', () => {
    expect(isSamePageClick('#/', '', plain)).toBe(true)
    expect(isSamePageClick('#/', '#/', plain)).toBe(true)
    expect(isSamePageClick('#/hasil', '', plain)).toBe(false)
    expect(isSamePageClick('#/#temuan', '#/#temuan', plain)).toBe(true)
  })

  it('leaves modified and non-primary clicks to the browser', () => {
    expect(isSamePageClick('#/', '', { ...plain, ctrlKey: true })).toBe(false)
    expect(isSamePageClick('#/', '', { ...plain, metaKey: true })).toBe(false)
    expect(isSamePageClick('#/', '', { ...plain, shiftKey: true })).toBe(false)
    expect(isSamePageClick('#/', '', { ...plain, altKey: true })).toBe(false)
    expect(isSamePageClick('#/', '', { ...plain, button: 1 })).toBe(false)
  })
})

describe('goToSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('scrolls to and focuses the section, or scrolls to the top without one', () => {
    const section = { scrollIntoView: vi.fn(), focus: vi.fn() }
    const scrollTo = vi.fn()
    vi.stubGlobal('document', { getElementById: (id: string) => (id === 'temuan' ? section : null) })
    vi.stubGlobal('window', { scrollTo })

    goToSection('temuan')
    expect(section.scrollIntoView).toHaveBeenCalledOnce()
    expect(section.focus).toHaveBeenCalledWith()

    goToSection()
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
