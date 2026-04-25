import type { AdapterConfigFieldsProps } from "../types";
import { Field, DraftInput, DraftNumberInput } from "../../components/agent-config-primitives";
import { ModelPicker } from "../ModelPicker";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

export function OpenRouterConfigFields({
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

  function readModel(): string {
    if (isCreate) return String(values?.model ?? "");
    return String(eff("adapterConfig", "model", config.model ?? ""));
  }
  function writeModel(v: string) {
    if (isCreate) set?.({ model: v });
    else mark("adapterConfig", "model", v || undefined);
  }

  const apiKey = readText("apiKey");

  return (
    <>
      <Field label="API Key OpenRouter" hint="Clé sk-or-… requise. Génération sur openrouter.ai/keys.">
        <DraftInput
          value={apiKey}
          onCommit={(v) => writeText("apiKey", v)}
          immediate
          className={inputClass}
          placeholder="sk-or-..."
        />
      </Field>

      <Field
        label="Modèle"
        hint="Liste chargée depuis openrouter.ai/api/v1/models. Saisie libre possible."
      >
        <ModelPicker
          provider="openrouter"
          apiKey={apiKey || undefined}
          value={readModel()}
          onChange={writeModel}
          placeholder="ex : anthropic/claude-3-5-sonnet, openai/gpt-4o"
        />
      </Field>

      <Field label="Base URL" hint={`Endpoint API. Par défaut : ${DEFAULT_BASE_URL}`}>
        <DraftInput
          value={readText("baseUrl", DEFAULT_BASE_URL)}
          onCommit={(v) => writeText("baseUrl", v)}
          immediate
          className={inputClass}
          placeholder={DEFAULT_BASE_URL}
        />
      </Field>

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
