---
language: jv
base_model: google/mt5-small
pipeline_tag: summarization
metrics:
  - rouge
# TODO before upload: delete these two comment lines and set the license field (owner decides).
# Dataset license: not stated by the uploader (Kaggle: "Unknown"), so it is not written here.
---

# Ringkas Jawa: mT5-small, scenario GTrans

`google/mt5-small` fine-tuned to summarize Javanese stories. This is the **GTrans** scenario: trained only on Google-translated stories (1,000 training pairs). The other two scenarios, Murni (original Javanese stories, 633 pairs) and Hybrid (both sets combined, 1,633 pairs), are compared on the demo page.

Live demo with the real outputs of all three models: <https://syafrianahmad.github.io/skripsi/>

## Usage

The input is the prefix `ringkas: ` (with a trailing space) followed by the story.

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_id = "Syafrian/ringkas-jawa-mt5-gtrans"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

story = "..."  # a Javanese story
# truncation and max_new_tokens=128 are the values in this card. Match them to the generate settings in your notebook.
inputs = tok("ringkas: " + story, return_tensors="pt", truncation=True, max_length=384)
out = model.generate(**inputs, num_beams=4, no_repeat_ngram_size=3, max_new_tokens=128)
print(tok.decode(out[0], skip_special_tokens=True))
# skip_special_tokens removes <extra_id_0>. The outputs counted in Limitations keep it.
```

## Training configuration

| Setting | Value |
|---|---|
| Base model | google/mt5-small |
| Pairs (90% train / 10% validation) | 1,000 |
| Validation documents (the 10% share) | 100 |
| Train split | 90% (`trainSplitPercent`: 90) |
| Epochs | 8 |
| Early stopping patience | 2 |
| Learning rate | 1e-4 |
| Batch size | 1 |
| Gradient accumulation | 16 (effective batch 16) |
| Max input tokens | 384 |
| Max output tokens | 128 |
| Input prefix | `ringkas: ` |
| Beams | 4 |
| No-repeat n-gram size | 3 |
| Precision | fp32 |
| Hardware | Google Colab, GPU T4 |
| Training time (GTrans) | 51 minutes |

## Results

ROUGE on 70 test documents. The reference is lead-2: the first two sentences of each story, after dropping sentences under 20 characters. The lead-2 baseline row is the first two sentences with no filter.

| Scenario | Pairs (90% train / 10% validation) | ROUGE-1 | ROUGE-2 | ROUGE-L | Delta vs Murni (ROUGE-L) |
|---|---|---|---|---|---|
| Murni | 633 | 0.4035 | 0.3662 | 0.3978 | 0 |
| **GTrans** | 1,000 | 0.6457 | 0.6188 | 0.6437 | 0.2459 |
| Hybrid | 1,633 | 0.8029 | 0.7745 | 0.7976 | 0.3998 |
| Lead-2 baseline (no model) | n/a | not reported | not reported | 0.867 | 0.4692 |

ROUGE-1 and ROUGE-2 for the lead-2 baseline are not in the source data, so they are not shown.

New n-grams: the share of output n-grams that do not appear in the source story, averaged over 70 documents.

| Scenario | New 1-grams | New 2-grams | New 3-grams |
|---|---|---|---|
| Murni | 0.9% | 2.3% | 5.7% |
| GTrans | 1.5% | 2.7% | 4.1% |
| Hybrid | 3.0% | 6.0% | 7.8% |

## Limitations

- **The reference is a proxy.** Lead-2 (the first two sentences, after dropping sentences under 20 characters) stands in for a human-written summary. The scores measure similarity to lead-2, not summary quality.
- **The baseline wins.** Lead-2 without any model (ROUGE-L 0.867) scores higher than all three models, including Hybrid (0.7976).
- **The models mostly copy.** Only 1.5% of GTrans output 1-grams are new. Output is extractive.
- **Leftover tokens.** The pretraining token `<extra_id_0>` appears in 67 of 70 GTrans outputs and 70 of 70 Murni outputs. The count for Hybrid is not in the source data.
- **Opening word.** 50 of 70 Hybrid outputs start with "Aku". The counts for Murni and GTrans are not in the source data.
- **Low scores per document.** Documents below ROUGE-L 0.5: Murni 36, GTrans 16, Hybrid 9 (out of 70). Most of these low scores come from the 20-character filter, which makes the lead-2 reference skip short opening lines.
- **Small test set.** The evaluation uses 70 documents only.
- **Not for production.** Do not use this model as a production summarizer.

## Data

The stories come from the [GPT2 Javanese Dataset](https://www.kaggle.com/datasets/lutfiandri/gpt2-javanese-dataset) by Lutfi Andriyanto, published on Kaggle. The uploader does not state a license (Kaggle lists it as "Unknown"), so this card does not state one either. The stories are used for research only.
