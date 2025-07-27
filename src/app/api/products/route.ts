import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Données statiques de fallback SEULEMENT si MongoDB échoue complètement
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

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /products - MongoDB DIRECT');
    
    // Essayer MongoDB DIRECTEMENT sans timeout pour voir ce qui se passe
    const products = await mongoService.getProducts();
    console.log('📦 MongoDB résultat brut:', products ? products.length : 'null', products);
    
    // Retourner ce que MongoDB retourne EXACTEMENT (même si vide)
    return NextResponse.json(products || []);
    
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📦 Fallback vers données statiques à cause erreur');
    return NextResponse.json(STATIC_PRODUCTS);
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