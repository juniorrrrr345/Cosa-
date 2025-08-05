# 🚀 Installation Rapide - Bot Telegram en 5 minutes

Guide pour installer et lancer votre bot Telegram en moins de 5 minutes.

## ⏱️ Étapes rapides

### 1️⃣ Créer le bot Telegram (1 minute)

1. Ouvrez Telegram et cherchez **@BotFather**
2. Envoyez `/newbot`
3. Choisissez un nom pour votre bot (ex: "Mon Super Bot")
4. Choisissez un username (doit finir par 'bot', ex: `monsuperbot_bot`)
5. **Copiez le token** qui ressemble à : `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2️⃣ Obtenir votre ID Telegram (30 secondes)

1. Cherchez **@userinfobot** sur Telegram
2. Envoyez n'importe quel message
3. **Copiez votre ID** (un nombre comme `123456789`)

### 3️⃣ Créer MongoDB gratuit (2 minutes)

1. Allez sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquez "Try Free" et créez un compte
3. Créez un cluster gratuit (M0 Sandbox)
4. Créez un utilisateur :
   - Username : `botuser`
   - Password : générez-en un fort
5. Dans "Network Access", cliquez "Add IP Address" → "Allow Access from Anywhere"
6. Dans "Database", cliquez "Connect" → "Connect your application"
7. **Copiez l'URI** et remplacez `<password>` par votre mot de passe

### 4️⃣ Installer le bot (1 minute)

```bash
# Si vous n'avez pas encore cloné le repo
git clone https://github.com/juniorrrrr345/LANATION.git
cd LANATION/bot-telegram-pro

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

### 5️⃣ Configuration (30 secondes)

Ouvrez le fichier `.env` et remplacez avec vos valeurs :

```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_ID=123456789
MONGODB_URI=mongodb+srv://botuser:motdepasse@cluster.mongodb.net/telegram_bot?retryWrites=true&w=majority
```

### 6️⃣ Lancer le bot ! 🎉

```bash
npm start
```

## ✅ Vérification

1. Allez sur Telegram
2. Cherchez votre bot par son username
3. Envoyez `/start` - vous devriez voir le menu
4. Envoyez `/admin` - vous devriez voir le panel admin

## 🎯 Prochaines étapes

Maintenant que votre bot fonctionne :

1. **Personnalisez le message d'accueil** :
   - `/admin` → "📝 Message d'accueil"
   - Utilisez `{firstname}` pour le prénom

2. **Ajoutez une photo** :
   - `/admin` → "🖼 Photo d'accueil"
   - Envoyez une belle image

3. **Configurez vos réseaux sociaux** :
   - `/admin` → "🔗 Réseaux sociaux"
   - Format : `Instagram | https://instagram.com/vous | 📸`

## ⚡ Commandes rapides

```bash
# Développement avec rechargement auto
npm run dev

# Production
npm start

# Arrêter le bot
Ctrl + C
```

## 🆘 Problèmes fréquents

**"Token invalide"**
→ Vérifiez que vous avez bien copié tout le token

**"Cannot connect to MongoDB"**
→ Vérifiez l'URI et que vous avez autorisé toutes les IPs

**"ADMIN_ID must be a number"**
→ Utilisez seulement l'ID numérique, pas le @username

## 📱 Test rapide

Envoyez ces commandes à votre bot :
- `/start` - Menu principal
- `/admin` - Panel admin (admin uniquement)

---

🎉 **Félicitations !** Votre bot est maintenant opérationnel !