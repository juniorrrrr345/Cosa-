const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function fixProductIds() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté');
    
    const db = client.db('bipcosa06');
    const collection = db.collection('products');
    
    // Récupérer tous les produits
    const products = await collection.find({}).toArray();
    console.log(`\n📦 ${products.length} produits trouvés`);
    
    // Trouver le plus grand ID existant
    let maxId = 0;
    products.forEach(product => {
      if (product.id && typeof product.id === 'number') {
        maxId = Math.max(maxId, product.id);
      }
    });
    
    console.log(`\n🔢 Plus grand ID existant: ${maxId}`);
    
    // Mettre à jour les produits sans ID
    let updatedCount = 0;
    for (const product of products) {
      if (!product.id || typeof product.id !== 'number') {
        maxId++;
        
        console.log(`\n📝 Ajout ID ${maxId} au produit: ${product.name}`);
        
        await collection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              id: maxId,
              updatedAt: new Date()
            } 
          }
        );
        
        updatedCount++;
      }
    }
    
    console.log(`\n✅ ${updatedCount} produits mis à jour avec des IDs numériques`);
    
    // Vérifier le résultat
    const updatedProducts = await collection.find({}).sort({ id: 1 }).toArray();
    console.log('\n📋 Liste des produits avec leurs IDs:');
    updatedProducts.forEach(p => {
      console.log(`   ID ${p.id}: ${p.name}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

console.log('🔧 CORRECTION DES IDS PRODUITS\n');
fixProductIds();