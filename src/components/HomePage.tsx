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

// Header simplifié avec juste BIPCOSA06
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

// Section filtres avec design noir/blanc
const FiltersSection = styled.div`
  padding: 30px 20px;
  display: flex;
  gap: 15px;
`;

const FilterDropdown = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 15px 20px;
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.3);
  }
`;

const DropdownIcon = styled.span`
  color: rgba(255,255,255,0.7);
  font-size: 12px;
`;

// Section produits avec design noir/blanc amélioré
const ProductsSection = styled.div`
  padding: 0 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ProductCard = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0,0,0,0.9);
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
`;

const ProductImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 140px;
  background: ${props => `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.$image})`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProductFlag = styled.div<{ $color: string }>`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
`;

const ProductInfo = styled.div`
  padding: 20px;
  background: rgba(0,0,0,0.5);
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
  text-shadow: 0 0 10px rgba(255,255,255,0.2);
`;

const ProductQuality = styled.p`
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-weight: 400;
`;

// Navigation en bas améliorée
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

  // Images des produits cannabis améliorées
  const products = [
    {
      id: 1,
      name: "ANIMAL COOKIES",
      quality: "Qualité Top",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjMjAyMDIwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5BTklNQUwgQ09PS0lFUzwvdGV4dD4KPC9zdmc+",
      flagColor: "#333333",
      flagText: "🇳🇱 HOLLAND"
    },
    {
      id: 2,
      name: "POWER HAZE",
      quality: "Qualité mid",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjMTUxNTE1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5QT1dFUiBIQVpFPC90ZXh0Pgo8L3N2Zz4=",
      flagColor: "#333333",
      flagText: "🇪🇸 ESPAGNOL"
    },
    {
      id: 3,
      name: "NINE LIONS",
      quality: "Qualité A+++",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjMGEwYTBhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5OSU5FIExJT05TPC90ZXh0Pgo8L3N2Zz4=",
      flagColor: "#333333",
      flagText: "🇺🇸🇪🇸 CALISPAIN"
    },
    {
      id: 4,
      name: "BUBBLEGUM GELATO",
      quality: "Qualité Premium",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjMTAxMDEwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5CVUJCTEVHVU08L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iODAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5HRUxBVE88L3RleHQ+Cjwvc3ZnPg==",
      flagColor: "#333333",
      flagText: "PREMIUM"
    }
  ];

  return (
    <PageContainer>
      {/* Header simplifié avec juste BIPCOSA06 */}
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      {/* Section filtres avec design noir/blanc */}
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

      {/* Section produits avec design amélioré */}
      <ProductsSection>
        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage $image={product.image}>
                <ProductFlag $color={product.flagColor}>
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

      {/* Navigation fonctionnelle */}
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