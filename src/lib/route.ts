import { useEffect, useSyncExternalStore } from 'react'

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

  useEffect(() => {
    const el = route.section ? document.getElementById(route.section) : null
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [route.page, route.section])

  return route
}
