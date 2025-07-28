import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// AUCUNE FERME STATIQUE - BOUTIQUE VIDE PAR DÉFAUT

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /farms - MongoDB seulement');
    
    const farms = await mongoService.getFarms();
    console.log('📦 MongoDB fermes:', farms ? farms.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide (pas de fermes statiques)
    if (!farms || farms.length === 0) {
      console.log('📦 MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(farms);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📦 Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Farm ajoutée (mode statique)' });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Farm mise à jour (mode statique)' });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Farm supprimée (mode statique)' });
}