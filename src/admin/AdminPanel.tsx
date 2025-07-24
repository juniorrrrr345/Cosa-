'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';

// Types pour les sections admin - SIMPLIFIÉ
type AdminSection = 'products' | 'categories' | 'farms' | 'pages' | 'config';

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
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  background: rgba(0,0,0,0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: relative;
  overflow-y: auto;

  @media (min-width: 768px) {
    width: 280px;
    height: 100vh;
    border-right: 1px solid rgba(255,255,255,0.1);
    border-bottom: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;
`;

const SidebarTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
`;

const SidebarNav = styled.nav`
  padding: 20px 0;
`;

const NavItem = styled.div<{ $active: boolean }>`
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  border-left: ${props => props.$active ? '3px solid white' : '3px solid transparent'};
  color: ${props => props.$active ? 'white' : 'rgba(255,255,255,0.7)'};
  font-weight: ${props => props.$active ? '600' : '400'};

  &:hover {
    background: rgba(255,255,255,0.05);
    color: white;
  }
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin: 15px 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 100vh;

  @media (max-width: 767px) {
    max-height: calc(100vh - 200px);
  }
`;

const ContentSection = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  margin: 0 0 30px 0;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  option {
    background: #1a1a1a;
    color: white;
    padding: 10px;
  }
`;

const ActionButton = styled.button<{ $variant?: 'add' | 'edit' | 'delete' | 'save' | 'cancel' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-right: 10px;

  ${props => {
    switch (props.$variant) {
      case 'add':
        return `
          background: rgba(76, 175, 80, 0.8);
          color: white;
          &:hover { background: rgba(76, 175, 80, 1); }
        `;
      case 'edit':
        return `
          background: rgba(33, 150, 243, 0.8);
          color: white;
          &:hover { background: rgba(33, 150, 243, 1); }
        `;
      case 'delete':
        return `
          background: rgba(244, 67, 54, 0.8);
          color: white;
          &:hover { background: rgba(244, 67, 54, 1); }
        `;
      case 'save':
        return `
          background: rgba(76, 175, 80, 0.8);
          color: white;
          &:hover { background: rgba(76, 175, 80, 1); }
        `;
      case 'cancel':
        return `
          background: rgba(158, 158, 158, 0.8);
          color: white;
          &:hover { background: rgba(158, 158, 158, 1); }
        `;
      default:
        return `
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          &:hover { background: rgba(255,255,255,0.2); }
        `;
    }
  }}
`;

const ItemList = styled.div`
  display: grid;
  gap: 15px;
  margin-top: 20px;
`;

const ItemCard = styled.div`
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

const PriceList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 15px;
`;

const PriceItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 8px;
`;

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);

  // États pour les formulaires
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Charger les données
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const [productsData, categoriesData, farmsData, configData] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getFarms(),
        dataService.getConfig()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFarms(farmsData);
      setConfig(configData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  // Fonctions pour les produits
  const handleAddProduct = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      quality: '',
      image: '',
      video: '',
      flagColor: '#333333',
      flagText: '',
      category: '',
      farm: '',
      description: '',
      prices: [{ weight: '1g', price: '10€' }]
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
  };

  const handleSaveProduct = async () => {
    try {
      if (isAdding) {
        const newProduct = {
          ...formData,
          id: Date.now().toString()
        };
        await dataService.addProduct(newProduct);
      } else if (editingId) {
        await dataService.updateProduct(editingId, formData);
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({});
      await refreshData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await dataService.deleteProduct(id);
        await refreshData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleCancelProduct = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  // Fonctions pour les prix
  const addPrice = () => {
    const prices = formData.prices || [];
    setFormData({
      ...formData,
      prices: [...prices, { weight: '', price: '' }]
    });
  };

  const updatePrice = (index: number, field: 'weight' | 'price', value: string) => {
    const prices = [...(formData.prices || [])];
    prices[index] = { ...prices[index], [field]: value };
    setFormData({ ...formData, prices });
  };

  const removePrice = (index: number) => {
    const prices = [...(formData.prices || [])];
    prices.splice(index, 1);
    setFormData({ ...formData, prices });
  };

  // Fonctions pour les catégories
  const handleAddCategory = () => {
    setIsAdding(true);
    setFormData({ value: '', label: '' });
  };

  const handleSaveCategory = async () => {
    try {
      const newCategory = {
        ...formData,
        id: Date.now().toString()
      };
      await dataService.addCategory(newCategory);
      setIsAdding(false);
      setFormData({});
      await refreshData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await dataService.deleteCategory(id);
        await refreshData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Fonctions pour les farms
  const handleAddFarm = () => {
    setIsAdding(true);
    setFormData({ value: '', label: '' });
  };

  const handleSaveFarm = async () => {
    try {
      const newFarm = {
        ...formData,
        id: Date.now().toString()
      };
      await dataService.addFarm(newFarm);
      setIsAdding(false);
      setFormData({});
      await refreshData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette farm ?')) {
      try {
        await dataService.deleteFarm(id);
        await refreshData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Fonction pour la configuration
  const handleSaveConfig = async (newConfig: Partial<ShopConfig>) => {
    try {
      await dataService.updateConfig(newConfig);
      await refreshData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la config:', error);
      alert('Erreur lors de la mise à jour de la configuration');
    }
  };

  // Upload d'image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop volumineuse. Veuillez choisir une image de moins de 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (base64String) {
        if (currentSection === 'config') {
          handleSaveConfig({ backgroundImage: base64String });
        } else {
          setFormData({ ...formData, image: base64String });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const renderProducts = () => (
    <ContentSection>
      <SectionTitle>📦 Gestion des Produits</SectionTitle>
      
      <ActionButton $variant="add" onClick={handleAddProduct}>
        ➕ Ajouter un produit
      </ActionButton>

      {(isAdding || editingId) && (
        <ItemCard style={{ marginTop: '20px', border: '2px solid rgba(76, 175, 80, 0.5)' }}>
          <h3>{isAdding ? 'Nouveau Produit' : 'Modifier le Produit'}</h3>
          
          <FormGroup>
            <Label>Nom du produit</Label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom du produit"
            />
          </FormGroup>

          <FormGroup>
            <Label>Qualité</Label>
            <Input
              value={formData.quality || ''}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              placeholder="Qualité du produit"
            />
          </FormGroup>

          <FormGroup>
            <Label>Image du produit</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '10px',
                width: '100%'
              }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Catégorie</Label>
            <Select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.value}>{cat.label}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Farm</Label>
            <Select
              value={formData.farm || ''}
              onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
            >
              <option value="">Sélectionner une farm</option>
              {farms.map(farm => (
                <option key={farm.id} value={farm.value}>{farm.label}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Drapeau/Origine</Label>
            <Input
              value={formData.flagText || ''}
              onChange={(e) => setFormData({ ...formData, flagText: e.target.value })}
              placeholder="🇳🇱 HOLLAND"
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du produit"
            />
          </FormGroup>

          <FormGroup>
            <Label>Prix et quantités</Label>
            <PriceList>
              {(formData.prices || []).map((price: any, index: number) => (
                <PriceItem key={index}>
                  <Input
                    placeholder="Quantité (1g, 3.5g...)"
                    value={price.weight}
                    onChange={(e) => updatePrice(index, 'weight', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Input
                    placeholder="Prix (10€, 35€...)"
                    value={price.price}
                    onChange={(e) => updatePrice(index, 'price', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <ActionButton $variant="delete" onClick={() => removePrice(index)}>
                    🗑️
                  </ActionButton>
                </PriceItem>
              ))}
              <ActionButton onClick={addPrice}>
                ➕ Ajouter un prix
              </ActionButton>
            </PriceList>
          </FormGroup>

          <div style={{ marginTop: '20px' }}>
            <ActionButton $variant="save" onClick={handleSaveProduct}>
              💾 Sauvegarder
            </ActionButton>
            <ActionButton $variant="cancel" onClick={handleCancelProduct}>
              ❌ Annuler
            </ActionButton>
          </div>
        </ItemCard>
      )}

      <ItemList>
        {products.map(product => (
          <ItemCard key={product.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3>{product.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0' }}>{product.quality}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{product.flagText}</p>
                <div style={{ marginTop: '10px' }}>
                  {product.prices?.map((price, idx) => (
                    <span key={idx} style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      marginRight: '5px',
                      display: 'inline-block',
                      marginBottom: '5px'
                    }}>
                      {price.weight}: {price.price}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <ActionButton $variant="edit" onClick={() => handleEditProduct(product)}>
                  ✏️
                </ActionButton>
                <ActionButton $variant="delete" onClick={() => handleDeleteProduct(product.id)}>
                  🗑️
                </ActionButton>
              </div>
            </div>
          </ItemCard>
        ))}
      </ItemList>
    </ContentSection>
  );

  const renderCategories = () => (
    <ContentSection>
      <SectionTitle>📂 Gestion des Catégories</SectionTitle>
      
      <ActionButton $variant="add" onClick={handleAddCategory}>
        ➕ Ajouter une catégorie
      </ActionButton>

      {isAdding && (
        <ItemCard style={{ marginTop: '20px', border: '2px solid rgba(76, 175, 80, 0.5)' }}>
          <h3>Nouvelle Catégorie</h3>
          
          <FormGroup>
            <Label>Nom de la catégorie</Label>
            <Input
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value, value: e.target.value.toLowerCase() })}
              placeholder="Indica, Sativa, Hybride..."
            />
          </FormGroup>

          <div style={{ marginTop: '20px' }}>
            <ActionButton $variant="save" onClick={handleSaveCategory}>
              💾 Sauvegarder
            </ActionButton>
            <ActionButton $variant="cancel" onClick={() => setIsAdding(false)}>
              ❌ Annuler
            </ActionButton>
          </div>
        </ItemCard>
      )}

      <ItemList>
        {categories.map(category => (
          <ItemCard key={category.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{category.label}</h3>
              </div>
              <div>
                <ActionButton $variant="delete" onClick={() => handleDeleteCategory(category.id)}>
                  🗑️
                </ActionButton>
              </div>
            </div>
          </ItemCard>
        ))}
      </ItemList>
    </ContentSection>
  );

  const renderFarms = () => (
    <ContentSection>
      <SectionTitle>🌱 Gestion des Farms</SectionTitle>
      
      <ActionButton $variant="add" onClick={handleAddFarm}>
        ➕ Ajouter une farm
      </ActionButton>

      {isAdding && (
        <ItemCard style={{ marginTop: '20px', border: '2px solid rgba(76, 175, 80, 0.5)' }}>
          <h3>Nouvelle Farm</h3>
          
          <FormGroup>
            <Label>Nom de la farm</Label>
            <Input
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value, value: e.target.value.toLowerCase() })}
              placeholder="Holland, Espagne, Calispain..."
            />
          </FormGroup>

          <div style={{ marginTop: '20px' }}>
            <ActionButton $variant="save" onClick={handleSaveFarm}>
              💾 Sauvegarder
            </ActionButton>
            <ActionButton $variant="cancel" onClick={() => setIsAdding(false)}>
              ❌ Annuler
            </ActionButton>
          </div>
        </ItemCard>
      )}

      <ItemList>
        {farms.map(farm => (
          <ItemCard key={farm.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{farm.label}</h3>
              </div>
              <div>
                <ActionButton $variant="delete" onClick={() => handleDeleteFarm(farm.id)}>
                  🗑️
                </ActionButton>
              </div>
            </div>
          </ItemCard>
        ))}
      </ItemList>
    </ContentSection>
  );

  const renderPages = () => (
    <ContentSection>
      <SectionTitle>📄 Contenu des Pages</SectionTitle>
      
      <div style={{ display: 'grid', gap: '30px' }}>
        {/* Page Info */}
        <ItemCard>
          <h3>📋 Page Info</h3>
          <FormGroup>
            <Label>Contenu de la page Info</Label>
            <TextArea
              value={config.infoContent || ''}
              onChange={(e) => handleSaveConfig({ infoContent: e.target.value })}
              placeholder="Contenu de la page d'informations..."
              style={{ minHeight: '120px' }}
            />
          </FormGroup>
        </ItemCard>

        {/* Page Contact */}
        <ItemCard>
          <h3>📞 Page Contact</h3>
          <FormGroup>
            <Label>Contenu de la page Contact</Label>
            <TextArea
              value={config.contactContent || ''}
              onChange={(e) => handleSaveConfig({ contactContent: e.target.value })}
              placeholder="Contenu de la page de contact..."
              style={{ minHeight: '120px' }}
            />
          </FormGroup>
        </ItemCard>

        {/* Liens */}
        <ItemCard>
          <h3>🔗 Liens</h3>
          <FormGroup>
            <Label>Lien Canal Telegram</Label>
            <Input
              value={config.telegramLink || ''}
              onChange={(e) => handleSaveConfig({ telegramLink: e.target.value })}
              placeholder="https://t.me/bipcosa06"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Message de commande Telegram</Label>
            <Input
              value={config.telegramOrderMessageTemplate || ''}
              onChange={(e) => handleSaveConfig({ telegramOrderMessageTemplate: e.target.value })}
              placeholder="Bonjour, je souhaite commander {productName} de BIPCOSA06"
            />
          </FormGroup>
        </ItemCard>
      </div>
    </ContentSection>
  );

  const renderConfig = () => (
    <ContentSection>
      <SectionTitle>⚙️ Configuration</SectionTitle>
      
      <ItemCard>
        <h3>🎨 Background de la boutique</h3>
        
        <FormGroup>
          <Label>Type de background</Label>
          <Select value={config.backgroundType || 'gradient'} onChange={(e) => handleSaveConfig({ backgroundType: e.target.value as 'gradient' | 'image' })}>
            <option value="gradient">Dégradé noir</option>
            <option value="image">Image personnalisée</option>
          </Select>
        </FormGroup>

        {config.backgroundType === 'image' && (
          <div>
            <FormGroup>
              <Label>Upload d'image de fond</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '10px',
                  width: '100%'
                }}
              />
              {config.backgroundImage && config.backgroundImage.startsWith('data:') && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img 
                    src={config.backgroundImage} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '100px', 
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }} 
                  />
                  <ActionButton $variant="delete" onClick={() => handleSaveConfig({ backgroundImage: '' })}>
                    🗑️ Supprimer
                  </ActionButton>
                </div>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label>Ou URL d'image</Label>
              <Input 
                type="url" 
                value={config.backgroundImage || ''} 
                onChange={(e) => handleSaveConfig({ backgroundImage: e.target.value })}
                placeholder="https://images.unsplash.com/..." 
              />
            </FormGroup>
          </div>
        )}
      </ItemCard>
    </ContentSection>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'products':
        return renderProducts();
      case 'categories':
        return renderCategories();
      case 'farms':
        return renderFarms();
      case 'pages':
        return renderPages();
      case 'config':
        return renderConfig();
      default:
        return renderProducts();
    }
  };

  return (
    <AdminContainer>
      <Sidebar $isOpen={true}>
        <SidebarHeader>
          <SidebarTitle>BIPCOSA06 Admin</SidebarTitle>
        </SidebarHeader>
        
        <BackButton onClick={onBack}>
          ← Retour à la boutique
        </BackButton>
        
        <SidebarNav>
          <NavItem 
            $active={currentSection === 'products'} 
            onClick={() => setCurrentSection('products')}
          >
            📦 Produits
          </NavItem>
          <NavItem 
            $active={currentSection === 'categories'} 
            onClick={() => setCurrentSection('categories')}
          >
            📂 Catégories
          </NavItem>
          <NavItem 
            $active={currentSection === 'farms'} 
            onClick={() => setCurrentSection('farms')}
          >
            🌱 Farms
          </NavItem>
          <NavItem 
            $active={currentSection === 'pages'} 
            onClick={() => setCurrentSection('pages')}
          >
            📄 Pages Info/Contact
          </NavItem>
          <NavItem 
            $active={currentSection === 'config'} 
            onClick={() => setCurrentSection('config')}
          >
            ⚙️ Configuration
          </NavItem>
        </SidebarNav>
      </Sidebar>

      <Content>
        {renderContent()}
      </Content>
    </AdminContainer>
  );
};

export default AdminPanel;