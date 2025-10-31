# Laboratoire - Horloge Numérique avec Gestion Utilisateur

Une application web qui affiche l'heure actuelle avec un système de gestion des informations utilisateur.

## Fonctionnalités

- ⏰ Affichage de l'heure en format `heure:minute:secondes`
- 🔄 Mise à jour automatique toutes les secondes
- 👤 Module User avec gestion des informations personnelles
- 📝 Formulaire de saisie (prénom, nom, âge, pays d'origine)
- 🌍 Sélecteur de pays avec drapeaux et liste déroulante
- 💾 Affichage des informations utilisateur sous l'horloge
- 🌙 Thème sombre avec fond noir et police blanche
- 📱 Design responsive pour tous les appareils

## Module User

Le module User permet de gérer les informations suivantes :
- **nameuser** : Prénom de l'utilisateur
- **surname** : Nom de famille
- **age** : Âge (avec validation 1-150 ans)
- **country** : Pays d'origine avec drapeau

### Fonctionnalités du module :
- Validation des données
- Formatage d'affichage avec drapeaux
- Gestion de l'état complet/incomplet
- Méthodes utilitaires (nom complet, affichage pays, etc.)

## Module Countries

Le module Countries offre :
- **40+ pays** avec drapeaux emoji
- **Liste déroulante** intuitive
- **Recherche** par navigation dans la liste
- **Affichage** formaté avec drapeaux
- **Validation** de la sélection

## Technologies utilisées

- **Vite.js** - Build tool moderne et rapide
- **JavaScript ES6+** - Modules ES6, classes, destructuring
- **HTML5** - Structure sémantique avec formulaires
- **CSS3** - Styles personnalisés avec responsive design

## Démarrage rapide

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

3. **Ouvrir votre navigateur :**
   - Aller à `http://localhost:5174/` (ou le port affiché dans le terminal)

## Utilisation

1. **Visualiser l'heure** : L'horloge s'affiche automatiquement
2. **Saisir vos informations** : Remplir le formulaire avec :
   - Votre prénom
   - Votre nom
   - Votre âge
   - Votre pays d'origine (avec liste déroulante)
3. **Sélectionner le pays** : Choisir dans la liste déroulante
4. **Valider** : Cliquer sur "Valider" pour afficher vos informations
5. **Modifier** : Utiliser le bouton "Modifier" pour changer vos informations

## Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la version de production

## Structure du projet

```
Laboratoire/
├── public/          # Fichiers statiques
├── src/
│   ├── main.js      # Point d'entrée JavaScript
│   ├── user.js      # Module User (classe)
│   ├── countries.js # Module Countries (gestion pays/drapeaux)
│   └── style.css    # Styles CSS
├── index.html       # Page HTML principale
└── package.json     # Configuration du projet
```

## Personnalisation

Vous pouvez facilement modifier :
- **Couleurs** : Dans `src/style.css`
- **Format de l'heure** : Dans la fonction `formatTime()` de `src/main.js`
- **Validation de l'âge** : Dans la classe `User` de `src/user.js`
- **Champs du formulaire** : Ajouter de nouveaux champs dans `index.html` et `user.js`

---

Projet créé avec Vite.js et JavaScript vanilla (ES6 modules) 🚀