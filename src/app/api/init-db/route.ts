import { NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Données par défaut à insérer si MongoDB est vide
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Produit Test 1",
    price: 29.99,
    description: "Description du produit test 1",
    category: "Electronique",
    farm: "Ferme Test",
    images: [],
    isAvailable: true,
    stock: 10,
    weight: "100g"
  },
  {
    id: 2,
    name: "Produit Test 2", 
    price: 49.99,
    description: "Description du produit test 2",
    category: "Maison",
    farm: "Ferme Bio",
    images: [],
    isAvailable: true,
    stock: 5,
    weight: "200g"
  },
  {
    id: 3,
    name: "Produit Test 3",
    price: 19.99,
    description: "Description du produit test 3", 
    category: "Jardin",
    farm: "Ferme Locale",
    images: [],
    isAvailable: true,
    stock: 15,
    weight: "150g"
  }
];

const DEFAULT_CATEGORIES = [
  { label: "Electronique", value: "electronique" },
  { label: "Maison", value: "maison" },
  { label: "Jardin", value: "jardin" },
  { label: "Sport", value: "sport" }
];

const DEFAULT_FARMS = [
  { label: "Ferme Test", value: "ferme-test" },
  { label: "Ferme Bio", value: "ferme-bio" },
  { label: "Ferme Locale", value: "ferme-locale" }
];

export async function POST() {
  try {
    console.log('🚀 API /init-db - Initialisation forcée MongoDB');
    
    // 1. Connexion MongoDB
    await mongoService.connect();
    console.log('✅ Connexion MongoDB établie');
    
    // 2. Vérifier l'état actuel
    const [existingProducts, existingCategories, existingFarms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms()
    ]);
    
    console.log('📊 État actuel MongoDB:');
    console.log('  - Produits:', existingProducts.length);
    console.log('  - Catégories:', existingCategories.length);
    console.log('  - Fermes:', existingFarms.length);
    
    let insertedData = {
      products: 0,
      categories: 0,
      farms: 0,
      updated: false
    };
    
    // 3. Initialiser les catégories si vides
    if (existingCategories.length === 0) {
      console.log('📝 Initialisation des catégories...');
      for (const category of DEFAULT_CATEGORIES) {
        await mongoService.saveCategory(category);
        insertedData.categories++;
      }
      console.log(`✅ ${insertedData.categories} catégories ajoutées`);
      insertedData.updated = true;
    }
    
    // 4. Initialiser les fermes si vides
    if (existingFarms.length === 0) {
      console.log('🚜 Initialisation des fermes...');
      for (const farm of DEFAULT_FARMS) {
        await mongoService.saveFarm(farm);
        insertedData.farms++;
      }
      console.log(`✅ ${insertedData.farms} fermes ajoutées`);
      insertedData.updated = true;
    }
    
    // 5. Initialiser les produits si vides
    if (existingProducts.length === 0) {
      console.log('📦 Initialisation des produits...');
      for (const product of DEFAULT_PRODUCTS) {
        await mongoService.saveProduct(product);
        insertedData.products++;
      }
      console.log(`✅ ${insertedData.products} produits ajoutés`);
      insertedData.updated = true;
    }
    
    // 6. Récupérer les données finales
    const [finalProducts, finalCategories, finalFarms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms()
    ]);
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: insertedData.updated ? 'MongoDB initialisé avec succès' : 'MongoDB déjà initialisé',
      before: {
        products: existingProducts.length,
        categories: existingCategories.length,
        farms: existingFarms.length
      },
      inserted: insertedData,
      after: {
        products: finalProducts.length,
        categories: finalCategories.length,
        farms: finalFarms.length
      },
      data: {
        products: finalProducts.map(p => ({ id: p.id, name: p.name, price: p.price })),
        categories: finalCategories,
        farms: finalFarms
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur initialisation MongoDB:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec de l\'initialisation MongoDB',
      error: {
        message: error.message,
        code: error.code || 'N/A',
        name: error.name || 'N/A'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('🔍 API /init-db GET - Vérification état MongoDB');
    
    await mongoService.connect();
    
    const [products, categories, farms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms()
    ]);
    
    const isEmpty = products.length === 0 && categories.length === 0 && farms.length === 0;
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'État MongoDB vérifié',
      mongodb: {
        connected: true,
        isEmpty: isEmpty,
        products: {
          count: products.length,
          list: products.map(p => ({ id: p.id, name: p.name, price: p.price }))
        },
        categories: {
          count: categories.length,
          list: categories
        },
        farms: {
          count: farms.length,
          list: farms
        }
      },
      recommendation: isEmpty ? 'Utiliser POST /api/init-db pour initialiser' : 'MongoDB contient des données',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur vérification MongoDB:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Impossible de vérifier l\'état MongoDB',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}