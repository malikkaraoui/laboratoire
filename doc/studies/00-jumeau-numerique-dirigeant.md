# Étude #00 — Jumeau numérique d'entreprise pour dirigeant

> **Statut** : 🧠 Brainstorming (BMad Method · module CIS)
> **Auteur** : Malik KARAOUI
> **Date** : 2026-04-26
> **Code** : aucun pendant cette phase. Pivot stratégique avant tout build.

---

## 1. Genèse

Le projet a démarré comme un fork francophone de Paperclip. Au fil des itérations
(plugin atelier, providers Ollama/OpenRouter, vue Mission cockpit-first, wizard
de création société), une vision plus ambitieuse a émergé :

> **Faire de Paperclip un laboratoire d'essai pour dirigeants** — un endroit où
> on peut numériser sa vraie société, simuler des décisions stratégiques,
> mesurer leurs conséquences en virtuel avant de les prendre dans la vraie vie.

Cette intuition débloque un produit business clair, distinct de Paperclip
upstream : un **simulateur de décisions stratégiques** pour CEO / dirigeants
de TPE-PME.

---

## 2. Vision produit cible

### 2.1 Promesse

« Avant de signer, recruter, lancer, fermer, négocier — **simule.**
Vois ce que tes meilleurs collaborateurs (incarnés par des agents) feraient,
ce qu'ils te diraient, ce qui pourrait mal tourner. »

### 2.2 Exemple-fil-rouge

> **Question dirigeant** : « Je dois recruter un chef de chantier senior pour
> ce nouveau projet de rénovation. Je vise X (62k€, dispo dans 2 semaines).
> J'engage ou pas ? »
>
> **Sortie de la simulation** :
> - Coût engagé sur 12 mois : 78k€ chargé.
> - ROI projeté du chantier (sans X) : 110k€ marge → 32k€ net.
> - **Mais** : votre devis a été signé il y a 18 mois. L'augmentation des
>   matières premières (acier +14%, bois +8% sur 6 mois selon tendance INSEE)
>   n'est pas indexée dans le devis. Marge ajustée : 87k€ → **9k€ net**.
> - **Risque caché** : votre CTO virtuel détecte que X n'a jamais conduit de
>   chantier dans le périmètre géographique [Bretagne], où votre seul
>   sous-traitant maçonnerie est en redressement judiciaire (info publique).
> - **Décision recommandée** : recruter, mais renégocier l'avenant matières
>   premières + sécuriser un 2e sous-traitant maçonnerie avant signature
>   de l'embauche.

C'est *ça* qu'on vend. Pas un chatbot. **Une intelligence stratégique
contextuelle**, qui sait croiser interne (ta société) + externe (actualité,
géographie, sectoriel, marché matières) + historique (devis, comptes, équipe)
pour t'éviter de prendre une mauvaise décision à 50k€.

### 2.3 Différenciateur clé

L'agrégation. Personne n'a aujourd'hui un produit qui combine :

1. **Ton interne** — équipe, comptes, devis, projets, mails, réunions
2. **Ton secteur** — tendances métier, prix matières, offres concurrents
3. **Ton territoire** — actualité locale, fournisseurs en difficulté, dynamique
4. **L'actualité macro** — taux, taxes, réglementation, météo économique

Les agents de Paperclip deviennent les **incarnations virtuelles** de ton
équipe, mais alimentées par **toute** cette donnée croisée.

---

## 3. Business model

### 3.1 Hypothèse de départ (à challenger via BMad)

| Item | Valeur |
|---|---|
| Cible primaire | TPE/PME 5-50 employés, dirigeant opérationnel |
| Tarif | **99 €/mois** (à valider) — version pro |
| Tarif découverte | 19 €/mois (1 simulation/semaine, 1 agent) |
| Tarif équipe | 299 €/mois (10 agents, accès comptable) |
| Onboarding | Audit gratuit 30 min + import société + 1 simulation offerte |
| Modèle | SaaS (cloud) avec option self-hosted entreprise |

### 3.2 Pourquoi ça peut marcher

- Les outils actuels de dirigeant TPE/PME (compta, RH, CRM) **stockent** des données mais **ne raisonnent pas** dessus
- ChatGPT/Claude **raisonnent** mais ne connaissent pas ton entreprise
- **Le vide** : un produit qui ingère ton réel + raisonne en agents incarnant ton équipe
- Les dirigeants de TPE/PME prennent **2-5 décisions/mois** à fort impact : un outil qui les aide à éviter une seule mauvaise décision se rentabilise en quelques minutes

### 3.3 Pourquoi ça peut échouer

- Souveraineté/RGPD : confier ses comptes + son équipe + ses devis à un SaaS est
  un acte de foi → besoin d'une option **100% local (Ollama)**
- Friction d'import : si l'onboarding prend 2h on perd 80% des prospects
- Trust : la première recommandation foireuse tue l'usage

---

## 4. Inventaire des sources de vérité du dirigeant

Où vivent les informations dont a besoin le simulateur :

### 4.1 Données internes structurées

| Source | Exemples outils | Méthode d'import | Friction |
|---|---|---|---|
| Comptabilité | Pennylane · Sage · Indy · Tiime · Henrri · Cegid | API · export CSV/PDF | 🟡 moyenne |
| RH & paie | Lucca · PayFit · BambooHR · Notion | API OAuth · CSV | 🟡 moyenne |
| CRM/ventes | HubSpot · Pipedrive · Salesforce · Notion · Airtable | API OAuth | 🟢 faible |
| Banque | Bridge · Linxo · Powens (DSP2 open banking) | OAuth bancaire | 🟠 forte (DSP2) |
| Devis/facturation | QuickBooks · Henrri · Tiime · interne | API · CSV · PDF | 🟡 moyenne |
| Projets | Linear · Jira · Asana · Notion · GitHub | API OAuth | 🟢 faible |

### 4.2 Données internes non structurées

| Source | Exemples | Méthode | Friction |
|---|---|---|---|
| Documents | Drive · Dropbox · OneDrive · NAS local | OAuth · MCP server · scan local | 🟢 → 🔴 |
| Mails | Gmail · Outlook · Proton | OAuth · IMAP | 🟠 (consentement délicat) |
| Calendrier | Google Cal · Outlook · Apple | OAuth | 🟢 faible |
| Réunions | Zoom · Teams · Meet (transcripts) · Otter · Fireflies | API · upload manuel | 🟡 moyenne |
| Slack/Teams | Slack · Teams · Discord | OAuth + webhooks | 🟠 (RGPD employés) |

### 4.3 Données externes publiques (zéro friction)

| Source | Exemples | API |
|---|---|---|
| Légal société | SIRENE/INSEE · Pappers · Société.com · Infogreffe | publiques |
| Site web société | Crawl + extraction | scraper interne |
| GitHub public | Repos org publics | API GitHub |
| LinkedIn | Posts entreprise | scraper (zone grise) |
| Presse / actualité | Google News · NewsAPI · MediaStack | APIs payantes ou agrégateur |
| Indices matières | INSEE · BDM · Eurostat · S&P GSCI | open data |
| Météo économique | INSEE · Banque de France · OCDE | open data |

### 4.4 Données externes commerciales

| Source | Usage |
|---|---|
| Sociétés concurrentes | Pappers (SIRET concurrents, dirigeants, comptes déposés) |
| Marché immobilier | DVF (open data) · MeilleursAgents API |
| Réglementation | Légifrance · BOAMP · alertes JO |
| Concurrence offre | Capterra · G2 · scraping sites concurrents |

---

## 5. Stratégies d'import — matrice friction × valeur

```
              FRICTION
              FAIBLE   MOYENNE  FORTE   TRÈS FORTE
  ┌─────────────────────────────────────────────┐
H │  ✅       🟡        🟠       🔴           │
A │ Sources  Drive    Open Bank  Scan          │
U │ publiques OAuth   DSP2      machine        │
T │ + GitHub Compta              local         │
E │ + Cal    OAuth                              │
  │                                             │
V │  ✅       🟡        🟠       —             │
A │ Site web  Slack    Mails                    │
L │ Crawl     OAuth    OAuth                    │
E │ Press     Notion                            │
U │ News                                        │
R │                                             │
  │                                             │
F │  ✅       —        —        —             │
A │ SIRET    CSV       PDF      —              │
I │ Pappers  manuels   upload                   │
B │ DVF      manuel                             │
L │                                             │
E │                                             │
  └─────────────────────────────────────────────┘
```

### 5.1 Reco MVP

**Phase 1 — Friction ZÉRO** (premiers 30 jours d'utilisation, sans login tiers) :
- SIRET → Pappers / Sirene (déjà fait dans PR #8)
- Site web → crawl + extraction LLM
- GitHub org public → repos / langages / activité
- Presse → flux RSS sectoriels filtrés sur le nom + secteur

**Phase 2 — Friction faible OAuth** (premier vrai usage) :
- Google Workspace (Cal + Drive + contacts)
- GitHub privé
- Notion / Airtable

**Phase 3 — Friction moyenne** (engagement long) :
- Comptabilité (Pennylane/Sage via API ou CSV)
- CRM (HubSpot)
- Slack

**Phase 4 — Friction forte** (clients qui ont signé, value démontrée) :
- Open banking DSP2
- Mails (consentement explicite, scope limité)
- Réunions (Zoom/Meet)

**Hors périmètre raisonnable** : scan machine local. Trop intrusif, RGPD difficile.

---

## 6. Choix techniques à trancher

### 6.1 Souveraineté

| Option | Pro | Contra |
|---|---|---|
| **100% local (Ollama)** | Aucune fuite données · cohérent avec ligne actuelle 🦙 · vente facile aux paranos | Perf modèles 4b-70b limitée pour raisonnement complexe · pas de connecteurs cloud sans proxy |
| **Hybride** | Local pour stockage + raisonnement de base, cloud (OpenRouter) pour les analyses lourdes | Doit expliquer où va quoi → effort UX |
| **100% cloud (SaaS classique)** | Perf max · onboarding plus simple | Bloque les clients sensibles · positionnement banal |

**Reco** : **hybride avec local par défaut** — c'est la promesse différenciante.

### 6.2 Connecteurs

| Option | Pro | Contra |
|---|---|---|
| **MCP servers** (déjà supportés via plugin Paperclip) | Standard ouvert · communauté · réutilisable | Écosystème encore jeune · pas tous les SaaS ont leur MCP |
| **OAuth direct** (lib custom) | Maîtrise totale · UX cohérente | Maintenance lourde sur N services |
| **Wrapper iPaaS** (Pipedream / Make / n8n hébergé) | Couvre 1000+ services en 1 jour | Dépendance externe · coût · positionnement contre la souveraineté |

**Reco** : **MCP en priorité 1**, OAuth direct sur les 5-10 sources critiques (Google, GitHub, Pennylane, HubSpot, Slack), iPaaS jamais.

### 6.3 Persistance

| Option | Pro | Contra |
|---|---|---|
| **Postgres seul** (existant) | Simple · déjà là · ACID | Mauvais pour la recherche sémantique des comptes-rendus / docs |
| **Postgres + pgvector** | 1 seule BDD · vector search natif | Setup pgvector |
| **Postgres + Chroma/Qdrant séparé** | Vector store spécialisé · perf | 2 systèmes à orchestrer |

**Reco** : **Postgres + pgvector**. Évite la dépendance à un service extérieur.

### 6.4 Modèles LLM par tâche

| Tâche | Modèle reco |
|---|---|
| Extraction de chiffres clés depuis bilan PDF | claude-3.5-sonnet ou Mistral Large (cloud) |
| Conversation agent quotidien | qwen3.5:4b ou llama3.2 (Ollama local) |
| Résumé long (CR de réunion 1h) | claude-3.5-sonnet ou DeepSeek (cloud) |
| Embeddings docs | nomic-embed-text (Ollama, déjà installé) |
| Raisonnement stratégique (la simulation finale) | claude-opus-4 ou GPT-4o (cloud) |

---

## 7. Légal & sécurité (à ne PAS sous-estimer)

- **RGPD** : fiches employés, mails, calendriers = données personnelles → consentement explicite, durée de conservation, droit à l'effacement
- **Secret des affaires** : comptes, devis, marges → chiffrement au repos, audit trail des accès
- **Open banking DSP2** : agrément AISP requis OU partenariat avec un PSAN (Bridge, Powens) qui en a un
- **Hébergement** : si France/UE clients sensibles → OVHcloud / Scaleway, pas AWS US par défaut

---

## 8. Différenciation vs concurrents

| Concurrent | Ce qu'il fait | Ce qu'on fait en plus |
|---|---|---|
| ChatGPT/Claude | Raisonnent, ne connaissent pas l'entreprise | Notre agrégation interne + externe |
| Notion AI | Search dans tes docs Notion | Multi-source + agents qui simulent |
| Microsoft Copilot | Workflows dans MS365 | Agnostique outils + simulation de décision |
| Pennylane (côté compta) | Reporting financier | Stratégie + interne hors compta |
| Decideware / OCB | Outils décisionnels classiques | Conversationnel + agents incarnés |
| AI consultants type Glean | Search d'entreprise enterprise | Cible TPE/PME + simulation décision (pas que recherche) |

**Notre angle** : on n'est ni un outil de search, ni un assistant générique, ni
un BI classique. On est **le seul à incarner ton équipe en agents et à les
faire débattre d'une décision avant que tu la prennes**.

---

## 9. MVP — proposition pour les 30 premiers jours

### 9.1 Périmètre fonctionnel MVP

1. **Onboarding société existante** (existe déjà PR #8) — enrichir avec :
   - Crawl du site web (extraction mission/équipe/produits par LLM)
   - Lecture GitHub public (langages, activité, taille)
   - Lookup SIRENE (déjà fait)
   - Saisie manuelle de l'équipe (3-10 personnes : nom, fonction)

2. **Importation comptable basique** — CSV export Pennylane/Sage :
   - Bilan résumé · résultat · compte d'exploitation
   - 6 derniers mois de tréso

3. **Simulation de décision** — flow dédié :
   - L'utilisateur décrit en français une décision à prendre
   - 3-5 agents (CEO + CTO + CFO + RH + COO) débattent
   - Output : recommandation + risques chiffrés + alternatives

4. **Source d'actualité minimale** — flux RSS sectoriel filtré

### 9.2 Hors MVP (V2)

- Open banking
- Réunions / mails
- Slack/Teams
- LinkedIn
- Multi-utilisateurs
- API publique

### 9.3 Métriques de succès MVP

| Métrique | Cible 90 jours |
|---|---|
| Sociétés importées (free) | 100 |
| Sociétés actives semaine 4 | 30 (rétention 30%) |
| Conversions vers payant | 10 (10% conversion) |
| MRR | 1 000 € |
| NPS | > 40 |

---

## 10. Plan d'étude (avant tout code)

### 10.1 Workflow BMad recommandé

L'installation BMad inclut **CIS (Creative Innovation Suite)** + le module
**BMM (BMad Method core)**. Pour ce sujet, je recommande :

1. `cis-brainstorm` — explorer largement les sources de données et stratégies
2. `bmm-product-research` — valider la cible (TPE/PME 5-50p) et le tarif (99€)
3. `bmm-prd` — produit la specification du MVP
4. `bmm-architect` — décide stack technique (souveraineté, connecteurs, persistance)
5. `tea-test-strategy` *(optionnel)* — stratégie de test pour le simulateur

### 10.2 Tâches d'étude (1-2 semaines)

| # | Tâche | Livrable | Durée |
|---|---|---|---|
| 1 | Brainstorm large via CIS | Notes brutes + 3-5 angles produit | 0,5 j |
| 2 | Interview 5 dirigeants TPE/PME | Notes user research + pain map | 2-3 j |
| 3 | Audit concurrentiel détaillé | Tableau diff + opportunité | 0,5 j |
| 4 | Étude souveraineté + RGPD | Note de synthèse + reco | 1 j |
| 5 | Évaluation 5 connecteurs prioritaires | Matrice tech + estimation effort | 1 j |
| 6 | Définition MVP serré | PRD MVP de 5 pages max | 1 j |
| 7 | Architecture cible | Doc archi + schéma | 0,5 j |
| 8 | Décision Go / No Go | Réunion finale + roadmap V1 | 0,5 j |

**Total** : ~8 jours de travail effectif, étalable sur 10-15 jours calendaires.

---

## 11. Décisions à prendre maintenant

- [ ] On reste dans le repo `laboratoire` (fork Paperclip) **ou** on crée un
  repo dédié `dirigeant-twin` pour le nouveau produit ?
- [ ] On garde Paperclip comme socle technique ou on assume une réécriture
  partielle (la couche cockpit/missions est largement réutilisable) ?
- [ ] Domaine commercial · marque · landing page : on travaille sur quoi ?
- [ ] On embarque qui dans les interviews dirigeants (réseau, LinkedIn) ?
- [ ] Budget recherche utilisateur (déplacements, pizza) : combien ?

---

## 12. Annexes

### 12.1 Liens BMad

- Repo : https://github.com/bmad-code-org/BMAD-METHOD
- Docs : https://docs.bmad-method.org
- Module CIS : https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite
- Installation faite dans `_bmad/` à la racine du repo

### 12.2 Références marché

- Étude DARES sur les TPE françaises 2024-2025
- Pappers API · https://api.pappers.fr
- Recherche-entreprises (gouv) · https://recherche-entreprises.api.gouv.fr
- INSEE Banque de Données Macroéconomiques · https://www.bdm.insee.fr

---

*Ce document est vivant. Il évoluera au fil des sessions BMad CIS.*
