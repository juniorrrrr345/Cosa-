'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';

// Types pour les sections admin
type AdminSection = 'dashboard' | 'products' | 'categories' | 'farms' | 'content-info' | 'content-contact' | 'config' | 'background';

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
  
  // État pour les formulaires
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  
  // État pour les uploads
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const [productsData, categoriesData, farmsData, configData, infoData, contactData] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getFarms(),
        dataService.getConfig(),
        Promise.resolve(dataService.getInfoContents()),
        Promise.resolve(dataService.getContactContents())
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFarms(farmsData);
      setConfig(configData);
      
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
    setFormData(product);
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
        { weight: '1g', price: '10€' },
        { weight: '3.5g', price: '30€' },
        { weight: '7g', price: '55€' }
      ],
      video: ''
    });
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingProduct) {
        console.log('✏️ Admin: Modification du produit', editingProduct.id);
        await dataService.updateProduct(editingProduct.id, formData as Partial<Product>);
        console.log('✅ Produit modifié avec succès');
      } else {
        console.log('➕ Admin: Ajout d\'un nouveau produit');
        await dataService.addProduct(formData as Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>);
        console.log('✅ Produit ajouté avec succès');
      }
      
      await refreshData();
      setEditingProduct(null);
      setIsAddingProduct(false);
      setFormData({});
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du produit');
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
      
      // Mettre à jour l'état local
      setConfig(updatedConfig);
      
      console.log('✅ Configuration mise à jour avec succès');
      
      // Rafraîchir les données
      await refreshData();
      
      // Notification de succès
      setTimeout(() => {
        console.log('🔄 Synchronisation config terminée');
      }, 100);
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la config:', error);
      alert(`❌ Erreur lors de la mise à jour de la configuration: ${error.message || error}`);
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
                <ActionButton $variant="add" onClick={() => {
                  const label = prompt('📂 Nom de la nouvelle catégorie:');
                  if (label && label.trim()) {
                    try {
                      dataService.addCategory({ label: label.trim() });
                      refreshData();
                      alert('✅ Catégorie ajoutée avec succès !');
                    } catch (error) {
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
                        <ActionButton $variant="edit" onClick={() => {
                          const newLabel = prompt('✏️ Nouveau nom:', category.label);
                          if (newLabel && newLabel.trim() !== category.label) {
                            try {
                              dataService.updateCategory(category.value, { label: newLabel.trim() });
                              refreshData();
                              alert('✅ Catégorie modifiée !');
                            } catch (error) {
                              alert('❌ Erreur lors de la modification');
                            }
                          }
                        }}>✏️ Modifier</ActionButton>
                        <ActionButton $variant="delete" onClick={() => {
                          if (confirm(`🗑️ Supprimer la catégorie "${category.label}" ?`)) {
                            try {
                              const success = dataService.deleteCategory(category.value);
                              if (success) {
                                refreshData();
                                alert('✅ Catégorie supprimée !');
                              } else {
                                alert('❌ Impossible de supprimer cette catégorie');
                              }
                            } catch (error) {
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
                <ActionButton $variant="add" onClick={() => {
                  const label = prompt('🏠 Nom de la nouvelle ferme:');
                  if (label && label.trim()) {
                    const country = prompt('🌍 Emoji du pays (ex: 🇫🇷):', '🌍') || '🌍';
                    try {
                      dataService.addFarm({ label: label.trim(), country });
                      refreshData();
                      alert('✅ Ferme ajoutée avec succès !');
                    } catch (error) {
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
                        <ActionButton $variant="edit" onClick={() => {
                          const newLabel = prompt('✏️ Nouveau nom:', farm.label);
                          const newCountry = prompt('🌍 Nouveau pays:', farm.country);
                          if ((newLabel && newLabel.trim() !== farm.label) || (newCountry && newCountry !== farm.country)) {
                            try {
                              const updates: any = {};
                              if (newLabel && newLabel.trim() !== farm.label) updates.label = newLabel.trim();
                              if (newCountry && newCountry !== farm.country) updates.country = newCountry;
                              dataService.updateFarm(farm.value, updates);
                              refreshData();
                              alert('✅ Ferme modifiée !');
                            } catch (error) {
                              alert('❌ Erreur lors de la modification');
                            }
                          }
                        }}>✏️ Modifier</ActionButton>
                        <ActionButton $variant="delete" onClick={() => {
                          if (confirm(`🗑️ Supprimer la ferme "${farm.label}" ?`)) {
                            try {
                              const success = dataService.deleteFarm(farm.value);
                              if (success) {
                                refreshData();
                                alert('✅ Ferme supprimée !');
                              } else {
                                alert('❌ Impossible de supprimer cette ferme');
                              }
                            } catch (error) {
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
                      value={config.backgroundType} 
                      onChange={(e) => handleSaveConfig({ backgroundType: e.target.value as 'gradient' | 'image' | 'url' })}
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
                          Upload depuis iPhone/mobile via Cloudinary
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                          Glissez-déposez ou cliquez pour sélectionner
                        </div>
                        <Input 
                          type="file" 
                          accept="image/*,video/*"
                          style={{ marginTop: '15px', opacity: 0.7 }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                // Import Cloudinary dynamiquement
                                const { uploadToCloudinary } = await import('@/config/cloudinary');
                                
                                // Afficher le loading
                                const uploadBtn = e.target.parentElement;
                                if (uploadBtn) {
                                  uploadBtn.style.opacity = '0.5';
                                  uploadBtn.innerHTML += '<div>📤 Upload en cours...</div>';
                                }
                                
                                // Upload vers Cloudinary
                                const result = await uploadToCloudinary(file, 'backgrounds');
                                
                                // Mettre à jour la config avec l'URL Cloudinary
                                await handleSaveConfig({ 
                                  backgroundType: 'image',
                                  backgroundImage: result.secure_url 
                                });
                                
                                alert('✅ Image uploadée avec succès vers Cloudinary !');
                                console.log('📤 Background uploadé:', result.secure_url);
                                
                              } catch (error) {
                                console.error('❌ Erreur upload:', error);
                                alert(`❌ Erreur: ${error.message}`);
                              } finally {
                                // Restaurer l'affichage
                                const uploadBtn = e.target.parentElement;
                                if (uploadBtn) {
                                  uploadBtn.style.opacity = '1';
                                  const loadingDiv = uploadBtn.querySelector('div');
                                  if (loadingDiv) loadingDiv.remove();
                                }
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
                 
                 <FormGroup>
                   <Label>Couleur principale</Label>
                   <ColorPicker 
                     type="color" 
                     value={config.backgroundColor} 
                     onChange={(e) => handleSaveConfig({ backgroundColor: e.target.value })}
                   />
                 </FormGroup>

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
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description détaillée du produit..." 
            />
          </FormGroup>

          <FormGroup>
            <Label>Image du produit</Label>
            <Input 
              type="url" 
              value={formData.image || ''} 
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://images.unsplash.com/... ou upload via Cloudinary" 
            />
            
            {/* Upload Cloudinary pour produits */}
            <div style={{ 
              marginTop: '10px', 
              padding: '15px', 
              border: '1px dashed rgba(255,255,255,0.3)', 
              borderRadius: '8px',
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                📱 Ou upload depuis iPhone/mobile
              </div>
              <Input 
                type="file" 
                accept="image/*,video/*"
                style={{ fontSize: '12px' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const { uploadToCloudinary } = await import('@/config/cloudinary');
                      
                      // Loading state
                      const uploadArea = e.target.parentElement;
                      if (uploadArea) {
                        uploadArea.style.opacity = '0.5';
                        uploadArea.innerHTML += '<div style="color: #4ecdc4;">📤 Upload...</div>';
                      }
                      
                      const result = await uploadToCloudinary(file, 'products');
                      
                      // Mettre à jour le champ image avec l'URL Cloudinary
                      setFormData({...formData, image: result.secure_url});
                      
                      alert('✅ Image uploadée vers Cloudinary !');
                      
                    } catch (error) {
                      console.error('❌ Erreur upload produit:', error);
                      alert(`❌ Erreur: ${error.message}`);
                    } finally {
                      // Restaurer
                      const uploadArea = e.target.parentElement;
                      if (uploadArea) {
                        uploadArea.style.opacity = '1';
                        const loadingDiv = uploadArea.querySelector('div:last-child');
                        if (loadingDiv && loadingDiv.textContent.includes('📤')) {
                          loadingDiv.remove();
                        }
                      }
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

          <FormGroup>
            <Label>URL vidéo (optionnel)</Label>
            <Input 
              type="url" 
              value={formData.video || ''} 
              onChange={(e) => setFormData({...formData, video: e.target.value})}
              placeholder="https://..." 
            />
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
    </AdminContainer>
  );
};

export default AdminPanel;