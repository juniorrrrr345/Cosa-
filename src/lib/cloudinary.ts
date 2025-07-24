import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
}

export class CloudinaryService {
  
  // Upload d'image
  static async uploadImage(
    file: string | Buffer,
    options: {
      folder?: string;
      public_id?: string;
      transformation?: any;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(file, {
        resource_type: 'image',
        folder: options.folder || 'bipcosa06/products',
        public_id: options.public_id,
        transformation: options.transformation || [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        overwrite: true,
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('Erreur upload image Cloudinary:', error);
      throw new Error('Échec de l\'upload de l\'image');
    }
  }

  // Upload de vidéo
  static async uploadVideo(
    file: string | Buffer,
    options: {
      folder?: string;
      public_id?: string;
      transformation?: any;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(file, {
        resource_type: 'video',
        folder: options.folder || 'bipcosa06/videos',
        public_id: options.public_id,
        transformation: options.transformation || [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        overwrite: true,
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration,
      };
    } catch (error) {
      console.error('Erreur upload vidéo Cloudinary:', error);
      throw new Error('Échec de l\'upload de la vidéo');
    }
  }

  // Supprimer un fichier
  static async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return result;
    } catch (error) {
      console.error('Erreur suppression Cloudinary:', error);
      throw new Error('Échec de la suppression du fichier');
    }
  }

  // Générer URL optimisée
  static getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      ...options,
      secure: true,
    });
  }

  // Upload depuis une URL
  static async uploadFromUrl(
    imageUrl: string,
    options: {
      folder?: string;
      public_id?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: options.folder || 'bipcosa06/products',
        public_id: options.public_id,
        overwrite: true,
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('Erreur upload depuis URL:', error);
      throw new Error('Échec de l\'upload depuis l\'URL');
    }
  }
}

export default CloudinaryService;