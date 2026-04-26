import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import { Plus, FileText, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { goalsApi } from "@/api/goals";
import { issuesApi } from "@/api/issues";
import { agentsApi } from "@/api/agents";
import { queryKeys } from "@/lib/queryKeys";
import { useDialog } from "@/context/DialogContext";
import type { Agent, Goal, Issue } from "@paperclipai/shared";

import { MissionHeader } from "./mission-header";
import { ObjectiveCard } from "./objective-card";
import { DeliverableRow } from "./deliverable-row";
import { PlanTimeline, type PlanStep } from "./plan-timeline";
import { ThinkingBadge, StatusBadge } from "./badges";
import { AgentRoleAvatar } from "./role-avatar";

function isAgentRunning(agent: Agent): boolean {
  return agent.status === "active" || agent.status === "running";
}

function deliverableStatusFor(issue: Issue): "pending" | "validated" | "rejected" | "blocked" | null {
  if (issue.status === "done") return "validated";
  if (issue.status === "cancelled") return "rejected";
  if (issue.status === "blocked") return "blocked";
  if (issue.status === "in_review") return "pending";
  return null;
}

function findRootMission(goals: Goal[], agentId: string): Goal | null {
  // Mission = goal racine (sans parentId) dont l'agent est owner.
  // Priorité : active > planned > 1er disponible.
  const owned = goals.filter((g) => g.ownerAgentId === agentId && !g.parentId);
  return (
    owned.find((g) => g.status === "active") ??
    owned.find((g) => g.status === "planned") ??
    owned[0] ??
    null
  );
}

function missionHeaderLabel(status: string): string {
  if (status === "active") return "Mission active";
  if (status === "planned") return "Mission à venir";
  if (status === "achieved") return "Mission accomplie";
  if (status === "cancelled") return "Mission annulée";
  return "Mission";
}

interface AgentMissionViewProps {
  agent: Agent;
  companyId: string;
  /** Bouton d'ouverture du mode technique (transcription, runs détaillés…) */
  onOpenTechnicalView?: () => void;
}

export function AgentMissionView({ agent, companyId, onOpenTechnicalView }: AgentMissionViewProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openNewGoal } = useDialog();

  const { data: goals = [] } = useQuery({
    queryKey: queryKeys.goals.list(companyId),
    queryFn: () => goalsApi.list(companyId),
    staleTime: 30_000,
  });

  // Réutilise la queryKey racine "issues" du projet pour profiter des
  // invalidations existantes (mutations issuesApi.update etc.)
  const { data: issues = [] } = useQuery({
    queryKey: [...queryKeys.issues.list(companyId), "agent-mission", agent.id],
    queryFn: () => issuesApi.list(companyId, { assigneeAgentId: agent.id, limit: 200 }),
    staleTime: 15_000,
  });

  // Aligné sur la convention globale (pas de companyId dans la key)
  const { data: runtime } = useQuery({
    queryKey: queryKeys.agents.runtimeState(agent.id),
    queryFn: () => agentsApi.runtimeState(agent.id, companyId),
    refetchInterval: isAgentRunning(agent) ? 5_000 : 30_000,
  });

  const rootMission = useMemo(() => findRootMission(goals, agent.id), [goals, agent.id]);
  const subGoals = useMemo(
    () => (rootMission ? goals.filter((g) => g.parentId === rootMission.id) : []),
    [goals, rootMission],
  );
  const subGoalIds = useMemo(() => new Set(subGoals.map((g) => g.id)), [subGoals]);

  // Issues rattachées aux objectifs de la mission affichée uniquement
  // (les autres issues hors mission sont exclues du périmètre Mission).
  const missionIssues = useMemo(
    () => issues.filter((i) => {
      const gid = (i as Issue & { goalId?: string | null }).goalId;
      return gid && subGoalIds.has(gid);
    }),
    [issues, subGoalIds],
  );

  // Map objectifs → livrables
  const issuesByGoal = useMemo(() => {
    const m = new Map<string, Issue[]>();
    for (const issue of missionIssues) {
      const gid = (issue as Issue & { goalId?: string | null }).goalId;
      if (!gid) continue;
      const arr = m.get(gid) ?? [];
      arr.push(issue);
      m.set(gid, arr);
    }
    return m;
  }, [missionIssues]);

  // KPIs mission (périmètre strict : sub-goals + missionIssues)
  const missionKpis = useMemo(() => {
    if (!rootMission) return [];
    const total = subGoals.length || 1;
    const achieved = subGoals.filter((g) => g.status === "achieved").length;
    const deliverables = missionIssues.filter((i) => i.status === "done").length;
    const totalIn = (runtime as { totalInputTokens?: number } | undefined)?.totalInputTokens ?? 0;
    const totalOut = (runtime as { totalOutputTokens?: number } | undefined)?.totalOutputTokens ?? 0;
    const cost = (runtime as { totalCostCents?: number } | undefined)?.totalCostCents ?? 0;
    return [
      { label: "Objectifs", value: `${achieved}/${total}` },
      { label: "Livrables", value: deliverables },
      { label: "Tokens", value: `${Math.round((totalIn + totalOut) / 1000)}k` },
      { label: "Coût", value: cost === 0 ? "—" : `${(cost / 100).toFixed(2)} €` },
    ];
  }, [rootMission, subGoals, missionIssues, runtime]);

  const progress = useMemo(() => {
    if (!rootMission || subGoals.length === 0) return undefined;
    const achieved = subGoals.filter((g) => g.status === "achieved").length;
    return Math.round((achieved / subGoals.length) * 100);
  }, [rootMission, subGoals]);

  const planSteps = useMemo<PlanStep[]>(() => {
    return subGoals.map<PlanStep>((g) => ({
      id: g.id,
      who: agent.name,
      when: g.status === "achieved" ? "fait" : g.status === "active" ? "en cours" : "à venir",
      what: g.title,
      status: g.status === "achieved" ? "done" : g.status === "active" ? "active" : "upcoming",
      badge: g.status === "active" && isAgentRunning(agent) ? <ThinkingBadge label="réflexion" /> : null,
    })).slice(0, 6);
  }, [subGoals, agent]);

  // ── Mutations livrables : Valider = status done, Refuser = cancelled ──
  const invalidateIssues = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.issues.list(companyId) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.goals.list(companyId) });
  };
  const validateIssue = useMutation({
    mutationFn: (id: string) => issuesApi.update(id, { status: "done" }),
    onSuccess: invalidateIssues,
  });
  const rejectIssue = useMutation({
    mutationFn: (id: string) => issuesApi.update(id, { status: "cancelled" }),
    onSuccess: invalidateIssues,
  });

  // ──────────────────────────────────────────────────────────────────────
  // État vide : pas de mission encore définie
  // ──────────────────────────────────────────────────────────────────────
  if (!rootMission) {
    return (
      <div className="space-y-4">
        <Card className="flex flex-col items-center gap-4 border-dashed bg-card/30 px-6 py-10 text-center">
          <Target className="h-10 w-10 text-muted-foreground" />
          <div>
            <h2 className="text-base font-semibold">Aucune mission active</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {agent.name} n'a pas encore de mission. Donne-lui un objectif clair et des livrables attendus pour qu'il sache quoi produire.
            </p>
          </div>
          <Button onClick={() => openNewGoal()}>
            <Plus className="mr-1 h-4 w-4" /> Définir une mission
          </Button>
          {onOpenTechnicalView && (
            <button
              onClick={onOpenTechnicalView}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              ou voir la vue technique (runs, transcription, config)
            </button>
          )}
        </Card>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────
  // Vue mission complète
  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Bandeau identité agent + statut */}
      <Card className="flex flex-row items-center gap-4 px-5 py-4">
        <AgentRoleAvatar name={agent.name} colorKey={agent.id} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {/* h2 : la page hôte porte déjà un h1 (titre agent dans le header global). */}
            <h2 className="text-lg font-semibold leading-tight">{agent.name}</h2>
            {isAgentRunning(agent) ? (
              <ThinkingBadge label="analyse en cours" />
            ) : (
              <StatusBadge status={agent.status} />
            )}
          </div>
          {agent.role && <p className="mt-0.5 text-xs text-muted-foreground">{agent.role}</p>}
        </div>
        {onOpenTechnicalView && (
          <Button variant="ghost" size="sm" onClick={onOpenTechnicalView} className="text-xs">
            Vue technique →
          </Button>
        )}
      </Card>

      {/* En-tête mission */}
      <MissionHeader
        label={missionHeaderLabel(rootMission.status)}
        title={rootMission.title}
        meta={
          <>
            créée {new Date(rootMission.createdAt).toLocaleDateString("fr-FR")}
            {rootMission.description && <> · {rootMission.description}</>}
          </>
        }
        kpis={missionKpis}
        progress={progress}
      />

      {/* Layout 2 colonnes : objectifs (2/3) + plan/moyens (1/3) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Objectifs + livrables */}
        <Card className="lg:col-span-2 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Objectifs &amp; livrables
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => openNewGoal({ parentId: rootMission.id })}
            >
              <Plus className="h-3 w-3" /> Ajouter un objectif
            </Button>
          </div>
          {subGoals.length === 0 ? (
            <div className="rounded-md border border-dashed bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
              Aucun objectif défini. Découpe la mission en étapes mesurables.
            </div>
          ) : (
            <div className="space-y-2.5">
              {subGoals.map((g, i) => {
                const linkedIssues = issuesByGoal.get(g.id) ?? [];
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
                        : g.status === "active" && linkedIssues.length > 0
                          ? Math.round(
                              (linkedIssues.filter((i) => i.status === "done").length / linkedIssues.length) * 100,
                            )
                          : undefined
                    }
                    dimmed={g.status === "planned" || g.status === "cancelled"}
                  >
                    {linkedIssues.length === 0 ? (
                      <div className="text-[11px] italic text-muted-foreground">Aucun livrable rattaché.</div>
                    ) : (
                      linkedIssues.slice(0, 5).map((issue) => (
                        <DeliverableRow
                          key={issue.id}
                          icon={<FileText className="h-3.5 w-3.5" />}
                          title={issue.title}
                          meta={`${issue.status} · ${issue.priority ?? "medium"}`}
                          status={deliverableStatusFor(issue)}
                          onValidate={
                            issue.status === "in_review"
                              ? () => validateIssue.mutate(issue.id)
                              : undefined
                          }
                          onReject={
                            issue.status === "in_review"
                              ? () => rejectIssue.mutate(issue.id)
                              : undefined
                          }
                          onOpen={() => navigate(`/issues/${issue.id}`)}
                          dimmed={issue.status === "cancelled" || issue.status === "blocked"}
                        />
                      ))
                    )}
                  </ObjectiveCard>
                );
              })}
            </div>
          )}
        </Card>

        {/* Plan + moyens */}
        <div className="space-y-4">
          <Card className="px-5 py-4">
            <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Plan en cours
            </div>
            <PlanTimeline steps={planSteps} />
          </Card>

          <Card className="px-5 py-4">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Moyens engagés
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Tokens entrée</span>
                <span className="text-muted-foreground">
                  {((runtime as { totalInputTokens?: number } | undefined)?.totalInputTokens ?? 0).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tokens sortie</span>
                <span className="text-muted-foreground">
                  {((runtime as { totalOutputTokens?: number } | undefined)?.totalOutputTokens ?? 0).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                <span>Coût total</span>
                <span>
                  {(((runtime as { totalCostCents?: number } | undefined)?.totalCostCents ?? 0) / 100).toFixed(2)} €
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
