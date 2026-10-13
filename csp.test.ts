import { describe, expect, it } from 'vitest'
import { inlineCss, withCsp } from './csp.ts'

const page = (head: string) => `<!doctype html><html><head>${head}</head><body></body></html>`
const policyOf = (html: string) => html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)![1]

describe('withCsp', () => {
  it('puts the CSP meta first in <head>, before any script can run', () => {
    expect(withCsp(page('<title>x</title>'))).toMatch(/<head>\s*<meta http-equiv="Content-Security-Policy"/)
  })

  it('allows an inline script by its sha256 hash, never by unsafe-inline', () => {
    // sha256 of the empty string
    const policy = policyOf(withCsp(page('<script></script>')))
    expect(policy).toContain("script-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='")
    expect(policy).not.toContain('unsafe-inline')
  })

  it('does not hash scripts loaded from a file', () => {
    const policy = policyOf(withCsp(page('<script type="module" src="/assets/index.js"></script>')))
    expect(policy).toContain("script-src 'self';")
    expect(policy).not.toContain('sha256')
  })

  it('blocks plugins, base hijacking, and form posts', () => {
    const policy = policyOf(withCsp(page('')))
    expect(policy).toContain("default-src 'self'")
    expect(policy).toContain("object-src 'none'")
    expect(policy).toContain("base-uri 'self'")
    expect(policy).toContain("form-action 'none'")
  })
})

describe('inlineCss', () => {
  it('replaces the stylesheet link with the CSS and removes the file from the bundle', () => {
    const bundle = { 'assets/index-abc.css': { fileName: 'assets/index-abc.css', type: 'asset', source: 'body{margin:0}' } }
    const html = page('<link rel="stylesheet" crossorigin href="/skripsi/assets/index-abc.css">')
    expect(inlineCss(html, bundle)).toContain('<style>body{margin:0}</style>')
    expect(bundle).toEqual({})
  })

  it('leaves links it does not recognise alone', () => {
    const html = page('<link rel="stylesheet" href="https://fonts.example/x.css">')
    expect(inlineCss(html, {})).toBe(html)
  })
})

describe('withCsp styles', () => {
  it('allows an inline style by its sha256 hash only', () => {
    const policy = policyOf(withCsp(page('<style></style>')))
    expect(policy).toContain("style-src 'self' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='")
    expect(policy).not.toContain('unsafe-inline')
  })
})
