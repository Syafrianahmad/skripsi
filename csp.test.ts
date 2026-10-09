import { describe, expect, it } from 'vitest'
import { withCsp } from './csp.ts'

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
