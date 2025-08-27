#!/usr/bin/env node

/**
 * Script de migration V2 - Migration réelle des médias BIPCOSA06
 * Avec les tokens corrects pour Stream et Images
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs').promises;
const path = require('path');

const config = {
  cloudflare: {
    accountId: '7979421604bd07b3bd34d3ed96222512',
    streamToken: '2c419602af3bbf30000dc77dc55c67ef5d69a',
    imagesToken: '61mW7CZfq0K6OdcYN9YIC4laRaZNLZAL1Lm4gFhh'
  },
  boutique: 'BIPCOSA06'
};

console.log('\n' + '='.repeat(70));
console.log('🚀 MIGRATION RÉELLE DES MÉDIAS - BIPCOSA06');
console.log('='.repeat(70) + '\n');

// Test des tokens d'abord
async function testTokens() {
  console.log('🔐 Test des tokens API...\n');
  
  // Test token Stream
  console.log('Testing Stream token...');
  const streamTest = await fetch(
    'https://api.cloudflare.com/client/v4/user/tokens/verify',
    {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.streamToken}`
      }
    }
  );
  
  const streamResult = await streamTest.json();
  console.log('Stream Token:', streamResult.success ? '✅ Valide' : '❌ Invalide');
  
  // Test token Images
  console.log('Testing Images token...');
  const imagesTest = await fetch(
    'https://api.cloudflare.com/client/v4/user/tokens/verify',
    {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.imagesToken}`
      }
    }
  );
  
  const imagesResult = await imagesTest.json();
  console.log('Images Token:', imagesResult.success ? '✅ Valide' : '❌ Invalide');
  
  console.log('');
  
  return streamResult.success && imagesResult.success;
}

// Médias de test/exemple à migrer
const testMedia = {
  videos: [
    // Vidéos de test gratuites
    {
      url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      name: 'test-video-bipcosa06'
    }
  ],
  images: [
    // Images de test
    {
      url: 'https://picsum.photos/800/600',
      name: 'test-image-1-bipcosa06'
    },
    {
      url: 'https://via.placeholder.com/800x600',
      name: 'test-image-2-bipcosa06'
    }
  ]
};

async function uploadVideoByUrl(videoData) {
  console.log(`📹 Upload vidéo: ${videoData.name}`);
  
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream/copy`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.cloudflare.streamToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: videoData.url,
          meta: {
            name: videoData.name,
            boutique: config.boutique,
            uploadedAt: new Date().toISOString()
          },
          thumbnailTimestampPct: 0.5,
          allowedOrigins: ['*']
        })
      }
    );
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Vidéo uploadée avec succès!`);
      console.log(`   ID: ${result.result.uid}`);
      console.log(`   URL: https://iframe.videodelivery.net/${result.result.uid}`);
      return {
        success: true,
        data: result.result
      };
    } else {
      console.error(`❌ Erreur:`, result.errors);
      return {
        success: false,
        error: result.errors
      };
    }
  } catch (error) {
    console.error(`❌ Exception:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function uploadImageByUrl(imageData) {
  console.log(`🖼️ Upload image: ${imageData.name}`);
  
  try {
    const formData = new FormData();
    formData.append('url', imageData.url);
    formData.append('id', imageData.name);
    formData.append('metadata', JSON.stringify({
      boutique: config.boutique,
      uploadedAt: new Date().toISOString(),
      source: 'migration-v2'
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
      console.log(`✅ Image uploadée avec succès!`);
      console.log(`   ID: ${result.result.id}`);
      console.log(`   URL: https://imagedelivery.net/${config.cloudflare.accountId}/${result.result.id}/public`);
      return {
        success: true,
        data: result.result
      };
    } else {
      console.error(`❌ Erreur:`, result.errors);
      return {
        success: false,
        error: result.errors
      };
    }
  } catch (error) {
    console.error(`❌ Exception:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function migrateAll() {
  // Test des tokens
  const tokensValid = await testTokens();
  if (!tokensValid) {
    console.log('❌ Les tokens ne sont pas valides. Vérifiez la configuration.');
    return;
  }
  
  const results = {
    videos: [],
    images: []
  };
  
  // Migrer les vidéos de test
  console.log('\n' + '='.repeat(50));
  console.log('📹 MIGRATION DES VIDÉOS');
  console.log('='.repeat(50) + '\n');
  
  for (const video of testMedia.videos) {
    const result = await uploadVideoByUrl(video);
    results.videos.push({
      original: video,
      result: result
    });
    console.log('');
  }
  
  // Migrer les images de test
  console.log('='.repeat(50));
  console.log('🖼️ MIGRATION DES IMAGES');
  console.log('='.repeat(50) + '\n');
  
  for (const image of testMedia.images) {
    const result = await uploadImageByUrl(image);
    results.images.push({
      original: image,
      result: result
    });
    console.log('');
  }
  
  // Sauvegarder les résultats
  const finalResults = {
    boutique: config.boutique,
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      videos: {
        total: results.videos.length,
        success: results.videos.filter(r => r.result.success).length,
        failed: results.videos.filter(r => !r.result.success).length
      },
      images: {
        total: results.images.length,
        success: results.images.filter(r => r.result.success).length,
        failed: results.images.filter(r => !r.result.success).length
      }
    }
  };
  
  await fs.writeFile(
    'migration-results-v2-bipcosa06.json',
    JSON.stringify(finalResults, null, 2)
  );
  
  // Afficher le résumé
  console.log('='.repeat(70));
  console.log('📊 RÉSUMÉ DE LA MIGRATION');
  console.log('='.repeat(70) + '\n');
  
  console.log('📹 Vidéos:');
  console.log(`   ✅ Réussies: ${finalResults.summary.videos.success}`);
  console.log(`   ❌ Échouées: ${finalResults.summary.videos.failed}`);
  
  console.log('\n🖼️ Images:');
  console.log(`   ✅ Réussies: ${finalResults.summary.images.success}`);
  console.log(`   ❌ Échouées: ${finalResults.summary.images.failed}`);
  
  console.log('\n📄 Résultats détaillés sauvegardés dans:');
  console.log('   migration-results-v2-bipcosa06.json');
  
  // Créer le mapping pour l'intégration
  if (finalResults.summary.videos.success > 0 || finalResults.summary.images.success > 0) {
    const mapping = {
      boutique: config.boutique,
      videos: {},
      images: {}
    };
    
    results.videos.forEach(v => {
      if (v.result.success) {
        mapping.videos[v.original.name] = {
          cloudflare_id: v.result.data.uid,
          iframe_url: `https://iframe.videodelivery.net/${v.result.data.uid}`,
          original_url: v.original.url
        };
      }
    });
    
    results.images.forEach(i => {
      if (i.result.success) {
        mapping.images[i.original.name] = {
          cloudflare_id: i.result.data.id,
          delivery_url: `https://imagedelivery.net/${config.cloudflare.accountId}/${i.result.data.id}/public`,
          original_url: i.original.url,
          variants: {
            thumbnail: `https://imagedelivery.net/${config.cloudflare.accountId}/${i.result.data.id}/thumbnail`,
            medium: `https://imagedelivery.net/${config.cloudflare.accountId}/${i.result.data.id}/medium`,
            large: `https://imagedelivery.net/${config.cloudflare.accountId}/${i.result.data.id}/large`
          }
        };
      }
    });
    
    await fs.writeFile(
      'bipcosa06-new-media-mapping.json',
      JSON.stringify(mapping, null, 2)
    );
    
    console.log('\n✅ Nouveau mapping créé: bipcosa06-new-media-mapping.json');
  }
}

// Fonction principale
async function main() {
  try {
    await migrateAll();
    console.log('\n✨ Migration terminée!');
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter
main();