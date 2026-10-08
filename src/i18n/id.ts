// Source of the Dict type: en.ts must provide every key below.
// UI text only; numbers come from src/data/results.ts. No em dashes.
export const id = {
  nav: {
    demo: 'Demo',
    results: 'Detail eksperimen',
    findings: 'Temuan',
    switchLanguage: 'Bahasa / Language',
    themeToLight: 'Ganti ke mode terang',
    themeToDark: 'Ganti ke mode gelap',
  },
  hero: {
    aksaraLabel: 'ringkesan',
    h1: 'Bisakah mT5 meringkas cerita Jawa?',
    sub: 'Saya melatih mT5-small dengan tiga sumber data. Model terbaik belajar menyalin dua kalimat pertama, dan baseline tanpa model masih menang. Ini datanya.',
    statBest: 'ROUGE-L model terbaik (Hybrid)',
    statBaseline: 'baseline tanpa model, lebih tinggi',
    statCopied: 'kata ringkasan disalin dari cerita',
    statDocs: 'dokumen uji',
    caption: (docId: number, sentences: number) => `Dokumen uji #${docId}, ${sentences} kalimat`,
    replay: 'Putar ulang',
    words: 'kata',
    note: 'Keluaran asli model Hybrid, ROUGE-L 1.0.',
  },
  demo: {
    sectionLabel: 'Alat peringkas',
    pickStory: 'Pilih cerita dari 70 data uji',
    shuffle: 'Cerita acak',
    randomLabel: (docId: number, title: string) => `Acak #${docId}: ${title}…`,
    storyLabel: 'Cuplikan cerita',
    storyMeta: (docId: number, words: number, sentences: number) =>
      `#${docId} · ${words} kata · ${sentences} kalimat`,
    datasetSource: '[SUMBER DATASET]',
    refLabel: 'Referensi lead-2 (dua kalimat pertama)',
    translationLabel: 'Artinya (terjemahan AI, belum diverifikasi):',
    noTranslation: 'Terjemahan hanya tersedia untuk 5 cerita pilihan.',
    outputsTitle: 'Keluaran tiga model',
    highlightKey: 'merah',
    highlightText: '= kata yang tidak ada di referensi',
    savedNote: 'Keluaran tersimpan dari eksperimen, bukan inferensi langsung',
    tags: { best: 'terbaik', mid: 'median', worst: 'terburuk', rand: 'acak' },
  },
  findings: {
    title: 'Yang terlihat saat membaca 210 keluaran model.',
    extraIdTitle: 'Token sisa pretraining',
    extraIdBody:
      'Model Murni dan GTrans hampir selalu mengawali ringkasan dengan token sentinel mT5. Perlu dibersihkan sebelum ditampilkan ke pengguna.',
    akuTitle: 'Kata pertama tergantikan',
    akuBody:
      'Model Hybrid sering mengganti kata pertama dengan "Aku" atau menambah tanda kutip. ROUGE tetap tinggi karena hanya satu token yang meleset.',
    quoteMark: 'diawali tanda kutip',
    noveltyTitle: 'Hampir tidak ada kata baru',
    noveltyBody:
      'Lebih dari 97% kata di ringkasan diambil dari cerita. Model bekerja ekstraktif walau arsitekturnya abstraktif, dan "kata baru" Hybrid sebagian besar adalah artefak "Aku".',
    shortLead2Title: 'Dokumen dengan ROUGE-L di bawah 0.5',
    shortLead2Body:
      'Kasus terburuk bukan salah model: filter kalimat di bawah 20 karakter membuat referensi lead-2 melompati kalimat pendek di awal cerita.',
    shortLead2Meta: 'dari 70 dokumen uji per skenario',
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
        body: 'Data uji 70 cerita murni dipisah lebih dulu agar adil. fp16 menghasilkan NaN, jadi pakai fp32. T4 kehabisan memori, jadi batch 1 dengan akumulasi 16 dan gradient checkpointing.',
      },
      {
        title: 'Yang ternyata',
        body: 'Data terjemahan mesin menaikkan skor dua kali lipat, tapi model belajar menyalin awal cerita dan kalah dari baseline lead-2.',
      },
      {
        title: 'Kalau diulang',
        body: 'Buat ringkasan manusia untuk sebagian data uji, ukur kata baru sejak awal, bersihkan token sentinel, dan tambah evaluasi manusia.',
      },
    ],
  },
  results: {
    title: 'Detail eksperimen',
    intro:
      'Lampiran untuk halaman utama: skor tiap skenario dibanding baseline, kurva pelatihan, tingkat abstraktif, dan konfigurasi lengkap.',
    scoresLabel: 'Ringkasan skor',
    pairsCount: (n: string) => `${n} pasangan`,
    pairsUnit: 'pasangan',
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
    },
    config: {
      title: 'Pengaturan eksperimen',
      model: 'Model',
      epochs: 'Epoch',
      split: 'Pembagian',
      test: 'Data uji',
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
        `Referensi berupa lead-2, dan baseline lead-2 tanpa model (${baseline}) mengalahkan semua model. Skor ROUGE di sini mengukur kemiripan dengan lead-2, bukan kualitas ringkasan. Evaluasi manusia dan referensi buatan manusia dibutuhkan.`,
    },
    curve: {
      title: 'Kurva pelatihan per epoch',
      subtitle: (murni: number, gtrans: number, hybrid: number) =>
        `Diukur pada data validasi tiap akhir epoch. Murni ${murni}, GTrans ${gtrans}, Hybrid ${hybrid} dokumen validasi.`,
      tabsLabel: 'Metrik kurva',
      xAxis: 'epoch',
      rougeAlt: 'ROUGE-L validasi per epoch untuk tiga skenario',
      lossAlt: 'Loss validasi per epoch untuk tiga skenario',
      clipNote:
        'Sumbu dipotong di 1,0. Nilai di atasnya ditandai panah: loss awal Murni dan GTrans masih tinggi di epoch 1 sampai 2.',
      trainTime: (murni: number, gtrans: number, hybrid: number) =>
        `Waktu latih: Murni ${murni} menit, GTrans ${gtrans} menit, Hybrid ${hybrid} menit.`,
      pointTitle: (model: string, epoch: number, value: string) => `${model}, epoch ${epoch}: ${value}`,
    },
    abstractive: {
      title: 'Seberapa abstraktif ringkasannya?',
      body: 'Persentase n-gram di ringkasan yang tidak ada di cerita asli. Makin kecil, makin mirip salinan. Referensi lead-2 sendiri 0% untuk 1-gram.',
      note: (aku: number, total: number) =>
        `Kata baru Hybrid sebagian besar adalah artefak "Aku" di awal kalimat (${aku} dari ${total} keluaran).`,
      caption: 'N-gram baru di keluaran (rata-rata 70 dokumen)',
    },
    scenarios: {
      caption: 'Rincian skenario',
      scenario: 'Skenario',
      source: 'Sumber data',
      pairs: 'Pasangan',
      delta: 'Selisih dari murni',
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
    journal: 'Artikel jurnal dalam proses (MATICS)',
    source: 'Cerita ditampilkan sebagai cuplikan untuk keperluan penelitian.',
  },
}

export type Dict = typeof id
