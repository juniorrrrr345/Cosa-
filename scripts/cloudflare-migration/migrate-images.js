#!/usr/bin/env node

/**
 * Script de migration des images vers Cloudflare Images
 * Boutique: BIPCOSA06
 */

const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const config = require('./config');

class ImageMigrator {
  constructor() {
    this.config = config;
    this.mapping = {};
    this.errors = [];
    this.successes = [];
  }

  /**
   * Logger avec niveaux
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      boutique: this.config.boutique.name,
      message,
      ...data
    };

    if (this.config.logging.console) {
      const emoji = {
        debug: '🔍',
        info: '🖼️',
        warn: '⚠️',
        error: '❌',
        success: '✅'
      }[level] || '📝';
      
      console.log(`${emoji} [${timestamp}] ${message}`, data);
    }

    return logEntry;
  }

  /**
   * Récupérer toutes les images depuis Cloudinary
   */
  async fetchCloudinaryImages() {
    this.log('info', 'Récupération des images depuis Cloudinary...');
    
    try {
      // Utiliser l'API Cloudinary pour lister les images
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudName}/resources/image`;
      
      const response = await fetch(cloudinaryUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.cloudinary.apiKey}:${this.config.cloudinary.apiSecret}`).toString('base64')}`
        }
      });

      if (!response.ok) {
        // Si pas d'API key, utiliser une méthode alternative
        this.log('warn', 'API Cloudinary non disponible, recherche dans le code source...');
        return await this.findImagesInCode();
      }

      const data = await response.json();
      const images = data.resources.filter(r => 
        r.folder && r.folder.startsWith(this.config.cloudinary.folder)
      );

      this.log('success', `${images.length} images trouvées dans Cloudinary`);
      return images;
    } catch (error) {
      this.log('error', 'Erreur lors de la récupération des images', { error: error.message });
      return await this.findImagesInCode();
    }
  }

  /**
   * Rechercher les images dans le code source et MongoDB
   */
  async findImagesInCode() {
    this.log('info', 'Recherche des images dans le code source et la base de données...');
    
    const images = [];
    const imageUrls = new Set();

    // 1. Parcourir les fichiers source
    const srcPath = path.join(process.cwd(), 'src');
    await this.scanDirectory(srcPath, imageUrls);

    // 2. Récupérer les images depuis MongoDB via l'API
    try {
      const productsResponse = await fetch('http://localhost:3000/api/products');
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        products.forEach(product => {
          if (product.image) imageUrls.add(product.image);
          if (product.images && Array.isArray(product.images)) {
            product.images.forEach(img => imageUrls.add(img));
          }
          if (product.thumbnail) imageUrls.add(product.thumbnail);
        });
      }
    } catch (error) {
      this.log('warn', 'Impossible de récupérer les produits depuis l\'API', { error: error.message });
    }

    // 3. Parcourir le dossier public
    const publicPath = path.join(process.cwd(), 'public');
    await this.scanPublicDirectory(publicPath, imageUrls);

    // Convertir les URLs en objets image
    for (const url of imageUrls) {
      if (this.isValidImageUrl(url)) {
        const publicId = this.extractPublicId(url);
        const format = this.getImageFormat(url);
        
        images.push({
          public_id: publicId,
          secure_url: url,
          format: format,
          resource_type: 'image',
          folder: this.extractFolder(url)
        });
      }
    }

    this.log('info', `${images.length} images trouvées dans le projet`);
    return images;
  }

  /**
   * Scanner le dossier public pour les images locales
   */
  async scanPublicDirectory(dirPath, imageUrls) {
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.')) {
          await this.scanPublicDirectory(filePath, imageUrls);
        } else if (this.isImageFile(file)) {
          // Ajouter le chemin relatif depuis public
          const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
          imageUrls.add(`/${relativePath}`);
        }
      }
    } catch (error) {
      this.log('warn', `Erreur lors du scan de ${dirPath}`, { error: error.message });
    }
  }

  /**
   * Scanner un répertoire pour trouver des URLs d'images
   */
  async scanDirectory(dirPath, imageUrls) {
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          await this.scanDirectory(filePath, imageUrls);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Rechercher les URLs d'images
          const urlRegex = /(?:https?:)?\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif|svg)/gi;
          const srcRegex = /src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif|svg))["']/gi;
          
          const urlMatches = content.match(urlRegex);
          const srcMatches = [...content.matchAll(srcRegex)].map(m => m[1]);
          
          if (urlMatches) {
            urlMatches.forEach(url => imageUrls.add(url));
          }
          if (srcMatches) {
            srcMatches.forEach(url => imageUrls.add(url));
          }
        }
      }
    } catch (error) {
      this.log('warn', `Erreur lors du scan de ${dirPath}`, { error: error.message });
    }
  }

  /**
   * Vérifier si c'est un fichier image
   */
  isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return this.config.formats.image.supported.includes(ext.substring(1));
  }

  /**
   * Vérifier si l'URL est une image valide
   */
  isValidImageUrl(url) {
    if (!url) return false;
    const imageExtensions = this.config.formats.image.supported;
    return imageExtensions.some(ext => url.toLowerCase().includes(`.${ext}`));
  }

  /**
   * Extraire le format de l'image
   */
  getImageFormat(url) {
    const match = url.match(/\.(\w+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : 'jpg';
  }

  /**
   * Extraire le dossier depuis l'URL
   */
  extractFolder(url) {
    if (url.includes('cloudinary')) {
      const match = url.match(/\/v\d+\/([^/]+)\//);
      return match ? match[1] : '';
    }
    return '';
  }

  /**
   * Extraire le public_id depuis une URL
   */
  extractPublicId(url) {
    if (url.includes('cloudinary')) {
      const match = url.match(/\/v\d+\/(.+)\.\w+$/);
      return match ? match[1] : path.basename(url, path.extname(url));
    }
    return path.basename(url, path.extname(url));
  }

  /**
   * Télécharger une image depuis une URL
   */
  async downloadImage(url, filename) {
    this.log('debug', `Téléchargement de ${filename}...`);
    
    try {
      // Gérer les URLs relatives
      let fullUrl = url;
      if (url.startsWith('/')) {
        // Image locale dans public
        const localPath = path.join(process.cwd(), 'public', url);
        const buffer = await fs.readFile(localPath);
        const tempPath = path.join('/tmp', filename);
        await fs.writeFile(tempPath, buffer);
        return tempPath;
      }
      
      // Image externe
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Échec du téléchargement: ${response.statusText}`);
      }
      
      const buffer = await response.buffer();
      const tempPath = path.join('/tmp', filename);
      await fs.writeFile(tempPath, buffer);
      
      return tempPath;
    } catch (error) {
      this.log('error', `Erreur téléchargement ${url}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Uploader une image vers Cloudflare Images
   */
  async uploadToCloudflareImages(image) {
    this.log('info', `Upload de ${image.public_id} vers Cloudflare Images...`);
    
    try {
      // Télécharger l'image
      const tempFile = await this.downloadImage(
        image.secure_url, 
        `${image.public_id}.${image.format}`
      );

      // Créer le formulaire pour l'upload
      const FormData = require('form-data');
      const form = new FormData();
      
      // Lire le fichier
      const fileBuffer = await fs.readFile(tempFile);
      form.append('file', fileBuffer, {
        filename: `${image.public_id}.${image.format}`,
        contentType: `image/${image.format}`
      });

      // Ajouter les métadonnées
      form.append('id', `${this.config.boutique.folder_prefix}-${image.public_id}`);
      form.append('metadata', JSON.stringify({
        boutique: this.config.boutique.name,
        github_repo: this.config.boutique.github_repo,
        original_public_id: image.public_id,
        folder: image.folder || this.config.migration.folders.images,
        migrated_from: 'cloudinary',
        migrated_at: new Date().toISOString()
      }));

      // Options d'upload
      form.append('requireSignedURLs', 'false');

      // Upload vers Cloudflare Images
      const uploadUrl = `${this.config.cloudflare.images.baseUrl}/accounts/${this.config.cloudflare.accountId}/images/v1`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.cloudflare.apiToken}`,
          ...form.getHeaders()
        },
        body: form
      });

      // Nettoyer le fichier temporaire
      await fs.unlink(tempFile).catch(() => {});

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload échoué: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const imageData = result.result;
        
        // Créer le mapping avec toutes les variantes
        const mapping = {
          original_url: image.secure_url,
          original_public_id: image.public_id,
          cloudflare_id: imageData.id,
          delivery_url: `${this.config.cloudflare.images.deliveryBaseUrl}/${this.config.cloudflare.accountId}/${imageData.id}/public`,
          variants: {
            thumbnail: `${this.config.cloudflare.images.deliveryBaseUrl}/${this.config.cloudflare.accountId}/${imageData.id}/thumbnail`,
            small: `${this.config.cloudflare.images.deliveryBaseUrl}/${this.config.cloudflare.accountId}/${imageData.id}/small`,
            medium: `${this.config.cloudflare.images.deliveryBaseUrl}/${this.config.cloudflare.accountId}/${imageData.id}/medium`,
            large: `${this.config.cloudflare.images.deliveryBaseUrl}/${this.config.cloudflare.accountId}/${imageData.id}/large`,
            original: `${this.config.cloudflare.images.deliveryBaseUrl}/${this.config.cloudflare.accountId}/${imageData.id}/original`
          },
          metadata: imageData.meta || {},
          uploaded: imageData.uploaded,
          boutique: this.config.boutique.name,
          migrated_at: new Date().toISOString()
        };

        this.mapping[image.public_id] = mapping;
        this.successes.push(mapping);
        
        this.log('success', `✅ Image migrée: ${image.public_id}`, {
          cloudflare_id: imageData.id,
          delivery_url: mapping.delivery_url
        });

        return mapping;
      } else {
        throw new Error(result.errors?.[0]?.message || 'Upload échoué');
      }
    } catch (error) {
      this.log('error', `Échec migration de ${image.public_id}`, { error: error.message });
      
      // Retry logic pour les erreurs temporaires
      if (error.message.includes('5') && this.config.migration.retryAttempts > 0) {
        this.log('info', `Nouvelle tentative pour ${image.public_id}...`);
        await new Promise(resolve => setTimeout(resolve, this.config.migration.retryDelay));
        return this.uploadToCloudflareImages(image);
      }
      
      this.errors.push({
        image: image.public_id,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }

  /**
   * Créer les variantes d'images dans Cloudflare
   */
  async createImageVariants() {
    this.log('info', 'Configuration des variantes d\'images...');
    
    for (const variant of this.config.formats.image.variants) {
      try {
        const variantData = {
          id: variant.name,
          options: {
            fit: 'scale-down',
            metadata: 'keep',
            quality: 85
          }
        };

        if (variant.width) variantData.options.width = variant.width;
        if (variant.height) variantData.options.height = variant.height;

        const response = await fetch(
          `${this.config.cloudflare.images.baseUrl}/accounts/${this.config.cloudflare.accountId}/images/v1/variants`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.config.cloudflare.apiToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(variantData)
          }
        );

        if (response.ok) {
          this.log('success', `Variante créée: ${variant.name}`);
        } else {
          const error = await response.text();
          this.log('warn', `Variante ${variant.name} peut déjà exister`, { error });
        }
      } catch (error) {
        this.log('warn', `Erreur création variante ${variant.name}`, { error: error.message });
      }
    }
  }

  /**
   * Migrer toutes les images
   */
  async migrateAll() {
    this.log('info', '🚀 Début de la migration des images pour BIPCOSA06');
    
    try {
      // Créer les variantes si nécessaire
      await this.createImageVariants();

      // Récupérer toutes les images
      const images = await this.fetchCloudinaryImages();
      
      if (images.length === 0) {
        this.log('warn', 'Aucune image trouvée à migrer');
        return;
      }

      this.log('info', `🖼️ ${images.length} images à migrer`);

      // Migrer par batch
      const batchSize = this.config.migration.batchSize;
      for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);
        
        this.log('info', `Traitement du batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(images.length/batchSize)}`);
        
        const promises = batch.map(image => 
          this.uploadToCloudflareImages(image).catch(error => {
            this.log('error', `Échec pour ${image.public_id}`, { error: error.message });
          })
        );
        
        await Promise.all(promises);
        
        // Pause entre les batchs
        if (i + batchSize < images.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Sauvegarder le mapping
      await this.saveMapping();
      
      // Afficher le résumé
      this.log('info', '📊 Résumé de la migration:', {
        total: images.length,
        succès: this.successes.length,
        échecs: this.errors.length
      });

      if (this.errors.length > 0) {
        this.log('warn', `⚠️ ${this.errors.length} erreurs lors de la migration`);
        await fs.writeFile(
          this.config.output.errorLog.replace('.log', '-images.log'),
          JSON.stringify(this.errors, null, 2)
        );
      }

      this.log('success', '✅ Migration des images terminée pour BIPCOSA06!');
      
    } catch (error) {
      this.log('error', 'Erreur fatale lors de la migration', { error: error.message });
      throw error;
    }
  }

  /**
   * Sauvegarder le mapping des URLs
   */
  async saveMapping() {
    const mappingFile = this.config.output.mappingFile.replace('.json', '-images.json');
    
    await fs.writeFile(
      mappingFile,
      JSON.stringify({
        boutique: this.config.boutique.name,
        type: 'images',
        timestamp: new Date().toISOString(),
        total: Object.keys(this.mapping).length,
        mapping: this.mapping
      }, null, 2)
    );
    
    this.log('success', `Mapping sauvegardé dans ${mappingFile}`);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const migrator = new ImageMigrator();
  
  migrator.migrateAll()
    .then(() => {
      console.log('✅ Migration des images complétée avec succès!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur lors de la migration:', error);
      process.exit(1);
    });
}

module.exports = ImageMigrator;