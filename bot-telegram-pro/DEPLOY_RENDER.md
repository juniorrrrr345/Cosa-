# 🚀 Guide de Déploiement sur Render

Guide complet pour déployer votre bot Telegram sur Render (gratuit).

## 📋 Prérequis

- ✅ Bot configuré et testé localement
- ✅ Compte GitHub avec le code
- ✅ Variables d'environnement prêtes

## 🔧 Étapes de déploiement

### 1. Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Inscrivez-vous avec GitHub (recommandé)
3. Confirmez votre email

### 2. Créer un nouveau Web Service

1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository GitHub
3. Sélectionnez `LANATION`
4. Configurez :

```
Name: bipcosa06-bot
Region: Frankfurt (EU Central)
Branch: main
Root Directory: bot-telegram-pro
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 3. Configurer les variables d'environnement

Dans l'onglet **Environment**, ajoutez :

```
BOT_TOKEN = 8420727291:AAFDYTSccQdfr7ydbUwGW8o6oIue9Y2QC-c
ADMIN_ID = 7670522278
MONGODB_URI = mongodb+srv://cosa92700:nGURLgzXTzWpKyvL@cosabip.j9zt3ig.mongodb.net/telegram_bot?retryWrites=true&w=majority&appName=cosabip
NODE_ENV = production
PORT = 3000
```

⚠️ **Important** : Après le premier déploiement, ajoutez :
```
WEBHOOK_URL = https://bipcosa06-bot.onrender.com
```

### 4. Déployer

1. Cliquez sur **"Create Web Service"**
2. Attendez le build (5-10 minutes)
3. Vérifiez les logs pour confirmer

### 5. Configuration du Webhook

Une fois déployé :

1. Copiez l'URL de votre service : `https://bipcosa06-bot.onrender.com`
2. Ajoutez la variable `WEBHOOK_URL` avec cette URL
3. Le bot redémarrera automatiquement

## ✅ Vérification

1. Allez sur Telegram
2. Cherchez `@BipCosa06bot_Bot`
3. Envoyez `/start`
4. Vérifiez que le bot répond

## 🔍 Monitoring

### Logs en temps réel

Dans Render Dashboard :
- Onglet **"Logs"** pour voir l'activité
- Filtrez par type : Info, Warning, Error

### Métriques

- **Uptime** : Devrait être proche de 100%
- **Response time** : < 500ms normal
- **Memory** : < 256MB pour le plan gratuit

## ⚠️ Limitations du plan gratuit

- ✅ 750 heures/mois (largement suffisant)
- ✅ Redémarrage automatique
- ✅ HTTPS inclus
- ⚠️ Peut s'endormir après 15min d'inactivité
- ⚠️ 512MB RAM max

## 🔧 Maintenance

### Redémarrer le bot

1. Dashboard Render
2. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

### Mettre à jour le code

1. Faites vos modifications en local
2. Committez et pushez sur GitHub
3. Render détecte et redéploie automatiquement

### Voir les statistiques MongoDB

1. Connectez-vous à MongoDB Atlas
2. Allez dans **"Clusters"** → **"Collections"**
3. Explorez les données

## 🆘 Dépannage

### "Application failed to respond"

1. Vérifiez les logs pour des erreurs
2. Confirmez que toutes les variables sont définies
3. Vérifiez la connexion MongoDB

### Bot ne répond pas

1. Vérifiez que `NODE_ENV=production`
2. Confirmez le `WEBHOOK_URL`
3. Testez avec `/start` et `/admin`

### Erreurs MongoDB

1. Vérifiez l'URI de connexion
2. Confirmez l'accès réseau (0.0.0.0/0)
3. Vérifiez les credentials

## 📱 URLs importantes

- **Bot Telegram** : https://t.me/BipCosa06bot_Bot
- **Dashboard Render** : https://dashboard.render.com
- **MongoDB Atlas** : https://cloud.mongodb.com
- **Webhook** : https://bipcosa06-bot.onrender.com

## 🎯 Prochaines étapes

1. Configurez le message d'accueil via `/admin`
2. Ajoutez vos réseaux sociaux
3. Personnalisez la photo
4. Activez les fonctionnalités souhaitées

---

💡 **Astuce** : Gardez un œil sur les logs pendant les premières 24h pour vous assurer que tout fonctionne correctement !