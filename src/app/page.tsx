'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '@/components/HomePage';
import InfoPage from '@/components/InfoPage';
import ContactPage from '@/components/ContactPage';
import SocialNetworksPage from '@/components/SocialNetworksPage';
import ProductDetailPage from '@/components/ProductDetailPage';
import AdminPanel from '@/admin/AdminPanel';
import LoadingScreen from '@/components/LoadingScreen';

export default function MainPage() {
  const [currentView, setCurrentView] = useState<'menu' | 'info' | 'admin' | 'contact' | 'social' | 'product-detail'>('menu');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Toujours afficher le loading screen au démarrage
  useEffect(() => {
    // Afficher le loading screen à chaque visite
    setIsFirstVisit(true);
    setIsLoading(true);
  }, []);

  // Fonction appelée quand le chargement est terminé
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleNavigation = (view: string) => {
    // Nettoyer le mode admin quand on navigue vers une autre vue
    if (view !== 'admin') {
      localStorage.removeItem('adminMode');
    }
    
    if (view === 'admin') {
      localStorage.setItem('adminMode', 'true');
      setCurrentView('admin');
    } else if (view === 'info') {
      setCurrentView('info');
    } else if (view === 'contact') {
      setCurrentView('contact');
    } else if (view === 'social') {
      setCurrentView('social');
    } else {
      setCurrentView('menu');
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleBackToMenu = () => {
    // Nettoyer le mode admin quand on revient au menu
    localStorage.removeItem('adminMode');
    setSelectedProduct(null);
    setCurrentView('menu');
  };

  // Fonction pour basculer vers l'admin (peut être appelée via console ou URL)
  const toggleAdmin = () => {
    if (currentView === 'admin') {
      localStorage.removeItem('adminMode');
      setCurrentView('menu');
    } else {
      localStorage.setItem('adminMode', 'true');
      setCurrentView('admin');
    }
  };

  // Exposer la fonction toggleAdmin globalement et vérifier les paramètres URL
  useEffect(() => {
    // Exposer la fonction globalement
    (window as any).toggleAdmin = toggleAdmin;
    
    // Exposer des fonctions de debug pour tester la synchronisation
    (window as any).debugSync = () => {
      console.log('🔍 Debug sync - Forcing data refresh...');
      import('@/services/dataService').then(({ dataService }) => {
        dataService.forceSync();
      });
    };
    
    (window as any).debugData = () => {
      import('@/services/dataService').then(({ dataService }) => {
        console.log('📊 Current data state:', {
          products: dataService.getProducts(),
          categories: dataService.getCategories(),
          farms: dataService.getFarms(),
          config: dataService.getConfig()
        });
      });
    };
    
    // Vérifier les paramètres URL au chargement SEULEMENT
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    
    // Ne vérifier le localStorage que si on est sur la page /panel
    if (urlParams.get('admin') === 'true' || currentPath.includes('/panel')) {
      localStorage.setItem('adminMode', 'true');
      setCurrentView('admin');
    } else {
      // Si on n'est pas sur /panel, nettoyer le localStorage et aller vers la boutique
      localStorage.removeItem('adminMode');
      setCurrentView('menu');
    }
  }, []);

  const handleAdminBack = () => {
    localStorage.removeItem('adminMode');
    setCurrentView('menu');
  };

  // Afficher le LoadingScreen pendant le chargement de la première visite
  if (isLoading && isFirstVisit) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (currentView === 'admin') {
    return <AdminPanel onBack={handleAdminBack} />;
  }

    if (currentView === 'info') {
    return <InfoPage onNavigate={handleNavigation} currentView={currentView} />;
  }

  if (currentView === 'contact') {
    return <ContactPage onNavigate={handleNavigation} currentView={currentView} />;
  }

  if (currentView === 'social') {
    return <SocialNetworksPage onBack={() => handleNavigation('menu')} />;
  }

  if (currentView === 'product-detail' && selectedProduct) {
    return (
      <ProductDetailPage 
        product={selectedProduct}
        onNavigate={handleNavigation}
        onBack={handleBackToMenu}
        currentView="menu"
      />
    );
  }

  // Vue Menu par défaut (la boutique avec les produits)
  return (
    <HomePage 
      onNavigate={handleNavigation} 
      onProductClick={handleProductClick}
      currentView={currentView} 
    />
  );
}
