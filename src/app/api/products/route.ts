import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const product = new Product(data);
    await product.save();
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}