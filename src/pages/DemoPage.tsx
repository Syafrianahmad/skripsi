import { Masthead } from '../components/Masthead.tsx'
import { useLang } from '../i18n/useLang.ts'

// Hero, summarizer, findings, and case steps arrive in the next task.
export function DemoPage() {
  const { t } = useLang()

  return (
    <>
      <Masthead page="demo">
        <section className="masthead-body container">
          <h1>{t.hero.h1}</h1>
        </section>
      </Masthead>
      <main className="container" />
    </>
  )
}
