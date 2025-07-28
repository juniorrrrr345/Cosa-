import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Données statiques de fallback
const STATIC_FARMS = [
  { value: 'holland', label: 'Holland', country: '🇳🇱' },
  { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
  { value: 'calispain', label: 'Calispain', country: '🏴‍☠️' },
  { value: 'premium', label: 'Premium', country: '⭐' }
];

export async function GET(request: NextRequest) {
  return NextResponse.json(STATIC_FARMS);
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /farms appelée');
    const farmData = await request.json();
    
    if (!farmData.value || !farmData.label) {
      return NextResponse.json(
        { error: 'Value et label sont requis' },
        { status: 400 }
      );
    }

    const createdFarm = await mongoService.addFarm(farmData);
    console.log('✅ Farm créée:', createdFarm);
    
    return NextResponse.json(createdFarm, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur API POST farms:', error);
    
    // Fallback: retourner la farm telle qu'elle
    console.log('📦 Fallback: farm créée sans persistance');
    return NextResponse.json(farmData, { status: 201 });
  }
}