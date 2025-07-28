const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function checkProductUpdates() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté');
    
    const db = client.db('bipcosa06');
    const products = await db.collection('products').find({}).sort({ updatedAt: -1 }).limit(10).toArray();
    
    console.log('\n📦 10 derniers produits modifiés:');
    console.log('================================\n');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Image: ${product.image ? '✅ ' + product.image.substring(0, 50) + '...' : '❌ Aucune'}`);
      console.log(`   Video: ${product.video ? '✅ ' + product.video.substring(0, 50) + '...' : '❌ Aucune'}`);
      console.log(`   Modifié: ${product.updatedAt || 'N/A'}`);
      console.log('');
    });
    
    // Rechercher des produits avec vidéos
    const productsWithVideos = await db.collection('products').find({ video: { $exists: true, $ne: '' } }).toArray();
    console.log(`\n🎥 Produits avec vidéos: ${productsWithVideos.length}`);
    
    if (productsWithVideos.length > 0) {
      console.log('Liste des produits avec vidéos:');
      productsWithVideos.forEach(p => {
        console.log(`   - ${p.name}: ${p.video}`);
      });
    }
    
    // Rechercher des produits avec images Cloudinary
    const cloudinaryProducts = await db.collection('products').find({ 
      image: { $regex: 'cloudinary.com' } 
    }).toArray();
    
    console.log(`\n☁️  Produits avec images Cloudinary: ${cloudinaryProducts.length}`);
    
    if (cloudinaryProducts.length > 0) {
      console.log('Liste:');
      cloudinaryProducts.forEach(p => {
        console.log(`   - ${p.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

console.log('🔍 VÉRIFICATION DES MISES À JOUR PRODUITS\n');
checkProductUpdates();