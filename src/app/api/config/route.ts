import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(request: NextRequest) {
  try {
    const config = await mongoService.getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Erreur API GET config:', error);
    // Fallback avec config par défaut
    const fallbackConfig = {
      backgroundType: 'url',
      backgroundImage: '',
      backgroundUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
    };
    return NextResponse.json(fallbackConfig);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    const updatedConfig = await mongoService.updateConfig(updates);
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erreur API PUT config:', error);
    // Fallback : retourner les updates avec config par défaut
    const fallbackConfig = {
      backgroundType: 'url',
      backgroundImage: '',
      backgroundUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon',
      ...updates // Appliquer les mises à jour
    };
    return NextResponse.json(fallbackConfig);
  }
}