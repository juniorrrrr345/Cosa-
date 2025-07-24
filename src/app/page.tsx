'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '@/components/HomePage';
import InfoPage from '@/components/InfoPage';
import AdminPanel from '@/admin/AdminPanel';

export default function MainPage() {
  const [currentView, setCurrentView] = useState<'menu' | 'info' | 'admin' | 'contact'>('menu');

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
    // Pour l'instant, on redirige vers menu, mais on peut créer une page contact plus tard
    return <HomePage onNavigate={handleNavigation} currentView={currentView} />;
  }

  // Vue Menu par défaut (la boutique avec les produits)
  return (
    <HomePage onNavigate={handleNavigation} currentView={currentView} />
  );
}