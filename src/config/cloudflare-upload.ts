/**
 * Configuration et fonctions d'upload vers Cloudflare
 * BIPCOSA06 - Upload direct vers Stream et Images
 */

// Configuration avec les VRAIS tokens
export const CLOUDFLARE_UPLOAD_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  videoToken: 'v1.0-0adb38df485d3d0888b0b922-5ac29b791eaf12b48dea2d5f3c1bf0680c0c8ab85b0b2d7f0edbf7b9684f79d71d4c3b8a9ebe8df4ec7ab5fcd2862fc01d1caf666e306b8d40f405a52926a3ce108bf1484f9ba3ade5',
  imageToken: '8_sayjltoEjPdiyyPTDcr3YI7ikZpRypVmli5bOl',
  boutique: 'BIPCOSA06'
};

/**
 * Upload une vidéo vers Cloudflare Stream
 */
export async function uploadVideoToCloudflare(file: File, productName?: string): Promise<any> {
  console.log('🎬 Upload vidéo vers Cloudflare Stream...');
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Ajouter les métadonnées
    const metadata = {
      name: productName || file.name,
      boutique: CLOUDFLARE_UPLOAD_CONFIG.boutique,
      uploadedAt: new Date().toISOString()
    };
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_UPLOAD_CONFIG.accountId}/stream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_UPLOAD_CONFIG.videoToken}`
        },
        body: formData
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Vidéo uploadée avec succès!');
      return {
        success: true,
        url: `https://iframe.videodelivery.net/${result.result.uid}`,
        id: result.result.uid,
        thumbnail: `https://videodelivery.net/${result.result.uid}/thumbnails/thumbnail.jpg`,
        ...result.result
      };
    } else {
      console.error('❌ Erreur upload vidéo:', result.errors);
      throw new Error(result.errors?.[0]?.message || 'Erreur upload vidéo');
    }
  } catch (error: any) {
    console.error('❌ Erreur upload Cloudflare Stream:', error);
    throw error;
  }
}

/**
 * Upload une image vers Cloudflare Images
 */
export async function uploadImageToCloudflare(file: File, productName?: string): Promise<any> {
  console.log('🖼️ Upload image vers Cloudflare Images...');
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // ID unique pour l'image
    const imageId = `bipcosa06-${Date.now()}-${productName?.replace(/\s+/g, '-').toLowerCase() || 'image'}`;
    formData.append('id', imageId);
    
    // Métadonnées
    formData.append('metadata', JSON.stringify({
      boutique: CLOUDFLARE_UPLOAD_CONFIG.boutique,
      product: productName || 'unknown',
      uploadedAt: new Date().toISOString()
    }));
    
    formData.append('requireSignedURLs', 'false');
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_UPLOAD_CONFIG.accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_UPLOAD_CONFIG.imageToken}`
        },
        body: formData
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Image uploadée avec succès!');
      const baseUrl = `https://imagedelivery.net/${CLOUDFLARE_UPLOAD_CONFIG.accountId}/${result.result.id}`;
      
      return {
        success: true,
        url: `${baseUrl}/public`,
        id: result.result.id,
        variants: {
          thumbnail: `${baseUrl}/thumbnail`,
          small: `${baseUrl}/small`,
          medium: `${baseUrl}/medium`,
          large: `${baseUrl}/large`,
          public: `${baseUrl}/public`
        },
        ...result.result
      };
    } else {
      console.error('❌ Erreur upload image:', result.errors);
      throw new Error(result.errors?.[0]?.message || 'Erreur upload image');
    }
  } catch (error: any) {
    console.error('❌ Erreur upload Cloudflare Images:', error);
    throw error;
  }
}

/**
 * Upload automatique selon le type de fichier
 */
export async function uploadToCloudflare(file: File, productName?: string): Promise<any> {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  
  if (isVideo) {
    return uploadVideoToCloudflare(file, productName);
  } else if (isImage) {
    return uploadImageToCloudflare(file, productName);
  } else {
    throw new Error('Type de fichier non supporté. Utilisez une vidéo ou une image.');
  }
}

/**
 * Helper pour obtenir l'URL d'affichage
 */
export function getCloudflareMediaUrl(type: 'video' | 'image', id: string, variant?: string): string {
  if (type === 'video') {
    return `https://iframe.videodelivery.net/${id}`;
  } else {
    const v = variant || 'public';
    return `https://imagedelivery.net/${CLOUDFLARE_UPLOAD_CONFIG.accountId}/${id}/${v}`;
  }
}