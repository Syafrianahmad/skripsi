# AGENTS.md

Instruksi untuk agen AI (Claude Code, dll.) yang bekerja di repo ini. Baca ini dulu, lalu dokumen yang relevan di folder yang sama.

## Proyek dalam 3 baris

Situs portofolio statis "Ringkas Jawa": demo dan hasil skripsi peringkas cerita Jawa (`google/mt5-small`). React 19 + TypeScript + Vite, data JSON statis, deploy GitHub Pages. Sumber kebutuhan: `PRD.md`; urutan kerja mengikuti bagian "Struktur" di `ARCHITECTURE.md`.

## Dokumen

| File | Isi |
|---|---|
| `PRD.md` | apa dan untuk siapa, ruang lingkup, alur, wireframe |
| `ARCHITECTURE.md` | stack, struktur, aliran data, keputusan |
| `DESIGN-SYSTEM.md` | token, tipografi, komponen, motion |
| `SECURITY.md` | ancaman, privasi, aturan data |
| `CODE-STYLE.md` | gaya kode dan commit |
| `TESTING.md` | apa yang dites dan checklist verifikasi |

## Perintah

```bash
npm install
npm run dev        # server dev
npm run build      # tsc -b && vite build
npm run lint
npm run test       # vitest run (tersedia setelah vitest dipasang)
npm run preview    # uji bundle produksi
```

## Aturan keras

1. **Git:** jangan jalankan perintah git yang mengubah repo (commit, push, merge, rebase, reset, branch, tag, stash). Berikan perintahnya dalam blok `bash`; Suiryu yang menjalankan. `status`, `log`, `diff`, `show` boleh. Jangan tambahkan `Co-Authored-By` di commit/PR.
2. **Jangan ubah angka.** Skor, kurva, dan n-gram di `src/data/` berasal dari notebook; salin verbatim. Bila tampak salah, laporkan, jangan "perbaiki".
3. **Narasi jujur.** Jangan menutupi bahwa baseline lead-2 (0.867) > Hybrid (0.7976, selalu empat desimal). Jangan menambah klaim, statistik, atau testimoni tanpa sumber.
4. **Privasi:** tanpa NIM, tahun lulus, atau data pribadi lain. Jurnal MATICS hanya label, tanpa PDF.
5. **Tanpa dependensi runtime baru.** Dev dependency hanya dengan persetujuan; saat ini tambahan yang disetujui: `vitest`.
6. **Teks UI hanya di `src/i18n/`** (ID dan EN selalu berpasangan, tipe `Dict` memaksa kuncinya sama). Tanpa em dash di teks.
7. **Bahasa kerja:** Indonesia untuk percakapan dan dokumen; kode dan identifier Inggris; commit boleh Indonesia.
8. Sebelum memakai satu bagian desain, cek `docs/design/*.dc.html` dan `DESIGN-SYSTEM.md`. Kontras dan fokus keyboard tidak boleh turun.

## Alur kerja

1. Baca bagian terkait di `PRD.md` dan `ARCHITECTURE.md`; tulis tes dulu untuk logika di `src/lib/` (lihat `TESTING.md`).
2. Implementasi sekecil mungkin yang lulus tes.
3. `npm run build && npm run lint && npm run test` sebelum menyatakan selesai.
4. Untuk UI: jalankan di browser, cek terang+gelap, 375 px dan 1440 px, klik tiap kontrol.
5. Laporkan hasil apa adanya, termasuk yang gagal atau dilewati.

## Skill yang berguna

`ecc:react-patterns`, `ecc:vite-patterns`, `antislop:antislop` (gerbang sebelum menyerahkan UI), `impeccable:impeccable` (detektor desain di akhir), `ponytail` (solusi paling ramping).

## Jangan lakukan

- Menambah backend, database, analitik, atau form.
- Membuat fitur "model live" tanpa persetujuan.
- Menghapus kredit dataset (GPT2 Javanese Dataset, Kaggle, lisensi "Unknown") atau menambah cerita dari sumber lain tanpa mengecek lisensinya.
- Menyentuh `dist/` atau `node_modules/` (bukan sumber).
