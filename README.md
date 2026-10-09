# Ringkas Jawa

Demo dan hasil skripsi **peringkasan cerita berbahasa Jawa** dengan `google/mt5-small`, dikemas sebagai situs portofolio statis. Dua halaman: **Demo** (keluaran asli tiga model pada dokumen uji nyata) dan **Hasil** (skor, kurva pelatihan, konfigurasi, keterbatasan). Bahasa ID/EN, mode terang/gelap.

> Temuan utama ditampilkan apa adanya: baseline sederhana (lead-2, ROUGE-L 0.867) masih mengalahkan model terbaik (Hybrid, 0.7976), karena referensi memakai proksi lead-2 dan model cenderung menyalin awal cerita.

Demo live: _diisi setelah deploy GitHub Pages_.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # produksi ke dist/ (dengan Content-Security-Policy)
npm run preview    # uji bundle produksi
npm run lint
npm run test
```

Untuk GitHub Pages di subpath: `BASE_PATH=/<nama-repo>/ npm run build`.

## Teknologi

React 19, TypeScript, Vite 8, CSS biasa, data JSON statis, Vitest. Tanpa backend dan tanpa pelacak. Font di-host sendiri (lisensi SIL OFL di `src/fonts/licenses/`).

## Dokumen

Semua dokumen proyek ada di [`docs/`](docs/README.md): PRD, arsitektur, design system, keamanan, gaya kode, pengujian, dan aturan untuk agen AI.

## Penulis

Ahmad Syafrian Cahyadi · [LinkedIn](https://www.linkedin.com/in/ahmad-syafrian-cahyadi-609790430/) · [GitHub](https://github.com/suiryuu-cmd)
