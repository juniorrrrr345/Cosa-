#!/usr/bin/env node

/**
 * Script pour trouver tous les médias réels utilisés dans BIPCOSA06
 * Recherche dans MongoDB et le code source
 */

const fs = require('fs').promises;
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🔍 RECHERCHE DES MÉDIAS RÉELS - BIPCOSA06');
console.log('='.repeat(70) + '\n');

async function findMediaInCode() {
  console.log('📂 Recherche dans le code source...\n');
  
  const mediaUrls = {
    videos: new Set(),
    images: new Set(),
    cloudinary: new Set()
  };
  
  async function scanFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Patterns pour trouver les médias
      const patterns = {
        // URLs Cloudinary
        cloudinary: /https?:\/\/res\.cloudinary\.com\/[^"'\s]*/gi,
        // URLs vidéo génériques
        videos: /https?:\/\/[^"'\s]*\.(mp4|webm|mov|avi)/gi,
        // URLs images génériques  
        images: /https?:\/\/[^"'\s]*\.(jpg|jpeg|png|webp|gif|svg)/gi,
        // URLs imgur
        imgur: /https?:\/\/i\.imgur\.com\/[^"'\s]*/gi,
        // Chemins locaux
        localMedia: /["']\/[^"']*\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov)/gi
      };
      
      // Rechercher Cloudinary
      const cloudinaryMatches = content.match(patterns.cloudinary);
      if (cloudinaryMatches) {
        cloudinaryMatches.forEach(url => mediaUrls.cloudinary.add(url));
      }
      
      // Rechercher vidéos
      const videoMatches = content.match(patterns.videos);
      if (videoMatches) {
        videoMatches.forEach(url => mediaUrls.videos.add(url));
      }
      
      // Rechercher images
      const imageMatches = content.match(patterns.images);
      if (imageMatches) {
        imageMatches.forEach(url => mediaUrls.images.add(url));
      }
      
      // Rechercher imgur
      const imgurMatches = content.match(patterns.imgur);
      if (imgurMatches) {
        imgurMatches.forEach(url => mediaUrls.images.add(url));
      }
    } catch (error) {
      // Ignorer les erreurs
    }
  }
  
  async function scanDirectory(dir) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
          await scanDirectory(filePath);
        } else if (file.match(/\.(ts|tsx|js|jsx|json)$/)) {
          await scanFile(filePath);
        }
      }
    } catch (error) {
      console.error(`Erreur scan ${dir}:`, error.message);
    }
  }
  
  // Scanner le projet
  await scanDirectory(path.join(__dirname, '../../src'));
  
  return mediaUrls;
}

async function findMediaInMongoDB() {
  console.log('\n📊 Recherche dans MongoDB (via les fichiers de config)...\n');
  
  const mediaFromDB = {
    videos: new Set(),
    images: new Set()
  };
  
  try {
    // Lire les fichiers de test/debug qui peuvent contenir des exemples
    const testFiles = [
      'test-update-product.js',
      'add-test-content.js',
      'init-test-products.js',
      'check-mongodb-products.js'
    ];
    
    for (const file of testFiles) {
      try {
        const content = await fs.readFile(path.join(__dirname, '../..', file), 'utf-8');
        
        // Rechercher les URLs de médias dans les données de test
        const imagePattern = /image:\s*["']([^"']+)["']/gi;
        const videoPattern = /video:\s*["']([^"']+)["']/gi;
        
        let match;
        while ((match = imagePattern.exec(content)) !== null) {
          if (match[1] && match[1].startsWith('http')) {
            mediaFromDB.images.add(match[1]);
          }
        }
        
        while ((match = videoPattern.exec(content)) !== null) {
          if (match[1] && match[1].startsWith('http')) {
            mediaFromDB.videos.add(match[1]);
          }
        }
      } catch (error) {
        // Fichier peut ne pas exister
      }
    }
  } catch (error) {
    console.log('Impossible de lire les données MongoDB');
  }
  
  return mediaFromDB;
}

async function analyzeAndReport() {
  // Rechercher dans le code
  const codeMedia = await findMediaInCode();
  
  // Rechercher dans MongoDB
  const dbMedia = await findMediaInMongoDB();
  
  // Combiner les résultats
  const allMedia = {
    videos: new Set([...codeMedia.videos, ...dbMedia.videos]),
    images: new Set([...codeMedia.images, ...dbMedia.images]),
    cloudinary: codeMedia.cloudinary
  };
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 RÉSULTATS DE LA RECHERCHE');
  console.log('='.repeat(70) + '\n');
  
  console.log('📹 VIDÉOS TROUVÉES:', allMedia.videos.size);
  if (allMedia.videos.size > 0) {
    console.log('Exemples:');
    Array.from(allMedia.videos).slice(0, 5).forEach(url => {
      console.log(`  - ${url}`);
    });
  }
  
  console.log('\n🖼️ IMAGES TROUVÉES:', allMedia.images.size);
  if (allMedia.images.size > 0) {
    console.log('Exemples:');
    Array.from(allMedia.images).slice(0, 5).forEach(url => {
      console.log(`  - ${url}`);
    });
  }
  
  console.log('\n☁️ URLS CLOUDINARY:', allMedia.cloudinary.size);
  if (allMedia.cloudinary.size > 0) {
    console.log('Exemples:');
    Array.from(allMedia.cloudinary).slice(0, 5).forEach(url => {
      console.log(`  - ${url}`);
    });
  }
  
  // Créer un fichier de médias à migrer
  const toMigrate = {
    boutique: 'BIPCOSA06',
    timestamp: new Date().toISOString(),
    videos: Array.from(allMedia.videos),
    images: Array.from(allMedia.images),
    cloudinary: Array.from(allMedia.cloudinary),
    summary: {
      totalVideos: allMedia.videos.size,
      totalImages: allMedia.images.size,
      totalCloudinary: allMedia.cloudinary.size
    }
  };
  
  await fs.writeFile(
    path.join(__dirname, 'media-to-migrate-bipcosa06.json'),
    JSON.stringify(toMigrate, null, 2)
  );
  
  console.log('\n✅ Liste des médias à migrer sauvegardée: media-to-migrate-bipcosa06.json');
  
  return toMigrate;
}

async function createMigrationScript(mediaList) {
  console.log('\n' + '='.repeat(70));
  console.log('📝 CRÉATION DU SCRIPT DE MIGRATION');
  console.log('='.repeat(70) + '\n');
  
  const migrationScript = `#!/usr/bin/env node

/**
 * Script de migration automatique des médias réels
 * Boutique: BIPCOSA06
 * Généré le: ${new Date().toISOString()}
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
const mediaToMigrate = ${JSON.stringify(mediaList, null, 2)};

async function downloadFile(url) {
  console.log(\`Téléchargement: \${url}\`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(\`Échec téléchargement: \${url}\`);
  return await response.buffer();
}

async function uploadToCloudflareStream(videoUrl) {
  try {
    console.log(\`📹 Upload vidéo vers Cloudflare Stream: \${videoUrl}\`);
    
    // Option 1: Upload par URL (plus simple)
    const response = await fetch(
      \`https://api.cloudflare.com/client/v4/accounts/\${config.cloudflare.accountId}/stream/copy\`,
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${config.cloudflare.streamToken}\`,
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
      console.log(\`✅ Vidéo uploadée: \${result.result.uid}\`);
      return result.result;
    } else {
      console.error(\`❌ Erreur upload vidéo:\`, result.errors);
      return null;
    }
  } catch (error) {
    console.error(\`❌ Erreur:\`, error.message);
    return null;
  }
}

async function uploadToCloudflareImages(imageUrl) {
  try {
    console.log(\`🖼️ Upload image vers Cloudflare Images: \${imageUrl}\`);
    
    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('metadata', JSON.stringify({
      boutique: 'BIPCOSA06',
      source: 'migration',
      originalUrl: imageUrl
    }));
    
    const response = await fetch(
      \`https://api.cloudflare.com/client/v4/accounts/\${config.cloudflare.accountId}/images/v1\`,
      {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${config.cloudflare.imagesToken}\`,
          ...formData.getHeaders()
        },
        body: formData
      }
    );
    
    const result = await response.json();
    if (result.success) {
      console.log(\`✅ Image uploadée: \${result.result.id}\`);
      return result.result;
    } else {
      console.error(\`❌ Erreur upload image:\`, result.errors);
      return null;
    }
  } catch (error) {
    console.error(\`❌ Erreur:\`, error.message);
    return null;
  }
}

async function migrate() {
  console.log('🚀 Début de la migration des médias réels pour BIPCOSA06\\n');
  
  const results = {
    videos: { success: [], failed: [] },
    images: { success: [], failed: [] }
  };
  
  // Migrer les vidéos
  console.log(\`📹 Migration de \${mediaToMigrate.videos.length} vidéos...\\n\`);
  for (const videoUrl of mediaToMigrate.videos) {
    const result = await uploadToCloudflareStream(videoUrl);
    if (result) {
      results.videos.success.push({ original: videoUrl, cloudflare: result });
    } else {
      results.videos.failed.push(videoUrl);
    }
  }
  
  // Migrer les images
  console.log(\`\\n🖼️ Migration de \${mediaToMigrate.images.length} images...\\n\`);
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
  
  console.log('\\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DE LA MIGRATION');
  console.log('='.repeat(60));
  console.log(\`✅ Vidéos migrées: \${results.videos.success.length}\`);
  console.log(\`❌ Vidéos échouées: \${results.videos.failed.length}\`);
  console.log(\`✅ Images migrées: \${results.images.success.length}\`);
  console.log(\`❌ Images échouées: \${results.images.failed.length}\`);
  console.log('\\nRésultats sauvegardés dans: migration-results-bipcosa06.json');
}

// Exécuter la migration
migrate().catch(console.error);
`;

  await fs.writeFile(
    path.join(__dirname, 'migrate-real-media.js'),
    migrationScript
  );
  
  console.log('✅ Script de migration créé: migrate-real-media.js');
  console.log('\nPour lancer la migration:');
  console.log('  node scripts/cloudflare-migration/migrate-real-media.js');
}

// Fonction principale
async function main() {
  try {
    const mediaList = await analyzeAndReport();
    
    if (mediaList.summary.totalVideos === 0 && mediaList.summary.totalImages === 0) {
      console.log('\n⚠️ Aucun média trouvé à migrer');
      console.log('Le projet semble utiliser des médias déjà sur Cloudflare ou pas de médias du tout.');
    } else {
      await createMigrationScript(mediaList);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter
main();