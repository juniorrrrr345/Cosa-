import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// AUCUNE FERME STATIQUE - BOUTIQUE VIDE PAR DÉFAUT

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /farms - MongoDB seulement');
    
    const farms = await mongoService.getFarms();
    console.log('📦 MongoDB fermes:', farms ? farms.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide (pas de fermes statiques)
    if (!farms || farms.length === 0) {
      console.log('📦 MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(farms);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📦 Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /farms - Ajout MongoDB');
    const farmData = await request.json();
    
    if (!farmData.label || !farmData.value) {
      return NextResponse.json(
        { error: 'Le label et la valeur sont requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const newFarm = await mongoService.saveFarm(farmData);
    
    console.log('✅ Ferme ajoutée:', newFarm);
    return NextResponse.json(newFarm);
  } catch (error) {
    console.error('❌ Erreur ajout ferme:', error);
    return NextResponse.json(
      { error: 'Échec de l\'ajout de la ferme' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 API PUT /farms - Mise à jour MongoDB');
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de ferme requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const updatedFarm = await mongoService.updateFarm(id, updateData);
    
    if (!updatedFarm) {
      return NextResponse.json(
        { error: 'Ferme non trouvée' },
        { status: 404 }
      );
    }
    
    console.log('✅ Ferme mise à jour:', updatedFarm);
    return NextResponse.json(updatedFarm);
  } catch (error) {
    console.error('❌ Erreur mise à jour ferme:', error);
    return NextResponse.json(
      { error: 'Échec de la mise à jour de la ferme' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API DELETE /farms - Suppression MongoDB');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de ferme requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const success = await mongoService.deleteFarm(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Ferme non trouvée' },
        { status: 404 }
      );
    }
    
    console.log('✅ Ferme supprimée:', id);
    return NextResponse.json({ success: true, message: 'Ferme supprimée' });
  } catch (error) {
    console.error('❌ Erreur suppression ferme:', error);
    return NextResponse.json(
      { error: 'Échec de la suppression de la ferme' },
      { status: 500 }
    );
  }
}