// Source of the Dict type: en.ts must provide every key below.
// UI text only; numbers come from src/data/results.ts. No em dashes.
export const id = {
  meta: {
    demoTitle: 'Ringkas Jawa: demo peringkas cerita Jawa',
    resultsTitle: 'Detail eksperimen · Ringkas Jawa',
  },
  nav: {
    demo: 'Demo',
    results: 'Detail eksperimen',
    findings: 'Temuan',
    switchLanguage: 'Bahasa / Language',
    themeToLight: 'Ganti ke mode terang',
    themeToDark: 'Ganti ke mode gelap',
    skipToContent: 'Lewati ke konten',
    langNames: { id: 'ID, Bahasa Indonesia', en: 'EN, English' },
  },
  hero: {
    aksaraLabel: 'Ringkesan (aksara Jawa)',
    h1: 'Bisakah mT5 meringkas cerita Jawa?',
    sub: 'Saya melatih mT5-small dengan tiga sumber data. Model terbaik belajar menyalin dua kalimat pertama, dan baseline tanpa model masih menang. Ini datanya.',
    stack: 'React + TypeScript + Vite; mT5-small fine-tune; data dibundel saat build.',
    statBest: 'ROUGE-L model terbaik (Hybrid)',
    statBaseline: 'baseline tanpa model, lebih tinggi',
    statCopied: 'kata ringkasan disalin dari cerita',
    statDocs: 'dokumen uji',
    caption: (docId: number, sentences: number, total: number) => `Contoh terbaik dari ${total}: #${docId}, ${sentences} kalimat`,
    replay: 'Putar ulang',
    words: 'kata',
    note: 'Keluaran asli model Hybrid, ROUGE-L 1,0.',
  },
  demo: {
    sectionLabel: 'Alat peringkas',
    pickStory: (total: number) => `Pilih cerita dari ${total} dokumen uji`,
    shuffle: 'Cerita acak',
    pickOther: 'Cerita lain (1–70)',
    copyLink: 'Salin tautan cerita',
    linkCopied: 'Tautan disalin',
    copyFailed: 'Gagal menyalin tautan.',
    downloadCsv: 'Unduh CSV',
    downloadJson: 'Unduh JSON',
    compareLabel: 'Bandingkan kata yang berbeda dengan',
    compareRef: 'Referensi',
    compareModels: 'Model lain',
    filterLabel: 'Filter',
    filterAll: 'Semua cerita',
    filterKinds: {
      extraId: 'Keluaran mengandung <extra_id_0>',
      aku: 'Keluaran diawali "Aku"',
      quote: 'Keluaran diawali tanda kutip',
      low: 'ROUGE-L di bawah 0,5',
    },
    matchCount: (n: number, total: number) => `${n} dari ${total} cerita cocok`,
    storyLabel: 'Cuplikan cerita',
    storyMeta: (docId: number, words: number, sentences: number) =>
      `#${docId} · ${words} kata · ${sentences} kalimat`,
    sourceLabel: 'Sumber cerita:',
    refLabel: 'Referensi lead-2 (dua kalimat pertama)',
    translationLabel: 'Artinya (terjemahan AI, belum diverifikasi):',
    noTranslation: 'Terjemahan hanya tersedia untuk 5 cerita pilihan.',
    nowShowing: (docId: number, title: string) =>
      `Menampilkan cerita #${docId}: ${title}. Keluaran tiga model diperbarui.`,
    storyNotFound: (n: string, shown: number) => `Cerita #${n} tidak ditemukan, menampilkan #${shown}.`,
    outputsTitle: 'Keluaran tiga model',
    highlightKey: 'bergaris bawah',
    highlightText: '= kata yang tidak ada di referensi',
    highlightModelsText: '= kata yang tidak ada di dua model lain',
    diffMarker: '(beda)',
    diffLegend: 'Kata beda juga diberi penanda "(beda)" untuk pembaca layar.',
    rougeLabel: 'ROUGE-L',
    savedNote: 'Keluaran tersimpan dari eksperimen, bukan inferensi langsung',
    tags: { best: 'terbaik', mid: 'median', worst: 'terburuk', rand: 'acak' },
  },
  findings: {
    title: 'Yang terlihat saat membaca 210 keluaran model.',
    showHint: 'Angka pada kartu bisa diklik: cerita yang cocok langsung difilter di bagian Demo.',
    extraIdTitle: 'Token sisa pretraining',
    extraIdBody:
      'Model Murni dan GTrans hampir selalu mengawali ringkasan dengan token sentinel mT5. Perlu dibersihkan sebelum ditampilkan ke pengguna.',
    akuTitle: 'Kata pertama berubah',
    akuBody:
      'Keluaran Hybrid sering diawali "Aku", kadang menempel pada kata pertama (mis. AkuCIL), atau diawali tanda kutip. ROUGE tetap tinggi karena hanya sedikit token yang meleset.',
    akuMark: 'diawali "Aku"',
    quoteMark: 'diawali tanda kutip',
    noveltyTitle: 'Hampir tidak ada kata baru',
    noveltyBody:
      'Rata-rata sedikitnya 97% kata di ringkasan diambil dari cerita. Model bekerja ekstraktif walau arsitekturnya abstraktif, dan "kata baru" Hybrid sebagian besar adalah artefak "Aku".',
    shortLead2Title: 'Dokumen dengan ROUGE-L di bawah 0,5',
    shortLead2Body:
      'Kasus terburuk bukan salah model: filter kalimat di bawah 20 karakter membuat referensi lead-2 melompati kalimat pendek di awal cerita.',
    shortLead2Meta: 'dari 70 dokumen uji per skenario',
    noveltyKey: '1-gram baru',
    shortLead2Key: 'lead-2 < 20 karakter',
    baselineCaption: 'lead-2 polos vs Hybrid',
    baselineBody:
      'Cukup mengambil dua kalimat pertama sudah mengalahkan semua model, karena referensinya memang lead-2. Jadi skor ini mengukur seberapa baik model meniru lead-2, bukan kualitas ringkasan.',
  },
  behind: {
    title: 'Di balik layar.',
    toResults: 'Lihat detail eksperimen',
    steps: [
      {
        title: 'Kenapa penting',
        body: 'Bahasa Jawa dituturkan puluhan juta orang, tapi data dan alat NLP-nya jauh tertinggal dari bahasa Indonesia. Peringkas otomatis membantu orang menyerap cerita dan arsip berbahasa Jawa lebih cepat.',
      },
      {
        title: 'Masalah',
        body: 'Bahasa Jawa minim data, dan tidak ada ringkasan buatan manusia. Referensi terpaksa memakai proksi lead-2.',
      },
      {
        title: 'Keputusan',
        body: '70 dokumen uji murni dipisah lebih dulu agar adil. fp16 menghasilkan NaN, jadi pakai fp32. T4 kehabisan memori, jadi batch 1 dengan akumulasi 16 dan gradient checkpointing.',
      },
      {
        title: 'Yang ternyata',
        body: 'Terjemahan mesin saja menaikkan skor sekitar 62% dari data asli, gabungan keduanya sekitar dua kali lipat, tapi model belajar menyalin awal cerita dan kalah dari baseline lead-2.',
      },
      {
        title: 'Kalau diulang',
        body: 'Buat ringkasan manusia untuk sebagian dokumen uji, ukur kata baru sejak awal, bersihkan token sentinel, dan tambah evaluasi manusia.',
      },
    ],
  },
  results: {
    title: 'Detail eksperimen',
    intro:
      'Lampiran untuk halaman utama: skor tiap skenario dibanding baseline, kurva pelatihan, tingkat abstraktif, dan konfigurasi lengkap.',
    scoresLabel: 'Ringkasan skor',
    pairsCount: (n: string) => `${n} pasangan`,
    startingPoint: 'ROUGE-L, titik awal',
    gainFromMurni: (pct: string) => `+${pct}% dari murni`,
    bestGain: (pct: string) => `+${pct}% dari murni, terbaik di antara model`,
    baselineName: 'Baseline lead-2',
    noModel: 'tanpa model',
    baselineNote: 'Dua kalimat pertama, tanpa filter',
    training: {
      title: 'Makin banyak data latih, makin tinggi ROUGE-L',
      subtitle: 'Sumbu X: jumlah pasangan latih. Sumbu Y: ROUGE-L pada 70 dokumen uji.',
      xAxis: 'pasangan data latih',
      baselineLabel: (score: string) => `Baseline lead-2, tanpa model: ${score}`,
      alt: (points: string) => `Grafik ROUGE-L terhadap jumlah data latih: ${points}`,
      pointTitle: (model: string, pairs: string, value: string) => `${model}, ${pairs} pasangan: ROUGE-L ${value}`,
    },
    config: {
      title: 'Pengaturan eksperimen',
      model: 'Model',
      epochs: 'Epoch',
      split: 'Pembagian',
      test: 'Dokumen uji',
      reference: 'Referensi',
      io: 'Input / output',
      optimizer: 'Optimasi',
      decoding: 'Dekode',
      hardware: 'Perangkat',
      metrics: 'Metrik',
      epochsValue: (n: number, patience: number) => `${n}, early stopping (patience ${patience}) tidak terpicu`,
      splitValue: (train: number) => `${train}% latih, ${100 - train}% validasi`,
      testValue: (n: number) => `${n} cerita Jawa murni`,
      referenceValue: 'Lead-2 (dua kalimat awal)',
      ioValue: (inTokens: number, outTokens: number, prefix: string) =>
        `${inTokens} / ${outTokens} token, prefix "${prefix}"`,
      optimizerValue: (lr: string, batch: number, accum: number) =>
        `LR ${lr}, batch efektif ${batch * accum} (${batch} × ${accum} akumulasi)`,
      decodingValue: (beams: number, noRepeat: number) => `beam ${beams}, no_repeat_ngram ${noRepeat}`,
    },
    limitations: {
      title: 'Catatan keterbatasan',
      body: (baseline: string) =>
        `Referensi berupa lead-2, dan baseline lead-2 tanpa model (${baseline}) mengalahkan semua model. Skor ROUGE di sini mengukur kemiripan dengan lead-2, bukan kualitas ringkasan. Evaluasi manusia dan referensi buatan manusia dibutuhkan. Bobot model tidak dirilis, jadi yang ditampilkan hanya keluaran dan skor.`,
    },
    distribution: {
      title: 'Sebaran ROUGE-L per dokumen',
      subtitle:
        'Jumlah dari 70 dokumen uji di tiap rentang 0,1, per skenario. Ekor di kiri (di bawah 0,5) adalah dokumen yang dijelaskan filter lead-2 di bagian Temuan.',
      lowBand: 'di bawah 0,5',
      xAxis: 'rentang ROUGE-L per dokumen',
      alt: (summary: string) => `Histogram ROUGE-L per dokumen untuk tiga skenario. Jumlah dokumen di bawah 0,5: ${summary}.`,
      barTitle: (model: string, from: string, to: string, n: number) => `${model}, ${from}–${to}: ${n} cerita`,
    },
    curve: {
      title: 'Kurva pelatihan per epoch',
      subtitle: (murni: number, gtrans: number, hybrid: number) =>
        `Diukur pada data validasi tiap akhir epoch. Murni ${murni}, GTrans ${gtrans}, Hybrid ${hybrid} dokumen validasi.`,
      tabsLabel: 'Metrik kurva',
      lossLabel: 'Loss',
      xAxis: 'epoch',
      rougeAlt: 'ROUGE-L validasi per epoch untuk tiga skenario',
      lossAlt: 'Loss validasi per epoch untuk tiga skenario',
      clipNote:
        'Sumbu dipotong di 1,0. Nilai di atasnya ditandai panah: loss Murni masih tinggi di epoch 1 sampai 2, dan GTrans di epoch 1.',
      trainTime: (murni: number, gtrans: number, hybrid: number) =>
        `Waktu latih: Murni ${murni} menit, GTrans ${gtrans} menit, Hybrid ${hybrid} menit.`,
      pointTitle: (model: string, epoch: number, value: string) => `${model}, epoch ${epoch}: ${value}`,
    },
    chartData: {
      summary: 'Data grafik',
      epoch: 'Epoch',
      range: 'Rentang',
      stories: (n: number) => `${n} cerita`,
    },
    scrollRegion: (title: string) => `${title} (area yang dapat digulir)`,
    abstractive: {
      title: 'Seberapa abstraktif ringkasannya?',
      body: 'Persentase n-gram di ringkasan yang tidak ada di cerita asli. Makin kecil, makin mirip salinan. Referensi lead-2 sendiri 0% untuk 1-gram.',
      note: (aku: number, total: number) =>
        `Kata baru Hybrid sebagian besar adalah artefak "Aku" di awal keluaran (${aku} dari ${total} keluaran).`,
      caption: 'N-gram baru di keluaran (rata-rata 70 dokumen)',
    },
    scenarios: {
      caption: 'Rincian skenario',
      scenario: 'Skenario',
      source: 'Sumber data',
      pairs: 'Pasangan',
      delta: 'Selisih dari murni',
      none: 'tidak ada',
      sources: {
        murni: 'Cerita Jawa asli',
        gtrans: 'Terjemahan Google',
        hybrid: 'Gabungan keduanya',
        baseline: 'Dua kalimat pertama, tanpa model',
      },
    },
  },
  footer: {
    affil: 'Teknik Informatika, UIN Maulana Malik Ibrahim Malang',
    storiesFrom: 'Cerita dari',
    source: 'Pengunggah tidak mencantumkan lisensi; cerita ditampilkan sebagai cuplikan untuk keperluan penelitian.',
  },
}

export type Dict = typeof id
