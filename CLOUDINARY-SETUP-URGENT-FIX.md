# 🚨 URGENT - Correction Upload Cloudinary BIPCOSA06

## ❌ **Erreur actuelle :**
```
Format parameter is not allowed when using unsigned upload. 
Upload preset must be specified when using unsigned upload
```

## 🔧 **Solution : Créer le bon upload preset**

### **Étape 1 : Aller dans Cloudinary Console**
1. **Connexion** : https://cloudinary.com/console
2. **Settings** → **Upload** 
3. **Cliquer sur "Add upload preset"**

### **Étape 2 : Configuration du preset**

#### **Paramètres de base :**
- **Preset name** : `bipcosa06_preset`
- **Signing mode** : **Unsigned** ⚠️ IMPORTANT
- **Use filename** : ✅ Coché
- **Unique filename** : ✅ Coché

#### **Dossiers et nommage :**
- **Folder** : `bipcosa06` 
- **Use filename as public id** : ✅ Coché

#### **Formats autorisés :**
- **Allowed formats** : `jpg,jpeg,png,gif,webp,mp4,mov,avi`

#### **Taille et qualité :**
- **Max file size** : `10 MB`
- **Max image width** : `2000`
- **Max image height** : `2000`

#### **Transformations automatiques :**
Dans la section "Incoming transformation" :
- **Quality** : `auto:good`
- **Format** : `auto`
- **Max width** : `1200`
- **Crop** : `limit`

### **Étape 3 : Variables d'environnement**

Dans votre **Vercel Dashboard** → **Settings** → **Environment Variables** :

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvsy5mfhu
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bipcosa06_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=485987511825452
CLOUDINARY_API_SECRET=TCJrWZuCJ6r_BLhO4i6afg3F6JU
```

⚠️ **IMPORTANT** : Redéployez après avoir ajouté ces variables !

### **Étape 4 : Test rapide**

1. **Allez sur votre site** : cosa-emj7tnfk7-lucas-projects-34f60a70.vercel.app/panel
2. **Ajouter un produit**
3. **Testez l'upload d'image**
4. **Ça devrait marcher !**

---

## 🔍 **Vérifications supplémentaires**

### **Si ça ne marche toujours pas :**

#### **1. Vérifiez le nom du preset**
Dans Cloudinary console, le nom exact doit être `bipcosa06_preset`

#### **2. Vérifiez le mode**
Le preset DOIT être en mode **"Unsigned"**

#### **3. Vérifiez les variables Vercel**
```bash
# Dans Vercel dashboard
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bipcosa06_preset
```

#### **4. Redéployez**
Après changement des variables, **redéployez** sur Vercel

---

## 📱 **Test avec iPhone/mobile**

1. **Prenez une photo** avec votre iPhone
2. **Allez dans le panel admin**
3. **Ajouter produit** → **Upload IMAGE depuis iPhone/mobile**
4. **Sélectionnez la photo**
5. **L'URL devrait apparaître automatiquement**

---

## 🆘 **Si problème persiste**

### **Message d'erreur à chercher :**
- ✅ `"✅ Upload Cloudinary réussi: abc123"`
- ❌ `"Upload preset must be specified"`
- ❌ `"Format parameter is not allowed"`

### **Logs à vérifier :**
1. **Console du navigateur** (F12)
2. **Vercel Function Logs**
3. **Cloudinary Dashboard** → **Media Library**

---

## 🎯 **Configuration finale qui marche :**

```javascript
// Dans cloudinary.ts
const CLOUDINARY_CONFIG = {
  cloudName: 'dvsy5mfhu',
  uploadPreset: 'bipcosa06_preset', // LE BON NOM
}

// Upload simplifié
formData.append('file', file);
formData.append('upload_preset', 'bipcosa06_preset');
// RIEN D'AUTRE !
```

**Toutes les optimisations (qualité, format, etc.) sont dans le preset, pas dans le code !**