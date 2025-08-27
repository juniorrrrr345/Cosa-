'use client';

/**
 * Page de test pour l'affichage des produits avec Cloudflare
 * BIPCOSA06
 */

import React from 'react';
import styled from 'styled-components';
import CloudflareProductDisplay from '@/components/CloudflareProductDisplay';
import { Product } from '@/services/dataService';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
  
  h1 {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ProductGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
`;

// Produits de test avec médias Cloudflare
const testProducts: Product[] = [
  {
    id: '1',
    name: 'Mousseux USA Premium',
    description: 'Une variété exceptionnelle avec des arômes fruités et une puissance remarquable. Cultivée en indoor avec le plus grand soin.',
    price: 45.99,
    category: 'Premium Indoor',
    stock: 15,
    isAvailable: true,
    // Vidéo Cloudflare Stream
    video: 'https://iframe.videodelivery.net/10233b5c493bc246c5fde0791bb7ebd7',
    videoId: '10233b5c493bc246c5fde0791bb7ebd7',
    videoType: 'cloudflare-stream',
    // Image Cloudflare Images
    image: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-mousseux-usa/public',
    imageId: 'bipcosa06-product-mousseux-usa',
    imageVariants: {
      thumbnail: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-mousseux-usa/thumbnail',
      small: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-mousseux-usa/small',
      medium: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-mousseux-usa/medium',
      large: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-mousseux-usa/large'
    },
    thc: 28,
    cbd: 0.5,
    weight: 3.5
  },
  {
    id: '2',
    name: 'G21 Haze',
    description: 'Une Haze classique avec des notes citronnées et un effet cérébral puissant. Parfait pour la créativité.',
    price: 38.50,
    category: 'Sativa',
    stock: 8,
    isAvailable: true,
    // Vidéo Cloudflare Stream
    video: 'https://iframe.videodelivery.net/5404acb47778da5a286ef96334ba524b',
    videoId: '5404acb47778da5a286ef96334ba524b',
    videoType: 'cloudflare-stream',
    // Image Cloudflare Images
    image: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-g21-haze/public',
    imageId: 'bipcosa06-product-g21-haze',
    imageVariants: {
      thumbnail: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-g21-haze/thumbnail',
      small: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-g21-haze/small',
      medium: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-g21-haze/medium',
      large: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-g21-haze/large'
    },
    thc: 24,
    cbd: 1.2,
    weight: 5
  },
  {
    id: '3',
    name: 'Docteur Grinspoon',
    description: 'Une variété rare et unique avec une structure de buds particulière. Un must pour les connaisseurs.',
    price: 52.00,
    category: 'Exotic',
    stock: 3,
    isAvailable: true,
    // Vidéo Cloudflare Stream seulement
    video: 'https://iframe.videodelivery.net/cf54dde99c9a2584d63ecb728fc54652',
    videoId: 'cf54dde99c9a2584d63ecb728fc54652',
    videoType: 'cloudflare-stream',
    thc: 30,
    cbd: 0.3,
    weight: 2
  },
  {
    id: '4',
    name: 'Forbidden Fruit',
    description: 'Un mélange exotique aux arômes de fruits tropicaux. Effet relaxant et apaisant.',
    price: 42.00,
    category: 'Hybrid',
    stock: 0,
    isAvailable: false,
    // Image Cloudflare seulement
    image: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-docteur-grinspoon/public',
    imageId: 'bipcosa06-product-docteur-grinspoon',
    imageVariants: {
      thumbnail: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-docteur-grinspoon/thumbnail',
      small: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-docteur-grinspoon/small',
      medium: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-docteur-grinspoon/medium',
      large: 'https://imagedelivery.net/7979421604bd07b3bd34d3ed96222512/bipcosa06-product-docteur-grinspoon/large'
    },
    thc: 26,
    cbd: 2,
    weight: 3.5
  }
];

export default function TestProductDisplay() {
  const handleAddToCart = (product: Product) => {
    alert(`✅ "${product.name}" ajouté au panier!`);
    console.log('Ajout au panier:', product);
  };

  const handleBuyNow = (product: Product) => {
    alert(`🛒 Achat immédiat de "${product.name}"!`);
    console.log('Achat immédiat:', product);
  };

  return (
    <Container>
      <Header>
        <h1>🎬 Test Affichage Produits - Cloudflare</h1>
        <p>Vidéos Stream + Images avec iframes optimisés</p>
      </Header>

      <ProductGrid>
        {testProducts.map(product => (
          <CloudflareProductDisplay
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ))}
      </ProductGrid>
    </Container>
  );
}