import { cn } from "../lib/utils";
import { statusBadge, statusBadgeDefault } from "../lib/status-colors";

const statusLabels: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  running: "En cours",
  paused: "En pause",
  error: "Erreur",
  idle: "En attente",
  success: "Succès",
  failed: "Échoué",
  cancelled: "Annulé",
  completed: "Terminé",
  open: "Ouvert",
  closed: "Fermé",
  blocked: "Bloqué",
  in_progress: "En cours",
  in_review: "En révision",
  todo: "À faire",
  done: "Terminé",
  backlog: "Backlog",
  queued: "En file",
  pending: "En attente",
  skipped: "Ignoré",
  timed_out: "Délai dépassé",
};

function formatStatus(status: string): string {
  return statusLabels[status] ?? status.replace(/_/g, " ");
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0",
        statusBadge[status] ?? statusBadgeDefault
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
