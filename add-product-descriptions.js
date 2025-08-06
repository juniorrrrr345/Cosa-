const { MongoClient } = require('mongodb');

async function addProductDescriptions() {
  let client;
  try {
    // Connexion à MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI non défini');
    }

    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db();
    const collection = db.collection('products');
    
    // Récupérer tous les produits
    const products = await collection.find({}).toArray();
    console.log(`\n📦 Total produits trouvés: ${products.length}`);

    let updatedCount = 0;

    // Descriptions par défaut basées sur le nom du produit
    const defaultDescriptions = {
      'hash': "Une variété indica premium avec des arômes sucrés et terreux. Parfaite pour la relaxation en soirée.",
      'amnesia': "Sativa énergisante avec des effets cérébraux puissants. Idéale pour la créativité et l'activité diurne.",
      'purple': "Indica puissante aux tons violets caractéristiques. Effets relaxants profonds et arômes fruités.",
      'blue dream': "Hybride équilibré avec des effets cérébraux créatifs et une relaxation corporelle douce. Goût de myrtille.",
      'lemon haze': "Sativa énergisante parfaite pour la journée. Cultivation outdoor avec des saveurs citronnées.",
      'white widow': "Classique hollandaise indoor. Hybride équilibré avec une couche de résine blanche caractéristique."
    };

    for (const product of products) {
      // Si le produit n'a pas de description ou si elle est vide
      if (!product.description || product.description.trim() === '') {
        let newDescription = '';
        
        // Chercher une description par défaut basée sur le nom
        const productNameLower = (product.name || '').toLowerCase();
        for (const [key, desc] of Object.entries(defaultDescriptions)) {
          if (productNameLower.includes(key)) {
            newDescription = desc;
            break;
          }
        }
        
        // Si pas de correspondance, créer une description générique
        if (!newDescription) {
          newDescription = `${product.name} - Produit de qualité supérieure. ${product.quality || 'Premium quality'}. Cultivé avec soin pour une expérience optimale.`;
        }
        
        // Mettre à jour le produit
        await collection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              description: newDescription,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log(`\n✅ Description ajoutée pour: ${product.name}`);
        console.log(`   "${newDescription}"`);
        updatedCount++;
      } else {
        console.log(`\n✓ ${product.name} a déjà une description`);
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`   - Produits mis à jour: ${updatedCount}`);
    console.log(`   - Produits déjà avec description: ${products.length - updatedCount}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n👋 Connexion fermée');
    }
  }
}

console.log('🔧 AJOUT DES DESCRIPTIONS AUX PRODUITS\n');
addProductDescriptions();