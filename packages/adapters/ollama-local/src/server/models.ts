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
