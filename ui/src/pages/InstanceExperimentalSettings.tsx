import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlaskConical } from "lucide-react";
import type { PatchInstanceExperimentalSettings } from "@paperclipai/shared";
import { instanceSettingsApi } from "@/api/instanceSettings";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { queryKeys } from "../lib/queryKeys";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

export function InstanceExperimentalSettings() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Paramètres de l'instance" },
      { label: "Expérimental" },
    ]);
  }, [setBreadcrumbs]);

  const experimentalQuery = useQuery({
    queryKey: queryKeys.instance.experimentalSettings,
    queryFn: () => instanceSettingsApi.getExperimental(),
  });

  const toggleMutation = useMutation({
    mutationFn: async (patch: PatchInstanceExperimentalSettings) =>
      instanceSettingsApi.updateExperimental(patch),
    onSuccess: async () => {
      setActionError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.instance.experimentalSettings }),
        queryClient.invalidateQueries({ queryKey: queryKeys.health }),
      ]);
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : "Impossible de mettre à jour les paramètres expérimentaux.");
    },
  });

  if (experimentalQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">Chargement des paramètres expérimentaux...</div>;
  }

  if (experimentalQuery.error) {
    return (
      <div className="text-sm text-destructive">
        {experimentalQuery.error instanceof Error
          ? experimentalQuery.error.message
          : "Impossible de charger les paramètres expérimentaux."}
      </div>
    );
  }

  const enableEnvironments = experimentalQuery.data?.enableEnvironments === true;
  const enableIsolatedWorkspaces = experimentalQuery.data?.enableIsolatedWorkspaces === true;
  const autoRestartDevServerWhenIdle = experimentalQuery.data?.autoRestartDevServerWhenIdle === true;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Expérimental</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Activez des fonctionnalités encore en cours d'évaluation avant qu'elles ne deviennent le comportement par défaut.
        </p>
      </div>

      {actionError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold">Activer les environnements</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Affiche la gestion des environnements dans les paramètres de l'entreprise et permet les contrôles d'assignation d'environnement pour les projets et les agents.
            </p>
          </div>
          <ToggleSwitch
            checked={enableEnvironments}
            onCheckedChange={() => toggleMutation.mutate({ enableEnvironments: !enableEnvironments })}
            disabled={toggleMutation.isPending}
            aria-label="Activer/désactiver le paramètre expérimental des environnements"
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold">Activer les espaces de travail isolés</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Affiche les contrôles d'espace de travail d'exécution dans la configuration du projet et permet un comportement d'espace de travail isolé pour les exécutions de tickets nouveaux et existants.
            </p>
          </div>
          <ToggleSwitch
            checked={enableIsolatedWorkspaces}
            onCheckedChange={() => toggleMutation.mutate({ enableIsolatedWorkspaces: !enableIsolatedWorkspaces })}
            disabled={toggleMutation.isPending}
            aria-label="Activer/désactiver le paramètre expérimental des espaces de travail isolés"
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-sm font-semibold">Redémarrage automatique du serveur de dev en veille</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Avec `pnpm dev:once`, attend que toutes les exécutions d'agents locaux en file ou en cours se terminent, puis redémarre automatiquement le serveur quand des modifications backend ou des migrations rendent le démarrage actuel obsolète.
            </p>
          </div>
          <ToggleSwitch
            checked={autoRestartDevServerWhenIdle}
            onCheckedChange={() => toggleMutation.mutate({ autoRestartDevServerWhenIdle: !autoRestartDevServerWhenIdle })}
            disabled={toggleMutation.isPending}
            aria-label="Activer/désactiver le redémarrage automatique du serveur de dev"
          />
        </div>
      </section>
    </div>
  );
}
