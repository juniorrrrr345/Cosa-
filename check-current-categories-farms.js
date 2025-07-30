const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function checkCategoriesFarms() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('bipcosa06');
    
    // Récupérer toutes les catégories
    const categories = await db.collection('categories').find({}).toArray();
    console.log('\n📂 CATÉGORIES ACTUELLES:');
    console.log('========================');
    categories.forEach(cat => {
      console.log(`ID: ${cat.id || cat._id}`);
      console.log(`Nom: ${cat.name || cat.label}`);
      console.log(`Emoji: ${cat.emoji || '❌'}`);
      console.log(`Value: ${cat.value}`);
      console.log('---');
    });
    
    // Récupérer toutes les farms
    const farms = await db.collection('farms').find({}).toArray();
    console.log('\n🏠 FARMS ACTUELLES:');
    console.log('==================');
    farms.forEach(farm => {
      console.log(`ID: ${farm.id || farm._id}`);
      console.log(`Nom: ${farm.name || farm.label}`);
      console.log(`Emoji: ${farm.emoji || '❌'}`);
      console.log(`Value: ${farm.value}`);
      console.log('---');
    });
    
    // Récupérer tous les produits pour voir quelles catégories/farms ils utilisent
    const products = await db.collection('products').find({}).toArray();
    const usedCategories = new Set();
    const usedFarms = new Set();
    
    products.forEach(product => {
      if (product.category) usedCategories.add(product.category);
      if (product.farm) usedFarms.add(product.farm);
    });
    
    console.log('\n📦 CATÉGORIES UTILISÉES PAR LES PRODUITS:');
    console.log('=========================================');
    Array.from(usedCategories).forEach(cat => console.log(`- ${cat}`));
    
    console.log('\n🌱 FARMS UTILISÉES PAR LES PRODUITS:');
    console.log('====================================');
    Array.from(usedFarms).forEach(farm => console.log(`- ${farm}`));
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
  }
}

checkCategoriesFarms();