import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Pas de contenu par défaut - retour liste vide
const DEFAULT_INFO_CONTENTS = [];

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
      items: contentData.items || [],
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