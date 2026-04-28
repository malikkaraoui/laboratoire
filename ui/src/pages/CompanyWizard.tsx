import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  Github,
  FileBadge,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCompany } from "../context/CompanyContext";
import { companiesApi } from "../api/companies";
import { SectorPicker } from "../components/company/SectorPicker";
import { KbisLookupField, type KbisLookupResult } from "../components/company/KbisLookupField";
import { cn } from "@/lib/utils";

type StepId = "identity" | "presence" | "directives";

interface WizardData {
  name: string;
  description: string;
  sector: string | null;
  websiteUrl: string;
  githubUrl: string;
  kbisSiret: string;
  siretVerified: boolean;
}

const EMPTY: WizardData = {
  name: "",
  description: "",
  sector: null,
  websiteUrl: "",
  githubUrl: "",
  kbisSiret: "",
  siretVerified: false,
};

const STEPS: { id: StepId; label: string; sub: string; icon: typeof Building2 }[] = [
  { id: "identity", label: "Identité", sub: "Nom, secteur, présentation", icon: Building2 },
  { id: "presence", label: "Présence", sub: "Web, GitHub, KBIS", icon: Globe },
  { id: "directives", label: "Directives", sub: "Mission et règles", icon: Sparkles },
];

export function CompanyWizard() {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { setSelectedCompanyId } = useCompany();

  useEffect(() => {
    setBreadcrumbs([{ label: "Nouvelle société" }]);
  }, [setBreadcrumbs]);

  const [step, setStep] = useState<StepId>("identity");
  const [data, setData] = useState<WizardData>(EMPTY);

  const update = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const canGoNext =
    step === "identity"
      ? data.name.trim().length > 0
      : true;

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };
  const goPrev = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const create = useMutation({
    mutationFn: () =>
      companiesApi.create({
        name: data.name.trim(),
        description: data.description.trim() || null,
      }),
    onSuccess: async (company) => {
      // Patch des champs étendus en update (createSchema reste minimal pour rétro-compat)
      try {
        await companiesApi.update(company.id, {
          sector: data.sector,
          websiteUrl: data.websiteUrl.trim() || null,
          githubUrl: data.githubUrl.trim() || null,
          kbisSiret: data.kbisSiret.replace(/\s+/g, "") || null,
          siretVerified: data.siretVerified,
        });
      } catch {
        // Si la mise à jour des champs étendus échoue, on continue : la société est créée.
      }
      setSelectedCompanyId(company.id, { source: "manual" });
      navigate(`/dashboard`);
    },
  });

  const onApplySirene = (result: KbisLookupResult) => {
    update({
      siretVerified: true,
      // Pré-remplit le nom si vide (l'utilisateur garde la main)
      name: data.name.trim() || result.name || data.name,
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Créer une nouvelle société</h1>
        <p className="text-sm text-muted-foreground">
          Plus tu décris ta vraie société, plus l'équipe d'agents sera pertinente.
          Tu peux toujours compléter ces champs plus tard.
        </p>
      </div>

      {/* Stepper */}
      <Stepper currentIndex={stepIndex} />

      {/* Steps */}
      <Card className="px-6 py-6">
        {step === "identity" && <IdentityStep data={data} update={update} />}
        {step === "presence" && (
          <PresenceStep data={data} update={update} onApplySirene={onApplySirene} />
        )}
        {step === "directives" && <DirectivesStep data={data} update={update} />}
      </Card>

      {/* Erreur */}
      {create.isError && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400">
          {create.error instanceof Error ? create.error.message : "Création échouée."}
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goPrev} disabled={stepIndex === 0 || create.isPending}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Précédent
        </Button>
        {step !== "directives" ? (
          <Button onClick={goNext} disabled={!canGoNext}>
            Continuer <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => create.mutate()} disabled={!data.name.trim() || create.isPending}>
            {create.isPending ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Création…
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4" /> Créer la société
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Stepper ────────────────────────────────────────────────────────────────

function Stepper({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done && "border-emerald-500 bg-emerald-500 text-white",
                active && "border-foreground bg-foreground text-background",
                !done && !active && "border-border bg-card text-muted-foreground",
              )}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className={cn("text-sm font-medium", !active && !done && "text-muted-foreground")}>
                {s.label}
              </div>
              <div className="text-[11px] text-muted-foreground">{s.sub}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px flex-1", done ? "bg-emerald-500" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Étape 1 : Identité ─────────────────────────────────────────────────────

function IdentityStep({ data, update }: { data: WizardData; update: (p: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nom de la société <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Ex. Atelier Karaoui SAS"
          className="h-11 text-base"
          autoFocus
        />
        <p className="text-[11px] text-muted-foreground">
          Mets le vrai nom si tu veux cloner ta société. Tu peux toujours le changer.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Secteur d'activité</Label>
        <SectorPicker value={data.sector} onChange={(v) => update({ sector: v })} />
        <p className="text-[11px] text-muted-foreground">
          Aide les agents à se contextualiser et à proposer les bons profils de recrutement.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Présentation
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={
            "Que fait ta société ? Pour qui ? Quelle est sa proposition de valeur ?\n\n" +
            "Ex. « On fournit aux PME françaises une plateforme SaaS pour automatiser leur facturation client, " +
            "principalement dans la tech et le conseil. ~25 employés, 1,5 M€ ARR. »"
          }
          rows={7}
          className="min-h-[180px] resize-y text-sm leading-relaxed"
        />
        <p className="text-[11px] text-muted-foreground">
          Plus c'est riche, plus l'équipe d'agents prendra des décisions cohérentes.
        </p>
      </div>
    </div>
  );
}

// ─── Étape 2 : Présence ─────────────────────────────────────────────────────

function PresenceStep({
  data,
  update,
  onApplySirene,
}: {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  onApplySirene: (r: KbisLookupResult) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        💡 <strong className="text-foreground">Mode laboratoire CEO :</strong> renseigner ces liens permet aux agents
        de simuler des décisions sur le profil réel de ta société, en lisant ton site, ton GitHub, ton KBIS.
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-medium inline-flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5" /> Site web
        </Label>
        <Input
          id="website"
          type="url"
          value={data.websiteUrl}
          onChange={(e) => update({ websiteUrl: e.target.value })}
          placeholder="https://exemple.fr"
          className="h-11 text-sm"
        />
        <p className="text-[11px] text-muted-foreground">
          Page d'accueil de ta société. Les agents pourront s'y référer.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="github" className="text-sm font-medium inline-flex items-center gap-1.5">
          <Github className="h-3.5 w-3.5" /> Organisation GitHub
        </Label>
        <Input
          id="github"
          type="url"
          value={data.githubUrl}
          onChange={(e) => update({ githubUrl: e.target.value })}
          placeholder="https://github.com/ton-organisation"
          className="h-11 font-mono text-sm"
        />
        <p className="text-[11px] text-muted-foreground">
          Une mine d'or pour les agents techniques : repos publics, README, issues, langages.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium inline-flex items-center gap-1.5">
          <FileBadge className="h-3.5 w-3.5" /> SIRET (KBIS)
        </Label>
        <KbisLookupField
          value={data.kbisSiret}
          onChange={(v) => update({ kbisSiret: v, siretVerified: false })}
          onVerified={onApplySirene}
        />
        <p className="text-[11px] text-muted-foreground">
          Vérification publique via{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[10px]">recherche-entreprises.api.gouv.fr</code>{" "}
          — sans clé requise. Pré-remplit le nom de la société si reconnue.
        </p>
      </div>
    </div>
  );
}

// ─── Étape 3 : Directives ───────────────────────────────────────────────────

function DirectivesStep({ data, update }: { data: WizardData; update: (p: Partial<WizardData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold">Mission & directives stratégiques</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce que tu écris ici devient la "constitution" de ta société dans Paperclip.
          C'est ce qui guide chaque agent quand il doit prendre une décision.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="directives" className="text-sm font-medium">
          Directives <span className="text-muted-foreground font-normal">(optionnel mais recommandé)</span>
        </Label>
        <Textarea
          id="directives"
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={
            "Mission : pourquoi cette société existe.\n" +
            "Vision à 1 an : où on veut aller.\n" +
            "Valeurs / principes non négociables.\n" +
            "Contraintes (légales, budgétaires, éthiques).\n" +
            "Style de travail attendu (communication, prise de décision)."
          }
          rows={14}
          className="min-h-[320px] resize-y text-sm leading-relaxed"
        />
        <p className="text-[11px] text-muted-foreground">
          Astuce : tu peux remplir cette zone en colle (ex. depuis un brief existant).
          Modifiable à tout moment dans <strong>Paramètres → Société</strong>.
        </p>
      </div>

      <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-400">
        ✓ Tu pourras créer ton premier agent juste après. Pas d'engagement budgétaire à ce stade.
      </div>
    </div>
  );
}
