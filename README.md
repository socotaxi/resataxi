# ResaTaxi

ResaTaxi est une petite application web de réservation de taxi fonctionnant comme une Progressive Web App (PWA). Elle permet aux clients de s'inscrire, de se connecter puis d'envoyer une demande de course via WhatsApp tout en sauvegardant la réservation dans Firestore.

## Fonctionnalités

- **Authentification** via Firebase (création de compte et connexion par email/mot de passe).
- **Formulaire de réservation** avec saisie du lieu de départ, du lieu d'arrivée, de l'heure souhaitée et d'un commentaire.
- **Géolocalisation** du client et génération d'un lien Google Maps pour l'itinéraire.
- **Envoi sur WhatsApp** : la demande est envoyée au numéro de téléphone configuré.
- **Sauvegarde dans Firestore** : toutes les réservations sont enregistrées dans la collection `reservations`.
- **Affichage d'une carte** avec Leaflet montrant la position actuelle de l'utilisateur.
- **PWA installable** grâce au fichier `manifest.json` et au `service-worker`.

## Prérequis

- Un **projet Firebase** configuré avec :
  - Firebase Authentication (mode Email/Password activé)
  - Cloud Firestore
- Un hébergement web statique (par exemple Firebase Hosting ou tout autre serveur web)
- Facultatif : Node.js si vous souhaitez lancer un petit serveur local durant le développement.

## Configuration

Les paramètres sensibles sont écrits en dur dans le code :

- **Configuration Firebase** : à remplacer dans `index.html` (ou `app.js` si vous utilisez ce fichier) à l'endroit de l'objet `firebaseConfig`.
- **Numéro WhatsApp de la société** : modifiez la constante `telSociete` dans `index.html` (et `app.js` si besoin) pour utiliser votre numéro de téléphone professionnel.

Exemple pour `index.html` :

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const telSociete = "242050787624"; // À remplacer par votre numéro WhatsApp
```

## Mise en place et exécution

1. Clonez ce dépôt puis remplacez la configuration Firebase et le numéro de téléphone comme indiqué ci-dessus.
2. Servez le dossier via un serveur web. Exemple en utilisant `python` :
   ```bash
   python -m http.server 8080
   ```
   Rendez-vous ensuite sur <http://localhost:8080/index.html>.
3. Vous pouvez ensuite déployer le contenu du dossier sur votre hébergeur préféré (Firebase Hosting, Netlify, etc.).

## Étapes de build / minification

Le projet est constitué de simples fichiers statiques et ne nécessite pas de processus de build particulier. Si vous souhaitez optimiser le poids des fichiers, vous pouvez :

1. Installer un outil de minification, par exemple :
   ```bash
   npm install -g terser html-minifier
   ```
2. Minifier les fichiers :
   ```bash
   terser app.js -o app.min.js
   html-minifier index.html -o index.min.html --collapse-whitespace --remove-comments
   ```
3. Mettre à jour `index.html` pour pointer vers la version minifiée de vos fichiers.

Ces étapes sont facultatives mais peuvent améliorer le temps de chargement en production.
