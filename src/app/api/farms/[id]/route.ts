import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: value } = params;
    
    const success = await mongoService.deleteFarm(value);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Farm non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Farm supprimée avec succès' });
  } catch (error) {
    console.error('Erreur API DELETE farm:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la farm' },
      { status: 500 }
    );
  }
}