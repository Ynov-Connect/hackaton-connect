# PROJET TECHCORP — Challenge IA 7h

Hackathon inter-filières Ynov (IA & Data, Informatique, Cybersécurité) — 24/04/2026

---

## Stack technique

### Interface web (`rendu/devweb/`)

| Couche | Technologie |
|---|---|
| Framework UI | React 18 + TypeScript |
| Build tool | Vite 5 |
| Style | Tailwind CSS v3 + shadcn/ui |
| Markdown | react-markdown + remark-gfm |
| BFF (proxy) | Fastify 5 + @fastify/cors |
| Runtime serveur | Node.js 22 + tsx |

### Modèle IA

| Élément | Détail |
|---|---|
| Modèle de base | Microsoft Phi-3.5-mini-instruct |
| Fine-tuning production | `phi3-financial-optimized` via Ollama |
| Serveur d'inférence | Ollama — `https://ollama.velha-tech.fr` |
| Paramètres clés | temperature 0.3 · top_p 0.85 · repeat_penalty 1.2 · num_ctx 4096 |

### Expérimental R&D

| Élément | Détail |
|---|---|
| Objectif | Fine-tuning LoRA sur dataset médical |
| Dataset | `ruslanmv/ai-medical-chatbot` (Hugging Face) |
| Méthode | LoRA via Google Colab Pro (GPU) |
| Résultat | Notebook disponible dans `medical_project/fine_tuning_results/` |

---

## Architecture

```
hackaton-connect/
├── rendu/
│   └── devweb/              # Application web (frontend + BFF)
│       ├── src/             # React + TypeScript
│       │   ├── components/  # UI (Sidebar, ChatWindow, MessageBubble…)
│       │   ├── hooks/       # useChat, useConversations
│       │   ├── services/    # Client BFF (ollamaClient.ts)
│       │   └── types/       # Types partagés
│       └── server/          # BFF Fastify
│           └── routes/      # /api/chat, /api/health, /api/models
├── ollama_server/           # Modelfile Phi-3.5-Financial
├── model_finance_test/      # Tests de validation + choix d'optimisation
├── medical_project/         # Fine-tuning LoRA médical (notebook Colab)
├── datasets/                # Dataset médical + rapport d'analyse
├── scripts/                 # Scripts Python utilitaires
└── tritton_server/          # Configuration Triton (référence)
```

**Flux de données :**
```
Navigateur → Vite proxy (/api) → BFF Fastify :3001 → Ollama HTTPS → phi3-financial-optimized
```

---

## Lancer le projet

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
cd rendu/devweb
npm install
```

### Configuration

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Variables disponibles dans `.env` :

```env
OLLAMA_URL=https://ollama.velha-tech.fr
OLLAMA_MODEL=phi3-financial-optimized
OLLAMA_TOKEN=<bearer_token>
PORT=3001
HOST=127.0.0.1
```

### Démarrage (développement)

```bash
npm run dev
```

Lance simultanément :
- **Vite** sur `http://localhost:5173` (frontend)
- **Fastify BFF** sur `http://localhost:3001` (proxy Ollama)

### Commandes individuelles

```bash
npm run dev:web    # frontend seul
npm run dev:api    # BFF seul
npm run build      # build de production
```

---

## API BFF

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/ping` | Vérifie que le BFF tourne |
| `GET` | `/api/health` | Vérifie la connexion à Ollama |
| `GET` | `/api/models` | Liste les modèles disponibles |
| `POST` | `/api/chat` | Envoie un message (streaming NDJSON) |

Toutes les requêtes vers `/api/chat` nécessitent le header :
```
Authorization: Bearer <token>
```

### Exemple de requête `/api/chat`

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "messages": [
      { "role": "user", "content": "Qu'\''est-ce que le ratio P/E ?" }
    ]
  }'
```

---

## Modèle — Phi-3.5-Financial

Le modèle est spécialisé en **finance et analyse économique**. Il répond à des questions conceptuelles et analytiques, sans accès aux données en temps réel.

**Exemples de questions adaptées :**
- Qu'est-ce que le ratio P/E et comment l'interpréter ?
- Explique la diversification d'un portefeuille
- Quelle est la différence entre une action et un ETF ?
- Comment fonctionne une obligation d'État ?
- Quels facteurs influencent les taux d'intérêt ?

**Le modèle ne peut pas :**
- Fournir des cours boursiers en temps réel
- Accéder à l'actualité financière
- Exécuter des ordres de bourse

---

## Équipe

| Filière | Rôle |
|---|---|
| Dev Web | Interface React + BFF Fastify |
| IA / Data | Validation du modèle, fine-tuning LoRA médical |
| Infra | Déploiement Ollama, serveur d'inférence |
| Cybersécurité | Audit sécurité, tests de robustesse LLM |
