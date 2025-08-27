#!/usr/bin/env node

/**
 * Script d'intégration complète BIPCOSA06
 * Utilise les vidéos existantes sur Cloudflare + upload de nouvelles images
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');

const config = {
  cloudflare: {
    accountId: '7979421604bd07b3bd34d3ed96222512',
    apiToken: 'Ksi7W6LLmFZ7OdVz69b1IM9-MwCklAK-5Gv_z9Hx', // Token original pour Stream
    imagesToken: '61mW7CZfq0K6OdcYN9YIC4laRaZNLZAL1Lm4gFhh' // Token pour Images
  },
  boutique: 'BIPCOSA06'
};

console.log('\n' + '='.repeat(70));
console.log('🎯 INTÉGRATION COMPLÈTE BIPCOSA06');
console.log('='.repeat(70) + '\n');

// Étape 1: Utiliser les vidéos existantes sur Cloudflare
async function useExistingVideos() {
  console.log('📹 UTILISATION DES VIDÉOS EXISTANTES\n');
  
  try {
    // Charger le mapping des vidéos déjà créé
    const videoMapping = await fs.readFile('bipcosa06-video-mapping.json', 'utf-8')
      .then(JSON.parse)
      .catch(() => null);
    
    if (videoMapping && videoMapping.videos) {
      const videoCount = Object.keys(videoMapping.videos).length;
      console.log(`✅ ${videoCount} vidéos disponibles pour BIPCOSA06:`);
      
      // Afficher quelques exemples
      Object.entries(videoMapping.videos).slice(0, 5).forEach(([name, data]) => {
        console.log(`   - ${name}: ${data.iframe_url}`);
      });
      
      if (videoCount > 5) {
        console.log(`   ... et ${videoCount - 5} autres vidéos`);
      }
      
      return videoMapping.videos;
    } else {
      console.log('⚠️ Aucun mapping vidéo trouvé');
      return {};
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return {};
  }
}

// Étape 2: Upload d'images exemples pour BIPCOSA06
async function uploadSampleImages() {
  console.log('\n🖼️ UPLOAD D\'IMAGES POUR BIPCOSA06\n');
  
  // Images d'exemple pour les produits
  const sampleImages = [
    {
      url: 'https://images.unsplash.com/photo-1536819114556-1e10f967fb61',
      name: 'bipcosa06-product-mousseux-usa',
      product: 'Mousseux-USA'
    },
    {
      url: 'https://images.unsplash.com/photo-1550418290-a8d86ad674a6',
      name: 'bipcosa06-product-g21-haze',
      product: 'G21-haze'
    },
    {
      url: 'https://images.unsplash.com/photo-1503262028195-93c528f03218',
      name: 'bipcosa06-product-docteur-grinspoon',
      product: 'Docteur-grinspoon'
    }
  ];
  
  const uploadedImages = {};
  
  for (const image of sampleImages) {
    console.log(`📸 Upload image pour ${image.product}...`);
    
    try {
      const formData = new FormData();
      formData.append('url', image.url);
      formData.append('id', image.name);
      formData.append('metadata', JSON.stringify({
        boutique: config.boutique,
        product: image.product,
        type: 'product-image',
        uploadedAt: new Date().toISOString()
      }));
      formData.append('requireSignedURLs', 'false');
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/images/v1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.cloudflare.imagesToken}`,
            ...formData.getHeaders()
          },
          body: formData
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`   ✅ Image uploadée: ${result.result.id}`);
        uploadedImages[image.product] = {
          cloudflare_id: result.result.id,
          delivery_url: `https://imagedelivery.net/${config.cloudflare.accountId}/${result.result.id}/public`,
          variants: {
            thumbnail: `https://imagedelivery.net/${config.cloudflare.accountId}/${result.result.id}/thumbnail`,
            medium: `https://imagedelivery.net/${config.cloudflare.accountId}/${result.result.id}/medium`,
            large: `https://imagedelivery.net/${config.cloudflare.accountId}/${result.result.id}/large`
          }
        };
      } else {
        console.log(`   ❌ Erreur:`, result.errors?.[0]?.message || 'Upload échoué');
      }
    } catch (error) {
      console.log(`   ❌ Exception:`, error.message);
    }
  }
  
  return uploadedImages;
}

// Étape 3: Créer la configuration finale
async function createFinalConfiguration(videos, images) {
  console.log('\n📝 CRÉATION DE LA CONFIGURATION FINALE\n');
  
  const finalConfig = {
    boutique: 'BIPCOSA06',
    timestamp: new Date().toISOString(),
    media: {
      videos: videos,
      images: images
    },
    integration: {
      totalVideos: Object.keys(videos).length,
      totalImages: Object.keys(images).length
    }
  };
  
  // Sauvegarder la configuration
  await fs.writeFile(
    'bipcosa06-final-media-config.json',
    JSON.stringify(finalConfig, null, 2)
  );
  
  console.log('✅ Configuration finale créée: bipcosa06-final-media-config.json');
  
  // Créer le code TypeScript d'intégration
  const tsCode = `/**
 * Configuration média finale pour BIPCOSA06
 * Généré le ${new Date().toISOString()}
 */

export const BIPCOSA06_MEDIA = {
  videos: ${JSON.stringify(videos, null, 2).replace(/"([^"]+)":/g, '$1:')},
  
  images: ${JSON.stringify(images, null, 2).replace(/"([^"]+)":/g, '$1:')}
};

// Helper pour obtenir la vidéo d'un produit
export function getProductVideo(productName: string) {
  const normalizedName = productName.replace(/\s+/g, '-');
  return BIPCOSA06_MEDIA.videos[normalizedName] || null;
}

// Helper pour obtenir l'image d'un produit
export function getProductImage(productName: string, variant: 'thumbnail' | 'medium' | 'large' | 'public' = 'medium') {
  const normalizedName = productName.replace(/\s+/g, '-');
  const image = BIPCOSA06_MEDIA.images[normalizedName];
  
  if (!image) return null;
  
  return variant === 'public' 
    ? image.delivery_url 
    : image.variants[variant];
}

// Composant exemple
export function ProductMedia({ productName }: { productName: string }) {
  const video = getProductVideo(productName);
  const image = getProductImage(productName);
  
  return (
    <div>
      {video && (
        <iframe 
          src={video.iframe_url}
          style={{ width: '100%', aspectRatio: '16/9' }}
          allowFullScreen
        />
      )}
      {image && (
        <img 
          src={image}
          alt={productName}
          loading="lazy"
        />
      )}
    </div>
  );
}
`;

  await fs.writeFile(
    path.join(__dirname, '../../src/config/bipcosa06-media-final.tsx'),
    tsCode
  );
  
  console.log('✅ Code TypeScript créé: src/config/bipcosa06-media-final.tsx');
  
  return finalConfig;
}

// Fonction principale
async function main() {
  try {
    // 1. Récupérer les vidéos existantes
    const videos = await useExistingVideos();
    
    // 2. Uploader des images exemples
    const images = await uploadSampleImages();
    
    // 3. Créer la configuration finale
    const finalConfig = await createFinalConfiguration(videos, images);
    
    // Résumé
    console.log('\n' + '='.repeat(70));
    console.log('✅ INTÉGRATION COMPLÈTE TERMINÉE');
    console.log('='.repeat(70) + '\n');
    
    console.log('📊 Résumé:');
    console.log(`   📹 Vidéos intégrées: ${finalConfig.integration.totalVideos}`);
    console.log(`   🖼️ Images uploadées: ${finalConfig.integration.totalImages}`);
    
    console.log('\n📁 Fichiers créés:');
    console.log('   - bipcosa06-final-media-config.json');
    console.log('   - src/config/bipcosa06-media-final.tsx');
    
    console.log('\n💡 Utilisation dans votre code:');
    console.log(`
import { ProductMedia, getProductVideo, getProductImage } from '@/config/bipcosa06-media-final';

// Afficher les médias d'un produit
<ProductMedia productName="Mousseux-USA" />

// Ou séparément
const video = getProductVideo("Mousseux-USA");
const image = getProductImage("Mousseux-USA", "large");
`);
    
    console.log('\n🚀 Prochaines étapes:');
    console.log('   1. Tester l\'intégration: npm run dev');
    console.log('   2. Visiter: http://localhost:3000/test-cloudflare');
    console.log('   3. Déployer: vercel --prod');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
main();