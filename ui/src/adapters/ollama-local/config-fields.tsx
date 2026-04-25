import type { AdapterConfigFieldsProps } from "../types";
import { Field, DraftInput, DraftNumberInput } from "../../components/agent-config-primitives";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_BASE_URL = "http://localhost:11434/v1";

export function OllamaLocalConfigFields({
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
}: AdapterConfigFieldsProps) {
  function readText(key: string, fallback = ""): string {
    if (isCreate) return String(values?.adapterSchemaValues?.[key] ?? fallback);
    return String(eff("adapterConfig", key, config[key] ?? fallback));
  }
  function readNum(key: string, fallback: number): number {
    if (isCreate) return Number(values?.adapterSchemaValues?.[key] ?? fallback);
    return Number(eff("adapterConfig", key, config[key] ?? fallback));
  }
  function writeText(key: string, value: string) {
    if (isCreate) set?.({ adapterSchemaValues: { ...values?.adapterSchemaValues, [key]: value || undefined } });
    else mark("adapterConfig", key, value || undefined);
  }
  function writeNum(key: string, value: number) {
    if (isCreate) set?.({ adapterSchemaValues: { ...values?.adapterSchemaValues, [key]: value || undefined } });
    else mark("adapterConfig", key, value || undefined);
  }

  const baseUrl = readText("baseUrl", DEFAULT_BASE_URL);
  const isOpenRouter = baseUrl.includes("openrouter.ai");

  return (
    <>
      <Field
        label="Base URL"
        hint={`Ollama : ${DEFAULT_BASE_URL} — OpenRouter : ${OPENROUTER_BASE_URL}`}
      >
        <DraftInput
          value={baseUrl}
          onCommit={(v) => writeText("baseUrl", v)}
          immediate
          className={inputClass}
          placeholder={DEFAULT_BASE_URL}
        />
      </Field>

      <Field
        label="Model"
        hint={
          isOpenRouter
            ? "Modèle OpenRouter, ex : openai/gpt-4o, anthropic/claude-3-5-sonnet, meta-llama/llama-3.1-8b-instruct"
            : "Modèle Ollama, ex : llama3.2, mistral, qwen2.5"
        }
      >
        <DraftInput
          value={readText("model")}
          onCommit={(v) => writeText("model", v)}
          immediate
          className={inputClass}
          placeholder={isOpenRouter ? "openai/gpt-4o" : "llama3.2"}
        />
      </Field>

      {isOpenRouter && (
        <Field
          label="API Key (OpenRouter)"
          hint="Clé API OpenRouter (sk-or-…). Stocker via une env var sealed pour la prod."
        >
          <DraftInput
            value={readText("apiKey")}
            onCommit={(v) => writeText("apiKey", v)}
            immediate
            className={inputClass}
            placeholder="sk-or-..."
          />
        </Field>
      )}

      {!isOpenRouter && (
        <Field
          label="API Key (optionnel)"
          hint="Requis uniquement si votre serveur Ollama exige une clé."
        >
          <DraftInput
            value={readText("apiKey")}
            onCommit={(v) => writeText("apiKey", v)}
            immediate
            className={inputClass}
            placeholder=""
          />
        </Field>
      )}

      <Field label="Timeout (sec)" hint="Durée max d'une requête en secondes (0 = pas de limite).">
        <DraftNumberInput
          value={readNum("timeoutSec", 300)}
          onCommit={(v) => writeNum("timeoutSec", v)}
          immediate
          className={inputClass}
        />
      </Field>
    </>
  );
}
