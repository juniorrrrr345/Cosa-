# 📁 Limites de fichiers BIPCOSA06 - Mise à jour

## 📊 **Nouvelles limites (mises à jour) :**

### 📷 **Images :**
- **Taille maximum** : **20 MB** ⬆️ (anciennement 10MB)
- **Formats acceptés** : JPG, JPEG, PNG, WebP, GIF
- **Recommandé** : JPG ou WebP pour la qualité/taille optimale

### 🎥 **Vidéos :**
- **Taille maximum** : **100 MB** ⬆️ (anciennement 10MB)
- **Formats acceptés** : MP4, MOV, AVI
- **Recommandé** : MP4 pour la compatibilité maximale

---

## 📱 **Optimisations pour iPhone/Mobile**

### **Vidéos iPhone :**
- **Qualité standard** : ~10-30 MB (1-2 minutes)
- **4K/HDR** : 50-100 MB (quelques secondes)
- **Conseil** : Utilisez la qualité "HD" plutôt que "4K" pour l'upload

### **Photos iPhone :**
- **Photos normales** : 2-5 MB
- **HEIC/Raw** : 10-15 MB
- **Conseil** : L'iPhone convertit automatiquement en JPG lors de l'upload web

---

## 🚀 **Performance et optimisation**

### **Automatiquement appliqué par Cloudinary :**
- ✅ **Compression** intelligente
- ✅ **Format optimal** selon le navigateur
- ✅ **Qualité** automatique (auto:good)
- ✅ **Redimensionnement** pour le web

### **Ce que vous voyez :**
- **Upload** : Taille originale du fichier
- **Delivery** : Version optimisée (plus petite)
- **Stockage** : Cloudinary gère l'optimisation

---

## 📋 **Messages d'erreur mis à jour**

### **Images trop grandes :**
```
❌ Image trop volumineuse. Taille max: 20MB (actuelle: 25MB)
```

### **Vidéos trop grandes :**
```
❌ Vidéo trop volumineuse. Taille max: 100MB (actuelle: 150MB)
```

### **Types non supportés :**
```
❌ Type de fichier non supporté. Utilisez JPG, PNG, WebP, MP4 ou MOV
```

---

## 💡 **Conseils pour réduire la taille**

### **Pour les vidéos iPhone trop lourdes :**

#### **Option 1 : Réglages iPhone**
1. **Réglages** → **Appareil photo**
2. **Enregistrer une vidéo** → **1080p HD à 30 fps**
3. **Évitez** : 4K ou 60fps pour l'upload web

#### **Option 2 : Apps de compression**
- **iOS** : Video Compressor, Media Converter
- **Android** : Video Compressor Panda, VidCompact

#### **Option 3 : Durée plus courte**
- **Optimal** : 30-60 secondes max
- **Accepte** : Jusqu'à 2-3 minutes
- **Évitez** : Vidéos > 5 minutes

### **Pour les images :**
- **iPhone** : Utilisez "Optimiser stockage iPhone" dans Photos
- **Qualité** : Évitez le mode RAW pour l'upload web
- **Édition** : Exportez en qualité "web" depuis les apps photo

---

## 🔧 **Configuration technique**

### **Limites côté serveur :**
```typescript
const maxSizeImage = 20 * 1024 * 1024; // 20MB
const maxSizeVideo = 100 * 1024 * 1024; // 100MB
```

### **Formats autorisés :**
```typescript
formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'avi']
```

### **Cloudinary preset - Limites recommandées :**
- **Max file size** : `104857600` (100MB)
- **Max video duration** : `300` secondes (5 minutes)
- **Auto optimization** : ✅ Activé

---

## ✅ **Résumé des améliorations**

| Type | Avant | Maintenant | Amélioration |
|------|-------|------------|-------------|
| 📷 Images | 10MB | **20MB** | +100% |
| 🎥 Vidéos | 10MB | **100MB** | +900% |
| 📱 Mobile | Limité | **Optimisé** | iPhone-friendly |
| 💬 Erreurs | Basique | **Détaillées** | Avec taille actuelle |

**Vos uploads iPhone/PC devraient maintenant passer sans problème !** 🎉