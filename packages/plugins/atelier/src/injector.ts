/**
 * Injecte les hooks claude-atelier dans un worktree d'exécution agent.
 *
 * Philosophie : hooks uniquement — exécution garantie au niveau process Claude Code,
 * indépendante du bon vouloir du modèle. Les skills ne sont pas utilisés.
 *
 * @see CLAUDE.md — Phase 3 Logique d'injection
 */

import type { ProfileName } from "./profiles.js";
import type { AtelierInstanceConfig } from "./config-schema.js";

export interface InjectionInput {
  cwd: string;
  agentId: string;
  config: AtelierInstanceConfig;
}

export interface InjectionResult {
  applied: string[];
  skipped: string[];
  warnings: string[];
}

type ApplyProfileFn = (opts: {
  cwd: string;
  profile: ProfileName;
  mcp?: Record<string, unknown>;
  mergeStrategy?: "repo-wins" | "atelier-wins";
}) => Promise<InjectionResult>;

function resolveProfile(agentId: string, config: AtelierInstanceConfig): ProfileName {
  return config.perAgentOverrides?.[agentId] ?? config.defaultProfile;
}

/**
 * Injecte les hooks du profil dans le worktree via l'API claude-atelier.
 *
 * L'import est dynamique : si claude-atelier n'est pas installé, on avertit
 * sans bloquer l'exécution de l'agent.
 */
export async function injectIntoWorktree(input: InjectionInput): Promise<InjectionResult> {
  const profile = resolveProfile(input.agentId, input.config);

  let applyProfile: ApplyProfileFn;
  try {
    const mod = await import("claude-atelier") as { applyProfile: ApplyProfileFn };
    applyProfile = mod.applyProfile;
  } catch {
    return {
      applied: [],
      skipped: [`cwd=${input.cwd} profile=${profile}`],
      warnings: [
        "claude-atelier introuvable dans l'environnement du plugin. " +
        "Installer claude-atelier pour activer l'injection des hooks.",
      ],
    };
  }

  return applyProfile({
    cwd: input.cwd,
    profile,
    mcp: input.config.mcpServers,
    mergeStrategy: "repo-wins",
  });
}
