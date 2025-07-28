# 🔧 VARIABLES D'ENVIRONNEMENT COMPLÈTES - BIPCOSA06

## 📋 COPY-PASTE POUR VERCEL DASHBOARD

Allez sur : **https://vercel.com/dashboard → Votre Projet → Settings → Environment Variables**

---

## 🗄️ MONGODB
```
Variable: MONGODB_URI
Value: mongodb+srv://Junior:Lacrim123@cluster0.q4vnfin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
Environment: Production, Preview, Development
```

**🔗 Lien MongoDB Atlas :** https://cloud.mongodb.com/v2/674e9b0f71d46a7aa5b7b9b5#/overview

---

## ☁️ CLOUDINARY - CONFIGURATION SERVEUR

```
Variable: CLOUDINARY_CLOUD_NAME
Value: dvsy5mfhu
Environment: Production, Preview, Development
```

```
Variable: CLOUDINARY_API_KEY
Value: 485987511825452
Environment: Production, Preview, Development
```

```
Variable: CLOUDINARY_API_SECRET
Value: TCJrWZuCJ6r_BLhO4i6afg3F6JU
Environment: Production, Preview, Development
```

**🔗 Lien Cloudinary Console :** https://console.cloudinary.com/console/c-bdfc5f8f0c4e43f3f9b29b37e0f2b8/getting-started

---

## 🌐 CLOUDINARY - CONFIGURATION CLIENT (PUBLIC)

```
Variable: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: dvsy5mfhu
Environment: Production, Preview, Development
```

```
Variable: NEXT_PUBLIC_CLOUDINARY_API_KEY
Value: 485987511825452
Environment: Production, Preview, Development
```

```
Variable: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
Value: bipcosa06_preset
Environment: Production, Preview, Development
```

**🔗 Lien Upload Presets :** https://console.cloudinary.com/console/c-bdfc5f8f0c4e43f3f9b29b37e0f2b8/settings/upload

---

## 🚀 APPLICATION

```
Variable: NEXT_PUBLIC_APP_URL
Value: https://cosa-tau.vercel.app
Environment: Production, Preview, Development
```

**🔗 Lien Vercel Project :** https://vercel.com/your-username/cosa-tau

---

## 🔐 SÉCURITÉ (OPTIONNEL)

```
Variable: NEXTAUTH_SECRET
Value: bipcosa06-super-secret-key-production-2024-secure-jwt-token-encryption
Environment: Production, Preview, Development
```

```
Variable: NEXTAUTH_URL
Value: https://cosa-tau.vercel.app
Environment: Production, Preview, Development
```

```
Variable: NODE_ENV
Value: production
Environment: Production
```

```
Variable: LOG_LEVEL
Value: info
Environment: Production, Preview, Development
```

---

## 🎯 LIENS DIRECTS POUR CONFIGURATION

### 1. Vercel Dashboard
**Variables d'environnement :** https://vercel.com/dashboard/[username]/cosa-tau/settings/environment-variables

### 2. Cloudinary Setup
**Console principale :** https://console.cloudinary.com/  
**Upload Presets :** https://console.cloudinary.com/settings/upload  
**Media Library :** https://console.cloudinary.com/console/media_library

### 3. MongoDB Atlas
**Clusters :** https://cloud.mongodb.com/v2#/clusters  
**Database Access :** https://cloud.mongodb.com/v2#/database/users  
**Network Access :** https://cloud.mongodb.com/v2#/network/access

---

## ⚡ SCRIPT DE CONFIGURATION AUTOMATIQUE

Pour configurer rapidement dans Vercel CLI :

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables (dans le répertoire du projet)
vercel env add MONGODB_URI
# Coller: mongodb+srv://Junior:Lacrim123@cluster0.q4vnfin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

vercel env add CLOUDINARY_CLOUD_NAME
# Coller: dvsy5mfhu

vercel env add CLOUDINARY_API_KEY
# Coller: 485987511825452

vercel env add CLOUDINARY_API_SECRET
# Coller: TCJrWZuCJ6r_BLhO4i6afg3F6JU

vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# Coller: dvsy5mfhu

vercel env add NEXT_PUBLIC_CLOUDINARY_API_KEY
# Coller: 485987511825452

vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
# Coller: bipcosa06_preset

vercel env add NEXT_PUBLIC_APP_URL
# Coller: https://cosa-tau.vercel.app

# Redéployer
vercel --prod
```

---

## 🔍 VÉRIFICATION DES VARIABLES

### Dans les logs Vercel
1. Allez sur https://vercel.com/dashboard/[username]/cosa-tau/functions
2. Vérifiez qu'il n'y a pas d'erreurs de variables manquantes

### Test des connexions
- **MongoDB :** https://cosa-tau.vercel.app/api/init
- **Cloudinary :** Testez l'upload d'image dans le panel admin
- **Variables publiques :** Inspectez `window.process.env` dans la console

---

## 🚨 NOTES IMPORTANTES

### ✅ À faire OBLIGATOIREMENT :
1. **Créer le preset Cloudinary `bipcosa06_preset`**
   - Mode: Unsigned
   - Folder: bipcosa06
   - Lien: https://console.cloudinary.com/settings/upload

2. **Vérifier MongoDB Network Access**
   - Autoriser toutes les IPs (0.0.0.0/0) pour Vercel
   - Lien: https://cloud.mongodb.com/v2#/network/access

3. **Test après déploiement**
   - Upload d'image depuis le panel admin
   - Création/suppression de produit
   - Synchronisation des données

### ❌ À éviter :
- Exposer `CLOUDINARY_API_SECRET` côté client
- Commiter `.env.local` dans Git
- Utiliser `NODE_ENV=development` en production

---

## 📞 Support

Si problème avec :
- **Cloudinary :** https://support.cloudinary.com/
- **MongoDB :** https://www.mongodb.com/support
- **Vercel :** https://vercel.com/support