/**
 * Composant pour afficher les médias Cloudflare (Stream & Images)
 * Boutique: BIPCOSA06
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// ==================== TYPES ====================

interface CloudflareVideoProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  poster?: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

interface CloudflareImageProps {
  imageId: string;
  accountId?: string;
  alt?: string;
  variant?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' | 'public';
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  onClick?: () => void;
  fallbackSrc?: string;
}

interface CloudflareGalleryProps {
  items: Array<{
    type: 'video' | 'image';
    id: string;
    title?: string;
    alt?: string;
  }>;
  columns?: number;
  gap?: number;
  className?: string;
}

// ==================== CONFIGURATION ====================

const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  stream: {
    iframeBaseUrl: 'https://iframe.videodelivery.net',
    thumbnailBaseUrl: 'https://videodelivery.net'
  },
  images: {
    deliveryBaseUrl: 'https://imagedelivery.net'
  }
};

// ==================== STYLED COMPONENTS ====================

const VideoWrapper = styled.div<{ aspectRatio?: string }>`
  position: relative;
  width: 100%;
  padding-top: ${props => props.aspectRatio || '56.25%'}; /* 16:9 par défaut */
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  &.loading {
    background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease, filter 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &.loading {
      filter: blur(5px);
    }
    
    &.error {
      filter: grayscale(100%) opacity(0.5);
    }
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    
    &.visible {
      opacity: 1;
    }
  }
`;

const GalleryGrid = styled.div<{ columns: number; gap: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${props => props.gap}px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.gap / 2}px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${props => props.gap / 2}px;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    z-index: 10;
  }
  
  .item-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    z-index: 1;
  }
`;

const ErrorMessage = styled.div`
  background: #ff4444;
  color: white;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ==================== COMPOSANT VIDEO CLOUDFLARE ====================

export const CloudflareVideo: React.FC<CloudflareVideoProps> = ({
  videoId,
  title,
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = 'metadata',
  poster,
  className = '',
  onPlay,
  onPause,
  onEnded
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Construire l'URL de l'iframe avec les paramètres
  const buildIframeUrl = () => {
    const params = new URLSearchParams();
    
    if (autoplay) params.append('autoplay', 'true');
    if (muted) params.append('muted', 'true');
    if (loop) params.append('loop', 'true');
    if (!controls) params.append('controls', 'false');
    if (preload !== 'metadata') params.append('preload', preload);
    if (poster) params.append('poster', encodeURIComponent(poster));
    
    const queryString = params.toString();
    return `${CLOUDFLARE_CONFIG.stream.iframeBaseUrl}/${videoId}${queryString ? `?${queryString}` : ''}`;
  };

  useEffect(() => {
    // Simuler le chargement
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [videoId]);

  if (error) {
    return <ErrorMessage>Erreur de chargement de la vidéo: {error}</ErrorMessage>;
  }

  return (
    <VideoWrapper className={`cloudflare-video ${className} ${isLoading ? 'loading' : ''}`}>
      <iframe
        src={buildIframeUrl()}
        title={title || `Video ${videoId}`}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => setError('Impossible de charger la vidéo')}
      />
      {isLoading && <LoadingSpinner />}
    </VideoWrapper>
  );
};

// ==================== COMPOSANT IMAGE CLOUDFLARE ====================

export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  imageId,
  accountId = CLOUDFLARE_CONFIG.accountId,
  alt = '',
  variant = 'public',
  width,
  height,
  loading = 'lazy',
  className = '',
  onClick,
  fallbackSrc
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Construire l'URL de l'image
    const url = `${CLOUDFLARE_CONFIG.images.deliveryBaseUrl}/${accountId}/${imageId}/${variant}`;
    setImageSrc(url);
  }, [imageId, accountId, variant]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Utiliser l'image de fallback si disponible
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    }
  };

  return (
    <ImageWrapper className={`cloudflare-image ${className}`} onClick={onClick}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`
          ${isLoading ? 'loading' : ''}
          ${hasError ? 'error' : ''}
        `}
      />
      {isLoading && (
        <div className="image-overlay visible">
          <LoadingSpinner />
        </div>
      )}
      {hasError && !fallbackSrc && (
        <div className="image-overlay visible">
          <span style={{ color: 'white' }}>Image non disponible</span>
        </div>
      )}
    </ImageWrapper>
  );
};

// ==================== COMPOSANT GALERIE CLOUDFLARE ====================

export const CloudflareGallery: React.FC<CloudflareGalleryProps> = ({
  items,
  columns = 3,
  gap = 16,
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <>
      <GalleryGrid columns={columns} gap={gap} className={`cloudflare-gallery ${className}`}>
        {items.map((item, index) => (
          <GalleryItem key={`${item.type}-${item.id}`} onClick={() => setSelectedItem(index)}>
            <div className="item-badge">{item.type === 'video' ? '📹' : '🖼️'}</div>
            
            {item.type === 'video' ? (
              <CloudflareVideo
                videoId={item.id}
                title={item.title}
                controls={false}
                muted={true}
                autoplay={false}
              />
            ) : (
              <CloudflareImage
                imageId={item.id}
                alt={item.alt || item.title}
                variant="medium"
              />
            )}
          </GalleryItem>
        ))}
      </GalleryGrid>

      {/* Modal pour affichage plein écran (optionnel) */}
      {selectedItem !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div style={{ width: '90%', maxWidth: '1200px' }}>
            {items[selectedItem].type === 'video' ? (
              <CloudflareVideo
                videoId={items[selectedItem].id}
                title={items[selectedItem].title}
                autoplay={true}
                controls={true}
              />
            ) : (
              <CloudflareImage
                imageId={items[selectedItem].id}
                alt={items[selectedItem].alt || items[selectedItem].title}
                variant="large"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ==================== HOOK UTILITAIRE ====================

export const useCloudflareMedia = () => {
  /**
   * Convertir une URL Cloudinary en ID Cloudflare
   */
  const convertToCloudflareId = (url: string, type: 'video' | 'image'): string | null => {
    // Cette fonction devrait utiliser le mapping généré lors de la migration
    // Pour l'instant, retourner null si pas de mapping trouvé
    console.warn('Mapping non implémenté - utiliser le fichier de mapping généré');
    return null;
  };

  /**
   * Générer une URL de thumbnail pour une vidéo
   */
  const getVideoThumbnail = (videoId: string, time: number = 0): string => {
    return `${CLOUDFLARE_CONFIG.stream.thumbnailBaseUrl}/${videoId}/thumbnails/thumbnail.jpg?time=${time}s`;
  };

  /**
   * Obtenir toutes les variantes disponibles pour une image
   */
  const getImageVariants = (imageId: string): Record<string, string> => {
    const accountId = CLOUDFLARE_CONFIG.accountId;
    const baseUrl = CLOUDFLARE_CONFIG.images.deliveryBaseUrl;
    
    return {
      thumbnail: `${baseUrl}/${accountId}/${imageId}/thumbnail`,
      small: `${baseUrl}/${accountId}/${imageId}/small`,
      medium: `${baseUrl}/${accountId}/${imageId}/medium`,
      large: `${baseUrl}/${accountId}/${imageId}/large`,
      original: `${baseUrl}/${accountId}/${imageId}/original`,
      public: `${baseUrl}/${accountId}/${imageId}/public`
    };
  };

  return {
    convertToCloudflareId,
    getVideoThumbnail,
    getImageVariants,
    config: CLOUDFLARE_CONFIG
  };
};

// ==================== EXPORT PAR DÉFAUT ====================

export default {
  CloudflareVideo,
  CloudflareImage,
  CloudflareGallery,
  useCloudflareMedia
};