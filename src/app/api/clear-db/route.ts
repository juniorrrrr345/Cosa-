import { NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function POST() {
  try {
    console.log('🧹 API /clear-db - Nettoyage complet MongoDB');
    
    // 1. Connexion MongoDB
    await mongoService.connect();
    console.log('✅ Connexion MongoDB établie');
    
    // 2. Récupérer l'état avant nettoyage
    const db = mongoService['db']; // Accès direct à la DB
    const [productsBefore, categoriesBefore, farmsBefore, contactsBefore, infosBefore, socialsBefore] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms(),
      db.collection('contact_contents').find({}).toArray(),
      db.collection('info_contents').find({}).toArray(),
      db.collection('social_networks').find({}).toArray()
    ]);
    
    console.log('📊 État avant nettoyage:');
    console.log('  - Produits:', productsBefore.length);
    console.log('  - Catégories:', categoriesBefore.length);
    console.log('  - Fermes:', farmsBefore.length);
    console.log('  - Contacts:', contactsBefore.length);
    console.log('  - Infos:', infosBefore.length);
    console.log('  - Réseaux sociaux:', socialsBefore.length);
    
    // 3. Supprimer tous les contenus
    console.log('🗑️ Suppression de tous les produits...');
    const productsResult = await db.collection('products').deleteMany({});
    console.log(`✅ ${productsResult.deletedCount} produits supprimés`);
    
    console.log('🗑️ Suppression de toutes les catégories...');
    const categoriesResult = await db.collection('categories').deleteMany({});
    console.log(`✅ ${categoriesResult.deletedCount} catégories supprimées`);
    
    console.log('🗑️ Suppression de toutes les fermes...');
    const farmsResult = await db.collection('farms').deleteMany({});
    console.log(`✅ ${farmsResult.deletedCount} fermes supprimées`);
    
    console.log('🗑️ Suppression de tous les contenus contact...');
    const contactsResult = await db.collection('contact_contents').deleteMany({});
    console.log(`✅ ${contactsResult.deletedCount} contenus contact supprimés`);
    
    console.log('🗑️ Suppression de tous les contenus info...');
    const infosResult = await db.collection('info_contents').deleteMany({});
    console.log(`✅ ${infosResult.deletedCount} contenus info supprimés`);
    
    console.log('🗑️ Suppression de tous les réseaux sociaux...');
    const socialsResult = await db.collection('social_networks').deleteMany({});
    console.log(`✅ ${socialsResult.deletedCount} réseaux sociaux supprimés`);
    
    // 4. Vérifier l'état après nettoyage
    const [productsAfter, categoriesAfter, farmsAfter, contactsAfter, infosAfter, socialsAfter] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms(),
      db.collection('contact_contents').find({}).toArray(),
      db.collection('info_contents').find({}).toArray(),
      db.collection('social_networks').find({}).toArray()
    ]);
    
    console.log('📊 État après nettoyage:');
    console.log('  - Produits:', productsAfter.length);
    console.log('  - Catégories:', categoriesAfter.length);
    console.log('  - Fermes:', farmsAfter.length);
    console.log('  - Contacts:', contactsAfter.length);
    console.log('  - Infos:', infosAfter.length);
    console.log('  - Réseaux sociaux:', socialsAfter.length);
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'MongoDB nettoyé complètement',
      cleaned: {
        products: productsResult.deletedCount,
        categories: categoriesResult.deletedCount,
        farms: farmsResult.deletedCount,
        contacts: contactsResult.deletedCount,
        infos: infosResult.deletedCount,
        socials: socialsResult.deletedCount
      },
      before: {
        products: productsBefore.length,
        categories: categoriesBefore.length,
        farms: farmsBefore.length,
        contacts: contactsBefore.length,
        infos: infosBefore.length,
        socials: socialsBefore.length
      },
      after: {
        products: productsAfter.length,
        categories: categoriesAfter.length,
        farms: farmsAfter.length,
        contacts: contactsAfter.length,
        infos: infosAfter.length,
        socials: socialsAfter.length
      },
      verification: {
        totalRemoved: productsResult.deletedCount + categoriesResult.deletedCount + farmsResult.deletedCount + contactsResult.deletedCount + infosResult.deletedCount + socialsResult.deletedCount,
        isEmpty: productsAfter.length === 0 && categoriesAfter.length === 0 && farmsAfter.length === 0 && contactsAfter.length === 0 && infosAfter.length === 0 && socialsAfter.length === 0
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur nettoyage MongoDB:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec du nettoyage MongoDB',
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
    console.log('🔍 API /clear-db GET - Vérification contenu MongoDB');
    
    await mongoService.connect();
    
    const [products, categories, farms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms()
    ]);
    
    // Détails des données actuelles
    const productDetails = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category
    }));
    
    const categoryDetails = categories.map(c => ({
      label: c.label,
      value: c.value
    }));
    
    const farmDetails = farms.map(f => ({
      label: f.label,
      value: f.value
    }));
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Contenu MongoDB actuel',
      mongodb: {
        connected: true,
        products: {
          count: products.length,
          list: productDetails
        },
        categories: {
          count: categories.length,
          list: categoryDetails
        },
        farms: {
          count: farms.length,
          list: farmDetails
        }
      },
      isEmpty: products.length === 0 && categories.length === 0 && farms.length === 0,
      recommendation: 'Utiliser POST /api/clear-db pour tout supprimer',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur vérification MongoDB:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Impossible de vérifier le contenu MongoDB',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}