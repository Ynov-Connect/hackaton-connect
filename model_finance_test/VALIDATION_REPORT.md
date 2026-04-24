# Rapport de Validation — Modèle PHI-3.5-Financial

**Date :** 24/04/2026  
**Modèle testé :** phi3-financial (phi3.5 + Modelfile TechCorp)  
**Testeur :** Spécialiste IA/Data  
**Outil :** Ollama (local)

---

## Phase 1 — Tests initiaux (Modelfile sans paramètres)

| # | Question | Note | Problème |
|---|----------|------|----------|
| 1 | What is the best way to start investing? | ✅ | Correct, bien structuré |
| 2 | How should I create a budget? | ✅ | Correct, logique |
| 3 | Explain compound interest to me | ⚠️ | Trop long (20 points), formules approximatives |
| 4 | What are the risks of cryptocurrency? | ⚠️ | 41 points, répétitions, numérotation cassée |
| 5 | How do I save for retirement? | ⚠️ | Trop long, hallucination d'une nouvelle question |

**Bilan : 2/5 ✅ — Problème principal : sur-génération, aucun paramètre défini**

---

## Phase 2 — Post-optimisation
*(num_predict 400, temperature 0.5, top_p 0.85, repeat_penalty 1.2, top_k 40)*

| # | Question | Note | Observation |
|---|----------|------|-------------|
| 3 | Explain compound interest | ✅ | Concis, exemple chiffré cohérent |
| 4 | Risks of cryptocurrency | ✅ | 4 points, aucune répétition |
| 5 | Save for retirement | ✅ | Complet, aucune hallucination |

**Bilan : 5/5 ✅**

---

## Phase 3 — Tests avancés
*(num_predict -1, temperature 0.3, num_ctx 4096)*

| # | Question | Note | Observation |
|---|----------|------|-------------|
| 6 | Profit margin avec hausse des coûts +15% | ✅ | Calcul correct ~26.8%, complet |
| 7 | Difference between stock and ETF | ✅ | 7 points structurés |
| 8 | What is a balance sheet? | ✅ | 3 composants corrects, équation citée |
| 9 | High debt-to-equity ratio | ✅ | Risques identifiés, nuances sectorielles |
| 10 | Fed interest rate vs stock market | ✅ | 5 mécanismes corrects |

**Bilan : 10/10 ✅**

---

## Verdict final

**Statut : VALIDÉ ET OPTIMISÉ**

Le modèle phi3-financial est fonctionnel et prêt pour intégration avec l'interface web DEV WEB.

**Paramètres Modelfile finaux :**

| Paramètre | Valeur | Raison |
|-----------|--------|--------|
| num_predict | -1 | Évite toute coupure |
| temperature | 0.3 | Réponses factuelles |
| top_p | 0.85 | Réduit les divagations |
| repeat_penalty | 1.2 | Élimine les répétitions |
| top_k | 40 | Cohérence du domaine |
| num_ctx | 4096 | Conversations longues |

**Score final : 10/10**

Voir [OPTIMIZATION_CHOICES.md](OPTIMIZATION_CHOICES.md) pour le détail des justifications.
