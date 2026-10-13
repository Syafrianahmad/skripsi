import { useEffect, useState } from 'react'
import { CaseSteps } from '../components/CaseSteps.tsx'
import { Findings } from '../components/Findings.tsx'
import { Hero } from '../components/Hero.tsx'
import { Masthead } from '../components/Masthead.tsx'
import { Summarizer } from '../components/Summarizer.tsx'
import { DOCS, FEATURED_IDS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { type FilterKey, storyIds } from '../lib/findings.ts'
import { parseRoute } from '../lib/route.ts'
import { pickRandomId } from '../lib/shuffle.ts'

const FEATURED: readonly number[] = FEATURED_IDS

/** A shared link (`#/demo#story=N`) opens that story; anything else starts at the first featured one. */
function startingId(): number {
  const { story } = parseRoute(window.location.hash)
  return story !== undefined && DOCS.some((d) => d.id === story) ? story : FEATURED[0]
}

export function DemoPage() {
  const { t } = useLang()
  const [sel, setSel] = useState(() => ({ id: startingId(), filter: null as FilterKey | null }))

  useEffect(() => {
    document.title = t.meta.demoTitle
  }, [t.meta.demoTitle])

  // replaceState keeps the permalink current without a hashchange (no scroll, no history entry)
  function syncLink(id: number) {
    window.history.replaceState(null, '', `#/demo#story=${id}`)
  }

  function pick(id: number) {
    setSel((s) => ({ ...s, id }))
    syncLink(id)
  }

  // keep the current story when it still matches; otherwise move to the first match
  function filterBy(filter: FilterKey | null) {
    const ids = storyIds(filter)
    const id = ids.includes(sel.id) ? sel.id : ids[0]
    setSel({ id, filter })
    syncLink(id)
  }

  function shuffle() {
    pick(pickRandomId(storyIds(sel.filter), sel.id, sel.filter ? [] : FEATURED))
  }

  // from a Temuan stat: apply the filter and bring the summarizer into view
  function showStories(filter: FilterKey) {
    filterBy(filter)
    const tool = document.getElementById('alat')
    tool?.scrollIntoView()
    tool?.focus({ preventScroll: true })
  }

  return (
    <>
      <Masthead page="demo">
        <Hero />
      </Masthead>
      <main className="demo-main container">
        <Summarizer
          id={sel.id}
          filter={sel.filter}
          onPick={pick}
          onFilter={filterBy}
          onShuffle={shuffle}
        />
        <Findings onShow={showStories} />
        <CaseSteps />
      </main>
    </>
  )
}
