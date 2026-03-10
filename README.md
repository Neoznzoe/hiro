# Hiro 🎯

> Job Search Cockpit — Analyse d'offres + suivi de candidatures intelligent

## Stack

- **Next.js 15** (App Router)
- **PostgreSQL + Prisma** (Railway)
- **Claude API** (Anthropic) — analyse offres, questions entretien, templates relance
- **Firecrawl** — scraping offres & boîtes
- **Tailwind CSS + shadcn/ui**

---

## Setup en local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# → Remplir DATABASE_URL, ANTHROPIC_API_KEY, FIRECRAWL_API_KEY

# 3. Pousser le schéma Prisma
npm run db:push

# 4. Lancer en dev
npm run dev
```

---

## Structure du projet

```
hiro/
├── app/
│   ├── api/
│   │   ├── analyze/          → POST : scraping + analyse Claude
│   │   ├── applications/     → GET/POST : liste + création candidatures
│   │   │   └── [id]/         → GET/PATCH/DELETE : détail candidature
│   │   └── profile/          → GET/POST : profil + upload CV
│   ├── dashboard/            → Page d'accueil / cockpit
│   ├── analyze/              → Page d'analyse d'une offre
│   └── applications/
│       └── [id]/             → Détail d'une candidature
├── components/
│   ├── ui/                   → Composants génériques
│   ├── analysis/             → Composants résultat d'analyse
│   ├── applications/         → Tableau candidatures, formulaire
│   └── dashboard/            → Widgets dashboard
├── lib/
│   ├── claude/analyze.ts     → Prompts + appels Claude API
│   ├── scraper/index.ts      → Firecrawl wrapper
│   ├── db/index.ts           → Prisma client singleton
│   └── followup.ts           → Logique de calcul des relances
├── prisma/
│   └── schema.prisma         → Schéma DB
├── types/
│   └── index.ts              → Types TypeScript
└── .env.example
```

---

## Fonctionnalités — MVP P0

- [x] Scaffold complet
- [ ] Scraping d'URL d'offre via Firecrawl
- [ ] Analyse Claude : offre + red flags + boîte + entretien + CV
- [ ] Ajout candidature au tableau depuis l'analyse
- [ ] Tableau des candidatures avec statuts
- [ ] Candidatures spontanées (formulaire manuel)
- [ ] Calcul automatique de la date de relance

## Fonctionnalités — Sprint 2 (P1)

- [ ] Templates d'email de relance générés par Claude
- [ ] Notifications relances urgentes (badge)
- [ ] Timeline événements par candidature
- [ ] Upload et parsing CV utilisateur

## Fonctionnalités — Sprint 3 (P2)

- [ ] Dashboard analytics (taux de réponse, sources, stats)
- [ ] CRON job relances (Inngest ou Railway scheduler)
- [ ] Export PDF fiche candidature

---

## Délais de relance recommandés

| Source | Délai | Raison |
|--------|-------|--------|
| LinkedIn | J+7 | Compétitif, les RH répondent vite |
| Indeed / WTTJ | J+10 | Standard CDI |
| Cabinet recrutement | J+14 | Processus plus long |
| Grand groupe | J+21 | Délais administratifs |
| Candidature spontanée | J+30 | Pas d'urgence de leur côté |

---

## Notes d'architecture

**Fallback scraping** : si Firecrawl échoue (offre derrière auth, blocked), l'API `/analyze` accepte aussi `rawText` dans le body — l'UI propose un champ "coller le texte de l'offre".

**analysisData** : le résultat complet de l'analyse Claude est stocké en JSONB dans la table `applications`. Ça permet de ré-afficher l'analyse complète sans rappeler l'API.

**UserProfile** : un seul enregistrement pour l'usage solo. Pas d'auth complexe nécessaire pour un side project perso.
