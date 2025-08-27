#!/usr/bin/env node

/**
 * Script de mise à jour automatique des URLs après migration
 * Boutique: BIPCOSA06
 */

const fs = require('fs').promises;
const path = require('path');

class UrlUpdater {
  constructor() {
    this.videoMapping = {};
    this.imageMapping = {};
    this.updatedFiles = [];
    this.stats = {
      filesProcessed: 0,
      urlsReplaced: 0,
      errors: []
    };
  }

  /**
   * Logger
   */
  log(level, message, data = {}) {
    const emoji = {
      info: '📝',
      success: '✅',
      warn: '⚠️',
      error: '❌'
    }[level] || '📌';
    
    console.log(`${emoji} ${message}`, data);
  }

  /**
   * Charger les mappings depuis les fichiers JSON
   */
  async loadMappings() {
    try {
      // Charger le mapping des vidéos
      const videoMappingFile = 'migration-mapping-bipcosa06.json';
      if (await this.fileExists(videoMappingFile)) {
        const videoData = JSON.parse(await fs.readFile(videoMappingFile, 'utf-8'));
        this.videoMapping = videoData.mapping || {};
        this.log('success', `${Object.keys(this.videoMapping).length} mappings vidéo chargés`);
      }

      // Charger le mapping des images
      const imageMappingFile = 'migration-mapping-bipcosa06-images.json';
      if (await this.fileExists(imageMappingFile)) {
        const imageData = JSON.parse(await fs.readFile(imageMappingFile, 'utf-8'));
        this.imageMapping = imageData.mapping || {};
        this.log('success', `${Object.keys(this.imageMapping).length} mappings image chargés`);
      }

      if (Object.keys(this.videoMapping).length === 0 && Object.keys(this.imageMapping).length === 0) {
        throw new Error('Aucun mapping trouvé. Veuillez d\'abord exécuter les scripts de migration.');
      }
    } catch (error) {
      this.log('error', 'Erreur lors du chargement des mappings', { error: error.message });
      throw error;
    }
  }

  /**
   * Vérifier si un fichier existe
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Créer une map de toutes les URLs à remplacer
   */
  createUrlReplacementMap() {
    const replacements = new Map();

    // Ajouter les vidéos
    Object.entries(this.videoMapping).forEach(([publicId, mapping]) => {
      if (mapping.original_url && mapping.iframe_url) {
        replacements.set(mapping.original_url, mapping.iframe_url);
        
        // Ajouter aussi les variations possibles de l'URL
        const variations = this.generateUrlVariations(mapping.original_url);
        variations.forEach(variant => {
          replacements.set(variant, mapping.iframe_url);
        });
      }
    });

    // Ajouter les images
    Object.entries(this.imageMapping).forEach(([publicId, mapping]) => {
      if (mapping.original_url && mapping.delivery_url) {
        replacements.set(mapping.original_url, mapping.delivery_url);
        
        // Ajouter les variations
        const variations = this.generateUrlVariations(mapping.original_url);
        variations.forEach(variant => {
          replacements.set(variant, mapping.delivery_url);
        });
      }
    });

    this.log('info', `${replacements.size} URLs à remplacer`);
    return replacements;
  }

  /**
   * Générer les variations possibles d'une URL
   */
  generateUrlVariations(url) {
    const variations = [];
    
    try {
      // Version sans protocole
      variations.push(url.replace(/^https?:/, ''));
      
      // Version avec protocole opposé
      if (url.startsWith('https://')) {
        variations.push(url.replace('https://', 'http://'));
      } else if (url.startsWith('http://')) {
        variations.push(url.replace('http://', 'https://'));
      }
      
      // Version avec transformations Cloudinary
      if (url.includes('cloudinary')) {
        // Sans transformations
        const cleanUrl = url.replace(/\/v\d+\//, '/').replace(/\/upload\/[^/]+\//, '/upload/');
        variations.push(cleanUrl);
        
        // Avec différentes transformations communes
        const transforms = ['w_800,h_600', 'q_auto', 'f_auto', 'c_fill'];
        transforms.forEach(transform => {
          const transformUrl = url.replace('/upload/', `/upload/${transform}/`);
          variations.push(transformUrl);
        });
      }
    } catch (error) {
      this.log('warn', 'Erreur génération variations', { url, error: error.message });
    }
    
    return variations;
  }

  /**
   * Mettre à jour un fichier avec les nouvelles URLs
   */
  async updateFile(filePath, replacements) {
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      let replacedCount = 0;
      let modified = false;

      // Remplacer toutes les URLs
      replacements.forEach((newUrl, oldUrl) => {
        // Échapper les caractères spéciaux pour regex
        const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedOldUrl, 'g');
        
        const matches = content.match(regex);
        if (matches) {
          content = content.replace(regex, newUrl);
          replacedCount += matches.length;
          modified = true;
        }
      });

      // Si le fichier a été modifié, le sauvegarder
      if (modified) {
        // Créer une backup
        const backupPath = `${filePath}.backup-${Date.now()}`;
        await fs.writeFile(backupPath, await fs.readFile(filePath, 'utf-8'));
        
        // Écrire le nouveau contenu
        await fs.writeFile(filePath, content);
        
        this.updatedFiles.push({
          path: filePath,
          replacements: replacedCount,
          backup: backupPath
        });
        
        this.stats.urlsReplaced += replacedCount;
        
        this.log('success', `Fichier mis à jour: ${filePath}`, { replacements: replacedCount });
        
        // Pour les fichiers spéciaux, appliquer des transformations supplémentaires
        if (this.needsSpecialHandling(filePath)) {
          await this.applySpecialTransformations(filePath, content);
        }
      }
      
      return replacedCount;
    } catch (error) {
      this.log('error', `Erreur mise à jour ${filePath}`, { error: error.message });
      this.stats.errors.push({ file: filePath, error: error.message });
      throw error;
    }
  }

  /**
   * Vérifier si un fichier nécessite un traitement spécial
   */
  needsSpecialHandling(filePath) {
    const specialFiles = [
      'ProductDetailPage',
      'AdminPanel',
      'HomePage',
      'dataService'
    ];
    
    return specialFiles.some(name => filePath.includes(name));
  }

  /**
   * Appliquer des transformations spéciales pour certains fichiers
   */
  async applySpecialTransformations(filePath, content) {
    try {
      let updatedContent = content;

      // Pour les vidéos Cloudflare Stream, transformer en iframe
      if (content.includes('iframe.videodelivery.net')) {
        this.log('info', 'Application des transformations pour les iframes vidéo...');
        
        // Remplacer les balises video par des iframes
        updatedContent = updatedContent.replace(
          /<video[^>]*src=["']([^"']*iframe\.videodelivery\.net[^"']*)["'][^>]*>.*?<\/video>/gs,
          (match, url) => {
            return `<iframe 
              src="${url}"
              style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowfullscreen="true"
            ></iframe>`;
          }
        );

        // Ajouter un wrapper responsive si nécessaire
        updatedContent = updatedContent.replace(
          /(<iframe[^>]*iframe\.videodelivery\.net[^>]*><\/iframe>)/g,
          '<div style="position: relative; padding-top: 56.25%;">$1</div>'
        );
      }

      // Pour les images Cloudflare, optimiser les URLs avec des variantes
      if (content.includes('imagedelivery.net')) {
        this.log('info', 'Optimisation des URLs d\'images Cloudflare...');
        
        // Ajouter les variantes appropriées selon le contexte
        updatedContent = updatedContent.replace(
          /imagedelivery\.net\/([^/]+)\/([^/]+)\/public/g,
          (match, accountId, imageId) => {
            // Déterminer la variante selon le contexte
            if (filePath.includes('thumbnail') || content.includes('thumbnail')) {
              return `imagedelivery.net/${accountId}/${imageId}/thumbnail`;
            } else if (filePath.includes('ProductDetail')) {
              return `imagedelivery.net/${accountId}/${imageId}/large`;
            } else {
              return `imagedelivery.net/${accountId}/${imageId}/medium`;
            }
          }
        );
      }

      // Si des modifications ont été faites, sauvegarder
      if (updatedContent !== content) {
        await fs.writeFile(filePath, updatedContent);
        this.log('success', 'Transformations spéciales appliquées', { file: path.basename(filePath) });
      }
    } catch (error) {
      this.log('error', 'Erreur lors des transformations spéciales', { error: error.message });
    }
  }

  /**
   * Scanner et mettre à jour tous les fichiers du projet
   */
  async scanAndUpdate(dirPath, replacements) {
    try {
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          // Ignorer certains dossiers
          const ignoreDirs = ['.git', 'node_modules', '.next', 'dist', 'build', '.vercel'];
          if (!ignoreDirs.includes(file)) {
            await this.scanAndUpdate(filePath, replacements);
          }
        } else if (this.shouldProcessFile(file)) {
          this.stats.filesProcessed++;
          await this.updateFile(filePath, replacements);
        }
      }
    } catch (error) {
      this.log('error', `Erreur scan ${dirPath}`, { error: error.message });
    }
  }

  /**
   * Vérifier si un fichier doit être traité
   */
  shouldProcessFile(filename) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.scss'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  /**
   * Mettre à jour la base de données MongoDB
   */
  async updateDatabase() {
    this.log('info', 'Mise à jour de la base de données...');
    
    try {
      // Créer un script de mise à jour MongoDB
      const updateScript = `
// Script de mise à jour MongoDB pour BIPCOSA06
// Généré automatiquement le ${new Date().toISOString()}

const videoMapping = ${JSON.stringify(this.videoMapping, null, 2)};
const imageMapping = ${JSON.stringify(this.imageMapping, null, 2)};

async function updateProducts() {
  const { MongoClient } = require('mongodb');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bipcosa06';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('bipcosa06');
    const products = db.collection('products');
    
    // Récupérer tous les produits
    const allProducts = await products.find({}).toArray();
    
    for (const product of allProducts) {
      let updated = false;
      const updates = {};
      
      // Mettre à jour l'image principale
      if (product.image) {
        Object.values(imageMapping).forEach(mapping => {
          if (product.image === mapping.original_url) {
            updates.image = mapping.delivery_url;
            updated = true;
          }
        });
      }
      
      // Mettre à jour le tableau d'images
      if (product.images && Array.isArray(product.images)) {
        updates.images = product.images.map(img => {
          for (const mapping of Object.values(imageMapping)) {
            if (img === mapping.original_url) {
              return mapping.delivery_url;
            }
          }
          return img;
        });
        if (JSON.stringify(updates.images) !== JSON.stringify(product.images)) {
          updated = true;
        }
      }
      
      // Mettre à jour les vidéos
      if (product.video) {
        Object.values(videoMapping).forEach(mapping => {
          if (product.video === mapping.original_url) {
            updates.video = mapping.iframe_url;
            updates.videoType = 'cloudflare-stream';
            updated = true;
          }
        });
      }
      
      // Appliquer les mises à jour
      if (updated) {
        await products.updateOne(
          { _id: product._id },
          { $set: updates }
        );
        console.log(\`✅ Produit mis à jour: \${product.name}\`);
      }
    }
    
    console.log('✅ Base de données mise à jour avec succès!');
  } catch (error) {
    console.error('❌ Erreur mise à jour base de données:', error);
  } finally {
    await client.close();
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  updateProducts();
}

module.exports = { updateProducts, videoMapping, imageMapping };
`;

      await fs.writeFile('update-mongodb-bipcosa06.js', updateScript);
      this.log('success', 'Script de mise à jour MongoDB créé: update-mongodb-bipcosa06.js');
      
    } catch (error) {
      this.log('error', 'Erreur création script MongoDB', { error: error.message });
    }
  }

  /**
   * Générer un rapport de migration
   */
  async generateReport() {
    const report = {
      boutique: 'BIPCOSA06',
      timestamp: new Date().toISOString(),
      stats: this.stats,
      updatedFiles: this.updatedFiles,
      videoMappings: Object.keys(this.videoMapping).length,
      imageMappings: Object.keys(this.imageMapping).length,
      recommendations: []
    };

    // Ajouter des recommandations
    if (this.stats.errors.length > 0) {
      report.recommendations.push('⚠️ Vérifier manuellement les fichiers avec erreurs');
    }
    
    if (this.stats.urlsReplaced === 0) {
      report.recommendations.push('⚠️ Aucune URL remplacée - vérifier les mappings');
    }
    
    report.recommendations.push('✅ Exécuter update-mongodb-bipcosa06.js pour mettre à jour la base de données');
    report.recommendations.push('✅ Tester l\'application localement avant de déployer');
    report.recommendations.push('✅ Vérifier que les iframes vidéo s\'affichent correctement');
    report.recommendations.push('✅ Vérifier que les images utilisent les bonnes variantes');

    // Sauvegarder le rapport
    const reportPath = `migration-report-bipcosa06-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Afficher le résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE MIGRATION - BIPCOSA06');
    console.log('='.repeat(60));
    console.log(`📁 Fichiers traités: ${this.stats.filesProcessed}`);
    console.log(`🔄 URLs remplacées: ${this.stats.urlsReplaced}`);
    console.log(`✅ Fichiers mis à jour: ${this.updatedFiles.length}`);
    console.log(`❌ Erreurs: ${this.stats.errors.length}`);
    console.log('\n📋 Recommandations:');
    report.recommendations.forEach(rec => console.log(`  ${rec}`));
    console.log('\n📄 Rapport complet sauvegardé:', reportPath);
    console.log('='.repeat(60) + '\n');
    
    return report;
  }

  /**
   * Exécuter la mise à jour complète
   */
  async run() {
    try {
      this.log('info', '🚀 Début de la mise à jour des URLs pour BIPCOSA06');
      
      // Charger les mappings
      await this.loadMappings();
      
      // Créer la map de remplacement
      const replacements = this.createUrlReplacementMap();
      
      if (replacements.size === 0) {
        this.log('warn', 'Aucune URL à remplacer trouvée');
        return;
      }
      
      // Scanner et mettre à jour les fichiers
      this.log('info', 'Scan et mise à jour des fichiers...');
      await this.scanAndUpdate(process.cwd(), replacements);
      
      // Créer le script de mise à jour MongoDB
      await this.updateDatabase();
      
      // Générer le rapport
      await this.generateReport();
      
      this.log('success', '✅ Mise à jour des URLs terminée avec succès!');
      
    } catch (error) {
      this.log('error', 'Erreur fatale', { error: error.message });
      throw error;
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const updater = new UrlUpdater();
  
  updater.run()
    .then(() => {
      console.log('✅ Mise à jour complétée!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = UrlUpdater;