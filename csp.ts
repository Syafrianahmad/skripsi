import { createHash } from 'node:crypto'

const sha256 = (source: string) => `'sha256-${createHash('sha256').update(source).digest('base64')}'`

/**
 * Adds a Content-Security-Policy <meta> as the first element of <head>.
 * GitHub Pages cannot send headers, so the policy has to live in the HTML.
 * Inline <script> blocks (the theme bootstrap) are allowed by hash; no 'unsafe-inline'.
 * React sets `style` props through the CSSOM, which CSP does not restrict.
 */
export function withCsp(html: string): string {
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => sha256(m[1]))
  const policy = [
    "default-src 'self'",
    ["script-src 'self'", ...hashes].join(' '),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ')
  return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`)
}
