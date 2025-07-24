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
  padding-bottom: 80px;
`;

// Header exact comme dans l'image
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const CloseButton = styled.div`
  color: #4facfe;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const MainTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0;
  color: white;
`;

const SubTitle = styled.p`
  font-size: 12px;
  opacity: 0.7;
  margin: 2px 0 0 0;
  font-weight: 300;
`;

const MenuButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  padding: 8px;
`;

const MenuDot = styled.div`
  width: 4px;
  height: 4px;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
`;

// Logo section avec glassmorphism
const LogoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px 0 40px 0;
`;

const LogoContainer = styled.div`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 40px 60px;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  text-align: center;
`;

const LogoNumber = styled.div`
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255,215,0,0.5);
  line-height: 1;
  margin-bottom: 10px;
`;

const LogoBrand = styled.div`
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b35, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(255,107,53,0.5);
`;

// Section informations
const InfoSection = styled.div`
  padding: 0 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  color: #4facfe;
  margin-bottom: 30px;
  font-weight: 300;
  text-align: center;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoCard = styled.div`
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const InfoIcon = styled.span`
  font-size: 20px;
`;

const InfoTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const InfoContent = styled.div`
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
  margin-left: 32px;
`;

// Navigation en bas identique à l'image
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
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px 15px;
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
  font-size: 11px;
  font-weight: 500;
`;

interface HomePageProps {
  onNavigate?: (view: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
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
      {/* Header exact comme dans l'image */}
      <Header>
        <CloseButton>Fermer</CloseButton>
        <HeaderTitle>
          <MainTitle>C A N A G O O D 6 9 A P P 💻</MainTitle>
          <SubTitle>mini-application</SubTitle>
        </HeaderTitle>
        <MenuButton onClick={() => onNavigate?.('admin')}>
          <MenuDot />
          <MenuDot />
          <MenuDot />
        </MenuButton>
      </Header>

      {/* Logo avec effet glassmorphism */}
      <LogoSection>
        <LogoContainer>
          <LogoNumber>69</LogoNumber>
          <LogoBrand>CANAGOOD</LogoBrand>
        </LogoContainer>
      </LogoSection>

      {/* Section Informations */}
      <InfoSection>
        <SectionTitle>Informations</SectionTitle>
        
        <InfoGrid>
          <InfoCard>
            <InfoHeader>
              <InfoIcon>≡</InfoIcon>
              <InfoTitle>69 C A N A G O O D ≡</InfoTitle>
            </InfoHeader>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <InfoIcon>★</InfoIcon>
              <InfoTitle>NUMÉRO 1 LYON ★</InfoTitle>
            </InfoHeader>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <InfoIcon>🏅</InfoIcon>
              <InfoTitle>@canagoodbot</InfoTitle>
            </InfoHeader>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <InfoIcon>📍</InfoIcon>
              <InfoTitle>MEETUP (69)</InfoTitle>
            </InfoHeader>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <InfoIcon>🏁</InfoIcon>
              <InfoTitle>LIVRAISON</InfoTitle>
            </InfoHeader>
            <InfoContent>(69) (71) (01) (42) (38)</InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <InfoIcon>📦</InfoIcon>
              <InfoTitle>ENVOIE POSTAL</InfoTitle>
            </InfoHeader>
            <InfoContent>Toute l&apos;Europe via mondial relais</InfoContent>
          </InfoCard>

          <InfoCard>
            <InfoHeader>
              <InfoIcon>🇪🇸</InfoIcon>
              <InfoTitle>SERVICE ESPAGNOL ULTRA EFFICACE</InfoTitle>
            </InfoHeader>
            <InfoContent>@cloudzesbot</InfoContent>
          </InfoCard>
        </InfoGrid>
      </InfoSection>

      {/* Navigation exacte comme dans l'image */}
      <BottomNavigation>
        <NavItem $active>
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

export default HomePage;