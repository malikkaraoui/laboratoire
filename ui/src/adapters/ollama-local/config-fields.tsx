import type { AdapterConfigFieldsProps } from "../types";
import { Field, DraftInput, DraftNumberInput } from "../../components/agent-config-primitives";
import { ModelPicker } from "../ModelPicker";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

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

  function readModel(): string {
    if (isCreate) return String(values?.model ?? "");
    return String(eff("adapterConfig", "model", config.model ?? ""));
  }
  function writeModel(v: string) {
    if (isCreate) set?.({ model: v });
    else mark("adapterConfig", "model", v || undefined);
  }

  const baseUrl = readText("baseUrl", DEFAULT_BASE_URL);

  return (
    <>
      <Field label="Base URL" hint={`Endpoint local Ollama. Par défaut : ${DEFAULT_BASE_URL}`}>
        <DraftInput
          value={baseUrl}
          onCommit={(v) => writeText("baseUrl", v)}
          immediate
          className={inputClass}
          placeholder={DEFAULT_BASE_URL}
        />
      </Field>

      <Field label="Modèle" hint="Modèles détectés via `ollama list` sur votre machine. Saisie libre possible.">
        <ModelPicker
          provider="ollama_local"
          baseUrl={baseUrl}
          value={readModel()}
          onChange={writeModel}
          placeholder="ex : llama3.2, qwen2.5, mistral"
        />
      </Field>

      <Field label="API Key (optionnel)" hint="Requis uniquement si votre serveur Ollama exige une clé.">
        <DraftInput
          value={readText("apiKey")}
          onCommit={(v) => writeText("apiKey", v)}
          immediate
          className={inputClass}
          placeholder=""
        />
      </Field>

      <Field
        label="Timeout (sec)"
        hint="Durée max d'une requête (0 = illimité — utile pour le 1er appel Ollama qui charge le modèle en VRAM)."
      >
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
