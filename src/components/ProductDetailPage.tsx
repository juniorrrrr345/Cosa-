'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig } from '@/services/dataService';

const PageContainer = styled.div<{ $backgroundImage?: string }>`
  min-height: 100vh;
  background: ${props => props.$backgroundImage 
    ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${props.$backgroundImage})`
    : 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
  };
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  padding-bottom: 80px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const BackButton = styled.button`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 8px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
`;

const LogoImage = styled.img`
  height: 50px;
  max-width: 250px;
  width: auto;
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
  transition: transform 0.3s ease, filter 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 15px rgba(255,255,255,0.5));
  }
`;

const Content = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const ProductImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 250px;
  background: ${props => `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.$image})`};
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const VideoSection = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 20px;
`;

const VideoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
  text-align: center;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
  background: #000;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
`;

const ProductFlag = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 8px 15px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
`;

const ProductInfo = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 20px;
`;

const ProductName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: white;
  text-shadow: 0 0 10px rgba(255,255,255,0.2);
`;

const ProductQuality = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin: 0 0 15px 0;
  font-weight: 500;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin: 0;
`;

const PricesSection = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 20px;
`;

const PricesTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: white;
  text-align: center;
`;

const PriceOption = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 15px 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const PriceWeight = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const PriceAmount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #4CAF50;
`;

const OrderSection = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255,255,255,0.2);
  text-align: center;
`;

const OrderTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
`;

const OrderInfo = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const TelegramButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,136,204,0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,136,204,0.4);
    background: linear-gradient(135deg, #0099dd, #0077bb);
  }
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.95);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  padding: 15px 0 25px 0;
  border-top: 1px solid rgba(255,255,255,0.2);
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 12px;
  color: ${props => props.$active ? '#ffffff' : 'rgba(255,255,255,0.6)'};
  background: ${props => props.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }
`;

const NavIcon = styled.div`
  font-size: 22px;
`;

const NavLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
`;

interface Product {
  id: number;
  name: string;
  quality: string;
  image: string;
  flagText: string;
  description: string;
  video?: string;
  prices: Array<{
    weight: string;
    price: string;
  }>;
}

interface ProductDetailPageProps {
  product: Product;
  onNavigate?: (view: string) => void;
  onBack?: () => void;
  currentView?: string;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product, 
  onNavigate, 
  onBack,
  currentView = 'menu' 
}) => {
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);

  useEffect(() => {
    const loadData = () => {
      setConfig(dataService.getConfig());
    };

    loadData();
    
    // Écouter les mises à jour de configuration
    const handleConfigUpdate = () => {
      loadData();
    };

    window.addEventListener('configUpdated', handleConfigUpdate);

    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate);
    };
  }, []);

  const handleTelegramOrder = (productName: string) => {
    const message = `Bonjour, je souhaite commander ${productName} de BIPCOSA06. Pouvez-vous me donner plus d'informations ?`;
    const telegramUrl = `https://t.me/bipcosa06?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <PageContainer $backgroundImage={config.backgroundImage}>
      <Header>
        <BackButton onClick={onBack}>
          ← Retour
        </BackButton>
        <LogoImage src="/logo.svg" alt="Logo" />
        <div style={{ width: '60px' }}></div>
      </Header>

      <Content>
        {/* Pas d'image dans la page détail */}
        <ProductFlag>{product.flagText}</ProductFlag>

        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductQuality>{product.quality}</ProductQuality>
          <ProductDescription>{product.description}</ProductDescription>
        </ProductInfo>

        {product.video && (
          <VideoSection>
            <VideoTitle>🎥 Vidéo du produit</VideoTitle>
            <VideoContainer>
              <VideoElement controls>
                <source src={product.video} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo HTML5.
              </VideoElement>
            </VideoContainer>
          </VideoSection>
        )}

        <PricesSection>
          <PricesTitle>💰 Prix disponibles</PricesTitle>
          {product.prices.map((priceOption, index) => (
            <PriceOption key={index}>
              <PriceWeight>{priceOption.weight}</PriceWeight>
              <PriceAmount>{priceOption.price}</PriceAmount>
            </PriceOption>
          ))}
        </PricesSection>

        <OrderSection>
          <OrderTitle>📱 Commander</OrderTitle>
          <OrderInfo>
            Contactez-nous directement via Telegram pour passer votre commande.
            Livraison rapide et discrète.
          </OrderInfo>
          <TelegramButton onClick={() => handleTelegramOrder(product.name)}>
            <span>📱</span>
            Commander via Telegram
          </TelegramButton>
        </OrderSection>
      </Content>

      <BottomNavigation>
        <NavItem $active={currentView === 'menu'} onClick={() => onNavigate?.('menu')}>
          <NavIcon>🏠</NavIcon>
          <NavLabel>Menu</NavLabel>
        </NavItem>
        <NavItem $active={currentView === 'info'} onClick={() => onNavigate?.('info')}>
          <NavIcon>ℹ️</NavIcon>
          <NavLabel>Infos</NavLabel>
        </NavItem>
        <NavItem $active={currentView === 'social'} onClick={() => onNavigate?.('social')}>
          <NavIcon>🌐</NavIcon>
          <NavLabel>Réseaux</NavLabel>
        </NavItem>
        <NavItem $active={currentView === 'contact'} onClick={() => onNavigate?.('contact')}>
          <NavIcon>✉️</NavIcon>
          <NavLabel>Contact</NavLabel>
        </NavItem>
      </BottomNavigation>
    </PageContainer>
  );
};

export default ProductDetailPage;