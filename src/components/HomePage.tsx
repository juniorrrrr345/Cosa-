'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';

// Fonction pour obtenir le style de background directement
const getBackgroundStyle = (config?: ShopConfig): React.CSSProperties => {
  console.log('🎨 HomePage getBackgroundStyle - Config reçue:', config);
  
  if (!config) {
    console.log('🎨 HomePage - Pas de config, background transparent');
    return {
      background: 'transparent',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
      paddingBottom: '80px'
    };
  }
  
  let backgroundValue = 'transparent';
  
  // URL externe (Imgur, etc.) - PRIORITÉ 1
  if (config.backgroundType === 'url' && config.backgroundUrl && config.backgroundUrl.trim()) {
    const safeUrl = config.backgroundUrl.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 HomePage - Background URL externe:', safeUrl);
  }
  // Image Cloudinary - PRIORITÉ 2
  else if (config.backgroundType === 'image' && config.backgroundImage && config.backgroundImage.trim()) {
    const safeUrl = config.backgroundImage.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 HomePage - Background Image Cloudinary:', safeUrl);
  }
  // Dégradé - PRIORITÉ 3
  else if (config.backgroundType === 'gradient') {
    backgroundValue = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
    console.log('🎨 HomePage - Background dégradé');
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

// Header avec logo
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

const DropdownArrow = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 18px;
  pointer-events: none;
`;

// Section produits avec grille responsive
const ProductsSection = styled.div`
  padding: 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

// Card produit avec design moderne
const ProductCard = styled.div`
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.4s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
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
    
    // Écouter les changements de configuration
    const handleConfigChanged = (event: any) => {
      console.log('🔄 HomePage - Config changée:', event.detail);
      setConfig(event.detail);
    };
    
    // Écouter les changements de données (produits, catégories, etc.)
    const handleDataChanged = () => {
      console.log('🔄 HomePage - Données changées, rechargement...');
      loadData();
    };
    
    window.addEventListener('bipcosa06ConfigChanged', handleConfigChanged);
    window.addEventListener('configUpdated', loadData);
    window.addEventListener('dataUpdated', handleDataChanged);
    window.addEventListener('bipcosa06DataChanged', handleDataChanged);
    
    return () => {
      window.removeEventListener('bipcosa06ConfigChanged', handleConfigChanged);
      window.removeEventListener('configUpdated', loadData);
      window.removeEventListener('dataUpdated', handleDataChanged);
      window.removeEventListener('bipcosa06DataChanged', handleDataChanged);
    };
  }, []);

  // Fonction pour charger les données - VERSION SYNCHRONE OPTIMISÉE
  const loadData = () => {
    try {
      console.log('📥 HomePage - Chargement des données...');
      
      // Utiliser les méthodes synchrones pour plus de fiabilité
      const configData = dataService.getConfigSync();
      const productsData = dataService.getProductsSync();
      const categoriesRaw = dataService.getCategoriesSync();
      const farmsRaw = dataService.getFarmsSync();
      
      // Ajouter les options "Toutes" au début
      const categoriesData = [
        { value: 'all', label: 'Toutes les catégories' },
        ...categoriesRaw
      ];
      
      const farmsData = [
        { value: 'all', label: 'Toutes les fermes', country: '' },
        ...farmsRaw
      ];
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFarms(farmsData);
      setConfig(configData);
      setLastSyncTime(new Date());
      
      console.log('✅ HomePage - Données chargées:', {
        products: productsData.length,
        categories: categoriesData.length,
        farms: farmsData.length,
        config: configData
      });
    } catch (error) {
      console.error('❌ HomePage - Erreur lors du chargement:', error);
      
      // Fallback de sécurité
      setProducts([]);
      setCategories([{ value: 'all', label: 'Toutes les catégories' }]);
      setFarms([{ value: 'all', label: 'Toutes les fermes', country: '' }]);
      setConfig({} as ShopConfig);
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
    <div 
      style={getBackgroundStyle(config)}
    >
      {/* Header avec logo */}
      <Header>
        <LogoImage src="https://i.imgur.com/b1O92qz.jpeg" alt="Logo" />
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
          <DropdownArrow>⌄</DropdownArrow>
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
          <DropdownArrow>⌄</DropdownArrow>
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

export default HomePage;