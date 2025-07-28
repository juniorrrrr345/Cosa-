import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Contenu par défaut pour la page Info
const DEFAULT_INFO_CONTENTS = [
  {
    id: 'main-info',
    title: '🌟 BIPCOSA06 - Votre Boutique de Confiance',
    description: 'Découvrez notre sélection premium de produits de qualité supérieure.',
    additionalInfo: 'Nous nous engageons à vous offrir une expérience d\'achat exceptionnelle avec des produits soigneusement sélectionnés.',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'quality-info',
    title: '✨ Qualité Garantie',
    description: 'Tous nos produits sont testés et certifiés pour vous garantir la meilleure qualité.',
    additionalInfo: 'Notre équipe d\'experts vérifie chaque produit avant sa mise en vente.',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'delivery-info',
    title: '🚚 Livraison Rapide',
    description: 'Livraison sécurisée et discrète sous 24-48h.',
    additionalInfo: 'Nous utilisons des emballages neutres pour préserver votre confidentialité.',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /info-contents - MongoDB');
    
    await mongoService.connect();
    const infoContents = await mongoService.getInfoContents();
    console.log('ℹ️ MongoDB contenus info:', infoContents ? infoContents.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide
    if (!infoContents || infoContents.length === 0) {
      console.log('ℹ️ MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(infoContents);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('ℹ️ Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /info-contents - Ajout MongoDB');
    const contentData = await request.json();
    
    if (!contentData.title || !contentData.description) {
      return NextResponse.json(
        { error: 'Le titre et la description sont requis' },
        { status: 400 }
      );
    }

    // Générer un ID unique et ajouter les timestamps
    const newContent = {
      id: contentData.id || Date.now().toString(),
      title: contentData.title,
      description: contentData.description,
      additionalInfo: contentData.additionalInfo || '',
      order: contentData.order || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoService.connect();
    const savedContent = await mongoService.saveInfoContent(newContent);
    
    console.log('✅ Contenu info ajouté:', savedContent);
    return NextResponse.json(savedContent);
  } catch (error) {
    console.error('❌ Erreur ajout contenu info:', error);
    return NextResponse.json(
      { error: 'Échec de l\'ajout du contenu info' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 API PUT /info-contents - Mise à jour MongoDB');
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      );
    }

    // Ajouter timestamp de mise à jour
    updateData.updatedAt = new Date();

    await mongoService.connect();
    const updatedContent = await mongoService.updateInfoContent(id, updateData);
    
    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Contenu info non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Contenu info mis à jour:', updatedContent);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('❌ Erreur mise à jour contenu info:', error);
    return NextResponse.json(
      { error: 'Échec de la mise à jour du contenu info' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API DELETE /info-contents - Suppression MongoDB');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const success = await mongoService.deleteInfoContent(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Contenu info non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Contenu info supprimé:', id);
    return NextResponse.json({ success: true, message: 'Contenu info supprimé' });
  } catch (error) {
    console.error('❌ Erreur suppression contenu info:', error);
    return NextResponse.json(
      { error: 'Échec de la suppression du contenu info' },
      { status: 500 }
    );
  }
}