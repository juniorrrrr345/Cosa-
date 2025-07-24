'use client';

import { useEffect } from 'react';
import AdminPanel from '@/admin/AdminPanel';

export default function PanelPage() {
  const handleBack = () => {
    // Nettoyer le mode admin avant de rediriger
    localStorage.removeItem('adminMode');
    // Redirection vers la boutique
    window.location.href = '/';
  };

  useEffect(() => {
    // Marquer que nous sommes en mode admin
    localStorage.setItem('adminMode', 'true');
    
    // Nettoyer quand on quitte la page
    const handleBeforeUnload = () => {
      // Ne pas nettoyer si on navigue vers une autre page du panel
      if (!window.location.pathname.includes('/panel')) {
        localStorage.removeItem('adminMode');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Nettoyer le localStorage seulement si on ne va pas vers le panel
      if (!window.location.pathname.includes('/panel')) {
        localStorage.removeItem('adminMode');
      }
    };
  }, []);

  return <AdminPanel onBack={handleBack} />;
}