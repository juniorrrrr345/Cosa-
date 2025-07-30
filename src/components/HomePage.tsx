'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';
import { clearAllCache } from '@/utils/clearCache';

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
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 15px 10px;
    gap: 8px;
  }
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

const SelectWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 140px;
  max-width: 250px;
  
  @media (max-width: 768px) {
    min-width: 120px;
    max-width: 200px;
  }
  
  @media (max-width: 480px) {
    min-width: 100px;
    max-width: 180px;
  }
  
  select {
    width: 100%;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.3);
    color: white;
    padding: 12px 40px 12px 15px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    
    &:hover {
      border-color: rgba(255,255,255,0.5);
      background: rgba(0,0,0,0.9);
    }
    
    &:focus {
      outline: none;
      border-color: #4ecdc4;
      box-shadow: 0 0 0 3px rgba(78,205,196,0.2);
    }
    
    option {
      background: #1a1a1a;
      color: white;
      padding: 10px;
      font-weight: 500;
    }
    
    option:checked {
      background: #4ecdc4;
      color: black;
    }
    
    @media (max-width: 768px) {
      padding: 10px 35px 10px 12px;
      font-size: 13px;
    }
    
    @media (max-width: 480px) {
      padding: 8px 30px 8px 10px;
      font-size: 12px;
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
  transition: color 0.3s ease;
  
  ${SelectWrapper}:hover & {
    color: #4ecdc4;
  }
`;

const ProductsCount = styled.div`
  text-align: center;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  margin: 20px 0 10px 0;
  
  span {
    color: #4ecdc4;
    font-weight: bold;
  }
`;

// Section produits avec grille responsive
const ProductsSection = styled.div`
  padding: 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
  
  /* MÊME LAYOUT POUR TOUS LES APPAREILS */
  /* Mobile, tablette, PC : toujours 2 colonnes */
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 1200px;
    padding: 0 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 1200px;
    padding: 0 10px;
  }
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
  width: 100%;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  }
  
  /* MÊME STYLE POUR TOUS LES APPAREILS */
  @media (max-width: 768px) {
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-8px);
      border-color: rgba(255,255,255,0.3);
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
  }
  
  @media (max-width: 480px) {
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    
    &:hover {
      transform: translateY(-8px);
      border-color: rgba(255,255,255,0.3);
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
  }
`;

const ProductImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 160px;
  background: ${props => `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${props.$image})`};
  background-size: cover;
  background-position: center;
  position: relative;
  
  /* MÊME HAUTEUR POUR TOUS LES APPAREILS */
  @media (max-width: 768px) {
    width: 100%;
    height: 160px;
    background-size: cover;
    background-position: center;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 160px;
    background-size: cover;
    background-position: center;
  }
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
  
  /* MÊME PADDING POUR TOUS LES APPAREILS */
  @media (max-width: 768px) {
    padding: 20px;
    background: rgba(0,0,0,0.5);
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    background: rgba(0,0,0,0.5);
  }
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
  color: ${props => props.$active ? '#4CAF50' : 'rgba(255,255,255,0.6)'};
  background: ${props => props.$active ? 'rgba(76,175,80,0.15)' : 'transparent'};
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '30px' : '0'};
    height: 2px;
    background: #4CAF50;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #4CAF50;
    background: rgba(76,175,80,0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
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
  // Démarrer complètement vide - AUCUN contenu par défaut
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFarm, setSelectedFarm] = useState<string>('all');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

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
    
    // NOUVEAUX ÉCOUTEURS POUR SYNCHRONISATION FORCÉE
    window.addEventListener('dataUpdatedForced', handleDataChanged);
    window.addEventListener('bipcosa06ForceSync', handleDataChanged);
    
    return () => {
      window.removeEventListener('bipcosa06ConfigChanged', handleConfigChanged);
      window.removeEventListener('configUpdated', loadData);
      window.removeEventListener('dataUpdated', handleDataChanged);
      window.removeEventListener('bipcosa06DataChanged', handleDataChanged);
      
      // Cleanup nouveaux écouteurs
      window.removeEventListener('dataUpdatedForced', handleDataChanged);
      window.removeEventListener('bipcosa06ForceSync', handleDataChanged);
    };
  }, []);

  // Charger les données depuis l'API (MongoDB) directement
  const loadData = async () => {
    try {
      console.log('📥 HomePage - Chargement depuis API MongoDB...');
      
      // Toujours charger depuis l'API MongoDB, pas localStorage
      const [productsRes, categoriesRes, farmsRes, configRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/farms'),
        fetch('/api/config')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
        console.log('🛍️ Produits chargés depuis MongoDB:', productsData.length);
        // Log détaillé pour debug
        productsData.forEach((p: Product) => {
          if (p.image || p.video) {
            console.log(`📦 Produit ${p.name}: image=${p.image}, video=${p.video}`);
          }
        });
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        console.log('📂 Catégories chargées depuis MongoDB:', categoriesData.length);
      }

      if (farmsRes.ok) {
        const farmsData = await farmsRes.json();
        setFarms(farmsData);
        console.log('🏠 Fermes chargées depuis MongoDB:', farmsData.length);
      }

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
        console.log('⚙️ Config chargée depuis MongoDB');
      }
      
      console.log('✅ HomePage - Toutes les données chargées depuis MongoDB');
    } catch (error) {
      console.error('❌ Erreur chargement données depuis API:', error);
    }
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 500) { // 500ms entre les clics
      setClickCount(prev => prev + 1);
      if (clickCount >= 2) { // 3 clics
        clearAllCache();
        window.location.reload();
      }
    } else {
      setClickCount(0);
    }
    setLastClickTime(now);
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const farmMatch = selectedFarm === 'all' || product.farm === selectedFarm;
    return categoryMatch && farmMatch;
  });

  // Log pour debug
  useEffect(() => {
    console.log('🔍 Filtrage:', {
      selectedCategory,
      selectedFarm,
      totalProducts: products.length,
      filteredProducts: filteredProducts.length,
      categories: categories.map(c => c.id),
      farms: farms.map(f => f.id)
    });
  }, [selectedCategory, selectedFarm, products.length, filteredProducts.length]);

  const handleProductClick = (product: any) => {
    onProductClick?.(product);
  };

  return (
    <div 
      style={getBackgroundStyle(config)}
    >
      {/* Header avec logo */}
      <Header>
        <LogoImage src="https://i.imgur.com/b1O92qz.jpeg" alt="Logo" onClick={handleLogoClick} />
      </Header>

      {/* Section filtres avec design noir/blanc */}
      <FiltersSection>
        <SelectWrapper>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">🏷️ Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
          <DropdownArrow>⌄</DropdownArrow>
        </SelectWrapper>
        
        <SelectWrapper>
          <select 
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
          >
            <option value="all">🌱 Toutes les farms</option>
            {farms.map(farm => (
              <option key={farm.id} value={farm.id}>
                {farm.emoji} {farm.name}
              </option>
            ))}
          </select>
          <DropdownArrow>⌄</DropdownArrow>
        </SelectWrapper>
      </FiltersSection>

      {/* Section produits avec design amélioré */}
      <ProductsSection>
        <ProductsCount>
          <span>{filteredProducts.length}</span> produits trouvés
        </ProductsCount>
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
      </BottomNavigation>
    </div>
  );
};

export default HomePage;