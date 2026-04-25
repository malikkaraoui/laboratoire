import { Link } from "@/lib/router";
import { Menu, PauseCircle, PlayCircle } from "lucide-react";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useSidebar } from "../context/SidebarContext";
import { useCompany } from "../context/CompanyContext";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "../api/companies";
import { agentsApi } from "../api/agents";
import { queryKeys } from "../lib/queryKeys";
import { PluginSlotOutlet, usePluginSlots } from "@/plugins/slots";
import { PluginLauncherOutlet, usePluginLaunchers } from "@/plugins/launchers";
import { ModelStatusWidget } from "./ModelStatusWidget";

function PauseGeneraleButton({ companyId }: { companyId: string }) {
  const [confirmPause, setConfirmPause] = useState(false);
  const queryClient = useQueryClient();

  const { data: agentsList } = useQuery({
    queryKey: queryKeys.agents.list(companyId),
    queryFn: () => agentsApi.list(companyId),
    refetchInterval: 10_000,
  });

  const anyPaused = (agentsList ?? []).some((a) => a.status === "paused");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(companyId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(companyId) });
  };

  const pauseMutation = useMutation({
    mutationFn: () => companiesApi.pauseAllAgents(companyId),
    onSuccess: () => { setConfirmPause(false); invalidate(); },
  });

  const resumeMutation = useMutation({
    mutationFn: () => companiesApi.resumeAllAgents(companyId),
    onSuccess: invalidate,
  });

  if (anyPaused) {
    return (
      <button
        onClick={() => resumeMutation.mutate()}
        disabled={resumeMutation.isPending}
        className="flex items-center gap-1 rounded border border-green-300 bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:border-green-500/30 dark:bg-green-950/40 dark:text-green-300 dark:hover:bg-green-950/60 shrink-0 disabled:opacity-50"
      >
        <PlayCircle className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{resumeMutation.isPending ? "…" : "Reprendre"}</span>
      </button>
    );
  }

  if (confirmPause) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:inline">Mettre en pause ?</span>
        <button
          onClick={() => pauseMutation.mutate()}
          disabled={pauseMutation.isPending}
          className="rounded border border-orange-400 bg-orange-600 px-2 py-1 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {pauseMutation.isPending ? "…" : "Confirmer"}
        </button>
        <button
          onClick={() => setConfirmPause(false)}
          className="rounded border border-border px-2 py-1 text-xs font-medium hover:bg-accent"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmPause(true)}
      className="flex items-center gap-1 rounded border border-orange-300 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-950/60 shrink-0"
    >
      <PauseCircle className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Pause générale</span>
    </button>
  );
}

type GlobalToolbarContext = { companyId: string | null; companyPrefix: string | null };

function GlobalToolbarPlugins({ context }: { context: GlobalToolbarContext }) {
  const { slots } = usePluginSlots({ slotTypes: ["globalToolbarButton"], companyId: context.companyId });
  const { launchers } = usePluginLaunchers({ placementZones: ["globalToolbarButton"], companyId: context.companyId, enabled: !!context.companyId });
  if (slots.length === 0 && launchers.length === 0) return null;
  return (
    <div className="flex items-center gap-1 ml-auto shrink-0 pl-2">
      <PluginSlotOutlet slotTypes={["globalToolbarButton"]} context={context} className="flex items-center gap-1" />
      <PluginLauncherOutlet placementZones={["globalToolbarButton"]} context={context} className="flex items-center gap-1" />
    </div>
  );
}

export function BreadcrumbBar() {
  const { breadcrumbs, mobileToolbar } = useBreadcrumbs();
  const { toggleSidebar, isMobile } = useSidebar();
  const { selectedCompanyId, selectedCompany } = useCompany();
  const modelWidget = selectedCompanyId ? <ModelStatusWidget companyId={selectedCompanyId} /> : null;
  const pauseButton = selectedCompanyId ? <PauseGeneraleButton companyId={selectedCompanyId} /> : null;

  const globalToolbarSlotContext = useMemo(
    () => ({
      companyId: selectedCompanyId ?? null,
      companyPrefix: selectedCompany?.issuePrefix ?? null,
    }),
    [selectedCompanyId, selectedCompany?.issuePrefix],
  );

  const globalToolbarSlots = <GlobalToolbarPlugins context={globalToolbarSlotContext} />;

  if (isMobile && mobileToolbar) {
    return (
      <div className="border-b border-border px-2 h-12 shrink-0 flex items-center">
        {mobileToolbar}
      </div>
    );
  }

  if (breadcrumbs.length === 0) {
    return (
      <div className="border-b border-border px-4 md:px-6 h-12 shrink-0 flex items-center justify-end gap-2">
        {pauseButton}
        {modelWidget}
        {globalToolbarSlots}
      </div>
    );
  }

  const menuButton = isMobile && (
    <Button
      variant="ghost"
      size="icon-sm"
      className="mr-2 shrink-0"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );

  // Single breadcrumb = page title (uppercase)
  if (breadcrumbs.length === 1) {
    return (
      <div className="border-b border-border px-4 md:px-6 h-12 shrink-0 flex items-center">
        {menuButton}
        <div className="min-w-0 overflow-hidden flex-1">
          <h1 className="text-sm font-semibold uppercase tracking-wider truncate">
            {breadcrumbs[0].label}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {pauseButton}
          {modelWidget}
        </div>
        {globalToolbarSlots}
      </div>
    );
  }

  // Multiple breadcrumbs = breadcrumb trail
  return (
    <div className="border-b border-border px-4 md:px-6 h-12 shrink-0 flex items-center">
      {menuButton}
      <div className="min-w-0 overflow-hidden flex-1">
        <Breadcrumb className="min-w-0 overflow-hidden">
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <Fragment key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem className={isLast ? "min-w-0" : "shrink-0"}>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {pauseButton}
        {modelWidget}
      </div>
      {globalToolbarSlots}
    </div>
  );
}
