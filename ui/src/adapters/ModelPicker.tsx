import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useLLMModels, type LLMModelEntry } from "./use-llm-models";

interface ModelPickerProps {
  provider: "ollama_local" | "openrouter";
  baseUrl?: string;
  apiKey?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function formatPrice(usdPerToken?: number): string | null {
  if (!usdPerToken) return null;
  const per1m = usdPerToken * 1_000_000;
  if (per1m >= 1) return `$${per1m.toFixed(2)}/M`;
  return `$${per1m.toFixed(3)}/M`;
}

function formatContextLength(n?: number): string | null {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ctx`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K ctx`;
  return `${n} ctx`;
}

export function ModelPicker({ provider, baseUrl, apiKey, value, onChange, placeholder }: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError, refetch, isFetching } = useLLMModels({
    provider,
    baseUrl,
    apiKey,
  });

  useEffect(() => {
    setFilter("");
  }, [value]);

  const models: LLMModelEntry[] = data?.models ?? [];
  const filtered = models.filter((m) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      m.id.toLowerCase().includes(q) ||
      m.label.toLowerCase().includes(q) ||
      (m.group?.toLowerCase().includes(q) ?? false)
    );
  });

  const grouped = new Map<string, LLMModelEntry[]>();
  for (const m of filtered) {
    const g = m.group ?? "";
    if (!grouped.has(g)) grouped.set(g, []);
    grouped.get(g)!.push(m);
  }

  const select = useCallback(
    (id: string) => {
      onChange(id);
      setOpen(false);
      setFilter("");
      inputRef.current?.blur();
    },
    [onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length === 1) select(filtered[0].id);
      else if (filter) select(filter);
    } else if (e.key === "Escape") {
      setOpen(false);
      setFilter("");
    } else if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const displayValue = filter || value || "";
  const emptyMsg =
    provider === "ollama_local"
      ? "Aucun modèle Ollama détecté. Vérifiez que `ollama serve` tourne."
      : "Aucun modèle OpenRouter trouvé. Vérifiez votre apiKey.";

  return (
    <div className="relative">
      <div className="flex items-center gap-0">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 rounded-l-md border border-r-0 border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40 focus:z-10"
          value={displayValue}
          placeholder={placeholder ?? "Tapez ou choisissez un modèle…"}
          onChange={(e) => {
            setFilter(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (!open) setOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="border border-r-0 border-border px-2 py-1.5 hover:bg-accent/50 transition-colors disabled:opacity-50"
          onClick={() => refetch()}
          disabled={isFetching}
          title="Recharger la liste"
        >
          {isFetching ? (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          ) : (
            <RefreshCw className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
        <Popover open={open && (filtered.length > 0 || isError || isLoading)} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="rounded-r-md border border-border px-2 py-1.5 hover:bg-accent/50 transition-colors"
            >
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="p-1 max-h-72 overflow-y-auto"
            style={{ minWidth: 360 }}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {isLoading && (
              <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Chargement des modèles…
              </div>
            )}
            {isError && (
              <div className="flex items-center gap-2 px-2 py-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                Erreur de chargement. Saisie libre possible.
              </div>
            )}
            {!isLoading && !isError && filtered.length === 0 && (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                {filter ? `Utiliser "${filter}" comme modèle (Entrée)` : emptyMsg}
              </div>
            )}
            {Array.from(grouped.entries()).map(([group, opts]) => (
              <div key={group || "_ungrouped"}>
                {group && (
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
                    {group}
                  </div>
                )}
                {opts.map((m) => {
                  const ctx = formatContextLength(m.contextLength);
                  const price = formatPrice(m.promptPriceUsd);
                  const meta = [ctx, price].filter(Boolean).join(" · ");
                  return (
                    <button
                      type="button"
                      key={m.id}
                      className={`flex items-center justify-between w-full px-2 py-1.5 text-sm rounded hover:bg-accent/50 ${
                        m.id === value ? "bg-accent" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        select(m.id);
                      }}
                    >
                      <span className="truncate font-mono">{m.id}</span>
                      {meta && (
                        <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{meta}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
