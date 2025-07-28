import { NextRequest, NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

// Type pour les réseaux sociaux
interface SocialNetwork {
  id: string;
  name: string;
  emoji: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Réseaux sociaux par défaut
const DEFAULT_SOCIAL_NETWORKS = [
  {
    id: 'telegram',
    name: 'Telegram',
    emoji: '💬',
    url: 'https://t.me/bipcosa06',
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'instagram',
    name: 'Instagram',
    emoji: '📸',
    url: 'https://instagram.com/bipcosa06',
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API GET /social-networks - MongoDB');
    
    await mongoService.connect();
    const socialNetworks = await mongoService.getSocialNetworks();
    console.log('📱 MongoDB réseaux sociaux:', socialNetworks ? socialNetworks.length : 'null');
    
    // Si MongoDB est vide, retourner une liste vide
    if (!socialNetworks || socialNetworks.length === 0) {
      console.log('📱 MongoDB vide, retour liste vide');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(socialNetworks);
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    console.log('📱 Erreur MongoDB, retour liste vide');
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API POST /social-networks - Ajout MongoDB');
    const networkData = await request.json();
    
    if (!networkData.name || !networkData.url) {
      return NextResponse.json(
        { error: 'Le nom et l\'URL sont requis' },
        { status: 400 }
      );
    }

    // Générer un ID unique et ajouter les timestamps
    const newNetwork: SocialNetwork = {
      id: Date.now().toString(),
      name: networkData.name,
      emoji: networkData.emoji || '🌐',
      url: networkData.url,
      isActive: networkData.isActive !== false,
      order: networkData.order || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoService.connect();
    const savedNetwork = await mongoService.saveSocialNetwork(newNetwork);
    
    console.log('✅ Réseau social ajouté:', savedNetwork);
    return NextResponse.json(savedNetwork);
  } catch (error) {
    console.error('❌ Erreur ajout réseau social:', error);
    return NextResponse.json(
      { error: 'Échec de l\'ajout du réseau social' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 API PUT /social-networks - Mise à jour MongoDB');
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du réseau social requis' },
        { status: 400 }
      );
    }

    // Ajouter timestamp de mise à jour
    updateData.updatedAt = new Date();

    await mongoService.connect();
    const updatedNetwork = await mongoService.updateSocialNetwork(id, updateData);
    
    if (!updatedNetwork) {
      return NextResponse.json(
        { error: 'Réseau social non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Réseau social mis à jour:', updatedNetwork);
    return NextResponse.json(updatedNetwork);
  } catch (error) {
    console.error('❌ Erreur mise à jour réseau social:', error);
    return NextResponse.json(
      { error: 'Échec de la mise à jour du réseau social' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API DELETE /social-networks - Suppression MongoDB');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du réseau social requis' },
        { status: 400 }
      );
    }

    await mongoService.connect();
    const success = await mongoService.deleteSocialNetwork(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Réseau social non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Réseau social supprimé:', id);
    return NextResponse.json({ success: true, message: 'Réseau social supprimé' });
  } catch (error) {
    console.error('❌ Erreur suppression réseau social:', error);
    return NextResponse.json(
      { error: 'Échec de la suppression du réseau social' },
      { status: 500 }
    );
  }
}