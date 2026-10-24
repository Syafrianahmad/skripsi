// Post-build guards on the emitted page. Skipped until `npm run build` has produced dist/.
// In CI, vite.config.ts leaves this file out of the pre-build `npm run test`, so a missing build fails the explicit run.
// DIST_DIR points the guards at another build (scratch copies).
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { BASELINE, SCENARIOS } from './src/data/results.ts'

const DIST = process.env.DIST_DIR ?? fileURLToPath(new URL('./dist', import.meta.url))
const INDEX = join(DIST, 'index.html')

const sha256 = (source: string) => `'sha256-${createHash('sha256').update(source).digest('base64')}'`
// inline means no src= attribute (\s keeps data-src= out); other attributes (type="module") do not exempt a block from the hash
const inlineBlocks = (html: string, tag: 'script' | 'style') =>
  [...html.matchAll(new RegExp(`<${tag}\\b(?![^>]*\\ssrc=)[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => m[1])

// Second parser for the same question, with no regex and no code shared with csp.ts: cut at the literal
// tags, then read the attribute names of the opening tag. Limit: both parsers assume the block ends at the first
// closing tag, so a literal "</script>" inside a JS string would fool both; the build does not emit one today.
function inlineBlocksByString(html: string, tag: 'script' | 'style'): string[] {
  const blocks: string[] = []
  const closing = `</${tag}>`
  for (let pos = 0; ; ) {
    const start = html.indexOf(`<${tag}`, pos)
    if (start < 0) return blocks
    const open = html.indexOf('>', start)
    const end = html.indexOf(closing, open)
    const attrs = html.slice(start + tag.length + 1, open).split(/\s+/).map((a) => a.split('=')[0].toLowerCase())
    if (!attrs.includes('src')) blocks.push(html.slice(open + 1, end))
    pos = end + closing.length
  }
}

describe.skipIf(!existsSync(INDEX))('dist/index.html', () => {
  // read at collection time only when built: skipIf still runs this callback
  const html = existsSync(INDEX) ? readFileSync(INDEX, 'utf8') : ''
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] ?? ''
  const directive = (name: string) => policy.split(';').map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? ''

  it('has a Content-Security-Policy meta without unsafe-inline', () => {
    expect(policy).not.toBe('')
    expect(policy).not.toContain('unsafe-inline')
  })

  it('allows exactly the sha256 hashes of its inline script and style blocks', () => {
    const scripts = inlineBlocks(html, 'script')
    const styles = inlineBlocks(html, 'style')
    expect(scripts.length).toBeGreaterThan(0)
    expect(styles.length).toBeGreaterThan(0)
    expect(directive('script-src')).toBe(`script-src 'self' ${scripts.map(sha256).join(' ')}`)
    expect(directive('style-src')).toBe(`style-src 'self' ${styles.map(sha256).join(' ')}`)
  })

  it('agrees with the regex-free parser on which blocks are inline', () => {
    const scripts = inlineBlocksByString(html, 'script')
    const styles = inlineBlocksByString(html, 'style')
    expect(scripts.length).toBeGreaterThan(0)
    expect(styles.length).toBeGreaterThan(0)
    expect(directive('script-src')).toBe(`script-src 'self' ${scripts.map(sha256).join(' ')}`)
    expect(directive('style-src')).toBe(`style-src 'self' ${styles.map(sha256).join(' ')}`)
  })

  it('has a canonical link equal to og:url, and a noscript fallback', () => {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
    expect(canonical).toMatch(/^https:\/\//)
    expect(canonical).toBe(html.match(/<meta property="og:url" content="([^"]+)"/)?.[1])
    expect(html).toContain('<noscript>')
  })

  it('links an apple-touch-icon whose file is in dist/', () => {
    expect(html.match(/<link rel="apple-touch-icon" href="([^"]+)"/)?.[1]).toMatch(/\/apple-touch-icon\.png$/)
    expect(existsSync(join(DIST, 'apple-touch-icon.png'))).toBe(true)
  })

  it('states the Indonesian noscript numbers from src/data/results.ts', () => {
    const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? ''
    const idDecimal = (n: number) => String(n).replace('.', ',')
    const hybrid = SCENARIOS.find((s) => s.id === 'hybrid')!
    expect(noscript).toContain(idDecimal(hybrid.rougeL))
    expect(noscript).toContain(idDecimal(BASELINE.rougeL))
  })

  it('ships no source maps', () => {
    const files = readdirSync(DIST, { recursive: true, encoding: 'utf8' })
    expect(files.filter((f) => f.endsWith('.map'))).toEqual([])
    for (const f of files.filter((f) => f.endsWith('.js'))) {
      expect(readFileSync(join(DIST, f), 'utf8'), f).not.toContain('sourceMappingURL')
    }
  })
})
