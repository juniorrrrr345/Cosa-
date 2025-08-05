# ⚠️ IMPORTANT - Configuration Render

## Problème résolu

Le bot avait un problème de port qui est maintenant corrigé.

## Variables d'environnement OBLIGATOIRES

Assurez-vous d'avoir TOUTES ces variables dans Render :

```
BOT_TOKEN=8420727291:AAFDYTSccQdfr7ydbUwGW8o6oIue9Y2QC-c
ADMIN_ID=7670522278
MONGODB_URI=mongodb+srv://cosa92700:nGURLgzXTzWpKyvL@cosabip.j9zt3ig.mongodb.net/telegram_bot?retryWrites=true&w=majority&appName=cosabip
NODE_ENV=production
PORT=3000
```

## APRÈS le déploiement

1. Copiez l'URL de votre service Render : `https://cosa-29zq.onrender.com`
2. Ajoutez cette variable :
```
WEBHOOK_URL=https://cosa-29zq.onrender.com
```
3. Le bot redémarrera automatiquement

## Vérification

- Les logs devraient afficher :
  - ✅ Connecté à MongoDB
  - 🚀 Serveur démarré sur le port 3000
  - 🤖 Bot est en ligne!
  - 📊 Mode: Production
  - 🔗 Webhook: Activé

## Si erreur de port

Le problème est maintenant corrigé, mais si vous voyez encore "port already in use", vérifiez que :
- Vous n'avez qu'UN SEUL service qui utilise ce code
- La variable PORT est bien définie à 3000

## Test du bot

Une fois déployé : [@BipCosa06bot_Bot](https://t.me/BipCosa06bot_Bot)