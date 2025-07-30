const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function restoreCustomCategoriesFarms() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('bipcosa06');
    
    // VOS catégories personnalisées basées sur les produits
    const categories = [
      { 
        id: 'cali-usa', 
        value: 'cali-usa', 
        name: 'Cali USA', 
        label: 'Cali USA',
        emoji: '🇺🇸',
        color: '#FF0000'
      },
      { 
        id: 'static-sift', 
        value: 'static-sift', 
        name: 'Static Sift', 
        label: 'Static Sift',
        emoji: '⚡',
        color: '#FFD700'
      },
      { 
        id: 'frozen-sift', 
        value: 'frozen-sift', 
        name: 'Frozen Sift', 
        label: 'Frozen Sift',
        emoji: '❄️',
        color: '#00BFFF'
      },
      { 
        id: 'pharmacie', 
        value: 'pharmacie', 
        name: 'Pharmacie', 
        label: 'Pharmacie',
        emoji: '💊',
        color: '#00FF00'
      },
      { 
        id: 'filtre-premium', 
        value: 'filtre-premium', 
        name: 'Filtre Premium', 
        label: 'Filtre Premium',
        emoji: '✨',
        color: '#FFD700'
      },
      { 
        id: 'top-mousseux', 
        value: 'top-mousseux', 
        name: 'Top Mousseux', 
        label: 'Top Mousseux',
        emoji: '🫧',
        color: '#87CEEB'
      },
      { 
        id: 'static-premium', 
        value: 'static-premium', 
        name: 'Static Premium', 
        label: 'Static Premium',
        emoji: '⚡',
        color: '#FFD700'
      },
      { 
        id: 'indica', 
        value: 'indica', 
        name: 'Indica', 
        label: 'Indica',
        emoji: '🍃',
        color: '#228B22'
      }
    ];
    
    // VOS farms personnalisées basées sur les produits
    const farms = [
      { 
        id: 'usa', 
        value: 'usa', 
        name: 'USA', 
        label: 'USA',
        emoji: '🇺🇸',
        color: '#FF0000'
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
        id: 'labzfarm', 
        value: 'labzfarm', 
        name: 'Labz Farm', 
        label: 'Labz Farm',
        emoji: '🧪',
        color: '#9400D3'
      },
      { 
        id: 'exta', 
        value: 'exta', 
        name: 'Exta', 
        label: 'Exta',
        emoji: '💎',
        color: '#00CED1'
      },
      { 
        id: 'vvs-tanger-120u', 
        value: 'vvs-tanger-120u', 
        name: 'VVS Tanger 120μ', 
        label: 'VVS Tanger 120μ',
        emoji: '💎',
        color: '#FFD700'
      },
      { 
        id: 'ice-labz-90-110u', 
        value: 'ice-labz-90-110u', 
        name: 'Ice Labz 90-110μ', 
        label: 'Ice Labz 90-110μ',
        emoji: '🧊',
        color: '#00BFFF'
      },
      { 
        id: '120u-premium-dry-sift', 
        value: '120u-premium-dry-sift', 
        name: '120μ Premium Dry Sift', 
        label: '120μ Premium Dry Sift',
        emoji: '✨',
        color: '#FFD700'
      },
      { 
        id: 'hashgabana', 
        value: 'hashgabana', 
        name: 'Hashgabana', 
        label: 'Hashgabana',
        emoji: '🌿',
        color: '#228B22'
      },
      { 
        id: 'vvs-tanger-90u', 
        value: 'vvs-tanger-90u', 
        name: 'VVS Tanger 90μ', 
        label: 'VVS Tanger 90μ',
        emoji: '💎',
        color: '#FFD700'
      }
    ];
    
    // Vider et restaurer les catégories
    await db.collection('categories').deleteMany({});
    await db.collection('categories').insertMany(categories);
    console.log('✅ Catégories personnalisées restaurées:', categories.length);
    
    // Vider et restaurer les farms
    await db.collection('farms').deleteMany({});
    await db.collection('farms').insertMany(farms);
    console.log('✅ Farms personnalisées restaurées:', farms.length);
    
    // Afficher les catégories et farms restaurées
    console.log('\n📂 VOS CATÉGORIES PERSONNALISÉES:');
    console.log('==================================');
    categories.forEach(cat => {
      console.log(`  ${cat.emoji} ${cat.name} (${cat.id})`);
    });
    
    console.log('\n🏠 VOS FARMS PERSONNALISÉES:');
    console.log('=============================');
    farms.forEach(farm => {
      console.log(`  ${farm.emoji} ${farm.name} (${farm.id})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n✅ Restauration de VOS catégories et farms terminée!');
  }
}

restoreCustomCategoriesFarms();