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
  folder: string = 'products'
): Promise<CloudinaryUploadResult> => {
  console.log('🚀 Upload Cloudinary:', {
    fileName: file.name,
    fileSize: `${Math.round(file.size / 1024 / 1024)}MB`,
    fileType: file.type,
    cloudName: CLOUDINARY_CONFIG.cloudName,
    preset: CLOUDINARY_CONFIG.uploadPreset
  });

  if (!CLOUDINARY_CONFIG.cloudName) {
    throw new Error('❌ Cloud name Cloudinary manquant');
  }

  if (!CLOUDINARY_CONFIG.uploadPreset) {
    throw new Error('❌ Upload preset Cloudinary manquant');
  }

  // Vérifier le type de fichier
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (!isImage && !isVideo) {
    throw new Error('❌ Type de fichier non supporté. Utilisez JPG, PNG, WebP, MP4 ou MOV');
  }

  // Vérifier la taille
  const maxSizeImage = 20 * 1024 * 1024; // 20MB pour images
  const maxSizeVideo = 100 * 1024 * 1024; // 100MB pour vidéos
  
  if (isImage && file.size > maxSizeImage) {
    throw new Error(`❌ Image trop volumineuse. Max: 20MB`);
  }
  
  if (isVideo && file.size > maxSizeVideo) {
    throw new Error(`❌ Vidéo trop volumineuse. Max: 100MB`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', `${CLOUDINARY_CONFIG.folder}/${folder}`);

  try {
    const resourceType = isVideo ? 'video' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
    
    console.log('📤 Upload vers:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erreur Cloudinary:', result);
      
      let errorMessage = result.error?.message || 'Erreur upload';
      
      if (errorMessage.includes('Invalid upload preset')) {
        errorMessage = `❌ Le preset "${CLOUDINARY_CONFIG.uploadPreset}" n'existe pas. Créez-le dans Cloudinary Console.`;
      } else if (errorMessage.includes('cloud_name')) {
        errorMessage = `❌ Cloud name "${CLOUDINARY_CONFIG.cloudName}" incorrect.`;
      }
      
      throw new Error(errorMessage);
    }

    console.log('✅ Upload réussi:', result.secure_url);
    return result;
    
  } catch (error) {
    console.error('❌ Erreur upload:', error);
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