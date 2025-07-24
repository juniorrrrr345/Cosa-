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
      backgroundType: 'gradient',
      backgroundImage: '',
      backgroundUrl: '',
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
      backgroundType: 'gradient',
      backgroundImage: '',
      backgroundUrl: '',
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon',
      ...updates // Appliquer les mises à jour
    };
    return NextResponse.json(fallbackConfig);
  }
}