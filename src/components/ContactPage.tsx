'use client';

import React from 'react';
import styled from 'styled-components';

interface ContactPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

// Styles pour la page Contact
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
  background: linear-gradient(135deg, #0088cc, #0066aa);
  color: white;
  text-decoration: none;
  padding: 15px 25px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,136,204,0.3);
  margin-top: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,136,204,0.4);
    background: linear-gradient(135deg, #0099dd, #0077bb);
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

const NavItem = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.$active ? 1 : 0.7};
  transform: ${props => props.$active ? 'scale(1.1)' : 'scale(1)'};

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const NavIcon = styled.div`
  font-size: 20px;
`;

const NavLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: white;
`;

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, currentView = 'contact' }) => {
  return (
    <PageContainer>
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      <Content>
        <ContactCard>
          <ContactTitle>
            ✈️ Contact Telegram Principal
          </ContactTitle>
          <ContactInfo>
            Notre canal de communication principal pour toutes vos commandes et questions.
          </ContactInfo>
          <TelegramButton href="https://t.me/bipcosa06" target="_blank" rel="noopener noreferrer">
            <span>✈️</span>
            Contacter @bipcosa06
          </TelegramButton>
        </ContactCard>

        <ContactCard>
          <ContactTitle>
            📱 Commandes Express
          </ContactTitle>
          <ContactInfo>
            Pour vos commandes rapides, contactez-nous directement sur Telegram avec le nom du produit souhaité.
          </ContactInfo>
          <ContactInfo>
            <strong>Format :</strong> "Bonjour, je souhaite commander [PRODUIT] de BIPCOSA06"
          </ContactInfo>
        </ContactCard>

        <ContactCard>
          <ContactTitle>
            🚚 Zones de Livraison
          </ContactTitle>
          <ContactInfo>
            <strong>Livraison rapide :</strong><br/>
            • Lyon et région Rhône-Alpes<br/>
            • Départements : 69, 71, 01, 42, 38<br/>
            • Délai : 24-48h
          </ContactInfo>
        </ContactCard>

        <ContactCard>
          <ContactTitle>
            ⏰ Horaires de Service
          </ContactTitle>
          <ContactInfo>
            <strong>Support client :</strong> 7j/7<br/>
            <strong>Commandes :</strong> Tous les jours<br/>
            <strong>Livraisons :</strong> Selon disponibilités
          </ContactInfo>
        </ContactCard>

        <ContactCard>
          <ContactTitle>
            🔐 Confidentialité
          </ContactTitle>
          <ContactInfo>
            Toutes vos communications sont sécurisées. Nous garantissons la discrétion absolue de vos commandes et informations personnelles.
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