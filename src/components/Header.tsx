import type { Lang } from '../data/types.ts'
import { useLang } from '../i18n/useLang.ts'
import type { Page } from '../lib/route.ts'
import { useTheme } from '../lib/theme.ts'

const LANGS: readonly Lang[] = ['id', 'en']

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
        <a href="#/" className="brand">
          <span className="brand-mark" lang="jv" aria-hidden="true">ꦫ</span>
          Ringkas Jawa
        </a>
        <div className="nav-links">
          <a href="#/" className="nav-link" aria-current={page === 'demo' ? 'page' : undefined}>
            {t.nav.demo}
          </a>
          <a href="#/hasil" className="nav-link" aria-current={page === 'hasil' ? 'page' : undefined}>
            {t.nav.results}
          </a>
          <a href="#/#temuan" className="nav-link">
            {t.nav.findings}
          </a>
          <div className="lang-switch" role="group" aria-label={t.nav.switchLanguage}>
            <span
              className="lang-thumb"
              aria-hidden="true"
              style={{ transform: `translateX(${LANGS.indexOf(lang) * 100}%)` }}
            />
            {LANGS.map((l) => (
              <button key={l} type="button" className="lang-btn" aria-pressed={l === lang} onClick={() => setLang(l)}>
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
