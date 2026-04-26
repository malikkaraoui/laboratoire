import type { ReactNode } from "react";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPIGrid, type KPI } from "./kpi-grid";

export interface MissionHeaderProps {
  title: string;
  meta?: ReactNode;
  kpis?: KPI[];
  progress?: number;
  className?: string;
  /** Slot droit (ex. boutons d'action) */
  actions?: ReactNode;
  empty?: boolean;
}

/**
 * En-tête de mission : titre, méta (qui/quand/échéance), KPIs, progress bar.
 * Gabarit visuel constant pour ancrer l'œil sur la même hiérarchie.
 */
export function MissionHeader({ title, meta, kpis, progress, actions, empty, className }: MissionHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Target className="h-3 w-3" /> Mission active
          </div>
          <h1 className={cn("mt-1 text-xl font-semibold leading-tight tracking-tight", empty && "text-muted-foreground")}>
            {title}
          </h1>
          {meta && <div className="mt-1.5 text-xs text-muted-foreground">{meta}</div>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {kpis && kpis.length > 0 && <KPIGrid items={kpis} className="mt-4" />}
      {typeof progress === "number" && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </section>
  );
}
