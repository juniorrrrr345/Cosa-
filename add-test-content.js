const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

async function addTestContent() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté');
    
    const db = client.db('bipcosa06');
    
    // Ajouter du contenu Info
    console.log('\n📝 Ajout du contenu Info...');
    const infoContent = {
      id: 'info-1',
      title: 'Informations BIPCOSA06',
      description: 'Bienvenue dans notre boutique premium',
      items: [
        'Produits de qualité supérieure',
        'Livraison rapide et discrète',
        'Service client 7j/7',
        'Paiement sécurisé'
      ],
      additionalInfo: 'Nous sommes à votre service pour toute question',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('infoContents').replaceOne(
      { id: 'info-1' },
      infoContent,
      { upsert: true }
    );
    console.log('✅ Contenu Info ajouté');
    
    // Ajouter du contenu Contact
    console.log('\n📞 Ajout du contenu Contact...');
    const contactContent = {
      id: 'contact-1',
      title: 'Contactez-nous',
      description: 'Pour toute commande ou information',
      telegramLink: 'https://t.me/votre_telegram',
      telegramText: 'Contactez-nous sur Telegram',
      additionalInfo: 'Réponse rapide garantie',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('contactContents').replaceOne(
      { id: 'contact-1' },
      contactContent,
      { upsert: true }
    );
    console.log('✅ Contenu Contact ajouté');
    
    // Ajouter des réseaux sociaux
    console.log('\n🌐 Ajout des réseaux sociaux...');
    const socialNetworks = [
      {
        id: 'social-1',
        name: 'Telegram',
        emoji: '📱',
        url: 'https://t.me/votre_telegram',
        description: 'Notre canal Telegram',
        isActive: true,
        order: 1
      },
      {
        id: 'social-2',
        name: 'Instagram',
        emoji: '📷',
        url: 'https://instagram.com/votre_instagram',
        description: 'Suivez-nous sur Instagram',
        isActive: true,
        order: 2
      }
    ];
    
    for (const social of socialNetworks) {
      await db.collection('socialNetworks').replaceOne(
        { id: social.id },
        { ...social, createdAt: new Date(), updatedAt: new Date() },
        { upsert: true }
      );
    }
    console.log('✅ Réseaux sociaux ajoutés');
    
    console.log('\n✅ Contenu de test ajouté avec succès !');
    console.log('🔄 Allez sur votre site et videz le cache (triple-clic sur le logo)');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

console.log('📝 AJOUT DE CONTENU DE TEST\n');
addTestContent();