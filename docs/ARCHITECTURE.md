# Architecture

## Tech stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| UI | React 19 + TypeScript (strict) | sudah ada di template; tipe menjaga kamus ID/EN dan data tetap sinkron |
| Build | Vite 8 | sudah ada; output statis |
| Gaya | CSS biasa + CSS variable (`src/styles.css`) | tanpa dependensi, tema lewat variabel |
| Routing | hash route buatan (±30 baris) | dua halaman saja; GitHub Pages tidak punya fallback SPA |
| Data | JSON statis di-import ke bundle | tidak ada backend; 70 dokumen ±100 KB |
| Tes | Vitest (dev dependency) | satu-satunya tambahan; logika murni saja |
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
  i18n/                     id.ts (sumber tipe Dict), en.ts, index.ts (useLang)
  lib/                      fungsi murni + hook kecil: lang, route, theme, chart, shuffle, words
  components/               Header, Masthead, Footer, Hero, Summarizer, Findings, CaseSteps,
                            ScoreCards, TrainingChart, CurveChart, NgramTable, ScenarioTable, ConfigList
  pages/                    DemoPage, ResultsPage
docs/                       dokumen proyek; docs/design = salinan desain kanvas
research/                   notebook skripsi (menyusul)
.github/workflows/          deploy.yml
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
- Satu-satunya state UI: cerita terpilih (`Summarizer`), tab kurva (`CurveChart`), pemutaran ulang hero, bahasa, tema.
- Logika yang bisa salah ada di `src/lib/` sebagai fungsi murni dan dites; hook hanya membungkusnya dengan efek.

## Keputusan penting

| Keputusan | Alasan | Konsekuensi |
|---|---|---|
| Hash route `#/<halaman>[#<bagian>]` | refresh di Pages tidak 404; tanpa file 404.html | tautan bagian ditulis `#/#temuan`; scroll ditangani `useRoute` |
| Tipe `Dict = typeof id` | `en.ts` gagal compile bila ada kunci kurang | menambah teks = isi dua file |
| Angka grafik dihitung di `lib/chart.ts` | SVG sebelumnya berkoordinat tulis tangan | titik harus cocok dengan desain (diuji) |
| Hero menghitung jumlah kata dari teks | desain menulis 30, hitungan benar 29 | angka tidak pernah basi |
| `base` Vite dari `BASE_PATH` | nama repo bisa berubah (`ringkas-jawa`) | workflow mengisi dari `github.event.repository.name` |
| Teks keluaran model dirender sebagai teks | berisi `<extra_id_0>`; React meng-escape | tidak pernah `dangerouslySetInnerHTML` |
| Font di-host sendiri (`src/fonts/`) | tanpa pihak ketiga, CSS tidak lagi diblokir origin lain, CSP bisa ketat | subset latin saja; Noto Sans Javanese di-subset (pyftsubset) ke glyph yang dipakai, 67 KB → 2.7 KB; lisensi OFL ikut di repo |
| CSP lewat `<meta>` saat build (`csp.ts`) | GitHub Pages tidak bisa mengirim header | skrip inline harus di-hash (otomatis), `assetsInlineLimit: 0` |
| Fokus pindah ke `<h1>`/bagian tujuan saat navigasi | pembaca layar tahu halamannya berganti | target diberi `tabIndex={-1}` |

## Build dan deploy

1. Workflow `.github/workflows/deploy.yml`: `npm ci` → `npm run lint` → `npm run test` → build → unggah `dist/` sebagai artifact → `deploy-pages`. Lint atau tes gagal berarti tidak ada deploy.
2. Build memakai dua variabel dari konteks GitHub: `BASE_PATH=/<nama-repo>/` dan `VITE_SITE_ORIGIN=https://<pemilik-repo>.github.io` (untuk `og:url` dan `og:image`). Mengganti nama repo atau akun tidak butuh perubahan kode; build lokal memakai default di `.env`.
3. Push ke `main` memicu workflow; `develop` dipakai untuk kerja harian. Prasyarat sekali saja: Settings > Pages > Source: GitHub Actions.
4. Verifikasi setelah live: buka subpath, ganti bahasa/tema, refresh di `#/hasil`. Sudah disimulasikan lokal dengan `BASE_PATH=/skripsi/` (semua aset, font, dan route berfungsi).

## Batas yang diketahui

- Model live tidak ada; menambahkannya berarti backend atau inferensi di browser (keputusan terpisah).
- 70 dokumen dimuat sekaligus; cukup untuk ukuran ini, pecah per dokumen bila data tumbuh.
- Scroll-reveal memakai `animation-timeline: view()`; browser tanpa dukungan melihat konten langsung (aman).
