/**
 * Référentiel des secteurs d'activité utilisés pour le profil "vraie entreprise".
 * Calqué sur la nomenclature NAF (INSEE) simplifiée pour rester intelligible
 * en UI sans imposer un code à 5 caractères à l'utilisateur.
 *
 * Pour cartographier vers/depuis l'API SIRENE : la réponse INSEE renvoie
 * `activitePrincipale` (code NAF). On peut conserver ce code à part dans
 * un champ technique si besoin — ici on garde la lecture humaine.
 */

export interface BusinessSector {
  id: string;
  label: string;
  emoji: string;
}

export const BUSINESS_SECTORS: BusinessSector[] = [
  { id: "tech-software", label: "Logiciel & SaaS", emoji: "💻" },
  { id: "tech-ai", label: "Intelligence artificielle", emoji: "🤖" },
  { id: "tech-hardware", label: "Hardware & électronique", emoji: "🔌" },
  { id: "tech-cybersec", label: "Cybersécurité", emoji: "🔐" },
  { id: "ecommerce", label: "E-commerce & retail", emoji: "🛍️" },
  { id: "finance", label: "Finance & banque", emoji: "💳" },
  { id: "fintech", label: "Fintech & crypto", emoji: "🪙" },
  { id: "insurance", label: "Assurance", emoji: "🛡️" },
  { id: "healthcare", label: "Santé & medtech", emoji: "🏥" },
  { id: "biotech", label: "Biotech & pharma", emoji: "🧬" },
  { id: "education", label: "Éducation & edtech", emoji: "🎓" },
  { id: "media", label: "Média & édition", emoji: "📰" },
  { id: "entertainment", label: "Divertissement & gaming", emoji: "🎮" },
  { id: "marketing", label: "Marketing & communication", emoji: "📣" },
  { id: "consulting", label: "Conseil & services aux entreprises", emoji: "💼" },
  { id: "legal", label: "Juridique", emoji: "⚖️" },
  { id: "real-estate", label: "Immobilier & proptech", emoji: "🏢" },
  { id: "construction", label: "BTP & construction", emoji: "🏗️" },
  { id: "manufacturing", label: "Industrie manufacturière", emoji: "🏭" },
  { id: "energy", label: "Énergie & utilities", emoji: "⚡" },
  { id: "agritech", label: "Agriculture & agritech", emoji: "🌾" },
  { id: "food", label: "Agroalimentaire & restauration", emoji: "🍴" },
  { id: "transport", label: "Transport & logistique", emoji: "🚚" },
  { id: "mobility", label: "Mobilité & automobile", emoji: "🚗" },
  { id: "tourism", label: "Tourisme & hôtellerie", emoji: "✈️" },
  { id: "fashion", label: "Mode & luxe", emoji: "👗" },
  { id: "art-culture", label: "Art & culture", emoji: "🎨" },
  { id: "sport", label: "Sport & bien-être", emoji: "🏋️" },
  { id: "ngo", label: "ONG & économie sociale", emoji: "🤝" },
  { id: "public", label: "Secteur public", emoji: "🏛️" },
  { id: "other", label: "Autre", emoji: "🧩" },
];

export function getBusinessSector(id: string | null | undefined): BusinessSector | null {
  if (!id) return null;
  return BUSINESS_SECTORS.find((s) => s.id === id) ?? null;
}
