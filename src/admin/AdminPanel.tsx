'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';

// Types pour les sections admin
type AdminSection = 'dashboard' | 'products' | 'categories' | 'farms' | 'config' | 'seo' | 'telegram';

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

// Styles pour les listes de données
const DataGrid = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 20px;
`;

const DataItem = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.2);
  }
`;

const ProductCard = styled(DataItem)`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 15px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProductName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const ProductDetails = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'add' }>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'edit':
        return `
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
          &:hover { transform: translateY(-2px); }
        `;
      case 'delete':
        return `
          background: linear-gradient(135deg, #fc466b, #3f5efb);
          color: white;
          &:hover { transform: translateY(-2px); }
        `;
      case 'add':
        return `
          background: linear-gradient(135deg, #43e97b, #38f9d7);
          color: white;
          &:hover { transform: translateY(-2px); }
        `;
      default:
        return `
          background: rgba(255,255,255,0.1);
          color: white;
          &:hover { background: rgba(255,255,255,0.2); }
        `;
    }
  }}
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(0,0,0,0.9);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const Select = styled.select`
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

  option {
    background: #1a1a1a;
    color: white;
  }
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 50px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  cursor: pointer;
  
  &:focus {
    border-color: rgba(255,255,255,0.4);
  }
`;

const ConfigPreview = styled.div<{ $bgType: string; $bgColor: string; $bgImage?: string }>`
  width: 100%;
  height: 200px;
  border-radius: 15px;
  background: ${props => {
    if (props.$bgType === 'image' && props.$bgImage) {
      return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.$bgImage})`;
    }
    return `linear-gradient(135deg, ${props.$bgColor} 0%, #1a1a1a 50%, ${props.$bgColor} 100%)`;
  }};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-top: 15px;
  border: 1px solid rgba(255,255,255,0.1);
`;

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // État pour les données
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  
  // État pour les formulaires
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(dataService.getProducts());
    setCategories(dataService.getCategories());
    setFarms(dataService.getFarms());
    setConfig(dataService.getConfig());
  };

  const menuItems = [
    { id: 'dashboard' as AdminSection, icon: '📊', label: 'Tableau de bord' },
    { id: 'products' as AdminSection, icon: '🌿', label: 'Produits' },
    { id: 'categories' as AdminSection, icon: '📂', label: 'Catégories' },
    { id: 'farms' as AdminSection, icon: '🏠', label: 'Farms' },
    { id: 'telegram' as AdminSection, icon: '✈️', label: 'Telegram' },
    { id: 'seo' as AdminSection, icon: '🔍', label: 'SEO & Meta' },
    { id: 'config' as AdminSection, icon: '⚙️', label: 'Configuration' },
  ];

  const handleMenuClick = (section: AdminSection) => {
    setActiveSection(section);
    setSidebarOpen(false); // Fermer la sidebar sur mobile après clic
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      dataService.deleteProduct(id);
      refreshData();
    }
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      dataService.updateProduct(editingProduct.id, productData);
    } else {
      dataService.addProduct(productData);
    }
    refreshData();
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleSaveConfig = (newConfig: Partial<ShopConfig>) => {
    dataService.updateConfig(newConfig);
    refreshData();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
                                      <StatsGrid>
               <StatCard>
                 <StatValue>{products.length}</StatValue>
                 <StatLabel>Produits</StatLabel>
               </StatCard>
             </StatsGrid>
             <ContentSection>
               <SectionTitle>🌿 Vue d'ensemble BIPCOSA06</SectionTitle>
               <p style={{ textAlign: 'center', fontSize: '16px', lineHeight: '1.6' }}>
                 Bienvenue dans le panel d'administration de votre boutique Cannabis.<br/>
                 Gérez tous les aspects de BIPCOSA06 depuis cette interface centralisée.
               </p>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                 <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                   <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Catégories</div>
                   <div style={{ fontSize: '20px', fontWeight: '600' }}>{categories.filter(c => c.value !== 'all').length}</div>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                   <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Farms</div>
                   <div style={{ fontSize: '20px', fontWeight: '600' }}>{farms.filter(f => f.value !== 'all').length}</div>
                 </div>
               </div>
             </ContentSection>
          </>
        );

             case 'products':
         return (
           <ContentSection>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <SectionTitle>🌿 Gestion des Produits</SectionTitle>
               <ActionButton $variant="add" onClick={() => setIsAddingProduct(true)}>
                 + Ajouter un produit
               </ActionButton>
             </div>
             
             <DataGrid>
               {products.map((product) => (
                 <ProductCard key={product.id}>
                   <ProductImage src={product.image} alt={product.name} />
                   <ProductInfo>
                     <ProductName>{product.name}</ProductName>
                     <ProductDetails>
                       {product.quality} • {categories.find(c => c.value === product.category)?.label} • {farms.find(f => f.value === product.farm)?.label}
                     </ProductDetails>
                     <ProductDetails>{product.description.substring(0, 60)}...</ProductDetails>
                   </ProductInfo>
                   <ActionButtons>
                     <ActionButton $variant="edit" onClick={() => setEditingProduct(product)}>
                       ✏️ Modifier
                     </ActionButton>
                     <ActionButton $variant="delete" onClick={() => handleDeleteProduct(product.id)}>
                       🗑️ Supprimer
                     </ActionButton>
                   </ActionButtons>
                 </ProductCard>
               ))}
             </DataGrid>
           </ContentSection>
                   );

        case 'categories':
          return (
            <ContentSection>
              <SectionTitle>📂 Gestion des Catégories</SectionTitle>
              <p style={{ textAlign: 'center', marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>
                Gérez les catégories de produits Cannabis (Indica, Sativa, Hybride)
              </p>
              
              <DataGrid>
                {categories.filter(c => c.value !== 'all').map((category) => (
                  <DataItem key={category.value}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <ProductName>{category.label}</ProductName>
                        <ProductDetails>Code: {category.value}</ProductDetails>
                      </div>
                      <ActionButtons>
                        <ActionButton $variant="edit">✏️ Modifier</ActionButton>
                        <ActionButton $variant="delete">🗑️ Supprimer</ActionButton>
                      </ActionButtons>
                    </div>
                  </DataItem>
                ))}
              </DataGrid>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <ActionButton $variant="add">+ Ajouter une catégorie</ActionButton>
              </div>
            </ContentSection>
          );

        case 'farms':
          return (
            <ContentSection>
              <SectionTitle>🏠 Gestion des Farms</SectionTitle>
              <p style={{ textAlign: 'center', marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>
                Gérez les fermes et origines des produits Cannabis
              </p>
              
              <DataGrid>
                {farms.filter(f => f.value !== 'all').map((farm) => (
                  <DataItem key={farm.value}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <ProductName>{farm.country} {farm.label}</ProductName>
                        <ProductDetails>Code: {farm.value}</ProductDetails>
                      </div>
                      <ActionButtons>
                        <ActionButton $variant="edit">✏️ Modifier</ActionButton>
                        <ActionButton $variant="delete">🗑️ Supprimer</ActionButton>
                      </ActionButtons>
                    </div>
                  </DataItem>
                ))}
              </DataGrid>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <ActionButton $variant="add">+ Ajouter une farm</ActionButton>
              </div>
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
             <SectionTitle>⚙️ Configuration de la Boutique</SectionTitle>
             <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.8)' }}>
               Personnalisez l'apparence et les paramètres de votre boutique BIPCOSA06
             </p>
             
             <div style={{ display: 'grid', gap: '30px' }}>
               {/* Configuration Background */}
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
                 <h4 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '18px', textAlign: 'center' }}>
                   🎨 Configuration du Background
                 </h4>
                 
                 <FormGroup>
                   <Label>Type de background</Label>
                   <Select value={config.backgroundType} onChange={(e) => handleSaveConfig({ backgroundType: e.target.value as 'gradient' | 'image' })}>
                     <option value="gradient">Dégradé de couleurs</option>
                     <option value="image">Image personnalisée</option>
                   </Select>
                 </FormGroup>

                 <FormGroup>
                   <Label>Couleur principale</Label>
                   <ColorPicker 
                     type="color" 
                     value={config.backgroundColor} 
                     onChange={(e) => handleSaveConfig({ backgroundColor: e.target.value })}
                   />
                 </FormGroup>

                 {config.backgroundType === 'image' && (
                   <FormGroup>
                     <Label>URL de l'image de fond</Label>
                     <Input 
                       type="url" 
                       value={config.backgroundImage || ''} 
                       onChange={(e) => handleSaveConfig({ backgroundImage: e.target.value })}
                       placeholder="https://images.unsplash.com/..." 
                     />
                   </FormGroup>
                 )}

                 <ConfigPreview 
                   $bgType={config.backgroundType} 
                   $bgColor={config.backgroundColor}
                   $bgImage={config.backgroundImage}
                 >
                   {config.shopName}
                 </ConfigPreview>
               </div>

               {/* Configuration Générale */}
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
                 <h4 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '18px', textAlign: 'center' }}>
                   🏪 Informations Générales
                 </h4>
                 
                 <FormGroup>
                   <Label>Nom de la boutique</Label>
                   <Input 
                     type="text" 
                     value={config.shopName} 
                     onChange={(e) => handleSaveConfig({ shopName: e.target.value })}
                   />
                 </FormGroup>
                 
                 <FormGroup>
                   <Label>Description</Label>
                   <Input 
                     type="text" 
                     value={config.description} 
                     onChange={(e) => handleSaveConfig({ description: e.target.value })}
                   />
                 </FormGroup>
               </div>
             </div>
             
             <div style={{ marginTop: '30px', textAlign: 'center' }}>
               <ActionButton $variant="add" onClick={() => alert('Configuration sauvegardée automatiquement !')}>
                 💾 Configuration sauvegardée
               </ActionButton>
             </div>
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