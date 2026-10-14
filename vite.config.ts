import { existsSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import { inlineCss, withCsp } from './csp.ts'

const FALLBACK_SITE_ORIGIN = 'https://syafrianahmad.github.io'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // public origin for og:url and og:image. Precedence: process env (deploy workflow) > .env files > fallback.
  // Vite reads process env after the files, so the resolved value is written back for the index.html placeholders.
  process.env.VITE_SITE_ORIGIN = loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_ORIGIN || FALLBACK_SITE_ORIGIN

  // CI runs `npm run test` before the build, when dist/ is still missing: dist.test.ts is left out of that run only
  const distBuilt = existsSync(join(process.env.DIST_DIR ?? 'dist', 'index.html'))

  return {
    // GitHub Pages serves from /<repo>/; the deploy workflow sets BASE_PATH
    base: process.env.BASE_PATH ?? '/',
    plugins: [
      react(),
      // build only: the dev server injects inline <style> tags that a strict CSP would block
      { name: 'csp', apply: 'build', transformIndexHtml: { order: 'post', handler: (html, ctx) => withCsp(inlineCss(html, ctx.bundle)) } },
    ],
    // never inline small assets as data: URIs; the CSP (default-src 'self') would block the inlined fonts
    build: { assetsInlineLimit: 0 },
    // e2e/ holds Playwright specs (playwright.config.ts), not Vitest tests
    test: {
      environment: 'node',
      exclude: [...configDefaults.exclude, 'e2e/**', ...(process.env.CI && !distBuilt ? ['dist.test.ts'] : [])],
    },
  }
})
