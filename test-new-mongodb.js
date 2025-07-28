const { MongoClient } = require('mongodb');

// Nouvelle configuration MongoDB
const NEW_MONGODB_URI = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function testNewMongoDB() {
  const client = new MongoClient(NEW_MONGODB_URI);
  
  try {
    console.log('🔄 Test de la nouvelle connexion MongoDB...');
    console.log('   Host: cluster0.itciznm.mongodb.net');
    console.log('   User: BipCosa');
    console.log('   Database: bipcosa06\n');
    
    await client.connect();
    console.log('✅ Connexion réussie !');
    
    const db = client.db('bipcosa06');
    
    // Lister les collections
    const collections = await db.listCollections().toArray();
    console.log('\n📂 Collections disponibles:');
    if (collections.length === 0) {
      console.log('   ❌ Aucune collection trouvée - Base de données vide');
    } else {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Compter les documents
    console.log('\n📊 Contenu des collections:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
    }
    
    // Vérifier/créer la collection products
    const productsExist = collections.some(c => c.name === 'products');
    if (!productsExist) {
      console.log('\n➕ Création de la collection "products"...');
      await db.createCollection('products');
      console.log('✅ Collection "products" créée');
    }
    
    // Ajouter un produit de test si la base est vide
    const productsCount = await db.collection('products').countDocuments();
    if (productsCount === 0) {
      console.log('\n➕ Ajout d\'un produit de test...');
      const testProduct = {
        id: Date.now(),
        name: "NOUVEAU TEST - MongoDB",
        quality: "Premium",
        image: "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=400",
        flagColor: "#4CAF50",
        flagText: "🌿 NEW",
        category: "indica",
        farm: "holland",
        description: "Produit de test pour la nouvelle base MongoDB",
        prices: [
          { id: "1", weight: "1g", price: "10€" }
        ],
        video: "",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('products').insertOne(testProduct);
      console.log('✅ Produit de test ajouté');
    }
    
    console.log('\n✅ Nouvelle base MongoDB prête à l\'emploi !');
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n⚠️  Vérifiez :');
      console.log('   1. Le nom d\'utilisateur : BipCosa');
      console.log('   2. Le mot de passe : Cosa06');
      console.log('   3. Que l\'utilisateur existe dans MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n⚠️  Vérifiez :');
      console.log('   1. L\'adresse du cluster : cluster0.itciznm.mongodb.net');
      console.log('   2. Votre connexion internet');
    }
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Exécuter le test
console.log('🧪 TEST DE LA NOUVELLE CONNEXION MONGODB\n');
testNewMongoDB();