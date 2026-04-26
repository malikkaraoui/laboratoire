import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router";
import { Plus, Target, Inbox as InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { goalsApi } from "@/api/goals";
import { issuesApi } from "@/api/issues";
import { agentsApi } from "@/api/agents";
import { approvalsApi } from "@/api/approvals";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import type { Agent, Goal, Issue } from "@paperclipai/shared";

import { MissionHeader } from "./mission-header";
import { ObjectiveCard } from "./objective-card";
import { ThinkingBadge, StatusBadge } from "./badges";
import { AgentRoleAvatar } from "./role-avatar";

interface DashboardMissionViewProps {
  companyId: string;
  onOpenDetailedView?: () => void;
}

function pickActiveCompanyMission(goals: Goal[]): Goal | null {
  // Mission company = goal racine (parentId null) sans owner agent (au niveau company)
  // ou à défaut, le goal racine actif le plus récent
  const roots = goals.filter((g) => !g.parentId);
  return (
    roots.find((g) => g.status === "active" && !g.ownerAgentId) ??
    roots.find((g) => g.status === "active") ??
    roots[0] ??
    null
  );
}

function isAgentRunning(agent: Agent): boolean {
  return agent.status === "active" || agent.status === "running";
}

export function DashboardMissionView({ companyId, onOpenDetailedView }: DashboardMissionViewProps) {
  const { data: goals = [] } = useQuery({
    queryKey: queryKeys.goals.list(companyId),
    queryFn: () => goalsApi.list(companyId),
    staleTime: 30_000,
  });

  const { data: agents = [] } = useQuery({
    queryKey: queryKeys.agents.list(companyId),
    queryFn: () => agentsApi.list(companyId),
    staleTime: 30_000,
  });

  const { data: issues = [] } = useQuery({
    queryKey: ["issues", companyId, "dashboard-mission"],
    queryFn: () => issuesApi.list(companyId, { limit: 200 }),
    staleTime: 30_000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: queryKeys.approvals.list(companyId),
    queryFn: () => approvalsApi.list(companyId, "pending"),
    staleTime: 10_000,
  });

  const mission = useMemo(() => pickActiveCompanyMission(goals), [goals]);
  const subGoals = useMemo(
    () => (mission ? goals.filter((g) => g.parentId === mission.id) : []),
    [goals, mission],
  );
  const activeAgents = useMemo(() => agents.filter((a) => a.status !== "terminated"), [agents]);

  const kpis = useMemo(() => {
    if (!mission) return [];
    const total = subGoals.length || 1;
    const achieved = subGoals.filter((g) => g.status === "achieved").length;
    const deliverables = issues.filter((i) => i.status === "done").length;
    return [
      { label: "Avancement", value: `${Math.round((achieved / total) * 100)}%` },
      { label: "Objectifs", value: `${achieved}/${total}` },
      { label: "Livrables", value: deliverables },
      { label: "À traiter", value: approvals.length },
    ];
  }, [mission, subGoals, issues, approvals]);

  const progress = useMemo(() => {
    if (!mission || subGoals.length === 0) return undefined;
    const achieved = subGoals.filter((g) => g.status === "achieved").length;
    return Math.round((achieved / subGoals.length) * 100);
  }, [mission, subGoals]);

  // ─── État vide global ─────────────────────────────────────────────────
  if (!mission) {
    return (
      <Card className="flex flex-col items-center gap-4 border-dashed bg-card/30 px-6 py-12 text-center">
        <Target className="h-12 w-12 text-muted-foreground" />
        <div>
          <h2 className="text-lg font-semibold">Aucune mission d'entreprise</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Définis la mission stratégique de ta société pour aligner tous les agents autour d'objectifs et livrables clairs.
          </p>
        </div>
        <Button asChild>
          <Link to="/goals">
            <Plus className="mr-1 h-4 w-4" /> Définir une mission
          </Link>
        </Button>
        {onOpenDetailedView && (
          <button
            onClick={onOpenDetailedView}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            ou voir le tableau de bord détaillé
          </button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête mission company */}
      <MissionHeader
        title={mission.title}
        meta={
          <>
            {mission.status === "active" ? "Active" : mission.status} ·{" "}
            créée {new Date(mission.createdAt).toLocaleDateString("fr-FR")} ·{" "}
            {activeAgents.length} agent{activeAgents.length > 1 ? "s" : ""} engagé{activeAgents.length > 1 ? "s" : ""}
            {mission.description && <> · {mission.description}</>}
          </>
        }
        kpis={kpis}
        progress={progress}
        actions={
          onOpenDetailedView ? (
            <Button variant="ghost" size="sm" onClick={onOpenDetailedView} className="text-xs">
              Vue détaillée →
            </Button>
          ) : undefined
        }
      />

      {/* Layout 2/3 + 1/3 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pipeline objectifs */}
        <Card className="lg:col-span-2 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pipeline d'objectifs
            </h2>
            <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Link to="/goals">
                <Plus className="h-3 w-3" /> Ajouter
              </Link>
            </Button>
          </div>
          {subGoals.length === 0 ? (
            <div className="rounded-md border border-dashed bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
              Aucun objectif défini sous cette mission.
            </div>
          ) : (
            <div className="space-y-2.5">
              {subGoals.map((g, i) => {
                const linked = issues.filter((iss) => (iss as Issue & { goalId?: string | null }).goalId === g.id);
                const owner = g.ownerAgentId ? agents.find((a) => a.id === g.ownerAgentId) : null;
                return (
                  <ObjectiveCard
                    key={g.id}
                    index={i + 1}
                    total={subGoals.length}
                    title={g.title}
                    status={g.status}
                    progress={
                      g.status === "achieved"
                        ? 100
                        : g.status === "active" && linked.length > 0
                          ? Math.round((linked.filter((i) => i.status === "done").length / linked.length) * 100)
                          : undefined
                    }
                    meta={
                      <span className="flex items-center gap-2">
                        {owner && (
                          <span className="inline-flex items-center gap-1.5">
                            <AgentRoleAvatar name={owner.name} size="sm" />
                            <span>{owner.name}</span>
                          </span>
                        )}
                        {linked.length > 0 && <span>· {linked.length} livrable{linked.length > 1 ? "s" : ""}</span>}
                      </span>
                    }
                    dimmed={g.status === "planned" || g.status === "cancelled"}
                  />
                );
              })}
            </div>
          )}
        </Card>

        {/* Sidebar : équipe + à traiter */}
        <div className="space-y-4">
          {/* Équipe engagée */}
          <Card className="px-5 py-4">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Équipe engagée
            </h2>
            <div className="space-y-2">
              {activeAgents.length === 0 ? (
                <p className="text-xs italic text-muted-foreground">Aucun agent actif.</p>
              ) : (
                activeAgents.slice(0, 6).map((a) => (
                  <Link
                    key={a.id}
                    to={`/agents/${a.id}/mission`}
                    className="flex items-center gap-3 rounded-md p-1.5 text-sm transition-colors hover:bg-muted/40"
                  >
                    <AgentRoleAvatar name={a.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">{a.name}</div>
                      {a.role && <div className="truncate text-[11px] text-muted-foreground">{a.role}</div>}
                    </div>
                    {isAgentRunning(a) ? <ThinkingBadge label="actif" /> : <StatusBadge status={a.status} />}
                  </Link>
                ))
              )}
            </div>
          </Card>

          {/* À traiter */}
          <Card className="px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                À traiter
              </h2>
              {approvals.length > 0 && (
                <span className="rounded-full bg-amber-500/15 px-2 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                  {approvals.length}
                </span>
              )}
            </div>
            {approvals.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">Inbox vide ✨</p>
            ) : (
              <div className="space-y-1.5">
                {approvals.slice(0, 4).map((a) => (
                  <Link
                    key={a.id}
                    to="/inbox"
                    className="flex items-center gap-2 rounded-md p-1.5 text-[13px] hover:bg-muted/40"
                  >
                    <InboxIcon className={cn("h-3.5 w-3.5 shrink-0 text-amber-500")} />
                    <span className="truncate">
                      {(a.payload?.title as string | undefined) ?? `Approbation ${a.type}`}
                    </span>
                  </Link>
                ))}
                {approvals.length > 4 && (
                  <Link to="/inbox" className="block pt-1 text-[11px] text-muted-foreground hover:underline">
                    Voir les {approvals.length} éléments →
                  </Link>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
