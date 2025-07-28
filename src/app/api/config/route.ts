import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /config appelée');
    const config = await mongoService.getShopConfig();
    
    // Si MongoDB retourne vide, retourner un objet vide
    if (!config) {
      console.log('📦 MongoDB vide, retour objet vide');
      return NextResponse.json({});
    }
    
    console.log('📦 Config depuis MongoDB:', config);
    return NextResponse.json(config);
  } catch (error) {
    console.error('❌ Erreur API GET config:', error);
    console.log('📦 Erreur MongoDB, retour objet vide');
    return NextResponse.json({});
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /config appelée');
    const configData = await request.json();
    
    if (!configData.name) {
      return NextResponse.json(
        { error: 'Le nom de la boutique est requis' },
        { status: 400 }
      );
    }

    const updatedConfig = await mongoService.updateShopConfig(configData);
    console.log('✅ Config mise à jour:', updatedConfig);
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('❌ Erreur API POST config:', error);
    
    // Fallback: retourner la config telle qu'elle
    console.log('📦 Fallback: config mise à jour sans persistance');
    return NextResponse.json(configData);
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 API PUT /config - Mise à jour MongoDB');
    const updates = await request.json();
    
    const updatedConfig = await mongoService.updateShopConfig(updates);
    console.log('✅ Config mise à jour via PUT:', updatedConfig);
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('❌ Erreur API PUT config:', error);
    
    // Fallback: retourner la config mise à jour localement
    console.log('📦 Fallback: config mise à jour sans persistance');
    return NextResponse.json(updates);
  }
}