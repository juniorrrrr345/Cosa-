#!/usr/bin/env node

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function debugProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('bipcosa06');
    const products = await db.collection('products').find({}).toArray();
    
    console.log('\n📦 ANALYSE DES PRODUITS:');
    console.log('========================');
    console.log(`Total: ${products.length} produits\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - ID: ${product.id}`);
      console.log(`   - Image: ${product.image ? '✅ ' + product.image.substring(0, 50) + '...' : '❌ Aucune'}`);
      console.log(`   - Video: ${product.video ? '✅ ' + product.video.substring(0, 50) + '...' : '❌ Aucune'}`);
      console.log(`   - Catégorie: ${product.category}`);
      console.log(`   - Farm: ${product.farm}`);
      console.log(`   - Créé: ${product.createdAt}`);
      console.log(`   - Modifié: ${product.updatedAt}`);
      console.log('');
    });
    
    // Vérifier les produits avec vidéos
    const productsWithVideos = products.filter(p => p.video);
    console.log(`\n🎥 Produits avec vidéos: ${productsWithVideos.length}`);
    
    // Vérifier les produits sans images
    const productsWithoutImages = products.filter(p => !p.image);
    console.log(`\n⚠️  Produits sans images: ${productsWithoutImages.length}`);
    
    if (productsWithoutImages.length > 0) {
      console.log('Produits sans images:');
      productsWithoutImages.forEach(p => {
        console.log(`   - ${p.name} (ID: ${p.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
  }
}

// Exécuter le débogage
debugProducts();