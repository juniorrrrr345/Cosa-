'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig, ContactContent } from '@/services/dataService';

interface ContactPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

// Fonction pour obtenir le style de background directement
const getBackgroundStyle = (config?: ShopConfig): React.CSSProperties => {
  console.log('🎨 ContactPage getBackgroundStyle - Config reçue:', config);
  
  if (!config) {
    console.log('🎨 ContactPage - Pas de config, background transparent');
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
    console.log('🎨 ContactPage - Background URL externe:', safeUrl);
  }
  // Image Cloudinary - PRIORITÉ 2
  else if (config.backgroundType === 'image' && config.backgroundImage && config.backgroundImage.trim()) {
    const safeUrl = config.backgroundImage.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 ContactPage - Background Image Cloudinary:', safeUrl);
  }
  // Dégradé - PRIORITÉ 3
  else if (config.backgroundType === 'gradient') {
    backgroundValue = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
    console.log('🎨 ContactPage - Background dégradé');
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
  
  /* Mobile */
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
  
  /* Tablette */
  @media (max-width: 768px) {
    height: 100px;
    max-width: 400px;
  }
  
  /* Mobile */
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
  margin: 0 0 15px 0;
`;

const TelegramButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #0088cc, #005fa3);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,136,204,0.4);
    border-color: rgba(255,255,255,0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ContactDetails = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
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

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, currentView = 'contact' }) => {
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  const [contactContents, setContactContents] = useState<ContactContent[]>([]);

  useEffect(() => {
    loadData();
    
    // Écouter les changements de configuration
    const handleConfigChanged = (event: any) => {
      console.log('🔄 ContactPage - Config changée:', event.detail);
      setConfig(event.detail);
    };
    
    window.addEventListener('bipcosa06ConfigChanged', handleConfigChanged);
    
    return () => {
      window.removeEventListener('bipcosa06ConfigChanged', handleConfigChanged);
    };
  }, []);

  // Fonction pour charger les données - VERSION SIMPLIFIEE
  const loadData = () => {
    try {
      console.log('📥 ContactPage - Chargement des données...');
      
      // Utiliser directement les méthodes synchrones du dataService
      const configData = dataService.getConfigSync();
      const contactData = dataService.getContactContentsSync();
      
      setConfig(configData);
      setContactContents(contactData);
      
      console.log('✅ ContactPage - Données chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      
      // Fallback minimal
      setConfig({} as ShopConfig);
      setContactContents([]);
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
        {contactContents.map((contact) => (
          <ContactCard key={contact.id}>
            <ContactTitle>{contact.title}</ContactTitle>
            <ContactInfo>{contact.description}</ContactInfo>
            
            {contact.telegramLink && (
              <TelegramButton 
                href={contact.telegramLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span>📱</span>
                Contacter sur Telegram
              </TelegramButton>
            )}
            
            {contact.additionalInfo && (
              <ContactDetails>
                {contact.additionalInfo}
              </ContactDetails>
            )}
          </ContactCard>
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

export default ContactPage;