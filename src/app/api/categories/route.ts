import { NextRequest, NextResponse } from 'next/server';

// Données statiques des catégories
const STATIC_CATEGORIES = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybride' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' }
];

export async function GET(request: NextRequest) {
  return NextResponse.json(STATIC_CATEGORIES);
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