import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export interface LLMModelEntry {
  id: string;
  label: string;
  group?: string;
  contextLength?: number;
  promptPriceUsd?: number;
  completionPriceUsd?: number;
}

interface ListModelsResponse {
  provider: string;
  models: LLMModelEntry[];
}

interface UseLLMModelsArgs {
  provider: "ollama_local" | "openrouter" | string;
  baseUrl?: string;
  apiKey?: string;
  enabled?: boolean;
}

/**
 * Récupère la liste des modèles disponibles pour un provider LLM via le proxy
 * serveur (POST /api/llm/list-models). Évite l'exposition des apiKey dans le
 * navigateur et le CORS.
 *
 * - ollama_local : interroge http://localhost:11434/api/tags (sur la machine)
 * - openrouter   : interroge https://openrouter.ai/api/v1/models avec apiKey
 */
export function useLLMModels({ provider, baseUrl, apiKey, enabled = true }: UseLLMModelsArgs) {
  const isSupported = provider === "ollama_local" || provider === "openrouter";
  const queryEnabled = enabled && isSupported;

  return useQuery<ListModelsResponse>({
    queryKey: ["llm-models", provider, baseUrl ?? "", apiKey ? "with-key" : "no-key"],
    queryFn: () =>
      api.post<ListModelsResponse>("/llm/list-models", {
        provider,
        baseUrl,
        apiKey,
      }),
    enabled: queryEnabled,
    staleTime: 60_000,
    retry: false,
  });
}
