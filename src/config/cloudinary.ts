// Configuration Cloudinary pour uploads depuis iPhone/mobile
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bipcosa06',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bipcosa06_preset',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  folder: 'bipcosa06',
  formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],
  maxSize: 10485760, // 10MB
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

// Upload depuis le client (iPhone/mobile)
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'products'
): Promise<CloudinaryUploadResult> => {
  if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
    throw new Error('❌ Configuration Cloudinary manquante');
  }

  // Vérifier le type de fichier
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (!isImage && !isVideo) {
    throw new Error('❌ Type de fichier non supporté. Utilisez JPG, PNG, WebP, MP4 ou MOV');
  }

  // Vérifier la taille
  if (file.size > CLOUDINARY_CONFIG.maxSize) {
    throw new Error('❌ Fichier trop volumineux. Taille max: 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', `${CLOUDINARY_CONFIG.folder}/${folder}`);
  
  // Optimisation pour mobile
  if (isImage) {
    formData.append('quality', 'auto:good');
    formData.append('fetch_format', 'auto');
    formData.append('width', '1200');
    formData.append('height', '800');
    formData.append('crop', 'limit');
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${isVideo ? 'video' : 'image'}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur lors de l\'upload');
    }

    const result = await response.json();
    console.log('✅ Upload Cloudinary réussi:', result.public_id);
    
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