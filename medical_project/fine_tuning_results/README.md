# Résultats du Fine-tuning Médical — Phi-3.5-mini-instruct

**Notebook Colab :** [Ouvrir le notebook](https://colab.research.google.com/drive/11CpAjo71EVheBtYjE2XWp1bNtRYxps_1?usp=sharing)

## Configuration de l'entraînement

| Paramètre | Valeur |
|-----------|--------|
| Modèle de base | unsloth/Phi-3.5-mini-instruct |
| Technique | QLoRA 4-bit (LoRA r=16, alpha=32) |
| Dataset | ruslanmv/ai-medical-chatbot (HuggingFace) |
| Exemples après filtrage | ~900 |
| Epochs | 5 |
| Batch size | 2 (gradient accumulation x4) |
| Learning rate | 2e-4 |
| Max seq length | 256 |
| Paramètres entraînés | 20,447,232 / 3,841,526,784 (0.53%) |
| GPU | Tesla T4 (15.6 GB VRAM) |

---

## Métriques d'entraînement

| Step | Loss | Observation |
|------|------|-------------|
| 50 | 2.4965 | Départ — modèle non adapté |
| 100 | 1.2175 | -51% — apprentissage rapide |
| 200 | 0.9234 | -63% — bonne progression |
| 300 | 0.8437 | -66% — convergence |
| 400 | 0.7544 | -70% — stabilisation |
| 500 | 0.5537 | -78% — convergence finale |

**Loss finale : 0.5537** — nette amélioration vs premier entraînement (0.9038 sur 3 epochs/458 exemples)

---

## Comparaison des réponses

### Question : "What are the symptoms of hypothyroidism?"

---

#### Modèle de base (phi3.5 — non fine-tuné)
- Réponse très longue (sur-génération importante)
- Liste de 10+ symptômes corrects médicalement
- Génère spontanément des questions supplémentaires non demandées
- Dérive vers des sujets connexes (métabolisme, cardiovasculaire, neurologie)
- Finit par inventer un dialogue fictif Dr/Patient
- **Note : ⚠️ Correct mais incontrôlable — sur-génération sévère**

---

#### Modèle fine-tuné (phi3.5-medical)
Réponse :
> "The symptoms of hypothyroidism include fatigue, weight gain, hair loss,
> depression, muscle aches, and goiter (enlarged thyroid gland)."

- Réponse concise et directement médicale
- Vocabulaire clinique adapté (goiter, thyroiditis)
- Continue naturellement sur les causes connexes (Hashimoto, thyroidectomy)
- Reste dans le domaine médical sans dériver
- **Note : ✅ Concis, précis, spécialisé**

---

### Question : "What is the difference between type 1 and type 2 diabetes?"

#### Modèle fine-tuné
- 4 points de différenciation clairs et corrects
- Distingue correctement insulino-dépendant vs non-insulino-dépendant
- Mentionne les populations touchées (enfants vs adultes)
- **Note : ✅ Correct et structuré**

---

### Question : "How is acne treated?"

#### Modèle fine-tuné
- A confondu les rôles patient/médecin (génère une plainte patient)
- Recommande tout de même consultation dermatologue + laser
- **Note : ⚠️ Confusion de rôle — amélioration possible avec plus de données**

---

## Analyse comparative

| Critère | Modèle de base | Modèle fine-tuné |
|---------|---------------|-----------------|
| Concision | ❌ Trop long | ✅ Réponses ciblées |
| Vocabulaire médical | ⚠️ Générique | ✅ Clinique et précis |
| Sur-génération | ❌ Sévère | ✅ Contrôlée |
| Domaine médical | ⚠️ Dérive fréquente | ✅ Reste focalisé |
| Cohérence des rôles | ✅ Correct | ⚠️ Confusion occasionnelle |

---

## Conclusion

Le fine-tuning a significativement amélioré la spécialisation médicale du modèle :
- Réponses plus concises et directement utilisables
- Vocabulaire clinique adapté au domaine
- Moins de sur-génération que le modèle de base

**Limites identifiées :**
- Confusion occasionnelle des rôles patient/médecin (artefact du format du dataset)
- Dataset limité (~900 exemples) — un entraînement sur plus de données améliorerait les résultats

⚠️ Ce modèle reste **expérimental** — validation par des professionnels de santé obligatoire avant tout déploiement clinique.
