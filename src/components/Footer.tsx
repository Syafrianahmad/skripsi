import { useLang } from '../i18n/useLang.ts'

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <div className="footer-id">
          <strong>Ahmad Syafrian Cahyadi</strong>
          <span>{t.footer.affil}</span>
          <span>{t.footer.journal}</span>
        </div>
        <div className="footer-side">
          <div className="footer-links">
            <a
              className="footer-link"
              href="https://www.linkedin.com/in/ahmad-syafrian-cahyadi-609790430/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a className="footer-link" href="https://github.com/suiryuu-cmd" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <span>{t.footer.source}</span>
        </div>
      </div>
    </footer>
  )
}
