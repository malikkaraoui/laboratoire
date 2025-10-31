// Module User pour gérer les informations utilisateur
export class User {
  constructor(nameuser = '', surname = '', age = '', country = null) {
    this.nameuser = nameuser;
    this.surname = surname;
    this.age = age;
    this.country = country; // Objet pays avec code, name, flag
  }

  // Méthode pour mettre à jour les informations
  updateInfo(nameuser, surname, age, country = null) {
    this.nameuser = nameuser;
    this.surname = surname;
    this.age = age;
    this.country = country;
  }

  // Méthode pour obtenir le nom complet
  getFullName() {
    return `${this.nameuser} ${this.surname}`;
  }

  // Méthode pour valider l'âge
  isValidAge() {
    const ageNum = parseInt(this.age);
    return !isNaN(ageNum) && ageNum > 0 && ageNum <= 150;
  }

  // Méthode pour obtenir un affichage formaté
  getDisplayInfo() {
    if (!this.nameuser || !this.surname || !this.age) {
      return null;
    }
    return {
      fullName: this.getFullName(),
      age: this.age,
      country: this.country
    };
  }

  // Méthode pour vérifier si toutes les informations sont remplies
  isComplete() {
    return this.nameuser.trim() !== '' && 
           this.surname.trim() !== '' && 
           this.age.trim() !== '' && 
           this.isValidAge() &&
           this.country !== null;
  }

  // Méthode pour obtenir l'affichage du pays
  getCountryDisplay() {
    if (!this.country) return '';
    return `${this.country.flag} ${this.country.name}`;
  }
}