# PRD: Ringkas Jawa

Product Requirements Document. Status: draf untuk disetujui Suiryu, 2026-10-08.

## 1. Ringkasan

**Ringkas Jawa** adalah situs portofolio statis untuk skripsi Suiryu: fine-tuning `google/mt5-small` untuk meringkas cerita berbahasa Jawa. Situs menunjukkan keluaran asli tiga model pada dokumen uji nyata, hasil eksperimen, dan, dengan jujur, kenapa baseline sederhana (lead-2) masih mengalahkan semua model.

**Mengapa dibuat:** skripsi hanya berupa notebook dan naskah. Portofolio perlu bukti yang bisa dibuka dalam dua menit oleh orang yang tidak mau menjalankan notebook.

## 2. Pengguna dan tujuan

| Pengguna | Ingin tahu | Keberhasilan |
|---|---|---|
| Rekruter / calon pemberi kerja (prioritas 1) | Apa yang dibangun, apa yang dipelajari, apakah orangnya teliti | Paham proyek dalam 2 menit, melihat penilaian kritis atas hasil sendiri |
| Penguji skripsi (prioritas 2) | Apakah metodenya benar, hasilnya jujur, keterbatasannya diakui | Menemukan angka, konfigurasi, dan keterbatasan tanpa mencari |

Prioritas utama: **portofolio**. Penguji tetap harus terlayani karena halaman Hasil menjadi lampiran teknis.

## 3. Ruang lingkup

### Wajib (v1)
1. Halaman **Demo**: hero sebelum/sesudah, alat peringkas dengan 5 cerita pilihan + cerita acak, keluaran tiga model dengan skor ROUGE-L, kartu temuan, bagian "di balik layar" (5 langkah).
2. Halaman **Hasil**: kartu skor, grafik data latih vs ROUGE-L, kurva per epoch (ROUGE-L dan loss), tabel n-gram baru, tabel rincian skenario, konfigurasi eksperimen, catatan keterbatasan.
3. Dua bahasa **ID/EN**, awal mengikuti browser, fallback EN.
4. Mode **terang/gelap**, awal mengikuti sistem.
5. Footer: nama, prodi, kampus, label jurnal "dalam proses", kredit dataset. Tanpa tautan profil (LinkedIn/GitHub), keputusan 2026-10-09.
6. Deploy otomatis ke GitHub Pages.

### Tidak dibuat (sengaja)
- **Model live / input teks bebas.** Bobot belum dihosting; demo memakai keluaran asli yang sudah tersimpan.
- Akun, login, database, backend, analitik pelacak, komentar.
- PDF jurnal MATICS (masih proses; cukup label).
- NIM, tahun lulus, atau data pribadi lain di situs.
- Testimoni, statistik pengunjung, atau klaim tanpa sumber.
- Terjemahan bantu untuk semua 70 dokumen (hanya 5 pilihan, dilabeli "AI, belum diverifikasi").

## 4. Narasi yang wajib jujur

Situs tidak boleh terlihat lebih baik dari hasilnya.

- Baseline lead-2 (dua kalimat pertama, tanpa model) ROUGE-L **0.867** > Hybrid **0.7976** (ditulis empat desimal di semua tempat, sama dengan notebook).
- Referensi adalah proksi lead-2, bukan ringkasan buatan manusia; skor mengukur kemiripan dengan lead-2.
- N-gram baru 1-gram: Murni 0.9%, GTrans 1.5%, Hybrid 3.0% (sangat ekstraktif).
- Artefak: `<extra_id_0>` muncul 70/70 (Murni) dan 67/70 (GTrans); "Aku" mengawali 50/70 keluaran Hybrid.
- Sumber cerita: [GPT2 Javanese Dataset](https://www.kaggle.com/datasets/lutfiandri/gpt2-javanese-dataset) (Lutfi Andriyanto, Kaggle). Lisensi di Kaggle "Unknown", jadi kredit wajib tampil (di bawah cuplikan dan di footer) dan cerita hanya tampil sebagai cuplikan untuk penelitian.

## 5. Alur pengguna

**Alur A: rekruter (utama)**
1. Buka situs → hero menunjukkan 4 kalimat menyusut jadi 2 → paham ide dalam 5 detik.
2. Gulir ke alat peringkas → cerita #68 sudah terpilih → baca keluaran tiga model.
3. Klik cerita lain atau "Cerita acak" → keluaran berubah, skor berubah.
4. Gulir ke "Temuan" → membaca kenapa hasilnya tidak sebaik skor.
5. Lihat nama, afiliasi, dan status jurnal penulis di footer.

**Alur B: penguji**
1. Buka halaman **Hasil** dari nav → lihat kartu skor dan baseline putus-putus.
2. Baca grafik data latih vs ROUGE-L → buka tab Loss pada kurva epoch.
3. Periksa tabel n-gram baru dan rincian skenario → cek konfigurasi dan catatan keterbatasan.

**Alur C: ganti bahasa/tema** di header kapan saja; pilihan tersimpan di browser (opsional, tanpa gagal bila diblokir).

## 6. Wireframe (deskripsi)

Sumber visual final: `docs/design/{Main,Hasil,Mobile}.dc.html`.

```
DEMO (desktop 1440)
+----------------------------------------------------------+
| [ꦫ] Ringkas Jawa      Demo  Hasil  Temuan   [ID|EN] [☾]  |  pita biru kawung
|  ꦫꦶꦁꦏꦼꦱꦤ꧀                                                |
|  Judul H1                       +-------------------+     |
|  subjudul                       | sebelum -> sesudah|     |
|  0.7976 | 0.867 | 97%+ | 70     | 46 -> 29 kata     |     |
+----------------------------------------------------------+
|  +----------------------------------------------------+  |  kartu mengambang
|  | Pilih cerita: (68)(40)(69)(60)(50) [Cerita acak]   |  |
|  | Cuplikan + referensi lead-2 | Hybrid / GTrans /    |  |
|  | + terjemahan AI             | Murni (bar + skor)   |  |
|  +----------------------------------------------------+  |
|  TEMUAN: 4 kartu + strip "0.867 > 0.7976"                |
|  DI BALIK LAYAR: 5 baris judul | isi   [Lihat hasil ->]  |
+----------------------------------------------------------+
| Footer: nama, prodi, kampus, jurnal | kredit dataset     |

HASIL
  pita biru + judul | 4 kartu skor (baseline putus-putus)
  grafik data-vs-skor (lebar) | konfigurasi + keterbatasan
  kurva epoch [ROUGE-L|Loss] | tabel n-gram | tabel skenario

MOBILE (375): satu kolom; chip cerita membungkus; keluaran di bawah cerita;
tabel scroll horizontal di dalam kartu; tap target >= 44px.
```

## 7. Kebutuhan non-fungsional

- Kontras WCAG AA di kedua tema; navigasi penuh dengan keyboard; fokus terlihat.
- `prefers-reduced-motion` mematikan semua animasi.
- Tanpa overflow horizontal di 375 px.
- Halaman pertama < 300 KB gzip tanpa font; data 70 dokumen dimuat sekali.
- Tanpa dependensi runtime baru selain React.

## 8. Kriteria selesai

- Semua kontrol berfungsi (klik-lewat tercatat, lihat `TESTING.md`).
- Angka di situs identik dengan `src/data/results.ts` yang berasal dari notebook.
- `npm run build`, `npm run lint`, `npm run test` hijau; live di GitHub Pages dan refresh di `#/hasil` tetap terbuka.

## 9. Pertanyaan terbuka

1. ~~Sumber dataset cerita Jawa~~: terjawab 2026-10-09, GPT2 Javanese Dataset (Kaggle), lisensi "Unknown", kredit dicantumkan.
2. Ganti nama repo ke `ringkas-jawa`? (berpengaruh ke URL Pages).
3. Kapan model live ditambahkan, dan di mana dihosting?
4. Notebook ke `research/` setelah path Drive dibersihkan.
