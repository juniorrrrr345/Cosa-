'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig, InfoContent } from '@/services/dataService';

const PageContainer = styled.div<{ $config?: any }>`
  min-height: 100vh;
  background: ${props => {
    const config = props.$config;
    console.log('🎨 InfoPage PageContainer - Config reçue:', config);
    
    if (!config) {
      console.log('🎨 InfoPage - Pas de config, fallback dégradé');
      return 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
    }
    
    // URL externe (Imgur, etc.)
    if (config.backgroundType === 'url' && config.backgroundUrl) {
      console.log('🎨 InfoPage - Background URL externe:', config.backgroundUrl);
      return `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${config.backgroundUrl}")`;
    }
    
    // Image Cloudinary
    if (config.backgroundType === 'image' && config.backgroundImage) {
      console.log('🎨 InfoPage - Background Image Cloudinary:', config.backgroundImage);
      return `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${config.backgroundImage}")`;
    }
    
    console.log('🎨 InfoPage - Background dégradé par défaut, type:', config.backgroundType);
    return 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
  }};
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

const InfoSection = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  margin: 20px 0;
  padding: 30px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0,0,0,0.8);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
`;

const InfoTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: white;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
  text-align: center;
`;

const InfoDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  margin: 0 0 20px 0;
  text-align: center;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  padding: 12px 20px;
  margin: 8px 0;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border-left: 3px solid rgba(255,255,255,0.3);
  font-size: 15px;
  color: rgba(255,255,255,0.9);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-left-color: rgba(255,255,255,0.5);
    transform: translateX(5px);
  }
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
  const [infoContents, setInfoContents] = useState<InfoContent[]>([]);

  useEffect(() => {
    const loadData = () => {
      setConfig(dataService.getConfigSync());
      setInfoContents(dataService.getInfoContents());
      console.log('📄 InfoPage: Données chargées');
    };

    loadData();
    
    // Forcer la synchronisation des contenus au montage
    dataService.forceSyncContent();
    
    // Écouter les mises à jour de configuration et de données
    const handleConfigUpdate = () => {
      console.log('📄 InfoPage: Config mise à jour');
      loadData();
    };

    const handleDataUpdate = () => {
      console.log('📄 InfoPage: Données mises à jour');
      setTimeout(loadData, 100); // Petit délai pour s'assurer que les données sont à jour
    };

    // Écouter l'événement spécifique de changement de config (background)
    const handleConfigChanged = (event: any) => {
      console.log('🎯 InfoPage: Config changée (background):', event.detail);
      setConfig(event.detail);
    };

    window.addEventListener('configUpdated', handleConfigUpdate);
    window.addEventListener('dataUpdated', handleDataUpdate);
    window.addEventListener('bipcosa06ConfigChanged', handleConfigChanged);

    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  return (
    <PageContainer 
      $config={config}
    >
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      <Content>
        {infoContents.length > 0 ? (
          infoContents.map((info) => (
            <InfoSection key={info.id}>
              <InfoTitle>{info.title}</InfoTitle>
              <InfoDescription>{info.description}</InfoDescription>
              {info.items && info.items.length > 0 && (
                <InfoList>
                  {info.items.map((item, index) => (
                    <InfoItem key={index}>{item}</InfoItem>
                  ))}
                </InfoList>
              )}
            </InfoSection>
          ))
        ) : (
          <EmptyState>
            <EmptyTitle>📋 Page Info</EmptyTitle>
            <EmptyDescription>
              Cette page sera configurée depuis le panel administrateur.
              <br />
              Utilisez l'interface d'administration pour ajouter le contenu.
            </EmptyDescription>
          </EmptyState>
        )}
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

export default InfoPage;
