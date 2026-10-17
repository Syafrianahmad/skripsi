import { useEffect, useState } from 'react'
import { CaseSteps } from '../components/CaseSteps.tsx'
import { Findings } from '../components/Findings.tsx'
import { Hero } from '../components/Hero.tsx'
import { Masthead } from '../components/Masthead.tsx'
import { Summarizer } from '../components/Summarizer.tsx'
import { DOCS, FEATURED_IDS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { type FilterKey, storyIds } from '../lib/findings.ts'
import { goToSection, linkedStory, shortStoryId } from '../lib/route.ts'
import { nextStoryId } from '../lib/shuffle.ts'

const isKnown = (id: number) => DOCS.some((d) => d.id === id)

/** A shared link (`#/demo#story=N`) opens that story; anything else starts at the first featured one. */
function startingId(story: number | undefined): number {
  return story !== undefined && isKnown(story) ? story : FEATURED_IDS[0]
}

/** The id from a link that names no story. The page shows the first featured story instead and says so. */
function missingId(story: number | undefined): number | undefined {
  return story !== undefined && !isKnown(story) ? story : undefined
}

/** `story` comes from the route. Each new story link switches to it (an unknown id falls back to the first featured story); the Summarizer is remounted (`gen`) so its compare mode and filter reset too. `missing` is the unknown id the notice names, cleared once the reader picks a story themselves. */
export function DemoPage({ story }: { story: number | undefined }) {
  const { t } = useLang()
  const [sel, setSel] = useState(() => ({
    id: startingId(story),
    filter: null as FilterKey | null,
    gen: 0,
    missing: missingId(story),
  }))
  const [prevStory, setPrevStory] = useState(story)

  // adjust state while rendering, compared against the previous prop (no effect, no extra pass)
  if (story !== prevStory) {
    setPrevStory(story)
    const linked = linkedStory(prevStory, story)
    if (linked !== undefined) {
      setSel({ id: startingId(linked), filter: null, gen: sel.gen + 1, missing: missingId(linked) })
    }
  }

  useEffect(() => {
    document.title = t.meta.demoTitle
  }, [t.meta.demoTitle])

  function handlePick(id: number) {
    setSel((s) => ({ ...s, id, missing: undefined }))
  }

  // keep the current story when it still matches; otherwise move to the first match
  function handleFilter(filter: FilterKey | null) {
    const ids = storyIds(filter)
    const id = ids.includes(sel.id) ? sel.id : ids[0]
    setSel((s) => ({ ...s, id, filter, missing: undefined }))
  }

  function handleShuffle() {
    handlePick(nextStoryId(sel.id, sel.filter, Math.random))
  }

  // from a Temuan stat: apply the filter and bring the summarizer into view
  function handleShowStories(filter: FilterKey) {
    handleFilter(filter)
    goToSection('alat')
  }

  // always rendered, empty when there is nothing to say, so the live region already exists when text arrives
  const notice = sel.missing === undefined ? '' : t.demo.storyNotFound(shortStoryId(sel.missing), sel.id)

  return (
    <>
      <Masthead page="demo">
        <Hero />
      </Masthead>
      <main id="main" tabIndex={-1} className="demo-main container">
        <p role="status" className="story-notice">{notice}</p>
        <Summarizer
          key={sel.gen}
          id={sel.id}
          filter={sel.filter}
          onPick={handlePick}
          onFilter={handleFilter}
          onShuffle={handleShuffle}
        />
        <Findings onShow={handleShowStories} />
        <CaseSteps />
      </main>
    </>
  )
}
