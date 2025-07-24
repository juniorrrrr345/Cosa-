'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '@/components/HomePage';
import InfoPage from '@/components/InfoPage';
import ContactPage from '@/components/ContactPage';
import ProductDetailPage from '@/components/ProductDetailPage';
import AdminPanel from '@/admin/AdminPanel';

export default function MainPage() {
  const [currentView, setCurrentView] = useState<'menu' | 'info' | 'admin' | 'contact' | 'product-detail'>('menu');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleNavigation = (view: string) => {
    if (view === 'admin') {
      setCurrentView('admin');
    } else if (view === 'info') {
      setCurrentView('info');
    } else if (view === 'contact') {
      setCurrentView('contact');
    } else {
      setCurrentView('menu');
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleBackToMenu = () => {
    setSelectedProduct(null);
    setCurrentView('menu');
  };

  // Fonction pour basculer vers l'admin (peut être appelée via console ou URL)
  const toggleAdmin = () => {
    setCurrentView(currentView === 'admin' ? 'menu' : 'admin');
  };

  // Exposer la fonction toggleAdmin globalement et vérifier les paramètres URL
  useEffect(() => {
    // Exposer la fonction globalement
    (window as any).toggleAdmin = toggleAdmin;
    
    // Vérifier les paramètres URL au chargement
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setCurrentView('admin');
    }
  }, []);

  if (currentView === 'admin') {
    return <AdminPanel onBack={() => setCurrentView('menu')} />;
  }

  if (currentView === 'info') {
    return <InfoPage onNavigate={handleNavigation} currentView={currentView} />;
  }

  if (currentView === 'contact') {
    return <ContactPage onNavigate={handleNavigation} currentView={currentView} />;
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
