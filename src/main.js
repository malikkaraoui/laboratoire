import './style.css'
import { User } from './user.js'
import { CountryManager } from './countries.js'

// Instance de l'utilisateur et gestionnaire de pays
let currentUser = new User();
const countryManager = new CountryManager();

// Fonction pour formater l'heure
function formatTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

// Fonction pour mettre à jour l'affichage de l'heure
function updateClock() {
  const clockElement = document.getElementById('clock');
  clockElement.textContent = formatTime();
}

// Fonction pour peupler la liste déroulante des pays
function populateCountrySelect() {
  const countrySelect = document.getElementById('country');
  const countries = countryManager.getAllCountries();
  
  // Vider le select (garder seulement l'option par défaut)
  countrySelect.innerHTML = '<option value="">-- Sélectionnez votre pays --</option>';
  
  // Ajouter chaque pays à la liste
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = `${country.flag} ${country.name}`;
    option.dataset.countryData = JSON.stringify(country);
    countrySelect.appendChild(option);
  });
}

// Fonction pour obtenir le pays sélectionné
function getSelectedCountry() {
  const countrySelect = document.getElementById('country');
  const selectedOption = countrySelect.selectedOptions[0];
  
  if (!selectedOption || !selectedOption.value) {
    return null;
  }
  
  return JSON.parse(selectedOption.dataset.countryData);
}

// Fonction pour afficher les informations utilisateur
function displayUserInfo() {
  const userInfoContainer = document.getElementById('user-info');
  const userDisplayElement = document.getElementById('user-display');
  const userCountryElement = document.getElementById('user-country');
  const formContainer = document.getElementById('user-form-container');
  
  const userInfo = currentUser.getDisplayInfo();
  
  if (userInfo) {
    userDisplayElement.textContent = `${userInfo.fullName}, ${userInfo.age} ans`;
    userCountryElement.textContent = userInfo.country ? 
      `Pays d'origine : ${userInfo.country.flag} ${userInfo.country.name}` : '';
    
    userInfoContainer.classList.remove('hidden');
    formContainer.classList.add('hidden');
  }
}

// Fonction pour gérer la soumission du formulaire
function handleFormSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const nameuser = formData.get('nameuser').trim();
  const surname = formData.get('surname').trim();
  const age = formData.get('age').trim();
  const selectedCountry = getSelectedCountry();
  
  // Validation des données
  if (!nameuser || !surname || !age) {
    alert('Veuillez remplir tous les champs.');
    return;
  }
  
  if (!selectedCountry) {
    alert('Veuillez sélectionner un pays d\'origine.');
    return;
  }
  
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
    alert('Veuillez entrer un âge valide (entre 1 et 150).');
    return;
  }
  
  // Mettre à jour l'utilisateur
  currentUser.updateInfo(nameuser, surname, age, selectedCountry);
  
  // Afficher les informations
  displayUserInfo();
  
  // Réinitialiser le formulaire
  event.target.reset();
}

// Fonction pour réafficher le formulaire
function showForm() {
  const userInfoContainer = document.getElementById('user-info');
  const formContainer = document.getElementById('user-form-container');
  
  userInfoContainer.classList.add('hidden');
  formContainer.classList.remove('hidden');
  
  // Réinitialiser l'utilisateur
  currentUser = new User();
}

// Initialisation de l'application
function initializeApp() {
  // Démarrer l'horloge
  updateClock();
  setInterval(updateClock, 1000);
  
  // Peupler la liste des pays
  populateCountrySelect();
  
  // Gérer le formulaire
  const form = document.getElementById('user-form');
  form.addEventListener('submit', handleFormSubmission);
  
  // Ajouter un bouton pour modifier les informations
  const userInfoContainer = document.getElementById('user-info');
  const editButton = document.createElement('button');
  editButton.textContent = 'Modifier';
  editButton.onclick = showForm;
  userInfoContainer.appendChild(editButton);
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
