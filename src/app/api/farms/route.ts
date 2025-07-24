import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(request: NextRequest) {
  try {
    const farms = await mongoService.getFarms();
    return NextResponse.json(farms);
  } catch (error) {
    console.error('Erreur API GET farms:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des farms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const farmData = await request.json();
    
    // Validation des données requises
    if (!farmData.value || !farmData.label || !farmData.country) {
      return NextResponse.json(
        { error: 'La valeur, le label et le pays sont requis' },
        { status: 400 }
      );
    }

    const createdFarm = await mongoService.addFarm(farmData);
    
    return NextResponse.json(createdFarm, { status: 201 });
  } catch (error) {
    console.error('Erreur API POST farms:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la farm' },
      { status: 500 }
    );
  }
}