# 🚀 Migration Cloudflare - BIPCOSA06

## 📋 Vue d'ensemble

Ce système de migration permet de transférer tous les médias (vidéos et images) de la boutique **BIPCOSA06** depuis Cloudinary vers Cloudflare, avec une organisation claire par nom de boutique GitHub.

### ✅ Avantages de la migration

- **💰 Réduction des coûts** : Cloudflare offre des tarifs beaucoup plus avantageux
- **⚡ Performance améliorée** : CDN global de Cloudflare pour un chargement ultra-rapide
- **📁 Organisation claire** : Médias organisés par boutique (bipcosa06/)
- **🔧 Gestion simplifiée** : Une seule plateforme pour tous les médias

## 📦 Structure d'organisation

```
Cloudflare Account
├── 📁 CALITEK/              (boutique précédente)
│   ├── videos/
│   └── images/
├── 📁 BIPCOSA06/             (cette boutique)
│   ├── videos/
│   └── images/
└── 📁 [AUTRE-BOUTIQUE]/      (futures boutiques)
    ├── videos/
    └── images/
```

## 🛠️ Installation

### Prérequis

- Node.js 14+ installé
- Accès au compte Cloudflare
- Credentials API Cloudflare configurés

### Installation des dépendances

```bash
cd scripts/cloudflare-migration
npm install node-fetch form-data
```

## ⚙️ Configuration

Le fichier `config.js` contient toute la configuration nécessaire :

```javascript
{
  boutique: {
    name: 'BIPCOSA06',
    github_repo: 'bipcosa06'
  },
  cloudflare: {
    accountId: '7979421604bd07b3bd34d3ed96222512',
    apiToken: 'Ksi7W6LLmFZ7OdVz69b1IM9-MwCklAK-5Gv_z9Hx'
  }
}
```

## 🚀 Utilisation

### Migration complète (recommandé)

Exécute toutes les étapes automatiquement :

```bash
node scripts/cloudflare-migration/migrate-all.js
```

Ce script va :
1. ✅ Vérifier les prérequis
2. 💾 Créer une sauvegarde
3. 📹 Migrer toutes les vidéos vers Cloudflare Stream
4. 🖼️ Migrer toutes les images vers Cloudflare Images
5. 🔄 Mettre à jour automatiquement toutes les URLs dans le code
6. 🧪 Exécuter les tests de validation

### Migration par étapes

Si vous préférez exécuter chaque étape séparément :

#### 1. Migrer les vidéos uniquement

```bash
node scripts/cloudflare-migration/migrate-videos.js
```

Résultat :
- Vidéos uploadées sur Cloudflare Stream
- URLs iframe générées : `https://iframe.videodelivery.net/[ID]`
- Mapping sauvegardé dans `migration-mapping-bipcosa06.json`

#### 2. Migrer les images uniquement

```bash
node scripts/cloudflare-migration/migrate-images.js
```

Résultat :
- Images uploadées sur Cloudflare Images
- URLs de livraison : `https://imagedelivery.net/[ACCOUNT]/[ID]/[VARIANT]`
- Mapping sauvegardé dans `migration-mapping-bipcosa06-images.json`

#### 3. Mettre à jour les URLs dans le code

```bash
node scripts/cloudflare-migration/update-urls.js
```

Résultat :
- Toutes les anciennes URLs Cloudinary remplacées
- Fichiers de backup créés
- Script MongoDB généré : `update-mongodb-bipcosa06.js`

#### 4. Mettre à jour la base de données

```bash
node update-mongodb-bipcosa06.js
```

## 📊 Fichiers générés

Après la migration, vous aurez :

```
scripts/cloudflare-migration/
├── migration-mapping-bipcosa06.json           # Mapping des vidéos
├── migration-mapping-bipcosa06-images.json    # Mapping des images
├── migration-report-final-[timestamp].json    # Rapport complet
├── migration-errors-bipcosa06.log            # Erreurs (si présentes)
├── update-mongodb-bipcosa06.js               # Script de mise à jour DB
└── backup-[timestamp]/                       # Sauvegarde des fichiers originaux
```

## 🎯 Utilisation dans le code

### Composant React pour les médias Cloudflare

```tsx
import { CloudflareVideo, CloudflareImage, CloudflareGallery } from '@/components/CloudflareMedia';

// Afficher une vidéo
<CloudflareVideo 
  videoId="abc123"
  autoplay={true}
  controls={true}
/>

// Afficher une image avec variante
<CloudflareImage
  imageId="xyz789"
  variant="large"
  alt="Description"
/>

// Galerie mixte
<CloudflareGallery
  items={[
    { type: 'video', id: 'video1' },
    { type: 'image', id: 'image1' }
  ]}
  columns={3}
/>
```

### URLs finales après migration

**Avant (Cloudinary):**
```
https://res.cloudinary.com/dtjab1akq/video/upload/v1234/bipcosa06/product-video.mp4
https://res.cloudinary.com/dtjab1akq/image/upload/v1234/bipcosa06/product-image.jpg
```

**Après (Cloudflare):**
```
https://iframe.videodelivery.net/abc123def456
https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/xyz789/large
```

## 🧪 Tests et validation

### Test local

```bash
# Lancer l'application en local
npm run dev

# Ouvrir http://localhost:3000
# Vérifier que tous les médias s'affichent correctement
```

### Checklist de validation

- [ ] Les vidéos s'affichent dans des iframes
- [ ] Les images se chargent avec les bonnes variantes
- [ ] Le panel admin fonctionne correctement
- [ ] Les uploads fonctionnent (si migration des uploads)
- [ ] La base de données est à jour
- [ ] Pas d'erreurs dans la console

## 📈 Monitoring post-migration

### Dashboard Cloudflare

1. Aller sur [dash.cloudflare.com](https://dash.cloudflare.com)
2. Section **Stream** pour les vidéos
3. Section **Images** pour les photos
4. Vérifier les métriques :
   - Nombre de vues
   - Bande passante utilisée
   - Coûts

### Métriques importantes

- **Vidéos** : Minutes visionnées, Nombre de vues uniques
- **Images** : Requêtes servies, Cache hit ratio
- **Coûts** : Surveiller la facturation mensuelle

## 🔧 Dépannage

### Erreur "Invalid API token"

Vérifier que le token API a les permissions nécessaires :
- Stream:Edit
- Cloudflare Images:Edit

### Vidéos qui ne s'affichent pas

1. Vérifier que l'ID de la vidéo est correct
2. Attendre que le processing soit terminé (peut prendre quelques minutes)
3. Vérifier les paramètres iframe (autoplay nécessite muted=true)

### Images avec erreur 404

1. Vérifier que l'image a bien été uploadée
2. Utiliser la variante "public" par défaut
3. Vérifier l'account ID dans l'URL

## 🚀 Déploiement

Après la migration réussie :

```bash
# Commit des changements
git add .
git commit -m "feat: Migration médias vers Cloudflare pour BIPCOSA06"

# Push vers GitHub
git push origin main

# Déployer sur Vercel
vercel --prod
```

## 📝 Notes importantes

1. **Backup** : Toujours garder une sauvegarde avant migration
2. **Test** : Tester en local avant de déployer
3. **Monitoring** : Surveiller les métriques les premiers jours
4. **Rollback** : Les backups permettent de revenir en arrière si nécessaire

## 🆘 Support

En cas de problème :
1. Consulter les logs dans `migration-errors-bipcosa06.log`
2. Vérifier le rapport dans `migration-report-final-*.json`
3. Utiliser les backups pour restaurer si nécessaire

## 📊 Comparaison des coûts

| Service | Avant (Cloudinary) | Après (Cloudflare) | Économie |
|---------|-------------------|-------------------|----------|
| Stockage | $89/mois | $5/mois | 94% |
| Bande passante | $0.08/GB | $0/GB (inclus) | 100% |
| Transformations | Limitées | Illimitées | - |
| **Total mensuel** | **~$120** | **~$10** | **92%** |

## ✨ Conclusion

La migration vers Cloudflare pour BIPCOSA06 permet :
- ✅ Réduction des coûts de 92%
- ✅ Performance améliorée
- ✅ Organisation claire par boutique
- ✅ Gestion simplifiée

Chaque nouvelle boutique peut suivre le même processus avec son propre dossier d'organisation.