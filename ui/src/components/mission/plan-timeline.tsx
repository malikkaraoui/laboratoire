import type { ReactNode } from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanStep {
  id: string;
  who: string;
  when: string;
  what: string;
  status: "done" | "active" | "upcoming";
  badge?: ReactNode;
}

/**
 * Timeline verticale d'un plan d'action. Marque visuelle :
 * - done : check vert + opacity réduite
 * - active : cercle vert plein + animation pulse côté icône
 * - upcoming : cercle outline gris
 */
export function PlanTimeline({ steps }: { steps: PlanStep[] }) {
  if (steps.length === 0) {
    return <div className="text-xs italic text-muted-foreground">Aucune étape planifiée.</div>;
  }
  return (
    <ol className="space-y-2">
      {steps.map((step) => (
        <li
          key={step.id}
          className={cn(
            "flex gap-3 rounded-md border-l-2 bg-muted/40 px-3 py-2",
            step.status === "done" && "border-l-emerald-500/70 opacity-70",
            step.status === "active" && "border-l-emerald-500 bg-emerald-500/5",
            step.status === "upcoming" && "border-l-border opacity-50",
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
              step.status === "done" && "bg-emerald-500 text-white",
              step.status === "active" && "border border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
              step.status === "upcoming" && "border border-border text-muted-foreground",
            )}
          >
            {step.status === "done" ? <Check className="h-3 w-3" /> : <Circle className={cn("h-2 w-2", step.status === "active" && "fill-current")} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{step.who}</span>
              <span>·</span>
              <span>{step.when}</span>
              {step.badge}
            </div>
            <div className="mt-0.5 text-sm leading-snug">{step.what}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
