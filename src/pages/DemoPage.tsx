import { useEffect } from 'react'
import { CaseSteps } from '../components/CaseSteps.tsx'
import { Findings } from '../components/Findings.tsx'
import { Hero } from '../components/Hero.tsx'
import { Masthead } from '../components/Masthead.tsx'
import { Summarizer } from '../components/Summarizer.tsx'
import { useLang } from '../i18n/useLang.ts'

export function DemoPage() {
  const { t } = useLang()

  useEffect(() => {
    document.title = t.meta.demoTitle
  }, [t.meta.demoTitle])

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
