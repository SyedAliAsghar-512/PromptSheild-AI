"""
PromptShield — 100k Dataset Builder + Model Trainer
50k benign + up to 50k malicious (PKU unsafe-based)
"""

import os
from datasets import load_dataset, concatenate_datasets
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
import pandas as pd
import numpy as np
import torch
from torch.nn import CrossEntropyLoss
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

# Speed / memory tweaks for Apple Silicon
os.environ.setdefault("PYTORCH_MPS_HIGH_WATERMARK_RATIO", "0.0")

BENIGN_TARGET = 50000
MALICIOUS_TARGET = 50000

# -------------------------------------
# STEP 1: BENIGN DATA (target 50,000)
# -------------------------------------

print("Downloading benign datasets...")

dolly = load_dataset("databricks/databricks-dolly-15k", split="train")
alpaca = load_dataset("tatsu-lab/alpaca", split="train")
oasst = load_dataset("OpenAssistant/oasst1", split="train")

def format_benign(example):
    return {"text": example.get("instruction", example.get("text", "")), "label": 0}

dolly = dolly.map(format_benign, remove_columns=dolly.column_names)
alpaca = alpaca.map(
    lambda ex: {"text": ex.get("instruction", ""), "label": 0},
    remove_columns=alpaca.column_names,
)
oasst = oasst.map(
    lambda ex: {"text": ex.get("text", ""), "label": 0},
    remove_columns=oasst.column_names,
)

# Take fixed chunks then cap to BENIGN_TARGET
dolly_n = min(len(dolly), 15000)      # up to 15k
alpaca_n = min(len(alpaca), 20000)    # up to 20k
oasst_n  = min(len(oasst), 20000)     # up to 20k

benign_raw = concatenate_datasets([
    dolly.shuffle(seed=42).select(range(dolly_n)),
    alpaca.shuffle(seed=42).select(range(alpaca_n)),
    oasst.shuffle(seed=42).select(range(oasst_n)),
]).shuffle(seed=42)

if len(benign_raw) < BENIGN_TARGET:
    raise ValueError(f"Not enough benign data: have {len(benign_raw)}, need {BENIGN_TARGET}")

benign = benign_raw.select(range(BENIGN_TARGET))
print(f"Benign prompts collected: {len(benign)}")


# -------------------------------------
# STEP 2: MALICIOUS DATA (PKU SafeRLHF)
# -------------------------------------

print("Downloading malicious datasets...")

pku = load_dataset("PKU-Alignment/PKU-SafeRLHF", split="train")
print("PKU columns:", pku.column_names)

def map_pku_prompt(example):
    prompt = example["prompt"]

    # Prompt considered malicious if it yields ANY unsafe response
    r0_safe = example["is_response_0_safe"]
    r1_safe = example["is_response_1_safe"]

    malicious = (r0_safe is False) or (r1_safe is False)
    label = 1 if malicious else 0  # 1 = malicious, 0 = benign
    return {"text": prompt, "label": label}

pku_mapped = pku.map(map_pku_prompt, remove_columns=pku.column_names)

pku_malicious = pku_mapped.filter(lambda ex: ex["label"] == 1)
pku_benign    = pku_mapped.filter(lambda ex: ex["label"] == 0)

print("PKU prompt distribution → benign:", len(pku_benign), ", malicious:", len(pku_malicious))

if len(pku_malicious) == 0:
    raise ValueError("PKU dataset produced 0 malicious prompts with this labeling rule.")

# Take up to MALICIOUS_TARGET malicious prompts
take_n = min(MALICIOUS_TARGET, len(pku_malicious))
malicious = pku_malicious.shuffle(seed=42).select(range(take_n))

print("Malicious prompts collected:", len(malicious))


# -------------------------------------
# STEP 3: COMBINE + SHUFFLE
# -------------------------------------

dataset = concatenate_datasets([benign, malicious]).shuffle(seed=42)
print(f"Total combined dataset: {len(dataset)}")

labels = dataset["label"]
num_benign = sum(1 for x in labels if x == 0)
num_malicious = sum(1 for x in labels if x == 1)
print(f"Label distribution → benign: {num_benign}, malicious: {num_malicious}")


# -------------------------------------
# STEP 4: SPLIT
# -------------------------------------

train_test = dataset.train_test_split(test_size=0.2, seed=42)
train_val = train_test["train"].train_test_split(test_size=0.1111, seed=42)  # 80/10/10

train_ds = train_val["train"]
val_ds = train_val["test"]
test_ds = train_test["test"]

print(f"Train: {len(train_ds)}, Val: {len(val_ds)}, Test: {len(test_ds)}")

# Save for inspection
pd.DataFrame(train_ds).to_csv("train.csv", index=False)
pd.DataFrame(val_ds).to_csv("val.csv", index=False)
pd.DataFrame(test_ds).to_csv("test.csv", index=False)
print("Datasets saved: train.csv, val.csv, test.csv")


# -------------------------------------
# STEP 5: TOKENIZER + MODEL
# -------------------------------------

MODEL_NAME = "roberta-base"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def tokenize_batch(batch):
    tokenized = tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length",
        max_length=128,  # shorter → faster, less memory
    )
    tokenized["labels"] = batch["label"]
    return tokenized

train_ds = train_ds.map(tokenize_batch, batched=True)
val_ds = val_ds.map(tokenize_batch, batched=True)
test_ds = test_ds.map(tokenize_batch, batched=True)

train_ds = train_ds.remove_columns(["text"])
val_ds   = val_ds.remove_columns(["text"])
test_ds  = test_ds.remove_columns(["text"])

train_ds.set_format("torch")
val_ds.set_format("torch")
test_ds.set_format("torch")

model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)


# -------------------------------------
# STEP 6: METRICS + CLASS WEIGHTS
# -------------------------------------

def compute_metrics(pred):
    labels_np = pred.label_ids
    preds_np = np.argmax(pred.predictions, axis=1)
    acc = accuracy_score(labels_np, preds_np)
    p, r, f1, _ = precision_recall_fscore_support(
        labels_np, preds_np, average="binary", zero_division=0
    )
    return {"accuracy": acc, "precision": p, "recall": r, "f1": f1}

labels_col = train_ds["labels"]
num_train_benign = sum(1 for x in labels_col if x == 0)
num_train_malicious = sum(1 for x in labels_col if x == 1)
print(f"Train distribution → benign: {num_train_benign}, malicious: {num_train_malicious}")

w0 = 1.0
w1 = 1.0
class_weights = torch.tensor([w0, w1], dtype=torch.float)

class WeightedTrainer(Trainer):
    # Accept num_items_in_batch to be compatible with your transformers version
    def compute_loss(self, model, inputs, return_outputs=False, num_items_in_batch=None):
        labels = inputs.get("labels")
        outputs = model(**inputs)
        logits = outputs.get("logits")
        cw = class_weights.to(logits.device)
        loss_fct = CrossEntropyLoss(weight=cw)
        loss = loss_fct(
            logits.view(-1, self.model.config.num_labels),
            labels.view(-1),
        )
        return (loss, outputs) if return_outputs else loss

# -------------------------------------
# STEP 7: TRAINING CONFIG (no evaluation_strategy for old transformers)
# -------------------------------------

training_args = TrainingArguments(
    output_dir="./promptshield-model",
    learning_rate=2e-5,
    per_device_train_batch_size=8,   # if OOM, drop to 4
    per_device_eval_batch_size=16,
    num_train_epochs=2,              # bump to 3 if underfitting
    weight_decay=0.01,
    fp16=False,                      # no fp16 on MPS
    logging_steps=200,
    # NOTE: old transformers here — no evaluation_strategy/save_strategy/load_best_model_at_end
)

trainer = WeightedTrainer(
    model=model,
    args=training_args,
    train_dataset=train_ds,
    eval_dataset=val_ds,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)


# -------------------------------------
# STEP 8: TRAIN + EVAL + SAVE
# -------------------------------------

print("Training model...")
trainer.train()
print("Training complete.")

print("Final Test Evaluation:")
print(trainer.evaluate(test_ds))

trainer.save_model("./promptshield-model")
tokenizer.save_pretrained("./promptshield-model")

print("Model exported → ./promptshield-model")
print("DONE.")