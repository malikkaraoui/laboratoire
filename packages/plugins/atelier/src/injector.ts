/**
 * Injects claude-atelier config into an agent execution worktree.
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
  skills?: string[];
  hooks?: string[];
  mcp?: Record<string, unknown>;
  mergeStrategy?: "repo-wins" | "atelier-wins";
  dryRun?: boolean;
}) => Promise<InjectionResult>;

function resolveProfile(agentId: string, config: AtelierInstanceConfig): ProfileName {
  const override = config.perAgentOverrides?.[agentId];
  return override?.profile ?? config.defaultProfile ?? "lean";
}

function resolveSkills(agentId: string, config: AtelierInstanceConfig): string[] | undefined {
  const override = config.perAgentOverrides?.[agentId];
  return override?.skills ?? config.skills;
}

function resolveHooks(agentId: string, config: AtelierInstanceConfig): string[] | undefined {
  const override = config.perAgentOverrides?.[agentId];
  return override?.hooks ?? config.hooks;
}

/**
 * Injecte le profil claude-atelier dans le worktree cible via l'API
 * programmatique de claude-atelier@>=0.22.0-preview.0.
 *
 * L'import est dynamique pour rester optionnel : si claude-atelier n'est pas
 * installé dans l'environnement du plugin, on retourne un avertissement sans
 * faire planter le worker.
 */
export async function injectIntoWorktree(input: InjectionInput): Promise<InjectionResult> {
  const profile = resolveProfile(input.agentId, input.config);
  const skills = resolveSkills(input.agentId, input.config);
  const hooks = resolveHooks(input.agentId, input.config);

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
        "Installer claude-atelier@>=0.22.0-preview.0 pour activer l'injection.",
      ],
    };
  }

  return applyProfile({
    cwd: input.cwd,
    profile,
    skills,
    hooks,
    mcp: input.config.mcpServers ?? undefined,
    mergeStrategy: "repo-wins",
  });
}
