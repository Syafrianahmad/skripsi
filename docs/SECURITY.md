# Security dan Privasi

Situs ini statis: tanpa backend, akun, form, atau database. Risikonya kecil tetapi nyata, terutama kebocoran data pribadi dan rantai dependensi.

## Aset yang dilindungi

1. **Data pribadi Suiryu:** NIM, tahun lulus, alamat, nomor telepon, email pribadi. Tidak boleh ada di situs, repo, atau riwayat git.
2. **Integritas hasil:** angka skripsi tidak boleh berubah diam-diam.
3. **Pengunjung:** tidak boleh dilacak, tidak boleh menjalankan skrip tak dikenal.
4. **Akun GitHub/Pages:** token dan kunci tidak boleh masuk repo.

## Ancaman dan mitigasi

| Ancaman | Mitigasi |
|---|---|
| Data pribadi bocor lewat konten (NIM, foto, dokumen) | Aturan keras di `AGENTS.md`; footer hanya nama, prodi, kampus, LinkedIn, GitHub; periksa `git diff` sebelum push; commit memakai email `noreply` GitHub (dicek 2026-10-09: semua 13 commit) |
| XSS lewat teks keluaran model / data (`<extra_id_0>`, tanda kutip, HTML) | Render hanya sebagai teks React; larangan `dangerouslySetInnerHTML`, `innerHTML`, `eval`; dijaga otomatis oleh `security.test.ts` |
| Rantai pasok dependensi | Runtime hanya `react` dan `react-dom`; dev dependency minimal; `package-lock.json` di-commit; `npm audit` sebelum rilis; `.github/dependabot.yml` membuka PR update mingguan; `npm ci` akan dipakai di workflow deploy (belum dibuat) |
| Secret masuk repo | Tidak ada secret yang dibutuhkan. Jangan buat `.env` berisi token; semua `VITE_*` terlihat publik; string mirip token diperiksa `security.test.ts` |
| Source map membuka kode | `build.sourcemap` tetap `false` (default), dijaga `security.test.ts` |
| Tautan eksternal membajak jendela | `rel="noopener noreferrer"` pada semua `target="_blank"`, dijaga `security.test.ts` |
| Pihak ketiga mencatat IP pengunjung | Tidak ada permintaan ke pihak ketiga: font di-host sendiri di `src/fonts/` (lisensi SIL OFL di `src/fonts/licenses/`). Tidak ada skrip analitik atau pelacak. Aset dari origin luar ditolak `security.test.ts` dan diblokir CSP |
| Klaim palsu merusak kepercayaan | Tidak ada statistik atau klaim tanpa sumber; angka utama dan hitungan temuan dikunci tes (`src/data/data.test.ts`); label "AI, belum diverifikasi" pada terjemahan |
| Pengambilalihan akun GitHub | Aktifkan 2FA di akun GitHub (Settings > Password and authentication; tidak bisa diverifikasi dari repo). Workflow deploy nanti memakai izin minimal: `contents: read`, `pages: write`, `id-token: write` |

## Kontrol konten

- Dataset: [GPT2 Javanese Dataset](https://www.kaggle.com/datasets/lutfiandri/gpt2-javanese-dataset) (Lutfi Andriyanto, Kaggle). Lisensinya "Unknown", jadi tidak ada izin eksplisit untuk menyebarkan ulang. Mitigasi: kredit dan tautan tampil di bawah cuplikan dan di footer, teks hanya cuplikan untuk penelitian. Kalau pengunggah atau penulis cerita keberatan, batasi demo ke 5 cerita pilihan. Sebelum menambah cerita baru, pastikan lisensinya.
- Cerita bisa memuat nama orang atau tempat nyata; tampilkan cuplikan seperlunya, jangan seluruh teks.
- Jurnal MATICS belum terbit: jangan unggah naskah.

## Header dan CSP

GitHub Pages tidak mengizinkan header kustom, jadi CSP dipasang sebagai `<meta>` oleh plugin build di `vite.config.ts` (logikanya di `csp.ts`, dites di `csp.test.ts`). Hasil di `dist/index.html`:

```
default-src 'self'; script-src 'self' 'sha256-…'; object-src 'none'; base-uri 'self'; form-action 'none'
```

- Satu-satunya skrip inline (penerap tema sebelum paint) diizinkan lewat hash SHA-256 yang dihitung otomatis saat build. Tidak ada `'unsafe-inline'`.
- `'unsafe-inline'` untuk style **tidak** diperlukan: React memasang prop `style` lewat CSSOM, yang tidak dibatasi CSP.
- CSP hanya dipasang saat build, karena dev server Vite menyuntik `<style>` inline.
- `build.assetsInlineLimit: 0` wajib: tanpa itu, font kecil disisipkan sebagai `data:` URI dan diblokir CSP.
- `frame-ancestors` tidak bisa lewat `<meta>`; risiko clickjacking kecil karena situs tidak punya aksi.

## Checklist sebelum push/rilis

Otomatis lewat `npm run test` (kalau gagal, jangan rilis):

- `security.test.ts`: tidak ada API HTML mentah atau `eval`; semua tautan tab baru ber-`rel="noopener noreferrer"`; tidak ada skrip, stylesheet, atau font dari origin luar; sourcemap produksi mati; tidak ada string mirip token.
- `csp.test.ts`: CSP dibentuk benar (pertama di `<head>`, skrip inline lewat hash, tanpa `unsafe-inline`).
- `src/data/data.test.ts`: angka utama dan hitungan temuan cocok dengan data.

Manual:

- [ ] `git diff --staged` tidak memuat NIM, tahun, email/telepon pribadi, atau token.
- [ ] `npm audit --omit=dev` tanpa temuan kritis.
- [ ] Kalau notebook berubah, angka di `src/data/results.ts` disalin ulang.
- [ ] 2FA akun GitHub aktif.

## Melapor

Temuan keamanan atau kebocoran data: hubungi Suiryu langsung (LinkedIn di footer). Jika data pribadi sudah ter-push, bersihkan riwayat dan ganti kredensial terkait; itu tindakan manual oleh Suiryu.
