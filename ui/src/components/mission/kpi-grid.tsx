import { cn } from "@/lib/utils";

export interface KPI {
  label: string;
  value: string | number;
  hint?: string;
}

/**
 * Grille compacte de KPIs en haut d'une mission. Format strict :
 * grand chiffre (text-2xl), label discret (text-[11px] uppercase).
 */
export function KPIGrid({ items, className }: { items: KPI[]; className?: string }) {
  return (
    <div className={cn("grid gap-3", className)} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((k) => (
        <div key={k.label} className="rounded-md border border-border bg-card/50 px-3 py-2">
          <div className="text-2xl font-semibold leading-tight tracking-tight">{k.value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
          {k.hint && <div className="mt-1 text-[11px] text-muted-foreground">{k.hint}</div>}
        </div>
      ))}
    </div>
  );
}
