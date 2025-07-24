'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { configService, Config } from '@/services/configService';

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

const InfoCard = styled.div`
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

const InfoTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoDescription = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin: 0 0 15px 0;
  line-height: 1.6;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  padding: 8px 0;
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;

  &:before {
    content: "✓";
    color: #4CAF50;
    font-weight: bold;
  }
`;

const ContactLink = styled.a`
  color: #0088cc;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: #0099dd;
    text-shadow: 0 0 10px rgba(0,136,204,0.3);
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

interface InfoPageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ onNavigate, currentView = 'info' }) => {
  const [config, setConfig] = useState<Config>(configService.defaultConfig);

  useEffect(() => {
    const loadedConfig = configService.getConfig();
    setConfig(loadedConfig);
  }, []);

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      <Content>
        <InfoCard>
          <InfoTitle>🏪 À propos de BIPCOSA06</InfoTitle>
          <InfoDescription>
            BIPCOSA06 est votre boutique de confiance spécialisée dans les produits Cannabis de haute qualité. 
            Nous offrons une sélection premium avec un service professionnel et discret.
          </InfoDescription>
        </InfoCard>

        <InfoCard>
          <InfoTitle>🌿 Notre Sélection</InfoTitle>
          <InfoDescription>Nous proposons uniquement des produits de qualité supérieure :</InfoDescription>
          <InfoList>
            <InfoItem>Variétés Indica, Sativa et Hybrides</InfoItem>
            <InfoItem>Produits certifiés et testés</InfoItem>
            <InfoItem>Origine traçable (Holland, Espagne, Californie)</InfoItem>
            <InfoItem>Différents formats disponibles (1g à 28g)</InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoTitle>🚚 Livraison</InfoTitle>
          <InfoDescription>Service de livraison rapide et discret :</InfoDescription>
          <InfoList>
            <InfoItem>Lyon et région Rhône-Alpes (69, 71, 01, 42, 38)</InfoItem>
            <InfoItem>Livraison en 24-48h</InfoItem>
            <InfoItem>Emballage discret et sécurisé</InfoItem>
            <InfoItem>Envoi postal dans toute l'Europe</InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoTitle>💳 Paiement & Commandes</InfoTitle>
          <InfoDescription>Processus simple et sécurisé :</InfoDescription>
          <InfoList>
            <InfoItem>Commande via Telegram : <ContactLink href="https://t.me/bipcosa06">@bipcosa06</ContactLink></InfoItem>
            <InfoItem>Paiement cash à la livraison</InfoItem>
            <InfoItem>Virement bancaire accepté</InfoItem>
            <InfoItem>Service client réactif 7j/7</InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoTitle>🔒 Confidentialité</InfoTitle>
          <InfoDescription>Votre discrétion est notre priorité :</InfoDescription>
          <InfoList>
            <InfoItem>Données clients protégées</InfoItem>
            <InfoItem>Livraison anonyme</InfoItem>
            <InfoItem>Communication cryptée via Telegram</InfoItem>
            <InfoItem>Aucune trace de commande</InfoItem>
          </InfoList>
        </InfoCard>

        <InfoCard>
          <InfoTitle>⭐ Qualité Garantie</InfoTitle>
          <InfoDescription>Notre engagement qualité :</InfoDescription>
          <InfoList>
            <InfoItem>Produits testés en laboratoire</InfoItem>
            <InfoItem>Taux de THC/CBD certifiés</InfoItem>
            <InfoItem>Conservation optimale</InfoItem>
            <InfoItem>Satisfaction client 100%</InfoItem>
          </InfoList>
        </InfoCard>
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

export default InfoPage;
