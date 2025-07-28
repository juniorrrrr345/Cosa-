import { NextRequest, NextResponse } from 'next/server';

// Données statiques des farms
const STATIC_FARMS = [
  { value: 'holland', label: 'Holland', flag: '🇳🇱' },
  { value: 'espagne', label: 'Espagne', flag: '🇪🇸' },
  { value: 'calispain', label: 'Calispain', flag: '🏴‍☠️' },
  { value: 'premium', label: 'Premium', flag: '⭐' }
];

export async function GET(request: NextRequest) {
  return NextResponse.json(STATIC_FARMS);
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