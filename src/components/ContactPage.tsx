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
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
      paddingBottom: '80px'
    };
  }
  
  let backgroundValue = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
  
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
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ContactCard = styled.div`
  background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9));
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 40px;
  border: 1px solid rgba(255,255,255,0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0,136,204,0.1) 0%, transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  &:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,1));
    border-color: rgba(0,136,204,0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  @media (max-width: 480px) {
    padding: 25px;
  }
`;

const ContactTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 25px 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);

  &::before {
    content: '📱';
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    &::before {
      font-size: 28px;
    }
  }
`;

const ContactInfo = styled.div`
  font-size: 17px;
  line-height: 1.8;
  color: rgba(255,255,255,0.9);
  margin: 0 0 30px 0;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const TelegramButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #0088cc, #005fa3);
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0,136,204,0.4);
    border-color: rgba(255,255,255,0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(0.98);
  }

  span:first-child {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    padding: 12px 25px;
  }
`;

const ContactDetails = styled.div`
  margin-top: 30px;
  padding: 25px;
  background: rgba(255,255,255,0.05);
  border-radius: 15px;
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  position: relative;
  z-index: 1;
  text-align: center;
  line-height: 1.6;
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const ActionCard = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-3px);
  }

  .icon {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .label {
    font-size: 14px;
    color: rgba(255,255,255,0.9);
    font-weight: 500;
  }
`;

// Navigation en bas améliorée
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
  color: ${props => props.$active ? '#0088cc' : 'rgba(255,255,255,0.6)'};
  background: ${props => props.$active ? 'rgba(0,136,204,0.1)' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #0088cc;
    background: rgba(0,136,204,0.1);
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

  // Charger les données depuis l'API MongoDB
  const loadData = async () => {
    try {
      console.log('📥 ContactPage - Chargement depuis API MongoDB...');
      
      // Charger depuis l'API MongoDB, pas localStorage
      const [configRes, contactRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/contact-contents')
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
        console.log('⚙️ Config chargée depuis MongoDB');
      }

      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setContactContents(contactData);
        console.log('📞 Contenus contact chargés depuis MongoDB:', contactData.length);
      }
      
      console.log('✅ ContactPage - Données chargées depuis MongoDB');
    } catch (error) {
      console.error('❌ Erreur chargement données contact depuis API:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'telegram' && contactContents.length > 0 && contactContents[0].telegramLink) {
      window.open(contactContents[0].telegramLink, '_blank');
    }
  };

  return (
    <div style={getBackgroundStyle(config)}>
      {/* Header avec nom de la boutique */}
      <Header>
        <LogoImage src="https://i.imgur.com/b1O92qz.jpeg" alt="Logo" />
      </Header>

      {/* Contenu principal */}
      <Content>
        {contactContents.length > 0 ? (
          contactContents.map((contact) => (
            <ContactCard key={contact.id}>
              <ContactTitle>{contact.title}</ContactTitle>
              <ContactInfo>{contact.description}</ContactInfo>
              
              {contact.telegramLink && (
                <TelegramButton 
                  href={contact.telegramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span>✈️</span>
                  {contact.telegramText || 'Contactez-nous sur Telegram'}
                </TelegramButton>
              )}
              
              {contact.additionalInfo && (
                <ContactDetails>
                  {contact.additionalInfo}
                </ContactDetails>
              )}
            </ContactCard>
          ))
        ) : (
          <EmptyState>
            <h3>✉️ Page Contact</h3>
            <p>Aucun contenu configuré. Ajoutez du contenu depuis le panel admin.</p>
          </EmptyState>
        )}
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