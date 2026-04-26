import type { ReactNode } from "react";
import { Check, X, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DeliverableRowProps {
  icon?: ReactNode;
  title: string;
  meta?: string;
  /** Si défini → affiche les boutons Valider/Refuser inline */
  onValidate?: () => void;
  onReject?: () => void;
  onOpen?: () => void;
  status?: "pending" | "validated" | "rejected" | "blocked" | null;
  dimmed?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "à valider",
  validated: "validé",
  rejected: "refusé",
  blocked: "bloqué",
};

/**
 * Ligne de livrable. Layout fixe :
 * [icon] [titre + meta]                              [actions]
 *
 * Les actions critiques (Valider/Refuser) sont TOUJOURS inline, jamais
 * cachées derrière un menu — c'est le principe du cockpit.
 */
export function DeliverableRow({
  icon,
  title,
  meta,
  onValidate,
  onReject,
  onOpen,
  status,
  dimmed,
}: DeliverableRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-transparent bg-muted/40 px-3 py-2 transition-colors hover:bg-muted/70",
        dimmed && "opacity-50",
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
        {icon ?? <FileText className="h-3.5 w-3.5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{title}</div>
        {meta && <div className="mt-0.5 text-[11px] text-muted-foreground">{meta}</div>}
      </div>
      <div className="flex items-center gap-1.5">
        {status && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{STATUS_LABEL[status] ?? status}</span>
        )}
        {onValidate && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 border-emerald-500/40 bg-emerald-500/10 px-2 text-xs text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
            onClick={onValidate}
          >
            <Check className="h-3 w-3" />
            Valider
          </Button>
        )}
        {onReject && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 border-red-500/40 bg-red-500/10 px-2 text-xs text-red-700 hover:bg-red-500/20 dark:text-red-300"
            onClick={onReject}
          >
            <X className="h-3 w-3" />
            Refuser
          </Button>
        )}
        {onOpen && (
          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={onOpen}>
            <Eye className="h-3 w-3" />
            Détails
          </Button>
        )}
      </div>
    </div>
  );
}
