import { NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET() {
  try {
    console.log('🧪 API /test-sync - Test complet de synchronisation');
    
    // 1. Test de connexion MongoDB
    await mongoService.connect();
    console.log('✅ Connexion MongoDB OK');
    
    // 2. Récupération des données actuelles
    const [products, categories, farms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms()
    ]);
    
    console.log('📊 Données actuelles MongoDB:');
    console.log('  - Produits:', products.length);
    console.log('  - Catégories:', categories.length);
    console.log('  - Fermes:', farms.length);
    
    // 3. Détails des produits
    const productDetails = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category
    }));
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Test de synchronisation complet',
      mongodb: {
        connected: true,
        products: {
          count: products.length,
          list: productDetails
        },
        categories: {
          count: categories.length,
          list: categories.map(c => ({ label: c.label, value: c.value }))
        },
        farms: {
          count: farms.length,
          list: farms.map(f => ({ label: f.label, value: f.value }))
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur test sync:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec du test de synchronisation',
      error: {
        message: error.message,
        code: error.code || 'N/A',
        name: error.name || 'N/A'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, productId } = await request.json();
    
    console.log('🧪 API /test-sync POST - Action:', action);
    
    if (action === 'delete' && productId) {
      console.log('🗑️ Test suppression produit ID:', productId);
      
      // Récupérer le produit avant suppression
      await mongoService.connect();
      const products = await mongoService.getProducts();
      const productBefore = products.find(p => p.id === productId);
      
      if (!productBefore) {
        return NextResponse.json({
          status: 'ERROR',
          message: `Produit ${productId} non trouvé`,
          timestamp: new Date().toISOString()
        }, { status: 404 });
      }
      
      // Supprimer le produit
      const deleteResult = await mongoService.deleteProduct(productId.toString());
      
      // Vérifier après suppression
      const productsAfter = await mongoService.getProducts();
      const productAfter = productsAfter.find(p => p.id === productId);
      
      return NextResponse.json({
        status: deleteResult ? 'SUCCESS' : 'ERROR',
        message: deleteResult ? 'Produit supprimé avec succès' : 'Échec de la suppression',
        details: {
          productBefore: {
            id: productBefore.id,
            name: productBefore.name,
            existed: true
          },
          productAfter: {
            id: productId,
            existed: !!productAfter,
            stillInDatabase: !!productAfter
          },
          totalProductsBefore: products.length,
          totalProductsAfter: productsAfter.length,
          countChanged: products.length !== productsAfter.length
        },
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'force-sync') {
      console.log('🔄 Test synchronisation forcée');
      
      await mongoService.connect();
      const [products, categories, farms] = await Promise.all([
        mongoService.getProducts(),
        mongoService.getCategories(),
        mongoService.getFarms()
      ]);
      
      return NextResponse.json({
        status: 'SUCCESS',
        message: 'Synchronisation forcée testée',
        data: {
          products: products.length,
          categories: categories.length,
          farms: farms.length
        },
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Action non reconnue. Actions disponibles: delete, force-sync'
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('❌ Erreur test sync POST:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors du test',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}