import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { withCsp } from './csp.ts'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves from /<repo>/; the deploy workflow sets BASE_PATH
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    // build only: the dev server injects inline <style> tags that a strict CSP would block
    { name: 'csp', apply: 'build', transformIndexHtml: { order: 'post', handler: withCsp } },
  ],
  // never inline small assets as data: URIs; the CSP (default-src 'self') would block the inlined fonts
  build: { assetsInlineLimit: 0 },
  test: { environment: 'node' },
})
