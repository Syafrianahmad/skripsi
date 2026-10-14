# Code Style

Prinsip: kode sekecil yang berfungsi, mengikuti yang sudah ada. Boring over clever.

## TypeScript

- `strict` tetap aktif; tanpa `any` (pakai `unknown` lalu persempit).
- Tipe domain hanya di `src/data/types.ts` (`Lang`, `ModelId`, `Part`, `Doc`); jangan diduplikasi.
- Fungsi murni diberi tipe parameter dan return eksplisit; hook boleh inferensi.
- Import langsung dari file, **bukan barrel**. Tidak ada `index.ts` di `src/`; `src/i18n` diimpor per berkas (`useLang.ts`, `id.ts`).
- Ekstensi impor eksplisit sesuai config proyek.
- Konstanta data bertipe `as const` bila dipakai sebagai literal (`FEATURED_IDS`).

## React

- Komponen fungsi, satu komponen per file, nama file = nama komponen (`Summarizer.tsx`).
- Props bertipe lewat `type Props = {...}`; tanpa `React.FC`.
- Turunkan nilai saat render; jangan simpan nilai turunan di `useState` + `useEffect`.
- Efek hanya untuk sinkronisasi dengan dunia luar (`hashchange`, `document`, `localStorage`); bersihkan listener.
- `useMemo`/`useCallback`/`memo` hanya bila ada alasan terukur.
- `key` stabil (id dokumen, bukan indeks). Indeks hanya untuk daftar statis (titik grafik, sel tabel). Pengecualian sengaja: `Summarizer` di `DemoPage` diberi `key={sel.gen}`; nomor generasi naik saat tautan cerita berganti, sehingga filter dan mode bandingkan ikut reset. `App.tsx` tidak memakai `key`.
- Elemen semantik dulu (`button`, `nav`, `main`, `table`), ARIA hanya bila perlu.
- Tidak ada `dangerouslySetInnerHTML`.
- `.tsx` hanya mengekspor komponen (aturan react-refresh). Fungsi murni ada di `src/lib/`.

## Struktur dan penamaan

| Hal | Aturan |
|---|---|
| File komponen | `PascalCase.tsx` |
| File lib/data | `camelCase.ts` (`chart.ts`, `results.ts`) |
| Tes | `nama.test.ts` di sebelah file yang dites |
| Konstanta global | `UPPER_SNAKE_CASE` (`FEATURED_IDS`) |
| Booleans | awalan `is/has/can` |
| Handler | `onX` untuk prop, `handleX` untuk implementasi. Helper kecil di dalam modul boleh tanpa prefiks (`jumpIfCurrentHash` di `Header.tsx`) |
| Kunci i18n | `camelCase`, dikelompokkan (`t.nav.results`), id dan en selalu berpasangan |

Pisah menurut tanggung jawab, bukan lapisan teknis. Hindari file TS/TSX > 250 baris; pecah bila sulit dibaca. Yang terbesar saat ini `Summarizer.tsx` (sekitar 234 baris), lalu kamus `id.ts` dan `en.ts` (sekitar 230 dan 226 baris). `src/styles.css` tetap satu berkas (lihat CSS).

## CSS

- Satu `src/styles.css`; warna, jarak, dan radius lewat variabel (lihat `DESIGN-SYSTEM.md`). Tanpa nilai warna acak di komponen.
- Nama kelas `kebab-case`, berdasarkan peran (`.model-card`, `.chip`), bukan tampilan (`.blue-box`).
- Gaya sebaris hanya untuk nilai dinamis (lebar bar, posisi thumb).
- Breakpoint `@media` seperlunya; daftar nilainya ada di `DESIGN-SYSTEM.md`.
- Animasi hanya `transform`/`opacity`, selalu dilindungi `prefers-reduced-motion`.
- Jangan `outline: none` tanpa pengganti fokus. Pengecualian: `main` dan `section[tabindex='-1']` (target fokus programatik), lihat `DESIGN-SYSTEM.md`.

## Teks dan i18n

- Seluruh teks tampil ada di `src/i18n/`; komponen tidak punya string tampil.
- Tanpa em dash; pakai koma, titik, atau titik dua.
- Teks Jawa diberi `lang="jv"`.
- Tidak ada angka hasil di komponen; ambil dari `results.ts`.
- Angka tampil lewat `formatDec(n, lang, digits)` dan `gainPercent(v, base, lang)` di `src/lib/format.ts`. Jangan `toFixed` di komponen atau halaman.
- Titik desimal hanya di export CSV/JSON dan koordinat SVG. Di UI `id` pakai koma (`0,7976`, `+61,8%`); di UI `en` pakai titik (`0.7976`).

## Komentar

Hanya untuk "kenapa", bukan "apa". Pintasan yang disengaja diberi tanda dengan batas dan jalan upgrade:

```ts
// ponytail: hash route buatan, cukup untuk 2 halaman; pakai router bila halaman bertambah
```

Tanpa komentar generik ("// fungsi untuk ..."), tanpa kode mati yang dikomentari.

## Lint dan format

- `npm run lint` harus bersih sebelum commit. `eslint.config.js` memeriksa `.ts` dan `.tsx` (termasuk `e2e/` dan berkas konfigurasi TypeScript) dengan `recommended` dari ESLint dan typescript-eslint, plus `react-hooks` dan `react-refresh`.
- Satu gaya format di seluruh repo (ikuti file yang ada: tanpa titik koma, kutip tunggal).

## Commit

Format `<tipe>: <ringkasan huruf kecil>`; tipe `feat`, `fix`, `docs`, `chore`, `ci`, `test`, `refactor`. Satu perubahan logis per commit. **Tanpa `Co-Authored-By`.** Perintah git dijalankan Suiryu.

Cabang: kerja di `develop`, rilis dengan merge ke `main`.
