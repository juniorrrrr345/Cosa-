import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Données statiques de fallback
const STATIC_PRODUCTS = [
  {
    id: 1,
    name: "ANIMAL COOKIES",
    quality: "Qualité Top",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    flagColor: "#333333",
    flagText: "🇳🇱 HOLLAND",
    category: "indica",
    farm: "holland",
    description: "Une variété indica premium avec des arômes sucrés et terreux.",
    prices: [
      { id: "1", weight: "1g", price: "12€" },
      { id: "2", weight: "3.5g", price: "40€" },
      { id: "3", weight: "7g", price: "75€" }
    ]
  },
  {
    id: 2,
    name: "POWER HAZE",
    quality: "Qualité Mid",
    image: "https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=400&h=300&fit=crop&crop=center",
    flagColor: "#4CAF50",
    flagText: "🇪🇸 ESPAGNE",
    category: "sativa",
    farm: "espagne",
    description: "Sativa énergisante avec des effets cérébraux puissants.",
    prices: [
      { id: "1", weight: "1g", price: "10€" },
      { id: "2", weight: "3.5g", price: "32€" },
      { id: "3", weight: "7g", price: "60€" }
    ]
  },
  {
    id: 3,
    name: "AMNESIA",
    quality: "Qualité Top",
    image: "https://images.unsplash.com/photo-1583065173640-8ad0c93a1b5a?w=400&h=300&fit=crop&crop=center",
    flagColor: "#FF9800",
    flagText: "🏴‍☠️ CALISPAIN",
    category: "hybrid",
    farm: "calispain",
    description: "Hybride équilibré avec des effets puissants et durables.",
    prices: [
      { id: "1", weight: "1g", price: "15€" },
      { id: "2", weight: "3.5g", price: "50€" },
      { id: "3", weight: "7g", price: "90€" }
    ]
  },
  {
    id: 4,
    name: "BLUE DREAM",
    quality: "Qualité Premium",
    image: "https://images.unsplash.com/photo-1582017719274-34a06d53caa3?w=400&h=300&fit=crop&crop=center",
    flagColor: "#9C27B0",
    flagText: "⭐ PREMIUM",
    category: "sativa",
    farm: "premium",
    description: "Sativa premium avec des arômes de myrtille et des effets créatifs.",
    prices: [
      { id: "1", weight: "1g", price: "18€" },
      { id: "2", weight: "3.5g", price: "60€" },
      { id: "3", weight: "7g", price: "110€" }
    ]
  }
];

// Chemin vers le fichier de données
const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Assurer que le dossier data existe
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Lire les produits depuis le fichier
async function readProducts() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, créer avec les données par défaut
    console.log('📁 Fichier produits inexistant, création avec données par défaut');
    await writeProducts(STATIC_PRODUCTS);
    return STATIC_PRODUCTS;
  }
}

// Écrire les produits dans le fichier
async function writeProducts(products: any[]) {
  try {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
    console.log('💾 Produits sauvegardés:', products.length);
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /products - SYSTÈME FICHIER JSON');
    const products = await readProducts();
    console.log(`📦 Retour ${products.length} produits depuis fichier JSON`);
    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Erreur API GET products:', error);
    console.log('📦 Fallback vers données statiques');
    return NextResponse.json(STATIC_PRODUCTS);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /products - SYSTÈME FICHIER JSON');
    const productData = await request.json();
    
    // Validation des données requises
    if (!productData.name || !productData.description) {
      return NextResponse.json(
        { error: 'Le nom et la description sont requis' },
        { status: 400 }
      );
    }

    const products = await readProducts();
    const newId = Math.max(...products.map((p: any) => p.id), 0) + 1;
    const newProduct = { ...productData, id: newId };
    
    products.push(newProduct);
    await writeProducts(products);
    
    console.log('✅ Produit ajouté:', newProduct.name);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur API POST products:', error);
    
    // Fallback: créer un ID et retourner le produit avec un ID temporaire
    const fallbackProduct = {
      ...productData,
      id: Date.now() // ID temporaire basé sur timestamp
    };
    
    console.log('📦 Fallback: produit créé avec ID temporaire');
    return NextResponse.json(fallbackProduct, { status: 201 });
  }
}