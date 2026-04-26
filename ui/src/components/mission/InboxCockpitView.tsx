import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Eye, Search, Inbox as InboxIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { issuesApi } from "@/api/issues";
import { approvalsApi } from "@/api/approvals";
import { agentsApi } from "@/api/agents";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { Issue, Approval, Agent } from "@paperclipai/shared";

import { AgentRoleAvatar } from "./role-avatar";

type InboxFilter = "todo" | "validated" | "rejected";

interface InboxCockpitViewProps {
  companyId: string;
  /** Bouton pour basculer vers la vue détaillée existante */
  onOpenDetailedView?: () => void;
}

interface InboxItem {
  id: string;
  kind: "approval" | "issue";
  authorName: string;
  authorAgent: Agent | null;
  preview: string;
  when: Date;
  status: "todo" | "validated" | "rejected";
  link?: string;
  raw: Approval | Issue;
}

function firstSentence(text: string | null | undefined, max = 140): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  const dot = cleaned.indexOf(". ");
  const cut = dot > 0 && dot < max ? dot + 1 : Math.min(cleaned.length, max);
  return cleaned.slice(0, cut) + (cleaned.length > cut ? "…" : "");
}

function timeAgo(d: Date | string): string {
  const t = typeof d === "string" ? new Date(d) : d;
  const sec = Math.floor((Date.now() - t.getTime()) / 1000);
  if (sec < 60) return "à l'instant";
  if (sec < 3600) return `il y a ${Math.floor(sec / 60)} min`;
  if (sec < 86400) return `il y a ${Math.floor(sec / 3600)}h`;
  return `il y a ${Math.floor(sec / 86400)}j`;
}

export function InboxCockpitView({ companyId, onOpenDetailedView }: InboxCockpitViewProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<InboxFilter>("todo");
  const [search, setSearch] = useState("");

  const { data: approvals = [] } = useQuery({
    queryKey: queryKeys.approvals.list(companyId),
    queryFn: () => approvalsApi.list(companyId),
    staleTime: 10_000,
  });

  const { data: issues = [] } = useQuery({
    queryKey: ["issues", companyId, "inbox-review"],
    queryFn: () => issuesApi.list(companyId, { status: "in_review", limit: 100 }),
    staleTime: 15_000,
  });

  const { data: agents = [] } = useQuery({
    queryKey: queryKeys.agents.list(companyId),
    queryFn: () => agentsApi.list(companyId),
    staleTime: 60_000,
  });

  const agentById = useMemo(() => {
    const m = new Map<string, Agent>();
    for (const a of agents) m.set(a.id, a);
    return m;
  }, [agents]);

  // Unification approval+issue → InboxItem
  const items = useMemo<InboxItem[]>(() => {
    const out: InboxItem[] = [];

    for (const a of approvals) {
      const author = a.requestedByAgentId ? agentById.get(a.requestedByAgentId) ?? null : null;
      const status: InboxItem["status"] =
        a.status === "approved" ? "validated" : a.status === "rejected" ? "rejected" : "todo";
      const summary =
        (a.payload?.title as string | undefined) ??
        (a.payload?.summary as string | undefined) ??
        `Demande d'approbation (${a.type})`;
      out.push({
        id: a.id,
        kind: "approval",
        authorName: author?.name ?? "Système",
        authorAgent: author,
        preview: summary,
        when: a.updatedAt ?? a.createdAt,
        status,
        raw: a,
      });
    }

    for (const i of issues) {
      const author = i.assigneeAgentId ? agentById.get(i.assigneeAgentId) ?? null : null;
      out.push({
        id: i.id,
        kind: "issue",
        authorName: author?.name ?? "Issue",
        authorAgent: author,
        preview: firstSentence(i.description) || i.title,
        when: i.updatedAt ?? i.createdAt,
        status: "todo",
        link: `/issues/${i.id}`,
        raw: i,
      });
    }

    return out.sort((a, b) => +new Date(b.when) - +new Date(a.when));
  }, [approvals, issues, agentById]);

  const filtered = useMemo(() => {
    const list = items.filter((it) => it.status === filter);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (it) => it.authorName.toLowerCase().includes(q) || it.preview.toLowerCase().includes(q),
    );
  }, [items, filter, search]);

  const counts = useMemo(
    () => ({
      todo: items.filter((i) => i.status === "todo").length,
      validated: items.filter((i) => i.status === "validated").length,
      rejected: items.filter((i) => i.status === "rejected").length,
    }),
    [items],
  );

  const approveMutation = useMutation({
    mutationFn: (id: string) => approvalsApi.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.approvals.list(companyId) }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => approvalsApi.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.approvals.list(companyId) }),
  });

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill active={filter === "todo"} onClick={() => setFilter("todo")} count={counts.todo}>
          À traiter
        </FilterPill>
        <FilterPill active={filter === "validated"} onClick={() => setFilter("validated")} count={counts.validated}>
          Validés
        </FilterPill>
        <FilterPill active={filter === "rejected"} onClick={() => setFilter("rejected")} count={counts.rejected}>
          Refusés
        </FilterPill>
        <div className="flex-1" />
        <div className="relative w-60">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="h-8 pl-7 text-sm"
          />
        </div>
        {onOpenDetailedView && (
          <Button variant="ghost" size="sm" onClick={onOpenDetailedView} className="text-xs">
            Vue détaillée →
          </Button>
        )}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 border-dashed bg-card/30 px-6 py-10 text-center">
          <InboxIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {filter === "todo"
              ? "Inbox vide. Tout est traité ✨"
              : filter === "validated"
                ? "Aucun élément validé."
                : "Aucun élément refusé."}
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-border overflow-hidden p-0">
          {filtered.map((it) => (
            <InboxRow
              key={`${it.kind}-${it.id}`}
              item={it}
              onValidate={
                it.kind === "approval" && it.status === "todo"
                  ? () => approveMutation.mutate(it.id)
                  : undefined
              }
              onReject={
                it.kind === "approval" && it.status === "todo"
                  ? () => rejectMutation.mutate(it.id)
                  : undefined
              }
              onOpen={() => {
                if (it.link) window.location.assign(it.link);
              }}
              busy={approveMutation.isPending || rejectMutation.isPending}
            />
          ))}
        </Card>
      )}
    </div>
  );
}

// ── sub components ──────────────────────────────────────────────────────────

function FilterPill({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
      <span className={cn("rounded-full px-1.5 text-[10px]", active ? "bg-background/20" : "bg-muted")}>{count}</span>
    </button>
  );
}

function InboxRow({
  item,
  onValidate,
  onReject,
  onOpen,
  busy,
}: {
  item: InboxItem;
  onValidate?: () => void;
  onReject?: () => void;
  onOpen?: () => void;
  busy?: boolean;
}) {
  const isDimmed = item.status !== "todo";
  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40",
        isDimmed && "opacity-60",
      )}
    >
      <AgentRoleAvatar name={item.authorName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-medium">{item.authorName}</span>
          <span className="text-[11px] text-muted-foreground">· {timeAgo(item.when)}</span>
          {item.status === "validated" && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">· ✓ validé</span>
          )}
          {item.status === "rejected" && (
            <span className="text-[11px] text-red-600 dark:text-red-400">· ✕ refusé</span>
          )}
        </div>
        <div className="mt-0.5 truncate text-[13px] text-muted-foreground">{item.preview}</div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {onValidate && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            className="h-8 gap-1 border-emerald-500/40 bg-emerald-500/10 px-2.5 text-xs text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
            onClick={onValidate}
          >
            <Check className="h-3.5 w-3.5" />
            Valider
          </Button>
        )}
        {onReject && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            className="h-8 gap-1 border-red-500/40 bg-red-500/10 px-2.5 text-xs text-red-700 hover:bg-red-500/20 dark:text-red-300"
            onClick={onReject}
          >
            <X className="h-3.5 w-3.5" />
            Refuser
          </Button>
        )}
        {onOpen && (
          <Button size="sm" variant="ghost" className="h-8 gap-1 px-2.5 text-xs" onClick={onOpen}>
            <Eye className="h-3.5 w-3.5" />
            Détails
            <ChevronRight className="h-3 w-3 opacity-50" />
          </Button>
        )}
      </div>
    </div>
  );
}
