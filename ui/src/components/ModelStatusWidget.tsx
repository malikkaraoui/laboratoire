import { useState, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { Bot, Zap, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agentsApi } from "../api/agents";
import { queryKeys } from "../lib/queryKeys";
import { cn } from "../lib/utils";
import type { Agent } from "@paperclipai/shared";
import { ModelPicker } from "../adapters/ModelPicker";

// ─── helpers ────────────────────────────────────────────────────────────────

const ADAPTER_LABELS: Record<string, string> = {
  claude_local: "Claude",
  codex_local: "Codex",
  gemini_local: "Gemini",
  opencode_local: "OpenCode",
  cursor: "Cursor",
  pi_local: "Pi",
  ollama_local: "Ollama",
  openrouter: "OpenRouter",
  openclaw_gateway: "OpenClaw",
  hermes_local: "Hermes",
};

const ADAPTER_EMOJI: Record<string, string> = {
  ollama_local: "🦙",
  openrouter: "☁️",
};

interface ProviderInfo {
  provider: string;
  model: string;
  emoji: string | null;
}

function getProviderInfo(agent: Agent): ProviderInfo {
  const cfg = agent.adapterConfig as Record<string, string | undefined>;
  const model = cfg.model ?? "";

  if (agent.adapterType === "claude_local") {
    return { provider: "Claude", model: model || "claude", emoji: null };
  }
  const provider = ADAPTER_LABELS[agent.adapterType] ?? agent.adapterType;
  const emoji = ADAPTER_EMOJI[agent.adapterType] ?? null;
  return { provider, model, emoji };
}

function fmtK(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtCostCents(c: number): string | null {
  if (c <= 0) return null;
  return c < 100 ? `<$0.01` : `$${(c / 100).toFixed(2)}`;
}

function statusDot(status: string) {
  if (status === "running") return "bg-green-500 animate-pulse";
  if (status === "active") return "bg-blue-400";
  if (status === "paused") return "bg-yellow-400";
  if (status === "error") return "bg-red-500";
  return "bg-muted-foreground/40";
}

// ─── AgentModelRow ───────────────────────────────────────────────────────────

function AgentModelRow({
  agent,
  companyId,
}: {
  agent: Agent;
  companyId: string;
}) {
  const queryClient = useQueryClient();
  const info = getProviderInfo(agent);
  const cfg = (agent.adapterConfig ?? {}) as Record<string, string | undefined>;
  const isDynamicProvider = agent.adapterType === "ollama_local" || agent.adapterType === "openrouter";

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ["adapterModels", companyId, agent.adapterType],
    queryFn: () => agentsApi.adapterModels(companyId, agent.adapterType),
    staleTime: 60_000,
    enabled: !isDynamicProvider,
  });

  const updateMutation = useMutation({
    mutationFn: (model: string) =>
      agentsApi.update(agent.id, { adapterConfig: { model } }, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(companyId) });
    },
  });

  const modelList = models ?? [];

  return (
    <div className="flex items-start gap-3 px-3 py-2.5">
      <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1.5", statusDot(agent.status))} />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5">
          {info.emoji && <span aria-hidden className="text-[11px]">{info.emoji}</span>}
          <span className="text-sm truncate">{agent.name}</span>
        </div>
        {isDynamicProvider ? (
          <ModelPicker
            provider={agent.adapterType as "ollama_local" | "openrouter"}
            baseUrl={cfg.baseUrl}
            apiKey={cfg.apiKey}
            value={info.model}
            onChange={(v) => updateMutation.mutate(v)}
            placeholder={agent.adapterType === "ollama_local" ? "llama3.2…" : "anthropic/…"}
          />
        ) : modelsLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ) : modelList.length > 0 ? (
          <Select
            value={info.model}
            onValueChange={(v) => updateMutation.mutate(v)}
            disabled={updateMutation.isPending}
          >
            <SelectTrigger className="h-7 text-xs w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modelList.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-xs text-muted-foreground truncate block">
            {info.model || "—"}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── TokenBar ────────────────────────────────────────────────────────────────

function TokenBar({
  agents,
  companyId,
}: {
  agents: Agent[];
  companyId: string;
}) {
  const watched = agents
    .filter((a) => !["terminated", "paused"].includes(a.status))
    .slice(0, 5);

  const runtimeStates = useQueries({
    queries: watched.map((a) => ({
      queryKey: [...queryKeys.agents.list(companyId), a.id, "runtime"],
      queryFn: () => agentsApi.runtimeState(a.id, companyId),
      refetchInterval: a.status === "running" ? 5_000 : 30_000,
      staleTime: 4_000,
    })),
  });

  const { totalIn, totalOut, totalCost } = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    let totalCost = 0;
    for (const q of runtimeStates) {
      if (q.data) {
        totalIn += q.data.totalInputTokens;
        totalOut += q.data.totalOutputTokens;
        totalCost += q.data.totalCostCents;
      }
    }
    return { totalIn, totalOut, totalCost };
  }, [runtimeStates]);

  const isRunning = watched.some((a) => a.status === "running");

  if (totalIn === 0 && totalOut === 0) return null;

  const cost = fmtCostCents(totalCost);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-mono shrink-0",
        isRunning
          ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-950/40 dark:text-green-300"
          : "border-border bg-muted/60 text-muted-foreground",
      )}
      title={`↑ ${totalIn.toLocaleString()} tokens in · ↓ ${totalOut.toLocaleString()} tokens out`}
    >
      {isRunning && (
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
      )}
      <Zap className="h-3 w-3 shrink-0" />
      <span>
        ↑{fmtK(totalIn)} ↓{fmtK(totalOut)}
      </span>
      {cost && <span className="opacity-70">· {cost}</span>}
    </div>
  );
}

// ─── ModelStatusWidget ───────────────────────────────────────────────────────

export function ModelStatusWidget({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: agents } = useQuery({
    queryKey: queryKeys.agents.list(companyId),
    queryFn: () => agentsApi.list(companyId),
    staleTime: 30_000,
  });

  const activeAgents = useMemo(
    () => (agents ?? []).filter((a) => a.status !== "terminated"),
    [agents],
  );

  const primaryAgent = useMemo(() => {
    if (activeAgents.length === 0) return null;
    const counts: Record<string, number> = {};
    for (const a of activeAgents) {
      if (a.status === "paused") continue;
      counts[a.adapterType] = (counts[a.adapterType] ?? 0) + 1;
    }
    const topType =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      activeAgents[0].adapterType;
    return activeAgents.find((a) => a.adapterType === topType) ?? activeAgents[0];
  }, [activeAgents]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  };

  if (!primaryAgent) return null;

  const info = getProviderInfo(primaryAgent);
  const isRunning = activeAgents.some((a) => a.status === "running");

  return (
    <div className="flex items-center gap-2 shrink-0">
      {agents && agents.length > 0 && (
        <TokenBar agents={agents} companyId={companyId} />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors shrink-0",
              isRunning
                ? "border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-950/40 dark:text-green-300"
                : "border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {info.emoji ? (
              <span aria-hidden className="text-[11px] leading-none">{info.emoji}</span>
            ) : (
              <Bot className="h-3 w-3 shrink-0" />
            )}
            <span className="hidden sm:inline">{info.provider}</span>
            {info.model && (
              <>
                <span className="hidden sm:inline text-current/50">·</span>
                <span className="hidden sm:inline max-w-[100px] truncate">{info.model}</span>
              </>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[22rem] p-0"
          align="end"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Gestionnaire de modèles
            </p>
            <span className="text-xs text-muted-foreground">
              {activeAgents.length} agent{activeAgents.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="divide-y divide-border max-h-72 overflow-y-auto">
            {activeAgents.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                Aucun agent actif
              </div>
            ) : (
              activeAgents.map((a) => (
                <AgentModelRow key={a.id} agent={a} companyId={companyId} />
              ))
            )}
          </div>

          <div className="px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Survol → rapide · Clic modèle → switch immédiat
            </span>
            {isRunning && (
              <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                En cours
              </span>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
