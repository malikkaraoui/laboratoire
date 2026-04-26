import { cn } from "@/lib/utils";

/**
 * Badge "thinking" : remplace l'affichage du transcript LLM par un signal
 * minimal mais animé qu'il se passe quelque chose. L'utilisateur ne devrait
 * pas avoir à lire le raisonnement du modèle pour comprendre l'état.
 */
export function ThinkingBadge({ label = "en cours", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs italic text-muted-foreground",
        className,
      )}
    >
      {label}
      <span className="inline-flex gap-0.5" aria-hidden>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-thinking-dot" style={{ animationDelay: "0ms" }} />
        <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-thinking-dot" style={{ animationDelay: "150ms" }} />
        <span className="h-1 w-1 rounded-full bg-muted-foreground/60 animate-thinking-dot" style={{ animationDelay: "300ms" }} />
      </span>
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  running: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  active: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  in_progress: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  done: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  achieved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  in_review: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blocked: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
  cancelled: "border-zinc-500/40 bg-zinc-500/10 text-muted-foreground",
  planned: "border-zinc-500/40 bg-zinc-500/10 text-muted-foreground",
  todo: "border-zinc-500/40 bg-zinc-500/10 text-muted-foreground",
  backlog: "border-zinc-500/40 bg-zinc-500/10 text-muted-foreground",
};

const STATUS_LABELS: Record<string, string> = {
  active: "en cours",
  running: "en cours",
  in_progress: "en cours",
  achieved: "terminé",
  done: "terminé",
  pending: "en attente",
  in_review: "à valider",
  blocked: "bloqué",
  cancelled: "annulé",
  planned: "à venir",
  todo: "à faire",
  backlog: "à venir",
};

export function StatusBadge({ status, pulse, className }: { status: string; pulse?: boolean; className?: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.planned;
  const label = STATUS_LABELS[status] ?? status;
  const showPulse = pulse ?? (status === "active" || status === "running" || status === "in_progress");
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", style, className)}>
      {showPulse && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {label}
    </span>
  );
}
