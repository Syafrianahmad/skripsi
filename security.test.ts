// Security guards: static scans of the source, docs, and index.html, run with `npm run test`.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = fileURLToPath(new URL('.', import.meta.url))
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')
const walk = (dir: string): string[] =>
  readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )

const sources = walk('src')
  .filter((f) => /\.(ts|tsx|css)$/.test(f) && !f.includes('.test.'))
  .map((f) => ({ file: f, text: read(f) }))
const html = read('index.html')
// every text file under src/ and docs/ (binary images are skipped)
const textFiles = [...walk('src'), ...walk('docs')]
  .filter((f) => /\.(ts|tsx|css|md|html|json)$/.test(f))
  .map((f) => ({ file: f, text: read(f) }))

describe('security guards', () => {
  it('never renders raw HTML or evaluates strings (model output stays plain text)', () => {
    for (const { file, text } of sources) {
      expect(text, file).not.toMatch(/dangerouslySetInnerHTML|\.innerHTML|outerHTML|insertAdjacentHTML|\beval\(|new Function\(/)
    }
  })

  it('formats UI numbers through src/lib/format.ts, never toFixed (id shows a decimal comma)', () => {
    // src/lib/chart.ts, export.ts, and format.ts are outside these roots: SVG coordinates and CSV/JSON keep the dot.
    for (const { file, text } of sources.filter((s) => /^src[\\/](components|pages)[\\/]/.test(s.file))) {
      expect(text, file).not.toMatch(/\.toFixed\(/)
    }
  })

  it('opens every new-tab link with rel="noopener noreferrer"', () => {
    let links = 0
    for (const { file, text } of sources) {
      for (const [tag] of text.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
        links++
        expect(tag, file).toContain('rel="noopener noreferrer"')
      }
    }
    expect(links).toBeGreaterThan(0)
  })

  it('loads no script, stylesheet, or font from a third-party origin', () => {
    expect(html).not.toMatch(/<(script|link)\b[^>]*(src|href)="(https?:)?\/\//)
    for (const { file, text } of sources.filter((s) => s.file.endsWith('.css'))) {
      expect(text, file).not.toMatch(/url\(\s*['"]?(https?:)?\/\/|@import/)
    }
  })

  it('keeps production source maps off', () => {
    expect(read('vite.config.ts')).not.toMatch(/sourcemap\s*:\s*(true|['"])/)
  })

  it('keeps personal profile links out of src and docs (PRD forbids personal data)', () => {
    for (const { file, text } of textFiles) {
      expect(text, file).not.toContain('linkedin.com/in/')
    }
  })

  it('changes the hash only through location.hash or goToSection, never the history API', () => {
    for (const { file, text } of textFiles.filter((f) => f.file.startsWith('src'))) {
      expect(text, file).not.toMatch(/\bhistory\??\.(replaceState|pushState)\b/)
    }
  })

  it('contains nothing that looks like a secret', () => {
    const secret = /ghp_[A-Za-z0-9]{20,}|github_pat_\w{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----/
    for (const { file, text } of [...sources, { file: 'index.html', text: html }]) {
      expect(text, file).not.toMatch(secret)
    }
  })
})
