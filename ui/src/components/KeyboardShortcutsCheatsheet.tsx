import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShortcutEntry {
  keys: string[];
  label: string;
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutEntry[];
}

const sections: ShortcutSection[] = [
  {
    title: "Boîte de réception",
    shortcuts: [
      { keys: ["j"], label: "Descendre" },
      { keys: ["↓"], label: "Descendre" },
      { keys: ["k"], label: "Monter" },
      { keys: ["↑"], label: "Monter" },
      { keys: ["←"], label: "Réduire le groupe sélectionné" },
      { keys: ["→"], label: "Développer le groupe sélectionné" },
      { keys: ["Enter"], label: "Ouvrir l'élément sélectionné" },
      { keys: ["a"], label: "Archiver l'élément" },
      { keys: ["y"], label: "Archiver l'élément" },
      { keys: ["r"], label: "Marquer comme lu" },
      { keys: ["U"], label: "Marquer comme non lu" },
    ],
  },
  {
    title: "Détail de la tâche",
    shortcuts: [
      { keys: ["y"], label: "Archiver rapidement vers la boîte de réception" },
      { keys: ["g", "i"], label: "Aller à la boîte de réception" },
      { keys: ["g", "c"], label: "Cibler le champ de commentaire" },
    ],
  },
  {
    title: "Global",
    shortcuts: [
      { keys: ["/"], label: "Rechercher sur la page ou recherche rapide" },
      { keys: ["c"], label: "Nouvelle tâche" },
      { keys: ["["], label: "Afficher/masquer la barre latérale" },
      { keys: ["]"], label: "Afficher/masquer le panneau" },
      { keys: ["?"], label: "Afficher les raccourcis clavier" },
    ],
  },
];

function KeyCap({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground shadow-[0_1px_0_1px_hsl(var(--border))]">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsCheatsheetContent() {
  return (
    <>
      <div className="divide-y divide-border border-t border-border">
        {sections.map((section) => (
          <div key={section.title} className="px-5 py-3">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.shortcuts.map((shortcut) => (
                <div
                  key={shortcut.label + shortcut.keys.join()}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-foreground/90">{shortcut.label}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={key} className="flex items-center gap-1">
                        {i > 0 && <span className="text-xs text-muted-foreground">puis</span>}
                        <KeyCap>{key}</KeyCap>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground">
          Appuyer sur <KeyCap>Esc</KeyCap> pour fermer &middot; Les raccourcis sont désactivés dans les champs de texte
        </p>
      </div>
    </>
  );
}

export function KeyboardShortcutsCheatsheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden" showCloseButton={false}>
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base">Raccourcis clavier</DialogTitle>
        </DialogHeader>
        <KeyboardShortcutsCheatsheetContent />
      </DialogContent>
    </Dialog>
  );
}
