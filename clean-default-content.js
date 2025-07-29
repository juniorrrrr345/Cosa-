const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function cleanDefaultContent() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté');
    
    const db = client.db('bipcosa06');
    
    // Nettoyer les contenus info par défaut
    console.log('\n🧹 Nettoyage des contenus Info...');
    const infoResult = await db.collection('infoContents').deleteMany({
      $or: [
        { title: { $regex: 'BIPCOSA06.*Confiance' } },
        { description: { $regex: 'sélection premium' } }
      ]
    });
    console.log(`   ✅ ${infoResult.deletedCount} contenus Info supprimés`);
    
    // Nettoyer les contenus contact par défaut
    console.log('\n🧹 Nettoyage des contenus Contact...');
    const contactResult = await db.collection('contactContents').deleteMany({
      $or: [
        { title: { $regex: 'Contact BIPCOSA06' } },
        { telegramUsername: '@bipcosa06' }
      ]
    });
    console.log(`   ✅ ${contactResult.deletedCount} contenus Contact supprimés`);
    
    // Nettoyer les réseaux sociaux par défaut
    console.log('\n🧹 Nettoyage des réseaux sociaux par défaut...');
    const socialResult = await db.collection('socialNetworks').deleteMany({
      $or: [
        { url: 'https://t.me/bipcosa06' },
        { url: 'https://wa.me/33123456789' },
        { url: 'https://instagram.com/bipcosa06' },
        { url: 'https://discord.gg/bipcosa06' }
      ]
    });
    console.log(`   ✅ ${socialResult.deletedCount} réseaux sociaux par défaut supprimés`);
    
    // Vérifier ce qui reste
    console.log('\n📊 État actuel:');
    const infoCount = await db.collection('infoContents').countDocuments();
    const contactCount = await db.collection('contactContents').countDocuments();
    const socialCount = await db.collection('socialNetworks').countDocuments();
    
    console.log(`   - Contenus Info: ${infoCount}`);
    console.log(`   - Contenus Contact: ${contactCount}`);
    console.log(`   - Réseaux sociaux: ${socialCount}`);
    
    console.log('\n✅ Nettoyage terminé ! Les pages afficheront maintenant uniquement le contenu du panel admin.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

console.log('🧹 NETTOYAGE DU CONTENU PAR DÉFAUT\n');
cleanDefaultContent();