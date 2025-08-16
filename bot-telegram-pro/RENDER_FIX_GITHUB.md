# 🚨 RÉSOUDRE L'ERREUR DE CONNEXION GITHUB-RENDER

## Erreur actuelle :
```
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```

## SOLUTION 1 : Rendre le Repository Public (Recommandé)

1. **Allez sur GitHub** : https://github.com/juniorrrrr345/Cosa-
2. **Cliquez sur Settings** (⚙️ en haut à droite du repo)
3. **Scrollez tout en bas** jusqu'à "Danger Zone"
4. **Cliquez sur "Change visibility"**
5. **Sélectionnez "Public"**
6. **Confirmez** en tapant le nom du repo
7. **Retournez sur Render** et relancez le déploiement

## SOLUTION 2 : Connecter GitHub à Render (Si vous voulez garder le repo privé)

### Sur Render :
1. **Allez dans Account Settings** : https://dashboard.render.com/settings
2. **Cliquez sur "Connected Accounts"**
3. **Cliquez sur "Connect GitHub"**
4. **Autorisez Render** à accéder à vos repos
5. **Sélectionnez votre repository** "Cosa-"

### Puis créez un nouveau service :
1. **New > Web Service**
2. **Connect a repository**
3. **Choisissez** "juniorrrrr345/Cosa-"
4. **Configuration** :
   - Name: `cosa-bot` (ou ce que vous voulez)
   - Root Directory: `bot-telegram-pro`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Variables d'environnement** (cliquez sur "Advanced") :
   ```
   BOT_TOKEN=8420727291:AAFDYTSccQdfr7ydbUwGW8o6oIue9Y2QC-c
   ADMIN_ID=7670522278
   MONGODB_URI=mongodb+srv://cosa92700:nGURLgzXTzWpKyvL@cosabip.j9zt3ig.mongodb.net/telegram_bot?retryWrites=true&w=majority&appName=cosabip
   PORT=3000
   NODE_ENV=production
   WEBHOOK_URL=https://[votre-app].onrender.com
   ```

6. **Create Web Service**

## SOLUTION 3 : Utiliser un Deploy Hook (Alternative)

Si les solutions ci-dessus ne fonctionnent pas :

1. **Sur Render**, dans votre service
2. **Settings > Deploy Hook**
3. **Copiez l'URL du webhook**
4. **Sur GitHub** : Settings > Webhooks > Add webhook
5. **Collez l'URL** dans Payload URL
6. **Content type** : application/json
7. **Add webhook**

## ✅ Après avoir appliqué une solution :

Le déploiement devrait redémarrer automatiquement et fonctionner !

---

**Note importante** : La solution 1 (rendre le repo public) est la plus simple et rapide si vous n'avez pas de données sensibles dans le code (vos tokens sont déjà dans les variables d'environnement Render, donc c'est sécurisé).