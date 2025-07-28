const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function testUpdateProduct() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté');
    
    const db = client.db('bipcosa06');
    const collection = db.collection('products');
    
    // Prendre le premier produit (hash, ID 1)
    const product = await collection.findOne({ id: 1 });
    console.log('\n📦 Produit test:', product.name, '(ID:', product.id, ')');
    console.log('   Image actuelle:', product.image || 'Aucune');
    console.log('   Vidéo actuelle:', product.video || 'Aucune');
    
    // Simuler une mise à jour avec une image Cloudinary
    const testUpdate = {
      image: 'https://res.cloudinary.com/dtjab1akq/image/upload/v1234567890/bipcosa06/products/test-image.jpg',
      imagePublicId: 'bipcosa06/products/test-image',
      video: 'https://res.cloudinary.com/dtjab1akq/video/upload/v1234567890/bipcosa06/videos/test-video.mp4',
      videoPublicId: 'bipcosa06/videos/test-video',
      updatedAt: new Date()
    };
    
    console.log('\n🔄 Test de mise à jour avec:', testUpdate);
    
    const result = await collection.findOneAndUpdate(
      { id: 1 },
      { $set: testUpdate },
      { returnDocument: 'after' }
    );
    
    if (result.value) {
      console.log('\n✅ Mise à jour réussie !');
      console.log('   Nouvelle image:', result.value.image);
      console.log('   Nouvelle vidéo:', result.value.video);
    } else {
      console.log('\n❌ Échec de la mise à jour');
    }
    
    // Vérifier la mise à jour
    const updatedProduct = await collection.findOne({ id: 1 });
    console.log('\n🔍 Vérification finale:');
    console.log('   Image:', updatedProduct.image);
    console.log('   Vidéo:', updatedProduct.video);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

console.log('🧪 TEST MISE À JOUR PRODUIT\n');
testUpdateProduct();