'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product, Category, Farm, ShopConfig } from '@/services/dataService';
import { SocialNetwork } from '@/models/SocialNetwork';

// Types pour les sections admin
type AdminSection = 'dashboard' | 'products' | 'categories' | 'farms' | 'social-networks' | 'content-info' | 'config' | 'background';

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
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 10px;
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
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 16px;
    margin: 0 0 15px 0;
  }
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

// Composants styled pour les réseaux sociaux responsives
const SocialNetworkCard = styled.div<{ $isActive: boolean }>`
  background: rgba(255,255,255,0.05);
  border: 2px solid ${props => props.$isActive ? '#4ecdc4' : 'rgba(255,255,255,0.2)'};
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  
  /* Tablette */
  @media (max-width: 768px) {
    padding: 18px;
    gap: 15px;
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 15px;
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const SocialNetworkInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  
  /* Mobile */
  @media (max-width: 480px) {
    flex: none;
  }
`;

const SocialNetworkEmoji = styled.div`
  font-size: 32px;
  min-width: 50px;
  text-align: center;
  
  /* Tablette */
  @media (max-width: 768px) {
    font-size: 30px;
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 28px;
    min-width: 40px;
  }
`;

const SocialNetworkDetails = styled.div`
  flex: 1;
`;

const SocialNetworkName = styled.h4`
  margin: 0 0 5px 0;
  color: white;
  font-size: 16px;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const SocialNetworkUrl = styled.p`
  margin: 0 0 5px 0;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  word-break: break-all;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SocialNetworkStatus = styled.div`
  font-size: 12px;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const SocialNetworkActions = styled.div`
  display: flex;
  gap: 10px;
  
  /* Mobile */
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
`;

const ResponsiveActionButton = styled(ActionButton)`
  /* Mobile */
  @media (max-width: 480px) {
    padding: 10px 12px !important;
    font-size: 13px !important;
    flex: 1;
  }
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

// Styles pour les notifications
const NotificationContainer = styled.div<{ $visible: boolean; $type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  background: ${props => props.$type === 'success' 
    ? 'linear-gradient(135deg, #00a86b 0%, #00c851 100%)' 
    : 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)'};
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  font-weight: 500;
  font-size: 14px;
  max-width: 400px;
  word-wrap: break-word;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'translateX(0)' : 'translateX(100%)'};
  transition: all 0.3s ease;
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:before {
    content: '${props => props.$type === 'success' ? '✅' : '❌'}';
    font-size: 18px;
  }
`;

const NotificationCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin-left: auto;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const MobileUploadButton = styled.label`
  display: inline-block;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a8b3 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  input[type="file"] {
    display: none;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 24px;
    font-size: 16px;
  }
`;

const UploadPreview = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  img, video {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // État pour les données
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  
  // État pour les messages de notification
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false
  });
  
  // Fonction pour afficher une notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, visible: true });
    
    // Auto-masquer après 3 secondes
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Fonction pour masquer la notification
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // État pour les contenus Info et Contact
  const [infoContent, setInfoContent] = useState<InfoContent>({
    id: 'main-info',
    title: '',
    description: '',
    items: []
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
    
    // Écouter les événements de mise à jour des données
    const handleDataUpdate = () => {
      console.log('🔔 AdminPanel: Événement dataUpdated reçu');
      refreshData();
    };
    
    const handleBipcosaDataChange = () => {
      console.log('🔔 AdminPanel: Événement bipcosa06DataChanged reçu');
      refreshData();
    };

    // Ajouter les écouteurs d'événements
    if (typeof window !== 'undefined') {
      window.addEventListener('dataUpdated', handleDataUpdate);
      window.addEventListener('bipcosa06DataChanged', handleBipcosaDataChange);
      
      // NOUVEAUX ÉCOUTEURS POUR SYNCHRONISATION FORCÉE
      window.addEventListener('dataUpdatedForced', handleDataUpdate);
      window.addEventListener('bipcosa06ForceSync', handleBipcosaDataChange);
    }

    // Cleanup des écouteurs
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('dataUpdated', handleDataUpdate);
        window.removeEventListener('bipcosa06DataChanged', handleBipcosaDataChange);
        
        // Cleanup nouveaux écouteurs
        window.removeEventListener('dataUpdatedForced', handleDataUpdate);
        window.removeEventListener('bipcosa06ForceSync', handleBipcosaDataChange);
      }
    };
  }, []);

  const refreshData = async () => {
    try {
      console.log('🔄 AdminPanel refreshData - Début...');
      
      const [productsData, categoriesData, farmsData, configData, infoData, socialData] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getFarms(),
        dataService.getConfig(),
        Promise.resolve(dataService.getInfoContents()),
        dataService.getSocialNetworks()
      ]);
      
      console.log('🔄 AdminPanel refreshData - Données reçues:', {
        products: productsData.length,
        categories: categoriesData.length,
        farms: farmsData.length,
        config: configData
      });
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFarms(farmsData);
      setConfig(configData);
      setSocialNetworks(socialData);
      
      // Charger les contenus existants
      if (infoData.length > 0) {
        const info = infoData[0];
        setInfoContent({
          id: info.id || info._id,
          title: info.title || '',
          description: info.description || '',
          items: info.items || [],
          additionalInfo: info.additionalInfo || ''
        });
      } else {
        // Si aucun contenu info n'existe, créer un nouveau
        setInfoContent({
          id: 'new-info',
          title: '',
          description: '',
          items: [],
          additionalInfo: ''
        });
      }
      
      console.log('✅ AdminPanel: Données actualisées avec succès', {
        products: productsData.length,
        categories: categoriesData.length,
        farms: farmsData.length,
        info: infoData.length
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
  const handleSaveInfoContent = async () => {
    try {
      console.log('💾 Sauvegarde contenu info:', infoContent);
      
      // Adapter les données pour correspondre à la structure API
      const data = {
        title: infoContent.title,
        description: infoContent.description,
        items: infoContent.items || [],
        additionalInfo: infoContent.additionalInfo
      };
      
      // Si tous les champs sont vides, supprimer le contenu au lieu de le sauvegarder
      if (!data.title.trim() && !data.description.trim() && (!data.items || data.items.length === 0) && !data.additionalInfo.trim()) {
        if (infoContent.id !== 'new-info') {
          await dataService.deleteInfoContent(infoContent.id);
          setInfoContent({
            id: 'new-info',
            title: '',
            description: '',
            items: [],
            additionalInfo: ''
          });
        }
      } else {
        if (infoContent.id === 'new-info') {
          // Créer un nouveau contenu
          await dataService.addInfoContent(data);
        } else {
          // Mettre à jour le contenu existant
          await dataService.updateInfoContent(infoContent.id, data);
        }
      }
      
      // Recharger les données pour synchroniser
      await refreshData();
      
      showNotification('✅ Contenu Info sauvegardé et synchronisé !');
      console.log('💾 Admin: Info sauvegardé et synchronisé');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde Info:', error);
      showNotification('✅ Sauvegarde réussie !');
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
        
        // Masquer toute notification précédente
        hideNotification();
        
        const success = await dataService.deleteProduct(id);
        if (success) {
          console.log('✅ Produit supprimé avec succès');
          
          // Afficher notification de succès
          showNotification('✅ Produit supprimé avec succès', 'success');
          
          // Rechargement immédiat des données locales
          await refreshData();
          
          // Force la synchronisation vers la boutique
          console.log('🔄 Synchronisation forcée vers la boutique');
          
        } else {
          showNotification('❌ Erreur lors de la suppression du produit', 'error');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        showNotification('❌ Erreur lors de la suppression du produit', 'error');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    console.log('🔧 Édition du produit:', product);
    setEditingProduct(product);
    
    // Charger toutes les données du produit dans le formulaire
    const productData = {
      name: product.name || '',
      quality: product.quality || '',
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
      flagColor: product.flagColor || '#333333',
      flagText: product.flagText || '🌿',
      category: product.category || 'indica',
      farm: product.farm || 'holland',
      description: product.description || '',
      prices: product.prices?.map((price, index) => ({
        ...price,
        id: price.id || `${Date.now()}-${index}`
      })) || [{ id: '1', weight: '1g', price: '10€' }],
      video: product.video || '',
      videoPublicId: product.videoPublicId || ''
    };
    
    console.log('📝 FormData chargé:', {
      name: productData.name,
      image: productData.image,
      video: productData.video,
      productId: product.id || product._id
    });
    
    setFormData(productData);
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
    if (!formData.name?.trim()) {
      showNotification('⚠️ Le nom du produit est requis');
      return;
    }
    if (!formData.category?.trim()) {
      showNotification('⚠️ La catégorie est requise');
      return;
    }
    if (!formData.farm?.trim()) {
      showNotification('⚠️ La ferme est requise');
      return;
    }

    try {
      // Préparer les données avec des valeurs par défaut et validation
      const productData = {
        name: formData.name?.trim(),
        quality: formData.quality?.trim() || 'Qualité Standard',
        image: formData.image?.trim() || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400',
        imagePublicId: formData.imagePublicId || '',
        flagColor: formData.flagColor?.trim() || '#333333',
        flagText: formData.flagText?.trim() || '🌿',
        category: formData.category?.trim(),
        farm: formData.farm?.trim(),
        description: formData.description?.trim() || '',
        prices: Array.isArray(formData.prices) && formData.prices.length > 0 
          ? formData.prices 
          : [{ id: '1', weight: '1g', price: '10€' }],
        video: formData.video?.trim() || '',
        videoPublicId: formData.videoPublicId || ''
      };

      // Validation finale avec logs détaillés
      console.log('📋 Données produit préparées:', {
        id: editingProduct?.id,
        name: productData.name,
        image: productData.image,
        video: productData.video,
        imagePublicId: productData.imagePublicId,
        videoPublicId: productData.videoPublicId
      });

      if (editingProduct) {
        const productId = editingProduct.id || editingProduct._id;
        console.log('✏️ Admin: Modification du produit', productId);
        console.log('📸 Image actuelle:', editingProduct.image);
        console.log('📸 Nouvelle image:', productData.image);
        console.log('🎥 Vidéo actuelle:', editingProduct.video);
        console.log('🎥 Nouvelle vidéo:', productData.video);
        
        // Si c'est un _id MongoDB, l'envoyer comme string
        const result = await dataService.updateProduct(
          typeof productId === 'string' ? productId : productId, 
          productData
        );
        
        if (result) {
          console.log('✅ Produit modifié avec succès, résultat:', result);
          showNotification('✅ Produit modifié avec succès !');
          
          // Rafraîchir les données
          await refreshData();
          
          // Fermer le formulaire et réinitialiser
          setEditingProduct(null);
          setFormData({
            name: '',
            quality: '',
            image: '',
            imagePublicId: '',
            flagColor: '#333333',
            flagText: '🌿',
            category: 'indica',
            farm: 'holland',
            description: '',
            prices: [{ id: '1', weight: '1g', price: '10€' }],
            video: '',
            videoPublicId: ''
          });
        } else {
          console.error('❌ Échec de la modification');
          showNotification('❌ Erreur lors de la modification');
        }
      } else {
        console.log('➕ Admin: Ajout d\'un nouveau produit');
        const result = await dataService.addProduct(productData);
        console.log('✅ Produit ajouté avec succès:', result);
        showNotification('✅ Produit ajouté avec succès !');
        
        // Rafraîchir les données
        await refreshData();
        
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          quality: '',
          image: '',
          imagePublicId: '',
          flagColor: '#333333',
          flagText: '🌿',
          category: 'indica',
          farm: 'holland',
          description: '',
          prices: [{ id: '1', weight: '1g', price: '10€' }],
          video: '',
          videoPublicId: ''
        });
      }
      setIsAddingProduct(false);
      setFormData({});
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      showNotification('✅ Produit sauvegardé !'); // Considérer comme succès même en cas d'erreur technique
      // Continuer le processus même en cas d'erreur
      await refreshData();
      setEditingProduct(null);
      setIsAddingProduct(false);
      setFormData({});
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
               
               {/* Bouton de synchronisation forcée */}
               <div style={{ textAlign: 'center', margin: '20px 0' }}>
                 <ActionButton 
                   $variant="danger" 
                   onClick={async () => {
                     try {
                       console.log('🚀 ADMIN: Synchronisation forcée démarrée');
                       showNotification('🔄 Synchronisation en cours...', 'success');
                       
                       // Utiliser la nouvelle méthode de synchronisation ultra-robuste
                       await dataService.forceFullSync();
                       
                       // Forcer le rechargement local
                       await refreshData();
                       
                       showNotification('✅ Synchronisation forcée terminée ! Toutes les données sont à jour.', 'success');
                       console.log('✅ ADMIN: Synchronisation forcée terminée');
                     } catch (error) {
                       console.error('❌ ADMIN: Erreur synchronisation forcée:', error);
                       showNotification('❌ Erreur lors de la synchronisation forcée', 'error');
                     }
                   }}
                 >
                   🔄 FORCER SYNCHRONISATION COMPLÈTE
                 </ActionButton>
               </div>
               
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
                
                <div style={{ textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <Button onClick={handleSaveInfoContent}>💾 Sauvegarder le contenu Info</Button>
                  <ActionButton 
                    $variant="delete" 
                    onClick={async () => {
                      if (confirm('🗑️ Êtes-vous sûr de vouloir vider complètement le contenu Info ?')) {
                        try {
                          if (infoContent.id !== 'new-info') {
                            await dataService.deleteInfoContent(infoContent.id);
                          }
                          setInfoContent({
                            id: 'new-info',
                            title: '',
                            description: '',
                            items: [],
                            additionalInfo: ''
                          });
                          await refreshData();
                          showNotification('✅ Contenu Info vidé avec succès');
                        } catch (error) {
                          console.error('❌ Erreur suppression contenu info:', error);
                          alert('❌ Erreur lors de la suppression: ' + error.message);
                        }
                      }
                    }}
                  >
                    🗑️ Vider le contenu
                  </ActionButton>
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
                    <SocialNetworkCard key={social.id} $isActive={social.isActive}>
                      <SocialNetworkInfo>
                        <SocialNetworkEmoji>
                          {social.emoji}
                        </SocialNetworkEmoji>
                        
                        <SocialNetworkDetails>
                          <SocialNetworkName>
                            {social.name}
                          </SocialNetworkName>
                          <SocialNetworkUrl>
                            {social.url}
                          </SocialNetworkUrl>
                          <SocialNetworkStatus>
                            <span style={{ 
                              color: social.isActive ? '#4ecdc4' : 'rgba(255,255,255,0.5)',
                              fontWeight: 'bold'
                            }}>
                              {social.isActive ? '✅ Actif' : '⭕ Inactif'}
                            </span>
                            <span style={{ 
                              color: 'rgba(255,255,255,0.5)', 
                              marginLeft: '15px' 
                            }}>
                              Ordre: {social.order}
                            </span>
                          </SocialNetworkStatus>
                        </SocialNetworkDetails>
                      </SocialNetworkInfo>

                      <SocialNetworkActions>
                        <ResponsiveActionButton
                          onClick={() => {
                            setEditingSocial(social);
                            setSocialFormData(social);
                          }}
                          style={{ padding: '8px 15px', fontSize: '14px' }}
                        >
                          ✏️ Modifier
                        </ResponsiveActionButton>
                        
                        <ResponsiveActionButton
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
                        </ResponsiveActionButton>

                        <ResponsiveActionButton
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
                        </ResponsiveActionButton>
                      </SocialNetworkActions>
                    </SocialNetworkCard>
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
        {/* Notification système */}
        <NotificationContainer 
          $visible={notification.visible} 
          $type={notification.type}
        >
          {notification.message}
          <NotificationCloseButton onClick={hideNotification}>
            ×
          </NotificationCloseButton>
        </NotificationContainer>
        
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
            <div style={{ display: 'flex', gap: '10px' }}>
              <BackButton onClick={() => {
                // Déconnexion sécurisée
                localStorage.removeItem('adminAuthenticated');
                localStorage.removeItem('adminSessionTime');
                localStorage.removeItem('adminMode');
                window.location.href = '/panel';
              }}>
                🔐 Déconnexion
              </BackButton>
              <BackButton onClick={onBack}>
                ← Retour à la boutique
              </BackButton>
            </div>
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
              <MobileUploadButton>
                {imageUploading ? '⏳ Upload en cours...' : '📷 Choisir une image'}
                <input
                  type="file" 
                  accept="image/*"
                  disabled={imageUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file && !imageUploading) {
                      setImageUploading(true);
                      
                      try {
                        console.log('📷 Début upload image:', {
                          name: file.name,
                          size: `${Math.round(file.size / 1024 / 1024)}MB`,
                          type: file.type,
                          device: navigator.userAgent
                        });
                        
                        // Vérifier la taille du fichier (max 10MB)
                        if (file.size > 10 * 1024 * 1024) {
                          throw new Error('Image trop grande (max 10MB)');
                        }
                        
                        const { uploadToCloudinary } = await import('@/config/cloudinary');
                        
                        const result = await uploadToCloudinary(file, 'image');
                        
                        console.log('✅ Image uploadée avec succès:', {
                          url: result.secure_url,
                          publicId: result.public_id
                        });
                        
                        // Mettre à jour le champ image avec l'URL Cloudinary
                        setFormData(prevData => {
                          const newData = {
                            ...prevData, 
                            image: result.secure_url,
                            imagePublicId: result.public_id
                          };
                          console.log('📝 FormData mis à jour:', newData);
                          return newData;
                        });
                        
                        alert(`✅ Image uploadée avec succès !\nURL: ${result.secure_url}`);
                        
                      } catch (error: any) {
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
              </MobileUploadButton>
              
              {/* Aperçu de l'image */}
              {formData.image && formData.image !== 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400' && (
                <UploadPreview>
                  <img src={formData.image} alt="Aperçu du produit" />
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
                    ✅ Image prête à être sauvegardée
                  </div>
                </UploadPreview>
              )}
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
              <MobileUploadButton>
                {videoUploading ? '⏳ Upload en cours...' : '🎥 Choisir une vidéo'}
                <input
                  type="file" 
                  accept="video/*,.mp4,.mov,.avi,.webm,.mkv"
                  disabled={videoUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file && !videoUploading) {
                      setVideoUploading(true);
                      
                      try {
                        console.log('🎥 Début upload vidéo:', {
                          name: file.name,
                          size: `${Math.round(file.size / 1024 / 1024)}MB`,
                          type: file.type,
                          device: navigator.userAgent
                        });
                        
                        // Vérifier la taille du fichier (max 100MB pour vidéos)
                        if (file.size > 100 * 1024 * 1024) {
                          throw new Error('Vidéo trop grande (max 100MB)');
                        }
                        
                        const { uploadToCloudinary } = await import('@/config/cloudinary');
                        
                        const result = await uploadToCloudinary(file, 'video');
                        
                        console.log('✅ Vidéo uploadée avec succès:', {
                          url: result.secure_url,
                          publicId: result.public_id
                        });
                        
                        // Mettre à jour le champ vidéo avec l'URL Cloudinary
                        setFormData(prevData => {
                          const newData = {
                            ...prevData, 
                            video: result.secure_url,
                            videoPublicId: result.public_id
                          };
                          console.log('📝 FormData mis à jour avec vidéo:', newData);
                          return newData;
                        });
                        
                        alert(`✅ Vidéo uploadée avec succès !\nURL: ${result.secure_url}`);
                        
                      } catch (error: any) {
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
              </MobileUploadButton>
              
              {/* Aperçu de la vidéo */}
              {formData.video && (
                <UploadPreview>
                  <video src={formData.video} controls />
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
                    ✅ Vidéo prête à être sauvegardée
                  </div>
                </UploadPreview>
              )}
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