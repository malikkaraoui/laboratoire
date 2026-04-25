# CLAUDE.md — Contexte projet & mission en cours

> Ce fichier est destiné à Claude Code. Il résume le contexte de ce repo, les décisions prises, et la mission active. Lis-le avant toute intervention sur le code.

---

## Ce repo — `laboratoire` (fork de paperclipai/paperclip)

Ce repo est un fork de [paperclipai/paperclip](https://github.com/paperclipai/paperclip), remplaçant un ancien projet scolaire vide.

**Paperclip** est une plateforme open-source (Node.js + React, MIT) qui orchestre des équipes d'agents IA pour faire tourner des entreprises autonomes : org chart, budgets, governance, heartbeats, tickets. Ce n'est pas un framework d'agents — c'est le control plane de l'organisation qui les fait tourner.

Stack : pnpm monorepo, Node.js 20+, Postgres embarqué, API sur `:3100`.

---

## Le projet parallèle — `claude-atelier`

[claude-atelier](https://github.com/malikkaraoui/claude-atelier) est un package npm distinct (maintenu séparément) qui configure une session Claude Code : 30 agents, 18 skills, hooks, MCP GitHub intégré, mémoire persistante, review gate avant push.

Les deux projets sont **complémentaires à des étages différents** :
- claude-atelier = cockpit d'**une** session Claude Code
- paperclip = orchestrateur d'une **équipe** d'agents Claude Code

---

## Mission active — Plugin `paperclip-plugin-atelier`

**Objectif** : faire que chaque agent Claude Code spawné par Paperclip bénéficie automatiquement de la config claude-atelier (skills, hooks, MCP, mémoire) dans son workspace d'exécution.

### Architecture cible

```
heartbeat → resolveWorkspaceForRun → provisionExecutionWorktree
                                              │
                                              ▼
                                [CORE PATCH] emit "run.workspace_ready"
                                              │
                                              ▼
                          ┌───────────────────────────────────┐
                          │  Plugin: paperclip-plugin-atelier │
                          │  (out-of-process, JSON-RPC stdio) │
                          │                                   │
                          │  ctx.events.on(                   │
                          │    "run.workspace_ready",         │
                          │    async ({ cwd, agentId }) => {  │
                          │      applyProfile(cwd, profile)   │
                          │    }                              │
                          │  )                                │
                          └───────────────────────────────────┘
                                              │
                                              ▼
                          adapter.execute() ← .claude/ déjà injecté
```

### Décisions lockées

| # | Décision |
|---|----------|
| 1 | **API programmatique** — plugin fait `import { applyProfile } from "claude-atelier"`, pas de shell-out `npx` |
| 2 | **Pas de teardown** — le worktree est détruit par Paperclip à la fin du run, le plugin n'intervient pas à `run.finished` |
| 3 | **Deep merge** — si `.claude/` existe déjà dans le worktree (hérité du base ref), fusion profonde : le repo utilisateur gagne toujours sur conflit, atelier complète sans écraser |
| 4 | **Secrets via `ctx.secrets.read-ref`** — aucun token dur-codé, tout passe par le système de secrets Paperclip |

### Stratégie de merge `.claude/`

| Fichier | Règle |
|---|---|
| `.claude/settings.json` | Deep merge ; atelier gagne sur clé terminale sauf marqueur `// @keep` côté repo |
| `.claude/hooks/*` | Union ; collision de nom → warning + repo gagne |
| `.claude/agents/*` | Union ; atelier n'écrase jamais un agent portant le même nom |
| `.mcp.json` | Merge par clé `mcpServers.<name>` ; repo gagne |
| `skills/` | Union stricte, préfixe `atelier-` sur tous les skills injectés |

---

## Roadmap d'implémentation (7 phases)

### Phase 0 — Pré-requis côté claude-atelier *(hors ce repo)*
- [ ] Ajouter `export async function applyProfile({ cwd, profile, skills, hooks, mcp })` au package
- [ ] Ajouter flag `--yes --cwd <path>` à la CLI (fallback si API pas dispo)
- [ ] Publier `claude-atelier@0.22.0-preview.0`

**Bloqueur pour Phase 3. Les phases 1 et 2 peuvent démarrer sans.**

### Phase 1 — Patch core : event `run.workspace_ready` *(priorité immédiate)*
Fichiers à modifier :
- `server/src/services/workspace-runtime.ts` — émettre l'event après `provisionExecutionWorktree` réussi
- `packages/plugins/sdk/src/types.ts` — ajouter `"run.workspace_ready"` à `PluginEventType` avec payload typé :
  ```ts
  { runId, issueId, projectId, companyId, cwd, branchName, baseRef, agentId }
  ```
- `doc/plugins/PLUGIN_SPEC.md` §16 — documenter l'event
- `server/src/services/__tests__/workspace-runtime.test.ts` — test unitaire

**Résolu** : l'event est émis dans `heartbeat.ts:5168` via `emitAndAwaitPluginDomainEvent`. Le type `"agent.run.workspace_ready"` est dans `PLUGIN_EVENT_TYPES` (shared/constants.ts) et documenté PLUGIN_SPEC.md §16.3. Aucune modification core nécessaire.

### Phase 2 — Scaffold du plugin
Créer `packages/plugins/atelier/` :
```
packages/plugins/atelier/
├── package.json          # name: @paperclipai/plugin-atelier
├── tsconfig.json
├── build.config.ts       # utilise createPluginBundlerPresets() du SDK
├── src/
│   ├── manifest.ts       # PaperclipPluginManifestV1
│   ├── worker.ts         # definePlugin({ setup })
│   ├── injector.ts       # deep merge .claude/ dans le cwd
│   ├── profiles.ts       # presets full / lean / review-only
│   └── config-schema.ts  # JsonSchema instanceConfigSchema
└── dist/                 # généré par build
```

Manifest capabilities : `["events.subscribe", "plugin.state.read", "plugin.state.write", "secrets.read-ref"]`

### Phase 3 — Logique d'injection *(dépend de P0 + P1)*
- `src/injector.ts` — deep merge strategy par type de fichier (voir tableau ci-dessus)
- `src/worker.ts` — subscribe à `run.workspace_ready`, appel `applyProfile`, log via `ctx.activity`
- `src/profiles.ts` — 3 presets :
  - `full` — 30 agents + 18 skills + hooks + MCP GitHub + mémoire persistante
  - `lean` — skills essentiels (token killer, review gate)
  - `review-only` — uniquement le verrou §25 avant push

### Phase 4 — Configuration & résolution par agent
- Schema exposé via Paperclip UI : `defaultProfile`, `skills[]`, `mcpServers{}`, `perAgentOverrides{}`
- Résolution : `perAgentOverrides[agentId]` > `defaultProfile` > `"lean"`

### Phase 5 — Build & packaging
- `pnpm -F @paperclipai/plugin-atelier build` → `dist/manifest.js` + `dist/worker.js`
- Ajouter à `pnpm-workspace.yaml` si nécessaire
- Champ `paperclipPlugin` dans `package.json`
- CI : inclure dans `pnpm typecheck` et `pnpm test`

### Phase 6 — Installation & smoke test
```bash
pnpm -F @paperclipai/plugin-atelier build
pnpm paperclip plugin install --local packages/plugins/atelier
pnpm paperclip plugin list
```
Test e2e : créer company + agent Claude Code → assigner ticket → vérifier `.paperclip/worktrees/<branch>/.claude/settings.json` présent + log `atelier.injected` dans activity feed.

### Phase 7 — Docs & release
- `packages/plugins/atelier/README.md`
- Mention dans `README.md` racine
- Publication npm : `@paperclipai/plugin-atelier@0.1.0`

---

## État actuel

- [x] Repo laboratoire remplacé par fork paperclipai/paperclip
- [x] `main` mise à jour (commit `60469ac`)
- [x] Décisions d'architecture prises et lockées
- [ ] **P0** — claude-atelier API programmatique *(à faire côté claude-atelier)*
- [x] **P1** — event `agent.run.workspace_ready` déjà émis dans `heartbeat.ts:5168`, documenté PLUGIN_SPEC.md §16.3, type dans SDK ✓
- [x] **P2** — Scaffold complet : `packages/plugins/atelier/` (manifest, worker, injector stub, profiles, config-schema, 8 tests)
- [ ] **P3** — Logique d'injection *(bloqué P0 — claude-atelier@0.22.0-preview.0)*
- [ ] P4 à P7 — en attente de P3

## Branche de développement active

`main` (développement direct)

---

## Points de vigilance pour Claude Code

1. **Ne pas confondre** "project workspace" (permanent, `project.workspace_created`) et "execution worktree" (transient, créé par `provisionExecutionWorktree` dans `workspace-runtime.ts`). Le plugin s'accroche au second.
2. **Les exemples de plugins** sont dans `packages/plugins/examples/` — s'y référer pour la structure manifest/worker.
3. **Le bundler** est configuré via `createPluginBundlerPresets()` dans `packages/plugins/sdk/src/bundlers.ts`.
4. **PLUGIN_SPEC.md** est dans `doc/plugins/` — source de vérité du protocole JSON-RPC et des capabilities.
5. **Chemin critique** : P0 (claude-atelier) → P1 (event core) → P3 (injector) → P6 (e2e).
