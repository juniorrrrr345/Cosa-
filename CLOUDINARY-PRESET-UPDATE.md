# 🔧 URGENT - Mettre à jour le preset Cloudinary

## 🎯 **Action requise :**
Votre preset Cloudinary doit être mis à jour pour accepter les fichiers plus volumineux.

## 📋 **Étapes :**

### **1. Aller dans Cloudinary Console**
1. **https://cloudinary.com/console**
2. **Settings** → **Upload**
3. **Trouvez** `bipcosa06_preset`
4. **Cliquez Edit** (icône crayon)

### **2. Modifier les limites**

#### **Paramètres à mettre à jour :**
- **Max file size** : `104857600` (100MB au lieu de 10MB)
- **Max image width** : `3000` (au lieu de 2000)
- **Max image height** : `3000` (au lieu de 2000)
- **Max video length** : `300` secondes (5 minutes)

#### **Vérifiez aussi :**
- ✅ **Signing mode** : Unsigned
- ✅ **Allowed formats** : `jpg,jpeg,png,gif,webp,mp4,mov,avi`
- ✅ **Folder** : `bipcosa06`

### **3. Save et test**
1. **Sauvegardez** les modifications
2. **Testez** l'upload d'une vidéo iPhone
3. **Ça devrait fonctionner !**

---

## 🧪 **Test après mise à jour**

### **Vidéos à tester :**
- 📱 **Vidéo iPhone** standard (10-30MB)
- 🎥 **Vidéo courte 4K** (50-80MB)
- ⚠️ **Évitez** > 100MB pour ce test

### **Messages attendus :**
```
✅ Upload Cloudinary réussi: bipcosa06/videos/abc123
✅ Vidéo uploadée vers Cloudinary !
```

---

## 🚨 **Si vous ne trouvez pas ces options**

Il se peut que l'interface Cloudinary soit différente. Cherchez :
- **File size limit** ou **Max file size**
- **Resource limits** ou **Upload limits**
- **Video settings** ou **Media settings**

**Ou contactez-moi avec une capture d'écran de votre preset et je vous guide !**