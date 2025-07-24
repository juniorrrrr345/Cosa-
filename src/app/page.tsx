'use client';

import React, { useState, useEffect } from 'react';
import InfoPage from '@/components/InfoPage';
import AdminPanel from '@/admin/AdminPanel';

export default function HomePage() {
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
      <InfoPage onNavigate={handleNavigation} />
      
      {/* Bouton secret pour accéder à l'admin - invisible mais cliquable */}
      <div
        onClick={toggleAdmin}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '50px',
          height: '50px',
          background: 'transparent',
          cursor: 'pointer',
          zIndex: 9999
        }}
        title="Accès admin (invisible)"
      />
    </>
  );
}