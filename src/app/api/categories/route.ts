import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(request: NextRequest) {
  try {
    const categories = await mongoService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur API GET categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json();
    
    // Validation des données requises
    if (!categoryData.value || !categoryData.label) {
      return NextResponse.json(
        { error: 'La valeur et le label sont requis' },
        { status: 400 }
      );
    }

    const createdCategory = await mongoService.addCategory(categoryData);
    
    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error('Erreur API POST categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}