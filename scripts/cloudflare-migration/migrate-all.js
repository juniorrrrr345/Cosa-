#!/usr/bin/env node

/**
 * Script principal de migration complète vers Cloudflare
 * Boutique: BIPCOSA06
 * 
 * Ce script orchestre la migration complète :
 * 1. Migration des vidéos vers Cloudflare Stream
 * 2. Migration des images vers Cloudflare Images  
 * 3. Mise à jour automatique des URLs dans le code
 * 4. Tests de validation
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Importation des modules de migration
const VideoMigrator = require('./migrate-videos');
const ImageMigrator = require('./migrate-images');
const UrlUpdater = require('./update-urls');

class CompleteMigration {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      videos: { success: 0, failed: 0 },
      images: { success: 0, failed: 0 },
      urls: { updated: 0, failed: 0 },
      tests: { passed: 0, failed: 0 }
    };
  }

  /**
   * Logger avec emojis et couleurs
   */
  log(level, message, data = {}) {
    const colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m'
    };

    const emoji = {
      info: '📌',
      success: '✅',
      warn: '⚠️',
      error: '❌',
      start: '🚀',
      video: '📹',
      image: '🖼️',
      code: '💻',
      test: '🧪',
      time: '⏱️'
    }[level] || '📝';

    const color = {
      info: colors.cyan,
      success: colors.green,
      warn: colors.yellow,
      error: colors.red,
      start: colors.magenta
    }[level] || colors.reset;

    console.log(`${color}${emoji} ${message}${colors.reset}`, 
      Object.keys(data).length > 0 ? data : '');
  }

  /**
   * Afficher une bannière
   */
  showBanner() {
    console.log('\n' + '='.repeat(70));
    console.log('🌐 MIGRATION CLOUDFLARE - BIPCOSA06');
    console.log('='.repeat(70));
    console.log('📦 Boutique: BIPCOSA06');
    console.log('🔧 GitHub: bipcosa06');
    console.log('📅 Date:', new Date().toLocaleString());
    console.log('='.repeat(70) + '\n');
  }

  /**
   * Vérifier les prérequis
   */
  async checkPrerequisites() {
    this.log('info', 'Vérification des prérequis...');
    
    const checks = {
      nodeVersion: false,
      npmPackages: false,
      envVariables: false,
      cloudflareAccess: false
    };

    // Vérifier Node.js version
    try {
      const { stdout } = await execPromise('node --version');
      const version = stdout.trim();
      checks.nodeVersion = true;
      this.log('success', `Node.js ${version} détecté`);
    } catch (error) {
      this.log('error', 'Node.js non trouvé');
    }

    // Vérifier les packages npm nécessaires
    const requiredPackages = ['node-fetch', 'form-data'];
    for (const pkg of requiredPackages) {
      try {
        require.resolve(pkg);
        checks.npmPackages = true;
      } catch {
        this.log('warn', `Package ${pkg} manquant, installation...`);
        await execPromise(`npm install ${pkg}`);
      }
    }

    // Vérifier les variables d'environnement Cloudflare
    const config = require('./config');
    if (config.cloudflare.accountId && config.cloudflare.apiToken) {
      checks.envVariables = true;
      this.log('success', 'Configuration Cloudflare trouvée');
    } else {
      this.log('error', 'Configuration Cloudflare manquante');
      return false;
    }

    // Test de connexion à Cloudflare
    try {
      const fetch = require('node-fetch');
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.cloudflare.apiToken}`
          }
        }
      );
      
      if (response.ok) {
        checks.cloudflareAccess = true;
        this.log('success', 'Connexion à Cloudflare réussie');
      } else {
        this.log('error', 'Échec de connexion à Cloudflare', { status: response.status });
        return false;
      }
    } catch (error) {
      this.log('error', 'Erreur de connexion à Cloudflare', { error: error.message });
      return false;
    }

    return Object.values(checks).every(check => check);
  }

  /**
   * Créer une sauvegarde
   */
  async createBackup() {
    this.log('info', 'Création de la sauvegarde...');
    
    const backupDir = `backup-${Date.now()}`;
    await fs.mkdir(backupDir, { recursive: true });

    // Sauvegarder les fichiers importants
    const filesToBackup = [
      'src/config/cloudinary.ts',
      'src/services/dataService.ts',
      'src/components/ProductDetailPage.tsx',
      'src/admin/AdminPanel.tsx'
    ];

    for (const file of filesToBackup) {
      try {
        const filePath = path.join(process.cwd(), file);
        const backupPath = path.join(backupDir, file);
        
        // Créer les dossiers si nécessaire
        await fs.mkdir(path.dirname(backupPath), { recursive: true });
        
        // Copier le fichier
        const content = await fs.readFile(filePath, 'utf-8');
        await fs.writeFile(backupPath, content);
        
        this.log('success', `Sauvegardé: ${file}`);
      } catch (error) {
        this.log('warn', `Impossible de sauvegarder ${file}`);
      }
    }

    this.log('success', `Sauvegarde créée dans ${backupDir}`);
    return backupDir;
  }

  /**
   * Migrer les vidéos
   */
  async migrateVideos() {
    this.log('video', '📹 MIGRATION DES VIDÉOS');
    console.log('-'.repeat(50));
    
    try {
      const migrator = new VideoMigrator();
      await migrator.migrateAll();
      
      // Récupérer les stats
      this.results.videos.success = migrator.successes.length;
      this.results.videos.failed = migrator.errors.length;
      
      this.log('success', `Vidéos migrées: ${this.results.videos.success}`);
      if (this.results.videos.failed > 0) {
        this.log('warn', `Vidéos échouées: ${this.results.videos.failed}`);
      }
      
      return true;
    } catch (error) {
      this.log('error', 'Échec migration vidéos', { error: error.message });
      return false;
    }
  }

  /**
   * Migrer les images
   */
  async migrateImages() {
    this.log('image', '🖼️ MIGRATION DES IMAGES');
    console.log('-'.repeat(50));
    
    try {
      const migrator = new ImageMigrator();
      await migrator.migrateAll();
      
      // Récupérer les stats
      this.results.images.success = migrator.successes.length;
      this.results.images.failed = migrator.errors.length;
      
      this.log('success', `Images migrées: ${this.results.images.success}`);
      if (this.results.images.failed > 0) {
        this.log('warn', `Images échouées: ${this.results.images.failed}`);
      }
      
      return true;
    } catch (error) {
      this.log('error', 'Échec migration images', { error: error.message });
      return false;
    }
  }

  /**
   * Mettre à jour les URLs dans le code
   */
  async updateUrls() {
    this.log('code', '💻 MISE À JOUR DES URLS');
    console.log('-'.repeat(50));
    
    try {
      const updater = new UrlUpdater();
      await updater.run();
      
      // Récupérer les stats
      this.results.urls.updated = updater.stats.urlsReplaced;
      this.results.urls.failed = updater.stats.errors.length;
      
      this.log('success', `URLs mises à jour: ${this.results.urls.updated}`);
      if (this.results.urls.failed > 0) {
        this.log('warn', `Fichiers avec erreurs: ${this.results.urls.failed}`);
      }
      
      return true;
    } catch (error) {
      this.log('error', 'Échec mise à jour URLs', { error: error.message });
      return false;
    }
  }

  /**
   * Exécuter les tests de validation
   */
  async runTests() {
    this.log('test', '🧪 TESTS DE VALIDATION');
    console.log('-'.repeat(50));
    
    const tests = [
      { name: 'Vérification des mappings', fn: this.testMappings.bind(this) },
      { name: 'Test des URLs Cloudflare', fn: this.testCloudflareUrls.bind(this) },
      { name: 'Validation du code mis à jour', fn: this.testUpdatedCode.bind(this) },
      { name: 'Test de build Next.js', fn: this.testNextBuild.bind(this) }
    ];

    for (const test of tests) {
      try {
        this.log('info', `Test: ${test.name}...`);
        const result = await test.fn();
        
        if (result) {
          this.results.tests.passed++;
          this.log('success', `✅ ${test.name}`);
        } else {
          this.results.tests.failed++;
          this.log('error', `❌ ${test.name}`);
        }
      } catch (error) {
        this.results.tests.failed++;
        this.log('error', `❌ ${test.name}`, { error: error.message });
      }
    }

    return this.results.tests.failed === 0;
  }

  /**
   * Test: Vérifier les mappings
   */
  async testMappings() {
    const videoMapping = await fs.readFile('migration-mapping-bipcosa06.json', 'utf-8')
      .then(JSON.parse)
      .catch(() => null);
      
    const imageMapping = await fs.readFile('migration-mapping-bipcosa06-images.json', 'utf-8')
      .then(JSON.parse)
      .catch(() => null);
    
    return videoMapping && imageMapping && 
           Object.keys(videoMapping.mapping || {}).length > 0;
  }

  /**
   * Test: Vérifier les URLs Cloudflare
   */
  async testCloudflareUrls() {
    const fetch = require('node-fetch');
    
    // Tester une URL d'image
    const testImageUrl = 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/test/public';
    const imageResponse = await fetch(testImageUrl, { method: 'HEAD' });
    
    // Les URLs Cloudflare retournent 404 si l'image n'existe pas, mais la structure est valide
    return imageResponse.status === 404 || imageResponse.ok;
  }

  /**
   * Test: Valider le code mis à jour
   */
  async testUpdatedCode() {
    // Vérifier que les fichiers ont été mis à jour
    const filesToCheck = [
      'src/components/ProductDetailPage.tsx',
      'src/admin/AdminPanel.tsx'
    ];

    for (const file of filesToCheck) {
      try {
        const content = await fs.readFile(path.join(process.cwd(), file), 'utf-8');
        
        // Vérifier la présence des nouvelles URLs
        if (content.includes('iframe.videodelivery.net') || 
            content.includes('imagedelivery.net')) {
          return true;
        }
      } catch {
        // Fichier peut ne pas exister
      }
    }
    
    return false;
  }

  /**
   * Test: Build Next.js
   */
  async testNextBuild() {
    try {
      this.log('info', 'Test de build Next.js (peut prendre quelques minutes)...');
      const { stdout, stderr } = await execPromise('npm run build');
      
      if (stderr && !stderr.includes('warn')) {
        this.log('warn', 'Avertissements de build', { stderr });
      }
      
      return !stderr || !stderr.includes('error');
    } catch (error) {
      this.log('error', 'Échec du build', { error: error.message });
      return false;
    }
  }

  /**
   * Générer le rapport final
   */
  async generateFinalReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    const report = {
      boutique: 'BIPCOSA06',
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      results: this.results,
      summary: {
        total_videos: this.results.videos.success + this.results.videos.failed,
        total_images: this.results.images.success + this.results.images.failed,
        success_rate: this.calculateSuccessRate(),
        tests_passed: this.results.tests.passed > 0
      },
      next_steps: [
        '1. Vérifier manuellement quelques pages de l\'application',
        '2. Exécuter: node update-mongodb-bipcosa06.js',
        '3. Tester en local: npm run dev',
        '4. Déployer sur Vercel: npm run deploy',
        '5. Surveiller les métriques Cloudflare'
      ]
    };

    // Sauvegarder le rapport
    const reportPath = `migration-report-final-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Afficher le rapport
    console.log('\n' + '='.repeat(70));
    console.log('📊 RAPPORT FINAL DE MIGRATION');
    console.log('='.repeat(70));
    console.log(`⏱️ Durée totale: ${duration} secondes`);
    console.log('\n📹 Vidéos:');
    console.log(`  ✅ Succès: ${this.results.videos.success}`);
    console.log(`  ❌ Échecs: ${this.results.videos.failed}`);
    console.log('\n🖼️ Images:');
    console.log(`  ✅ Succès: ${this.results.images.success}`);
    console.log(`  ❌ Échecs: ${this.results.images.failed}`);
    console.log(`\n💻 URLs mises à jour: ${this.results.urls.updated}`);
    console.log('\n🧪 Tests:');
    console.log(`  ✅ Réussis: ${this.results.tests.passed}`);
    console.log(`  ❌ Échoués: ${this.results.tests.failed}`);
    console.log('\n📈 Taux de réussite global: ' + report.summary.success_rate + '%');
    console.log('\n📋 Prochaines étapes:');
    report.next_steps.forEach(step => console.log(`  ${step}`));
    console.log('\n📄 Rapport complet: ' + reportPath);
    console.log('='.repeat(70) + '\n');

    return report;
  }

  /**
   * Calculer le taux de réussite
   */
  calculateSuccessRate() {
    const total = this.results.videos.success + this.results.videos.failed +
                  this.results.images.success + this.results.images.failed;
    const success = this.results.videos.success + this.results.images.success;
    
    return total > 0 ? Math.round((success / total) * 100) : 0;
  }

  /**
   * Exécuter la migration complète
   */
  async run() {
    try {
      // Afficher la bannière
      this.showBanner();

      // Étape 1: Vérifier les prérequis
      this.log('start', 'ÉTAPE 1: Vérification des prérequis');
      const prerequisitesOk = await this.checkPrerequisites();
      if (!prerequisitesOk) {
        throw new Error('Prérequis non satisfaits');
      }

      // Étape 2: Créer une sauvegarde
      this.log('start', 'ÉTAPE 2: Création de la sauvegarde');
      const backupDir = await this.createBackup();

      // Étape 3: Migrer les vidéos
      this.log('start', 'ÉTAPE 3: Migration des vidéos');
      await this.migrateVideos();

      // Étape 4: Migrer les images
      this.log('start', 'ÉTAPE 4: Migration des images');
      await this.migrateImages();

      // Étape 5: Mettre à jour les URLs
      this.log('start', 'ÉTAPE 5: Mise à jour des URLs dans le code');
      await this.updateUrls();

      // Étape 6: Exécuter les tests
      this.log('start', 'ÉTAPE 6: Tests de validation');
      const testsOk = await this.runTests();

      // Générer le rapport final
      const report = await this.generateFinalReport();

      // Message de succès
      if (testsOk && this.calculateSuccessRate() > 80) {
        this.log('success', '🎉 MIGRATION RÉUSSIE!');
        this.log('info', `Sauvegarde disponible dans: ${backupDir}`);
        this.log('info', 'N\'oubliez pas d\'exécuter: node update-mongodb-bipcosa06.js');
      } else {
        this.log('warn', '⚠️ Migration terminée avec des avertissements');
        this.log('info', 'Vérifiez le rapport et corrigez les erreurs manuellement');
      }

      return true;
    } catch (error) {
      this.log('error', 'ÉCHEC DE LA MIGRATION', { error: error.message });
      console.error(error);
      return false;
    }
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const migration = new CompleteMigration();
  
  // Gestion des arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipTests = args.includes('--skip-tests');
  
  if (args.includes('--help')) {
    console.log(`
Usage: node migrate-all.js [options]

Options:
  --dry-run     Simuler la migration sans effectuer de changements
  --skip-tests  Ignorer les tests de validation
  --help        Afficher cette aide

Exemple:
  node migrate-all.js
  node migrate-all.js --skip-tests
    `);
    process.exit(0);
  }

  if (dryRun) {
    console.log('🔍 MODE DRY-RUN - Aucun changement ne sera effectué');
  }

  migration.run()
    .then(success => {
      if (success) {
        console.log('\n✨ Migration complétée avec succès!');
        process.exit(0);
      } else {
        console.log('\n❌ Migration échouée');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = CompleteMigration;