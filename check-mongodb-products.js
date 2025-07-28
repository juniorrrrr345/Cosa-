const { MongoClient } = require('mongodb');

// Configuration MongoDB
const MONGODB_URI = 'mongodb+srv://juniorrrrr345:cosa06@cluster0.qfqno.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function checkProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('bipcosa06');
    
    // Vérifier toutes les collections
    const collections = await db.listCollections().toArray();
    console.log('\n📂 Collections disponibles:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Récupérer tous les produits
    const products = await db.collection('products').find({}).toArray();
    console.log(`\n📦 Total produits trouvés: ${products.length}`);
    
    if (products.length > 0) {
      console.log('\n🛍️ Liste des produits:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name || 'Sans nom'}`);
        console.log(`   ID: ${product.id || product._id}`);
        console.log(`   Catégorie: ${product.category || 'N/A'}`);
        console.log(`   Farm: ${product.farm || 'N/A'}`);
        console.log(`   Image: ${product.image ? '✅' : '❌'}`);
        console.log(`   Vidéo: ${product.video ? '✅' : '❌'}`);
        console.log(`   Prix: ${product.prices ? product.prices.length + ' options' : 'Aucun'}`);
        console.log(`   Créé: ${product.createdAt || 'N/A'}`);
      });
      
      // Sauvegarder dans un fichier JSON
      const fs = require('fs');
      fs.writeFileSync('backup-products.json', JSON.stringify(products, null, 2));
      console.log('\n💾 Backup sauvegardé dans: backup-products.json');
    } else {
      console.log('\n⚠️  Aucun produit trouvé dans la base de données');
      
      // Vérifier d'autres collections possibles
      console.log('\n🔍 Recherche dans d\'autres collections...');
      for (const col of collections) {
        if (col.name !== 'products') {
          const count = await db.collection(col.name).countDocuments();
          if (count > 0) {
            console.log(`   ${col.name}: ${count} documents`);
            const sample = await db.collection(col.name).findOne();
            console.log(`   Exemple:`, sample);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Exécuter
checkProducts();