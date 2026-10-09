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
| Data pribadi bocor lewat konten (NIM, foto, dokumen) | Aturan keras di `AGENTS.md`; footer hanya nama, prodi, kampus, LinkedIn, GitHub; periksa `git diff` sebelum push |
| XSS lewat teks keluaran model / data (`<extra_id_0>`, tanda kutip, HTML) | Render hanya sebagai teks React; larangan `dangerouslySetInnerHTML`, `innerHTML`, `eval`; dicakup tes data |
| Rantai pasok dependensi | Runtime hanya `react` dan `react-dom`; dev dependency minimal; `package-lock.json` di-commit; `npm ci` di CI; `npm audit` sebelum rilis |
| Secret masuk repo | Tidak ada secret yang dibutuhkan. Jangan buat `.env` berisi token; semua `VITE_*` terlihat publik |
| Source map membuka kode | `build.sourcemap` tetap `false` (default) |
| Tautan eksternal membajak jendela | `rel="noopener noreferrer"` pada semua `target="_blank"` |
| Pihak ketiga mencatat IP pengunjung | Tidak ada permintaan ke pihak ketiga: font di-host sendiri di `src/fonts/` (lisensi SIL OFL di `src/fonts/licenses/`). Tidak ada skrip analitik atau pelacak |
| Klaim palsu merusak kepercayaan | Tidak ada statistik/klaim tanpa sumber (R-17/R-36); label "AI, belum diverifikasi" pada terjemahan |
| Pengambilalihan akun GitHub | 2FA aktif; izin workflow minimal (`pages: write`, `id-token: write`, `contents: read`) |

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

- [ ] `git diff --staged` tidak memuat NIM, tahun, email/telepon pribadi, atau token.
- [ ] `npm audit --omit=dev` tanpa temuan kritis.
- [ ] Tidak ada `dangerouslySetInnerHTML`, `innerHTML`, `eval` (`grep -rn "dangerouslySetInnerHTML\|innerHTML\|eval(" src`).
- [ ] Tautan eksternal punya `rel="noopener noreferrer"`.
- [ ] Angka di `src/data/results.ts` sama dengan notebook.
- [ ] Sourcemap produksi nonaktif.

## Melapor

Temuan keamanan atau kebocoran data: hubungi Suiryu langsung (LinkedIn di footer). Jika data pribadi sudah ter-push, bersihkan riwayat dan ganti kredensial terkait; itu tindakan manual oleh Suiryu.
