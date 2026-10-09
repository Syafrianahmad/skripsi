# Ringkas Jawa

**See how three mT5 models summarize Javanese stories, and why a two-sentence baseline still beats them.**

Ringkas Jawa is a static portfolio site for my undergraduate thesis on automatic summarization of Javanese-language stories. I fine-tuned `google/mt5-small` on three training sets (original Javanese, Google-translated, and both combined) and evaluated them on 70 held-out stories. The site shows the real model outputs side by side, the scores, the training curves, and an honest reading of the results: the reference summaries are the first two sentences of each story (lead-2), so the models mostly learned to copy, and the plain lead-2 baseline (ROUGE-L 0.867) still outscores the best model (Hybrid, 0.7976).

![Ringkas Jawa demo page: hero with the before/after summary of test story #68, and the summarizer comparing the Hybrid, GTrans and Murni outputs](docs/screenshot.png)

## Key features

- **Real outputs, no live model.** Pick one of 5 featured test stories (best, median, worst) or a random one of the 70. Each shows the source excerpt, the lead-2 reference, and the outputs of all three models with their per-document ROUGE-L.
- **Differences highlighted.** Words a model produced that are not in the reference are marked, so copying and artifacts (such as the leftover `<extra_id_0>` token) are visible at a glance.
- **Results page.** Score cards against the baseline, a data-size vs. score chart, per-epoch ROUGE-L and loss curves, n-gram novelty, the full scenario table, and the training configuration. Charts are hand-built SVG.
- **Findings that match the data.** Every number on the site comes from one file (`src/data/results.ts`), and the counts quoted in the findings are checked against the stored outputs by tests.
- **Indonesian and English.** The language follows the browser, with a toggle. Light and dark themes are both supported.
- **Accessible.** Full keyboard use with visible focus, WCAG AA contrast in both themes, reduced-motion support, and focus moved to the new view on navigation.
- **Private and static.** No backend, no trackers, no third-party requests (fonts are self-hosted). A strict Content-Security-Policy is added at build time. Ready for GitHub Pages.

## Quick start

You need **Node.js 20.19+ or 22.12+** (check with `node -v`) and npm, which ships with Node.

```bash
git clone https://github.com/suiryuu-cmd/skripsi.git
```

```bash
cd skripsi
```

```bash
npm ci
```

```bash
npm run dev
```

Open <http://localhost:5173>. That's it: the data is bundled, so there are no environment variables, API keys, or database to set up.

## Usage

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload at <http://localhost:5173> |
| `npm run build` | Type-checks and builds the production site into `dist/` (with the CSP) |
| `npm run preview` | Serves the production build at <http://localhost:4173> to check it before deploying |
| `npm run test` | Runs the unit tests (Vitest) |
| `npm run lint` | Runs ESLint |

**Deploying under a subpath** (for example GitHub Pages at `https://<user>.github.io/<repo>/`): set the base path when building.

```bash
BASE_PATH=/skripsi/ npm run build
```

Then publish the `dist/` folder. Pages are addressed with hash routes (`#/` for the demo, `#/hasil` for the results), so refreshing any page works on a static host.

**Troubleshooting**

- *`npm ci` fails or Vite refuses to start:* your Node version is too old. Upgrade to 20.19+ or 22.12+.
- *Port 5173 is already in use:* Vite picks the next free port and prints it in the terminal.

## Tech stack

**Site**

- React 19 with TypeScript 6 (strict mode)
- Vite 8 for the dev server and production build
- Plain CSS with custom properties and `light-dark()` for theming (no UI framework)
- Static JSON data bundled at build time; hash-based routing with no router library
- Vitest 5 for unit tests, ESLint 10 for linting
- Self-hosted fonts: Atkinson Hyperlegible, IBM Plex Mono, Schibsted Grotesk, Noto Sans Javanese (subset to the glyphs used)
- Runtime dependencies: `react` and `react-dom` only

**Research (not needed to run the site)**

- `google/mt5-small` fine-tuned with Hugging Face Transformers (`Seq2SeqTrainer`)
- Google Colab, T4 GPU; evaluation with ROUGE-1, ROUGE-2 and ROUGE-L

## Results at a glance

Evaluated on the same 70 original Javanese test stories:

| Scenario | Training pairs | ROUGE-L |
|---|---|---|
| Murni (original Javanese) | 633 | 0.3978 |
| GTrans (Google-translated) | 1,000 | 0.6437 |
| Hybrid (both) | 1,633 | 0.7976 |
| Lead-2 baseline (no model) | 0 | 0.867 |

## Project structure

```
src/
  data/        docs.json (70 test documents) and results.ts (every score on the site)
  i18n/        Indonesian and English text
  lib/         small tested helpers: routing, theme, chart scales, formatting
  components/  UI pieces (header, summarizer, charts, tables)
  pages/       Demo and Results pages
  fonts/       self-hosted woff2 files and their OFL licenses
docs/          PRD, architecture, design system, security, code style, testing
csp.ts         builds the Content-Security-Policy injected at build time
```

## Data and credits

- Stories: [GPT2 Javanese Dataset](https://www.kaggle.com/datasets/lutfiandri/gpt2-javanese-dataset) by Lutfi Andriyanto on Kaggle. The uploader lists the license as "Unknown", so the site credits the source and shows the stories only as excerpts for research purposes.
- Translations of the 5 featured references are AI-generated and marked as unverified on the site.
- Fonts are licensed under the SIL Open Font License 1.1 (see `src/fonts/licenses/`).
- The code in this repository has no license file yet, so all rights are reserved by default.

## Author

Ahmad Syafrian Cahyadi · [LinkedIn](https://www.linkedin.com/in/ahmad-syafrian-cahyadi-609790430/) · [GitHub](https://github.com/suiryuu-cmd)

A journal article based on this thesis is in progress (MATICS).
