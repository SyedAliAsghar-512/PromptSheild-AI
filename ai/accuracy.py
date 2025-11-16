import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.metrics import accuracy_score

MODEL_DIR = "./promptshield-model"

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

# Load your labeled test data (saved by your pipeline)
df = pd.read_csv("test.csv")  # columns: text, label

texts = df["text"].tolist()
labels = df["label"].tolist()

all_preds = []

with torch.no_grad():
    for i in range(0, len(texts), 32):
        batch_texts = texts[i:i+32]
        enc = tokenizer(
            batch_texts,
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt",
        )
        outputs = model(**enc)
        probs = torch.softmax(outputs.logits, dim=-1)
        preds = probs.argmax(dim=-1).tolist()
        all_preds.extend(preds)

acc = accuracy_score(labels, all_preds)

print("Test accuracy:", round(acc, 4))
print("Total samples:", len(labels))
print("Predicted benign:", sum(1 for p in all_preds if p == 0))
print("Predicted malicious:", sum(1 for p in all_preds if p == 1))