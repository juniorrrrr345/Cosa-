# 🔐 Variables d'Environnement pour Render

Copiez-collez ces variables dans Render lors de la création du Web Service.

## Variables à ajouter dans Render

```
BOT_TOKEN=8420727291:AAFDYTSccQdfr7ydbUwGW8o6oIue9Y2QC-c
```

```
ADMIN_ID=7670522278
```

```
MONGODB_URI=mongodb+srv://cosa92700:nGURLgzXTzWpKyvL@cosabip.j9zt3ig.mongodb.net/telegram_bot?retryWrites=true&w=majority&appName=cosabip
```

```
NODE_ENV=production
```

```
PORT=3000
```

## Variable à ajouter APRÈS le premier déploiement

Une fois que Render vous donne l'URL de votre service (format: `https://votre-app.onrender.com`), ajoutez :

```
WEBHOOK_URL=https://votre-app.onrender.com
```

## Configuration Render

### Build & Deploy Settings

- **Root Directory**: `bot-telegram-pro`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Environment

- **Node Version**: Laisser par défaut (ou 18.x)
- **Instance Type**: Free

## Étapes complètes

1. **Sur Render.com** :
   - New → Web Service
   - Connect GitHub repository
   - Sélectionnez `LANATION`

2. **Configuration** :
   - Name: `bipcosa06-bot`
   - Region: Frankfurt (EU)
   - Branch: `main`
   - Root Directory: `bot-telegram-pro`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Variables d'environnement** :
   - Cliquez sur "Environment"
   - Ajoutez chaque variable ci-dessus (copier-coller)

4. **Créer le service** :
   - Create Web Service
   - Attendez le déploiement

5. **Finaliser** :
   - Copiez l'URL du service
   - Ajoutez `WEBHOOK_URL` avec cette URL
   - Le bot redémarrera automatiquement

## Test

Bot Telegram : [@BipCosa06bot_Bot](https://t.me/BipCosa06bot_Bot)

- `/start` - Menu principal
- `/admin` - Panel administration (vous uniquement)

---

💡 **Important** : Gardez ces variables en sécurité. Ne les partagez jamais publiquement !