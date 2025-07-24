import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await mongoService.getProductById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const updatedProduct = await mongoService.updateProduct(id, updates);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Erreur API PUT product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const success = await mongoService.deleteProduct(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur API DELETE product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}