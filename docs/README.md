# Ringkas Jawa

Demo dan hasil skripsi **peringkasan cerita berbahasa Jawa** dengan `google/mt5-small`, dikemas sebagai situs portofolio statis (React + TypeScript + Vite). Dua halaman: **Demo** (keluaran asli tiga model pada dokumen uji nyata) dan **Hasil** (skor, kurva pelatihan, konfigurasi, keterbatasan). Bahasa ID/EN, mode terang/gelap.

> Temuan utama yang sengaja ditampilkan apa adanya: baseline sederhana (lead-2, ROUGE-L 0.867) masih mengalahkan model terbaik (Hybrid, 0.7976), karena referensi memakai proksi lead-2 dan model cenderung menyalin awal cerita.

Demo live: _diisi setelah deploy GitHub Pages_.

## Dokumen proyek

| Dokumen | Isi |
|---|---|
| [PRD.md](PRD.md) | tujuan, pengguna, ruang lingkup, alur, wireframe |
| [ARCHITECTURE.md](ARCHITECTURE.md) | tech stack, struktur, aliran data, keputusan |
| [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | token, tipografi, komponen, motion, aksesibilitas |
| [SECURITY.md](SECURITY.md) | ancaman, privasi, checklist rilis |
| [CODE-STYLE.md](CODE-STYLE.md) | gaya kode dan commit |
| [TESTING.md](TESTING.md) | strategi tes dan checklist verifikasi |
| [AGENTS.md](AGENTS.md) | aturan untuk agen AI |
| [design/](design) | salinan desain kanvas (Main, Hasil, Mobile) |

## Mulai cepat

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # produksi ke dist/
npm run lint
npm run test       # tersedia setelah vitest dipasang
```

Untuk GitHub Pages di subpath: `BASE_PATH=/ringkas-jawa/ npm run build`.

## Ringkasan hasil

| Skenario | Pasangan latih | ROUGE-L |
|---|---|---|
| Murni | 633 | 0.3978 |
| GTrans | 1.000 | 0.6437 |
| Hybrid | 1.633 | 0.7976 |
| Baseline lead-2 (tanpa model) | 0 | 0.867 |

Uji pada 70 cerita Jawa murni; 8 epoch; `google/mt5-small`; beam 4. Detail lengkap dan keterbatasan ada di halaman Hasil.

## Status

Implementasi selesai sampai audit (2026-10-09); tinggal deploy GitHub Pages. Jurnal MATICS masih dalam proses. Cerita berasal dari [GPT2 Javanese Dataset](https://www.kaggle.com/datasets/lutfiandri/gpt2-javanese-dataset) (Lutfi Andriyanto, Kaggle; lisensi tidak dicantumkan pengunggah).

## Penulis

Ahmad Syafrian Cahyadi
