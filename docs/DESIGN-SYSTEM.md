# Design System

Sumber kebenaran visual: `docs/design/*.dc.html`. Dokumen ini merangkum token dan aturan supaya kode tidak menebak.

**Dial (antislop):** ENERGY 2 / RHYTHM 3 / MOTION 2.
**Motif identitas:** pola kawung halus (titik emas dan elips tipis) di pita biru atas, aksara Jawa "ꦫ" pada logo dan "ꦫꦶꦁꦏꦼꦱꦤ꧀" (ringkesan) di hero. Satu aksen: amber.

## Alasan keputusan (satu baris tiap)

- **Biru tua + amber:** biru tua memberi kesan arsip/akademik; amber menandai satu hal penting per layar (soroti, aktif).
- **Terang sebagai awal, gelap tersedia:** penonton membaca teks panjang; gelap mengikuti sistem pengguna.
- **Tiga tipografi:** judul tegas (Schibsted Grotesk), isi sangat terbaca (Atkinson Hyperlegible), angka dan token model monospace (IBM Plex Mono) agar `<extra_id_0>` dan skor terlihat sebagai data.
- **Kartu putus-putus untuk baseline:** baseline bukan model, jadi bentuknya berbeda.
- **Hero gelap, konten terang yang menimpa hero (-72px):** memberi titik fokus dan kedalaman tanpa dekorasi tambahan.

## Token warna

| Token | Terang | Gelap | Fungsi |
|---|---|---|---|
| `--bg` | `#F8FAFC` | `#0B1220` | latar halaman |
| `--surface` | `#FFFFFF` | `#111A2E` | kartu |
| `--surface-2` | `#F1F5F9` | `#0E1628` | panel sekunder, kolom keluaran |
| `--sel` | `#E9EEF5` | `#1E2A44` | item terpilih, trek tab |
| `--ink` | `#0F172A` | `#E2E8F0` | teks utama |
| `--ink-2` | `#334155` | `#CBD5E1` | teks sekunder |
| `--muted` | `#475569` | `#94A3B8` | keterangan |
| `--border` | `#CBD5E1` | `#2A3650` | garis kartu |
| `--border-soft` | `#E2E8F0` | `#1E293B` | pemisah halus |
| `--primary` | `#1E3A5F` | `#93C5FD` | tautan, seri Hybrid |
| `--hl-bg` / `--hl-line` | `#FFE4E6` / `#E11D48` | `rgba(244,63,94,.28)` / `#FB7185` | sorot bagian yang beda dari referensi |
| `--good` | `#166534` | `#4ADE80` | kenaikan positif |

Tetap (tidak berubah per tema): hero `#13294B`, teks hero `#FFFFFF`/`#CBD5E1`, aksen `#F59E0B` (fokus, logo) dan `#FBBF24` (angka kunci di hero), seri grafik Murni `#94A3B8` dan GTrans `#64748B`.

Aturan: maksimal 2-3 warna inti + 1 aksen. Warna tidak pernah menjadi satu-satunya pembeda (garis putus-putus untuk Murni di grafik, label langsung di ujung garis).

## Tipografi

| Peran | Font | Ukuran | Catatan |
|---|---|---|---|
| H1 hero | Schibsted Grotesk 800 | 54/1.04, `-0.03em` | `max-width: 14ch` |
| H1 halaman Hasil | Schibsted Grotesk 800 | 48/1.05 | |
| H2 bagian | Schibsted Grotesk 800 | 34 (bagian), 22 (kartu grafik), 18 (panel) | `-0.02em` |
| Isi | Atkinson Hyperlegible 400/700 | 16/1.55, teks Jawa 16/1.75-1.8 | `lang="jv"` pada teks Jawa |
| Angka, token, skor | IBM Plex Mono 400/500 | 14-40 | |
| Aksara Jawa | Noto Sans Javanese 400/700 | 48 (hero), 18 (logo) | hiasan, `aria-hidden` bila tidak bermakna |

Panjang baris isi maksimal 70 karakter. Minimum teks 13px (hanya keterangan).

## Tata letak dan bentuk

- Lebar maksimum 1200px, gutter 24px (16px di mobile).
- Jarak antar bagian: 72px (Demo), 32px (Hasil).
- Radius: kartu 14-16px, tombol/tab 7-10px, chip dan sakelar 999px (hanya kontrol kecil). Tidak semua elemen pill.
- Elevasi: hanya kartu alat peringkas dan kartu skor yang mengambang (`0 12px 32px -12px rgba(19,41,75,.28)`); sisanya border.
- Target tap minimal 44px.

## Komponen

| Komponen | Aturan |
|---|---|
| Header/nav | tautan hanya ke halaman/bagian yang ada; item aktif latar putih 12%; sakelar ID/EN `aria-pressed`; tombol tema ber-`aria-label` dwibahasa |
| Chip cerita | `role="radio"`, tag best/mid/worst berwarna lembut (hijau, indigo, merah) dengan teks, bukan warna saja |
| Kartu model | urutan Hybrid, GTrans, Murni; kartu Hybrid border 2px `--primary`; bar skor animasi `scaleX` |
| Sorotan beda-referensi | `--hl-bg` + garis bawah `--hl-line` 2px; legenda di bawah kolom |
| Kartu temuan | variasi isi (token monospace, angka besar); satu kartu biru solid untuk temuan terpenting |
| Kartu baseline | border putus-putus, latar `--surface-2`, label "tanpa model" |
| Tab kurva | `role="tablist"`, thumb bergeser, panah kiri/kanan berpindah |
| Grafik SVG | `role="img"` + `aria-label` ringkas, `<title>` per titik, label langsung, tanpa legenda warna saja |
| Tabel | `<caption>`, `<th scope>`, scroll horizontal di dalam kartu |

## Motion

- Durasi: 100ms (tekan), 150ms (hover), 200-300ms (masuk), 900ms (garis grafik). Easing keluar `cubic-bezier(.16,1,.3,1)`.
- Animasi masuk (`rv`) berurutan 60-80ms; scroll-reveal hanya bila `animation-timeline: view()` didukung.
- Hero: kalimat yang dibuang meredup, yang dipertahankan disorot amber; ada tombol putar ulang.
- Hanya animasikan `transform` dan `opacity`. `prefers-reduced-motion: reduce` mematikan semuanya.

## Aksesibilitas

- Kontras: teks normal >= 4.5:1, teks besar >= 3:1, diuji di kedua tema (`check_contrast`).
- Fokus: `outline: 2px solid #F59E0B; outline-offset: 2px` pada semua kontrol; jangan `outline: none` tanpa pengganti.
- Region `aria-live="polite"` untuk kolom keluaran model.
- Tautan eksternal: `rel="noopener noreferrer"`.

## Dilarang (anti-slop)

Gradien ungu-biru, glassmorphism di banyak elemen, ikon sparkle/robot, badge "AI Powered", em dash di teks, statistik atau testimoni tanpa sumber, kartu fitur identik, loading palsu, CTA generik ("Get Started", "Learn More").
