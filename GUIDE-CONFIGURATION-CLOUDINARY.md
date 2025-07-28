# 📸 Guide de Configuration Cloudinary pour BIPCOSA06

## 🚨 IMPORTANT : Configuration requise pour que l'upload fonctionne

### 1. Créer un compte Cloudinary (si pas déjà fait)
- Allez sur https://cloudinary.com
- Créez un compte gratuit

### 2. Récupérer vos identifiants
1. Connectez-vous à https://console.cloudinary.com
2. Sur le Dashboard, notez votre **Cloud name** (ex: `dvsy5mfhu`)

### 3. Créer un Upload Preset (OBLIGATOIRE)
1. Dans Cloudinary Console, allez dans **Settings** → **Upload**
2. Cliquez sur **"Add upload preset"**
3. Configurez le preset :
   - **Preset name** : `bipcosa06_preset`
   - **Signing Mode** : Sélectionnez **"Unsigned"** ⚠️ TRÈS IMPORTANT
   - **Folder** : `bipcosa06`
   - **Allowed formats** : jpg, jpeg, png, webp, mp4, mov
4. Cliquez sur **"Save"**

### 4. Vérifier le fichier .env.local
Assurez-vous que votre fichier `.env.local` contient :
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bipcosa06_preset
```

### 5. Redémarrer l'application
```bash
npm run dev
```

## 🔍 Débogage

### Si l'upload ne fonctionne pas :

1. **Vérifiez la console du navigateur** (F12)
   - Cherchez les messages d'erreur en rouge
   - Les logs commencent par 🚀, 📤, ✅ ou ❌

2. **Erreurs courantes :**
   - `Invalid upload preset` : Le preset n'existe pas ou n'est pas en mode "Unsigned"
   - `cloud_name incorrect` : Vérifiez votre cloud name dans le Dashboard Cloudinary
   - `File too large` : Limite 20MB pour images, 100MB pour vidéos

3. **Testez avec une petite image d'abord** (< 1MB)

## ✅ Comment vérifier que ça fonctionne

1. Dans le panel admin, cliquez sur "Modifier" un produit
2. Cliquez sur "📷 Upload IMAGE depuis iPhone/mobile"
3. Sélectionnez une image
4. Attendez le message de succès avec l'URL
5. Sauvegardez le produit
6. Vérifiez que l'image s'affiche dans la boutique

## 📱 Formats supportés
- **Images** : JPG, JPEG, PNG, WebP (max 20MB)
- **Vidéos** : MP4, MOV (max 100MB)

## 🆘 Support
Si ça ne fonctionne toujours pas :
1. Vérifiez que le preset est bien en mode "Unsigned"
2. Essayez de créer un nouveau preset
3. Vérifiez les logs dans la console du navigateur