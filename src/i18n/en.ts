import type { Dict } from './id.ts'

export const en: Dict = {
  meta: {
    demoTitle: 'Ringkas Jawa: Javanese story summarizer demo',
    resultsTitle: 'Experiment details · Ringkas Jawa',
  },
  nav: {
    demo: 'Demo',
    results: 'Experiment details',
    findings: 'Findings',
    switchLanguage: 'Bahasa / Language',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
  },
  hero: {
    aksaraLabel: 'summary',
    h1: 'Can mT5 summarize Javanese stories?',
    sub: 'I trained mT5-small on three data sources. The best model learned to copy the first two sentences, and a no-model baseline still wins. Here is the data.',
    statBest: 'best model ROUGE-L (Hybrid)',
    statBaseline: 'no-model baseline, higher',
    statCopied: 'of summary words copied from the story',
    statDocs: 'test documents',
    caption: (docId, sentences) => `Test document #${docId}, ${sentences} sentences`,
    replay: 'Replay',
    words: 'words',
    note: 'Real Hybrid model output, ROUGE-L 1.0.',
  },
  demo: {
    sectionLabel: 'Summarizer',
    pickStory: 'Pick a story from 70 test documents',
    shuffle: 'Random story',
    randomLabel: (docId, title) => `Random #${docId}: ${title}…`,
    storyLabel: 'Story excerpt',
    storyMeta: (docId, words, sentences) => `#${docId} · ${words} words · ${sentences} sentences`,
    datasetSource: '[DATASET SOURCE]',
    refLabel: 'Lead-2 reference (first two sentences)',
    translationLabel: 'Meaning (AI translation, unverified):',
    noTranslation: 'Translations are only available for the 5 featured stories.',
    nowShowing: (docId, title) => `Showing story #${docId}: ${title}. Outputs of the three models updated.`,
    outputsTitle: 'Output of three models',
    highlightKey: 'red',
    highlightText: '= words not in the reference',
    savedNote: 'Stored output from the experiment, not live inference',
    tags: { best: 'best', mid: 'median', worst: 'worst', rand: 'random' },
  },
  findings: {
    title: 'What 210 model outputs reveal.',
    extraIdTitle: 'Leftover pretraining token',
    extraIdBody:
      'The Murni and GTrans models almost always start with the mT5 sentinel token. It must be stripped before showing output to users.',
    akuTitle: 'First word replaced',
    akuBody:
      'The Hybrid model often swaps the first word for "Aku" or adds a quote mark. ROUGE stays high because only one token is off.',
    quoteMark: 'start with a quote mark',
    noveltyTitle: 'Almost no new words',
    noveltyBody:
      'Over 97% of summary words come straight from the story. The model behaves extractively despite its abstractive architecture, and most of Hybrid’s "new words" are the "Aku" artifact.',
    shortLead2Title: 'Documents with ROUGE-L below 0.5',
    shortLead2Body:
      'The worst case is not the model’s fault: dropping sentences under 20 characters makes the lead-2 reference skip short opening lines.',
    shortLead2Meta: 'out of 70 test documents per scenario',
    baselineCaption: 'plain lead-2 vs Hybrid',
    baselineBody:
      'Taking the first two sentences already beats every model, because the reference is lead-2 itself. The score measures how well a model imitates lead-2, not summary quality.',
  },
  behind: {
    title: 'Behind the scenes.',
    toResults: 'See experiment details',
    steps: [
      {
        title: 'Why it matters',
        body: 'Javanese has tens of millions of speakers, yet its data and NLP tools lag far behind Indonesian. Automatic summaries help people take in Javanese stories and archives faster.',
      },
      {
        title: 'Problem',
        body: 'Javanese is low-resource and has no human-written summaries, so the reference had to be a lead-2 proxy.',
      },
      {
        title: 'Decisions',
        body: 'The 70-story test set was held out first for a fair comparison. fp16 produced NaN, so fp32. The T4 ran out of memory, so batch 1 with 16-step accumulation and gradient checkpointing.',
      },
      {
        title: 'What happened',
        body: 'Machine-translated data doubled the score, but the model learned to copy the opening and lost to the lead-2 baseline.',
      },
      {
        title: 'Next time',
        body: 'Write human summaries for part of the test set, track novel words from day one, strip sentinel tokens, and add human evaluation.',
      },
    ],
  },
  results: {
    title: 'Experiment details',
    intro:
      'Appendix to the main page: each scenario’s score against the baseline, training curves, abstractiveness, and the full configuration.',
    scoresLabel: 'Score summary',
    pairsCount: (n) => `${n} pairs`,
    pairsUnit: 'pairs',
    startingPoint: 'ROUGE-L, starting point',
    gainFromMurni: (pct) => `+${pct}% over Murni`,
    bestGain: (pct) => `+${pct}% over Murni, best of the models`,
    baselineName: 'Lead-2 baseline',
    noModel: 'no model',
    baselineNote: 'First two sentences, no filter',
    training: {
      title: 'More training data, higher ROUGE-L',
      subtitle: 'X axis: number of training pairs. Y axis: ROUGE-L on the 70 test documents.',
      xAxis: 'training pairs',
      baselineLabel: (score) => `Lead-2 baseline, no model: ${score}`,
      alt: (points) => `ROUGE-L against training data size: ${points}`,
    },
    config: {
      title: 'Experiment setup',
      model: 'Model',
      epochs: 'Epochs',
      split: 'Split',
      test: 'Test data',
      reference: 'Reference',
      io: 'Input / output',
      optimizer: 'Optimization',
      decoding: 'Decoding',
      hardware: 'Hardware',
      metrics: 'Metrics',
      epochsValue: (n, patience) => `${n}, early stopping (patience ${patience}) never triggered`,
      splitValue: (train) => `${train}% train, ${100 - train}% validation`,
      testValue: (n) => `${n} pure Javanese stories`,
      referenceValue: 'Lead-2 (first two sentences)',
      ioValue: (inTokens, outTokens, prefix) => `${inTokens} / ${outTokens} tokens, prefix "${prefix}"`,
      optimizerValue: (lr, batch, accum) =>
        `LR ${lr}, effective batch ${batch * accum} (${batch} × ${accum} accumulation)`,
      decodingValue: (beams, noRepeat) => `beam ${beams}, no_repeat_ngram ${noRepeat}`,
    },
    limitations: {
      title: 'Limitations',
      body: (baseline) =>
        `The reference is lead-2, and the no-model lead-2 baseline (${baseline}) beats every model. ROUGE here measures similarity to lead-2, not summary quality. Human evaluation and human-written references are needed.`,
    },
    curve: {
      title: 'Training curve per epoch',
      subtitle: (murni, gtrans, hybrid) =>
        `Measured on validation data at the end of each epoch. Murni ${murni}, GTrans ${gtrans}, Hybrid ${hybrid} validation documents.`,
      tabsLabel: 'Curve metric',
      xAxis: 'epoch',
      rougeAlt: 'Validation ROUGE-L per epoch for the three scenarios',
      lossAlt: 'Validation loss per epoch for the three scenarios',
      clipNote:
        'The axis is cut at 1.0. Values above it are marked with an arrow: Murni and GTrans start with high loss in epochs 1 and 2.',
      trainTime: (murni, gtrans, hybrid) =>
        `Training time: Murni ${murni} min, GTrans ${gtrans} min, Hybrid ${hybrid} min.`,
      pointTitle: (model, epoch, value) => `${model}, epoch ${epoch}: ${value}`,
    },
    abstractive: {
      title: 'How abstractive are the summaries?',
      body: 'Share of summary n-grams that do not appear in the original story. Lower means closer to a copy. The lead-2 reference itself scores 0% for 1-grams.',
      note: (aku, total) =>
        `Most of Hybrid’s new words are the "Aku" artifact at the start of a sentence (${aku} of ${total} outputs).`,
      caption: 'New n-grams in the output (average of 70 documents)',
    },
    scenarios: {
      caption: 'Scenario breakdown',
      scenario: 'Scenario',
      source: 'Data source',
      pairs: 'Pairs',
      delta: 'Gain over Murni',
      sources: {
        murni: 'Original Javanese stories',
        gtrans: 'Google translation',
        hybrid: 'Both combined',
        baseline: 'First two sentences, no model',
      },
    },
  },
  footer: {
    affil: 'Informatics Engineering, UIN Maulana Malik Ibrahim Malang',
    journal: 'Journal article in progress (MATICS)',
    source: 'Stories are shown as excerpts for research purposes.',
  },
}
