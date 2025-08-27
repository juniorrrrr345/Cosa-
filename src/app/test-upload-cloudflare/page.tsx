'use client';

/**
 * Page de test pour l'upload Cloudflare
 * BIPCOSA06
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import CloudflareUploader from '@/components/CloudflareUploader';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: white;
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 18px;
  }
`;

const Grid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
`;

const UploadSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  
  h2 {
    color: white;
    font-size: 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const ResultsSection = styled.div`
  margin-top: 40px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  
  h3 {
    color: #4CAF50;
    margin-bottom: 20px;
  }
  
  pre {
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 8px;
    color: #4CAF50;
    font-size: 12px;
    overflow-x: auto;
  }
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid #4CAF50;
  border-radius: 20px;
  font-size: 14px;
  margin-top: 20px;
`;

const MediaGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MediaItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  
  img, video {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .info {
    padding: 12px;
    
    .type {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .name {
      color: white;
      font-size: 14px;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export default function TestUploadCloudflare() {
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [lastUpload, setLastUpload] = useState<any>(null);

  const handleVideoUpload = (data: any) => {
    console.log('Vidéo uploadée:', data);
    setUploadedVideos(prev => [...prev, data]);
    setLastUpload(data);
  };

  const handleImageUpload = (data: any) => {
    console.log('Image uploadée:', data);
    setUploadedImages(prev => [...prev, data]);
    setLastUpload(data);
  };

  return (
    <Container>
      <Header>
        <h1>🚀 Test Upload Cloudflare - BIPCOSA06</h1>
        <p>Testez l'upload direct vers Cloudflare Stream et Images</p>
        <StatusBadge>
          ✅ Tokens configurés et prêts
        </StatusBadge>
      </Header>

      <Grid>
        <UploadSection>
          <h2>📹 Upload Vidéo</h2>
          <CloudflareUploader
            onUploadSuccess={handleVideoUpload}
            productName="test-video-bipcosa06"
            acceptVideo={true}
            acceptImage={false}
          />
        </UploadSection>

        <UploadSection>
          <h2>🖼️ Upload Image</h2>
          <CloudflareUploader
            onUploadSuccess={handleImageUpload}
            productName="test-image-bipcosa06"
            acceptVideo={false}
            acceptImage={true}
          />
        </UploadSection>
      </Grid>

      {lastUpload && (
        <ResultsSection>
          <h3>📊 Dernier Upload</h3>
          <pre>{JSON.stringify(lastUpload, null, 2)}</pre>
        </ResultsSection>
      )}

      {uploadedVideos.length > 0 && (
        <ResultsSection>
          <h3>📹 Vidéos Uploadées ({uploadedVideos.length})</h3>
          <MediaGallery>
            {uploadedVideos.map((video, index) => (
              <MediaItem key={index}>
                <iframe
                  src={video.url}
                  style={{ width: '100%', height: '150px' }}
                  frameBorder="0"
                />
                <div className="info">
                  <div className="type">Vidéo Stream</div>
                  <div className="name">{video.id}</div>
                </div>
              </MediaItem>
            ))}
          </MediaGallery>
        </ResultsSection>
      )}

      {uploadedImages.length > 0 && (
        <ResultsSection>
          <h3>🖼️ Images Uploadées ({uploadedImages.length})</h3>
          <MediaGallery>
            {uploadedImages.map((image, index) => (
              <MediaItem key={index}>
                <img src={image.variants?.thumbnail || image.url} alt={`Image ${index}`} />
                <div className="info">
                  <div className="type">Image CF</div>
                  <div className="name">{image.id}</div>
                </div>
              </MediaItem>
            ))}
          </MediaGallery>
        </ResultsSection>
      )}
    </Container>
  );
}