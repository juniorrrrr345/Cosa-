'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, ShopConfig, ContactContent } from '@/services/dataService';

interface ContactPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

// Styles pour la page Contact
const PageContainer = styled.div<{ $backgroundImage?: string; $backgroundType?: string }>`
  min-height: 100vh;
  background: ${props => {
    if (props.$backgroundType === 'image' && props.$backgroundImage) {
      return `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${props.$backgroundImage})`;
    }
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
        <ContactCard>
          <ContactTitle>✉️ Nous Contacter</ContactTitle>
          <ContactInfo>
            Pour passer commande ou obtenir des informations, contactez-nous directement via nos canaux officiels.
          </ContactInfo>
          
          {/* Canal Telegram principal */}
          <ContactCard>
            <ContactTitle>📢 {config.telegramDescription || 'Canal officiel BIPCOSA06'}</ContactTitle>
            <ContactInfo>
              Rejoignez notre canal Telegram pour toutes les informations et nouveautés.
            </ContactInfo>
            <TelegramButton 
              href={config.telegramChannelUrl || 'https://t.me/bipcosa06'} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              ✈️ {config.telegramChannel || 'bipcosa06'}
            </TelegramButton>
          </ContactCard>

          {/* Bot de commande */}
          <ContactCard>
            <ContactTitle>🛒 Commandes</ContactTitle>
            <ContactInfo>
              Utilisez notre bot de commande pour passer vos commandes directement via Telegram.
            </ContactInfo>
            <TelegramButton 
              href={`https://t.me/${(config.telegramBot || '@bipcosa06_bot').replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              🤖 {config.telegramBot || '@bipcosa06_bot'}
            </TelegramButton>
          </ContactCard>

          {/* WhatsApp si configuré */}
          {config.whatsappNumber && (
            <ContactCard>
              <ContactTitle>📱 WhatsApp</ContactTitle>
              <ContactInfo>
                Contactez-nous également via WhatsApp pour un service personnalisé.
              </ContactInfo>
              <TelegramButton 
                href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ background: 'rgba(37, 211, 102, 0.2)', borderColor: 'rgba(37, 211, 102, 0.5)' }}
              >
                📱 {config.whatsappNumber}
              </TelegramButton>
            </ContactCard>
          )}

          {/* Informations supplémentaires */}
          <ContactCard>
            <ContactTitle>📍 Zone de livraison</ContactTitle>
            <ContactInfo>
              🚗 Lyon et alentours (69, 71, 01, 42, 38)<br/>
              🕒 Livraison rapide (30-60 min)<br/>
              🔒 Service discret et professionnel<br/>
              ⚡ Réponse rapide 24h/7j
            </ContactInfo>
          </ContactCard>
        </ContactCard>
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
        <NavItem $active={false} onClick={() => window.open(config.telegramChannelUrl || 'https://t.me/bipcosa06', '_blank')}>
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