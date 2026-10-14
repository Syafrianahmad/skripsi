// Size budget for the production build (run after `npm run build`).
// JS: gzip of every assets/*.js, entry and lazy chunks alike, so a chunk that index.html does not load
// on first paint still counts. Fonts: total size of every .woff2 in the build.
// KB here means 1000 bytes.
// Gzip output comes from Node's zlib binary, so exact byte counts can differ between Node versions.
// The budget is measured on the Node in .nvmrc (22): run `fnm exec --using=22 npm run size`.
import { gzipSync } from 'node:zlib'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// DIST_DIR lets the check run on a scratch build (for example with and without BASE_PATH)
const DIST = process.env.DIST_DIR ?? 'dist'
const JS_BUDGET_BYTES = 110_000
const FONT_BUDGET_BYTES = 120_000

const kb = (bytes) => (bytes / 1000).toFixed(1)

const html = readFileSync(join(DIST, 'index.html'), 'utf8')
const jsFiles = readdirSync(join(DIST, 'assets'))
  .filter((name) => name.endsWith('.js'))
  .map((name) => join(DIST, 'assets', name))
if (jsFiles.length === 0) throw new Error(`no JS in ${join(DIST, 'assets')}`)
const jsGzipBytes = jsFiles.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0)

const fontFiles = readdirSync(DIST, { recursive: true })
  .filter((name) => name.endsWith('.woff2'))
  .map((name) => join(DIST, name))
const fontBytes = fontFiles.reduce((sum, file) => sum + statSync(file).size, 0)

console.log(`index.html gzip (info, no budget): ${kb(gzipSync(html).length)} KB`)
console.log(`JS gzip (${jsFiles.length} files in assets/): ${kb(jsGzipBytes)} KB, budget ${kb(JS_BUDGET_BYTES)} KB`)
console.log(`woff2 total (${fontFiles.length} files): ${kb(fontBytes)} KB, budget ${kb(FONT_BUDGET_BYTES)} KB`)

const failures = []
if (jsGzipBytes > JS_BUDGET_BYTES) failures.push('JS gzip over budget')
if (fontBytes > FONT_BUDGET_BYTES) failures.push('woff2 over budget')
if (failures.length > 0) {
  console.error(`size budget failed: ${failures.join(', ')}`)
  process.exitCode = 1
}
