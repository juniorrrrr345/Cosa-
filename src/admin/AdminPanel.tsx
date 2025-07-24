'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

// Types pour les sections admin
type AdminSection = 'dashboard' | 'products' | 'orders' | 'config' | 'seo' | 'telegram';

interface AdminPanelProps {
  onBack?: () => void;
}

// Styles responsive pour le panel admin
const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: white;
  display: flex;
  position: relative;
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '280px' : '0'};
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: fixed;
  height: 100vh;
  z-index: 1000;

  @media (min-width: 768px) {
    position: relative;
    width: ${props => props.$isOpen ? '280px' : '60px'};
  }

  @media (min-width: 1024px) {
    width: 280px;
  }
`;

const SidebarToggle = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
  letter-spacing: 1px;
`;

const SidebarMenu = styled.div`
  padding: 20px 0;
`;

const MenuItem = styled.div<{ $active: boolean }>`
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border-left: ${props => props.$active ? '3px solid #fff' : '3px solid transparent'};
  
  &:hover {
    background: rgba(255,255,255,0.05);
  }
`;

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 16px;
`;

const MenuLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const MainContent = styled.div<{ $sidebarOpen: boolean }>`
  flex: 1;
  padding: 20px;
  margin-left: ${props => props.$sidebarOpen ? '0' : '0'};
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    margin-left: 0;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 60px 0 0;
  }
`;

const ContentTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BackButton = styled.button`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const ContentSection = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #333, #555);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #444, #666);
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as AdminSection, icon: '📊', label: 'Tableau de bord' },
    { id: 'products' as AdminSection, icon: '🌿', label: 'Produits' },
    { id: 'orders' as AdminSection, icon: '📦', label: 'Commandes' },
    { id: 'telegram' as AdminSection, icon: '✈️', label: 'Telegram' },
    { id: 'seo' as AdminSection, icon: '🔍', label: 'SEO & Meta' },
    { id: 'config' as AdminSection, icon: '⚙️', label: 'Configuration' },
  ];

  const handleMenuClick = (section: AdminSection) => {
    setActiveSection(section);
    setSidebarOpen(false); // Fermer la sidebar sur mobile après clic
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <StatsGrid>
              <StatCard>
                <StatValue>4</StatValue>
                <StatLabel>Produits</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>127</StatValue>
                <StatLabel>Commandes</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>€2,840</StatValue>
                <StatLabel>Revenus</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>95%</StatValue>
                <StatLabel>Satisfaction</StatLabel>
              </StatCard>
            </StatsGrid>
            <ContentSection>
              <SectionTitle>Vue d'ensemble BIPCOSA06</SectionTitle>
              <p>Bienvenue dans le panel d'administration de votre boutique Cannabis. Gérez tous les aspects de BIPCOSA06 depuis cette interface.</p>
            </ContentSection>
          </>
        );

      case 'products':
        return (
          <ContentSection>
            <SectionTitle>Gestion des Produits</SectionTitle>
            <FormGroup>
              <Label>Nom du produit</Label>
              <Input type="text" placeholder="Ex: ANIMAL COOKIES" />
            </FormGroup>
            <FormGroup>
              <Label>Catégorie</Label>
              <Input type="text" placeholder="indica, sativa, hybrid" />
            </FormGroup>
            <FormGroup>
              <Label>Farm d'origine</Label>
              <Input type="text" placeholder="holland, espagne, calispain, premium" />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea placeholder="Description détaillée du produit..." />
            </FormGroup>
            <FormGroup>
              <Label>URL de l'image</Label>
              <Input type="url" placeholder="https://images.unsplash.com/..." />
            </FormGroup>
            <Button>Ajouter le produit</Button>
          </ContentSection>
        );

      case 'orders':
        return (
          <ContentSection>
            <SectionTitle>Gestion des Commandes</SectionTitle>
            <p>Suivi des commandes Telegram et gestion des livraisons.</p>
            <FormGroup>
              <Label>Rechercher une commande</Label>
              <Input type="text" placeholder="Nom du client ou numéro de commande" />
            </FormGroup>
            <Button>Rechercher</Button>
          </ContentSection>
        );

      case 'telegram':
        return (
          <ContentSection>
            <SectionTitle>Configuration Telegram</SectionTitle>
            <FormGroup>
              <Label>Nom d'utilisateur Telegram</Label>
              <Input type="text" defaultValue="bipcosa06" />
            </FormGroup>
            <FormGroup>
              <Label>Message de bienvenue</Label>
              <TextArea defaultValue="Bonjour ! Bienvenue chez BIPCOSA06, votre boutique Cannabis de confiance." />
            </FormGroup>
            <FormGroup>
              <Label>Template commande</Label>
              <TextArea defaultValue="Bonjour, je souhaite commander {produit} de BIPCOSA06. Pouvez-vous me donner plus d'informations ?" />
            </FormGroup>
            <Button>Sauvegarder</Button>
          </ContentSection>
        );

      case 'seo':
        return (
          <ContentSection>
            <SectionTitle>SEO & Métadonnées</SectionTitle>
            <FormGroup>
              <Label>Titre du site</Label>
              <Input type="text" defaultValue="BIPCOSA06 - CANAGOOD 69 APP | Boutique Cannabis Lyon" />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea defaultValue="BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon. Livraison (69) (71) (01) (42) (38). Service professionnel." />
            </FormGroup>
            <FormGroup>
              <Label>Mots-clés</Label>
              <Input type="text" defaultValue="BIPCOSA06, CANAGOOD, Lyon, boutique, livraison, 69, cannabis, CBD" />
            </FormGroup>
            <Button>Mettre à jour</Button>
          </ContentSection>
        );

      case 'config':
        return (
          <ContentSection>
            <SectionTitle>Configuration générale</SectionTitle>
            <FormGroup>
              <Label>Nom de la boutique</Label>
              <Input type="text" defaultValue="BIPCOSA06" />
            </FormGroup>
            <FormGroup>
              <Label>URL de base</Label>
              <Input type="url" defaultValue="https://bipcosa06.vercel.app" />
            </FormGroup>
            <FormGroup>
              <Label>Email de contact</Label>
              <Input type="email" placeholder="contact@bipcosa06.com" />
            </FormGroup>
            <FormGroup>
              <Label>Zones de livraison</Label>
              <TextArea defaultValue="Lyon et région Rhône-Alpes (69, 71, 01, 42, 38)" />
            </FormGroup>
            <Button>Sauvegarder</Button>
          </ContentSection>
        );

      default:
        return <ContentSection><SectionTitle>Section en cours de développement</SectionTitle></ContentSection>;
    }
  };

  return (
    <AdminContainer>
      <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </SidebarToggle>

      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <SidebarTitle>ADMIN BIPCOSA06</SidebarTitle>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              $active={activeSection === item.id}
              onClick={() => handleMenuClick(item.id)}
            >
              <MenuIcon>{item.icon}</MenuIcon>
              <MenuLabel>{item.label}</MenuLabel>
            </MenuItem>
          ))}
        </SidebarMenu>
      </Sidebar>

      <MainContent $sidebarOpen={sidebarOpen}>
        <ContentHeader>
          <ContentTitle>
            {menuItems.find(item => item.id === activeSection)?.label || 'Admin'}
          </ContentTitle>
          {onBack && (
            <BackButton onClick={onBack}>
              ← Retour à la boutique
            </BackButton>
          )}
        </ContentHeader>

        {renderContent()}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminPanel;