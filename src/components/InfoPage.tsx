'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig } from '@/services/dataService';

const PageContainer = styled.div<{ $backgroundImage?: string; $backgroundType?: string }>`
  min-height: 100vh;
  ${props => {
    if (props.$backgroundType === 'image' && props.$backgroundImage) {
      return `background-image: url(${props.$backgroundImage});`;
    } else if (props.$backgroundType === 'color' && props.$backgroundImage) {
      return `background: ${props.$backgroundImage};`;
    }
    return 'background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);';
  }}
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
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 3px;
  margin: 0;
  color: white;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
`;

const Content = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: calc(100vh - 200px);
  justify-content: center;
  align-items: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.2);
`;

const EmptyTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
  text-shadow: 0 0 15px rgba(255,255,255,0.3);
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
  margin: 0;
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.7);
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

interface InfoPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ onNavigate, currentView = 'info' }) => {
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

  return (
    <PageContainer 
      $backgroundImage={config.backgroundImage}
      $backgroundType={config.backgroundType}
    >
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      <Content>
        <EmptyState>
          <EmptyTitle>📋 Page Info</EmptyTitle>
          <EmptyDescription>
            Cette page sera configurée depuis le panel administrateur.
            <br />
            Utilisez l'interface d'administration pour ajouter le contenu.
          </EmptyDescription>
        </EmptyState>
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
        <NavItem $active={false} onClick={() => window.open('https://t.me/bipcosa06', '_blank')}>
          <NavIcon>✈️</NavIcon>
          <NavLabel>Canal</NavLabel>
        </NavItem>
        <NavItem $active={currentView === 'contact'} onClick={() => onNavigate?.('contact')}>
          <NavIcon>✉️</NavIcon>
          <NavLabel>Contact</NavLabel>
        </NavItem>
      </BottomNavigation>
    </PageContainer>
  );
};

export default InfoPage;
