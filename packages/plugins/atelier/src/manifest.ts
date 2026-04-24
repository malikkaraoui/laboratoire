import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
import { instanceConfigSchema } from "./config-schema.js";

const PLUGIN_ID = "paperclip.plugin-atelier";
const PLUGIN_VERSION = "0.1.0";

const manifest: PaperclipPluginManifestV1 = {
  id: PLUGIN_ID,
  apiVersion: 1,
  version: PLUGIN_VERSION,
  displayName: "Claude Atelier",
  description:
    "Injecte automatiquement la config claude-atelier (skills, hooks, MCP, agents, mémoire) " +
    "dans chaque worktree d'exécution avant le lancement de l'agent.",
  author: "Paperclip",
  categories: ["workspace"],
  capabilities: [
    "events.subscribe",
    "plugin.state.read",
    "plugin.state.write",
    "secrets.read-ref",
    "activity.log.write",
  ],
  entrypoints: {
    worker: "./dist/worker.js",
  },
  instanceConfigSchema,
};

export default manifest;
