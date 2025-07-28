import { NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Route pour forcer la synchronisation des données
export async function POST() {
  try {
    console.log('🚀 API /sync - Synchronisation forcée démarrée');
    
    // Vérifier la connexion MongoDB
    await mongoService.connect();
    
    // Récupérer toutes les données fraîches depuis MongoDB
    const [products, categories, farms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(), 
      mongoService.getFarms()
    ]);
    
    console.log('📊 Données synchronisées:', {
      products: products.length,
      categories: categories.length,
      farms: farms.length,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Synchronisation forcée réussie',
      data: {
        products: products.length,
        categories: categories.length,
        farms: farms.length,
        syncTime: new Date().toISOString()
      },
      // Renvoyer les données pour forcer le cache côté client
      freshData: {
        products,
        categories,
        farms
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur synchronisation forcée:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la synchronisation forcée',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Route GET pour vérifier l'état de synchronisation
export async function GET() {
  try {
    console.log('🔍 API /sync - Vérification état synchronisation');
    
    await mongoService.connect();
    
    const [products, categories, farms] = await Promise.all([
      mongoService.getProducts(),
      mongoService.getCategories(),
      mongoService.getFarms()
    ]);
    
    return NextResponse.json({
      status: 'synchronized',
      counts: {
        products: products.length,
        categories: categories.length,
        farms: farms.length
      },
      lastCheck: new Date().toISOString(),
      mongoConnected: mongoService.isConnected
    });
    
  } catch (error) {
    console.error('❌ Erreur vérification sync:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}