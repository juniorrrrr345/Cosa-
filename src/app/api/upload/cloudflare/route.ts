/**
 * API Route pour upload vers Cloudflare (Stream & Images)
 * BIPCOSA06
 */

import { NextRequest, NextResponse } from 'next/server';

// Configuration avec les VRAIS tokens
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  videoToken: 'v1.0-0adb38df485d3d0888b0b922-5ac29b791eaf12b48dea2d5f3c1bf0680c0c8ab85b0b2d7f0edbf7b9684f79d71d4c3b8a9ebe8df4ec7ab5fcd2862fc01d1caf666e306b8d40f405a52926a3ce108bf1484f9ba3ade5',
  imageToken: '8_sayjltoEjPdiyyPTDcr3YI7ikZpRypVmli5bOl'
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const productName = formData.get('productName') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    console.log(`📤 Upload ${type} pour ${productName || 'produit'}...`);
    
    // Déterminer le type de média
    const isVideo = type === 'video' || file.type.startsWith('video/');
    
    if (isVideo) {
      // Upload vers Cloudflare Stream
      console.log('🎬 Upload vers Cloudflare Stream...');
      
      const streamFormData = new FormData();
      streamFormData.append('file', file);
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/stream`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_CONFIG.videoToken}`
          },
          body: streamFormData
        }
      );

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Vidéo uploadée:', result.result.uid);
        
        return NextResponse.json({
          success: true,
          type: 'video',
          url: `https://iframe.videodelivery.net/${result.result.uid}`,
          id: result.result.uid,
          thumbnail: `https://videodelivery.net/${result.result.uid}/thumbnails/thumbnail.jpg`,
          playback: result.result.playback,
          duration: result.result.duration,
          size: result.result.size
        });
      } else {
        console.error('❌ Erreur Stream:', result.errors);
        return NextResponse.json(
          { error: result.errors?.[0]?.message || 'Erreur upload vidéo' },
          { status: 500 }
        );
      }
      
    } else {
      // Upload vers Cloudflare Images
      console.log('🖼️ Upload vers Cloudflare Images...');
      
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      
      // ID unique
      const imageId = `bipcosa06-${Date.now()}-${productName?.replace(/\s+/g, '-').toLowerCase() || 'image'}`;
      imageFormData.append('id', imageId);
      
      // Métadonnées
      imageFormData.append('metadata', JSON.stringify({
        boutique: 'BIPCOSA06',
        product: productName || 'unknown',
        uploadedAt: new Date().toISOString()
      }));
      
      imageFormData.append('requireSignedURLs', 'false');
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/images/v1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_CONFIG.imageToken}`
          },
          body: imageFormData
        }
      );

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Image uploadée:', result.result.id);
        
        const baseUrl = `https://imagedelivery.net/${CLOUDFLARE_CONFIG.accountId}/${result.result.id}`;
        
        return NextResponse.json({
          success: true,
          type: 'image',
          url: `${baseUrl}/public`,
          id: result.result.id,
          variants: {
            thumbnail: `${baseUrl}/thumbnail`,
            small: `${baseUrl}/small`,
            medium: `${baseUrl}/medium`,
            large: `${baseUrl}/large`,
            public: `${baseUrl}/public`
          },
          filename: result.result.filename,
          uploaded: result.result.uploaded
        });
      } else {
        console.error('❌ Erreur Images:', result.errors);
        return NextResponse.json(
          { error: result.errors?.[0]?.message || 'Erreur upload image' },
          { status: 500 }
        );
      }
    }
    
  } catch (error: any) {
    console.error('❌ Erreur upload:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET pour tester l'API
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Cloudflare Upload API',
    boutique: 'BIPCOSA06',
    endpoints: {
      upload: '/api/upload/cloudflare',
      supports: ['video', 'image']
    }
  });
}