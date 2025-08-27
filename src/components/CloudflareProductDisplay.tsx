/**
 * Composant d'affichage des produits avec médias Cloudflare
 * BIPCOSA06 - Affichage optimisé des vidéos et images
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Product } from '@/services/dataService';

// ==================== STYLES ====================

const ProductContainer = styled.div`
  background: rgba(0, 0, 0, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const MediaSection = styled.div`
  position: relative;
  width: 100%;
  background: #000;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 0.8;
    }
    
    .play-button {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &::after {
        content: '▶';
        font-size: 32px;
        color: #000;
        margin-left: 8px;
      }
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .image-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(10px);
  }
`;

const ProductInfo = styled.div`
  padding: 30px;
  color: white;
  
  h2 {
    font-size: 28px;
    margin-bottom: 16px;
    color: #fff;
  }
  
  .price {
    font-size: 32px;
    font-weight: 700;
    color: #4CAF50;
    margin-bottom: 16px;
  }
  
  .description {
    font-size: 16px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 24px;
  }
  
  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    
    .detail-item {
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      
      .label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
`;

const MediaTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  
  button {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      background: #4CAF50;
      border-color: #4CAF50;
    }
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  
  button {
    flex: 1;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.buy-button {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
      }
    }
    
    &.cart-button {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid #4CAF50;
      
      &:hover {
        background: rgba(76, 175, 80, 0.2);
      }
    }
  }
`;

const StockIndicator = styled.div<{ $inStock: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.$inStock ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
  color: ${props => props.$inStock ? '#4CAF50' : '#f44336'};
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 16px;
  
  &::before {
    content: '●';
    font-size: 12px;
  }
`;

// ==================== COMPOSANT ====================

interface CloudflareProductDisplayProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

export default function CloudflareProductDisplay({
  product,
  onAddToCart,
  onBuyNow
}: CloudflareProductDisplayProps) {
  const [activeMedia, setActiveMedia] = useState<'video' | 'image'>('video');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Déterminer si c'est une URL Cloudflare
  const isCloudflareVideo = product.video?.includes('iframe.videodelivery.net') || 
                            product.video?.includes('videodelivery.net');
  const isCloudflareImage = product.image?.includes('imagedelivery.net');

  // Obtenir la bonne URL pour l'image (utiliser la variante large si disponible)
  const getImageUrl = () => {
    if (isCloudflareImage && product.imageVariants?.large) {
      return product.imageVariants.large;
    }
    return product.image || '/placeholder.jpg';
  };

  // Créer l'URL iframe pour les vidéos Cloudflare
  const getVideoEmbedUrl = () => {
    if (!product.video) return null;
    
    // Si c'est déjà une URL iframe Cloudflare, l'utiliser directement
    if (product.video.includes('iframe.videodelivery.net')) {
      return product.video;
    }
    
    // Si c'est un ID de vidéo Cloudflare, construire l'URL
    if (product.videoId) {
      return `https://iframe.videodelivery.net/${product.videoId}`;
    }
    
    // Pour les autres vidéos (YouTube, etc.)
    return product.video;
  };

  const hasVideo = !!product.video;
  const hasImage = !!product.image;
  const videoUrl = getVideoEmbedUrl();

  return (
    <ProductContainer>
      <MediaSection>
        {/* Tabs pour switcher entre vidéo et image si les deux existent */}
        {hasVideo && hasImage && (
          <MediaTabs>
            <button
              className={activeMedia === 'video' ? 'active' : ''}
              onClick={() => setActiveMedia('video')}
            >
              📹 Vidéo
            </button>
            <button
              className={activeMedia === 'image' ? 'active' : ''}
              onClick={() => setActiveMedia('image')}
            >
              🖼️ Photo
            </button>
          </MediaTabs>
        )}

        {/* Affichage de la vidéo */}
        {hasVideo && (!hasImage || activeMedia === 'video') && videoUrl && (
          <VideoContainer>
            <iframe
              src={videoUrl}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={`Vidéo de ${product.name}`}
            />
            {isCloudflareVideo && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                pointerEvents: 'none'
              }}>
                ☁️ Cloudflare Stream
              </div>
            )}
          </VideoContainer>
        )}

        {/* Affichage de l'image */}
        {hasImage && (!hasVideo || activeMedia === 'image') && (
          <ImageContainer>
            <img src={getImageUrl()} alt={product.name} />
            {isCloudflareImage && (
              <div className="image-badge">
                ☁️ Cloudflare Images
              </div>
            )}
          </ImageContainer>
        )}

        {/* Placeholder si pas de média */}
        {!hasVideo && !hasImage && (
          <ImageContainer>
            <div style={{
              width: '100%',
              height: '400px',
              background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '24px'
            }}>
              🖼️ Pas de média disponible
            </div>
          </ImageContainer>
        )}
      </MediaSection>

      <ProductInfo>
        <h2>{product.name}</h2>
        
        <StockIndicator $inStock={product.isAvailable && product.stock > 0}>
          {product.isAvailable && product.stock > 0
            ? `En stock (${product.stock} disponibles)`
            : 'Rupture de stock'
          }
        </StockIndicator>

        <div className="price">{product.price}€</div>

        {product.description && (
          <div className="description">{product.description}</div>
        )}

        <div className="details">
          {product.category && (
            <div className="detail-item">
              <div className="label">Catégorie</div>
              <div className="value">{product.category}</div>
            </div>
          )}
          
          {product.thc && (
            <div className="detail-item">
              <div className="label">THC</div>
              <div className="value">{product.thc}%</div>
            </div>
          )}
          
          {product.cbd && (
            <div className="detail-item">
              <div className="label">CBD</div>
              <div className="value">{product.cbd}%</div>
            </div>
          )}
          
          {product.weight && (
            <div className="detail-item">
              <div className="label">Poids</div>
              <div className="value">{product.weight}g</div>
            </div>
          )}
        </div>

        <ActionButtons>
          {product.isAvailable && product.stock > 0 ? (
            <>
              <button 
                className="buy-button"
                onClick={() => onBuyNow?.(product)}
              >
                🛒 Acheter maintenant
              </button>
              <button 
                className="cart-button"
                onClick={() => onAddToCart?.(product)}
              >
                ➕ Ajouter au panier
              </button>
            </>
          ) : (
            <button className="cart-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              ❌ Indisponible
            </button>
          )}
        </ActionButtons>
      </ProductInfo>
    </ProductContainer>
  );
}