import type { Page } from '@playwright/test'

// Shared helpers for the e2e specs. Not named *.e2e.ts, so Playwright does not run it as a spec.

export const FEATURED = [68, 40, 69, 60, 50] as const
export const PAGES = [
  { name: 'demo', hash: '#/' },
  { name: 'hasil', hash: '#/hasil' },
] as const

export type Layout = {
  overflow: { scrollWidth: number; clientWidth: number; offenders: string[] }
  orphans: { sel: string; n: number; cols: number }[]
  minSvgFont: { effPx: number; text: string; svg: string } | null
  smallTargets: { sel: string; w: number; h: number }[]
  headerH: number | null
  tabsPastEdge: { card: string; px: number }[]
}

/**
 * Layout measurements, the same logic as the baseline script (kategori a-f) so that
 * before and after numbers are comparable. Runs inside the page.
 */
export function measureLayout(page: Page): Promise<Layout> {
  return page.evaluate(() => {
    const de = document.documentElement
    const vw = de.clientWidth
    const visible = (el: Element): boolean => {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') return false
      const r = el.getBoundingClientRect()
      return r.width > 1 && r.height > 1
    }
    const label = (el: Element): string => {
      let s = el.tagName.toLowerCase()
      if (el.id) s += '#' + el.id
      const cls = (el.getAttribute('class') ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
      if (cls.length) s += '.' + cls.join('.')
      const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
      return text ? `${s} "${text}"` : s
    }
    const clipped = (el: Element): boolean => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX
        if (o !== 'visible' && o !== 'clip') return true
      }
      return false
    }

    // (a) what sticks out past the viewport, for reproduction
    const offenders: string[] = []
    for (const el of document.body.querySelectorAll('*')) {
      if (!visible(el)) continue
      const r = el.getBoundingClientRect()
      if (r.right > vw + 0.5 && !clipped(el)) offenders.push(`${label(el)} right=${Math.round(r.right)}`)
    }

    // (b) grid with n children and c columns (c > 1) where n % c == 1 (one orphan on the last row)
    const orphans: { sel: string; n: number; cols: number }[] = []
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el)
      if (cs.display !== 'grid' && cs.display !== 'inline-grid') continue
      if (!el.getClientRects().length) continue
      const kids = [...el.children].filter((k) => {
        const c = getComputedStyle(k)
        return c.display !== 'none' && c.position !== 'absolute' && c.position !== 'fixed' && k.getBoundingClientRect().width > 0
      })
      const tracks = cs.gridTemplateColumns
      const cols = tracks === 'none' || tracks === 'subgrid' ? 1 : tracks.trim().split(/\s+/).length
      if (cols > 1 && kids.length % cols === 1) orphans.push({ sel: label(el), n: kids.length, cols })
    }

    // (c) smallest effective SVG text: font-size x (rendered width / viewBox width)
    let minSvgFont: { effPx: number; text: string; svg: string } | null = null
    for (const svg of document.querySelectorAll('svg')) {
      const vb = svg.viewBox.baseVal
      if (!vb || !vb.width || !svg.getClientRects().length) continue
      const scale = svg.getBoundingClientRect().width / vb.width
      for (const t of svg.querySelectorAll('text')) {
        if (!t.getClientRects().length) continue
        const eff = parseFloat(getComputedStyle(t).fontSize) * scale
        if (!minSvgFont || eff < minSvgFont.effPx) {
          minSvgFont = { effPx: Math.round(eff * 100) / 100, text: (t.textContent ?? '').trim().slice(0, 24), svg: label(svg) }
        }
      }
    }

    // (d) interactive targets below 44px. Each element on its own; the 1px sr-only radios are not targets, their label.chip is.
    // Exempt: inline links inside a sentence (WCAG 2.5.8 inline exception), because their height follows the text line.
    const TARGETS = 'button, select, summary, [role="tab"], label.chip, header a, footer a, .skip-link'
    const smallTargets: { sel: string; w: number; h: number }[] = []
    for (const el of document.querySelectorAll(TARGETS)) {
      if (!visible(el)) continue
      if (el.tagName === 'A' && !el.closest('header') && el.closest('p, li, dd, td, figcaption')) continue
      const r = el.getBoundingClientRect()
      if (r.width < 44 || r.height < 44) {
        smallTargets.push({ sel: label(el), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 })
      }
    }

    // (e) header height in px
    const header = document.querySelector('header')
    const headerH = header ? Math.round(header.getBoundingClientRect().height) : null

    // (f) .tabs sticking out past the border of its chart card
    const tabsPastEdge: { card: string; px: number }[] = []
    for (const t of document.querySelectorAll('.tabs')) {
      const card = t.closest('.chart-card') ?? t.parentElement
      if (!card) continue
      const tr = t.getBoundingClientRect()
      const cr = card.getBoundingClientRect()
      const px = Math.max(tr.right - cr.right, cr.left - tr.left, 0)
      tabsPastEdge.push({ card: label(card), px: Math.round(px * 10) / 10 })
    }

    return {
      overflow: { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders: offenders.slice(0, 5) },
      orphans,
      minSvgFont,
      smallTargets,
      headerH,
      tabsPastEdge,
    }
  })
}
