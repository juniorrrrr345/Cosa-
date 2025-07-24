'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
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
  max-width: 500px;
  margin: 0 auto;
`;

const ContactCard = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
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

const ContactTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ContactInfo = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.1);
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  margin: 5px 10px 5px 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.2);

  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.3);
  }
`;

const TelegramButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #0088cc, #0066aa);
  color: white;
  text-decoration: none;
  padding: 15px 25px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,136,204,0.3);
  width: 100%;
  justify-content: center;
  margin-top: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,136,204,0.4);
    background: linear-gradient(135deg, #0099dd, #0077bb);
  }
`;

const QuickMessageForm = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
`;

const FormSelect = styled.select`
  width: 100%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 15px;
  outline: none;

  &:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  option {
    background: #1a1a1a;
    color: white;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 15px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border: none;
  color: white;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(76,175,80,0.3);
  }
`;

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

interface ContactPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, currentView = 'contact' }) => {
  const [messageType, setMessageType] = useState('info');
  const [customMessage, setCustomMessage] = useState('');

  const handleQuickMessage = () => {
    let message = '';
    
    switch (messageType) {
      case 'info':
        message = 'Bonjour, je souhaite avoir plus d\'informations sur vos produits et services.';
        break;
      case 'catalog':
        message = 'Bonjour, pouvez-vous m\'envoyer votre catalogue complet avec les prix ?';
        break;
      case 'delivery':
        message = 'Bonjour, je voudrais connaître les modalités de livraison pour ma zone.';
        break;
      case 'quality':
        message = 'Bonjour, pouvez-vous me donner plus de détails sur la qualité de vos produits ?';
        break;
      case 'custom':
        message = customMessage;
        break;
      default:
        message = 'Bonjour BIPCOSA06 !';
    }

    const telegramUrl = `https://t.me/bipcosa06?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      <Content>
        <ContactCard>
          <ContactTitle>📱 Contact Principal</ContactTitle>
          <ContactInfo>
            Notre canal de communication principal via Telegram pour toutes vos commandes et questions.
          </ContactInfo>
          <TelegramButton href="https://t.me/bipcosa06" target="_blank">
            <span>📱</span>
            Ouvrir Telegram @bipcosa06
          </TelegramButton>
        </ContactCard>

        <QuickMessageForm>
          <FormTitle>💬 Message Rapide</FormTitle>
          <FormSelect 
            value={messageType} 
            onChange={(e) => setMessageType(e.target.value)}
          >
            <option value="info">Demande d'informations générales</option>
            <option value="catalog">Demande de catalogue et prix</option>
            <option value="delivery">Question sur la livraison</option>
            <option value="quality">Question sur la qualité</option>
            <option value="custom">Message personnalisé</option>
          </FormSelect>

          {messageType === 'custom' && (
            <FormTextarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Tapez votre message personnalisé ici..."
            />
          )}

          <SendButton onClick={handleQuickMessage}>
            Envoyer via Telegram
          </SendButton>
        </QuickMessageForm>

        <ContactCard>
          <ContactTitle>🕒 Disponibilité</ContactTitle>
          <ContactInfo>
            Nous sommes disponibles 7j/7 pour répondre à vos questions :
          </ContactInfo>
          <ContactInfo style={{ fontSize: '14px', marginBottom: '0' }}>
            • Lundi - Dimanche : 10h00 - 22h00<br/>
            • Réponse rapide garantie<br/>
            • Service client réactif
          </ContactInfo>
        </ContactCard>

        <ContactCard>
          <ContactTitle>🌍 Zones de Livraison</ContactTitle>
          <ContactInfo>
            Nous livrons dans les zones suivantes :
          </ContactInfo>
          <ContactInfo style={{ fontSize: '14px', marginBottom: '0' }}>
            • Lyon et région (69)<br/>
            • Rhône-Alpes (71, 01, 42, 38)<br/>
            • Toute l'Europe via envoi postal
          </ContactInfo>
        </ContactCard>

        <ContactCard>
          <ContactTitle>ℹ️ Informations Importantes</ContactTitle>
          <ContactInfo style={{ fontSize: '14px', marginBottom: '0' }}>
            • Commandes uniquement via Telegram<br/>
            • Paiement à la livraison ou virement<br/>
            • Livraison discrète garantie<br/>
            • Produits de qualité certifiée
          </ContactInfo>
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
        <NavItem $active={currentView === 'contact'} onClick={() => onNavigate?.('contact')}>
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
