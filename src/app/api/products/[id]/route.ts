import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Chemin vers le fichier de données
const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Lire les produits depuis le fichier
async function readProducts() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Erreur lecture fichier:', error);
    return [];
  }
}

// Écrire les produits dans le fichier
async function writeProducts(products: any[]) {
  try {
    const dataDir = path.dirname(DATA_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
    console.log('💾 Produits sauvegardés:', products.length);
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const products = await readProducts();
    const product = products.find((p: any) => p.id.toString() === id);
    
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const products = await readProducts();
    const index = products.findIndex((p: any) => p.id.toString() === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    products[index] = { ...products[index], ...updates };
    await writeProducts(products);
    
    console.log('✅ Produit mis à jour:', products[index].name);
    return NextResponse.json(products[index]);
  } catch (error) {
    console.error('Erreur API PUT product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('🗑️ SUPPRESSION FICHIER JSON - ID:', id);
    
    const products = await readProducts();
    const index = products.findIndex((p: any) => p.id.toString() === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    const deletedProduct = products[index];
    products.splice(index, 1);
    await writeProducts(products);
    
    console.log('✅ Produit supprimé FICHIER JSON:', deletedProduct.name, '- Restants:', products.length);
    return NextResponse.json({ message: 'Produit supprimé avec succès', remaining: products.length });
  } catch (error) {
    console.error('❌ Erreur API DELETE product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
}