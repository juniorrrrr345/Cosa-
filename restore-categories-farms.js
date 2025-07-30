const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function restoreCategoriesFarms() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('bipcosa06');
    
    // Catégories originales avec emojis et couleurs
    const categories = [
      { 
        id: 'flower', 
        value: 'flower', 
        name: 'Flower', 
        label: 'Flower',
        emoji: '🌸',
        color: '#FF69B4'
      },
      { 
        id: 'hash', 
        value: 'hash', 
        name: 'Hash', 
        label: 'Hash',
        emoji: '🟫',
        color: '#8B4513'
      },
      { 
        id: 'vape', 
        value: 'vape', 
        name: 'Vape', 
        label: 'Vape',
        emoji: '💨',
        color: '#87CEEB'
      },
      { 
        id: 'edibles', 
        value: 'edibles', 
        name: 'Edibles', 
        label: 'Edibles',
        emoji: '🍪',
        color: '#FFA500'
      }
    ];
    
    // Farms originales avec emojis et couleurs
    const farms = [
      { 
        id: 'indoor', 
        value: 'indoor', 
        name: 'Indoor', 
        label: 'Indoor',
        emoji: '🏠',
        color: '#4CAF50'
      },
      { 
        id: 'outdoor', 
        value: 'outdoor', 
        name: 'Outdoor', 
        label: 'Outdoor',
        emoji: '🌳',
        color: '#8BC34A'
      },
      { 
        id: 'greenhouse', 
        value: 'greenhouse', 
        name: 'Greenhouse', 
        label: 'Greenhouse',
        emoji: '🌿',
        color: '#00BCD4'
      }
    ];
    
    // Vider et restaurer les catégories
    await db.collection('categories').deleteMany({});
    await db.collection('categories').insertMany(categories);
    console.log('✅ Catégories restaurées:', categories.length);
    
    // Vider et restaurer les farms
    await db.collection('farms').deleteMany({});
    await db.collection('farms').insertMany(farms);
    console.log('✅ Farms restaurées:', farms.length);
    
    // Afficher les catégories et farms restaurées
    console.log('\n📂 Catégories restaurées:');
    categories.forEach(cat => {
      console.log(`  ${cat.emoji} ${cat.name} (${cat.id})`);
    });
    
    console.log('\n🏠 Farms restaurées:');
    farms.forEach(farm => {
      console.log(`  ${farm.emoji} ${farm.name} (${farm.id})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n✅ Restauration terminée!');
  }
}

restoreCategoriesFarms();