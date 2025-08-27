/**
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
    <div className={`cloudflare-video-wrapper ${className}`}>
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
          title={`Vidéo ${productName}`}
        />
      </div>
    </div>
  );
}
