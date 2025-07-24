'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig, ContactContent } from '@/services/dataService';

interface ContactPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

// Styles pour la page Contact
const PageContainer = styled.div<{ $config?: any }>`
  min-height: 100vh;
  background: ${props => {
    const config = props.$config;
    if (!config) return 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
    
    // URL externe (Imgur, etc.)
    if (config.backgroundType === 'url' && config.backgroundUrl) {
      return `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${config.backgroundUrl})`;
    }
    
    // Image Cloudinary
    if (config.backgroundType === 'image' && config.backgroundImage) {
      return `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${config.backgroundImage})`;
    }
    
    // Dégradé personnalisé ou par défaut
    return config.backgroundColor || 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
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
  padding: 30px 20px;
`;

const ContactCard = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0,0,0,0.9);
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
`;

const ContactTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ContactInfo = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  margin-bottom: 15px;
`;

const ContactLink = styled.a`
  color: #4facfe;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #7db8ff;
    text-decoration: underline;
  }
`;

const TelegramButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  text-decoration: none;
  padding: 15px 25px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  margin-top: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.4);
    background: rgba(255,255,255,0.25);
    border-color: rgba(255,255,255,0.4);
  }
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

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, currentView = 'contact' }) => {
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  const [contactContents, setContactContents] = useState<ContactContent[]>([]);

  useEffect(() => {
    const loadData = () => {
      setConfig(dataService.getConfigSync());
      setContactContents(dataService.getContactContents());
      console.log('📞 ContactPage: Données chargées');
    };

    loadData();
    
    // Forcer la synchronisation des contenus au montage
    dataService.forceSyncContent();
    
    // Écouter les mises à jour de configuration et de données
    const handleConfigUpdate = () => {
      console.log('📞 ContactPage: Config mise à jour');
      loadData();
    };
    
    const handleDataUpdate = () => {
      console.log('📞 ContactPage: Données mises à jour');
      setTimeout(loadData, 100); // Petit délai pour s'assurer que les données sont à jour
    };

    window.addEventListener('configUpdated', handleConfigUpdate);
    window.addEventListener('dataUpdated', handleDataUpdate);

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
        {contactContents.length > 0 ? (
          contactContents.map((contact) => (
            <ContactCard key={contact.id}>
              <ContactTitle>{contact.title}</ContactTitle>
              <ContactInfo>
                {contact.description}
              </ContactInfo>
              
              {contact.telegramUsername && contact.telegramLink && (
                <TelegramButton href={contact.telegramLink} target="_blank" rel="noopener noreferrer">
                  ✈️ Contacter {contact.telegramUsername}
                </TelegramButton>
              )}
              
              {contact.additionalInfo && (
                <ContactInfo style={{ marginTop: '20px', fontSize: '13px', lineHeight: '1.8' }}>
                  {contact.additionalInfo.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </ContactInfo>
              )}
            </ContactCard>
          ))
        ) : (
          <ContactCard>
            <ContactTitle>✉️ Page Contact</ContactTitle>
            <ContactInfo>
              Configuration en cours... Utilisez le panel administrateur pour ajouter le contenu.
            </ContactInfo>
          </ContactCard>
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

export default ContactPage;