import { useEffect } from 'react'
import { ConfigList } from '../components/ConfigList.tsx'
import { DistributionChart } from '../components/DistributionChart.tsx'
import { CurveChart } from '../components/CurveChart.tsx'
import { Masthead } from '../components/Masthead.tsx'
import { NgramTable } from '../components/NgramTable.tsx'
import { ScenarioTable } from '../components/ScenarioTable.tsx'
import { ScoreCards } from '../components/ScoreCards.tsx'
import { TrainingChart } from '../components/TrainingChart.tsx'
import { BASELINE, CONFIG, FINDINGS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'
import { formatDec } from '../lib/format.ts'

export function ResultsPage() {
  const { lang, t } = useLang()
  const r = t.results

  useEffect(() => {
    document.title = t.meta.resultsTitle
  }, [t.meta.resultsTitle])

  return (
    <>
      <Masthead page="hasil">
        <section className="masthead-body container" aria-labelledby="results-title">
          <h1 id="results-title" className="rv" tabIndex={-1}>
            {r.title}
          </h1>
          <p className="hero-sub rv" style={{ animationDelay: '100ms' }}>
            {r.intro}
          </p>
        </section>
      </Masthead>
      <main id="main" tabIndex={-1} className="results-main container">
        <ScoreCards />

        <section className="results-row">
          <TrainingChart />
          <aside className="results-aside sr">
            <ConfigList />
            <div className="side-card is-muted">
              <h2>{r.limitations.title}</h2>
              <p>{r.limitations.body(formatDec(BASELINE.rougeL, lang, 3))}</p>
            </div>
          </aside>
        </section>

        <CurveChart />

        <DistributionChart />

        <section className="abstractive sr" aria-labelledby="abstraktif">
          <div className="abstractive-text">
            <h2 id="abstraktif">{r.abstractive.title}</h2>
            <p>{r.abstractive.body}</p>
            <p className="small">{r.abstractive.note(FINDINGS.akuOpening.hybrid, CONFIG.testDocs)}</p>
          </div>
          <NgramTable />
        </section>

        <ScenarioTable />
      </main>
    </>
  )
}
