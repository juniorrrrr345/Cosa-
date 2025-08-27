import React from 'react';
import { CloudflareVideo, CloudflareGallery } from '@/components/CloudflareMedia';
import { BIPCOSA06_VIDEO_MAPPING, PRODUCTS_WITH_VIDEOS } from '@/config/cloudflare-bipcosa06';
import { ProductCloudflareVideo } from '@/hooks/useCloudflareVideo';
import styled from 'styled-components';

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const VideoCard = styled.div`
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
`;

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
