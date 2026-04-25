import type { UIAdapterModule } from "../types";
import { OpenRouterConfigFields } from "./config-fields";
import { buildSchemaAdapterConfig } from "../schema-config-fields";

function parseOpenRouterStdoutLine(line: string, ts: string) {
  if (!line.trim()) return [];
  return [{ kind: "stdout" as const, text: line, ts }];
}

export const openRouterUIAdapter: UIAdapterModule = {
  type: "openrouter",
  label: "OpenRouter (cloud)",
  parseStdoutLine: parseOpenRouterStdoutLine,
  ConfigFields: OpenRouterConfigFields,
  buildAdapterConfig: buildSchemaAdapterConfig,
};
