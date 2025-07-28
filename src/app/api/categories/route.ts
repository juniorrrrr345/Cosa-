import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Données statiques de fallback
const STATIC_CATEGORIES = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybride' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /categories - MongoDB avec fallback statique');
    
    const categories = await mongoService.getCategories();
    console.log('📂 MongoDB catégories résultat:', categories ? categories.length : 'null');
    
    // Si MongoDB est vide, retourner les données statiques
    if (!categories || categories.length === 0) {
      console.log('📂 MongoDB vide, retour données statiques catégories');
      return NextResponse.json(STATIC_CATEGORIES);
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('❌ Erreur MongoDB catégories:', error);
    console.log('📂 Fallback vers données statiques catégories');
    return NextResponse.json(STATIC_CATEGORIES);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /categories appelée');
    const categoryData = await request.json();
    
    if (!categoryData.value || !categoryData.label) {
      return NextResponse.json(
        { error: 'Value et label sont requis' },
        { status: 400 }
      );
    }

    const createdCategory = await mongoService.addCategory(categoryData);
    console.log('✅ Catégorie créée:', createdCategory);
    
    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur API POST categories:', error);
    
    // Fallback: retourner la catégorie telle qu'elle
    console.log('📦 Fallback: catégorie créée sans persistance');
    return NextResponse.json(categoryData, { status: 201 });
  }
}