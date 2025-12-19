# Assistant CV & Lettre de Motivation IA

Une application web locale qui utilise l'IA de Google (Gemini) pour générer des CVs et des lettres de motivation adaptés à des offres d'emploi spécifiques, avec analyse ATS intégrée.

## 🚀 Installation & Lancement

Vous pouvez installer ce projet sur n'importe quel ordinateur (Mac, Windows, Linux) disposant de Node.js.

### Prérequis
- **Node.js** (Version 16 ou supérieure) : [Télécharger ici](https://nodejs.org/)
- **Clé API Gemini** : Obtenez-en une gratuitement sur [Google AI Studio](https://aistudio.google.com/app/apikey).

### Instructions (Terminal)

1. **Ouvrez votre terminal** (Terminal sur Mac, PowerShell ou CMD sur Windows).
2. **Naviguez vers le dossier du projet** :
   ```bash
   cd chemin/vers/cv-assistant
   ```
3. **Installez les dépendances** :
   ```bash
   npm install
   ```
4. **Configurez votre Clé API** :
   Créez un fichier nommé `.env` à la racine du projet et ajoutez votre clé :
   ```env
   VITE_API_KEY=Votre_Clé_API_Ici
   ```
   *(Ou lancez la commande suivante sur Mac/Linux)* :
   ```bash
   echo "VITE_API_KEY=AIzaSyB..." > .env
   ```
5. **Lancez l'application** :
   ```bash
   npm run dev
   ```
6. **Ouvrez le navigateur** :
   Cliquez sur le lien qui s'affiche (généralement `http://localhost:5173`).

## 🛠 Fonctionnalités

- **Profils Multiples** : Sauvegardez plusieurs versions de vos données (CV de base, Lettres types).
- **Analyse d'Offre** : Collez une offre d'emploi, l'IA génère un CV et une lettre sur mesure.
- **Score ATS** : L'IA évalue la correspondance entre votre CV généré et l'offre (Mots-clés manquants).
- **Design en Direct** : Changez la mise en page, les couleurs et les polices instantanément.
- **Export PDF** : Imprimez ou sauvegardez en PDF proprement (format A4 respecté).
- **Historique** : Suivez vos candidatures avec un tableau de bord (À faire, Envoyé, Entretien...).
- **Données Locales** : Tout est sauvegardé dans votre navigateur (LocalStorage). Rien n'est envoyé sur un serveur externe (sauf le texte à l'API Google pour la génération).

## 📦 Structure du Projet

- `src/` : Code source React
- `components/` : Composants UI (Preview, Chat, Editeur...)
- `services/` : Logique API (Gemini) et Stockage (LocalStorage)
- `types.ts` : Définitions TypeScript

## ⚠️ Dépannage

- **Erreur "VITE_API_KEY missing"** : Vérifiez que le fichier `.env` existe à la racine et contient la bonne clé.
- **Page blanche** : Vérifiez la console du navigateur (F12) pour les erreurs. Assurez-vous d'avoir lancé `npm install`.
