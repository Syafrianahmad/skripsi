import { createHash } from 'node:crypto'

const sha256 = (source: string) => `'sha256-${createHash('sha256').update(source).digest('base64')}'`

type Bundle = Record<string, { fileName: string; type: string; source?: string | Uint8Array }>

/**
 * Build only: replaces the stylesheet <link> with an inline <style>, so the page needs no
 * render-blocking request for its CSS (PageSpeed). The CSS file leaves the bundle.
 */
export function inlineCss(html: string, bundle: Bundle = {}): string {
  return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (tag, href: string) => {
    const name = Object.keys(bundle).find((f) => f.endsWith('.css') && href.endsWith(f))
    if (!name) return tag
    const css = String(bundle[name].source ?? '')
    delete bundle[name]
    return `<style>${css}</style>`
  })
}

/**
 * Adds a Content-Security-Policy <meta> as the first element of <head>.
 * GitHub Pages cannot send headers, so the policy has to live in the HTML.
 * Inline <script> and <style> blocks are allowed by hash; no 'unsafe-inline'.
 * React sets `style` props through the CSSOM, which CSP does not restrict.
 */
export function withCsp(html: string): string {
  // inline means no src= attribute; the \s keeps data-src= from counting. Other attributes (type=) must still be hashed
  const hashes = [...html.matchAll(/<script\b(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => sha256(m[1]))
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => sha256(m[1]))
  const policy = [
    "default-src 'self'",
    ["script-src 'self'", ...hashes].join(' '),
    ["style-src 'self'", ...styles].join(' '),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ')
  return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`)
}
