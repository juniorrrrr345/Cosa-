import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Contenu par défaut pour la page Contact
const DEFAULT_CONTACT_CONTENTS = [
  {
    id: 'main-contact',
    title: '📞 Contactez-nous',
    description: 'Notre équipe est à votre disposition pour répondre à toutes vos questions.',
    contactMethod: 'telegram',
    contactValue: '@bipcosa06',
    additionalInfo: 'Réponse rapide garantie sous 24h',
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'telegram-contact',
    title: '💬 Telegram',
    description: 'Rejoignez-nous sur Telegram pour un contact direct et sécurisé.',
    contactMethod: 'telegram',
    contactValue: 'https://t.me/bipcosa06',
    additionalInfo: 'Notre canal principal de communication',
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'hours-contact',
    title: '🕒 Horaires',
    description: 'Nous sommes disponibles 7j/7 de 10h à 22h.',
    contactMethod: 'info',
    contactValue: '10h00 - 22h00',
    additionalInfo: 'Service client disponible tous les jours',
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /contact-contents - MongoDB');
    
    await mongoService.connect();
    const contactContents = await mongoService.getContactContents();
    console.log('📞 MongoDB contenus contact:', contactContents ? contactContents.length : 'null');
    
    // Si MongoDB est vide, retourner le contenu par défaut
    if (!contactContents || contactContents.length === 0) {
      console.log('📞 MongoDB vide, retour contenu par défaut');
      // Sauvegarder le contenu par défaut dans MongoDB
      for (const content of DEFAULT_CONTACT_CONTENTS) {
        await mongoService.saveContactContent(content);
      }
      return NextResponse.json(DEFAULT_CONTACT_CONTENTS);
    }
    
    return NextResponse.json(contactContents);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📞 Erreur MongoDB, retour contenu par défaut');
    return NextResponse.json(DEFAULT_CONTACT_CONTENTS);
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
      contactMethod: contentData.contactMethod || 'info',
      contactValue: contentData.contactValue || '',
      additionalInfo: contentData.additionalInfo || '',
      isActive: contentData.isActive !== false,
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