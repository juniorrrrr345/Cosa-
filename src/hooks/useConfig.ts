import { useState, useEffect } from 'react';
import { dataService, ShopConfig } from '@/services/dataService';

export function useConfig(): ShopConfig {
  const [config, setConfig] = useState<ShopConfig>(() => {
    // Récupération synchrone pour les métadonnées initiales
    return dataService.getConfigSync();
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const newConfig = await dataService.getConfig();
        setConfig(newConfig);
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
      }
    };

    loadConfig();

    // Écouter les mises à jour de configuration
    const handleConfigUpdate = () => {
      loadConfig();
    };

    window.addEventListener('configUpdated', handleConfigUpdate);
    
    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate);
    };
  }, []);

  return config;
}

// Version synchrone pour les métadonnées statiques
export function getStaticConfig(): ShopConfig {
  return dataService.getConfigSync();
}