'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';
import { SocialNetwork } from '@/models/SocialNetwork';

// Types pour les sections admin
type AdminSection = 'dashboard' | 'products' | 'categories' | 'farms' | 'social-networks' | 'content-info' | 'content-contact' | 'config' | 'background';

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

const SidebarToggle = styled.button`
  display: none; /* Complètement supprimé */
`;

const SidebarHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
  letter-spacing: 1px;
`;

const SidebarMenu = styled.div`
  display: flex;
  padding: 10px;
  overflow-x: auto;
  gap: 10px;

  @media (min-width: 768px) {
    flex-direction: column;
    padding: 20px 0;
    overflow-x: visible;
    gap: 0;
  }
`;

const MenuItem = styled.div<{ $active: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)'};
  border: 1px solid ${props => props.$active ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'};
  border-radius: 12px;
  white-space: nowrap;
  min-width: fit-content;
  text-align: center;
  
  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
  }

  @media (min-width: 768px) {
    padding: 15px 20px;
    border-radius: 0;
    border: none;
    border-left: ${props => props.$active ? '3px solid #fff' : '3px solid transparent'};
    background: ${props => props.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
    text-align: left;
    min-width: auto;
    white-space: normal;
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
  padding: 15px;
  overflow-y: auto;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0;
  flex-wrap: wrap;
  gap: 10px;

  @media (min-width: 768px) {
    margin-bottom: 30px;
    flex-wrap: nowrap;
  }
`;

const ContentTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: white;

  @media (min-width: 768px) {
    font-size: 24px;
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
  grid-template-columns: 60px 1fr auto;
  gap: 10px;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 80px 1fr auto;
    gap: 15px;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;

  @media (min-width: 768px) {
    width: 80px;
    height: 60px;
    border-radius: 8px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProductName = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ProductDetails = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.7);
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 8px;
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'add' }>`
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  ${props => {
    switch (props.$variant) {
      case 'edit':
        return `
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          &:hover { 
            background: rgba(255,255,255,0.25);
            transform: translateY(-2px); 
          }
        `;
      case 'delete':
        return `
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          &:hover { 
            background: rgba(0,0,0,0.9);
            transform: translateY(-2px); 
          }
        `;
      case 'add':
        return `
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.4);
          color: white;
          &:hover { 
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px); 
          }
        `;
      default:
        return `
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
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
  background: rgba(0,0,0,0.95);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 20px;
  max-width: 600px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;

  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 30px;
    width: 100%;
    max-height: 80vh;
  }
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



const ConfigPreview = styled.div<{ $bgType: string; $bgImage?: string; $bgUrl?: string }>`
  width: 100%;
  height: 200px;
  border-radius: 15px;
  background: ${props => {
    // URL externe (Imgur, etc.)
    if (props.$bgType === 'url' && props.$bgUrl) {
      return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.$bgUrl})`;
    }
    // Image Cloudinary
    if (props.$bgType === 'image' && props.$bgImage) {
      return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.$bgImage})`;
    }
    // Dégradé par défaut (pas de couleur personnalisée)
    return 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
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
  
  // État pour les contenus Info et Contact
  const [infoContent, setInfoContent] = useState<InfoContent>({
    id: 'main-info',
    title: 'À propos de BIPCOSA06',
    description: 'BIPCOSA06 est votre boutique de confiance pour les produits Cannabis de qualité supérieure dans la région lyonnaise.',
    items: ['✅ Produits de qualité premium', '✅ Livraison rapide et discrète', '✅ Service client 24/7', '✅ Paiement sécurisé', '✅ Garantie satisfaction']
  });
  
  const [contactContent, setContactContent] = useState<ContactContent>({
    id: 'main-contact',
    title: '✉️ Nous Contacter',
    description: 'Contactez-nous directement via Telegram pour toutes vos commandes et questions. Notre équipe est disponible 24h/24 pour vous servir.',
    telegramUsername: '@bipcosa06',
    telegramLink: 'https://t.me/bipcosa06',
    additionalInfo: '📍 Zones de livraison: Lyon et région (69, 71, 01, 42, 38)\n⏰ Horaires: 24h/24 - 7j/7\n💳 Paiements acceptés: Espèces, Crypto\n🚚 Livraison: Rapide et discrète'
  });

  // État pour les réseaux sociaux
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);
  const [editingSocial, setEditingSocial] = useState<SocialNetwork | null>(null);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [socialFormData, setSocialFormData] = useState<Partial<SocialNetwork>>({});
  
  // État pour les formulaires
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  
  // État pour les uploads
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [backgroundUploading, setBackgroundUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Fonctions pour gérer les prix multiples
  const addPrice = () => {
    const currentPrices = formData.prices || [];
    const newPrice = {
      id: Date.now().toString(),
      weight: '',
      price: ''
    };
    setFormData({
      ...formData,
      prices: [...currentPrices, newPrice]
    });
  };

  const updatePrice = (index: number, field: string, value: string | number) => {
    const currentPrices = formData.prices || [];
    const updatedPrices = [...currentPrices];
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: value
    };
    setFormData({
      ...formData,
      prices: updatedPrices
    });
  };

  const removePrice = (index: number) => {
    const currentPrices = formData.prices || [];
    const updatedPrices = currentPrices.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      prices: updatedPrices
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const [productsData, categoriesData, farmsData, configData, infoData, contactData, socialData] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getFarms(),
        dataService.getConfig(),
        Promise.resolve(dataService.getInfoContents()),
        Promise.resolve(dataService.getContactContents()),
        dataService.getSocialNetworks()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFarms(farmsData);
      setConfig(configData);
      setSocialNetworks(socialData);
      
      // Charger les contenus existants
      if (infoData.length > 0) {
        setInfoContent(infoData[0]);
      }
      if (contactData.length > 0) {
        setContactContent(contactData[0]);
      }
      
      console.log('🔄 Admin: Données actualisées', {
        products: productsData.length,
        categories: categoriesData.length,
        farms: farmsData.length,
        info: infoData.length,
        contact: contactData.length
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'actualisation des données:', error);
      // Fallback sur les données synchrones
      setProducts(dataService.getProductsSync());
      setCategories(dataService.getCategoriesSync());
      setFarms(dataService.getFarmsSync());
      setConfig(dataService.getConfigSync());
    }
  };

  // Fonctions de sauvegarde pour Info et Contact
  const handleSaveInfoContent = () => {
    try {
      dataService.updateInfoContent(infoContent);
      
      // Forcer la synchronisation immédiate
      setTimeout(() => {
        dataService.forceSyncContent();
      }, 200);
      
      alert('✅ Contenu Info sauvegardé et synchronisé !');
      console.log('💾 Admin: Info sauvegardé et synchronisé');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde Info:', error);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleSaveContactContent = () => {
    try {
      dataService.updateContactContent(contactContent);
      
      // Forcer la synchronisation immédiate
      setTimeout(() => {
        dataService.forceSyncContent();
      }, 200);
      
      alert('✅ Contenu Contact sauvegardé et synchronisé !');
      console.log('💾 Admin: Contact sauvegardé et synchronisé');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde Contact:', error);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  const menuItems = [
    { id: 'dashboard' as AdminSection, icon: '📊', label: 'Tableau de bord' },
    { id: 'products' as AdminSection, icon: '🌿', label: 'Produits' },
    { id: 'categories' as AdminSection, icon: '📂', label: 'Catégories' },
    { id: 'farms' as AdminSection, icon: '🏠', label: 'Farms' },
    { id: 'social-networks' as AdminSection, icon: '🌐', label: 'Réseaux Sociaux' },
    { id: 'background' as AdminSection, icon: '🖼️', label: 'Background' },
    { id: 'content-info' as AdminSection, icon: 'ℹ️', label: 'Contenu Info' },
    { id: 'content-contact' as AdminSection, icon: '✉️', label: 'Contenu Contact' },
    { id: 'config' as AdminSection, icon: '⚙️', label: 'Configuration' },
  ];

  const handleMenuClick = (section: AdminSection) => {
    setActiveSection(section);
    setSidebarOpen(false); // Fermer la sidebar sur mobile après clic
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        console.log('🗑️ Admin: Suppression du produit', id);
        const success = await dataService.deleteProduct(id);
        if (success) {
          console.log('✅ Produit supprimé avec succès');
          await refreshData();
        } else {
          alert('Erreur lors de la suppression du produit');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    // S'assurer que les prix ont des IDs pour la gestion
    const productWithIds = {
      ...product,
      prices: product.prices?.map((price, index) => ({
        ...price,
        id: price.id || `${Date.now()}-${index}`
      })) || []
    };
    setFormData(productWithIds);
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setFormData({
      name: '',
      quality: '',
      image: '',
      flagColor: '#333333',
      flagText: '',
      category: 'indica',
      farm: 'holland',
      description: '',
              prices: [
          { id: '1', weight: '1g', price: '10€' },
          { id: '2', weight: '3.5g', price: '30€' },
          { id: '3', weight: '7g', price: '55€' }
        ],
      video: ''
    });
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.category || !formData.farm) {
      alert('Veuillez remplir le nom, la catégorie et la ferme');
      return;
    }

    try {
      // Préparer les données avec des valeurs par défaut
      const productData = {
        name: formData.name,
        quality: formData.quality || 'Qualité Standard',
        image: formData.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400',
        flagColor: formData.flagColor || '#333333',
        flagText: formData.flagText || '🌿',
        category: formData.category,
        farm: formData.farm,
        description: formData.description || '',
        prices: formData.prices || [{ id: '1', weight: '1g', price: '10€' }],
        video: formData.video || ''
      };

      if (editingProduct) {
        console.log('✏️ Admin: Modification du produit', editingProduct.id);
        await dataService.updateProduct(editingProduct.id, productData);
        console.log('✅ Produit modifié avec succès');
        alert('✅ Produit modifié avec succès !');
      } else {
        console.log('➕ Admin: Ajout d\'un nouveau produit');
        await dataService.addProduct({
          ...productData,
          id: Date.now() // ID unique pour les nouveaux produits
        });
        console.log('✅ Produit ajouté avec succès');
        alert('✅ Produit ajouté avec succès !');
      }
      
      await refreshData();
      setEditingProduct(null);
      setIsAddingProduct(false);
      setFormData({});
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert(`❌ Erreur lors de la sauvegarde: ${error.message || error}`);
    }
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setFormData({});
  };

  const handleSaveConfig = async (newConfig: Partial<ShopConfig>) => {
    try {
      console.log('⚙️ Admin: Mise à jour de la configuration:', newConfig);
      
      // Mise à jour via dataService
      const updatedConfig = await dataService.updateConfig(newConfig);
      
      // NE PAS mettre à jour l'état local pour éviter d'écraser les changements en cours
      // setConfig est géré uniquement par les événements onChange
      
      console.log('✅ Configuration mise à jour avec succès');
      
      // Notifier toutes les pages de la boutique
      window.dispatchEvent(new CustomEvent('configUpdated', { 
        detail: updatedConfig 
      }));
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la config:', error);
      // Ne pas afficher d'alert pour les erreurs de sauvegarde automatique
      console.warn('⚠️ Sauvegarde échouée, changement conservé localement');
    }
  };

  // Fonctions d'upload avec Cloudinary
  const handleImageUpload = async (file: File, type: 'product' | 'background' = 'product') => {
    if (!file) return null;

    setUploading(true);
    setUploadProgress({ [file.name]: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', type === 'product' ? 'bipcosa06/products' : 'bipcosa06/backgrounds');
      
      if (type === 'product' && editingProduct) {
        formData.append('publicId', `product_${editingProduct.id}`);
      }

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      setUploadProgress({ [file.name]: 100 });
      
      console.log('✅ Image uploadée:', result.data.url);
      return result.data;

    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      alert(`Erreur lors de l'upload: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress({}), 2000);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return null;

    setUploading(true);
    setUploadProgress({ [file.name]: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'bipcosa06/videos');
      
      if (editingProduct) {
        formData.append('publicId', `video_${editingProduct.id}`);
      }

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const result = await response.json();
      setUploadProgress({ [file.name]: 100 });
      
      console.log('✅ Vidéo uploadée:', result.data.url);
      return result.data;

    } catch (error) {
      console.error('❌ Erreur upload vidéo:', error);
      alert(`Erreur lors de l'upload: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress({}), 2000);
    }
  };

  // Gestion des uploads dans les formulaires
  const handleProductImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await handleImageUpload(file, 'product');
    if (result) {
      setFormData(prev => ({
        ...prev,
        image: result.url,
        imagePublicId: result.publicId
      }));
    }
  };

  const handleProductVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await handleVideoUpload(file);
    if (result) {
      setFormData(prev => ({
        ...prev,
        video: result.url,
        videoPublicId: result.publicId
      }));
    }
  };

  const handleBackgroundImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await handleImageUpload(file, 'background');
    if (result) {
      const newConfig = {
        ...config,
        backgroundType: 'image' as const,
        backgroundImage: result.url,
        backgroundImagePublicId: result.publicId
      };
      await handleSaveConfig(newConfig);
    }
  };

  // Fonction pour convertir les URLs Imgur automatiquement
  const convertImgurUrl = (url: string): string => {
    if (!url) return url;
    
    // Détection d'URL Imgur galerie
    const imgurGalleryPattern = /https?:\/\/imgur\.com\/a\/([a-zA-Z0-9]+)(?:#[a-zA-Z0-9]+)?/;
    const imgurSinglePattern = /https?:\/\/imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z0-9]+)?$/;
    
    let match = url.match(imgurGalleryPattern);
    if (match) {
      // Conversion galerie vers image directe
      const imageId = match[1];
      return `https://i.imgur.com/${imageId}.jpg`;
    }
    
    match = url.match(imgurSinglePattern);
    if (match) {
      // Conversion image simple vers directe
      const imageId = match[1];
      return `https://i.imgur.com/${imageId}.jpg`;
    }
    
    return url;
  };

  // Fonction pour valider une URL d'image
  const validateImageUrl = (url: string): { isValid: boolean; message?: string; convertedUrl?: string } => {
    if (!url) return { isValid: true };
    
    try {
      const parsedUrl = new URL(url);
      
      // Vérifier si c'est HTTPS
      if (parsedUrl.protocol !== 'https:') {
        return { 
          isValid: false, 
          message: '⚠️ Utilisez une URL HTTPS pour la sécurité' 
        };
      }
      
      // Convertir automatiquement les URLs Imgur si nécessaire
      const convertedUrl = convertImgurUrl(url);
      if (convertedUrl !== url) {
        return {
          isValid: true,
          convertedUrl,
          message: '🔄 URL Imgur convertie automatiquement'
        };
      }
      
      // Vérifier si l'URL se termine par une extension d'image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasImageExtension = imageExtensions.some(ext => 
        parsedUrl.pathname.toLowerCase().includes(ext) || 
        parsedUrl.search.includes('format') ||
        parsedUrl.hostname.includes('unsplash') ||
        parsedUrl.hostname.includes('cloudinary')
      );
      
      if (!hasImageExtension && !parsedUrl.hostname.includes('unsplash') && !parsedUrl.hostname.includes('cloudinary')) {
        return { 
          isValid: false, 
          message: '⚠️ L\'URL ne semble pas pointer vers une image directe' 
        };
      }
      
      return { isValid: true, message: '✅ URL d\'image valide' };
      
    } catch (error) {
      return { 
        isValid: false, 
        message: '❌ URL invalide - Vérifiez le format' 
      };
    }
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
               <ActionButton $variant="add" onClick={handleAddProduct}>
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
                     <ActionButton $variant="edit" onClick={() => handleEditProduct(product)}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <SectionTitle>📂 Gestion des Catégories</SectionTitle>
                <ActionButton $variant="add" onClick={async () => {
                  const label = prompt('📂 Nom de la nouvelle catégorie:');
                  if (label && label.trim()) {
                    try {
                      console.log('📂 Ajout catégorie:', label.trim());
                      
                      // Générer un value basé sur le label
                      const value = label.trim().toLowerCase()
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      
                      await dataService.addCategory({ 
                        value, 
                        label: label.trim() 
                      });
                      
                      await refreshData();
                      alert('✅ Catégorie ajoutée avec succès !');
                    } catch (error) {
                      console.error('❌ Erreur ajout catégorie:', error);
                      alert('❌ Erreur lors de l\'ajout');
                    }
                  }
                }}>
                  + Ajouter une catégorie
                </ActionButton>
              </div>
              
              <DataGrid>
                {categories.filter(c => c.value !== 'all').map((category) => (
                  <DataItem key={category.value}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <ProductName>{category.label}</ProductName>
                        <ProductDetails>Code: {category.value}</ProductDetails>
                      </div>
                      <ActionButtons>
                        <ActionButton $variant="edit" onClick={async () => {
                          const newLabel = prompt('✏️ Nouveau nom:', category.label);
                          if (newLabel && newLabel.trim() !== category.label) {
                            try {
                              console.log('✏️ Modification catégorie:', category.value, newLabel.trim());
                              await dataService.updateCategory(category.value, { label: newLabel.trim() });
                              await refreshData();
                              alert('✅ Catégorie modifiée !');
                            } catch (error) {
                              console.error('❌ Erreur modification catégorie:', error);
                              alert('❌ Erreur lors de la modification');
                            }
                          }
                        }}>✏️ Modifier</ActionButton>
                        <ActionButton $variant="delete" onClick={async () => {
                          if (confirm(`🗑️ Supprimer la catégorie "${category.label}" ?`)) {
                            try {
                              console.log('🗑️ Suppression catégorie:', category.value);
                              const success = await dataService.deleteCategory(category.value);
                              if (success) {
                                await refreshData();
                                alert('✅ Catégorie supprimée !');
                              } else {
                                alert('❌ Impossible de supprimer cette catégorie');
                              }
                            } catch (error) {
                              console.error('❌ Erreur suppression catégorie:', error);
                              alert('❌ Erreur lors de la suppression');
                            }
                          }
                        }}>🗑️ Supprimer</ActionButton>
                      </ActionButtons>
                    </div>
                  </DataItem>
                ))}
              </DataGrid>
            </ContentSection>
          );

        case 'farms':
          return (
            <ContentSection>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <SectionTitle>🏠 Gestion des Farms</SectionTitle>
                <ActionButton $variant="add" onClick={async () => {
                  const label = prompt('🏠 Nom de la nouvelle ferme:');
                  if (label && label.trim()) {
                    const country = prompt('🌍 Emoji du pays (ex: 🇫🇷):', '🌍') || '🌍';
                    try {
                      console.log('🏠 Ajout ferme:', label.trim(), country);
                      
                      // Générer un value basé sur le label
                      const value = label.trim().toLowerCase()
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      
                      await dataService.addFarm({ 
                        value,
                        label: label.trim(), 
                        country 
                      });
                      
                      await refreshData();
                      alert('✅ Ferme ajoutée avec succès !');
                    } catch (error) {
                      console.error('❌ Erreur ajout ferme:', error);
                      alert('❌ Erreur lors de l\'ajout');
                    }
                  }
                }}>
                  + Ajouter une ferme
                </ActionButton>
              </div>
              
              <DataGrid>
                {farms.filter(f => f.value !== 'all').map((farm) => (
                  <DataItem key={farm.value}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <ProductName>{farm.country} {farm.label}</ProductName>
                        <ProductDetails>Code: {farm.value}</ProductDetails>
                      </div>
                      <ActionButtons>
                        <ActionButton $variant="edit" onClick={async () => {
                          const newLabel = prompt('✏️ Nouveau nom:', farm.label);
                          const newCountry = prompt('🌍 Nouveau pays:', farm.country);
                          if ((newLabel && newLabel.trim() !== farm.label) || (newCountry && newCountry !== farm.country)) {
                            try {
                              const updates: any = {};
                              if (newLabel && newLabel.trim() !== farm.label) updates.label = newLabel.trim();
                              if (newCountry && newCountry !== farm.country) updates.country = newCountry;
                              
                              console.log('✏️ Modification ferme:', farm.value, updates);
                              await dataService.updateFarm(farm.value, updates);
                              await refreshData();
                              alert('✅ Ferme modifiée !');
                            } catch (error) {
                              console.error('❌ Erreur modification ferme:', error);
                              alert('❌ Erreur lors de la modification');
                            }
                          }
                        }}>✏️ Modifier</ActionButton>
                        <ActionButton $variant="delete" onClick={async () => {
                          if (confirm(`🗑️ Supprimer la ferme "${farm.label}" ?`)) {
                            try {
                              console.log('🗑️ Suppression ferme:', farm.value);
                              const success = await dataService.deleteFarm(farm.value);
                              if (success) {
                                await refreshData();
                                alert('✅ Ferme supprimée !');
                              } else {
                                alert('❌ Impossible de supprimer cette ferme');
                              }
                            } catch (error) {
                              console.error('❌ Erreur suppression ferme:', error);
                              alert('❌ Erreur lors de la suppression');
                            }
                          }
                        }}>🗑️ Supprimer</ActionButton>
                      </ActionButtons>
                    </div>
                  </DataItem>
                ))}
              </DataGrid>
            </ContentSection>
          );

        case 'content-info':
          return (
            <ContentSection>
              <SectionTitle>ℹ️ Gestion du Contenu Info</SectionTitle>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.8)' }}>
                Gérez le contenu qui s'affiche dans la page "Infos" de la boutique
              </p>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <FormGroup>
                  <Label>Titre de la section Info</Label>
                  <Input 
                    type="text" 
                    placeholder="Ex: À propos de BIPCOSA06"
                    value={infoContent.title}
                    onChange={(e) => setInfoContent({...infoContent, title: e.target.value})}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Description principale</Label>
                  <TextArea 
                    placeholder="Description qui apparaît en haut de la page Info..."
                    value={infoContent.description}
                    onChange={(e) => setInfoContent({...infoContent, description: e.target.value})}
                    rows={4}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Éléments de la liste (un par ligne)</Label>
                  <TextArea 
                    placeholder="Saisissez chaque élément sur une ligne séparée..."
                    value={infoContent.items?.join('\n') || ''}
                    onChange={(e) => setInfoContent({...infoContent, items: e.target.value.split('\n').filter(item => item.trim())})}
                    rows={8}
                  />
                </FormGroup>
                
                <div style={{ textAlign: 'center' }}>
                  <Button onClick={handleSaveInfoContent}>💾 Sauvegarder le contenu Info</Button>
                </div>
              </div>
            </ContentSection>
          );

        case 'content-contact':
          return (
            <ContentSection>
              <SectionTitle>✉️ Gestion du Contenu Contact</SectionTitle>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.8)' }}>
                Gérez les informations de contact qui s'affichent dans la page "Contact" de la boutique
              </p>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <FormGroup>
                  <Label>Nom d'utilisateur Telegram</Label>
                  <Input 
                    type="text" 
                    placeholder="Ex: @bipcosa06"
                    value={contactContent.telegramUsername || ''}
                    onChange={(e) => setContactContent({...contactContent, telegramUsername: e.target.value})}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Lien Telegram complet</Label>
                  <Input 
                    type="url" 
                    placeholder="Ex: https://t.me/bipcosa06"
                    value={contactContent.telegramLink || ''}
                    onChange={(e) => setContactContent({...contactContent, telegramLink: e.target.value})}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Message d'accueil</Label>
                  <TextArea 
                    placeholder="Message qui s'affiche sur la page Contact..."
                    value={contactContent.description}
                    onChange={(e) => setContactContent({...contactContent, description: e.target.value})}
                    rows={4}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Informations supplémentaires</Label>
                  <TextArea 
                    placeholder="Informations additionnelles (horaires, zones de livraison, etc.)..."
                    value={contactContent.additionalInfo || ''}
                    onChange={(e) => setContactContent({...contactContent, additionalInfo: e.target.value})}
                    rows={6}
                  />
                </FormGroup>
                
                <div style={{ textAlign: 'center' }}>
                  <Button onClick={handleSaveContactContent}>💾 Sauvegarder le contenu Contact</Button>
                </div>
              </div>
            </ContentSection>
          );

        case 'background':
          return (
            <ContentSection>
              <SectionTitle>🖼️ Configuration du Background</SectionTitle>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.8)' }}>
                Configurez l'arrière-plan de votre boutique avec des gradients, images Cloudinary ou URLs externes (Imgur, etc.)
              </p>
              
              <div style={{ display: 'grid', gap: '30px' }}>
                {/* Type de Background */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
                  <h4 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '18px', textAlign: 'center' }}>
                    🎨 Type de Background
                  </h4>
                  
                  <FormGroup>
                    <Label>Choisir le type</Label>
                    <select 
                      style={{ 
                        width: '100%', 
                        background: 'rgba(255,255,255,0.1)', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        color: 'white', 
                        padding: '12px 15px', 
                        borderRadius: '10px',
                        fontSize: '14px'
                      }}
                      value={config.backgroundType || 'gradient'} 
                      onChange={(e) => {
                        const newType = e.target.value as 'gradient' | 'image' | 'url';
                        console.log('🔄 Changement type background:', newType);
                        
                        // Mise à jour UNIQUEMENT de l'état local
                        setConfig(prevConfig => ({
                          ...prevConfig, 
                          backgroundType: newType
                        }));
                        
                        // Sauvegarde immédiate sans timeout
                        handleSaveConfig({ backgroundType: newType }).catch(error => {
                          console.error('Erreur sauvegarde background type:', error);
                        });
                      }}
                    >
                      <option value="gradient">🌈 Dégradé (par défaut)</option>
                      <option value="image">📁 Image Cloudinary</option>
                      <option value="url">🔗 URL d'image externe</option>
                    </select>
                  </FormGroup>

                  {config.backgroundType === 'gradient' && (
                    <FormGroup>
                      <Label>Couleur du dégradé</Label>
                      <Input 
                        type="color" 
                        value={config.backgroundColor?.includes('linear-gradient') ? '#000000' : config.backgroundColor} 
                        onChange={(e) => handleSaveConfig({ 
                          backgroundColor: `linear-gradient(135deg, ${e.target.value} 0%, #1a1a1a 50%, ${e.target.value} 100%)` 
                        })}
                      />
                    </FormGroup>
                  )}

                  {config.backgroundType === 'url' && (
                    <FormGroup>
                      <Label>URL de l'image (Imgur, etc.)</Label>
                      <Input 
                        type="url" 
                        placeholder="https://imgur.com/votre-image.jpg"
                        value={config.backgroundUrl || ''} 
                        onChange={(e) => handleSaveConfig({ backgroundUrl: e.target.value })}
                      />
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                        Formats supportés: JPG, PNG, WebP. Recommandé: 1920x1080px
                      </div>
                    </FormGroup>
                  )}

                  {config.backgroundType === 'image' && (
                    <div>
                      <Label>Upload depuis iPhone via Cloudinary</Label>
                      <div style={{ 
                        border: '2px dashed rgba(255,255,255,0.3)', 
                        borderRadius: '10px', 
                        padding: '20px', 
                        textAlign: 'center',
                        marginTop: '10px'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                          {backgroundUploading ? '📤 Upload en cours vers Cloudinary...' : 'Upload depuis iPhone/mobile via Cloudinary'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                          {backgroundUploading ? '⏳ Traitement de votre image...' : 'Glissez-déposez ou cliquez pour sélectionner'}
                        </div>
                        {backgroundUploading && (
                          <div style={{ 
                            color: '#4ecdc4', 
                            fontSize: '12px', 
                            marginTop: '10px',
                            fontWeight: 'bold'
                          }}>
                            🔄 Optimisation automatique en cours...
                          </div>
                        )}
                        <Input 
                          type="file" 
                          accept="image/*,video/*"
                          style={{ marginTop: '15px', opacity: backgroundUploading ? 0.5 : 0.7 }}
                          disabled={backgroundUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file && !backgroundUploading) {
                              setBackgroundUploading(true);
                              
                              try {
                                console.log('🔄 Upload background vers Cloudinary...', file.name);
                                
                                // Import Cloudinary dynamiquement
                                const { uploadToCloudinary } = await import('@/config/cloudinary');
                                
                                // Upload vers Cloudinary
                                const result = await uploadToCloudinary(file, 'backgrounds');
                                
                                console.log('✅ Background uploadé:', result.secure_url);
                                
                                // Mettre à jour la config avec l'URL Cloudinary
                                setConfig(prevConfig => ({
                                  ...prevConfig,
                                  backgroundType: 'image',
                                  backgroundImage: result.secure_url
                                }));
                                
                                // Sauvegarder en base
                                console.log('💾 Sauvegarde config background...', {
                                  backgroundType: 'image',
                                  backgroundImage: result.secure_url
                                });
                                
                                await handleSaveConfig({ 
                                  backgroundType: 'image',
                                  backgroundImage: result.secure_url 
                                });
                                
                                console.log('✅ Configuration background sauvegardée');
                                alert('✅ Image de fond uploadée avec succès !');
                                
                              } catch (error) {
                                console.error('❌ Erreur upload background:', error);
                                alert(`❌ Erreur upload background: ${error.message}`);
                              } finally {
                                setBackgroundUploading(false);
                                // Reset le input file pour permettre de re-sélectionner le même fichier
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Prévisualisation */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
                  <h4 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '18px', textAlign: 'center' }}>
                    👁️ Aperçu du Background
                  </h4>
                  
                  <div style={{
                    height: '200px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: config.backgroundType === 'url' && config.backgroundUrl 
                      ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${config.backgroundUrl})`
                      : config.backgroundType === 'image' && config.backgroundImage
                      ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${config.backgroundImage})`
                      : config.backgroundColor || 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {config.shopName || 'BIPCOSA06'}
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      ✨ Ce background s'appliquera sur toutes les pages de la boutique
                    </div>
                  </div>
                </div>
              </div>
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
                 


                 <ConfigPreview 
                   $bgType={config.backgroundType} 
                   $bgImage={config.backgroundImage}
                   $bgUrl={config.backgroundUrl}
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
                     value={config.shopName || ''} 
                     onChange={(e) => {
                       const newShopName = e.target.value;
                       console.log('🔄 Changement nom boutique:', newShopName);
                       
                       // Mise à jour UNIQUEMENT de l'état local sans sauvegarde automatique
                       setConfig(prevConfig => ({
                         ...prevConfig, 
                         shopName: newShopName
                       }));
                     }}
                     onBlur={async (e) => {
                       // Sauvegarde seulement quand l'utilisateur sort du champ
                       const newShopName = e.target.value;
                       console.log('💾 Sauvegarde nom boutique:', newShopName);
                       
                       try {
                         await handleSaveConfig({ shopName: newShopName });
                         
                         // Force la synchronisation immédiate
                         dataService.forceRefresh();
                         
                         // Recharger la configuration pour être sûr
                         const updatedConfig = await dataService.getConfig();
                         setConfig(updatedConfig);
                         
                         console.log('✅ Nom boutique sauvegardé et synchronisé:', newShopName);
                         
                       } catch (error) {
                         console.error('Erreur sauvegarde nom boutique:', error);
                       }
                     }}
                     placeholder="BIPCOSA06"
                   />
                   <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                     💡 Tapez le nouveau nom puis cliquez ailleurs pour sauvegarder
                   </small>
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

        case 'social-networks':
          return (
            <ContentSection>
              <SectionTitle>🌐 Gestion des Réseaux Sociaux</SectionTitle>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.8)' }}>
                Configurez les réseaux sociaux de votre boutique. Vos clients pourront y accéder depuis la page "Réseaux Sociaux".
              </p>

              {/* Bouton Ajouter */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <ActionButton 
                  $variant="add" 
                  onClick={() => {
                    setIsAddingSocial(true);
                    setSocialFormData({ 
                      name: '', 
                      emoji: '📱', 
                      url: '', 
                      isActive: true 
                    });
                  }}
                >
                  ➕ Ajouter un réseau social
                </ActionButton>
              </div>

              {/* Liste des réseaux sociaux */}
              <div style={{ display: 'grid', gap: '15px' }}>
                {socialNetworks
                  .sort((a, b) => a.order - b.order)
                  .map((social) => (
                    <div
                      key={social.id}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: `2px solid ${social.isActive ? '#4ecdc4' : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: '15px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                      }}
                    >
                      <div style={{ fontSize: '32px', minWidth: '50px', textAlign: 'center' }}>
                        {social.emoji}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '16px' }}>
                          {social.name}
                        </h4>
                        <p style={{ margin: '0 0 5px 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                          {social.url}
                        </p>
                        <div style={{ fontSize: '12px' }}>
                          <span style={{ 
                            color: social.isActive ? '#4ecdc4' : 'rgba(255,255,255,0.5)',
                            fontWeight: 'bold'
                          }}>
                            {social.isActive ? '✅ Actif' : '⭕ Inactif'}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '15px' }}>
                            Ordre: {social.order}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <ActionButton
                          onClick={() => {
                            setEditingSocial(social);
                            setSocialFormData(social);
                          }}
                          style={{ padding: '8px 15px', fontSize: '14px' }}
                        >
                          ✏️ Modifier
                        </ActionButton>
                        
                        <ActionButton
                          onClick={() => {
                            const updatedSocial = { ...social, isActive: !social.isActive };
                            dataService.updateSocialNetwork(social.id, updatedSocial);
                            refreshData();
                          }}
                          style={{ 
                            padding: '8px 15px', 
                            fontSize: '14px',
                            background: social.isActive ? 'rgba(255,165,0,0.2)' : 'rgba(78,205,196,0.2)'
                          }}
                        >
                          {social.isActive ? '⭕ Désactiver' : '✅ Activer'}
                        </ActionButton>

                        <ActionButton
                          $variant="danger"
                          onClick={() => {
                            if (confirm(`Supprimer le réseau "${social.name}" ?`)) {
                              dataService.deleteSocialNetwork(social.id);
                              refreshData();
                            }
                          }}
                          style={{ padding: '8px 15px', fontSize: '14px' }}
                        >
                          🗑️ Supprimer
                        </ActionButton>
                      </div>
                    </div>
                  ))}

                {socialNetworks.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: 'rgba(255,255,255,0.6)',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '15px',
                    border: '2px dashed rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌐</div>
                    <p>Aucun réseau social configuré</p>
                    <p style={{ fontSize: '14px' }}>Cliquez sur "Ajouter un réseau social" pour commencer</p>
                  </div>
                )}
              </div>
            </ContentSection>
          );

      default:
        return <ContentSection><SectionTitle>Section en cours de développement</SectionTitle></ContentSection>;
    }
  };

      return (
      <AdminContainer>
        <Sidebar $isOpen={true}>
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

              <MainContent $sidebarOpen={true}>
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

      {/* Modal pour ajouter/modifier un produit */}
      <Modal $isOpen={isAddingProduct || editingProduct !== null}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingProduct ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Nom du produit *</Label>
            <Input 
              type="text" 
              value={formData.name || ''} 
              onChange={(e) => {
                // Mise à jour locale uniquement
                setFormData({...formData, name: e.target.value});
              }}
              placeholder="Ex: ANIMAL COOKIES" 
            />
          </FormGroup>

          <FormGroup>
            <Label>Qualité</Label>
            <Input 
              type="text" 
              value={formData.quality || ''} 
              onChange={(e) => setFormData({...formData, quality: e.target.value})}
              placeholder="Ex: Qualité Top" 
            />
          </FormGroup>

          <FormGroup>
            <Label>Catégorie</Label>
            <Select 
              value={formData.category || 'indica'} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.filter(c => c.value !== 'all').map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Farm d'origine</Label>
            <Select 
              value={formData.farm || 'holland'} 
              onChange={(e) => setFormData({...formData, farm: e.target.value})}
            >
              {farms.filter(f => f.value !== 'all').map(farm => (
                <option key={farm.value} value={farm.value}>{farm.label}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea 
              value={formData.description || ''} 
              onChange={(e) => {
                // Mise à jour locale uniquement
                setFormData({...formData, description: e.target.value});
              }}
              placeholder="Description détaillée du produit..." 
            />
          </FormGroup>

          <FormGroup>
            <Label>Image du produit</Label>
            <Input 
              type="url" 
              value={formData.image || ''} 
              onChange={(e) => {
                // Mise à jour locale uniquement, pas de sauvegarde automatique
                setFormData({...formData, image: e.target.value});
              }}
              placeholder="https://images.unsplash.com/... ou upload via Cloudinary" 
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              💡 Collez l'URL de votre image ou utilisez l'upload ci-dessous
            </small>
            
            {/* Upload Cloudinary pour images */}
            <div style={{ 
              marginTop: '10px', 
              padding: '15px', 
              border: '1px dashed rgba(255,255,255,0.3)', 
              borderRadius: '8px',
              textAlign: 'center',
              opacity: imageUploading ? 0.5 : 1
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                {imageUploading ? '📤 Upload image vers Cloudinary...' : '📷 Upload IMAGE depuis iPhone/mobile'}
              </div>
              {imageUploading && (
                <div style={{ 
                  color: '#4ecdc4', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  fontWeight: 'bold'
                }}>
                  ⏳ Traitement de votre image...
                </div>
              )}
              <Input 
                type="file" 
                accept="image/*"
                style={{ fontSize: '12px' }}
                disabled={imageUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && !imageUploading) {
                    setImageUploading(true);
                    
                    try {
                      console.log('📷 Upload image vers Cloudinary...', file.name, `${Math.round(file.size / 1024 / 1024)}MB`);
                      
                      const { uploadToCloudinary } = await import('@/config/cloudinary');
                      
                      const result = await uploadToCloudinary(file, 'products');
                      
                      console.log('✅ Image uploadée:', result.secure_url);
                      
                      // Mettre à jour le champ image avec l'URL Cloudinary
                      setFormData(prevData => ({...prevData, image: result.secure_url}));
                      
                      alert('✅ Image uploadée vers Cloudinary !');
                      
                    } catch (error) {
                      console.error('❌ Erreur upload image:', error);
                      alert(`❌ Erreur upload image: ${error.message}`);
                    } finally {
                      setImageUploading(false);
                      // Reset le input file pour permettre de re-sélectionner
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <Label>Vidéo du produit (optionnel)</Label>
            <Input 
              type="url" 
              value={formData.video || ''} 
              onChange={(e) => {
                // Mise à jour locale uniquement, pas de sauvegarde automatique
                setFormData({...formData, video: e.target.value});
              }}
              placeholder="https://... ou upload via Cloudinary" 
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              💡 Collez l'URL de votre vidéo ou utilisez l'upload ci-dessous
            </small>
            
            {/* Upload Cloudinary pour vidéos */}
            <div style={{ 
              marginTop: '10px', 
              padding: '15px', 
              border: '1px dashed rgba(255,255,255,0.3)', 
              borderRadius: '8px',
              textAlign: 'center',
              opacity: videoUploading ? 0.5 : 1
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                {videoUploading ? '📤 Upload vidéo vers Cloudinary...' : '🎥 Upload VIDÉO depuis iPhone/mobile'}
              </div>
              {videoUploading && (
                <div style={{ 
                  color: '#4ecdc4', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  fontWeight: 'bold'
                }}>
                  ⏳ Traitement de votre vidéo... (peut prendre plus de temps)
                </div>
              )}
              <Input 
                type="file" 
                accept="video/*"
                style={{ fontSize: '12px' }}
                disabled={videoUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && !videoUploading) {
                    setVideoUploading(true);
                    
                    try {
                      console.log('🎥 Upload vidéo vers Cloudinary...', file.name, `${Math.round(file.size / 1024 / 1024)}MB`);
                      
                      const { uploadToCloudinary } = await import('@/config/cloudinary');
                      
                      const result = await uploadToCloudinary(file, 'videos');
                      
                      console.log('✅ Vidéo uploadée:', result.secure_url);
                      
                      // Mettre à jour le champ vidéo avec l'URL Cloudinary
                      setFormData(prevData => ({...prevData, video: result.secure_url}));
                      
                      alert('✅ Vidéo uploadée vers Cloudinary !');
                      
                    } catch (error) {
                      console.error('❌ Erreur upload vidéo:', error);
                      alert(`❌ Erreur upload vidéo: ${error.message}`);
                    } finally {
                      setVideoUploading(false);
                      // Reset le input file pour permettre de re-sélectionner
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </FormGroup>

          <FormGroup>
            <Label>Texte du flag</Label>
            <Input 
              type="text" 
              value={formData.flagText || ''} 
              onChange={(e) => setFormData({...formData, flagText: e.target.value})}
              placeholder="Ex: 🇳🇱 HOLLAND" 
            />
          </FormGroup>



          {/* Section Prix Multiples */}
          <FormGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <Label>💰 Prix</Label>
              <ActionButton $variant="add" onClick={addPrice} style={{ padding: '8px 12px', fontSize: '12px' }}>
                + Ajouter un prix
              </ActionButton>
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {(formData.prices || []).map((price, index) => (
                <div key={price.id || index} style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '15px', 
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                     <div>
                       <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '5px' }}>
                         Poids
                       </label>
                       <Input 
                         type="text" 
                         placeholder="1g, 3.5g..."
                         value={price.weight || ''} 
                         onChange={(e) => updatePrice(index, 'weight', e.target.value)}
                         style={{ fontSize: '14px', padding: '8px' }}
                       />
                     </div>
                     
                     <div>
                       <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '5px' }}>
                         Prix
                       </label>
                       <Input 
                         type="text" 
                         placeholder="10€, 30€..."
                         value={price.price || ''} 
                         onChange={(e) => updatePrice(index, 'price', e.target.value)}
                         style={{ fontSize: '14px', padding: '8px' }}
                       />
                     </div>
                     
                     <ActionButton 
                       $variant="delete" 
                       onClick={() => removePrice(index)}
                       style={{ padding: '8px', fontSize: '12px', marginTop: '20px' }}
                     >
                       🗑️
                     </ActionButton>
                   </div>
                </div>
              ))}
              
              {(!formData.prices || formData.prices.length === 0) && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  color: 'rgba(255,255,255,0.5)',
                  fontStyle: 'italic' 
                }}>
                  Aucun prix configuré. Cliquez sur "+ Ajouter un prix" pour commencer.
                </div>
              )}
            </div>
          </FormGroup>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
            <ActionButton $variant="add" onClick={handleSaveProduct}>
              💾 Sauvegarder
            </ActionButton>
            <ActionButton onClick={handleCloseModal}>
              ❌ Annuler
            </ActionButton>
          </div>
        </ModalContent>
      </Modal>

      {/* Modal pour ajouter/modifier un réseau social */}
      <Modal $isOpen={isAddingSocial || editingSocial !== null}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingSocial ? '✏️ Modifier le réseau social' : '➕ Ajouter un réseau social'}
            </ModalTitle>
            <CloseButton onClick={() => {
              setIsAddingSocial(false);
              setEditingSocial(null);
              setSocialFormData({});
            }}>×</CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Nom du réseau social *</Label>
            <Input 
              type="text" 
              value={socialFormData.name || ''} 
              onChange={(e) => {
                setSocialFormData({...socialFormData, name: e.target.value});
              }}
              placeholder="Ex: Telegram, Instagram, WhatsApp..." 
            />
          </FormGroup>

          <FormGroup>
            <Label>Emoji *</Label>
            <Input 
              type="text" 
              value={socialFormData.emoji || ''} 
              onChange={(e) => {
                setSocialFormData({...socialFormData, emoji: e.target.value});
              }}
              placeholder="📱 🎮 📷 💬 📞"
              style={{ fontSize: '20px' }}
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              💡 Utilisez un seul emoji pour représenter ce réseau social
            </small>
          </FormGroup>

          <FormGroup>
            <Label>URL du réseau social *</Label>
            <Input 
              type="url" 
              value={socialFormData.url || ''} 
              onChange={(e) => {
                setSocialFormData({...socialFormData, url: e.target.value});
              }}
              placeholder="https://t.me/bipcosa06" 
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              💡 URL complète avec https:// (ex: https://t.me/username, https://wa.me/33123456789)
            </small>
          </FormGroup>

          <FormGroup>
            <Label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={socialFormData.isActive !== false}
                onChange={(e) => {
                  setSocialFormData({...socialFormData, isActive: e.target.checked});
                }}
                style={{ transform: 'scale(1.2)' }}
              />
              Activer ce réseau social
            </Label>
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              💡 Seuls les réseaux actifs apparaîtront sur la page publique
            </small>
          </FormGroup>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
            <ActionButton 
              $variant="add" 
              onClick={async () => {
                if (!socialFormData.name || !socialFormData.emoji || !socialFormData.url) {
                  alert('Veuillez remplir tous les champs obligatoires');
                  return;
                }

                try {
                  if (editingSocial) {
                    // Modification
                    await dataService.updateSocialNetwork(editingSocial.id, socialFormData);
                    console.log('✅ Réseau social modifié avec succès');
                  } else {
                    // Ajout
                    await dataService.addSocialNetwork(socialFormData);
                    console.log('✅ Réseau social ajouté avec succès');
                  }
                  
                  // Rafraîchir les données et fermer le modal
                  await refreshData();
                  setIsAddingSocial(false);
                  setEditingSocial(null);
                  setSocialFormData({});
                  
                  alert(editingSocial ? '✅ Réseau social modifié !' : '✅ Réseau social ajouté !');
                } catch (error) {
                  console.error('❌ Erreur:', error);
                  alert(`❌ Erreur: ${error.message || error}`);
                }
              }}
            >
              💾 Sauvegarder
            </ActionButton>
            <ActionButton onClick={() => {
              setIsAddingSocial(false);
              setEditingSocial(null);
              setSocialFormData({});
            }}>
              ❌ Annuler
            </ActionButton>
          </div>
        </ModalContent>
      </Modal>
    </AdminContainer>
  );
};

export default AdminPanel;