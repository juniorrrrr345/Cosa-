# CANAGOOD 69 APP 🌿

Application mobile-first pour la boutique CANAGOOD 69 avec page d'informations et panel d'administration.

## 🎯 STATUS: PRÊT POUR DÉPLOIEMENT VERCEL ✅

**Repository:** https://github.com/juniorrrrr345/Cosa-  
**Auteur:** CANAGOOD69  
**Version:** 1.0.0 - Production Ready

## 🚀 Fonctionnalités

- ✨ Page d'informations avec design mobile-first identique à l'image de référence
- 🎨 Panel d'administration pour configurer le background et les informations
- 📱 Interface responsive optimisée mobile
- 🎯 Navigation intuitive avec barre de navigation en bas
- 💾 Sauvegarde des configurations dans le localStorage
- 🖼️ Support d'images de fond personnalisées
- 🎨 Sélecteur de couleurs pour le background

## 🛠️ Installation et Développement

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd canagood-69-app

# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🎯 Utilisation

### Page d'Informations (Public)
- Affichage des informations de la boutique CANAGOOD 69
- Logo avec effet 3D doré
- Informations de contact et services
- Navigation en bas de page

### Panel d'Administration
Plusieurs façons d'accéder au panel admin :

1. **URL avec paramètre** : `?admin=true`
   ```
   http://localhost:3000?admin=true
   ```

2. **Console JavaScript** :
   ```javascript
   window.toggleAdmin()
   ```

3. **Zone cliquable invisible** : Cliquer en haut à droite de l'écran

### Configuration Available
- **Nom de la boutique** : Modifier le titre affiché
- **Description** : Modifier la description sous le titre
- **Couleur de fond** : Sélectionner une couleur unie
- **Image de fond** : Uploader une image personnalisée
- **Aperçu en temps réel** : Visualiser les changements avant sauvegarde

## 📁 Structure du Projet

```
src/
├── components/
│   └── InfoPage.js          # Page principale d'informations
├── admin/
│   └── AdminPanel.js        # Panel d'administration
├── services/
│   └── configService.js     # Service de gestion de configuration
├── App.js                   # Composant principal
├── App.css                  # Styles globaux
└── index.js                 # Point d'entrée
```

## 🚀 Déploiement sur GitHub Pages

### Méthode 1: Déploiement Automatique (Recommandé)

1. **Activer GitHub Pages** :
   - Aller dans Settings du repository
   - Scroll jusqu'à "Pages"
   - Source: "GitHub Actions"

2. **Push vers main** :
   - Le déploiement se fait automatiquement
   - Via GitHub Actions workflow

3. **URL Live** :
   - `https://juniorrrrr345.github.io/Cosa-`

### Méthode 2: Déploiement Manuel

```bash
npm run deploy
```

### Alternative: Déploiement sur Vercel

1. **Se connecter à [Vercel](https://vercel.com)**
2. **Importer le repository GitHub**
3. **Configuration automatique**

## 🎨 Personnalisation

### Modifier les Couleurs
Éditer les gradients dans `InfoPage.js` et `AdminPanel.js` :
```javascript
background: linear-gradient(45deg, #couleur1, #couleur2);
```

### Ajouter des Informations
Modifier la section `InfoSection` dans `InfoPage.js` :
```javascript
<InfoItem>
  <InfoLabel>
    <Icon>🚀</Icon>
    Nouveau Service
  </InfoLabel>
  <InfoValue>Description du service</InfoValue>
</InfoItem>
```

## 📱 Responsive Design

L'application est optimisée pour :
- 📱 Mobile (320px+)
- 📟 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 💾 Stockage des Données

Les configurations sont sauvegardées dans le `localStorage` du navigateur :
- Nom de la boutique
- Description
- Couleur de fond
- Image de fond (en base64)

## 🔒 Accès Admin

Par défaut, l'accès admin est "secret" pour éviter les modifications non autorisées :
- Zone invisible en haut à droite
- Paramètre URL `?admin=true`
- Console JavaScript `window.toggleAdmin()`

## 🐛 Dépannage

### L'image de fond ne s'affiche pas
- Vérifier la taille de l'image (max recommandé : 2MB)
- Formats supportés : JPG, PNG, WebP
- Vider le cache du navigateur

### Les configurations ne se sauvegardent pas
- Vérifier que le localStorage est activé
- Vérifier les permissions du navigateur
- Essayer en navigation privée

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Support

Pour toute question ou problème, créer une issue sur GitHub.