/**
 * Injects claude-atelier config into an agent execution worktree.
 *
 * Phase 3 (bloquée sur claude-atelier@0.22.0-preview.0) :
 * Cette fonction utilisera `applyProfile` de claude-atelier pour injecter
 * la config programmatiquement. En attendant, le stub est fonctionnel mais
 * ne fait aucune injection réelle.
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

function resolveProfile(agentId: string, config: AtelierInstanceConfig): ProfileName {
  const override = config.perAgentOverrides?.[agentId];
  return override?.profile ?? config.defaultProfile ?? "lean";
}

/**
 * Injecte le profil claude-atelier dans le worktree cible.
 *
 * TODO Phase 3 : remplacer le corps par :
 *   const { applyProfile } = await import("claude-atelier");
 *   return applyProfile({ cwd, profile, skills, mcp: config.mcpServers, mergeStrategy: "repo-wins" });
 */
export async function injectIntoWorktree(input: InjectionInput): Promise<InjectionResult> {
  const profile = resolveProfile(input.agentId, input.config);
  const overrideSkills = input.config.perAgentOverrides?.[input.agentId]?.skills
    ?? input.config.skills
    ?? [];

  // Phase 3 stub — applyProfile de claude-atelier n'est pas encore dispo
  return {
    applied: [],
    skipped: [`claude-atelier@>=0.22.0-preview.0 requis pour injecter profile="${profile}" skills=${JSON.stringify(overrideSkills)}`],
    warnings: ["Plugin atelier en mode stub : aucune injection réelle. Mettre à jour claude-atelier."],
  };
}
