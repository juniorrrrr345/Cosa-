# 🚀 Guide de Déploiement - BIPCOSA06

## ✅ **Statut : Déployé sur GitHub avec succès !**

### 🔗 **Repository GitHub :**
- **URL** : [https://github.com/juniorrrrr345/Cosa-](https://github.com/juniorrrrr345/Cosa-)
- **Branche principale** : `main`
- **Dernière mise à jour** : MongoDB Atlas configuré

---

## 🌐 **Options de Déploiement**

### **1. GitHub Pages (Automatique)**
✅ **Configuré** - Se déploie automatiquement à chaque push sur `main`
- **URL** : https://juniorrrrr345.github.io/Cosa-
- **Workflow** : `.github/workflows/nextjs.yml`

### **2. Vercel (Recommandé pour MongoDB)**
🔥 **Optimal pour votre app avec MongoDB**

#### **Étapes :**
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Déployer depuis votre repository
vercel --prod
```

#### **Variables d'environnement Vercel :**
Dans le dashboard Vercel → Settings → Environment Variables :

```env
MONGODB_URI=mongodb+srv://Cosa:cosa06@cluster0.inrso7o.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvsy5mfhu
NEXT_PUBLIC_CLOUDINARY_API_KEY=485987511825452
CLOUDINARY_API_SECRET=TCJrWZuCJ6r_BLhO4i6afg3F6JU
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_upload
NEXT_PUBLIC_SITE_URL=https://votre-app.vercel.app
```

### **3. Netlify**
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter et déployer
netlify login
netlify deploy --prod --dir=out
```

---

## 🔧 **Configuration Post-Déploiement**

### **MongoDB Atlas - Configuration sécurisée**
1. **Accès réseau** : Ajouter `0.0.0.0/0` pour permettre l'accès depuis Vercel/Netlify
2. **Utilisateur** : Vérifier que `Cosa` a les permissions `readWrite`
3. **Base de données** : `bipcosa06` créée automatiquement

### **Cloudinary - Configuration**
✅ **Déjà configuré** avec votre compte existant
- Cloud Name : `dvsy5mfhu`
- Upload preset : `unsigned_upload`

---

## 🔍 **Test de Déploiement**

### **Vérifications à faire :**
```bash
# 1. Tester l'API config
curl https://votre-url.vercel.app/api/config

# 2. Tester l'API products
curl https://votre-url.vercel.app/api/products

# 3. Tester le panel admin
https://votre-url.vercel.app/panel
```

### **Logs de débogage :**
- **Vercel** : Dashboard → Functions → View Logs
- **Netlify** : Dashboard → Functions → Logs

---

## 🛠 **Commandes de Déploiement Rapide**

### **Depuis votre machine locale :**
```bash
# 1. Pousser vers GitHub (automatique)
git add .
git commit -m "Update"
git push origin main

# 2. Déployer sur Vercel (recommandé)
vercel --prod

# 3. Déployer sur Netlify
npm run build
netlify deploy --prod --dir=out
```

---

## 🔒 **Sécurité & Variables Sensibles**

### ⚠️ **Important :**
- ✅ `.env.local` est exclu de Git
- ✅ Variables sensibles dans .env.example sont masquées
- 🔒 MongoDB credentials sécurisés dans MongoDB Atlas

### **Variables à configurer dans votre plateforme :**
1. `MONGODB_URI` - **Obligatoire** pour les fonctionnalités de base
2. `CLOUDINARY_API_SECRET` - Pour l'upload d'images
3. `NEXT_PUBLIC_SITE_URL` - Pour les redirections

---

## 🎯 **Liens Utiles**

- **Repository** : https://github.com/juniorrrrr345/Cosa-
- **MongoDB Atlas** : https://cloud.mongodb.com/
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Cloudinary Dashboard** : https://cloudinary.com/console

---

## 🚨 **En cas de problème**

### **MongoDB non connecté :**
1. Vérifier `MONGODB_URI` dans les variables d'environnement
2. Vérifier l'accès réseau dans MongoDB Atlas
3. Tester la connexion localement

### **Images non uploadées :**
1. Vérifier les variables Cloudinary
2. Tester l'upload preset dans Cloudinary console

### **Build qui échoue :**
1. Vérifier les dépendances dans `package.json`
2. Tester le build localement : `npm run build`