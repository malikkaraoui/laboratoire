export type ProfileName = "full" | "lean" | "review-only";

export interface AtelierProfile {
  /** Hooks Claude Code injectés dans .claude/hooks/ — exécution garantie, hors contrôle du modèle. */
  hooks: string[];
  /** Serveurs MCP à fusionner dans .mcp.json. */
  mcp: Record<string, unknown>;
}

export const PROFILES: Record<ProfileName, AtelierProfile> = {
  /**
   * Tous les hooks actifs + MCP GitHub.
   * UserPromptSubmit intercepte chaque prompt entrant.
   * SessionModel enforce le modèle au démarrage de session.
   */
  full: {
    hooks: ["session-model", "user-prompt-submit", "pre-tool-use", "post-tool-use"],
    mcp: {
      github: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-github"],
        env: { GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}" },
      },
    },
  },
  /**
   * Hooks essentiels sans MCP.
   * UserPromptSubmit garantit le passage unique sur chaque prompt.
   * PreToolUse bloque les opérations non autorisées.
   */
  lean: {
    hooks: ["user-prompt-submit", "pre-tool-use"],
    mcp: {},
  },
  /**
   * Uniquement le verrou avant push.
   * UserPromptSubmit + PreToolUse pour bloquer les actions destructives.
   */
  "review-only": {
    hooks: ["user-prompt-submit", "pre-tool-use"],
    mcp: {},
  },
};
