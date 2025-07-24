'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig, InfoContent } from '@/services/dataService';

// Fonction pour obtenir le style de background directement
const getBackgroundStyle = (config?: ShopConfig): React.CSSProperties => {
  console.log('🎨 InfoPage getBackgroundStyle - Config reçue:', config);
  
  if (!config) {
    console.log('🎨 InfoPage - Pas de config, background transparent');
    return {
      background: 'transparent',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
      paddingBottom: '80px'
    };
  }
  
  let backgroundValue = 'transparent';
  
  // URL externe (Imgur, etc.) - PRIORITÉ 1
  if (config.backgroundType === 'url' && config.backgroundUrl && config.backgroundUrl.trim()) {
    const safeUrl = config.backgroundUrl.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 InfoPage - Background URL externe:', safeUrl);
  }
  // Image Cloudinary - PRIORITÉ 2
  else if (config.backgroundType === 'image' && config.backgroundImage && config.backgroundImage.trim()) {
    const safeUrl = config.backgroundImage.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 InfoPage - Background Image Cloudinary:', safeUrl);
  }
  // Dégradé - PRIORITÉ 3
  else if (config.backgroundType === 'gradient') {
    backgroundValue = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
    console.log('🎨 InfoPage - Background dégradé');
  }
  
  return {
    background: backgroundValue,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
    paddingBottom: '80px'
  };
};

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const LogoImage = styled.img`
  height: 60px;
  max-width: 300px;
  width: auto;
  background: rgba(255,255,255,0.9);
  border-radius: 10px;
  padding: 8px;
  filter: drop-shadow(0 0 15px rgba(0,0,0,0.3));
  transition: transform 0.3s ease, filter 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 25px rgba(0,0,0,0.5));
    background: rgba(255,255,255,1);
  }
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
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.li`
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  padding: 12px 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
    transform: translateX(5px);
  }
`;

// Navigation en bas améliorée
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
    loadData();
    
    // Écouter UNIQUEMENT les changements de configuration depuis le panel admin
    const handleConfigChanged = (event: any) => {
      console.log('🔄 InfoPage - Config changée via panel admin:', event.detail);
      setConfig(event.detail);
      // FORCER le re-render immédiat
      setTimeout(() => {
        console.log('⚡ InfoPage - Forçage du refresh UI');
        setConfig({ ...event.detail }); // Force une nouvelle référence
      }, 50);
    };
    
    window.addEventListener('bipcosa06ConfigChanged', handleConfigChanged);
    
    return () => {
      window.removeEventListener('bipcosa06ConfigChanged', handleConfigChanged);
    };
  }, []);

  // Fonction pour charger les données avec priorité localStorage pour config
  const loadData = async () => {
    try {
      console.log('📥 InfoPage - Chargement des données...');
      
      // Charger config en priorité depuis localStorage (panel admin)
      let configData;
      if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('bipcosa06_config');
        if (storedConfig) {
          try {
            configData = JSON.parse(storedConfig);
            console.log('📥 InfoPage - Config depuis localStorage (panel admin):', configData);
          } catch (e) {
            console.error('❌ Erreur parsing config localStorage');
          }
        }
      }
      
      // Si pas de config localStorage, utiliser l'API
      if (!configData) {
        configData = await dataService.getConfig();
        console.log('📥 InfoPage - Config depuis API:', configData);
      }
      
      const infoData = dataService.getInfoContents();
      
      setConfig(configData);
      setInfoContents(infoData);
      
      console.log('✅ InfoPage - Données chargées:', {
        config: configData,
        infoContents: infoData.length
      });
    } catch (error) {
      console.error('❌ InfoPage - Erreur lors du chargement:', error);
    }
  };

  return (
    <div style={getBackgroundStyle(config)}>
      {/* Header avec nom de la boutique */}
      <Header>
        <LogoImage src="/logo.svg" alt="Logo" />
      </Header>

      {/* Contenu principal */}
      <Content>
        {infoContents.map((info) => (
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
        ))}
      </Content>

      {/* Navigation en bas */}
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
    </div>
  );
};

export default InfoPage;
