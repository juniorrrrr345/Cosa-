#!/usr/bin/env node

/**
 * Script d'intégration complète des médias Cloudflare pour BIPCOSA06
 * Utilise les APIs existantes du projet
 */

const fs = require('fs').promises;
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('🚀 INTÉGRATION CLOUDFLARE POUR BIPCOSA06');
console.log('='.repeat(70) + '\n');

async function loadMappings() {
  console.log('📁 Chargement des mappings...\n');
  
  try {
    // Charger le mapping des vidéos
    const videoMapping = await fs.readFile(
      path.join(__dirname, 'cloudflare-migration/bipcosa06-video-mapping.json'),
      'utf-8'
    ).then(JSON.parse);
    
    console.log(`✅ ${Object.keys(videoMapping.videos).length} vidéos trouvées`);
    
    return { videos: videoMapping.videos };
  } catch (error) {
    console.error('❌ Erreur chargement mapping:', error.message);
    return { videos: {} };
  }
}

async function createCloudflareConfig() {
  console.log('\n📝 Création de la configuration Cloudflare...\n');
  
  const mapping = await loadMappings();
  
  const configContent = `/**
 * Configuration Cloudflare pour BIPCOSA06
 * Généré automatiquement le ${new Date().toISOString()}
 */

export const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  boutique: 'BIPCOSA06',
  
  // URLs de base
  stream: {
    iframeBaseUrl: 'https://iframe.videodelivery.net',
    thumbnailBaseUrl: 'https://videodelivery.net'
  },
  images: {
    deliveryBaseUrl: 'https://imagedelivery.net'
  }
};

// Mapping des vidéos disponibles
export const BIPCOSA06_VIDEO_MAPPING = ${JSON.stringify(mapping.videos, null, 2)};

// Helper pour obtenir l'URL d'une vidéo
export function getVideoUrl(productName: string): string | null {
  const video = BIPCOSA06_VIDEO_MAPPING[productName];
  return video ? video.iframe_url : null;
}

// Helper pour obtenir l'ID d'une vidéo
export function getVideoId(productName: string): string | null {
  const video = BIPCOSA06_VIDEO_MAPPING[productName];
  return video ? video.cloudflare_id : null;
}

// Liste des produits avec vidéos
export const PRODUCTS_WITH_VIDEOS = Object.keys(BIPCOSA06_VIDEO_MAPPING);
`;

  const configPath = path.join(__dirname, '..', 'src', 'config', 'cloudflare-bipcosa06.ts');
  await fs.writeFile(configPath, configContent);
  
  console.log(`✅ Configuration créée: ${configPath}`);
  
  return mapping;
}

async function updateProductComponents() {
  console.log('\n🔧 Mise à jour des composants produits...\n');
  
  // Créer un hook personnalisé pour utiliser les vidéos Cloudflare
  const hookContent = `/**
 * Hook pour utiliser les médias Cloudflare dans BIPCOSA06
 */

import { useState, useEffect } from 'react';
import { BIPCOSA06_VIDEO_MAPPING, getVideoUrl, getVideoId } from '@/config/cloudflare-bipcosa06';

export function useCloudflareVideo(productName: string) {
  const [videoData, setVideoData] = useState<{
    id: string;
    url: string;
    hasVideo: boolean;
  } | null>(null);

  useEffect(() => {
    const normalizedName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Chercher dans le mapping
    const matchingKey = Object.keys(BIPCOSA06_VIDEO_MAPPING).find(key => 
      key.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(key.toLowerCase())
    );
    
    if (matchingKey) {
      const video = BIPCOSA06_VIDEO_MAPPING[matchingKey];
      setVideoData({
        id: video.cloudflare_id,
        url: video.iframe_url,
        hasVideo: true
      });
    } else {
      setVideoData({
        id: '',
        url: '',
        hasVideo: false
      });
    }
  }, [productName]);

  return videoData;
}

// Composant pour afficher automatiquement la vidéo d'un produit
export function ProductCloudflareVideo({ productName, className = '' }: { productName: string; className?: string }) {
  const videoData = useCloudflareVideo(productName);
  
  if (!videoData?.hasVideo) {
    return null;
  }
  
  return (
    <div className={\`cloudflare-video-wrapper \${className}\`}>
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <iframe
          src={videoData.url}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={\`Vidéo \${productName}\`}
        />
      </div>
    </div>
  );
}
`;

  const hookPath = path.join(__dirname, '..', 'src', 'hooks', 'useCloudflareVideo.tsx');
  
  // Créer le dossier hooks s'il n'existe pas
  await fs.mkdir(path.dirname(hookPath), { recursive: true });
  await fs.writeFile(hookPath, hookContent);
  
  console.log(`✅ Hook créé: ${hookPath}`);
}

async function createTestPage() {
  console.log('\n🧪 Création de la page de test...\n');
  
  const testPageContent = `import React from 'react';
import { CloudflareVideo, CloudflareGallery } from '@/components/CloudflareMedia';
import { BIPCOSA06_VIDEO_MAPPING, PRODUCTS_WITH_VIDEOS } from '@/config/cloudflare-bipcosa06';
import { ProductCloudflareVideo } from '@/hooks/useCloudflareVideo';
import styled from 'styled-components';

const TestContainer = styled.div\`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
\`;

const VideoGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
\`;

const VideoCard = styled.div\`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  h3 {
    padding: 1rem;
    margin: 0;
    background: #f5f5f5;
    font-size: 1rem;
  }
\`;

export default function CloudflareTestPage() {
  // Prendre les 6 premières vidéos pour le test
  const testVideos = Object.entries(BIPCOSA06_VIDEO_MAPPING).slice(0, 6);
  
  return (
    <TestContainer>
      <h1>🎬 Test des Vidéos Cloudflare - BIPCOSA06</h1>
      <p>Total: {PRODUCTS_WITH_VIDEOS.length} vidéos disponibles</p>
      
      <h2>Grille de vidéos</h2>
      <VideoGrid>
        {testVideos.map(([name, video]) => (
          <VideoCard key={video.cloudflare_id}>
            <h3>{name}</h3>
            <CloudflareVideo
              videoId={video.cloudflare_id}
              title={name}
              controls={true}
              muted={true}
            />
          </VideoCard>
        ))}
      </VideoGrid>
      
      <h2>Test du hook automatique</h2>
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h3>Produit: Mousseux-USA</h3>
        <ProductCloudflareVideo productName="Mousseux-USA" />
      </div>
      
      <h2>Liste complète des vidéos disponibles</h2>
      <ul>
        {PRODUCTS_WITH_VIDEOS.map(name => (
          <li key={name}>
            {name} - <a href={BIPCOSA06_VIDEO_MAPPING[name].iframe_url} target="_blank" rel="noopener noreferrer">
              Voir la vidéo
            </a>
          </li>
        ))}
      </ul>
    </TestContainer>
  );
}
`;

  const testPagePath = path.join(__dirname, '..', 'src', 'app', 'test-cloudflare', 'page.tsx');
  
  // Créer le dossier
  await fs.mkdir(path.dirname(testPagePath), { recursive: true });
  await fs.writeFile(testPagePath, testPageContent);
  
  console.log(`✅ Page de test créée: ${testPagePath}`);
  console.log('   Accessible sur: http://localhost:3000/test-cloudflare');
}

async function generateReport() {
  console.log('\n📊 Génération du rapport final...\n');
  
  const mapping = await loadMappings();
  
  const report = {
    boutique: 'BIPCOSA06',
    timestamp: new Date().toISOString(),
    integration: {
      videos: {
        total: Object.keys(mapping.videos).length,
        products: Object.keys(mapping.videos).map(name => ({
          name,
          id: mapping.videos[name].cloudflare_id,
          url: mapping.videos[name].iframe_url
        }))
      },
      filesCreated: [
        'src/config/cloudflare-bipcosa06.ts',
        'src/hooks/useCloudflareVideo.tsx',
        'src/app/test-cloudflare/page.tsx'
      ],
      nextSteps: [
        'Lancer le serveur de développement: npm run dev',
        'Tester sur: http://localhost:3000/test-cloudflare',
        'Intégrer ProductCloudflareVideo dans vos composants produits',
        'Déployer sur Vercel'
      ]
    }
  };
  
  await fs.writeFile(
    path.join(__dirname, 'integration-report-bipcosa06.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('=' .repeat(70));
  console.log('✅ INTÉGRATION COMPLÉTÉE AVEC SUCCÈS!');
  console.log('=' .repeat(70) + '\n');
  
  console.log('📹 Vidéos intégrées:', report.integration.videos.total);
  console.log('\n📁 Fichiers créés:');
  report.integration.filesCreated.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  console.log('\n🎯 Prochaines étapes:');
  report.integration.nextSteps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  
  console.log('\n💡 Exemple d\'utilisation dans un composant:\n');
  console.log(`  import { ProductCloudflareVideo } from '@/hooks/useCloudflareVideo';`);
  console.log(`  `);
  console.log(`  <ProductCloudflareVideo productName="Mousseux-USA" />`);
  
  return report;
}

// Fonction principale
async function main() {
  try {
    // 1. Créer la configuration
    await createCloudflareConfig();
    
    // 2. Créer le hook et les composants
    await updateProductComponents();
    
    // 3. Créer la page de test
    await createTestPage();
    
    // 4. Générer le rapport
    await generateReport();
    
    console.log('\n✨ Intégration terminée avec succès!');
    console.log('🚀 Lancez "npm run dev" et visitez http://localhost:3000/test-cloudflare');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
main();