import type { MouseEvent } from 'react'
import type { Lang } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import { goToSection, isSamePageClick, type Page, parseRoute } from '../lib/route.ts'
import { useTheme } from '../lib/theme.ts'

const LANGS: readonly Lang[] = ['id', 'en']

// A link to the current hash fires no hashchange, so the page would not move: scroll here instead.
function jumpIfCurrentHash(e: MouseEvent<HTMLAnchorElement>) {
  if (!isSamePageClick(e.currentTarget.hash, window.location.hash, e)) return
  e.preventDefault()
  goToSection(parseRoute(window.location.hash).section)
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export function Header({ page }: { page: Page }) {
  const { lang, setLang, t } = useLang()
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header>
      <nav className="site-nav container">
        <a href="#/" className="brand" onClick={jumpIfCurrentHash}>
          <svg className="brand-mark" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
            <rect width="256" height="256" rx="56" fill="#f59e0b" />
            <path fill="#13294b" d="M130.9 180Q127 180 122.5 179Q118 178.1 112.5 176.2L57.6 158.1V149Q90.9 134 90.9 111.2V110Q90.9 99.2 78.5 99.2H59.3L70.1 117.6H53.2L30.2 81.7L33.7 76H85.2Q116.5 76 116.5 105.1Q116.5 130.8 96 146.9L122.8 155.3Q124.3 155.8 125.2 155.8Q130.9 155.8 130.9 150.1V122.8Q130.9 76 178.8 76Q225.8 76 225.8 121.8V179.8H200.9V119.7Q200.9 99.8 178.4 99.8Q155.8 99.8 155.8 120.3V160Q155.8 170.5 149.2 175.2Q142.5 180 130.9 180Z" />
          </svg>
          <span className="brand-name" title="Ringkas Jawa">Ringkas Jawa</span>
        </a>
        <div className="nav-links">
          <a href="#/" className="nav-link" aria-current={page === 'demo' ? 'page' : undefined} onClick={jumpIfCurrentHash}>
            {t.nav.demo}
          </a>
          <a href="#/hasil" className="nav-link" aria-current={page === 'hasil' ? 'page' : undefined} onClick={jumpIfCurrentHash}>
            {t.nav.results}
          </a>
          <a href="#/#temuan" className="nav-link" onClick={jumpIfCurrentHash}>
            {t.nav.findings}
          </a>
          <div className="lang-switch" role="group" aria-label={t.nav.switchLanguage}>
            <span
              className="lang-thumb"
              aria-hidden="true"
              style={{ transform: `translateX(${LANGS.indexOf(lang) * 100}%)` }}
            />
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className="lang-btn"
                aria-pressed={l === lang}
                aria-label={t.nav.langNames[l]}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={isDark ? t.nav.themeToLight : t.nav.themeToDark}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>
    </header>
  )
}
