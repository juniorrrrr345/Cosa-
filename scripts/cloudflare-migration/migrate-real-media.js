#!/usr/bin/env node

/**
 * Script de migration automatique des médias réels
 * Boutique: BIPCOSA06
 * Généré le: 2025-08-27T03:55:18.213Z
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
  }
};

// Médias à migrer
const mediaToMigrate = {
  "boutique": "BIPCOSA06",
  "timestamp": "2025-08-27T03:55:18.212Z",
  "videos": [
    "https://res.cloudinary.com/dtjab1akq/video/upload/v1234567890/bipcosa06/videos/test-video.mp4"
  ],
  "images": [
    "https://i.imgur.com/${imageId}.jpg",
    "https://imgur.com/votre-image.jpg",
    "https://i.imgur.com/${imageId}.jpg`;",
    "https://i.imgur.com/b1O92qz.jpeg",
    "https://res.cloudinary.com/dtjab1akq/image/upload/v1234567890/bipcosa06/products/test-image.jpg",
    "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=400",
    "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=400",
    "https://images.unsplash.com/photo-1550418290-a8d86ad674a6?w=400"
  ],
  "cloudinary": [
    "https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;"
  ],
  "summary": {
    "totalVideos": 1,
    "totalImages": 8,
    "totalCloudinary": 1
  }
};

async function downloadFile(url) {
  console.log(`Téléchargement: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Échec téléchargement: ${url}`);
  return await response.buffer();
}

async function uploadToCloudflareStream(videoUrl) {
  try {
    console.log(`📹 Upload vidéo vers Cloudflare Stream: ${videoUrl}`);
    
    // Option 1: Upload par URL (plus simple)
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream/copy`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.cloudflare.streamToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: videoUrl,
          meta: {
            name: path.basename(videoUrl),
            boutique: 'BIPCOSA06'
          }
        })
      }
    );
    
    const result = await response.json();
    if (result.success) {
      console.log(`✅ Vidéo uploadée: ${result.result.uid}`);
      return result.result;
    } else {
      console.error(`❌ Erreur upload vidéo:`, result.errors);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur:`, error.message);
    return null;
  }
}

async function uploadToCloudflareImages(imageUrl) {
  try {
    console.log(`🖼️ Upload image vers Cloudflare Images: ${imageUrl}`);
    
    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('metadata', JSON.stringify({
      boutique: 'BIPCOSA06',
      source: 'migration',
      originalUrl: imageUrl
    }));
    
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
      console.log(`✅ Image uploadée: ${result.result.id}`);
      return result.result;
    } else {
      console.error(`❌ Erreur upload image:`, result.errors);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur:`, error.message);
    return null;
  }
}

async function migrate() {
  console.log('🚀 Début de la migration des médias réels pour BIPCOSA06\n');
  
  const results = {
    videos: { success: [], failed: [] },
    images: { success: [], failed: [] }
  };
  
  // Migrer les vidéos
  console.log(`📹 Migration de ${mediaToMigrate.videos.length} vidéos...\n`);
  for (const videoUrl of mediaToMigrate.videos) {
    const result = await uploadToCloudflareStream(videoUrl);
    if (result) {
      results.videos.success.push({ original: videoUrl, cloudflare: result });
    } else {
      results.videos.failed.push(videoUrl);
    }
  }
  
  // Migrer les images
  console.log(`\n🖼️ Migration de ${mediaToMigrate.images.length} images...\n`);
  for (const imageUrl of mediaToMigrate.images) {
    const result = await uploadToCloudflareImages(imageUrl);
    if (result) {
      results.images.success.push({ original: imageUrl, cloudflare: result });
    } else {
      results.images.failed.push(imageUrl);
    }
  }
  
  // Sauvegarder les résultats
  await fs.writeFile(
    'migration-results-bipcosa06.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DE LA MIGRATION');
  console.log('='.repeat(60));
  console.log(`✅ Vidéos migrées: ${results.videos.success.length}`);
  console.log(`❌ Vidéos échouées: ${results.videos.failed.length}`);
  console.log(`✅ Images migrées: ${results.images.success.length}`);
  console.log(`❌ Images échouées: ${results.images.failed.length}`);
  console.log('\nRésultats sauvegardés dans: migration-results-bipcosa06.json');
}

// Exécuter la migration
migrate().catch(console.error);
