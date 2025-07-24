'use client';

import { useEffect, useState } from 'react';
import AdminPanel from '@/admin/AdminPanel';
import AdminLogin from '@/components/AdminLogin';

export default function PanelPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = () => {
      const authToken = localStorage.getItem('adminAuthenticated');
      const sessionTime = localStorage.getItem('adminSessionTime');
      
      if (authToken === 'true' && sessionTime) {
        // Vérifier si la session n'a pas expiré (24h = 86400000ms)
        const currentTime = Date.now();
        const sessionStartTime = parseInt(sessionTime);
        const sessionDuration = currentTime - sessionStartTime;
        const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 heures
        
        if (sessionDuration < maxSessionDuration) {
          setIsAuthenticated(true);
          // Marquer que nous sommes en mode admin
          localStorage.setItem('adminMode', 'true');
        } else {
          // Session expirée, nettoyer
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminSessionTime');
          localStorage.removeItem('adminMode');
        }
      }
      setIsLoading(false);
    };

    checkAuth();

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adminMode', 'true');
  };

  const handleBack = () => {
    // Nettoyer tous les tokens d'admin
    localStorage.removeItem('adminMode');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminSessionTime');
    // Redirection vers la boutique
    window.location.href = '/';
  };

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        🔄 Vérification...
      </div>
    );
  }

  // Si pas authentifié, afficher le login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Si authentifié, afficher le panel admin
  return <AdminPanel onBack={handleBack} />;
}