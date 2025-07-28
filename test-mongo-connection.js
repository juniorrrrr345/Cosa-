// Script de test direct MongoDB pour diagnostiquer les problèmes d'authentification
const { MongoClient } = require('mongodb');

// URIs à tester (VERSIONS NETTOYÉES SANS CARACTÈRES SPÉCIAUX)
const uris = [
  // URI avec utilisateur BipCosa (PRIORITÉ - VERSION NETTOYÉE)
  'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06',
  
  // URI avec authSource explicite
  'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?authSource=admin',
  
  // URI minimale
  'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/',
  
  // URI avec utilisateur Junior (fallback)
  'mongodb+srv://Junior:Lacrim123@cluster0.itciznm.mongodb.net/bipcosa06'
];

async function testConnection(uri, index) {
  console.log(`\n🧪 Test ${index + 1}/${uris.length}`);
  console.log(`URI: ${uri.replace(/:([^:@]{1,20})@/, ':****@')}`);
  
  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log('🔄 Connexion en cours...');
    await client.connect();
    
    console.log('✅ Connexion réussie !');
    
    // Test basique
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Collections trouvées: ${collections.length}`);
    if (collections.length > 0) {
      console.log(`📁 Collections: ${collections.map(c => c.name).join(', ')}`);
    }
    
    await client.close();
    console.log('✅ Test réussi !');
    return true;
    
  } catch (error) {
    console.log('❌ Échec de connexion');
    console.log(`🔍 Erreur: ${error.message}`);
    
    if (error.code) {
      console.log(`📄 Code: ${error.code}`);
    }
    
    if (error.codeName) {
      console.log(`📋 Code Name: ${error.codeName}`);
    }
    
    return false;
  }
}

async function runTests() {
  console.log('🚀 DÉMARRAGE DES TESTS MONGODB');
  console.log('================================');
  
  let successCount = 0;
  
  for (let i = 0; i < uris.length; i++) {
    const success = await testConnection(uris[i], i);
    if (success) {
      successCount++;
      console.log(`\n🎯 URI FONCTIONNELLE TROUVÉE ! Utilisez celle-ci:`);
      console.log(uris[i]);
      break; // Arrêter au premier succès
    }
    
    if (i < uris.length - 1) {
      console.log('\n⏳ Attente avant le prochain test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n================================');
  console.log(`📊 RÉSULTATS: ${successCount}/${uris.length} tests réussis`);
  
  if (successCount === 0) {
    console.log('\n🚨 AUCUNE URI NE FONCTIONNE');
    console.log('💡 Solutions suggérées:');
    console.log('1. Créer un nouvel utilisateur "cosa_tau_app" dans MongoDB Atlas');
    console.log('2. Vérifier que le cluster est actif');
    console.log('3. Vérifier Network Access (0.0.0.0/0)');
    console.log('4. Tester avec MongoDB Compass');
  } else {
    console.log('\n✅ PROBLÈME RÉSOLU !');
    console.log('🎯 Utilisez l\'URI qui fonctionne dans Vercel');
  }
}

// Lancer les tests
runTests().catch(console.error);