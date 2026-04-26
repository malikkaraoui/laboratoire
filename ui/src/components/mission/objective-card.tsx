import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./badges";

export interface ObjectiveCardProps {
  index: number;
  total: number;
  title: string;
  status: string;
  progress?: number; // 0-100
  meta?: ReactNode;
  children?: ReactNode;
  dimmed?: boolean;
}

/**
 * Carte d'objectif unitaire dans la timeline d'une mission.
 * Hiérarchie typographique :
 * - "Objectif n/total" : text-[10px] uppercase muted
 * - Titre : text-sm font-medium
 * - Progress 4px
 * - Children : livrables (DeliverableRow)
 */
export function ObjectiveCard({ index, total, title, status, progress, meta, children, dimmed }: ObjectiveCardProps) {
  const pct = typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : null;
  return (
    <div className={cn("rounded-md border border-border bg-card/30 p-4", dimmed && "opacity-60")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Objectif {index}/{total}</div>
          <div className="mt-0.5 text-sm font-medium leading-snug">{title}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      {pct !== null && (
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      )}
      {meta && <div className="mt-2 text-[11px] text-muted-foreground">{meta}</div>}
      {children && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}
