'use client';

import { useEffect } from 'react';
import AdminPanel from '@/admin/AdminPanel';

export default function PanelPage() {
  const handleBack = () => {
    // Redirection vers la boutique (pas vers l'admin)
    window.location.href = '/';
  };

  useEffect(() => {
    // Marquer que nous sommes en mode admin
    localStorage.setItem('adminMode', 'true');
    
    // Optionnel: nettoyer quand on quitte la page
    return () => {
      localStorage.removeItem('adminMode');
    };
  }, []);

  return <AdminPanel onBack={handleBack} />;
}