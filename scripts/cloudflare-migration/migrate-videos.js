#!/usr/bin/env node

/**
 * Script de migration des vidéos vers Cloudflare Stream
 * Boutique: BIPCOSA06
 */

const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const config = require('./config');

class VideoMigrator {
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
        info: '📹',
        warn: '⚠️',
        error: '❌',
        success: '✅'
      }[level] || '📝';
      
      console.log(`${emoji} [${timestamp}] ${message}`, data);
    }

    return logEntry;
  }

  /**
   * Récupérer toutes les vidéos depuis Cloudinary
   */
  async fetchCloudinaryVideos() {
    this.log('info', 'Récupération des vidéos depuis Cloudinary...');
    
    try {
      // Utiliser l'API Cloudinary pour lister les vidéos
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudName}/resources/video`;
      
      const response = await fetch(cloudinaryUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.cloudinary.apiKey}:${this.config.cloudinary.apiSecret}`).toString('base64')}`
        }
      });

      if (!response.ok) {
        // Si pas d'API key, utiliser une méthode alternative
        this.log('warn', 'API Cloudinary non disponible, recherche dans le code source...');
        return await this.findVideosInCode();
      }

      const data = await response.json();
      const videos = data.resources.filter(r => 
        r.folder && r.folder.startsWith(this.config.cloudinary.folder)
      );

      this.log('success', `${videos.length} vidéos trouvées dans Cloudinary`);
      return videos;
    } catch (error) {
      this.log('error', 'Erreur lors de la récupération des vidéos', { error: error.message });
      return await this.findVideosInCode();
    }
  }

  /**
   * Rechercher les vidéos dans le code source
   */
  async findVideosInCode() {
    this.log('info', 'Recherche des vidéos dans le code source...');
    
    const videos = [];
    const videoUrls = new Set();

    // Parcourir les fichiers source
    const srcPath = path.join(process.cwd(), 'src');
    await this.scanDirectory(srcPath, videoUrls);

    // Convertir les URLs en objets vidéo
    for (const url of videoUrls) {
      if (url.includes('cloudinary') && (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov'))) {
        const publicId = this.extractPublicId(url);
        videos.push({
          public_id: publicId,
          secure_url: url,
          format: path.extname(url).substring(1),
          resource_type: 'video'
        });
      }
    }

    this.log('info', `${videos.length} vidéos trouvées dans le code`);
    return videos;
  }

  /**
   * Scanner un répertoire pour trouver des URLs de vidéos
   */
  async scanDirectory(dirPath, videoUrls) {
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          await this.scanDirectory(filePath, videoUrls);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Rechercher les URLs de vidéos
          const urlRegex = /https?:\/\/[^\s"'<>]+\.(mp4|webm|mov|avi)/gi;
          const matches = content.match(urlRegex);
          
          if (matches) {
            matches.forEach(url => videoUrls.add(url));
          }
        }
      }
    } catch (error) {
      this.log('warn', `Erreur lors du scan de ${dirPath}`, { error: error.message });
    }
  }

  /**
   * Extraire le public_id depuis une URL Cloudinary
   */
  extractPublicId(url) {
    const match = url.match(/\/v\d+\/(.+)\.\w+$/);
    return match ? match[1] : path.basename(url, path.extname(url));
  }

  /**
   * Télécharger une vidéo depuis une URL
   */
  async downloadVideo(url, filename) {
    this.log('debug', `Téléchargement de ${filename}...`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Échec du téléchargement: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    const tempPath = path.join('/tmp', filename);
    await fs.writeFile(tempPath, buffer);
    
    return tempPath;
  }

  /**
   * Uploader une vidéo vers Cloudflare Stream
   */
  async uploadToCloudflareStream(video) {
    this.log('info', `Upload de ${video.public_id} vers Cloudflare Stream...`);
    
    try {
      // Télécharger la vidéo depuis Cloudinary
      const tempFile = await this.downloadVideo(
        video.secure_url, 
        `${video.public_id}.${video.format}`
      );

      // Créer le formulaire pour l'upload
      const FormData = require('form-data');
      const form = new FormData();
      
      // Lire le fichier
      const fileBuffer = await fs.readFile(tempFile);
      form.append('file', fileBuffer, {
        filename: `${video.public_id}.${video.format}`,
        contentType: `video/${video.format}`
      });

      // Ajouter les métadonnées
      const metadata = {
        name: `${this.config.boutique.folder_prefix}/${video.public_id}`,
        meta: {
          boutique: this.config.boutique.name,
          github_repo: this.config.boutique.github_repo,
          original_public_id: video.public_id,
          migrated_from: 'cloudinary',
          migrated_at: new Date().toISOString()
        }
      };

      // Upload vers Cloudflare Stream
      const uploadUrl = `${this.config.cloudflare.stream.baseUrl}/accounts/${this.config.cloudflare.accountId}/stream`;
      
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
        const streamData = result.result;
        
        // Créer le mapping
        const mapping = {
          original_url: video.secure_url,
          original_public_id: video.public_id,
          cloudflare_id: streamData.uid,
          cloudflare_playback_id: streamData.playback?.hls || streamData.uid,
          iframe_url: `${this.config.cloudflare.stream.iframeBaseUrl}/${streamData.uid}`,
          hls_url: streamData.playback?.hls,
          dash_url: streamData.playback?.dash,
          thumbnail: streamData.thumbnail,
          duration: streamData.duration,
          size: streamData.size,
          status: streamData.status?.state || 'processing',
          boutique: this.config.boutique.name,
          migrated_at: new Date().toISOString()
        };

        this.mapping[video.public_id] = mapping;
        this.successes.push(mapping);
        
        this.log('success', `✅ Vidéo migrée: ${video.public_id}`, {
          cloudflare_id: streamData.uid,
          iframe_url: mapping.iframe_url
        });

        return mapping;
      } else {
        throw new Error(result.errors?.[0]?.message || 'Upload échoué');
      }
    } catch (error) {
      this.log('error', `Échec migration de ${video.public_id}`, { error: error.message });
      
      this.errors.push({
        video: video.public_id,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }

  /**
   * Migrer toutes les vidéos
   */
  async migrateAll() {
    this.log('info', '🚀 Début de la migration des vidéos pour BIPCOSA06');
    
    try {
      // Récupérer toutes les vidéos
      const videos = await this.fetchCloudinaryVideos();
      
      if (videos.length === 0) {
        this.log('warn', 'Aucune vidéo trouvée à migrer');
        return;
      }

      this.log('info', `📹 ${videos.length} vidéos à migrer`);

      // Migrer par batch
      const batchSize = this.config.migration.batchSize;
      for (let i = 0; i < videos.length; i += batchSize) {
        const batch = videos.slice(i, i + batchSize);
        
        this.log('info', `Traitement du batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(videos.length/batchSize)}`);
        
        const promises = batch.map(video => 
          this.uploadToCloudflareStream(video).catch(error => {
            this.log('error', `Échec pour ${video.public_id}`, { error: error.message });
          })
        );
        
        await Promise.all(promises);
        
        // Pause entre les batchs pour éviter la surcharge
        if (i + batchSize < videos.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Sauvegarder le mapping
      await this.saveMapping();
      
      // Afficher le résumé
      this.log('info', '📊 Résumé de la migration:', {
        total: videos.length,
        succès: this.successes.length,
        échecs: this.errors.length
      });

      if (this.errors.length > 0) {
        this.log('warn', `⚠️ ${this.errors.length} erreurs lors de la migration`);
        await fs.writeFile(
          this.config.output.errorLog,
          JSON.stringify(this.errors, null, 2)
        );
      }

      this.log('success', '✅ Migration des vidéos terminée pour BIPCOSA06!');
      
    } catch (error) {
      this.log('error', 'Erreur fatale lors de la migration', { error: error.message });
      throw error;
    }
  }

  /**
   * Sauvegarder le mapping des URLs
   */
  async saveMapping() {
    const mappingFile = this.config.output.mappingFile;
    
    await fs.writeFile(
      mappingFile,
      JSON.stringify({
        boutique: this.config.boutique.name,
        type: 'videos',
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
  const migrator = new VideoMigrator();
  
  migrator.migrateAll()
    .then(() => {
      console.log('✅ Migration des vidéos complétée avec succès!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur lors de la migration:', error);
      process.exit(1);
    });
}

module.exports = VideoMigrator;