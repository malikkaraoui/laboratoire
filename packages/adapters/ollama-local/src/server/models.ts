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

export async function listOpenRouterModels(apiKey?: string): Promise<OpenRouterModelEntry[]> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
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
  } catch {
    return [];
  }
}
