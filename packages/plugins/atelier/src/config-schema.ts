import type { JsonSchema } from "@paperclipai/plugin-sdk";
import type { ProfileName } from "./profiles.js";

export interface AtelierInstanceConfig {
  defaultProfile: ProfileName;
  mcpServers?: Record<string, unknown>;
  /** Surcharge de profil par agentId. */
  perAgentOverrides?: Record<string, ProfileName>;
}

const profileEnum = ["full", "lean", "review-only"] satisfies ProfileName[];

export const instanceConfigSchema: JsonSchema = {
  type: "object",
  required: ["defaultProfile"],
  properties: {
    defaultProfile: {
      type: "string",
      enum: profileEnum,
      default: "lean",
      description:
        "Profil de hooks injectés dans chaque worktree agent. " +
        "'full' active tous les hooks + MCP GitHub. " +
        "'lean' active UserPromptSubmit + PreToolUse (passage unique garanti). " +
        "'review-only' restreint aux hooks de blocage avant push.",
    },
    mcpServers: {
      type: "object",
      additionalProperties: true,
      description: "Serveurs MCP additionnels à fusionner dans .mcp.json",
    },
    perAgentOverrides: {
      type: "object",
      additionalProperties: { type: "string", enum: profileEnum },
      description: "Surcharge de profil par agentId — priorité sur defaultProfile",
    },
  },
};
