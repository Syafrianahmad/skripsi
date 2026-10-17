# Testing

Prinsip: **tes yang gagal jika logikanya salah, tanpa kerangka berlebih.** Situs ini kecil dan statis. Yang diuji otomatis: logika murni, keutuhan data, aturan keamanan yang dipindai dari sumber, output build, dan perilaku browser lewat E2E. Tampilan sisanya diverifikasi manual dengan checklist yang tercatat.

## Alat

- Vitest (`npm run test` = `vitest run`), lingkungan `node`. Tidak ada jsdom atau Testing Library. `vite.config.ts` mengecualikan `e2e/**` dari Vitest.
- Playwright (`@playwright/test` 1.64.0) dan `@axe-core/playwright` 4.13.0, keduanya versi persis, untuk E2E di Chromium. Konfigurasi di `playwright.config.ts`.
- `scripts/check-size.mjs` (`npm run size`) untuk anggaran ukuran build.

## Tes Vitest

17 berkas `*.test.ts`: tiga di root (`security.test.ts`, `csp.test.ts`, `dist.test.ts`), satu di `src/data/`, satu di `src/i18n/`, dan dua belas di `src/lib/`. Tes ada di sebelah modulnya. Satu berkas per modul, tanpa fixture rumit.

| Berkas | Yang dijamin |
|---|---|
| `src/lib/format.test.ts` | `formatInt` (pemisah ribuan per bahasa). `formatDec` dan `gainPercent`: koma desimal dan titik ribuan untuk `id` (`0,7976`, `1.633,5`), titik desimal dan koma ribuan untuk `en` (`0.7976`, `1,633.5`); `gainPercent` (`61,8` / `61.8`); nilai terhadap dirinya sendiri `0,0`; pembulatan seperti `toFixed` sebelum lokalisasi; hasil nol tanpa tanda minus; NaN, tak hingga, dan basis nol tampil `-`; paling banyak satu `Intl.NumberFormat` per bahasa dan jumlah desimal |
| `src/i18n/i18n.test.ts` | paritas `id` dan `en`: kunci, arity fungsi, panjang array, dan tipe daun sama; prosa `id` tanpa pola `\d\.\d` (tanpa pengecualian ribuan); tanpa em dash di kedua kamus; plural `en` (`1 story`, `2 stories`); label area grafik yang bisa digulir berbeda dari judul bagian; kartu Aku memuat contoh token `AkuCIL`; label sr-only (`demo.rougeLabel`, `demo.diffLegend`, `results.scenarios.none`) ada di kedua kamus; `findings.akuMark` dan `quoteMark` memakai "diawali"; `nav.langNames` sama di kedua kamus |
| `src/lib/route.test.ts` | `parseRoute`: hash kosong atau tak dikenal ke demo; `#/hasil`; `#/#temuan` membaca bagian; `#/demo#story=N` hanya untuk bilangan bulat positif tanpa nol di depan dan dalam rentang aman (`#/demo#story=68.5` dan `story=007` bukan cerita; `story=999` terbaca sebagai angka lalu ditolak `isKnown` di DemoPage). `shortStoryId` (id sampai enam digit apa adanya, lebih panjang jadi `999999+`), `linkedStory` (hanya tautan ke cerita lain yang mengganti pilihan), `scrollTargetId`, `isSamePageClick`, dan `goToSection` |
| `src/lib/shuffle.test.ts` | `nextStoryId` tanpa filter: 300 undian (rng terkontrol) tidak pernah memilih featured atau cerita aktif; rng 0 memilih id terkecil, rng 1 id terbesar; dengan filter, featured yang cocok boleh dipilih; melempar bila tak ada kandidat |
| `src/lib/chart.test.ts` | `yScore`, `xEpoch`, `xPairs` cocok dengan titik desain; nilai di atas 1 dijepit ke atas; `polyline` (satu desimal, tanpa nol di belakang); `nextMetric`: panah kiri dan kanan, Home, End; tombol lain `null` |
| `src/lib/findings.test.ts` | `storyIds` cocok dengan angka di kartu Temuan (50 diawali `Aku`, 17 kutipan); predikat pada dokumen sintetis: ` aku...` terhitung `aku`, `“Aku` dan `"Aku` terhitung kutipan dan bukan `aku` |
| `src/lib/storage.test.ts` | localStorage yang melempar atau tidak ada: `readStored` mengembalikan null, `writeStored` tidak melempar; nilai tak valid dikembalikan apa adanya |
| `src/lib/lang.test.ts`, `src/lib/theme.test.ts` | `detectLang` (locale Indonesia ke `id`, Inggris ke `en`, tak didukung atau kosong ke `en`, urutan preferensi); `resolveLang` (pilihan tersimpan menang, nilai tak valid diabaikan); `resolveTheme` (tersimpan menang atas sistem, nilai tak dikenal diabaikan); `systemPrefersDark` false tanpa `matchMedia` |
| `src/lib/words.test.ts`, `distribution.test.ts`, `compare.test.ts` | hitung kata dan pemisahan kalimat (hero #68: 46 jadi 29 kata); `binScores` 10 bin, 1.0 masuk bin terakhir, bin di bawah 0,5 cocok dengan Temuan; `markAgainst` menandai kata yang tidak ada di output lain, tanpa peduli huruf besar dan tanda baca; `outputText` |
| `src/lib/export.test.ts` | `toCsv`: header `doc,model,rouge_l,output`, kutip untuk pemisah, kutip, dan baris baru. `csvDownload` diawali BOM UTF-8 dan isinya sama dengan `toCsv` setelah BOM. JSON tidak diuji di sini (lihat E2E `download`) |
| `src/data/data.test.ts` | 70 dokumen dengan id unik; 5 featured bertag best, best, mid, mid, worst, dan hanya featured yang bertranslasi; tiga keluaran per dokumen dengan skor di [0, 1]; panjang cerita >= panjang cuplikan; rata-rata ROUGE-L dekat nilai literal (toleransi 0,0005); 9 dokumen Hybrid di bawah 0,5 (id literal); 17 keluaran Hybrid berawal kutipan; keluaran Hybrid id 69 berawal "AkuCIL LAN MERAK"; hitungan Temuan sama dengan keluaran tersimpan; skor dan delta konsisten; 8 epoch per seri; baseline lead-2 lebih tinggi dari Hybrid |
| `security.test.ts` | pindai `src/` (ts, tsx, css) dan `docs/` (md, html, json). Tanpa `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `new Function`; `components/` dan `pages/` tanpa `.toFixed(`; `target="_blank"` selalu `rel="noopener noreferrer"`; index.html dan CSS tanpa pemuat dari origin lain; tanpa sourcemap di `vite.config.ts`; tanpa tautan profil LinkedIn di `src/` dan `docs/`; `history.replaceState` dan `pushState` dilarang di `src/`; tanpa pola mirip token rahasia |
| `csp.test.ts` | `withCsp`: meta CSP pertama di `<head>`; skrip inline lewat hash sha256 (termasuk yang punya atribut selain `src`), tanpa `unsafe-inline`; skrip dari berkas tidak di-hash; gaya inline lewat hash saja; `object-src`, `base-uri`, `form-action` dibatasi; `inlineCss` mengganti tautan CSS dengan isinya dan membuang berkasnya dari bundle |
| `dist.test.ts` | setelah build: meta CSP di `dist/index.html` tanpa `unsafe-inline`; `script-src` dan `style-src` berisi tepat hash blok inline; tanpa berkas `.map` dan tanpa `sourceMappingURL` di JS. `DIST_DIR` menunjuk build lain. Dilewati (`describe.skipIf`) bila `dist/index.html` belum ada |

Catatan `dist.test.ts` di CI (dibaca dari `vite.config.ts` dan perilaku Vitest, belum dicoba di CI): `npm run test` sebelum build tetap hijau, karena `vite.config.ts` mengecualikan berkas ini hanya bila `CI` diset dan `dist/` belum ada. Langkah `npx vitest run dist.test.ts` setelah build berjalan saat `dist/` sudah ada, jadi berkas tidak dikecualikan dan memeriksa build yang baru. Bila `dist/` tetap tidak ada pada langkah itu, berkas dikecualikan, Vitest menulis "No test files found" dan keluar dengan kode 1, sehingga CI gagal. Di lokal tanpa `CI`, berkas ikut dikumpulkan dan `describe.skipIf` melewatinya: tes dilewati, bukan gagal.

## Tes E2E (Playwright + axe)

Sebelas berkas di `e2e/`: sepuluh spec `*.e2e.ts` (routing, i18n, a11y, responsive, content, resilience, download, csp, compare, chart) dan `support.ts` (helper `PAGES`, `FEATURED`, `measureLayout`, bukan spec). Total 92 kasus pada 2026-10-17 (dihitung dari `npx playwright test --list`: 2 halaman x 21 lebar di `responsive`, dan parameter tema, lebar, dan bahasa di tempat lain).

| Berkas | Kasus | Yang dijamin |
|---|---|---|
| `routing.e2e.ts` | 9 | nav Temuan memfokus `#temuan` dan menggulir ke sana walau hash sudah sama. Regresi: nav Temuan tidak mengubah cerita; tautan cerita baru mengganti cerita, menggulir ke `#alat`, dan mereset filter dan mode bandingkan. `#/demo#story=999` (di luar daftar) menampilkan cerita 68 dan pesan `role=status` "Cerita #999 tidak ditemukan, menampilkan #68."; `#/demo#story=7` tidak memunculkan pesan. Nav Detail eksperimen memfokus `h1` dan hash `#/hasil`. Klik brand atau Demo tanpa hash menggulir ke atas. Ctrl+klik brand tidak di-`preventDefault`. Judul tab sesuai halaman |
| `i18n.e2e.ts` | 6 | UI `id`: skor `0,7976`, kenaikan `+61,8%`, `1.633`; tanpa desimal bertitik di teks tampil dan tabel (`#/`, `#/hasil`); pengecualian ribuan diuji dengan regex; klik ID lalu EN mengganti `html[lang]` dan format; UI `en` tanpa koma desimal di skor dan tabel data; tombol bahasa memakai `aria-pressed` |
| `a11y.e2e.ts` | 15 | axe dengan tag WCAG 2.0/2.1/2.2 A dan AA: 0 pelanggaran di dua halaman x dua tema x lebar 1280 dan 390 px (8 kasus). `landmark-unique` 0 pelanggaran per halaman. Skip link (Tab pertama, Enter memfokus `#main`, hash tidak berubah). Forced colors: pilihan aktif (chip, segmented, tombol bahasa) punya penanda batang `::after` tanpa outline, yang tak terpilih tanpa keduanya, dan fokus menambah outline tanpa menghilangkan batang. "Tautan disalin" lewat `role="status"` di `#alat` (DemoPage punya wilayah status kedua untuk pesan cerita); label tombol kembali setelah 6 detik (jam palsu); ganti bahasa tidak mengulang pengumuman; versi Inggris "copied". Node axe berstatus `incomplete` dicatat sebagai annotation `axe-incomplete` |
| `responsive.e2e.ts` | 42 | 21 lebar (320 sampai 1440 px, daftar lengkap di berkas) x 2 halaman: tanpa overflow horizontal; tanpa grid yatim (`n % kolom == 1`); font SVG efektif >= 12 px; target interaktif >= 44 px; `.tabs` tidak keluar dari kartu; tinggi header <= 120 px pada lebar 767 px ke bawah. Asersi lunak (`expect.soft`): satu kategori yang gagal tidak menutupi yang lain |
| `content.e2e.ts` | 8 | tombol cerita acak dengan `Math.random` tetap 0 memilih id 1 (bukan featured, bukan yang aktif); `mark` di kartu model punya `.sr-only`; `del.cut` ada di hero; tiap `svg[role=img]` punya `details.chart-data` berisi baris; tab kurva: panah, Home, End memindah pilihan dan fokus; `.chart-scroll` punya `role="region"`, `tabindex="0"`, label unik, dan tabpanel tidak punya `tabindex`; `summary` chart-data bernama unik (tiga di Hasil); kartu model memuat "ROUGE-L" di pohon aksesibilitas (id dan en) |
| `resilience.e2e.ts` | 2 | `localStorage` diblokir (per halaman): halaman tetap render, `main#main` terlihat, tombol tema tetap berfungsi, tanpa error halaman |
| `download.e2e.ts` | 1 | unduhan CSV berawalan BOM UTF-8 dengan header `doc,model,rouge_l,output`; JSON tanpa BOM, valid, dan berisi tiga baris (murni, gtrans, hybrid) |

Konfigurasi: `reducedMotion: 'reduce'`, `testMatch: **/*.e2e.ts`, proyek Chromium saja, base path `/skripsi/` (dikunci di `playwright.config.ts`). Web server: `npm run build` lalu `vite preview` di `127.0.0.1:4173` dengan `BASE_PATH=/skripsi/`.

Catatan `reuseExistingServer`: di luar CI, Playwright memakai server yang sudah hidup di port 4173 dan tidak membangun ulang. Hentikan `vite preview` lama sebelum menjalankan, atau tes berjalan di build usang. Di CI server selalu baru.

Catatan base path: E2E memakai `/skripsi/` yang dikunci di `playwright.config.ts`, sedangkan build CI memakai nama repo. Bila repo diganti nama, ubah keduanya.

## Cara menjalankan

```bash
npm run test                                  # Vitest; dist.test.ts dilewati lokal bila dist/ belum ada, di CI tidak dikumpulkan
npm run build && npx vitest run dist.test.ts  # CSP dan sourcemap pada dist/
npm run test:e2e                              # Playwright + axe; membangun sendiri, port 4173
npm run size                                  # setelah build: JS gzip 110 KB, woff2 120 KB (1 KB = 1000 byte)
npm run lint
```

`DIST_DIR=<folder>` menunjuk build lain (salinan sementara) untuk `dist.test.ts` dan `npm run size`. `vite.config.ts` juga membacanya.

Browser E2E dipasang sekali dengan `npx playwright install chromium-headless-shell` (CI memakai `--with-deps`, lihat `ci.yml`).

## Catatan agregasi skor

Rata-rata ROUGE-L per dokumen, dihitung ulang dari `src/data/docs.json`, sedikit berbeda dari skor skenario resmi: Murni 0,4184 vs 0,3978; GTrans 0,6691 vs 0,6437; Hybrid 0,7967 vs 0,7976. Situs menampilkan angka resmi dari notebook (fungsi `evaluate`). Selisih ini bukan bug. `data.test.ts` memeriksa nilai hitung ulang dengan toleransi 0,0005, bukan angka resmi. Prefiks `ref` terhadap `excerpt` belum dites dan menunggu pengecekan notebook.

## Batas verifikasi

- Chromium saja. Firefox dan WebKit tidak diuji.
- Forced colors diperiksa lewat computed style (`outline-style`, warna `Highlight`), bukan lewat mode Windows High Contrast sungguhan.
- Pembaca layar (NVDA, JAWS, VoiceOver) tidak diuji. Yang dicek otomatis hanya atribut, urutan fokus, dan pengumuman `role="status"`.
- Node `incomplete` dari axe (umumnya kontras di atas gambar atau gradien) tidak dihitung gagal. Ukuran 2026-10-14: 29 node `incomplete` di beranda dan 54 di Hasil, dicek manual (lihat `DESIGN-SYSTEM.md`, Aksesibilitas). Jumlahnya ada di annotation `axe-incomplete` pada laporan Playwright dan perlu dicek tiap kali; jangan dianggap nol.
- Angka ukuran dan tinggi header di dokumen ini dicatat dari pengukuran terakhir, tidak diukur ulang saat dokumen ditulis.

## Yang tidak dites otomatis (dan kenapa)

- Markup dan CSS komponen: berubah sering dan nilai tesnya rendah. Gantinya: E2E untuk kasus kunci, dan checklist manual.
- Warna dan tampilan piksel: kontras diperiksa axe di dua tema; tata letak diperiksa lewat ukuran, bukan gambar.
- Pembaca layar: lihat Batas verifikasi.
- Library (React, Vite).

## Review Focus (kasus tepi yang wajib punya tes atau cek)

1. Dokumen acak tanpa terjemahan menampilkan catatan, bukan kosong.
2. Teks `<extra_id_0>` dan karakter HTML tampil literal.
3. Bahasa browser kosong, `jv`, atau `id-ID`.
4. `localStorage` atau `matchMedia` melempar atau tidak ada.
5. Hash route tidak valid dan refresh di subpath Pages.

## Checklist verifikasi manual (catat hasil per baris, R-35)

Jalankan `npm run build && npm run preview` lalu:

- [ ] Konsol bersih (tanpa error atau warn) di Demo dan Hasil.
- [ ] Nav: Demo, Hasil, Temuan membawa ke tempat yang benar; logo kembali ke Demo; klik Temuan saat sudah di sana tetap menggulir ke Temuan.
- [ ] Sakelar ID/EN mengubah semua teks termasuk `lang` dokumen dan label tombol tema.
- [ ] Tombol tema berganti terang/gelap; kedua mode terbaca (kontras >= 4.5:1).
- [ ] Chip 5 cerita mengganti cuplikan, referensi, terjemahan, keluaran, skor.
- [ ] "Cerita acak" 20x: tidak mengulang cerita yang sama dan bukan featured; cerita acak menampilkan catatan tanpa terjemahan.
- [ ] Hero "putar ulang" mengulang animasi; angka kata sesuai.
- [ ] Tab ROUGE-L/Loss (mouse dan panah keyboard); catatan clip loss tampil di tab Loss.
- [ ] Tabel data tiap grafik (`details`) terbuka dan terbaca di 375 px.
- [ ] Unduh CSV dibuka di Excel: kolom dan karakter Javanese benar. Unduh JSON terbuka sebagai JSON valid.
- [ ] "Salin tautan cerita": pembaca layar mengumumkan "Tautan disalin" sekali.
- [ ] Tautan sumber dataset (Kaggle) membuka tab baru; footer tanpa NIM, tahun, atau tautan profil.
- [ ] Tab keyboard: urutan logis, fokus selalu terlihat, tidak ada jebakan.
- [ ] 375 px: tanpa overflow horizontal (`document.documentElement.scrollWidth <= innerWidth`), tabel scroll di dalam kartu, target tap >= 44px.
- [ ] 768 dan 1440 px: tata letak tidak patah.
- [ ] `prefers-reduced-motion: reduce`: tidak ada animasi.
- [ ] Refresh di `#/hasil` dan di subpath Pages membuka halaman yang sama.

## CI di GitHub

`.github/workflows/ci.yml` berjalan pada setiap pull request dan push ke `develop` atau `main`, tanpa deploy. Urutannya: `npm ci`, `npm audit --omit=dev --audit-level=high`, `npm audit signatures`, lint, tes, build dengan `BASE_PATH` nama repo, `npx vitest run dist.test.ts`, `npm run size`, lalu `npm run test:e2e` dengan cache browser Playwright. Status merah berarti jangan di-merge. `npm ci` ikut menangkap konflik dependensi (`ERESOLVE`) yang tidak terlihat di `npm install`. Laporan Playwright diunggah saat gagal.

`deploy.yml` (push ke `main`) menjalankan audit (dua langkah), lint, tes, build, `dist.test.ts`, lalu deploy. E2E dan `npm run size` tidak ikut di sana.

## Otomasi tambahan sebelum rilis

- `npm run lint`, `npm run build` (termasuk `tsc -b`).
- `npm audit --omit=dev` untuk daftar lengkap (CI hanya gagal pada level high ke atas).
- `impeccable detect --json src` sekali setelah UI selesai.
- Gerbang antislop (PASS/FAIL dengan bukti).
- Checklist manual di atas tetap wajib; E2E tidak menggantikannya.

## Langkah manual pemilik (bukan tugas agen)

Langkah ini ada di GitHub atau di mesin pemilik, dan agen tidak mengubahnya.

- Branch protection `main`: wajibkan job `check` dari `ci.yml` hijau sebelum merge.
- Environment `github-pages`: batasi deployment branch ke `main`.
- Dependabot: aktifkan security alerts di Settings > Code security. Pembaruan terjadwal sudah diatur di `.github/dependabot.yml`.
- Opsional, fnm di shell: `fnm env --use-on-cd --shell fish | source` di config shell, lalu `fnm default 22`. Tanpa itu, jalankan perintah dengan `fnm exec --using=22 <perintah>`.
- Keputusan aturan lint kandidat. `eslint.config.js` diproteksi hook, jadi perubahan dilakukan pemilik. Kandidat untuk dipindah dari tes ke ESLint (`no-restricted-syntax` atau `no-restricted-properties`): `.toFixed(` di `components/` dan `pages/`; `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`; `history.replaceState` dan `pushState` di `src/`. Saat ini ketiganya dijaga `security.test.ts`, belum ESLint.
- Cek notebook: agregasi skor (lihat Catatan agregasi), dan 28 dari 70 `ref` yang bukan prefiks `excerpt`.
- Checklist manual (axe DevTools, keyboard, pembaca layar) belum dicatat hasilnya. Catat per baris sebelum commit.
- Ganti nama repo (opsional): ubah `playwright.config.ts` dan base path (lihat Catatan base path).
