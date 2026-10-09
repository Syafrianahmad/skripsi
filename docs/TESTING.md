# Testing

Prinsip: **tes yang gagal jika logikanya salah, tanpa kerangka berlebih.** Situs ini kecil dan statis; yang diuji otomatis adalah logika murni dan keutuhan data. Tampilan diverifikasi manual dengan daftar yang tercatat.

## Alat

- Vitest (`npm run test` = `vitest run`), lingkungan `node`. Tidak ada jsdom, Testing Library, atau Playwright di v1 (hemat dependensi; tambahkan bila komponen punya logika sulit).

## Yang dites otomatis

| Modul | Yang dijamin |
|---|---|
| `lib/lang.ts` | `id-ID`→id; `en-US`/`jv`/kosong/`undefined`→en; ambil bahasa pertama yang didukung |
| `lib/route.ts` | `''`, `#/`, `#/zzz`→demo; `#/hasil`→hasil; `#/#temuan` dan `#/hasil#kurva` mem-parse bagian |
| `lib/theme.ts` | `resolveTheme`: tersimpan menang atas sistem; nilai tak dikenal→terang |
| `lib/chart.ts` | `yScore/xEpoch/xPairs` cocok dengan koordinat desain; clip loss >1; `polyline` |
| `lib/shuffle.ts` | tidak pernah mengembalikan cerita saat ini atau featured; melempar bila tak ada kandidat |
| `lib/words.ts` | hitung kata; hero 46 → 29 |
| `lib/format.ts` | pemisah ribuan per bahasa; persen kenaikan 61.8 / 100.5 |
| `csp.ts` | meta CSP pertama di `<head>`; skrip inline lewat hash, tanpa `unsafe-inline`; `object-src 'none'`, `base-uri`, `form-action` |
| `security.test.ts` | pindai `src/` dan `index.html`: tanpa API HTML mentah/`eval`, tautan tab baru ber-`noopener`, tanpa aset pihak ketiga, sourcemap mati, tanpa string mirip token |
| `data/*.test.ts` | 70 dokumen, id unik, 5 featured bertag benar dan bertranslasi, tiga model per dokumen, skor di [0,1], nilai kunci hasil (Hybrid 0.7976 / 1.633, baseline > Hybrid) |

Pola: tulis tes gagal dulu → implement → hijau. Satu file tes per modul, tanpa fixture rumit.

## Yang tidak dites otomatis (dan kenapa)

- Markup/CSS komponen: berubah sering, nilai tes rendah; diganti checklist manual.
- Library (React, Vite).

## Review Focus (kasus tepi yang wajib punya tes/cek)

1. Dokumen acak tanpa terjemahan menampilkan catatan, bukan kosong.
2. Teks `<extra_id_0>` dan karakter HTML tampil literal.
3. Bahasa browser kosong/`jv`/`id-ID`.
4. `localStorage`/`matchMedia` melempar atau tidak ada.
5. Hash route tidak valid dan refresh di subpath Pages.

## Checklist verifikasi manual (catat hasil per baris, R-35)

Jalankan `npm run build && npm run preview` lalu:

- [ ] Konsol bersih (tanpa error/warn) di Demo dan Hasil.
- [ ] Nav: Demo, Hasil, Temuan membawa ke tempat yang benar; logo kembali ke Demo.
- [ ] Sakelar ID/EN mengubah semua teks termasuk `lang` dokumen dan label tombol tema.
- [ ] Tombol tema berganti terang/gelap; kedua mode terbaca (kontras >= 4.5:1).
- [ ] Chip 5 cerita mengganti cuplikan, referensi, terjemahan, keluaran, skor.
- [ ] "Cerita acak" 20x: tidak mengulang cerita yang sama dan bukan featured; label "Acak #id" tampil; cerita acak menampilkan catatan tanpa terjemahan.
- [ ] Hero "putar ulang" mengulang animasi; angka kata sesuai.
- [ ] Tab ROUGE-L/Loss (mouse dan panah keyboard); catatan clip loss tampil di tab Loss.
- [ ] Tautan sumber dataset (Kaggle) membuka tab baru; footer tanpa NIM, tahun, atau tautan profil.
- [ ] Tab keyboard: urutan logis, fokus selalu terlihat, tidak ada jebakan.
- [ ] 375 px: tanpa overflow horizontal (`document.documentElement.scrollWidth <= innerWidth`), tabel scroll di dalam kartu, target tap >= 44px.
- [ ] 768 dan 1440 px: tata letak tidak patah.
- [ ] `prefers-reduced-motion: reduce`: tidak ada animasi.
- [ ] Refresh di `#/hasil` dan di subpath Pages membuka halaman yang sama.

## Otomasi tambahan sebelum rilis

- `npm run lint`, `npm run build` (termasuk `tsc -b`).
- `npm audit --omit=dev`.
- `impeccable detect --json src` sekali setelah UI selesai.
- Gerbang antislop (PASS/FAIL dengan bukti).

## Definisi selesai

Semua tes hijau, lint dan build hijau, checklist manual terisi tanpa FAIL, dan angka di situs sama dengan `src/data/results.ts`. Hasil yang gagal atau dilewati dilaporkan apa adanya.
