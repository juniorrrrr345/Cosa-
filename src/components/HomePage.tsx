'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { configService, Config } from '@/services/configService';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  padding-bottom: 80px;
`;

// Header exact comme dans l'image
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const CloseButton = styled.div`
  color: #4facfe;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const MainTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0;
  color: white;
`;

const SubTitle = styled.p`
  font-size: 12px;
  opacity: 0.7;
  margin: 2px 0 0 0;
  font-weight: 300;
`;

const MenuButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  padding: 8px;
`;

const MenuDot = styled.div`
  width: 4px;
  height: 4px;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
`;

// Logo section avec glassmorphism
const LogoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0 30px 0;
`;

const LogoContainer = styled.div`
  text-align: center;
`;

const LogoNumber = styled.div`
  font-size: 80px;
  font-weight: 900;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255,215,0,0.5);
  line-height: 1;
  margin-bottom: 5px;
`;

const LogoBrand = styled.div`
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b35, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255,107,53,0.5);
`;

// Section filtres
const FiltersSection = styled.div`
  padding: 0 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
`;

const FilterDropdown = styled.div`
  flex: 1;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 12px 20px;
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`;

const DropdownIcon = styled.span`
  color: rgba(255,255,255,0.7);
  font-size: 12px;
`;

// Section produits
const ProductsSection = styled.div`
  padding: 0 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const ProductCard = styled.div`
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
`;

const ProductImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 120px;
  background: ${props => `url(${props.$image})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProductFlag = styled.div<{ $flag: string; $color: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${props => props.$color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '${props => props.$flag}';
  }
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: white;
`;

const ProductQuality = styled.p`
  font-size: 12px;
  opacity: 0.7;
  margin: 0;
  font-weight: 400;
`;

// Navigation en bas identique à l'image
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
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px 15px;
  color: ${props => props.$active ? '#4facfe' : 'rgba(255,255,255,0.7)'};
  transition: color 0.3s ease;

  &:hover {
    color: #4facfe;
  }
`;

const NavIcon = styled.div`
  font-size: 24px;
`;

const NavLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
`;

interface HomePageProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, currentView = 'menu' }) => {
  const [config, setConfig] = useState<Config>(configService.defaultConfig);

  useEffect(() => {
    const loadedConfig = configService.getConfig();
    setConfig(loadedConfig);
  }, []);

  // Images des produits cannabis (utilisation d'images d'exemple)
  const products = [
    {
      id: 1,
      name: "ANIMAL COOKIES",
      quality: "Qualité Top",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNEY3OTQyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5BTklNQUwgQ09PS0lFUzwvdGV4dD4KPC9zdmc+",
      flag: "🇳🇱",
      flagColor: "#FF6B35",
      flagText: "FLEURS HOLLAND"
    },
    {
      id: 2,
      name: "POWER HAZE",
      quality: "Qualité mid",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjA4MEQ0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5QT1dFUiBIQVpFPC90ZXh0Pgo8L3N2Zz4=",
      flag: "🇪🇸",
      flagColor: "#FF4757",
      flagText: "FLEURS ESPAGNOL"
    },
    {
      id: 3,
      name: "NINE LIONS",
      quality: "Qualité A+++",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjQ0FBODcyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5OSU5FIExJT05TPC90ZXh0Pgo8L3N2Zz4=",
      flag: "🇺🇸🇪🇸",
      flagColor: "#5D4E75",
      flagText: "FLEURS CALISPAIN"
    },
    {
      id: 4,
      name: "BUBBLEGUM GELATO",
      quality: "Qualité Premium",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRkY0MDg1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5CVUJCTEVHVU08L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iNzAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5HRUxBVE88L3RleHQ+Cjwvc3ZnPg==",
      flag: "",
      flagColor: "#FF4085",
      flagText: "FLEURS PREMIUM"
    }
  ];

  return (
    <PageContainer>
      {/* Header exact comme dans l'image */}
      <Header>
        <CloseButton>Fermer</CloseButton>
        <HeaderTitle>
          <MainTitle>C A N A G O O D 6 9 A P P 💻</MainTitle>
          <SubTitle>mini-application</SubTitle>
        </HeaderTitle>
        <MenuButton onClick={() => onNavigate?.('admin')}>
          <MenuDot />
          <MenuDot />
          <MenuDot />
        </MenuButton>
      </Header>

      {/* Logo avec effet glassmorphism */}
      <LogoSection>
        <LogoContainer>
          <LogoNumber>69</LogoNumber>
          <LogoBrand>CANAGOOD</LogoBrand>
        </LogoContainer>
      </LogoSection>

      {/* Section filtres identique à l'image */}
      <FiltersSection>
        <FilterDropdown>
          <span>Toutes les catégories</span>
          <DropdownIcon>⌄</DropdownIcon>
        </FilterDropdown>
        <FilterDropdown>
          <span>Toutes les farms</span>
          <DropdownIcon>⌄</DropdownIcon>
        </FilterDropdown>
      </FiltersSection>

      {/* Section produits identique à l'image */}
      <ProductsSection>
        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage $image={product.image}>
                <ProductFlag $flag={product.flag} $color={product.flagColor}>
                  {product.flagText}
                </ProductFlag>
              </ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductQuality>{product.quality}</ProductQuality>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      </ProductsSection>

      {/* Navigation exacte comme dans l'image */}
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

export default HomePage;