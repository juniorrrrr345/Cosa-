# 🔧 VARIABLES D'ENVIRONNEMENT BIPCOSA06

## Variables à ajouter dans Vercel Dashboard

Allez dans **Vercel Dashboard → Votre Projet → Settings → Environment Variables** et ajoutez :

### 🗄️ Base de données MongoDB
```
MONGODB_URI = mongodb+srv://Junior:Lacrim123@cluster0.q4vnfin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### ☁️ Cloudinary (Serveur)
```
CLOUDINARY_CLOUD_NAME = dvsy5mfhu
CLOUDINARY_API_KEY = 485987511825452
CLOUDINARY_API_SECRET = TCJrWZuCJ6r_BLhO4i6afg3F6JU
```

### 🌐 Cloudinary (Client)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dvsy5mfhu
NEXT_PUBLIC_CLOUDINARY_API_KEY = 485987511825452
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = bipcosa06_preset
```

### 🚀 Application
```
NEXT_PUBLIC_APP_URL = https://cosa-tau.vercel.app
```

### 🔐 Sécurité (Optionnel)
```
NEXTAUTH_SECRET = votre-cle-secrete-super-longue-et-complexe-ici
NEXTAUTH_URL = https://cosa-tau.vercel.app
NODE_ENV = production
LOG_LEVEL = info
```

---

## ⚠️ Configuration Cloudinary requise

### 1. Créer le preset d'upload
1. Allez sur [Cloudinary Console](https://console.cloudinary.com)
2. **Settings → Upload**
3. Cliquez **Add upload preset**
4. **Preset name:** `bipcosa06_preset`
5. **Signing Mode:** `Unsigned`
6. **Folder:** `bipcosa06`
7. **Sauvegardez**

### 2. Vérifications
- ✅ Le preset `bipcosa06_preset` existe
- ✅ Il est en mode **Unsigned** 
- ✅ Le dossier est `bipcosa06`

---

## 🔍 Variables actuellement utilisées dans le code

| Variable | Fichier | Usage |
|----------|---------|-------|
| `MONGODB_URI` | `/src/lib/mongodb.ts` | Connexion base de données |
| `CLOUDINARY_CLOUD_NAME` | `/src/lib/cloudinary.ts` | Config serveur Cloudinary |
| `CLOUDINARY_API_KEY` | `/src/lib/cloudinary.ts` | Clé API serveur |
| `CLOUDINARY_API_SECRET` | `/src/lib/cloudinary.ts` | Secret API serveur |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `/src/config/cloudinary.ts` | Config client |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | `/src/config/cloudinary.ts` | Clé API client |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `/src/config/cloudinary.ts` | Preset uploads |

---

## 🚨 Sécurité 

- ❌ **NE JAMAIS** commiter le fichier `.env.local`
- ✅ Toujours utiliser les variables d'environnement en production
- ✅ Régénérer `NEXTAUTH_SECRET` avec une vraie clé aléatoire
- ✅ Vérifier que `.env.local` est dans `.gitignore`

---

## ✅ Test des variables

Après déploiement, vérifiez :
1. Les uploads d'images fonctionnent
2. La base de données se connecte
3. Aucune erreur dans les logs Vercel
4. Les produits se sauvegardent correctement