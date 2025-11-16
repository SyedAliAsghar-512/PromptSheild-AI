from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

MODEL_DIR = "./promptshield-model"  # same as in your training script

# 1. Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()  # inference mode

print("PromptShield interactive tester")
print("Type a prompt and press Enter. Type 'quit' to exit.\n")

while True:
    text = input("Enter prompt: ").strip()
    if not text:
        continue
    if text.lower() in {"q", "quit", "exit"}:
        print("Exiting.")
        break

    # 2. Run the user prompt through the model
    with torch.no_grad():
        enc = tokenizer(
            [text],
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt",
        )
        outputs = model(**enc)
        probs = torch.softmax(outputs.logits, dim=-1)[0]
        pred = probs.argmax().item()

    # 3. Interpret results: 0 = benign, 1 = malicious
    label = "malicious" if pred == 1 else "benign"
    probs_list = [round(float(p), 4) for p in probs.tolist()]

    print("=" * 80)
    print("TEXT:", text)
    print("PREDICTION:", label)
    print("PROBABILITIES (benign, malicious):", probs_list)
    print("=" * 80 + "\n")