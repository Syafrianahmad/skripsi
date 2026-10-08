import { Footer } from './components/Footer.tsx'
import { useRoute } from './lib/route.ts'
import { DemoPage } from './pages/DemoPage.tsx'
import { ResultsPage } from './pages/ResultsPage.tsx'

export default function App() {
  const { page } = useRoute()

  return (
    <>
      {page === 'hasil' ? <ResultsPage /> : <DemoPage />}
      <Footer />
    </>
  )
}
