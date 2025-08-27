/**
 * Configuration de migration vers Cloudflare pour BIPCOSA06
 * Organisation par boutique GitHub
 */

const config = {
  // Informations de la boutique
  boutique: {
    name: 'BIPCOSA06',
    github_repo: 'bipcosa06',
    folder_prefix: 'bipcosa06' // Préfixe pour l'organisation dans Cloudflare
  },

  // Configuration Cloudflare
  cloudflare: {
    accountId: '7979421604bd07b3bd34d3ed96222512',
    apiToken: '61mW7CZfq0K6OdcYN9YIC4laRaZNLZAL1Lm4gFhh',
    
    // Cloudflare Stream (pour vidéos)
    stream: {
      baseUrl: 'https://api.cloudflare.com/client/v4',
      uploadEndpoint: '/accounts/{accountId}/stream',
      iframeBaseUrl: 'https://iframe.videodelivery.net'
    },
    
    // Cloudflare Images (pour photos)
    images: {
      baseUrl: 'https://api.cloudflare.com/client/v4',
      uploadEndpoint: '/accounts/{accountId}/images/v1',
      deliveryBaseUrl: 'https://imagedelivery.net',
      variantSuffix: 'public' // Variante par défaut
    }
  },

  // Configuration source actuelle (Cloudinary)
  cloudinary: {
    cloudName: 'dtjab1akq',
    folder: 'bipcosa06',
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

  // Options de migration
  migration: {
    batchSize: 10, // Nombre de fichiers à traiter en parallèle
    retryAttempts: 3,
    retryDelay: 1000, // ms
    
    // Organisation des dossiers dans Cloudflare
    folders: {
      videos: `bipcosa06/videos/`,
      images: `bipcosa06/images/`,
      products: `bipcosa06/products/`,
      thumbnails: `bipcosa06/thumbnails/`
    },
    
    // Métadonnées à ajouter
    metadata: {
      boutique: 'bipcosa06',
      source: 'cloudinary',
      migrated_at: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    }
  },

  // Mapping des formats
  formats: {
    video: {
      supported: ['mp4', 'webm', 'mov', 'avi', 'mkv'],
      targetFormat: 'mp4',
      quality: {
        default: 'auto',
        mobile: '720p',
        desktop: '1080p'
      }
    },
    image: {
      supported: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
      targetFormat: 'auto', // Cloudflare choisit le meilleur format
      variants: [
        { name: 'thumbnail', width: 150, height: 150 },
        { name: 'small', width: 400, height: 400 },
        { name: 'medium', width: 800, height: 800 },
        { name: 'large', width: 1920, height: 1080 },
        { name: 'original', width: null, height: null }
      ]
    }
  },

  // Configuration de logging
  logging: {
    level: 'info', // debug, info, warn, error
    file: 'migration-bipcosa06.log',
    console: true
  },

  // Chemins de sauvegarde
  output: {
    mappingFile: 'migration-mapping-bipcosa06.json',
    errorLog: 'migration-errors-bipcosa06.log',
    successLog: 'migration-success-bipcosa06.log'
  }
};

module.exports = config;