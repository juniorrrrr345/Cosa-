# 🚨 FIX - Upload preset must be whitelisted

## ❌ **Erreur exacte :**
```
Upload preset must be whitelisted for unsigned uploads
```

## 🎯 **Cause :**
Le preset `bipcosa06_preset` existe mais est en mode **"Signed"** au lieu de **"Unsigned"**

## ✅ **Solution rapide :**

### **Option 1 : Modifier le preset existant**
1. **Cloudinary Console** : https://cloudinary.com/console
2. **Settings** → **Upload**
3. **Trouvez** `bipcosa06_preset`
4. **Cliquez Edit** (icône crayon)
5. **Signing Mode** : Changer vers **"Unsigned"**
6. **Save**

### **Option 2 : Créer un nouveau preset unsigned**

#### **Configuration complète :**
- **Preset name** : `bipcosa06_unsigned`
- **Signing mode** : **Unsigned** ⚠️
- **Use filename** : ✅
- **Unique filename** : ✅
- **Folder** : `bipcosa06`
- **Allowed formats** : `jpg,jpeg,png,gif,webp,mp4,mov,avi`
- **Max file size** : `10000000` (10MB)

#### **Transformations incoming :**
```
w_1200,h_1200,c_limit,q_auto:good,f_auto
```

#### **Variables Vercel à mettre à jour :**
```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bipcosa06_unsigned
```

---

## 🧪 **Test immédiat après correction**

### **1. Vérification preset**
Dans Cloudinary console :
- ✅ Mode = "Unsigned"
- ✅ Nom = `bipcosa06_preset` ou `bipcosa06_unsigned`

### **2. Test upload**
1. **Panel admin** → Ajouter produit
2. **Upload image** depuis iPhone/PC
3. **Attendez** : "✅ Upload Cloudinary réussi"

### **3. Messages de succès attendus :**
```
🔄 Upload vers Cloudinary...
✅ Upload Cloudinary réussi: bipcosa06/abc123
✅ Image uploadée vers Cloudinary !
```

---

## 🔍 **Vérification du preset dans console**

### **Dans Settings → Upload, votre preset doit avoir :**
- **Name** : `bipcosa06_preset`
- **Mode** : **Unsigned** (pas Signed !)
- **Status** : Active

### **Screenshot checklist :**
![Preset Configuration](exemple)
- [x] Unsigned mode selected
- [x] Folder: bipcosa06
- [x] Formats: jpg,jpeg,png,gif,webp,mp4,mov

---

## 🚨 **Si ça ne marche toujours pas**

### **Tentez avec un nouveau preset :**
1. **Supprimez** l'ancien preset
2. **Créez** `bipcosa06_new` en mode Unsigned
3. **Mettez à jour** les variables Vercel :
```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bipcosa06_new
```
4. **Redéployez**

### **Variables d'environnement complètes :**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvsy5mfhu
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bipcosa06_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=485987511825452
CLOUDINARY_API_SECRET=TCJrWZuCJ6r_BLhO4i6afg3F6JU
```

⚠️ **N'oubliez pas de redéployer après changement des variables !**