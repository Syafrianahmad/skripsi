# Architecture

## Tech stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| UI | React 19 + TypeScript (strict) | sudah ada di template; tipe menjaga kamus ID/EN dan data tetap sinkron |
| Build | Vite 8 | sudah ada; output statis |
| Gaya | CSS biasa + CSS variable (`src/styles.css`) | tanpa dependensi, tema lewat variabel |
| Routing | hash route buatan (`src/lib/route.ts`, sekitar 75 baris) | dua halaman saja; GitHub Pages tidak punya fallback SPA |
| Data | JSON statis di-import ke bundle | tidak ada backend; 70 dokumen ±100 KB |
| Tes | Vitest (unit, logika murni); Playwright + axe untuk E2E (Chromium) | dev dependency saja, disetujui 2026-10-14; tanpa jsdom atau Testing Library |
| Hosting | GitHub Pages lewat GitHub Actions | gratis, statis, cukup untuk portofolio |
| Database / backend | **tidak ada** | tidak ada data pengguna; lihat `PRD.md` bagian "Tidak dibuat" |

Tidak dipilih: Next.js/Laravel (tidak ada server), React Router (dua halaman), Tailwind/UI library (token sudah jelas, hemat dependensi), Redux/Zustand (state kecil, lokal).

## Struktur

```
src/
  main.tsx, App.tsx         mount; pilih halaman dari route
  styles.css                token + @font-face + gaya komponen
  fonts/                    woff2 self-host + licenses/ (SIL OFL)
  data/                     docs.json, types.ts, results.ts (sumber angka)
  i18n/                     id.ts (sumber tipe Dict), en.ts, useLang.ts, LangProvider.tsx
  lib/                      fungsi murni + hook kecil: lang, route, theme, chart, shuffle, words,
                            format, findings, storage, export, compare, distribution
  components/               Header, Masthead, Footer, Hero, Summarizer, ModelCard, Findings, CaseSteps,
                            ScoreCards, TrainingChart, CurveChart, DistributionChart, ChartAxes, ChartTable,
                            NgramTable, ScenarioTable, ConfigList, models.ts
  pages/                    DemoPage, ResultsPage
csp.ts                      meta CSP dan inline CSS saat build (dipakai vite.config.ts)
*.test.ts (root)            security.test.ts (pindai sumber), csp.test.ts, dist.test.ts (setelah build)
docs/                       dokumen proyek; docs/design = salinan desain kanvas
e2e/                        Playwright (*.e2e.ts, 7 berkas) dan support.ts; konfigurasi di playwright.config.ts
scripts/check-size.mjs      anggaran ukuran build (npm run size)
research/                   notebook skripsi (menyusul)
.github/workflows/          ci.yml (pull request dan develop), deploy.yml (main)
.nvmrc, .env.example        Node 22; contoh VITE_SITE_ORIGIN (opsional)
```

## Aliran data

```
notebook (Colab) --salin verbatim--> src/data/{docs.json,results.ts}
                                          |
 navigator.languages --detectLang--> useLang --> t (Dict) --+
 location.hash ------parseRoute----> useRoute -> page ------+--> pages --> components --> DOM
 localStorage/matchMedia -resolveTheme-> useTheme -> <html data-theme>
```

- Komponen menerima data lewat import langsung; tidak ada fetch, jadi tidak ada state loading/error jaringan.
- State UI: cerita terpilih dan filter (`DemoPage`), mode bandingkan dan pesan status (`Summarizer`), tab kurva (`CurveChart`), pemutaran ulang hero, bahasa, tema.
- Logika yang bisa salah ada di `src/lib/` sebagai fungsi murni dan dites; hook hanya membungkusnya dengan efek.

## Keputusan penting

| Keputusan | Alasan | Konsekuensi |
|---|---|---|
| Hash route `#/<halaman>[#<bagian>]` | refresh di Pages tidak 404; tanpa file 404.html | tautan bagian ditulis `#/#temuan`; scroll ditangani `useRoute` |
| Tipe `Dict = typeof id` | `en.ts` gagal compile bila ada kunci kurang | menambah teks = isi dua file |
| Angka grafik dihitung di `lib/chart.ts` | SVG sebelumnya berkoordinat tulis tangan | titik harus cocok dengan desain (diuji) |
| Hero menghitung jumlah kata dari teks | desain menulis 30, hitungan benar 29 | angka tidak pernah basi |
| `base` Vite dari `BASE_PATH` | nama repo bisa berubah (`ringkas-jawa`) | workflow mengisi `BASE_PATH` dari `GITHUB_REPOSITORY` |
| Teks keluaran model dirender sebagai teks | berisi `<extra_id_0>`; React meng-escape | tidak pernah `dangerouslySetInnerHTML` |
| Font di-host sendiri (`src/fonts/`) | tanpa pihak ketiga, CSS tidak lagi diblokir origin lain, CSP bisa ketat | subset latin saja; Noto Sans Javanese di-subset (pyftsubset) ke glyph yang dipakai, 67 KB → 2,7 KB; lisensi OFL ikut di repo |
| CSP lewat `<meta>` saat build (`csp.ts`) | GitHub Pages tidak bisa mengirim header | skrip dan gaya inline di-hash (otomatis), `assetsInlineLimit: 0` |
| CSS di-inline ke HTML saat build (`inlineCss`) | menghapus permintaan CSS yang memblokir render (PageSpeed mobile) | CSS tidak lagi di-cache terpisah; ukuran gzip `index.html` (termasuk CSS) tercetak sebagai info di `npm run size` |
| Fokus pindah ke `<h1>`/bagian tujuan saat navigasi | pembaca layar tahu halamannya berganti | target diberi `tabIndex={-1}` |
| Lompat ke bagian lewat `goToSection` (`src/lib/route.ts`); skip link berupa `<button>` | link ke hash yang sama tidak memicu `hashchange`, jadi Header memanggil `goToSection`; `href="#main"` dilarang karena merusak hash route | `goToSection` hanya menggulir dan memfokus, tidak mengubah hash |
| Cerita acak lewat `nextStoryId` (`src/lib/shuffle.ts`), fungsi murni | tanpa filter tidak pernah memilih cerita featured; dengan filter featured boleh | rng disuntikkan supaya dites |
| Angka lewat `formatDec` / `gainPercent` (`src/lib/format.ts`) | UI `id` memakai koma desimal dan titik ribuan; `en` titik desimal | titik tetap di export CSV/JSON dan koordinat SVG; `toFixed` dilarang di `components/` dan `pages/` |
| Setiap grafik punya `details.chart-data` berisi `ChartTable` | pembaca layar dan keyboard dapat angka tanpa membaca SVG | tabel ada di kartu grafik yang sama |
| Pembeda seri non-warna: pola garis (`MODEL_DASH`), bentuk penanda (`MODEL_SHAPE`), `<pattern>` berprefiks per grafik (`dist-pat-`) | warna saja tidak cukup untuk pembeda | id pattern unik per grafik |
| `DemoPage` menerima `story` dari route (`App.tsx` tanpa `key`); tautan cerita yang berbeda dari route sebelumnya mengubah pilihan. `Summarizer` diberi `key={sel.gen}` | cerita dari hash tampil di Demo tanpa remount seluruh halaman; `gen` naik hanya saat tautan cerita baru | filter dan mode bandingkan reset hanya saat tautan cerita baru, bukan saat ganti bahasa atau tema |

Aturan route: hash hanya diubah lewat `location.hash` (tautan `<a href>` atau assignment), jangan `history.replaceState` atau `pushState`. Alasan: route punya satu sumber kebenaran. `replaceState` tidak memicu `hashchange`, sehingga `useRoute` tidak melihat hash baru. `goToSection` hanya menggulir dan memfokus. Dijaga oleh `security.test.ts`.

## Build dan deploy

0. CI `.github/workflows/ci.yml` berjalan pada setiap pull request dan setiap push ke `develop` atau `main`, tanpa deploy: `npm ci`, `npm audit --omit=dev --audit-level=high`, `npm audit signatures`, lint, tes Vitest, build dengan `BASE_PATH` subpath, `npx vitest run dist.test.ts` (CSP dan source map pada `dist/`), `npm run size`, lalu E2E Playwright. Dibuat setelah PR Dependabot yang menaikkan TypeScript ke 7 ter-merge tanpa pemeriksaan dan merusak `npm ci` (`typescript-eslint` belum mendukungnya).
1. Workflow `.github/workflows/deploy.yml`: `npm ci` → `npm audit --omit=dev --audit-level=high` → `npm audit signatures` → `npm run lint` → `npm run test` → build → `npx vitest run dist.test.ts` → unggah `dist/` → `deploy-pages`. Kegagalan di salah satu langkah berarti tidak ada deploy. Deploy tidak menjalankan E2E atau `npm run size`; keduanya hanya di CI.
2. Build memakai dua variabel dari konteks GitHub: `BASE_PATH=/<nama-repo>/` dan `VITE_SITE_ORIGIN=https://<pemilik-repo>.github.io` (untuk `og:url` dan `og:image`). Mengganti nama repo atau akun tidak butuh perubahan kode. `vite.config.ts` memakai urutan: env proses (workflow), lalu berkas `.env*` (lewat `loadEnv`), lalu konstanta fallback. Build lokal tanpa `.env` memakai fallback; `.env.example` adalah contohnya, dan `.env` di-gitignore.
3. Dependabot: pembaruan npm dan GitHub Actions mingguan, dengan cooldown 7 hari. Pembaruan dev dependency minor dan patch dikelompokkan. Pembaruan major TypeScript dan `@types/node` diabaikan (`.github/dependabot.yml`).
4. Push ke `main` memicu workflow; `develop` dipakai untuk kerja harian. Prasyarat sekali saja: Settings > Pages > Source: GitHub Actions.
5. Verifikasi setelah live: buka subpath, ganti bahasa/tema, refresh di `#/hasil`. E2E memakai base `/skripsi/` yang sama dengan subpath live (lihat TESTING.md).

## Batas yang diketahui

- Model live tidak ada; menambahkannya berarti backend atau inferensi di browser (keputusan terpisah).
- 70 dokumen dimuat sekaligus; cukup untuk ukuran ini, pecah per dokumen bila data tumbuh.
- Scroll-reveal memakai `animation-timeline: view()`; browser tanpa dukungan melihat konten langsung (aman).

## Keputusan audit 2026-10-14

Angka di UI Indonesia memakai koma desimal dan titik ribuan (`0,7976`, `+61,8%`, `1.633`); UI Inggris memakai titik desimal. Node 22 dipakai untuk kerja dan CI (`.nvmrc`, `engines` >= 22.12). Playwright dan `@axe-core/playwright` disetujui sebagai dev dependency dengan versi persis (1.64.0 dan 4.13.0), tanpa jsdom atau Testing Library. Butir performa yang ditunda: prerender dan hydrate (LCP lab 2,28 dan 2,42 s, sudah di bawah 2,5 s); pecah `docs.json` per dokumen (menambah request dan kompleksitas); subset font (hemat sekitar 10 KB); memo (klik terukur 48 ms); kompres `og.png` (ditunda, belum ada alasan tertulis); Lighthouse CI (anggaran ukuran `npm run size` sudah cukup). TypeScript 7 dan `@types/node` 26 tetap ditahan. Angka LCP dan klik berasal dari audit, bukan dari kode.

### Hasil putaran 2 (kode akhir)

- Route: `replaceState` dihapus karena tidak memicu `hashchange`. `copyLink` menyusun URL sendiri. Klik nav ke hash yang sama memanggil `goToSection` (Header), karena tidak ada `hashchange`. Skip link berupa `<button>` yang memfokus `<main id="main" tabIndex={-1}>`. `nextStoryId` murni: tanpa filter tidak memilih featured. `parseRoute` hanya membaca `story=N` bilangan bulat positif tanpa nol di depan dan dalam rentang aman.
- Aturan hash: diubah hanya lewat `location.hash`, dijaga `security.test.ts`.
- CI dan deploy: CI menjalankan audit (`--audit-level=high`, `audit signatures`), `dist.test.ts` setelah build, `npm run size`, dan E2E Playwright. Deploy menjalankan audit dan `dist.test.ts`, tetapi tidak menjalankan E2E atau `size`. Actions dipin ke SHA commit. Node 22 lewat `.nvmrc`.
- Sengaja ditunda: prerender dan hydrate, pecah `docs.json`, subset font, memo, kompres `og.png`, Lighthouse CI (alasan di atas).