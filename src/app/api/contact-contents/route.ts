import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Pas de contenu par défaut - retour liste vide
const DEFAULT_CONTACT_CONTENTS = [];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /contact-contents - MongoDB');
    
    await mongoService.connect();
    const contactContents = await mongoService.getContactContents();
    console.log('📞 MongoDB contenus contact:', contactContents ? contactContents.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide
    if (!contactContents || contactContents.length === 0) {
      console.log('📞 MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(contactContents);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📞 Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /contact-contents - Ajout MongoDB');
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
      telegramUsername: contentData.telegramUsername || '',
      telegramLink: contentData.telegramLink || '',
      telegramText: contentData.telegramText || '',
      additionalInfo: contentData.additionalInfo || '',
      order: contentData.order || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoService.connect();
    const savedContent = await mongoService.saveContactContent(newContent);
    
    console.log('✅ Contenu contact ajouté:', savedContent);
    return NextResponse.json(savedContent);
  } catch (error) {
    console.error('❌ Erreur ajout contenu contact:', error);
    return NextResponse.json(
      { error: 'Échec de l\'ajout du contenu contact' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 API PUT /contact-contents - Mise à jour MongoDB');
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
    const updatedContent = await mongoService.updateContactContent(id, updateData);
    
    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Contenu contact non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Contenu contact mis à jour:', updatedContent);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('❌ Erreur mise à jour contenu contact:', error);
    return NextResponse.json(
      { error: 'Échec de la mise à jour du contenu contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API DELETE /contact-contents - Suppression MongoDB');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const success = await mongoService.deleteContactContent(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Contenu contact non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Contenu contact supprimé:', id);
    return NextResponse.json({ success: true, message: 'Contenu contact supprimé' });
  } catch (error) {
    console.error('❌ Erreur suppression contenu contact:', error);
    return NextResponse.json(
      { error: 'Échec de la suppression du contenu contact' },
      { status: 500 }
    );
  }
}