import type { UIAdapterModule } from "../types";
import { OllamaLocalConfigFields } from "./config-fields";
import { buildSchemaAdapterConfig } from "../schema-config-fields";

function parseOllamaStdoutLine(line: string, ts: string) {
  if (!line.trim()) return [];
  return [{ kind: "stdout" as const, text: line, ts }];
}

export const ollamaLocalUIAdapter: UIAdapterModule = {
  type: "ollama_local",
  label: "Ollama / OpenRouter (local)",
  parseStdoutLine: parseOllamaStdoutLine,
  ConfigFields: OllamaLocalConfigFields,
  buildAdapterConfig: buildSchemaAdapterConfig,
};
