#!/usr/bin/env python3
"""
Dataset analysis script - detects anomalies and suspicious content
"""

import json
import sys
import re
from collections import Counter

SUSPICIOUS_PATTERNS = [
    r"J3\s*SU1S\s*UN3\s*P0UP33",
    r"admin\s*:\s*pass",
    r"backdoor",
    r"enhanced.{0,10}mode",
    r"compliance.{0,10}token",
    r"X-Compliance",
    r"enable_enhanced",
]

def load_dataset(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def analyze(data, path):
    print(f"\n{'='*55}")
    print(f"ANALYSE : {path}")
    print(f"{'='*55}")

    total = len(data)
    print(f"Total d'exemples    : {total}")

    formats = Counter()
    empty = 0
    suspicious_entries = []

    for i, item in enumerate(data):
        if "conversation" in item:
            formats["conversation"] += 1
        elif "question" in item and "answer" in item:
            formats["question/answer"] += 1
        elif "input" in item and "output" in item:
            formats["input/output"] += 1
        else:
            formats["inconnu"] += 1

        text = json.dumps(item, ensure_ascii=False).lower()

        if not text.strip() or len(text) < 10:
            empty += 1

        for pattern in SUSPICIOUS_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                suspicious_entries.append({
                    "index": i,
                    "pattern": pattern,
                    "preview": text[:200]
                })

    print(f"\nFormats détectés :")
    for fmt, count in formats.items():
        print(f"  {fmt:20s} : {count} ({count/total*100:.1f}%)")

    print(f"\nExemples vides/invalides : {empty}")

    print(f"\nPatterns suspects détectés : {len(suspicious_entries)}")
    if suspicious_entries:
        print("  ⚠️  ANOMALIES TROUVÉES :")
        for entry in suspicious_entries:
            print(f"\n  Index #{entry['index']}")
            print(f"  Pattern : {entry['pattern']}")
            print(f"  Aperçu  : {entry['preview'][:150]}...")
    else:
        print("  ✅ Aucun pattern suspect détecté")

    lengths = []
    for item in data:
        text = json.dumps(item, ensure_ascii=False)
        lengths.append(len(text))

    if lengths:
        print(f"\nLongueur des exemples (chars) :")
        print(f"  Min : {min(lengths)}")
        print(f"  Max : {max(lengths)}")
        print(f"  Moy : {sum(lengths)//len(lengths)}")

        outliers = [i for i, l in enumerate(lengths) if l > 3 * (sum(lengths)//len(lengths))]
        if outliers:
            print(f"\n  ⚠️  {len(outliers)} exemples anormalement longs (index: {outliers[:10]})")

    print(f"\n{'='*55}\n")

def main():
    paths = sys.argv[1:] if len(sys.argv) > 1 else [
        #"../datasets/finance_dataset_final.json",
        "../datasets/dataset_v0.json",
        #"../datasets/test_dataset_16000.json",
    ]

    for path in paths:
        try:
            data = load_dataset(path)
            analyze(data, path)
        except FileNotFoundError:
            print(f"❌ Fichier non trouvé : {path}")
        except json.JSONDecodeError as e:
            print(f"❌ JSON invalide dans {path} : {e}")
        except Exception as e:
            print(f"❌ Erreur sur {path} : {e}")

if __name__ == "__main__":
    main()
