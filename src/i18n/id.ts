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
  footer: {
    affil: 'Teknik Informatika, UIN Maulana Malik Ibrahim Malang',
    journal: 'Artikel jurnal dalam proses (MATICS)',
    source: 'Cerita ditampilkan sebagai cuplikan untuk keperluan penelitian.',
  },
}

export type Dict = typeof id
