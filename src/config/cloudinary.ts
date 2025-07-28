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
    device: navigator.userAgent
  });

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    
    // Optimisations spécifiques selon le type
    if (resourceType === 'image') {
      // Compression automatique pour les images
      formData.append('transformation', 'q_auto:good,f_auto');
      formData.append('folder', 'bipcosa06/products');
    } else if (resourceType === 'video') {
      // Compression vidéo pour mobile
      formData.append('transformation', 'q_auto:good');
      formData.append('folder', 'bipcosa06/videos');
      formData.append('resource_type', 'video');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    
    console.log('📤 Envoi vers:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erreur réponse Cloudinary:', errorData);
      throw new Error(errorData.error?.message || `Upload échoué: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Upload réussi:', {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    });

    return result;
  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error);
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