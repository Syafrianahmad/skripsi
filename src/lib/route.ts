import { useEffect, useRef, useSyncExternalStore } from 'react'

export type Page = 'demo' | 'hasil'
export type Route = { page: Page; section?: string; story?: number }

/**
 * Route format is `#/<page>[#<section>]`, so section anchors (`#/#temuan`)
 * never collide with page routes. Anything unknown falls back to the demo page.
 * `#/demo#story=N` selects a story; only positive whole numbers without a leading zero count as N.
 */
export function parseRoute(hash: string): Route {
  const [path = '', section] = hash.replace(/^#/, '').split('#')
  const page: Page = path === '/hasil' ? 'hasil' : 'demo'
  const n = Number(/^story=([1-9]\d*)$/.exec(section ?? '')?.[1])
  if (Number.isSafeInteger(n)) return { page, story: n }
  return section ? { page, section } : { page }
}

/** Story id as shown in the notice. Ids over six digits are cut to `999999+` so a long hash stays short. */
export function shortStoryId(n: number): string {
  return n > 999999 ? '999999+' : String(n)
}

/** A story link switches stories only when it names a story other than the previous route did. A route without a story (nav to `#/#temuan`) leaves the choice alone. */
export function linkedStory(previous: number | undefined, next: number | undefined): number | undefined {
  return next !== undefined && next !== previous ? next : undefined
}

/** Element id to scroll to for a route. A story link has no section, so after navigating it brings the tool into view; on first load it stays at the top. */
export function scrollTargetId(route: Route, navigated: boolean): string | undefined {
  if (route.section) return route.section
  return navigated && route.story !== undefined ? 'alat' : undefined
}

type ClickKeys = Pick<MouseEvent, 'button' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'>

/** A plain click on a link to the page we are already on fires no hashchange. An empty location hash is the root `#/`. Modified or non-primary clicks stay with the browser (new tab). */
export function isSamePageClick(linkHash: string, locationHash: string, e: ClickKeys): boolean {
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return false
  return linkHash === (locationHash || '#/')
}

/** Scrolls to a section and focuses it, or scrolls to the top without one. Also used when a nav link points at the current hash (no hashchange fires). */
export function goToSection(section?: string) {
  const target = section ? document.getElementById(section) : null
  if (!target) {
    window.scrollTo(0, 0)
    return
  }
  target.scrollIntoView()
  target.focus()
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '')
  const route = parseRoute(hash)
  const previous = useRef<string | null>(null)

  const { page, section, story } = route

  useEffect(() => {
    const key = `${page}#${section ?? ''}#${story ?? ''}`
    const id = scrollTargetId({ page, section, story }, previous.current !== null)
    const target = id ? document.getElementById(id) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    // On navigation (not first load) move focus to the new view so screen readers announce it.
    // Targets carry tabIndex={-1}: the page <h1>, #temuan, #kurva.
    if (previous.current !== null && previous.current !== key) {
      ;(target ?? document.querySelector<HTMLElement>('h1'))?.focus({ preventScroll: true })
    }
    previous.current = key
  }, [page, section, story])

  return route
}
