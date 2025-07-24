'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';

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

const FilterDropdown = styled.div<{ $active?: boolean }>`
  flex: 1;
  background: ${props => props.$active ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.6)'};
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid ${props => props.$active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.3);
  }

  select {
    width: 100%;
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    padding: 15px 40px 15px 20px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    
    option {
      background: #1a1a1a;
      color: white;
      padding: 10px;
    }
  }
`;

const DropdownIcon = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  pointer-events: none;
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
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0,0,0,0.8);
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
`;

const ProductImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 140px;
  background: ${props => `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${props.$image})`};
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

interface HomePageProps {
  onNavigate?: (view: string) => void;
  onProductClick?: (product: any) => void;
  currentView?: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onProductClick, currentView = 'menu' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFarm, setSelectedFarm] = useState<string>('all');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  useEffect(() => {
    loadData();
    
    // Écouter les mises à jour depuis le panel admin
    const handleDataUpdate = (event: any) => {
      console.log('🔄 Boutique: Données mises à jour depuis le panel admin', event.detail);
      // Force reload with delay to ensure localStorage is updated
      setTimeout(() => {
        loadData();
      }, 150);
    };
    
    const handleConfigUpdate = (event: any) => {
      console.log('🔄 Boutique: Configuration mise à jour depuis le panel admin', event.detail);
      setTimeout(() => {
        loadData();
      }, 150);
    };

    window.addEventListener('dataUpdated', handleDataUpdate);
    window.addEventListener('configUpdated', handleConfigUpdate);

    // Check for updates every 5 seconds as fallback (reduced frequency)
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
      window.removeEventListener('configUpdated', handleConfigUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    try {
      const [newProducts, newCategories, newFarms, newConfig] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getFarms(),
        dataService.getConfig()
      ]);
      
      console.log('🛍️ Boutique: Chargement des données:', {
        products: newProducts.length,
        categories: newCategories.length,
        farms: newFarms.length
      });
      
      setProducts(newProducts);
      setCategories(newCategories);
      setFarms(newFarms);
      setConfig(newConfig);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      // En cas d'erreur, utiliser les données synchrones en fallback
      const fallbackProducts = dataService.getProductsSync();
      const fallbackCategories = dataService.getCategoriesSync();
      const fallbackFarms = dataService.getFarmsSync();
      const fallbackConfig = dataService.getConfigSync();
      
      setProducts(fallbackProducts);
      setCategories(fallbackCategories);
      setFarms(fallbackFarms);
      setConfig(fallbackConfig);
      setLastSyncTime(new Date());
    }
  };



  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const farmMatch = selectedFarm === 'all' || product.farm === selectedFarm;
    return categoryMatch && farmMatch;
  });

  const handleProductClick = (product: any) => {
    onProductClick?.(product);
  };

  return (
    <PageContainer 
      $backgroundImage={config.backgroundImage} 
      $backgroundType={config.backgroundType}
    >
      {/* Header simplifié avec juste BIPCOSA06 */}
      <Header>
        <HeaderTitle>BIPCOSA06</HeaderTitle>
      </Header>

      {/* Section filtres avec design noir/blanc */}
      <FiltersSection>
        <FilterDropdown $active={selectedCategory !== 'all'}>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <DropdownIcon>⌄</DropdownIcon>
        </FilterDropdown>
        <FilterDropdown $active={selectedFarm !== 'all'}>
          <select 
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
          >
            {farms.map(farm => (
              <option key={farm.value} value={farm.value}>
                {farm.label}
              </option>
            ))}
          </select>
          <DropdownIcon>⌄</DropdownIcon>
        </FilterDropdown>
      </FiltersSection>

      {/* Section produits avec design amélioré */}
      <ProductsSection>
        <ProductsGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} onClick={() => handleProductClick(product)}>
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

export default HomePage;