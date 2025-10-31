// Module pour gérer les pays et leurs drapeaux
export const countries = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱' },
  { code: 'CZ', name: 'République tchèque', flag: '🇨🇿' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CD', name: 'République démocratique du Congo', flag: '🇨🇩' }
];

export class CountryManager {
  constructor() {
    this.countries = countries;
  }

  // Obtenir tous les pays
  getAllCountries() {
    return this.countries;
  }

  // Trouver un pays par son code
  getCountryByCode(code) {
    return this.countries.find(country => country.code === code);
  }

  // Trouver un pays par son nom
  getCountryByName(name) {
    return this.countries.find(country => 
      country.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Rechercher des pays par nom (pour l'autocomplétion)
  searchCountries(query) {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limiter à 10 résultats
  }

  // Obtenir l'affichage formaté (nom + drapeau)
  getDisplayFormat(country) {
    if (!country) return '';
    return `${country.flag} ${country.name}`;
  }
}