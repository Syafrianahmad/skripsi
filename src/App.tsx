import { Footer } from './components/Footer.tsx'
import { useLang } from './i18n/useLang.ts'
import { goToSection, useRoute } from './lib/route.ts'
import { DemoPage } from './pages/DemoPage.tsx'
import { ResultsPage } from './pages/ResultsPage.tsx'

export default function App() {
  const route = useRoute()
  const { t } = useLang()

  return (
    <>
      <button type="button" className="skip-link" onClick={() => goToSection('main')}>
        {t.nav.skipToContent}
      </button>
      {route.page === 'hasil' ? <ResultsPage /> : <DemoPage story={route.story} />}
      <Footer />
    </>
  )
}
