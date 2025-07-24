'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '@/components/HomePage';
import AdminPanel from '@/admin/AdminPanel';

export default function MainPage() {
  const [currentView, setCurrentView] = useState<'info' | 'admin'>('info');

  const handleNavigation = (view: string) => {
    if (view === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('info');
    }
  };

  // Fonction pour basculer vers l'admin (peut être appelée via console ou URL)
  const toggleAdmin = () => {
    setCurrentView(currentView === 'admin' ? 'info' : 'admin');
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
    return <AdminPanel onBack={() => setCurrentView('info')} />;
  }

  return (
    <>
      <HomePage onNavigate={handleNavigation} />
    </>
  );
}