const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://juniorrrrr345:cosa06@cluster0.qfqno.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0';

const testProducts = [
  {
    id: Date.now(),
    name: "TEST UPLOAD - OG Kush",
    quality: "Premium Quality",
    image: "https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=400",
    flagColor: "#4CAF50",
    flagText: "🌿 TEST",
    category: "indica",
    farm: "holland",
    description: "Produit de test pour vérifier l'upload de photos et vidéos",
    prices: [
      { id: "1", weight: "1g", price: "10€" },
      { id: "2", weight: "3.5g", price: "30€" },
      { id: "3", weight: "7g", price: "55€" }
    ],
    video: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: Date.now() + 1,
    name: "TEST UPLOAD - White Widow",
    quality: "Top Shelf",
    image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=400",
    flagColor: "#2196F3",
    flagText: "💎 TEST",
    category: "sativa",
    farm: "spain",
    description: "Deuxième produit de test pour l'upload",
    prices: [
      { id: "1", weight: "1g", price: "12€" },
      { id: "2", weight: "3.5g", price: "35€" }
    ],
    video: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: Date.now() + 2,
    name: "TEST UPLOAD - Purple Haze",
    quality: "Exotic",
    image: "https://images.unsplash.com/photo-1550418290-a8d86ad674a6?w=400",
    flagColor: "#9C27B0",
    flagText: "⭐ TEST",
    category: "hybrid",
    farm: "california",
    description: "Troisième produit de test",
    prices: [
      { id: "1", weight: "1g", price: "15€" }
    ],
    video: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initTestProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connexion à MongoDB...');
    await client.connect();
    console.log('✅ Connecté');
    
    const db = client.db('bipcosa06');
    const productsCollection = db.collection('products');
    
    // Vérifier les produits existants
    const existingCount = await productsCollection.countDocuments();
    console.log(`📦 Produits existants: ${existingCount}`);
    
    if (existingCount === 0) {
      // Ajouter les produits de test
      console.log('➕ Ajout des produits de test...');
      const result = await productsCollection.insertMany(testProducts);
      console.log(`✅ ${result.insertedCount} produits de test ajoutés`);
    } else {
      console.log('ℹ️  Des produits existent déjà');
      
      // Optionnel : ajouter quand même un produit test
      const testProduct = {
        ...testProducts[0],
        id: Date.now(),
        name: `TEST UPLOAD - ${new Date().toLocaleTimeString()}`
      };
      
      await productsCollection.insertOne(testProduct);
      console.log('✅ 1 produit de test supplémentaire ajouté');
    }
    
    // Afficher les produits
    const allProducts = await productsCollection.find({}).toArray();
    console.log('\n📋 Produits dans la base:');
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (ID: ${p.id})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n⚠️  Problème de connexion MongoDB. Vérifiez :');
      console.log('   1. Votre connexion internet');
      console.log('   2. L\'URI MongoDB est correcte');
      console.log('   3. L\'IP est whitelistée dans MongoDB Atlas');
    }
  } finally {
    await client.close();
    console.log('\n👋 Connexion fermée');
  }
}

// Instructions
console.log(`
🧪 INITIALISATION DES PRODUITS DE TEST
=====================================

Ce script va ajouter des produits de test dans votre base MongoDB
pour que vous puissiez tester l'upload de photos et vidéos.

`);

initTestProducts();