import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// AUCUNE CATÉGORIE STATIQUE - BOUTIQUE VIDE PAR DÉFAUT

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /categories - MongoDB seulement');
    
    const categories = await mongoService.getCategories();
    console.log('📦 MongoDB catégories:', categories ? categories.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide (pas de catégories statiques)
    if (!categories || categories.length === 0) {
      console.log('📦 MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📦 Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /categories - Ajout MongoDB');
    const categoryData = await request.json();
    
    if (!categoryData.label || !categoryData.value) {
      return NextResponse.json(
        { error: 'Le label et la valeur sont requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const newCategory = await mongoService.saveCategory(categoryData);
    
    console.log('✅ Catégorie ajoutée:', newCategory);
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('❌ Erreur ajout catégorie:', error);
    return NextResponse.json(
      { error: 'Échec de l\'ajout de la catégorie' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 API PUT /categories - Mise à jour MongoDB');
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de catégorie requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const updatedCategory = await mongoService.updateCategory(id, updateData);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }
    
    console.log('✅ Catégorie mise à jour:', updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('❌ Erreur mise à jour catégorie:', error);
    return NextResponse.json(
      { error: 'Échec de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API DELETE /categories - Suppression MongoDB');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de catégorie requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const success = await mongoService.deleteCategory(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }
    
    console.log('✅ Catégorie supprimée:', id);
    return NextResponse.json({ success: true, message: 'Catégorie supprimée' });
  } catch (error) {
    console.error('❌ Erreur suppression catégorie:', error);
    return NextResponse.json(
      { error: 'Échec de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}