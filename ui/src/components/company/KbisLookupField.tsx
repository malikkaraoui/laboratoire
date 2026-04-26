import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, AlertCircle, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { companiesApi } from "@/api/companies";
import { cn } from "@/lib/utils";

export interface KbisLookupResult {
  siret: string;
  siren: string;
  name: string | null;
  nafCode: string | null;
  nafSection: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

interface KbisLookupFieldProps {
  value: string;
  onChange: (siret: string) => void;
  /**
   * Appelé quand le SIRET est vérifié avec succès. Le wizard l'utilise pour
   * pré-remplir nom + adresse + secteur.
   */
  onVerified?: (result: KbisLookupResult) => void;
  className?: string;
}

/**
 * Champ SIRET avec lookup public via api.gouv.fr (pas de clé requise).
 * Affiche un état visuel : neutre / chargement / vérifié / erreur.
 */
export function KbisLookupField({ value, onChange, onVerified, className }: KbisLookupFieldProps) {
  const [verified, setVerified] = useState<KbisLookupResult | null>(null);

  const lookup = useMutation({
    mutationFn: (siret: string) => companiesApi.lookupSirene(siret),
    onSuccess: (data) => {
      setVerified(data);
      onVerified?.(data);
    },
    onError: () => setVerified(null),
  });

  const cleaned = value.replace(/\s+/g, "");
  const isValidFormat = /^\d{14}$/.test(cleaned);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setVerified(null);
            lookup.reset();
          }}
          placeholder="14 chiffres — ex. 56202019200016"
          inputMode="numeric"
          className="h-11 font-mono text-sm"
        />
        <Button
          type="button"
          variant="outline"
          disabled={!isValidFormat || lookup.isPending}
          onClick={() => lookup.mutate(cleaned)}
          className="h-11 shrink-0 gap-1.5"
        >
          {lookup.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : verified ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          {verified ? "Vérifié" : "Vérifier"}
        </Button>
      </div>

      {lookup.isError && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {lookup.error instanceof Error
              ? lookup.error.message
              : "Lookup SIRENE échoué. Tu peux saisir le SIRET manuellement et continuer."}
          </span>
        </div>
      )}

      {verified && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
          <div className="font-medium text-emerald-700 dark:text-emerald-400">
            ✓ {verified.name ?? "Entreprise reconnue"}
          </div>
          <div className="mt-1 grid grid-cols-1 gap-x-4 gap-y-0.5 text-muted-foreground sm:grid-cols-2">
            <div>SIREN <span className="font-mono">{verified.siren}</span></div>
            {verified.nafCode && <div>NAF <span className="font-mono">{verified.nafCode}</span></div>}
            {verified.address && <div className="sm:col-span-2">📍 {verified.address}, {verified.postalCode} {verified.city}</div>}
          </div>
        </div>
      )}

      {!isValidFormat && value.length > 0 && !lookup.isError && (
        <p className="text-[11px] text-muted-foreground">
          Format attendu : 14 chiffres (sans espace).
        </p>
      )}
    </div>
  );
}
