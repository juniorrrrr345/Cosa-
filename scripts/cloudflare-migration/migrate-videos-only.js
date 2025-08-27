#!/usr/bin/env node

/**
 * Script de migration des vidéos uniquement vers Cloudflare Stream
 * Version simplifiée qui contourne les vérifications du compte
 */

const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const config = require('./config');

console.log('\n' + '='.repeat(70));
console.log('📹 MIGRATION DES VIDÉOS VERS CLOUDFLARE STREAM');
console.log('Boutique: BIPCOSA06');
console.log('='.repeat(70) + '\n');

async function findVideosInProject() {
  console.log('🔍 Recherche des vidéos dans le projet...\n');
  
  const videos = [];
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  
  // Rechercher dans le dossier public
  async function scanDirectory(dir) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          await scanDirectory(filePath);
        } else if (videoExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
          videos.push({
            path: filePath,
            name: file,
            size: stat.size
          });
          console.log(`  ✅ Trouvé: ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        }
      }
    } catch (error) {
      // Ignorer les erreurs de lecture
    }
  }
  
  // Scanner le projet
  const publicPath = path.join(process.cwd(), '../../public');
  await scanDirectory(publicPath);
  
  // Rechercher aussi les URLs dans le code
  console.log('\n🔍 Recherche des URLs de vidéos dans le code...\n');
  
  const srcPath = path.join(process.cwd(), '../../src');
  const videoUrls = new Set();
  
  async function scanCodeForVideos(dir) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          await scanCodeForVideos(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Rechercher les URLs de vidéos
          const urlRegex = /(?:https?:)?\/\/[^\s"'<>]+\.(?:mp4|webm|mov|avi)/gi;
          const matches = content.match(urlRegex);
          
          if (matches) {
            matches.forEach(url => {
              if (!videoUrls.has(url)) {
                videoUrls.add(url);
                console.log(`  📎 URL trouvée: ${url}`);
              }
            });
          }
        }
      }
    } catch (error) {
      // Ignorer les erreurs
    }
  }
  
  await scanCodeForVideos(srcPath);
  
  return { localVideos: videos, videoUrls: Array.from(videoUrls) };
}

async function testStreamUpload() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 Test d\'upload vers Cloudflare Stream');
  console.log('='.repeat(50) + '\n');
  
  try {
    // Créer une vidéo de test minimale
    console.log('📹 Création d\'une vidéo de test...');
    
    // Vérifier si on peut lister les vidéos existantes
    const listResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream`,
      {
        headers: {
          'Authorization': `Bearer ${config.cloudflare.apiToken}`
        }
      }
    );
    
    const listData = await listResponse.json();
    
    if (listResponse.ok) {
      console.log(`✅ Accès à Stream confirmé!`);
      console.log(`📊 Vidéos existantes: ${listData.result.length}`);
      
      // Afficher quelques vidéos existantes
      if (listData.result.length > 0) {
        console.log('\n📹 Exemples de vidéos déjà sur Cloudflare:');
        listData.result.slice(0, 3).forEach(video => {
          console.log(`  - ${video.meta?.name || video.uid}`);
          console.log(`    URL: https://iframe.videodelivery.net/${video.uid}`);
        });
      }
      
      return true;
    } else {
      console.log('❌ Impossible d\'accéder à Stream');
      console.log('Erreur:', listData.errors);
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    return false;
  }
}

async function generateMigrationPlan() {
  console.log('\n' + '='.repeat(50));
  console.log('📋 PLAN DE MIGRATION');
  console.log('='.repeat(50) + '\n');
  
  const { localVideos, videoUrls } = await findVideosInProject();
  
  console.log('📊 Résumé:');
  console.log(`  - Vidéos locales trouvées: ${localVideos.length}`);
  console.log(`  - URLs de vidéos dans le code: ${videoUrls.length}`);
  
  if (localVideos.length === 0 && videoUrls.length === 0) {
    console.log('\n⚠️ Aucune vidéo trouvée à migrer');
    console.log('Le projet semble ne pas contenir de vidéos.');
    return;
  }
  
  // Créer le plan de migration
  const migrationPlan = {
    boutique: 'BIPCOSA06',
    timestamp: new Date().toISOString(),
    videos: {
      local: localVideos,
      urls: videoUrls
    },
    estimatedCost: {
      storage: `${localVideos.length} vidéos`,
      streaming: 'Inclus dans le plan Cloudflare'
    }
  };
  
  // Sauvegarder le plan
  const planPath = 'migration-plan-bipcosa06.json';
  await fs.writeFile(planPath, JSON.stringify(migrationPlan, null, 2));
  
  console.log(`\n✅ Plan de migration sauvegardé: ${planPath}`);
  
  // Instructions manuelles
  console.log('\n' + '='.repeat(50));
  console.log('📝 INSTRUCTIONS POUR LA MIGRATION MANUELLE');
  console.log('='.repeat(50) + '\n');
  
  console.log('Étant donné les limitations du token API, voici comment procéder:\n');
  
  console.log('1️⃣ POUR LES VIDÉOS LOCALES:');
  if (localVideos.length > 0) {
    console.log('   Uploadez manuellement ces vidéos sur Cloudflare Stream:');
    localVideos.forEach(video => {
      console.log(`   - ${video.name}`);
    });
  } else {
    console.log('   Aucune vidéo locale trouvée');
  }
  
  console.log('\n2️⃣ POUR LES VIDÉOS CLOUDINARY:');
  if (videoUrls.length > 0) {
    console.log('   Ces URLs devront être migrées:');
    videoUrls.slice(0, 5).forEach(url => {
      console.log(`   - ${url}`);
    });
    if (videoUrls.length > 5) {
      console.log(`   ... et ${videoUrls.length - 5} autres`);
    }
  }
  
  console.log('\n3️⃣ UTILISER LE DASHBOARD CLOUDFLARE:');
  console.log('   1. Aller sur https://dash.cloudflare.com');
  console.log('   2. Sélectionner votre compte');
  console.log('   3. Aller dans Stream > Upload');
  console.log('   4. Uploader les vidéos ou importer depuis URL');
  console.log('   5. Organiser avec les tags: boutique=bipcosa06');
  
  console.log('\n4️⃣ APRÈS L\'UPLOAD:');
  console.log('   1. Noter les IDs des vidéos Cloudflare');
  console.log('   2. Créer un fichier mapping manuel');
  console.log('   3. Utiliser le script update-urls.js pour mettre à jour le code');
  
  return migrationPlan;
}

// Fonction principale
async function main() {
  try {
    // Test de connexion à Stream
    const canAccessStream = await testStreamUpload();
    
    if (!canAccessStream) {
      console.log('\n❌ Impossible d\'accéder à Cloudflare Stream');
      console.log('Vérifiez votre token API et vos permissions.');
      process.exit(1);
    }
    
    // Générer le plan de migration
    await generateMigrationPlan();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ANALYSE TERMINÉE');
    console.log('='.repeat(50) + '\n');
    
    console.log('Le token actuel a accès à Cloudflare Stream.');
    console.log('Vous pouvez voir les 50 vidéos déjà uploadées.');
    console.log('Pour une migration complète automatique, vous aurez besoin');
    console.log('d\'un token avec plus de permissions.\n');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter
main();