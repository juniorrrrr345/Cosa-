import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(request: NextRequest) {
  try {
    const config = await mongoService.getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Erreur API GET config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    const updatedConfig = await mongoService.updateConfig(updates);
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erreur API PUT config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la configuration' },
      { status: 500 }
    );
  }
}