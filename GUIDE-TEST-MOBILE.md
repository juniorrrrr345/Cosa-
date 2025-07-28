# 📱 Guide de Test Mobile - Upload Photos/Vidéos

## 🚀 Améliorations apportées

### 1. **Boutons optimisés pour mobile**
- Boutons plus grands et visibles
- Design moderne avec gradient
- Feedback visuel au toucher
- Largeur 100% sur mobile

### 2. **Compatibilité multi-appareils**
- ✅ iPhone (iOS Safari)
- ✅ Android (Chrome, Firefox)
- ✅ iPad/Tablettes
- ✅ PC/Mac (tous navigateurs)

### 3. **Formats supportés**
**Images:**
- JPG/JPEG
- PNG
- WebP
- HEIC (iPhone)

**Vidéos:**
- MP4
- MOV (iPhone)
- AVI
- WebM
- MKV

### 4. **Limites de taille**
- Images: Max 10MB
- Vidéos: Max 100MB

### 5. **Optimisations automatiques**
- Compression intelligente
- Format adaptatif (f_auto)
- Qualité optimisée (q_auto)
- Aperçu immédiat après upload

## 📋 Comment tester

### Sur iPhone:
1. Ouvrez le panel admin sur Safari
2. Allez dans "Produits"
3. Cliquez sur "📷 Choisir une image"
4. Choisissez:
   - "Photothèque" pour galerie
   - "Prendre une photo" pour caméra
5. L'upload commence automatiquement
6. Attendez la confirmation "✅ Image uploadée"
7. Vérifiez l'aperçu
8. Cliquez "Sauvegarder"

### Sur Android:
1. Ouvrez le panel admin sur Chrome
2. Même processus que iPhone
3. Options: "Galerie" ou "Caméra"

## 🔍 Vérification

### Dans le panel admin:
- L'aperçu s'affiche après upload
- L'URL Cloudinary est visible
- Message de succès apparaît

### Sur la boutique:
- Après sauvegarde, l'image/vidéo apparaît
- La vidéo est lisible
- L'image est optimisée

## ⚠️ Problèmes possibles

### Si l'upload échoue:
1. Vérifiez la taille du fichier
2. Vérifiez votre connexion internet
3. Essayez un format différent
4. Regardez la console (Settings > Safari > Advanced > Web Inspector)

### Si l'image n'apparaît pas:
1. Avez-vous cliqué "Sauvegarder" ?
2. Rafraîchissez la page
3. Vérifiez dans MongoDB avec le script `check-product-updates.js`

## 🎯 Test complet

1. **Upload image depuis galerie**
2. **Upload image depuis caméra**
3. **Upload vidéo depuis galerie**
4. **Upload vidéo depuis caméra**
5. **Modifier un produit existant**
6. **Vérifier sur la boutique**

## 💡 Conseils

- Utilisez le WiFi pour les vidéos
- Photos en mode portrait fonctionnent bien
- Les vidéos courtes (<30s) sont idéales
- L'aperçu confirme le succès