import { ConfigList } from '../components/ConfigList.tsx'
import { CurveChart } from '../components/CurveChart.tsx'
import { Masthead } from '../components/Masthead.tsx'
import { NgramTable } from '../components/NgramTable.tsx'
import { ScenarioTable } from '../components/ScenarioTable.tsx'
import { ScoreCards } from '../components/ScoreCards.tsx'
import { TrainingChart } from '../components/TrainingChart.tsx'
import { BASELINE, CONFIG, FINDINGS } from '../data/results.ts'
import { useLang } from '../i18n/useLang.ts'

export function ResultsPage() {
  const { t } = useLang()
  const r = t.results

  return (
    <>
      <Masthead page="hasil">
        <section className="masthead-body container">
          <h1 className="rv">{r.title}</h1>
          <p className="hero-sub rv" style={{ animationDelay: '100ms' }}>
            {r.intro}
          </p>
        </section>
      </Masthead>
      <main className="results-main container">
        <ScoreCards />

        <section className="results-row">
          <TrainingChart />
          <aside className="results-aside sr">
            <ConfigList />
            <div className="side-card is-muted">
              <h2>{r.limitations.title}</h2>
              <p>{r.limitations.body(BASELINE.rougeL.toFixed(3))}</p>
            </div>
          </aside>
        </section>

        <CurveChart />

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
