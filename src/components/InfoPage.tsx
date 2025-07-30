'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ShopConfig, InfoContent } from '@/services/dataService';

// Fonction pour obtenir le style de background
const getBackgroundStyle = (config?: ShopConfig): React.CSSProperties => {
  if (!config) {
    return {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
      paddingBottom: '80px'
    };
  }
  
  let backgroundValue = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
  
  if (config.backgroundType === 'url' && config.backgroundUrl?.trim()) {
    const safeUrl = config.backgroundUrl.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
  } else if (config.backgroundType === 'image' && config.backgroundImage?.trim()) {
    const safeUrl = config.backgroundImage.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
  } else if (config.backgroundType === 'gradient') {
    backgroundValue = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
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
  padding: 15px 20px;
  background: transparent;
  border-bottom: none;
  
  @media (max-width: 480px) {
    padding: 10px 15px;
  }
`;

const LogoImage = styled.img`
  height: 120px;
  max-width: 500px;
  width: auto;
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.9));
  transition: transform 0.3s ease, filter 0.3s ease;
  
  @media (max-width: 768px) {
    height: 100px;
    max-width: 400px;
  }
  
  @media (max-width: 480px) {
    height: 80px;
    max-width: 300px;
  }
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 30px rgba(0,0,0,1));
  }
`;

const Content = styled.div`
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const InfoSection = styled.div`
  background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 40px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  &:hover {
    background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,1));
    border-color: rgba(76,175,80,0.3);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  @media (max-width: 480px) {
    padding: 25px;
  }
`;

const InfoTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 25px 0;
  color: white;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
  text-align: center;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const InfoDescription = styled.p`
  font-size: 17px;
  line-height: 1.8;
  color: rgba(255,255,255,0.9);
  margin: 0 0 25px 0;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  position: relative;
  z-index: 1;
`;

const InfoItem = styled.li`
  font-size: 15px;
  color: rgba(255,255,255,0.9);
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1));
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding-left: 40px;

  &::before {
    content: '✓';
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #4CAF50;
    font-weight: bold;
    font-size: 18px;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(76,175,80,0.1), rgba(76,175,80,0.2));
    border-color: rgba(76,175,80,0.3);
    transform: translateX(5px);
    padding-left: 45px;
  }

  @media (max-width: 480px) {
    padding-left: 40px;
  }
`;

const AdditionalInfo = styled.div`
  margin-top: 30px;
  padding: 25px;
  background: rgba(76,175,80,0.1);
  border-radius: 15px;
  border: 1px solid rgba(76,175,80,0.2);
  font-style: italic;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(0,0,0,0.5);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  
  h3 {
    font-size: 24px;
    margin-bottom: 15px;
    color: rgba(255,255,255,0.9);
  }
  
  p {
    font-size: 16px;
    color: rgba(255,255,255,0.7);
  }
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.9);
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
  color: ${props => props.$active ? '#4CAF50' : 'rgba(255,255,255,0.6)'};
  background: ${props => props.$active ? 'rgba(76,175,80,0.1)' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #4CAF50;
    background: rgba(76,175,80,0.1);
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
  const [config, setConfig] = useState<ShopConfig | null>(null);
  const [infoContents, setInfoContents] = useState<InfoContent[]>([]);

  useEffect(() => {
    loadDataFromMongoDB();
  }, []);

  const loadDataFromMongoDB = async () => {
    try {
      // Charger UNIQUEMENT depuis MongoDB
      const [configRes, infoRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/info-contents')
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
      }

      if (infoRes.ok) {
        const infoData = await infoRes.json();
        setInfoContents(infoData);
      }
      
    } catch (error) {
      console.error('Erreur chargement:', error);
      setInfoContents([]);
    }
  };

  return (
    <div style={getBackgroundStyle(config || undefined)}>
      <Header>
        <LogoImage src="https://i.imgur.com/b1O92qz.jpeg" alt="Logo" />
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
              {info.additionalInfo && (
                <AdditionalInfo>
                  {info.additionalInfo}
                </AdditionalInfo>
              )}
            </InfoSection>
          ))
        ) : null}
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
      </BottomNavigation>
    </div>
  );
};

export default InfoPage;
