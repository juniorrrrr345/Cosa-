import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// AUCUN PRODUIT STATIQUE - BOUTIQUE VIDE PAR DÉFAUT

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /products - MongoDB seulement');
    
    const products = await mongoService.getProducts();
    console.log('📦 MongoDB résultat:', products ? products.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide (pas de produits statiques)
    if (!products || products.length === 0) {
      console.log('📦 MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📦 Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /products - MongoDB DIRECT');
    const productData = await request.json();
    
    if (!productData.name || !productData.description) {
      return NextResponse.json(
        { error: 'Le nom et la description sont requis' },
        { status: 400 }
      );
    }

    const createdProduct = await mongoService.addProduct(productData);
    console.log('✅ Produit créé MongoDB:', createdProduct);
    
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur API POST products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}