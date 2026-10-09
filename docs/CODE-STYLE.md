# Code Style

Prinsip: kode sekecil yang berfungsi, mengikuti yang sudah ada. Boring over clever.

## TypeScript

- `strict` tetap aktif; tanpa `any` (pakai `unknown` lalu persempit).
- Tipe domain hanya di `src/data/types.ts` (`Lang`, `ModelId`, `Part`, `Doc`); jangan diduplikasi.
- Fungsi murni diberi tipe parameter dan return eksplisit; hook boleh inferensi.
- Import langsung dari file, **bukan barrel** (`index.ts` hanya untuk `src/i18n`).
- Ekstensi impor eksplisit sesuai config proyek.
- Konstanta data bertipe `as const` bila dipakai sebagai literal (`FEATURED_IDS`).

## React

- Komponen fungsi, satu komponen per file, nama file = nama komponen (`Summarizer.tsx`).
- Props bertipe lewat `type Props = {...}`; tanpa `React.FC`.
- Turunkan nilai saat render; jangan simpan nilai turunan di `useState` + `useEffect`.
- Efek hanya untuk sinkronisasi dengan dunia luar (`hashchange`, `document`, `localStorage`); bersihkan listener.
- `useMemo`/`useCallback`/`memo` hanya bila ada alasan terukur.
- `key` stabil (id dokumen, bukan indeks).
- Elemen semantik dulu (`button`, `nav`, `main`, `table`), ARIA hanya bila perlu.
- Tidak ada `dangerouslySetInnerHTML`.

## Struktur dan penamaan

| Hal | Aturan |
|---|---|
| File komponen | `PascalCase.tsx` |
| File lib/data | `camelCase.ts` (`chart.ts`, `results.ts`) |
| Tes | `nama.test.ts` di sebelah file yang dites |
| Konstanta global | `UPPER_SNAKE_CASE` (`FEATURED_IDS`) |
| Booleans | awalan `is/has/can` |
| Handler | `onX` untuk prop, `handleX` untuk implementasi |
| Kunci i18n | `camelCase`, dikelompokkan (`t.nav.results`), id dan en selalu berpasangan |

Pisah menurut tanggung jawab, bukan lapisan teknis. Hindari file > 250 baris; pecah bila sulit dibaca.

## CSS

- Satu `src/styles.css`; warna, jarak, dan radius lewat variabel (lihat `DESIGN-SYSTEM.md`). Tanpa nilai warna acak di komponen.
- Nama kelas `kebab-case`, berdasarkan peran (`.model-card`, `.chip`), bukan tampilan (`.blue-box`).
- Gaya sebaris hanya untuk nilai dinamis (lebar bar, posisi thumb).
- Mobile-first; breakpoint seperlunya.
- Animasi hanya `transform`/`opacity`, selalu dilindungi `prefers-reduced-motion`.
- Jangan `outline: none` tanpa pengganti fokus.

## Teks dan i18n

- Seluruh teks tampil ada di `src/i18n/`; komponen tidak punya string tampil.
- Tanpa em dash; pakai koma, titik, atau titik dua.
- Teks Jawa diberi `lang="jv"`.
- Tidak ada angka hasil di komponen; ambil dari `results.ts`.

## Komentar

Hanya untuk "kenapa", bukan "apa". Pintasan yang disengaja diberi tanda dengan batas dan jalan upgrade:

```ts
// ponytail: hash route buatan, cukup untuk 2 halaman; pakai router bila halaman bertambah
```

Tanpa komentar generik ("// fungsi untuk ..."), tanpa kode mati yang dikomentari.

## Lint dan format

- `npm run lint` harus bersih sebelum commit. Aturan `react-hooks` dan `react-refresh` sudah aktif di `eslint.config.js`.
- Satu gaya format di seluruh repo (ikuti file yang ada: tanpa titik koma, kutip tunggal).

## Commit

Format `<tipe>: <ringkasan huruf kecil>`; tipe `feat`, `fix`, `docs`, `chore`, `ci`, `test`, `refactor`. Satu perubahan logis per commit. **Tanpa `Co-Authored-By`.** Perintah git dijalankan Suiryu.

Cabang: kerja di `develop`, rilis dengan merge ke `main`.
