# Design System

Sumber kebenaran visual: `docs/design/*.dc.html`. Dokumen ini merangkum token dan aturan supaya kode tidak menebak.

**Dial (antislop):** ENERGY 2 / RHYTHM 3 / MOTION 2.
**Motif identitas:** pola kawung halus (titik emas dan elips tipis) di pita biru atas, logo berupa ubin amber dengan huruf Ra navy, dan aksara Jawa "ꦫꦶꦁꦏꦼꦱꦤ꧀" (ringkesan) di hero. Satu aksen: amber.

**Logo (`.brand-mark`):** SVG inline di `src/components/Header.tsx`, `viewBox` 0 0 256 256. Ubin `#F59E0B` dengan radius 56 (sekitar 22%), huruf Ra `#13294B` sebagai path (bukan teks font). Ukuran 34 px; 28 px di bawah 768 px; 26 px di bawah 360 px. Berkas `public/favicon.svg` dan `public/apple-touch-icon.png` memakai gambar yang sama.

## Alasan keputusan (satu baris tiap)

- **Biru tua + amber:** biru tua memberi kesan arsip/akademik; amber menandai satu hal penting per layar (soroti, aktif).
- **Terang sebagai awal, gelap tersedia:** penonton membaca teks panjang; gelap mengikuti sistem pengguna.
- **Tiga tipografi:** judul tegas (Schibsted Grotesk), isi sangat terbaca (Atkinson Hyperlegible), angka dan token model monospace (IBM Plex Mono) agar `<extra_id_0>` dan skor terlihat sebagai data.
- **Kartu putus-putus untuk baseline:** baseline bukan model, jadi bentuknya berbeda.
- **Hero gelap, konten terang yang menimpa hero (`--pull`, 48 sampai 72px sesuai lebar layar):** memberi titik fokus dan kedalaman tanpa dekorasi tambahan.

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
| `--focus` | `#B45309` | `#F59E0B` | cincin fokus (amber `#F59E0B` hanya 2.15:1 di atas putih) |
| `--series-murni` | `#EA580C` | `#FED7AA` | seri grafik Murni (garis putus-putus, pola diagonal di histogram) |
| `--series-gtrans` | `#3B0764` | `#8250F2` | seri grafik GTrans (garis titik-titik, pola titik di histogram) |

Tetap (tidak berubah per tema): hero `#13294B`, teks hero `#FFFFFF`/`#CBD5E1`, aksen `#F59E0B` (logo, fokus di dalam band biru) dan `#FBBF24` (angka kunci di hero).

Kontras seri (angka dari komentar di `src/styles.css`, bukan hasil ukur ulang dokumen ini): terang, Murni 3,56:1 dan GTrans 14,99:1 terhadap `#fff`, Murni terhadap GTrans 4,21:1. Gelap, Murni 12,8:1 dan GTrans 3,62:1 terhadap `#111a2e`, Murni terhadap GTrans 3,54:1. Murni dan GTrans memenuhi >= 3:1 terhadap permukaan di kedua tema. Keputusan audit: kontras Hybrid (`--primary`) terhadap seri lain boleh di bawah 3:1, karena pembedanya garis solid dan penanda segitiga. Tiga warna tidak mungkin saling >= 3:1 sekaligus di latar putih, jadi pola dan bentuk adalah pembeda wajib.

Aturan: maksimal 2-3 warna inti + 1 aksen. Warna tidak pernah menjadi satu-satunya pembeda: garis Murni putus-putus (`6 5`), GTrans titik-titik (`2 3`), Hybrid solid; penanda Murni lingkaran, GTrans kotak, Hybrid segitiga (`MODEL_DASH` dan `MODEL_SHAPE` di `src/components/models.ts`); label langsung di ujung garis. Sorotan beda (`--hl-bg`, `<mark class="diff">`) wajib punya penanda non-warna: garis bawah 2px (`inset 0 -2px`), dan `<span class="sr-only">` berisi `demo.diffMarker` ("(beda)") di setiap sorotan. Legenda di bawah kolom punya tambahan sr-only `demo.diffLegend`. Batang histogram: Murni pola garis diagonal (`<pattern>`), GTrans pola titik, Hybrid solid. Id `<pattern>` berprefiks `dist-pat-` (hanya histogram), supaya tidak bentrok antar grafik.

## Tipografi

| Peran | Font | Ukuran | Catatan |
|---|---|---|---|
| H1 hero | Schibsted Grotesk 800 | `clamp(38px, 6vw, 54px)`, line-height 1.04, `-0.03em` | `max-width: 14ch` |
| H1 halaman Hasil | Schibsted Grotesk 800 | `clamp(34px, 7vw, 48px)`, line-height 1.05 | |
| H2 bagian | Schibsted Grotesk 800 | 34 (bagian), 22 (kartu grafik), 18 (panel) | `-0.02em` |
| Isi | Atkinson Hyperlegible 400/700 | 16/1.55, teks Jawa 16/1.75-1.8 | `lang="jv"` pada teks Jawa |
| Angka, token, skor | IBM Plex Mono 400/500 | 14-40 | |
| Aksara Jawa | Noto Sans Javanese 400 | 48 (hero) | hiasan, `aria-hidden` bila tidak bermakna. Logo tidak memakai font (lihat Motif) |

Panjang baris isi maksimal 70 karakter. Minimum teks 13px untuk keterangan; label sumbu grafik dan tag 12px (E2E memeriksa font SVG efektif >= 12px).

## Tata letak dan bentuk

- Lebar maksimum 1200px, padding samping 24px (`.container`). Di bawah 360px header memakai 16px; di bawah 480px `.chart-card`, `.side-card`, `.tool-col` memakai 20px dan `.picker` 16px 20px.
- Jarak antar bagian: `clamp(40px, 6vw, 72px)` (Demo, `--space-section`), 32px (Hasil).
- Radius: kartu 14-16px, tombol/tab 7-10px, chip dan sakelar 999px (hanya kontrol kecil). Tidak semua elemen pill.
- Elevasi: hanya kartu alat peringkas (`.tool`, `0 12px 32px -12px rgba(19,41,75,.28)`) dan kartu skor (`.score-card`, `0 10px 28px -14px rgba(19,41,75,.3)`) yang mengambang; sisanya border.
- Target tap minimal 44px.

### Breakpoint

Variabel CSS tidak bisa dipakai di kondisi `@media`, jadi nilainya ditulis literal di `src/styles.css` dan dicatat di sini. Daftar ini per 2026-10-14; tambahkan baris bila `@media` baru ditulis. Batas di bawah ditulis `767.98px` dan `479.98px`, `359.98px` (bukan 767, 479, 359) supaya pasangan `min-width` 768 dan 480 tidak menyisakan celah desimal.

| Kondisi `@media` | Dipakai untuk |
|---|---|
| `(max-width: 767.98px)` | header jadi dua baris di bawah 768px: baris 1 merek, bahasa, dan tema; baris 2 tiga tautan berbagi satu baris penuh (`.nav-links` menjadi `display: contents`). `.tool-body` satu kolom; `.tool-col-out` pindah ke bawah |
| `(max-width: 479.98px)` | padding `.chart-card`, `.side-card`, `.tool-col` 20px; `.picker` 16px 20px |
| `(max-width: 359.98px)` | header di 320px: padding samping 16px, merek 14px, logo 26px |
| `(min-width: 480px)` | `.score-cards` 2 kolom |
| `(min-width: 768px)` | `.hero-stats` 4 kolom (di bawah itu 2x2) |
| `(min-width: 1280px)` | `.score-cards` 4 kolom |
| `(hover: hover)` | efek hover (chip, `.picker-select`, `.finding`, `.score-card`, tautan nav, baris tabel, `.stat-link`) hanya untuk pointer |
| `(forced-colors: active)` | tab terpilih memakai `Highlight`; chip, segmented, dan tombol bahasa terpilih mendapat outline; bar memakai outline |
| `(prefers-reduced-motion: reduce)` | matikan semua animasi dan transisi |

Aturan header mobile: di bawah 768px header dua baris (lihat tabel). Tinggi header diukur sekitar 105 px pada semua lebar di bawah 768px (ukuran audit, belum diukur ulang di dokumen ini). E2E menjaga batas 120 px untuk lebar 767 px ke bawah (`e2e/responsive.e2e.ts`, konstanta `HEADER_MAX`).

Tanpa breakpoint: `.results-row` memakai flex-basis 700 px untuk grafik dan 300 px untuk kolom samping (dibungkus, jadi bertumpuk bila sempit). Tata letak lain memakai `auto-fit` + `minmax` (misal `.finding-grid`, min 400px). Grafik punya lebar minimum di dalam `.chart-scroll` yang bisa digulir: 680px untuk grafik dengan viewBox 680 (kurva dan distribusi), 640px untuk grafik latihan (viewBox 640). Di bawah lebar itu grafik tidak mengecil, cukup digulir.

## Komponen

| Komponen | Aturan |
|---|---|
| Header/nav | tautan hanya ke halaman/bagian yang ada; item aktif latar putih 12%; sakelar ID/EN `aria-pressed`; tombol tema ber-`aria-label` sesuai bahasa aktif (`t.nav.themeToLight` / `themeToDark`) |
| Skip link | `<button class="skip-link">` pertama di urutan tab; memfokus `<main id="main" tabIndex={-1}>`. Jangan `href="#main"`, itu merusak hash route |
| Chip cerita | `<input type="radio">` sr-only di dalam `label.chip`, semua di satu `role="radiogroup"` yang hanya berisi chip (select dan tombol di luar); tag best/mid/worst berwarna lembut (hijau, indigo, merah) dengan teks, bukan warna saja |
| Kartu model | urutan Hybrid, GTrans, Murni; kartu Hybrid border 2px `--primary`; bar skor `scaleX` dengan transisi `transform` 300 ms; skor dua desimal |
| Hero | kalimat yang dibuang dalam `<del class="cut">` (dicoret, opacity 0.6, animasi `dim` mati saat reduced motion); kalimat yang dipertahankan disorot `.keep` |
| Sorotan beda-referensi | `--hl-bg` + garis bawah `--hl-line` 2px; sr-only `(beda)` di setiap sorotan; legenda di bawah kolom |
| Kartu temuan | variasi isi (token monospace, angka besar); satu kartu biru solid untuk temuan terpenting |
| Kartu baseline | border putus-putus, latar `--surface-2`, label "tanpa model" |
| Tab kurva | `role="tablist"`, garis bawah 3px `--primary` pada tab terpilih (bukan hanya tint thumb); panah kiri/kanan, Home, dan End berpindah dan memindah fokus (`nextMetric` di `src/lib/chart.ts`). Tab terpilih `tabIndex={0}`, lainnya `-1`. `#curve-panel` (tabpanel) tidak fokus-able, supaya tidak menjadi tab stop kedua; tab stop berikutnya adalah `.chart-scroll` (`role="region"`, `tabindex="0"`, label unik) |
| Grafik SVG | `role="img"` + `aria-label` ringkas, `<title>` per titik, label langsung. Pembeda selain warna: pola garis (`MODEL_DASH`), bentuk penanda (`MODEL_SHAPE`), pola batang histogram. Tiap grafik punya `details.chart-data` (`<summary>` unik) berisi `ChartTable` (`src/components/ChartTable.tsx`). Koordinat SVG tetap titik (bukan koma) |
| Tabel | `<caption>`, `<th scope>`, `.table-wrap` (`role="region"`, `tabindex="0"`, label unik) dengan scroll horizontal di dalam kartu |

## Motion

- Durasi: 100ms (tekan), 150ms (hover), 200-300ms (masuk), 900ms (garis grafik). Easing keluar `cubic-bezier(.16,1,.3,1)`.
- Animasi masuk (`rv`) berurutan 60-80ms; scroll-reveal hanya bila `animation-timeline: view()` didukung.
- Hero: kalimat yang dibuang meredup, yang dipertahankan disorot amber; ada tombol putar ulang.
- Animasi gerak memakai `transform` dan `opacity`. Pengecualian yang ada di kode: garis grafik (`.line`, `stroke-dashoffset`), transisi warna pada chip, baris tabel, dan `.lang-btn`. `prefers-reduced-motion: reduce` mematikan semuanya.

## Aksesibilitas

- Kontras: teks normal >= 4.5:1, teks besar >= 3:1. Diuji di kedua tema lewat axe pada E2E; node yang axe tandai "incomplete" tidak dihitung gagal (lihat `TESTING.md`).
- Fokus: `outline: 2px solid var(--focus); outline-offset: 2px` pada semua kontrol. Di band biru (`.masthead`) memakai `--accent` (#F59E0B); di kartu biru temuan memakai `--accent-soft` (#FBBF24). Skip link (`<button class="skip-link">`) berlatar `--accent-soft` dengan teks gelap 11,2:1, dan saat fokus mendapat outline putih 3px plus cincin gelap 5px (`box-shadow`). Pengecualian `outline: none`: `main` dan `section[tabindex='-1']` (target fokus programatik untuk seluruh wilayah). Jangan tambah pengecualian lain tanpa pengganti fokus.
- Area yang bisa digulir (`.chart-scroll`, `.table-wrap`) adalah tab stop dan punya cincin fokus sendiri. `details.chart-data > summary` memakai outline `-4px` di dalam kotaknya, karena `details` memotong yang keluar.
- Forced colors (`@media (forced-colors: active)`): chip terpilih, `segmented` aktif, dan tombol bahasa aktif mendapat `outline: 2px solid Highlight`; tab terpilih memakai bar `Highlight`; `.bar-fill` memakai outline `CanvasText`. Diperiksa E2E lewat computed style `outline-style`, bukan dengan mode Windows High Contrast sungguhan.
- Grafik di layar sempit: lebar minimum 680 px (640 px untuk grafik latihan) dan digulir di dalam kartu (`.chart-scroll`, `tabindex="0"`), supaya teks sumbu tetap terbaca.
- `overflow: hidden` hanya dipakai di `.sr-only`. Kontainer konten tidak memotong (`.tool` sudah tidak memotong). Kontainer yang menggulir dan `details.chart-data` diberi `position: relative`, karena elemen `.sr-only` di dalamnya harus tetap terpotong di dalam wadah yang menggulir.
- Region `role="status"` (polite) hanya untuk pesan "Tautan disalin" dan hitungan (satu region di `Summarizer`). Ganti bahasa tidak boleh membunyikannya; pesan dikosongkan saat bahasa berganti.
- Tautan eksternal: `rel="noopener noreferrer"`.

**Keputusan aksesibilitas yang diterima (2026-10-14):** (a) judul cerita Jawa di wilayah `role="status"` tidak diberi `lang="jv"`, karena kamus bertipe string dan judul diperlakukan seperti nama diri (pengecualian WCAG 3.1.2); judul di chip dan opsi select tetap `lang="jv"`. (b) Kartu model (`article`) tidak diberi nama aksesibel, karena h3 di dalamnya sudah cukup. (c) Tiga `details.chart-data` yang tertutup tetap di-mount, tanpa biaya layout. (d) Tiga seri tidak mungkin saling 3:1 di latar putih, jadi pola, dash, dan bentuk penanda adalah pembeda wajib (lihat "Kontras seri" di atas). (e) Node `incomplete` axe untuk kontras (29 di beranda, 54 di Hasil) dicek manual, bukan dihitung gagal; lihat `TESTING.md`.

## Dilarang (anti-slop)

Gradien ungu-biru, glassmorphism di banyak elemen, ikon sparkle/robot, badge "AI Powered", em dash di teks, statistik atau testimoni tanpa sumber, kartu fitur identik, loading palsu, CTA generik ("Get Started", "Learn More").
