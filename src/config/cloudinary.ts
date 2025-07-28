// Configuration Cloudinary pour uploads depuis iPhone/mobile
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtjab1akq',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bipcosa06_preset',
  folder: 'bipcosa06',
  formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],
  maxSize: 104857600, // 100MB pour vidéos iPhone/mobile
};

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video';
  bytes: number;
  url: string;
}

export interface CloudinaryError {
  message: string;
  http_code: number;
}

// Upload depuis le client (iPhone/mobile) - Version simplifiée
export const uploadToCloudinary = async (
  file: File,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<any> => {
  console.log('🚀 Début upload Cloudinary:', {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    fileType: file.type,
    resourceType,
    cloudName: CLOUDINARY_CONFIG.cloudName,
    preset: CLOUDINARY_CONFIG.uploadPreset
  });

  // Vérifications préliminaires
  if (!CLOUDINARY_CONFIG.cloudName) {
    throw new Error('❌ Cloud name Cloudinary manquant. Vérifiez vos variables d\'environnement.');
  }

  if (!CLOUDINARY_CONFIG.uploadPreset) {
    throw new Error('❌ Upload preset Cloudinary manquant. Vérifiez vos variables d\'environnement.');
  }

  // Vérifier le type de fichier
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (resourceType === 'image' && !isImage) {
    throw new Error('❌ Le fichier sélectionné n\'est pas une image');
  }
  
  if (resourceType === 'video' && !isVideo) {
    throw new Error('❌ Le fichier sélectionné n\'est pas une vidéo');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    // Optimisations spécifiques selon le type
    if (resourceType === 'image') {
      formData.append('folder', 'bipcosa06/products');
    } else if (resourceType === 'video') {
      formData.append('folder', 'bipcosa06/videos');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
    
    console.log('📤 Envoi vers:', uploadUrl);
    console.log('📦 FormData:', {
      preset: CLOUDINARY_CONFIG.uploadPreset,
      folder: resourceType === 'image' ? 'bipcosa06/products' : 'bipcosa06/videos'
    });

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur réponse Cloudinary:', result);
      
      // Messages d'erreur personnalisés
      if (result.error?.message?.includes('Invalid upload preset')) {
        throw new Error(`❌ Le preset "${CLOUDINARY_CONFIG.uploadPreset}" n'existe pas ou n'est pas configuré comme "Unsigned" dans Cloudinary`);
      }
      
      if (result.error?.message?.includes('cloud_name')) {
        throw new Error(`❌ Cloud name "${CLOUDINARY_CONFIG.cloudName}" incorrect`);
      }
      
      throw new Error(result.error?.message || `Upload échoué: ${response.statusText}`);
    }

    console.log('✅ Upload réussi:', {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    });

    return result;
  } catch (error: any) {
    console.error('❌ Erreur upload Cloudinary:', error);
    
    // Ajouter des conseils de debug
    if (error.message?.includes('Failed to fetch')) {
      throw new Error('❌ Erreur de connexion. Vérifiez votre connexion internet.');
    }
    
    throw error;
  }
};

// Générer une URL optimisée pour mobile
export const getOptimizedUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;
  const { width = 800, height = 600, quality = 'auto:good', format = 'auto' } = options;
  
  return `${baseUrl}/image/upload/w_${width},h_${height},c_limit,q_${quality},f_${format}/${publicId}`;
};

// Supprimer un fichier Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Erreur suppression Cloudinary:', error);
    return false;
  }
};