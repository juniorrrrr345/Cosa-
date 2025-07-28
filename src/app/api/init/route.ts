import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 INITIALISATION FORCÉE MongoDB...');
    
    // Forcer l'initialisation
    await mongoService.forceInitializeData();
    
    // Vérifier le résultat
    const products = await mongoService.getProducts();
    const categories = await mongoService.getCategories();
    const farms = await mongoService.getFarms();
    
    const result = {
      success: true,
      data: {
        products: products.length,
        categories: categories.length,
        farms: farms.length
      },
      message: 'Initialisation terminée avec succès'
    };
    
    console.log('✅ Initialisation forcée terminée:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Erreur initialisation forcée:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: 'Erreur lors de l\'initialisation'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'état actuel
    const products = await mongoService.getProducts();
    const categories = await mongoService.getCategories();
    const farms = await mongoService.getFarms();
    
    const status = {
      products: products.length,
      categories: categories.length,
      farms: farms.length,
      total: products.length + categories.length + farms.length
    };
    
    console.log('📊 État MongoDB:', status);
    return NextResponse.json(status);
    
  } catch (error) {
    console.error('❌ Erreur vérification état:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}