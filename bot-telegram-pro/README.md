# Bot Telegram Professionnel 🤖

Bot Telegram complet avec panel d'administration, prêt à l'emploi et déployable en 5 minutes.

## 📦 Fonctionnalités

### Pour les utilisateurs
- ✅ Menu principal avec photo et message personnalisable
- ✅ Réseaux sociaux directement accessibles
- ✅ Page d'information personnalisable
- ✅ Statistiques publiques (si activées)
- ✅ Interface fluide avec suppression automatique des anciens messages

### Pour les administrateurs
- ✅ Panel admin complet via `/admin`
- ✅ Modification du message et photo d'accueil
- ✅ Gestion des réseaux sociaux (ajouter, modifier, supprimer)
- ✅ Diffusion de messages à tous les utilisateurs
- ✅ Statistiques détaillées
- ✅ Gestion des utilisateurs
- ✅ Mode maintenance
- ✅ Paramètres configurables

## 🚀 Installation rapide

### 1. Prérequis
- Node.js 14+ installé
- Un compte MongoDB (gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Un bot Telegram (créé via [@BotFather](https://t.me/botfather))

### 2. Installation

```bash
# Cloner le repository
git clone https://github.com/juniorrrrr345/LANATION.git
cd LANATION/bot-telegram-pro

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### 3. Configuration

Éditez le fichier `.env` avec vos informations :

```env
BOT_TOKEN=votre_token_bot_telegram
ADMIN_ID=votre_id_telegram
MONGODB_URI=votre_uri_mongodb
```

#### Comment obtenir ces informations :

**BOT_TOKEN** :
1. Parlez à [@BotFather](https://t.me/botfather)
2. Créez un nouveau bot avec `/newbot`
3. Copiez le token fourni

**ADMIN_ID** :
1. Parlez à [@userinfobot](https://t.me/userinfobot)
2. Copiez votre ID numérique

**MONGODB_URI** :
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Créez un utilisateur de base de données
4. Obtenez l'URI de connexion

### 4. Lancement

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📱 Utilisation

### Commandes utilisateur
- `/start` - Menu principal

### Commandes administrateur
- `/admin` - Accéder au panel d'administration
- `/removephoto` - Supprimer la photo d'accueil

### Navigation dans le panel admin

1. **📝 Message d'accueil** : Modifier le message de bienvenue
   - Utilisez `{firstname}` pour personnaliser avec le prénom

2. **🖼 Photo d'accueil** : Ajouter/modifier la photo du menu principal

3. **🔗 Réseaux sociaux** : Gérer les liens sociaux
   - Ajouter : `Nom | URL | Emoji`
   - Exemple : `Instagram | https://instagram.com/moncompte | 📸`

4. **ℹ️ Texte info** : Modifier la page d'information

5. **📊 Statistiques** : Voir les stats détaillées du bot

6. **👥 Utilisateurs** : Gérer les utilisateurs

7. **📢 Diffusion** : Envoyer un message à tous les utilisateurs

8. **⚙️ Paramètres** : Configurer le comportement du bot

## 🌐 Déploiement sur Render

### 1. Préparer le déploiement

Créez un compte sur [Render.com](https://render.com) (gratuit).

### 2. Créer un nouveau Web Service

1. Connectez votre compte GitHub
2. Sélectionnez votre repository
3. Configurez :
   - **Name** : nom-de-votre-bot
   - **Environment** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

### 3. Variables d'environnement

Dans les settings de Render, ajoutez :
- `BOT_TOKEN`
- `ADMIN_ID`
- `MONGODB_URI`
- `NODE_ENV` = `production`
- `WEBHOOK_URL` = `https://nom-de-votre-bot.onrender.com`

### 4. Déployer

Cliquez sur "Create Web Service" et attendez le déploiement.

## 🔧 Configuration avancée

### Structure des fichiers

```
bot-telegram-pro/
├── bot-mongodb.js      # Fichier principal
├── config.js           # Gestionnaire de configuration
├── models.js           # Modèles MongoDB
├── keyboards.js        # Claviers Telegram
├── package.json        # Dépendances
├── .env.example        # Template variables
└── README.md          # Documentation
```

### Variables d'environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| BOT_TOKEN | Token du bot Telegram | ✅ |
| ADMIN_ID | ID Telegram de l'admin | ✅ |
| MONGODB_URI | URI de connexion MongoDB | ✅ |
| PORT | Port du serveur (défaut: 3000) | ❌ |
| WEBHOOK_URL | URL pour le webhook | ❌ |
| NODE_ENV | Environnement (development/production) | ❌ |

### Personnalisation

Le bot est conçu pour être facilement personnalisable :

1. **Modifier les messages par défaut** : Éditez `defaultConfig` dans `config.js`
2. **Ajouter des fonctionnalités** : Étendez le switch case dans `bot-mongodb.js`
3. **Nouveaux claviers** : Ajoutez des méthodes dans `keyboards.js`
4. **Nouveaux modèles** : Ajoutez des schémas dans `models.js`

## 📊 Base de données

### Collections MongoDB

- **users** : Informations des utilisateurs
- **configs** : Configuration du bot
- **socialnetworks** : Réseaux sociaux
- **messages** : Historique des messages
- **stats** : Statistiques quotidiennes

### Sauvegarde

MongoDB Atlas offre des sauvegardes automatiques. Pour une sauvegarde manuelle :

```bash
mongodump --uri="votre_mongodb_uri"
```

## 🆘 Dépannage

### Le bot ne répond pas
1. Vérifiez que le token est correct
2. Vérifiez que MongoDB est accessible
3. Consultez les logs : `npm run dev`

### Erreur de connexion MongoDB
1. Vérifiez l'URI de connexion
2. Autorisez votre IP dans MongoDB Atlas
3. Vérifiez les credentials

### Les messages ne se suppriment pas
1. Le bot doit être admin du groupe (si utilisé en groupe)
2. Vérifiez le paramètre "Suppression auto" dans les settings

## 🚀 Améliorations futures

- [ ] Support multi-langues
- [ ] Intégration de paiements
- [ ] Analytics avancées
- [ ] Export des données utilisateurs
- [ ] Templates de messages
- [ ] Scheduler pour messages automatiques

## 📝 License

MIT License - Utilisez librement ce bot pour vos projets personnels ou commerciaux.

## 🤝 Support

Pour toute question ou problème :
1. Consultez cette documentation
2. Vérifiez les logs du bot
3. Créez une issue sur GitHub

---

Créé avec ❤️ pour la communauté Telegram