export async function listOllamaModels(baseUrl = "http://localhost:11434"): Promise<{ id: string; label: string }[]> {
  try {
    const url = baseUrl.replace(/\/v1\/?$/, "");
    const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json() as { models?: { name: string }[] };
    return (data.models ?? []).map((m) => ({ id: m.name, label: m.name }));
  } catch {
    return [];
  }
}

export interface OpenRouterModelEntry {
  id: string;
  label: string;
  group?: string;
  contextLength?: number;
  promptPriceUsd?: number;
  completionPriceUsd?: number;
}

/**
 * Liste les modèles OpenRouter disponibles. Lance une exception si l'appel
 * échoue (réseau, auth, JSON malformé) — le caller (proxy /api/llm/list-models)
 * convertit en réponse 5xx pour que l'UI distingue "aucun modèle" d'une vraie
 * erreur.
 */
export async function listOpenRouterModels(
  apiKey?: string,
  baseUrl = "https://openrouter.ai/api/v1",
): Promise<OpenRouterModelEntry[]> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  const url = baseUrl.replace(/\/+$/, "") + "/models";
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`OpenRouter list-models failed: HTTP ${res.status}`);
  }
  const data = await res.json() as {
    data?: Array<{
      id: string;
      name?: string;
      context_length?: number;
      pricing?: { prompt?: string; completion?: string };
    }>;
  };
  return (data.data ?? []).map((m) => {
    const group = m.id.split("/")[0] || undefined;
    const promptPriceUsd = m.pricing?.prompt ? Number(m.pricing.prompt) : undefined;
    const completionPriceUsd = m.pricing?.completion ? Number(m.pricing.completion) : undefined;
    return {
      id: m.id,
      label: m.name?.trim() || m.id,
      group,
      contextLength: m.context_length,
      promptPriceUsd: Number.isFinite(promptPriceUsd) ? promptPriceUsd : undefined,
      completionPriceUsd: Number.isFinite(completionPriceUsd) ? completionPriceUsd : undefined,
    };
  });
}
