// Configuration Cloudinary pour uploads depuis iPhone/mobile
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvsy5mfhu',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload', // Preset unsigned générique
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '485987511825452',
  apiSecret: process.env.CLOUDINARY_API_SECRET || 'TCJrWZuCJ6r_BLhO4i6afg3F6JU',
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

// Générer une signature pour upload sécurisé
const generateSignature = (params: Record<string, any>): string => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { ...params, timestamp };
  
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  // Pour la démo, on simule la signature
  return `${timestamp}`;
};

// Upload depuis le client (iPhone/mobile) - Version améliorée
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'products'
): Promise<CloudinaryUploadResult> => {
  if (!CLOUDINARY_CONFIG.cloudName) {
    throw new Error('❌ Cloud name Cloudinary manquant');
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

  const timestamp = Math.round(Date.now() / 1000);
  const folderPath = `${CLOUDINARY_CONFIG.folder}/${folder}`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folderPath);
  
  // Pour les uploads non signés, SEUL upload_preset est requis
  // Tous les autres paramètres doivent être dans le preset
  if (CLOUDINARY_CONFIG.uploadPreset && CLOUDINARY_CONFIG.uploadPreset !== 'unsigned_upload') {
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  } else {
    throw new Error('Upload preset manquant - Créez un preset dans Cloudinary console');
  }

  try {
    console.log('🔄 Upload vers Cloudinary...', {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      folder: folderPath,
      fileType: file.type,
      fileSize: `${Math.round(file.size / 1024)}KB`
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${isVideo ? 'video' : 'image'}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erreur Cloudinary:', result);
      
      throw new Error(result.error?.message || 'Erreur lors de l\'upload');
    }

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