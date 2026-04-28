import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { BUSINESS_SECTORS, getBusinessSector } from "@paperclipai/shared";
import { cn } from "@/lib/utils";

interface SectorPickerProps {
  value: string | null;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Combobox de secteur d'activité (référentiel partagé `BUSINESS_SECTORS`).
 * Affiche emoji + label, permet la recherche par frappe.
 */
export function SectorPicker({ value, onChange, className }: SectorPickerProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const selected = getBusinessSector(value);
  const filtered = BUSINESS_SECTORS.filter((s) =>
    !filter ? true : s.label.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm transition-colors hover:bg-accent/40",
            className,
          )}
        >
          <span className="inline-flex items-center gap-2">
            {selected ? (
              <>
                <span aria-hidden className="text-base">{selected.emoji}</span>
                <span>{selected.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Choisir un secteur d'activité…</span>
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)", maxHeight: 360 }}
        align="start"
      >
        <div className="relative border-b border-border">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Rechercher un secteur…"
            className="h-9 border-0 pl-9 text-sm focus-visible:ring-0"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              Aucun secteur ne correspond à "{filter}".
            </div>
          ) : (
            filtered.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                  setFilter("");
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent/50",
                  value === s.id && "bg-accent",
                )}
              >
                <span aria-hidden className="text-base">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
