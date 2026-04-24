import type { JsonSchema } from "@paperclipai/plugin-sdk";
import type { ProfileName } from "./profiles.js";

export interface AtelierInstanceConfig {
  defaultProfile: ProfileName;
  skills?: string[];
  mcpServers?: Record<string, unknown>;
  perAgentOverrides?: Record<string, { profile?: ProfileName; skills?: string[] }>;
}

const profileEnum = ["full", "lean", "review-only"] satisfies ProfileName[];

export const instanceConfigSchema: JsonSchema = {
  type: "object",
  properties: {
    defaultProfile: {
      type: "string",
      enum: profileEnum,
      default: "lean",
      description: "Preset appliqué par défaut à tous les agents",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description: "Skills supplémentaires à injecter (s'ajoutent au preset)",
    },
    mcpServers: {
      type: "object",
      additionalProperties: true,
      description: "Serveurs MCP additionnels à fusionner dans .mcp.json",
    },
    perAgentOverrides: {
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          profile: { type: "string", enum: profileEnum },
          skills: { type: "array", items: { type: "string" } },
        },
      },
      description: "Overrides de config par agentId — priorité sur defaultProfile",
    },
  },
};
