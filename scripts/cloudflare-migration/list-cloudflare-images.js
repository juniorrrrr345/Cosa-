#!/usr/bin/env node

/**
 * Script pour lister et analyser les images sur Cloudflare Images
 * Boutique: BIPCOSA06
 */

const fetch = require('node-fetch');
const fs = require('fs').promises;
const config = require('./config');

async function listCloudflareImages() {
  console.log('\n' + '='.repeat(70));
  console.log('🖼️ ANALYSE DES IMAGES CLOUDFLARE');
  console.log('='.repeat(70) + '\n');
  
  try {
    // Récupérer la liste des images
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/images/v1?per_page=100`,
      {
        headers: {
          'Authorization': `Bearer ${config.cloudflare.apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erreur:', data.errors);
      return null;
    }

    console.log(`✅ ${data.result.images.length} images trouvées sur Cloudflare\n`);

    // Analyser les images par boutique
    const byBoutique = {};
    const bipcosa06Images = [];
    
    data.result.images.forEach(image => {
      const boutique = image.meta?.boutique || 'non-classé';
      const name = image.filename || image.id;
      
      if (!byBoutique[boutique]) {
        byBoutique[boutique] = [];
      }
      
      const imageData = {
        id: image.id,
        filename: name,
        uploaded: image.uploaded,
        variants: image.variants || [],
        meta: image.meta || {},
        url: `https://imagedelivery.net/${config.cloudflare.accountId}/${image.id}/public`
      };
      
      byBoutique[boutique].push(imageData);
      
      // Identifier les images pour BIPCOSA06
      if (boutique === 'bipcosa06' || boutique === 'BIPCOSA06' || 
          name.toLowerCase().includes('bipcosa') ||
          boutique === 'non-classé') {
        bipcosa06Images.push(imageData);
      }
    });

    // Afficher le résumé
    console.log('📊 Répartition par boutique:');
    Object.entries(byBoutique).forEach(([boutique, images]) => {
      console.log(`  - ${boutique}: ${images.length} images`);
    });

    // Afficher les images disponibles pour BIPCOSA06
    console.log('\n📸 Images disponibles pour BIPCOSA06:');
    console.log(`Total: ${bipcosa06Images.length} images\n`);
    
    bipcosa06Images.slice(0, 10).forEach(image => {
      console.log(`  🖼️ ${image.filename}`);
      console.log(`     ID: ${image.id}`);
      console.log(`     URL: ${image.url}`);
      console.log('');
    });
    
    if (bipcosa06Images.length > 10) {
      console.log(`  ... et ${bipcosa06Images.length - 10} autres images\n`);
    }

    // Créer le mapping pour BIPCOSA06
    const mapping = {
      boutique: 'BIPCOSA06',
      timestamp: new Date().toISOString(),
      total: bipcosa06Images.length,
      images: {}
    };

    bipcosa06Images.forEach(image => {
      const cleanName = image.filename
        .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
        .replace(/[-_]/g, ' ')
        .trim();
      
      mapping.images[cleanName] = {
        cloudflare_id: image.id,
        delivery_url: image.url,
        variants: {
          thumbnail: `https://imagedelivery.net/${config.cloudflare.accountId}/${image.id}/thumbnail`,
          small: `https://imagedelivery.net/${config.cloudflare.accountId}/${image.id}/small`,
          medium: `https://imagedelivery.net/${config.cloudflare.accountId}/${image.id}/medium`,
          large: `https://imagedelivery.net/${config.cloudflare.accountId}/${image.id}/large`,
          public: `https://imagedelivery.net/${config.cloudflare.accountId}/${image.id}/public`
        },
        original_name: image.filename,
        uploaded: image.uploaded,
        meta: image.meta
      };
    });

    // Sauvegarder le mapping
    await fs.writeFile(
      'bipcosa06-images-mapping.json',
      JSON.stringify(mapping, null, 2)
    );
    
    console.log('✅ Mapping des images sauvegardé: bipcosa06-images-mapping.json\n');

    // Sauvegarder la liste complète
    await fs.writeFile(
      'cloudflare-images-full-list.json',
      JSON.stringify(data.result.images, null, 2)
    );

    return mapping;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return null;
  }
}

// Générer le code d'intégration pour les images
async function generateImageIntegrationCode(mapping) {
  if (!mapping) return;
  
  console.log('=' .repeat(70));
  console.log('💻 CODE D\'INTÉGRATION DES IMAGES');
  console.log('=' .repeat(70) + '\n');

  const code = `
// ========================================
// INTÉGRATION DES IMAGES CLOUDFLARE
// Boutique: BIPCOSA06
// Total: ${mapping.total} images disponibles
// ========================================

import { CloudflareImage } from '@/components/CloudflareMedia';

// Mapping des images disponibles
export const BIPCOSA06_IMAGES = ${JSON.stringify(Object.keys(mapping.images).slice(0, 5).reduce((acc, key) => {
  acc[key] = mapping.images[key].cloudflare_id;
  return acc;
}, {}), null, 2)};

// Exemple d'utilisation
export function ProductImage({ productName, variant = 'medium' }) {
  const imageId = BIPCOSA06_IMAGES[productName];
  
  if (!imageId) {
    return <div>Image non disponible</div>;
  }
  
  return (
    <CloudflareImage
      imageId={imageId}
      alt={productName}
      variant={variant}
      loading="lazy"
    />
  );
}

// URLs directes disponibles
${Object.entries(mapping.images).slice(0, 3).map(([name, data]) => `
// ${name}
// Thumbnail: ${data.variants.thumbnail}
// Medium: ${data.variants.medium}
// Large: ${data.variants.large}`).join('\n')}
`;

  await fs.writeFile('bipcosa06-images-integration.tsx', code);
  console.log('✅ Code d\'intégration des images créé: bipcosa06-images-integration.tsx\n');
}

// Fonction principale
async function main() {
  const mapping = await listCloudflareImages();
  
  if (mapping && mapping.total > 0) {
    await generateImageIntegrationCode(mapping);
    
    console.log('=' .repeat(70));
    console.log('📊 RÉSUMÉ FINAL');
    console.log('=' .repeat(70) + '\n');
    
    console.log(`✅ ${mapping.total} images disponibles pour BIPCOSA06`);
    console.log('✅ Mapping créé: bipcosa06-images-mapping.json');
    console.log('✅ Code d\'intégration créé: bipcosa06-images-integration.tsx');
    
    console.log('\n🎯 Prochaines étapes:');
    console.log('  1. Intégrer le code dans vos composants');
    console.log('  2. Utiliser CloudflareImage pour afficher les images');
    console.log('  3. Choisir les variantes selon le contexte (thumbnail, medium, large)');
  }
}

// Exécuter
main().catch(console.error);