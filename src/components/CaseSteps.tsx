import { useLang } from '../i18n/useLang.ts'

export function CaseSteps() {
  const { t } = useLang()

  return (
    <section id="di-balik-layar" className="behind">
      <h2 className="section-title sr">{t.behind.title}</h2>
      <ol>
        {t.behind.steps.map((step) => (
          <li key={step.title} className="sr">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <a href="#/hasil" className="btn-outline sr">
        {t.behind.toResults}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </section>
  )
}
