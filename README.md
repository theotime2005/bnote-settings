# bnote-settings

## Le projet

B.note est un afficheur braille conçu par Eurobraille. Vous pouvez retrouver plus d'informations sur l'appareil sur [le site internet](www.eurobraille.fr).
Le but de cette interface web est de permettre aux persones voyantes de configurer les paramètres du B.note directement, sans avoir à passer par l'interface braille interne de l'appareil.

## Développement

### Avertissement

Ce code source est libre de toute modification. Cependant, afin d'éviter de surcharger internet de site similaires, nous vous demandons de ne pas le déployer. toutes contribution est cependant la bienvenue.

### Logiciel nécessaire

Vous devez disposer de [nodejs](https://nodejs.org/fr) et d'un IDE.

### Acquisition des sources

Vous pouvez cloner ce dépôt via la ligne de commande de la manière suivante:

```shell
git clone git@github.com:theotime2005/bnote-settings
```

### Installation des dépendances

Une fois dans le dossier du projet, entrez la ligne suivante

```shell
npm install
```

### Lancer le projet en mode dev
Entrez la comande suivante pour lancer le projet
```shell
npm run dev
```

### Builder le projet
Pour faire un build, entrez la commande suivante:
```shell
npm run build
```

### CSS
Ce projet utilise [Tailwind](https://tailwindcss.com) pour le css. Vous pouvez donc utiliser directement les classes fourni pour votre projet.

## Contribution
### Précossions de développement
Une suite de tests unitaires a été configurée pour ce projet. Vous pouvez la lancer avec cette commande:
```shell
npm run test:unit
```
Pour chaques nouvelle fonction,merci d'écrire le test associé.
De plus, des règles de linting ont été configurées. Vous pouvez entrer cette commande pour vérifier qu'il n'y a pas d'erreur de mise en forme:
```shell
npm run lint
```

### Les étapes
- Faire vos modifications,
- Tester votre code,
- Vérifier le linting,
- Ouvrir une Pull Request.
Si vos modification sont acceptées, la PR sera merged dans le projet et déployée sur le site.

## Server Discord
Un serveur Discord est joignable pour recevoir toutes les dernières informations à propos de l'évolution du site, ainsi que celle du B.note. Vous pouvez le rejoindre [Par ici](https://discord.gg/V3kd6MMP)
