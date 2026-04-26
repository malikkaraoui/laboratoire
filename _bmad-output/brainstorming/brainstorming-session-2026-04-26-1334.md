---
stepsCompleted: [1]
inputDocuments: ['doc/studies/00-jumeau-numerique-dirigeant.md']
session_topic: "Jumeau numérique d'entreprise pour dirigeant — produit SaaS 99€/mois pour CEO TPE/PME 5-50 personnes francophones, simulateur de décisions stratégiques (recrutement, contrat, lancement, fermeture)"
session_goals: "Explorer largement (100+ idées) avant tout cadrage : sources de données prioritaires, cas d'usage à fort impact, positionnement business, différenciateurs"
selected_approach: ''
techniques_used: []
ideas_generated: []
context_file: 'doc/studies/00-jumeau-numerique-dirigeant.md'
---

# Brainstorming Session Results

**Facilitator:** Malik
**Date:** 2026-04-26
**Langue:** Français

## Session Overview

**Sujet :** Jumeau numérique d'entreprise pour dirigeant — un SaaS qui permet à un CEO de TPE/PME (5-50 personnes, francophone) de cloner sa société dans une plateforme et de simuler des décisions stratégiques (recrutement, contrat, lancement, fermeture) avant de les prendre dans la vraie vie. Tarif cible 99 €/mois.

**Objectifs :**
- Générer 100+ idées en exploration divergente avant tout cadrage
- Couvrir 4 axes : (1) sources de données prioritaires, (2) cas d'usage à fort impact, (3) positionnement business, (4) différenciateurs
- Sortir avec un classement et des prochaines étapes actionnables

### Contexte chargé

Étude initiale `doc/studies/00-jumeau-numerique-dirigeant.md` lue :
- Promesse produit : agrégateur interne + sectoriel + territorial + macro qui incarne l'équipe en agents et fait débattre une décision
- Hypothèses business : 99 €/mois standard, 19 € découverte, 299 € équipe
- Pain identifié : compta/RH/CRM stockent mais ne raisonnent pas ; ChatGPT raisonne mais ne connaît pas l'entreprise
- Concurrence indirecte : ChatGPT, Notion AI, Copilot, Glean, Pennylane, Decideware
- MVP envisagé : onboarding société (PR #8) + import compta CSV + flow simulation 3-5 agents + RSS sectoriel
- Risques : RGPD/souveraineté, friction d'import, trust sur première reco

### Session Setup

**Mode :** divergence d'abord, organisation ensuite. Cible 100+ idées brutes répartis sur les 4 axes. Anti-bias : pivot d'angle tous les 10 idées.

### Synthèse fondatrice (round 1 — input dirigeant)

**Positionnement marché**
- Segment : Decision Intelligence (catégorie existante dominée par Palantir, Aera Technology)
- Angle : démocratisation pour TPE/PME aujourd'hui exclues (complexité, prix, expertise data requise)
- Promesse : « simulateur d'entreprise accessible » / « digital twin simplifié pour PME » / « pilotage décisionnel augmenté »

**Pitch une phrase** : *Une plateforme SaaS abordable qui transforme les données d'une PME en un modèle exploitable permettant de simuler simplement et rapidement l'impact réel de décisions stratégiques.*

**Architecture conceptuelle (4 briques)**
- A — Centralisation données (connecteurs SaaS + import docs, ingestion ciblée RGPD)
- B — Construction d'un *ADN d'entreprise* (Finance / RH / Ops / Position marché)
- C — Moteur de simulation (entrée NL simple → sortie : impact CA, marge, risques, horizon)
- D — Facteurs externes (Météo-France, Eurostat, INSEE, presse)

**Discipline UX critique**
- 1 action = 1 simulation
- Résultat clair et exploitable
- Zéro exposition de la complexité technique (anti-pattern Paperclip-overload)

**Différenciation vs marché**

| Critère | Marché actuel | Notre produit |
|---|---|---|
| Complexité | élevée | faible |
| Prix | très élevé | ~99 €/mois |
| UX | orientée experts | orientée dirigeant |
| Simulation | partielle | globale |
| Accès PME | limité | central |

**Contraintes lockées**
- RGPD : minimisation, contrôle accès, droit à l'effacement
- NIS2 : alignement sécurité
- Modèles explicables (pas de boîte noire)
- Indicateurs de confiance affichés (qualité données → score sur résultat)
- Gestion responsabilité (transparence sur les hypothèses)

**Risques structurants**
- Mauvaise qualité données → simulations biaisées
- Surconfiance utilisateur
- Responsabilité juridique en cas de mauvaise décision suivie

**Héritage CLAUDE.md (socle technique)**
- Paperclip = orchestrateur d'agents → réutilisable comme moteur backend
- claude-atelier = pattern de cockpit Claude Code (skills, hooks, MCP)
- Plugin atelier = mécanisme d'injection contextuelle dans worktree
- Décisions lockées : MCP en P1 connecteurs, OAuth direct pour 5-10 sources critiques, Postgres+pgvector, hybride local/cloud

---

## Phase 1 — Expansive Exploration

**Techniques activées :** What If Scenarios · SCAMPER · Cross-Pollination · Anti-bias pivot tous les 10 idées
**Tagging :** chaque idée porte un axe (DATA / USECASE / BIZ / DIFF), une famille (interne/externe/humain/territoire/sectoriel/macro/provoc), et un score de friction (🟢/🟡/🟠/🔴).

### Wave 1 — Axe DATA · Sources de données prioritaires

**Sous-bloc 1.A — Internes structurées (conventional)**

1. **FEC (Fichier des Écritures Comptables)** — format DGFiP normé, obligatoire toute PME ; le comptable l'envoie en 1 mail. *Friction 🟢 / Famille interne / [DATA]*
2. **Connecteur Pennylane natif** (l'expert-comptable PME francophone par défaut) — API ouverte, pas besoin DSP2 puisque la donnée est déjà dans Pennylane. *🟢 / interne*
3. **OCR sur PDF Sage/Cegid** pour les PME sans API — uploader 12 mois de bilans en 30s. *🟡 / interne*
4. **Bridge ou Powens en marque blanche** (DSP2 sans agrément AISP propre) — décision déjà lockée dans étude. *🟠 / interne*
5. **Export Excel banque mensuel** — fallback si dirigeant refuse OAuth bancaire ; copie-colle 1 fichier. *🟢 / interne*
6. **Connecteur Tiime / Indy / Henrri / Cegid** — multi-cabinet francophone, 4 connecteurs couvrent 70% des TPE. *🟡 / interne*
7. **HubSpot/Pipedrive/Salesforce** — pipeline ventes pondéré → input direct pour la simulation revenus. *🟢 / interne*
8. **PayFit / Lucca / Silae** — masse salariale + dates fin contrat pour scénario départ/recrutement. *🟢 / interne*

**[PIVOT — externes publiques zéro friction]**

9. **Pappers + recherche-entreprises.gouv** — concurrents par code NAF + comptes déposés + dirigeants. *🟢 / externe (déjà PR #8)*
10. **INSEE BDM séries macro** — indices matières (acier, bois, ciment, blé) auto-abonnés par secteur PME identifié. *🟢 / macro*
11. **Météo-France API** — pour BTP, restauration, agro, événementiel : prévi 14j → input à la simu marge mensuelle. *🟢 / macro*
12. **JO + BOAMP** — flux filtré par code APE → alerte réglementaire intégrée à la simu (« cette décision sera impactée par décret X »). *🟢 / externe*
13. **Légifrance** — corpus structuré, recherche conventions collectives applicables (entrée RH simu). *🟢 / externe*
14. **DVF immobilier** — prévi loyer commercial 12 mois (input simu fermeture/déménagement/expansion). *🟢 / territoire*
15. **Eurostat** — taux/inflation/PMI zone euro, input macro pour scénarios à 12-24 mois. *🟢 / macro*

**[PIVOT — humain / équipe]**

16. **"Fiche équipe en 3 lignes par personne"** — dirigeant rédige : *ce qu'elle fait / ce qu'elle réussit / ce qui la coince*. ADN humain capturé en 10 min, zéro outil. *🟢 / humain*
17. **Google Calendar OAuth** — qui rencontre qui → carte tacite des relations clients/fournisseurs (sans lire les contenus). *🟢 / humain*
18. **Slack/Teams ratio messages reçus/envoyés par employé** sans lire le contenu → indicateur charge / risque burn-out. *🟠 / humain*
19. **LinkedIn org page** — détection turnover ("3 départs Q1") + qui a posé sa candidature ailleurs récemment. *🟡 / humain (zone grise)*
20. **Annual reviews / 1:1 notes** uploadées (Notion, Drive) — extraction NL : satisfactions, frustrations, gaps de compétence. *🟡 / humain*

**[PIVOT — non structurées internes]**

21. **PDF de devis client** — extraction ligne à ligne par LLM (montant, marges, échéances, clauses indexation matières). *🟡 / interne*
22. **Otter/Fireflies/Tactiq transcripts** — extraction *« décisions prises »* automatique, alimente l'historique de décisions du dirigeant. *🟡 / humain*
23. **Boîtes "facturation@" / "compta@"** — métadonnées seules (volumes, fréquences, expéditeurs récurrents) sans lecture contenu, RGPD-friendly. *🟠 / humain*
24. **Drive partagé "Direction"** — indexation embeddings sur PV CA, business plans, notes board → mémoire stratégique du dirigeant. *🟡 / humain*
25. **WhatsApp Business export** (relations clients clés) — JSON conversation, fréquence et sentiment. *🟠 / humain (zone éthique)*

**[PIVOT — territorial / sectoriel]**

26. **Pôle Emploi tension métier par bassin** — *« recruter un chef de chantier en Bretagne : marché tendu à 67% »* injecté dans simu RH. *🟢 / territoire*
27. **URSSAF défaillances entreprises** — alerte automatique si sous-traitant ou client passe en redressement. *🟢 / territoire*
28. **Open Data marchés publics (DECP)** — si concurrent gagne 3 marchés en 2 mois → flag concurrence active. *🟢 / sectoriel*
29. **Capterra / G2 reviews concurrents** — diff temporel scoring + thèmes plaintes → opportunités d'offre. *🟡 / sectoriel*
30. **Crunchbase / Dealroom levées concurrents** — alerte « ton concurrent vient de lever 3M€ » → input simulation pression marché. *🟡 / sectoriel*
31. **Wayback + crawl périodique sites concurrents** — détection nouveau pricing, nouvelle offre, nouveau client logo. *🟢 / sectoriel*
32. **INSEE CA moyen par code APE × département** — *« tu es à 60% de la médiane de ton voisinage »*. Benchmark immédiat. *🟢 / sectoriel*

**[PIVOT — provocateur / wild]**

33. **Données passives smartphone dirigeant** (avec consentement explicite, agrégées) — répartition réunions/ops/déplacements, corrélation avec décisions. Frontière éthique mais signal énorme. *🔴 / provoc*
34. **Smartwatch dirigeant** (sommeil/stress) — *« tes recrutements pris en jours de mauvaise nuit performent 18% en dessous »*. Auto-coaching biométrique. *🔴 / provoc*
35. **Caméras IP comptoir / atelier / parking client** — comptage flux, taux occupation, inactivité machines (PME industrie/retail). *🟠 / provoc*
36. **Données fiscales agrégées du quartier** (CP × code APE) — benchmark voisin instantané. *🟢 / territoire*
37. **Avis Google My Business + Trustpilot temporels** — alerte chute satisfaction + extraction motifs récurrents. *🟢 / sectoriel*
38. **Données passives véhicules pro** (Geotab/Ornicar) — taux utilisation flotte, kilomètres improductifs. *🟡 / interne*



