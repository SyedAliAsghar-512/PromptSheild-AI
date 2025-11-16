from datasets import load_dataset

pku = load_dataset("PKU-Alignment/PKU-SafeRLHF", split="train")
print("Columns:", pku.column_names)

for i in range(5):
    row = pku[i]
    print(f"\nRow {i}:")
    for k, v in row.items():
        print(f"  {k}: {v}")