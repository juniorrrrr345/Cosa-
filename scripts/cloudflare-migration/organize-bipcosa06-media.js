#!/usr/bin/env node

/**
 * Script pour organiser et assigner les médias à BIPCOSA06
 * Ce script va identifier et réorganiser les médias pour cette boutique
 */

const fs = require('fs').promises;
const fetch = require('node-fetch');
const config = require('./config');

console.log('\n' + '='.repeat(70));
console.log('🏷️ ORGANISATION DES MÉDIAS POUR BIPCOSA06');
console.log('='.repeat(70) + '\n');

async function analyzeCurrentMedia() {
  console.log('📊 Analyse des médias actuels sur Cloudflare...\n');
  
  // Charger la liste des vidéos
  let videos = [];
  try {
    const data = await fs.readFile('cloudflare-videos-list.json', 'utf-8');
    videos = JSON.parse(data);
  } catch (error) {
    console.log('⚠️ Fichier cloudflare-videos-list.json non trouvé, récupération depuis l\'API...');
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream?per_page=100`,
      {
        headers: {
          'Authorization': `Bearer ${config.cloudflare.apiToken}`
        }
      }
    );
    
    const data = await response.json();
    if (response.ok) {
      videos = data.result;
    }
  }
  
  // Analyser les vidéos
  const analysis = {
    total: videos.length,
    byBoutique: {},
    unassigned: [],
    bipcosa06: []
  };
  
  videos.forEach(video => {
    const boutique = video.meta?.boutique || 'non-classé';
    
    if (!analysis.byBoutique[boutique]) {
      analysis.byBoutique[boutique] = [];
    }
    
    analysis.byBoutique[boutique].push({
      id: video.uid,
      name: video.meta?.name || video.uid,
      url: `https://iframe.videodelivery.net/${video.uid}`,
      uploaded: video.uploaded
    });
    
    if (boutique === 'bipcosa06' || boutique === 'BIPCOSA06') {
      analysis.bipcosa06.push(video);
    } else if (boutique === 'non-classé') {
      analysis.unassigned.push(video);
    }
  });
  
  // Afficher l'analyse
  console.log('📊 Résumé:');
  console.log(`  Total vidéos: ${analysis.total}`);
  console.log(`  Vidéos BIPCOSA06: ${analysis.bipcosa06.length}`);
  console.log(`  Vidéos non assignées: ${analysis.unassigned.length}`);
  console.log('\n📁 Répartition par boutique:');
  
  Object.entries(analysis.byBoutique).forEach(([boutique, videos]) => {
    console.log(`  - ${boutique}: ${videos.length} vidéos`);
  });
  
  return analysis;
}

async function createMappingForBipcosa06() {
  console.log('\n' + '='.repeat(50));
  console.log('🗺️ CRÉATION DU MAPPING POUR BIPCOSA06');
  console.log('='.repeat(50) + '\n');
  
  const analysis = await analyzeCurrentMedia();
  
  // Créer le mapping pour les vidéos non assignées
  const mapping = {
    boutique: 'BIPCOSA06',
    timestamp: new Date().toISOString(),
    videos: {},
    recommendations: []
  };
  
  // Pour BIPCOSA06, nous allons utiliser les vidéos non assignées
  console.log('📝 Création du mapping pour les vidéos non assignées...\n');
  
  analysis.unassigned.forEach(video => {
    const name = video.meta?.name || video.uid;
    const cleanName = name.replace(/--video|-video|upload-\d+/gi, '').trim();
    
    mapping.videos[cleanName] = {
      cloudflare_id: video.uid,
      iframe_url: `https://iframe.videodelivery.net/${video.uid}`,
      original_name: name,
      duration: video.duration,
      size: video.size,
      uploaded: video.uploaded,
      suggested_product: cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
    };
    
    console.log(`  ✅ ${cleanName}`);
    console.log(`     → ${mapping.videos[cleanName].iframe_url}`);
  });
  
  // Ajouter des recommandations
  mapping.recommendations.push('1. Utiliser ces vidéos dans les produits BIPCOSA06');
  mapping.recommendations.push('2. Mettre à jour les métadonnées sur Cloudflare pour marquer boutique=BIPCOSA06');
  mapping.recommendations.push('3. Utiliser le composant CloudflareVideo pour l\'affichage');
  
  // Sauvegarder le mapping
  const mappingPath = 'bipcosa06-video-mapping.json';
  await fs.writeFile(mappingPath, JSON.stringify(mapping, null, 2));
  
  console.log(`\n✅ Mapping sauvegardé: ${mappingPath}`);
  
  return mapping;
}

async function generateIntegrationCode() {
  console.log('\n' + '='.repeat(50));
  console.log('💻 CODE D\'INTÉGRATION POUR BIPCOSA06');
  console.log('='.repeat(50) + '\n');
  
  const mapping = await createMappingForBipcosa06();
  
  // Générer le code d'exemple
  const integrationCode = `
// ========================================
// INTÉGRATION DES VIDÉOS CLOUDFLARE
// Boutique: BIPCOSA06
// ========================================

import { CloudflareVideo } from '@/components/CloudflareMedia';

// Mapping des vidéos disponibles
export const BIPCOSA06_VIDEOS = ${JSON.stringify(mapping.videos, null, 2)};

// Exemple d'utilisation dans un composant produit
export function ProductVideo({ productName }) {
  const videoData = BIPCOSA06_VIDEOS[productName];
  
  if (!videoData) {
    return <div>Pas de vidéo disponible</div>;
  }
  
  return (
    <CloudflareVideo
      videoId={videoData.cloudflare_id.split('/').pop()}
      title={productName}
      autoplay={false}
      controls={true}
      muted={true}
    />
  );
}

// Exemple d'utilisation directe
<CloudflareVideo 
  videoId="${Object.values(mapping.videos)[0]?.cloudflare_id || 'VIDEO_ID'}"
  title="Démonstration produit"
/>
`;

  // Sauvegarder le code
  await fs.writeFile('bipcosa06-integration-code.tsx', integrationCode);
  console.log('✅ Code d\'intégration généré: bipcosa06-integration-code.tsx');
  
  // Afficher quelques exemples
  console.log('\n📹 Exemples de vidéos disponibles pour BIPCOSA06:\n');
  
  Object.entries(mapping.videos).slice(0, 5).forEach(([name, data]) => {
    console.log(`${name}:`);
    console.log(`  <CloudflareVideo videoId="${data.cloudflare_id}" />`);
    console.log(`  URL: ${data.iframe_url}\n`);
  });
}

async function createUpdateScript() {
  console.log('\n' + '='.repeat(50));
  console.log('📝 SCRIPT DE MISE À JOUR DES PRODUITS');
  console.log('='.repeat(50) + '\n');
  
  const mapping = await fs.readFile('bipcosa06-video-mapping.json', 'utf-8')
    .then(JSON.parse)
    .catch(() => ({}));
  
  const updateScript = `
// Script de mise à jour des produits BIPCOSA06 avec les vidéos Cloudflare
const videoMapping = ${JSON.stringify(mapping.videos || {}, null, 2)};

async function updateProductsWithVideos() {
  const { MongoClient } = require('mongodb');
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI non défini');
    return;
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('bipcosa06');
    const products = db.collection('products');
    
    // Pour chaque vidéo dans le mapping
    for (const [productName, videoData] of Object.entries(videoMapping)) {
      // Chercher le produit correspondant
      const product = await products.findOne({
        $or: [
          { name: new RegExp(productName, 'i') },
          { title: new RegExp(productName, 'i') }
        ]
      });
      
      if (product) {
        // Mettre à jour avec l'URL Cloudflare
        await products.updateOne(
          { _id: product._id },
          {
            $set: {
              video: videoData.iframe_url,
              videoType: 'cloudflare-stream',
              videoId: videoData.cloudflare_id
            }
          }
        );
        console.log(\`✅ Produit mis à jour: \${product.name} avec vidéo \${videoData.cloudflare_id}\`);
      } else {
        console.log(\`⚠️ Produit non trouvé pour: \${productName}\`);
      }
    }
    
    console.log('\\n✅ Mise à jour terminée!');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  updateProductsWithVideos();
}

module.exports = { updateProductsWithVideos, videoMapping };
`;

  await fs.writeFile('update-products-bipcosa06.js', updateScript);
  console.log('✅ Script de mise à jour créé: update-products-bipcosa06.js');
}

// Fonction principale
async function main() {
  try {
    // Analyser les médias actuels
    await analyzeCurrentMedia();
    
    // Créer le mapping pour BIPCOSA06
    await createMappingForBipcosa06();
    
    // Générer le code d'intégration
    await generateIntegrationCode();
    
    // Créer le script de mise à jour
    await createUpdateScript();
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ ORGANISATION TERMINÉE POUR BIPCOSA06');
    console.log('='.repeat(70) + '\n');
    
    console.log('📋 Fichiers créés:');
    console.log('  1. bipcosa06-video-mapping.json - Mapping des vidéos');
    console.log('  2. bipcosa06-integration-code.tsx - Code d\'intégration React');
    console.log('  3. update-products-bipcosa06.js - Script de mise à jour MongoDB');
    
    console.log('\n🎯 Prochaines étapes:');
    console.log('  1. Copier le code d\'intégration dans vos composants');
    console.log('  2. Exécuter: node update-products-bipcosa06.js');
    console.log('  3. Tester l\'affichage des vidéos');
    
    console.log('\n💡 Note: Les vidéos sont déjà sur Cloudflare Stream.');
    console.log('   Il suffit maintenant de les intégrer dans BIPCOSA06!');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
main();