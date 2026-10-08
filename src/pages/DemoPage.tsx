import { CaseSteps } from '../components/CaseSteps.tsx'
import { Findings } from '../components/Findings.tsx'
import { Hero } from '../components/Hero.tsx'
import { Masthead } from '../components/Masthead.tsx'
import { Summarizer } from '../components/Summarizer.tsx'

export function DemoPage() {
  return (
    <>
      <Masthead page="demo">
        <Hero />
      </Masthead>
      <main className="demo-main container">
        <Summarizer />
        <Findings />
        <CaseSteps />
      </main>
    </>
  )
}
