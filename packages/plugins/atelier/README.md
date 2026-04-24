# @paperclipai/plugin-atelier

Plugin Paperclip qui injecte automatiquement la configuration [claude-atelier](https://github.com/malikkaraoui/claude-atelier) dans le workspace de chaque agent Claude Code spawné.

## Ce que ça fait

Lorsque Paperclip crée un worktree d'exécution pour un run, le plugin reçoit l'événement `agent.run.workspace_ready` et appelle `applyProfile()` de `claude-atelier` pour injecter dans le répertoire `.claude/` :

- **Skills** — les 18 skills superpowers (ou un sous-ensemble selon le profil)
- **Hooks** — hook pré-push de revue de code, guard no-sign, etc.
- **MCP** — serveur GitHub MCP si configuré
- **Mémoire persistante** — répertoire de mémoire partagé

L'injection suit une stratégie **deep merge "repo-wins"** : si un `.claude/` existe déjà dans le worktree, les fichiers du repo utilisateur ont priorité sur les fichiers injectés par atelier.

## Prérequis

- Paperclip ≥ 0.1.0
- `claude-atelier@^0.22.0-preview.0` installé sur la machine qui exécute les agents

## Installation

```bash
pnpm paperclip plugin install --local packages/plugins/atelier
```

## Configuration

Dans les paramètres du plugin (UI Paperclip → Extensions → plugin-atelier) :

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `defaultProfile` | `"full"` \| `"lean"` \| `"review-only"` | `"lean"` | Profil d'injection par défaut |
| `skills` | `string[]` | selon profil | Skills supplémentaires à injecter |
| `mcpServers` | `object` | `{}` | Serveurs MCP à ajouter (clé = nom) |
| `perAgentOverrides` | `object` | `{}` | Surcharge par `agentId` |

### Profils disponibles

| Profil | Contenu |
|--------|---------|
| `full` | 18 skills superpowers + hooks + MCP GitHub |
| `lean` | Vérification + débogage + simplification + hook pré-outil |
| `review-only` | Vérification + revue de code uniquement |

## Architecture

```
heartbeat → provisionExecutionWorktree
                    │
                    ▼
        emit "agent.run.workspace_ready"
                    │
                    ▼
        plugin-atelier/worker.ts
                    │
                    ▼
        injector.ts → applyProfile(cwd, profile)
                    │
                    ▼
        adapter.execute() ← .claude/ déjà injecté
```

## Développement

```bash
pnpm -F @paperclipai/plugin-atelier build
pnpm -F @paperclipai/plugin-atelier typecheck
```

## Licence

MIT © 2026 Paperclip
