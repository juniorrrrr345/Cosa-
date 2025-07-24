'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { configService, Config } from '@/services/configService';

const PageContainer = styled.div<{ $backgroundImage?: string | null; $backgroundColor?: string }>`
  min-height: 100vh;
  background: ${props => props.$backgroundImage 
    ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${props.$backgroundImage})`
    : props.$backgroundColor || '#1a1a1a'};
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
`;

const Header = styled.div`
  padding: 20px;
  text-align: center;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
`;

const ShopTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 5px;
`;

const ShopSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.8;
  font-weight: 300;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
`;

const Logo = styled.div`
  font-size: 120px;
  font-weight: 900;
  text-shadow: 
    3px 3px 0px #ff6b35,
    6px 6px 0px #ff8f65,
    9px 9px 15px rgba(0,0,0,0.5);
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
`;

const BrandName = styled.div`
  font-size: 48px;
  font-weight: 900;
  margin-top: 10px;
  background: linear-gradient(45deg, #ff6b35, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  letter-spacing: 2px;
`;

const InfoSection = styled.div`
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  color: #4facfe;
  margin-bottom: 30px;
  font-weight: 300;
`;

const InfoItem = styled.div`
  margin-bottom: 25px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const InfoLabel = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.4;
`;

const Icon = styled.span`
  font-size: 20px;
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px;
  color: ${props => props.$active ? '#4facfe' : 'rgba(255,255,255,0.7)'};
  transition: color 0.3s ease;

  &:hover {
    color: #4facfe;
  }
`;

const NavIcon = styled.div`
  font-size: 24px;
`;

const NavLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

interface InfoPageProps {
  onNavigate?: (view: string) => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<Config>(configService.defaultConfig);

  useEffect(() => {
    const loadedConfig = configService.getConfig();
    setConfig(loadedConfig);
  }, []);

  return (
    <PageContainer 
      $backgroundImage={config.backgroundImage}
      $backgroundColor={config.backgroundColor}
    >
      <Header>
        <ShopTitle>{config.shopName}</ShopTitle>
        <ShopSubtitle>{config.shopDescription}</ShopSubtitle>
      </Header>

      <LogoContainer>
        <div>
          <Logo>69</Logo>
          <BrandName>CANAGOOD</BrandName>
        </div>
      </LogoContainer>

      <InfoSection>
        <SectionTitle>Informations</SectionTitle>
        
        <InfoItem>
          <InfoLabel>
            <Icon>≡</Icon>
            69 C A N A G O O D ≡
          </InfoLabel>
        </InfoItem>

        <InfoItem>
          <InfoLabel>
            <Icon>★</Icon>
            NUMÉRO 1 LYON ★
          </InfoLabel>
        </InfoItem>

        <InfoItem>
          <InfoLabel>
            <Icon>🏅</Icon>
            @canagoodbot
          </InfoLabel>
        </InfoItem>

        <InfoItem>
          <InfoLabel>
            <Icon>📍</Icon>
            MEETUP (69)
          </InfoLabel>
        </InfoItem>

        <InfoItem>
          <InfoLabel>
            <Icon>🏁</Icon>
            LIVRAISON
          </InfoLabel>
          <InfoValue>(69) (71) (01) (42) (38)</InfoValue>
        </InfoItem>

        <InfoItem>
          <InfoLabel>
            <Icon>📦</Icon>
            ENVOIE POSTAL
          </InfoLabel>
          <InfoValue>Toute l&apos;Europe via mondial relais</InfoValue>
        </InfoItem>

        <InfoItem>
          <InfoLabel>
            <Icon>🇪🇸</Icon>
            SERVICE ESPAGNOL ULTRA EFFICACE
          </InfoLabel>
          <InfoValue>@cloudzesbot</InfoValue>
        </InfoItem>
      </InfoSection>

      <BottomNavigation>
        <NavItem $active onClick={() => onNavigate?.('menu')}>
          <NavIcon>🏠</NavIcon>
          <NavLabel>Menu</NavLabel>
        </NavItem>
        <NavItem $active>
          <NavIcon>ℹ️</NavIcon>
          <NavLabel>Infos</NavLabel>
        </NavItem>
        <NavItem onClick={() => onNavigate?.('contact')}>
          <NavIcon>✈️</NavIcon>
          <NavLabel>Canal</NavLabel>
        </NavItem>
        <NavItem onClick={() => onNavigate?.('contact')}>
          <NavIcon>✉️</NavIcon>
          <NavLabel>Contact</NavLabel>
        </NavItem>
      </BottomNavigation>
    </PageContainer>
  );
};

export default InfoPage;