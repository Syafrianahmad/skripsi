import { useEffect, useRef, useSyncExternalStore } from 'react'

export type Page = 'demo' | 'hasil'
export type Route = { page: Page; section?: string }

/**
 * Route format is `#/<page>[#<section>]`, so section anchors (`#/#temuan`)
 * never collide with page routes. Anything unknown falls back to the demo page.
 */
export function parseRoute(hash: string): Route {
  const [path = '', section] = hash.replace(/^#/, '').split('#')
  const page: Page = path === '/hasil' ? 'hasil' : 'demo'
  return section ? { page, section } : { page }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '')
  const route = parseRoute(hash)
  const previous = useRef<string | null>(null)

  useEffect(() => {
    const key = `${route.page}#${route.section ?? ''}`
    const target = route.section ? document.getElementById(route.section) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    // On navigation (not first load) move focus to the new view so screen readers announce it.
    // Targets carry tabIndex={-1}: the page <h1>, #temuan, #kurva.
    if (previous.current !== null && previous.current !== key) {
      ;(target ?? document.querySelector<HTMLElement>('h1'))?.focus({ preventScroll: true })
    }
    previous.current = key
  }, [route.page, route.section])

  return route
}
