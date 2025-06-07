# resataxi
Application de réservation taxi

## Construction

Le fichier `config.js` contenant le numéro de téléphone de la société est généré
à partir de la variable d'environnement `TEL_SOCIETE`. Utilisez la commande
suivante pour construire le projet :

```bash
node build.js
```

Si `TEL_SOCIETE` n'est pas défini, la valeur par défaut `242050787624` est
utilisée.
