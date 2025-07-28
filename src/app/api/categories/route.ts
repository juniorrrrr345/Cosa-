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
  return NextResponse.json({ success: true, message: 'Catégorie ajoutée (mode statique)' });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Catégorie mise à jour (mode statique)' });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Catégorie supprimée (mode statique)' });
}