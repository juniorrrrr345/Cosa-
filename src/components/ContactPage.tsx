'use client';

import React from 'react';
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
  padding: 40px 20px;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
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

const ContactTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
`;

const ContactInfo = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin: 10px 0;
  line-height: 1.5;
`;

const ContactLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 20px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  display: inline-block;
  margin: 10px 5px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
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
  return (
    <PageContainer>
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      <Content>
        <ContactCard>
          <ContactTitle>📱 Contact</ContactTitle>
          <ContactInfo>
            Pour nous contacter directement
          </ContactInfo>
          <ContactLink href="mailto:contact@bipcosa06.com">
            ✉️ Email
          </ContactLink>
          <ContactLink href="tel:+33123456789">
            📞 Téléphone
          </ContactLink>
        </ContactCard>

        <ContactCard>
          <ContactTitle>✈️ Telegram Canal</ContactTitle>
          <ContactInfo>
            Rejoignez notre canal Telegram pour les dernières actualités
          </ContactInfo>
          <ContactLink href="https://t.me/bipcosa06" target="_blank">
            🚀 Rejoindre le Canal
          </ContactLink>
        </ContactCard>

        <ContactCard>
          <ContactTitle>🏪 Boutique</ContactTitle>
          <ContactInfo>
            BIPCOSA06 - Votre boutique de confiance
          </ContactInfo>
          <ContactInfo>
            Livraison rapide et service professionnel
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