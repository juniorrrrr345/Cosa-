import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: value } = params;
    
    const success = await mongoService.deleteCategory(value);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur API DELETE category:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}