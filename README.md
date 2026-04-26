<p align="center">
  <img src="doc/assets/header.png" alt="Paperclip — pilote votre entreprise" width="720" />
</p>

<p align="center">
  <a href="#démarrage-rapide"><strong>Démarrage rapide</strong></a> &middot;
  <a href="https://paperclip.ing/docs"><strong>Documentation</strong></a> &middot;
  <a href="https://github.com/paperclipai/paperclip"><strong>GitHub upstream</strong></a> &middot;
  <a href="https://discord.gg/m4HZY7xNG3"><strong>Discord</strong></a>
</p>

<br/>

<p align="center">
  <strong>🇫🇷 Fork francophone — interface entièrement en français</strong><br/>
  <sub>Basé sur <a href="https://github.com/paperclipai/paperclip">paperclipai/paperclip</a> — merci à toute l'équipe Paperclip pour ce travail de dingue 🙏</sub>
</p>

<br/>

<p align="center">
  <span style="font-size: 96px; line-height: 1;">🦙</span>
</p>

<h2 align="center">Paperclip tourne <em>en local</em> via <strong>OLLAMA</strong></h2>

<p align="center">
  <strong>Zéro dépendance cloud.</strong> Tes agents alimentés par les modèles de ta machine —<br/>
  <code>qwen3.5</code>, <code>mistral</code>, <code>deepseek-r1</code>, <code>llama3.2</code>… tout passe par <code>localhost:11434</code>.<br/>
  <em>Et si tu veux le cloud quand même : <strong>OpenRouter</strong> ☁️ est aussi intégré.</em>
</p>

<details>
<summary><strong>🚀 Ce fork en un coup d'œil — les features qui déchirent</strong></summary>

<br/>

| Statut | Feature |
|--------|---------|
| ✅ En prod | **Interface 100 % en français** — navigation, tableaux de bord, dialogs, graphiques, tout |
| ✅ En prod | **Aide contextuelle** — survol de souris = explication simple sur chaque bouton/icône |
| ✅ En prod | **Tutoriel de démarrage guidé** — assistant pas à pas au premier lancement, relançable depuis les paramètres |
| 🔧 En cours | **Plugin `@paperclipai/plugin-atelier`** — chaque agent Claude Code spawné par Paperclip reçoit automatiquement la config [claude-atelier](https://github.com/malikkaraoui/claude-atelier) (skills, hooks, MCP, mémoire) dans son workspace |
| 🗺️ Roadmap | **Profils d'agents prêts à l'emploi** — `full`, `lean`, `review-only` injectés au démarrage du run |
| 🗺️ Roadmap | **Dashboard francophone enrichi** — métriques localisées, graphiques étendus, filtres avancés |
| 🗺️ Roadmap | **Templates d'entreprises FR** — entreprises préconfigurées pour des use-cases français courants |

</details>

<br/>

<p align="center">
  <a href="https://github.com/paperclipai/paperclip/blob/master/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-blue" alt="Licence MIT" /></a>
  <a href="https://github.com/paperclipai/paperclip/stargazers"><img src="https://img.shields.io/github/stars/paperclipai/paperclip?style=flat" alt="Étoiles" /></a>
  <a href="https://discord.gg/m4HZY7xNG3"><img src="https://img.shields.io/discord/000000000?label=discord" alt="Discord" /></a>
</p>

<br/>

## Qu'est-ce que Paperclip ?

# Orchestration open-source pour entreprises autonomes

**Si OpenClaw est un _employé_, Paperclip est l'_entreprise_**

Paperclip est un serveur Node.js et une interface React qui orchestre une équipe d'agents IA pour faire tourner une entreprise. Apportez vos agents, assignez des objectifs et suivez leur travail depuis un seul tableau de bord.

Ça ressemble à un gestionnaire de tâches — mais sous le capot, il y a des organigrammes, des budgets, de la gouvernance, de l'alignement sur les objectifs et de la coordination entre agents.

**Gérez des objectifs d'entreprise, pas des pull requests.**

|        | Étape                  | Exemple                                                                              |
| ------ | ---------------------- | ------------------------------------------------------------------------------------ |
| **01** | Définir l'objectif     | _"Construire l'appli de prise de notes IA n°1, jusqu'à 1 M€ de MRR."_               |
| **02** | Recruter l'équipe      | CEO, CTO, ingénieurs, designers, marketeurs — n'importe quel bot, n'importe quel fournisseur. |
| **03** | Approuver et lancer    | Valider la stratégie. Définir les budgets. Appuyer sur démarrer. Suivre depuis le tableau de bord. |

<br/>

> **BIENTÔT DISPONIBLE : Clipmart** — Téléchargez et lancez des entreprises entières en un clic. Parcourez des modèles préconfigurés — structures d'organisation, configs d'agents et compétences — et importez-les dans votre instance Paperclip en quelques secondes.

<br/>

<div align="center">
<table>
  <tr>
    <td align="center"><strong>Compatible<br/>avec</strong></td>
    <td align="center"><img src="doc/assets/logos/openclaw.svg" width="32" alt="OpenClaw" /><br/><sub>OpenClaw</sub></td>
    <td align="center"><img src="doc/assets/logos/claude.svg" width="32" alt="Claude" /><br/><sub>Claude Code</sub></td>
    <td align="center"><img src="doc/assets/logos/codex.svg" width="32" alt="Codex" /><br/><sub>Codex</sub></td>
    <td align="center"><img src="doc/assets/logos/cursor.svg" width="32" alt="Cursor" /><br/><sub>Cursor</sub></td>
    <td align="center"><img src="doc/assets/logos/bash.svg" width="32" alt="Bash" /><br/><sub>Bash</sub></td>
    <td align="center"><img src="doc/assets/logos/http.svg" width="32" alt="HTTP" /><br/><sub>HTTP</sub></td>
  </tr>
</table>

<em>S'il peut recevoir un heartbeat, il est recruté.</em>

</div>

<br/>

## Paperclip est fait pour vous si

- ✅ Vous voulez construire des **entreprises IA autonomes**
- ✅ Vous **coordonnez de nombreux agents différents** (OpenClaw, Codex, Claude, Cursor) vers un objectif commun
- ✅ Vous avez **20 terminaux Claude Code simultanément** ouverts et perdez le fil de qui fait quoi
- ✅ Vous voulez des agents qui tournent **en autonomie 24h/24 et 7j/7**, tout en gardant la main pour auditer le travail
- ✅ Vous voulez **surveiller les coûts** et imposer des budgets
- ✅ Vous voulez un processus de gestion des agents qui **ressemble à un gestionnaire de tâches**
- ✅ Vous voulez piloter vos entreprises autonomes **depuis votre téléphone**

<br/>

## Fonctionnalités

<table>
<tr>
<td align="center" width="33%">
<h3>🔌 Apportez votre agent</h3>
N'importe quel agent, n'importe quel runtime, un seul organigramme. S'il peut recevoir un heartbeat, il est recruté.
</td>
<td align="center" width="33%">
<h3>🎯 Alignement sur les objectifs</h3>
Chaque tâche remonte à la mission de l'entreprise. Les agents savent <em>quoi</em> faire et <em>pourquoi</em>.
</td>
<td align="center" width="33%">
<h3>💓 Heartbeats</h3>
Les agents se réveillent selon un planning, vérifient le travail et agissent. La délégation circule dans tout l'organigramme.
</td>
</tr>
<tr>
<td align="center">
<h3>💰 Contrôle des coûts</h3>
Budgets mensuels par agent. Quand la limite est atteinte, ils s'arrêtent. Zéro dérive incontrôlée.
</td>
<td align="center">
<h3>🏢 Multi-entreprise</h3>
Un seul déploiement, plusieurs entreprises. Isolation complète des données. Un seul plan de contrôle pour votre portefeuille.
</td>
<td align="center">
<h3>🎫 Système de tickets</h3>
Chaque conversation tracée. Chaque décision expliquée. Traçage complet des appels d'outils et journal d'audit immuable.
</td>
</tr>
<tr>
<td align="center">
<h3>🛡️ Gouvernance</h3>
Vous êtes le conseil d'administration. Approuvez les recrutements, modifiez la stratégie, mettez en pause ou terminez n'importe quel agent — à tout moment.
</td>
<td align="center">
<h3>📊 Organigramme</h3>
Hiérarchies, rôles, lignes hiérarchiques. Vos agents ont un patron, un titre et une fiche de poste.
</td>
<td align="center">
<h3>📱 Mobile</h3>
Surveillez et gérez vos entreprises autonomes depuis n'importe où.
</td>
</tr>
</table>

<br/>

## Problèmes que Paperclip résout

| Sans Paperclip | Avec Paperclip |
| -------------- | -------------- |
| ❌ 20 onglets Claude Code ouverts et impossible de suivre qui fait quoi. Au redémarrage, tout est perdu. | ✅ Les tâches sont sous forme de tickets, les conversations sont threadées, les sessions persistent entre les redémarrages. |
| ❌ Vous collectez manuellement le contexte de plusieurs endroits pour rappeler à votre bot ce qu'il fait vraiment. | ✅ Le contexte remonte de la tâche jusqu'aux objectifs du projet et de l'entreprise — votre agent sait toujours quoi faire et pourquoi. |
| ❌ Des dossiers de configs d'agents désorganisés et vous réinventez la gestion de tâches, la communication et la coordination entre agents. | ✅ Paperclip vous donne des organigrammes, un système de tickets, de la délégation et de la gouvernance clés en main. |
| ❌ Des boucles incontrôlées gaspillent des centaines d'euros de tokens et épuisent votre quota avant même que vous le sachiez. | ✅ Le suivi des coûts affiche les budgets de tokens et ralentit les agents quand ils les dépassent. |
| ❌ Vous avez des tâches récurrentes (support client, réseaux sociaux, rapports) et devez vous souvenir de les lancer manuellement. | ✅ Les heartbeats gèrent le travail régulier selon un planning. La direction supervise. |
| ❌ Vous avez une idée, vous devez trouver votre repo, lancer Claude Code, garder un onglet ouvert et surveiller. | ✅ Ajoutez une tâche dans Paperclip. Votre agent de code travaille dessus jusqu'à la fin. La direction examine le résultat. |

<br/>

## Ce qui rend Paperclip spécial

Paperclip gère correctement les détails complexes de l'orchestration.

|                                        |                                                                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Exécution atomique.**                | La prise en charge des tâches et l'application du budget sont atomiques : pas de double travail, pas de dérive des coûts.    |
| **État agent persistant.**             | Les agents reprennent le même contexte de tâche entre les heartbeats au lieu de repartir de zéro.                           |
| **Injection de compétences à chaud.**  | Les agents peuvent apprendre les workflows Paperclip et le contexte du projet à l'exécution, sans réentraînement.            |
| **Gouvernance avec retour arrière.**   | Les portes d'approbation sont appliquées, les changements de config sont versionnés, les mauvais changements sont annulables. |
| **Exécution orientée objectifs.**      | Les tâches portent l'ascendance complète des objectifs, les agents voient toujours le « pourquoi », pas seulement un titre.  |
| **Modèles d'entreprises portables.**   | Exportez/importez des orgs, agents et compétences avec nettoyage des secrets et gestion des collisions.                     |
| **Isolation multi-entreprise réelle.** | Chaque entité est scopée à l'entreprise : un déploiement peut faire tourner plusieurs entreprises avec des données séparées. |

<br/>

## Ce qu'il y a sous le capot

Paperclip est un plan de contrôle complet, pas un wrapper. Avant de construire tout ça vous-même, sachez que ça existe déjà :

```
┌──────────────────────────────────────────────────────────────┐
│                       PAPERCLIP SERVER                       │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │Identité & │  │ Travail & │  │Heartbeat  │  │Gouvernance│  │
│  │  Accès    │  │  Tâches   │  │Exécution  │  │& Approbat.│  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │Organi-    │  │Workspaces │  │ Plugins   │  │  Budget   │  │
│  │gramme     │  │& Runtime  │  │           │  │ & Coûts   │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Routines  │  │Secrets &  │  │ Activité  │  │Portabilité│  │
│  │& Planning │  │ Stockage  │  │& Événements│ │entreprise │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
└──────────────────────────────────────────────────────────────┘
         ▲              ▲              ▲              ▲
   ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
   │  Claude   │  │   Codex   │  │   CLI     │  │ HTTP/web  │
   │   Code    │  │           │  │  agents   │  │   bots    │
   └───────────┘  └───────────┘  └───────────┘  └───────────┘
```

### Les systèmes

<table>
<tr>
<td width="50%">

**Identité & Accès** — Deux modes de déploiement (local de confiance ou authentifié), utilisateurs du conseil, clés API des agents, JWTs de run éphémères, appartenances aux entreprises, flux d'invitation et onboarding OpenClaw. Chaque requête de mutation est tracée à un acteur.

</td>
<td width="50%">

**Organigramme & Agents** — Les agents ont des rôles, des titres, des lignes hiérarchiques, des permissions et des budgets. Les adaptateurs couvrent : Claude Code, Codex, agents CLI (Cursor/Gemini/bash), bots HTTP/webhook (OpenClaw) et plugins d'adaptateurs externes. S'il peut recevoir un heartbeat, il est recruté.

</td>
</tr>
<tr>
<td>

**Travail & Système de tâches** — Les tickets portent des liens entreprise/projet/objectif/parent, une prise en charge atomique avec verrous d'exécution, des dépendances bloquantes de premier ordre, des commentaires, des documents, des pièces jointes, des produits de travail, des étiquettes et un état de boîte de réception. Pas de double travail, pas de contexte perdu.

</td>
<td>

**Exécution par Heartbeat** — File d'attente de réveil en base de données avec coalescence, vérifications du budget, résolution du workspace, injection des secrets, chargement des compétences et invocation des adaptateurs. Les runs produisent des logs structurés, des événements de coût, l'état de session et des pistes d'audit. La récupération gère automatiquement les runs orphelins.

</td>
</tr>
<tr>
<td>

**Workspaces & Runtime** — Workspaces de projet, workspaces d'exécution isolés (worktrees git, branches d'opérateur) et services runtime (serveurs de dev, URLs de prévisualisation). Les agents travaillent toujours dans le bon répertoire avec le bon contexte.

</td>
<td>

**Gouvernance & Approbations** — Workflows d'approbation du conseil, politiques d'exécution avec étapes de revue/approbation, suivi des décisions, arrêts durs de budget, mise en pause/reprise/arrêt des agents, et journalisation complète des audits. Vous êtes le conseil — rien n'est livré sans votre accord.

</td>
</tr>
<tr>
<td>

**Budget & Contrôle des coûts** — Suivi des tokens et des coûts par entreprise, agent, projet, objectif, ticket, fournisseur et modèle. Politiques de budget scopées avec seuils d'avertissement et arrêts durs. Le dépassement met en pause les agents et annule le travail en attente automatiquement.

</td>
<td>

**Routines & Planning** — Tâches récurrentes avec déclencheurs cron, webhook et API. Politiques de concurrence et de rattrapage. Chaque exécution de routine crée un ticket suivi et réveille l'agent assigné — plus de lancement manuel.

</td>
</tr>
<tr>
<td>

**Plugins** — Système de plugins à l'échelle de l'instance avec workers out-of-process, services hôtes à capacités limitées, planification de jobs, exposition d'outils et contributions UI. Étendez Paperclip sans le forker.

</td>
<td>

**Secrets & Stockage** — Secrets d'instance et d'entreprise, stockage local chiffré, stockage objet par fournisseur, pièces jointes et produits de travail. Les valeurs sensibles restent hors des prompts sauf si un run scopé en a explicitement besoin.

</td>
</tr>
<tr>
<td>

**Activité & Événements** — Les actions de mutation, les changements d'état des heartbeats, les événements de coût, les approbations, les commentaires et les produits de travail sont enregistrés comme activité durable pour que les opérateurs puissent auditer ce qui s'est passé et pourquoi.

</td>
<td>

**Portabilité des entreprises** — Exportez et importez des organisations entières — agents, compétences, projets, routines et tickets — avec nettoyage des secrets et gestion des collisions. Un seul déploiement, plusieurs entreprises, isolation complète des données.

</td>
</tr>
</table>

<br/>

## Ce que Paperclip n'est pas

|                                       |                                                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Pas un chatbot.**                   | Les agents ont des postes, pas des fenêtres de chat.                                                                                |
| **Pas un framework d'agents.**        | Nous ne vous disons pas comment construire des agents. Nous vous disons comment faire tourner une entreprise qui en est composée.   |
| **Pas un constructeur de workflows.** | Pas de pipelines drag-and-drop. Paperclip modélise des entreprises — avec des organigrammes, des objectifs, des budgets et de la gouvernance. |
| **Pas un gestionnaire de prompts.**   | Les agents apportent leurs propres prompts, modèles et runtimes. Paperclip gère l'organisation dans laquelle ils travaillent.       |
| **Pas un outil mono-agent.**          | C'est fait pour des équipes. Un agent ? Vous n'avez probablement pas besoin de Paperclip. Vingt ? Vous en avez absolument besoin.   |
| **Pas un outil de code review.**      | Paperclip orchestre le travail, pas les pull requests. Apportez votre propre processus de revue.                                    |

<br/>

## Démarrage rapide

Open source. Hébergé chez vous. Aucun compte Paperclip requis.

```bash
npx paperclipai onboard --yes
```

Ce chemin de démarrage rapide utilise par défaut le mode loopback local de confiance pour le lancement le plus rapide. Pour démarrer en mode authentifié/privé, choisissez explicitement un preset de liaison :

```bash
npx paperclipai onboard --yes --bind lan
# ou :
npx paperclipai onboard --yes --bind tailnet
```

Si Paperclip est déjà configuré, relancer `onboard` conserve la config existante. Utilisez `paperclipai configure` pour modifier les paramètres.

Ou manuellement :

```bash
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm dev
```

Ceci démarre le serveur API à `http://localhost:3100`. Une base de données PostgreSQL embarquée est créée automatiquement — aucune configuration requise.

> **Prérequis :** Node.js 20+, pnpm 9.15+

<br/>

## FAQ

**À quoi ressemble une installation typique ?**
En local, un seul processus Node.js gère un Postgres embarqué et un stockage de fichiers local. Pour la production, pointez sur votre propre Postgres et déployez comme vous le souhaitez. Configurez des projets, des agents et des objectifs — les agents s'occupent du reste.

Si vous êtes entrepreneur solo, vous pouvez utiliser Tailscale pour accéder à Paperclip en mobilité, puis déployer sur Vercel quand vous en avez besoin.

**Peut-on faire tourner plusieurs entreprises ?**
Oui. Un seul déploiement peut faire tourner un nombre illimité d'entreprises avec une isolation complète des données.

**En quoi Paperclip est-il différent des agents comme OpenClaw ou Claude Code ?**
Paperclip _utilise_ ces agents. Il les orchestre en entreprise — avec des organigrammes, des budgets, des objectifs, de la gouvernance et de la responsabilité.

**Pourquoi utiliser Paperclip plutôt que de pointer mon OpenClaw vers Asana ou Trello ?**
L'orchestration d'agents a des subtilités : coordination de qui a une tâche en cours, maintien des sessions, surveillance des coûts, établissement de la gouvernance — Paperclip fait tout ça pour vous.

(La prise en charge de votre propre système de tickets est dans la Roadmap)

**Les agents tournent-ils en continu ?**
Par défaut, les agents tournent selon des heartbeats planifiés et des déclencheurs événementiels (assignation de tâche, @-mentions). Vous pouvez aussi brancher des agents continus comme OpenClaw. Vous apportez votre agent, Paperclip coordonne.

<br/>

## Développement

```bash
pnpm dev              # Dev complet (API + UI, mode watch)
pnpm dev:once         # Dev complet sans surveillance de fichiers
pnpm dev:server       # Serveur uniquement
pnpm build            # Tout compiler
pnpm typecheck        # Vérification des types
pnpm test             # Tests rapides (Vitest uniquement)
pnpm test:watch       # Mode watch Vitest
pnpm test:e2e         # Suite navigateur Playwright
pnpm db:generate      # Générer une migration DB
pnpm db:migrate       # Appliquer les migrations
```

`pnpm test` n'exécute pas Playwright. Les suites navigateur sont séparées et ne tournent généralement que lors du travail sur ces flows ou en CI.

Voir [doc/DEVELOPING.md](doc/DEVELOPING.md) pour le guide de développement complet.

<br/>

## Roadmap

- ✅ Système de plugins (base de connaissances, traçage custom, files d'attente, etc.)
- ✅ Intégration OpenClaw / agents de style claw
- ✅ companies.sh — export et import d'organisations entières
- ✅ Configurations AGENTS.md simplifiées
- ✅ Gestionnaire de compétences
- ✅ Routines planifiées
- ✅ Gestion budgétaire améliorée
- ✅ Revues et approbations des agents
- ✅ Plusieurs utilisateurs humains
- ⚪ Agents cloud / sandbox (Cursor, e2b...)
- ⚪ Artefacts & produits de travail
- ⚪ Mémoire / Base de connaissances
- ⚪ Résultats imposés
- ⚪ MODE MAXIMISEUR
- ⚪ Planification approfondie
- ⚪ Files de travail
- ⚪ Auto-organisation
- ⚪ Apprentissage organisationnel automatique
- ⚪ Chat CEO
- ⚪ Déploiements cloud
- ⚪ Application de bureau

Ceci est un aperçu raccourci de la roadmap. Voir la roadmap complète dans [ROADMAP.md](ROADMAP.md).

<br/>

## Communauté & Plugins

Trouvez des plugins et plus encore sur [awesome-paperclip](https://github.com/gsxdsm/awesome-paperclip)

## Télémétrie

Paperclip collecte des données d'utilisation anonymes pour nous aider à comprendre comment le produit est utilisé et à l'améliorer. Aucune information personnelle, contenu de ticket, prompt, chemin de fichier ou secret n'est jamais collecté. Les références de dépôts privés sont hachées avec un sel par installation avant envoi.

La télémétrie est **activée par défaut** et peut être désactivée par l'une des méthodes suivantes :

| Méthode               | Comment                                                     |
| --------------------- | ----------------------------------------------------------- |
| Variable d'environnement | `PAPERCLIP_TELEMETRY_DISABLED=1`                         |
| Convention standard   | `DO_NOT_TRACK=1`                                            |
| Environnements CI     | Désactivée automatiquement quand `CI=true`                  |
| Fichier de config     | Définir `telemetry.enabled: false` dans votre config Paperclip |

## Contribuer

Les contributions sont les bienvenues. Voir le [guide de contribution](CONTRIBUTING.md) pour les détails.

<br/>

## Communauté

- [Discord](https://discord.gg/m4HZY7xNG3) — Rejoindre la communauté
- [Issues GitHub](https://github.com/paperclipai/paperclip/issues) — bugs et demandes de fonctionnalités
- [Discussions GitHub](https://github.com/paperclipai/paperclip/discussions) — idées et RFC

<br/>

## Licence

MIT &copy; 2026 Paperclip

---

## Remerciements

Un immense merci à toute l'équipe de [**paperclipai/paperclip**](https://github.com/paperclipai/paperclip) pour avoir construit quelque chose d'aussi solide et bien architecturé. Votre travail est une base extraordinaire — on est debout sur les épaules de géants. 🙏

Ce fork n'existerait pas sans votre vision, votre code, et votre documentation de qualité. Continuez comme ça, c'est du beau boulot.

> Ce fork vit en parallèle du projet upstream. Les contributions pertinentes remontent vers `paperclipai/paperclip`.

---

## Historique des étoiles

[![Historique des étoiles](https://api.star-history.com/image?repos=paperclipai/paperclip&type=date&legend=top-left)](https://www.star-history.com/?repos=paperclipai%2Fpaperclip&type=date&legend=top-left)

<br/>

---

<p align="center">
  <img src="doc/assets/footer.jpg" alt="" width="720" />
</p>

<p align="center">
  <sub>Open source sous licence MIT. Fait pour ceux qui veulent piloter des entreprises, pas surveiller des agents.</sub>
</p>
