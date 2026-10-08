import { Masthead } from '../components/Masthead.tsx'
import { useLang } from '../i18n/useLang.ts'

// Score cards, charts, and tables arrive in a later task.
export function ResultsPage() {
  const { t } = useLang()

  return (
    <>
      <Masthead page="hasil">
        <section className="masthead-body container">
          <h1>{t.nav.results}</h1>
        </section>
      </Masthead>
      <main className="container" />
    </>
  )
}
