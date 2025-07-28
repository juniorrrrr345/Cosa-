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
    
    console.log('🔄 API PUT /products - ID:', id, 'Type:', typeof id);
    console.log('📝 Updates reçues:', {
      name: updates.name,
      image: updates.image,
      video: updates.video
    });
    
    // Essayer de convertir en number si possible
    const numericId = parseInt(id, 10);
    const idToUse = isNaN(numericId) ? id : numericId;
    
    console.log('🔍 ID à utiliser:', idToUse, 'Type:', typeof idToUse);
    
    const updatedProduct = await mongoService.updateProduct(idToUse, updates);
    
    if (!updatedProduct) {
      console.log('❌ Produit non trouvé');
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Produit mis à jour avec succès');
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
    
    // Convertir l'ID string en number
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    console.log('🗑️ API DELETE /products - ID:', numericId);
    
    const success = await mongoService.deleteProduct(numericId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API DELETE product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}