import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET(request: NextRequest) {
  try {
    const products = await mongoService.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur API GET products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    // Validation des données requises
    if (!productData.name || !productData.description) {
      return NextResponse.json(
        { error: 'Le nom et la description sont requis' },
        { status: 400 }
      );
    }

    const createdProduct = await mongoService.addProduct(productData);
    
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error('Erreur API POST products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}