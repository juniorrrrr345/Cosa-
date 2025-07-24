// Service pour gérer la configuration de l'application CANAGOOD 69
interface Config {
  backgroundImage: string | null;
  backgroundColor: string;
  logoUrl: string | null;
  shopName: string;
  shopDescription: string;
}

export const configService = {
  // Clé pour le localStorage
  CONFIG_KEY: 'canagood_config',

  // Configuration par défaut
  defaultConfig: {
    backgroundImage: null,
    backgroundColor: '#1a1a1a',
    logoUrl: null,
    shopName: 'CANAGOOD 69',
    shopDescription: 'mini-application'
  } as Config,

  // Obtenir la configuration
  getConfig(): Config {
    if (typeof window === 'undefined') return this.defaultConfig;
    
    try {
      const saved = localStorage.getItem(this.CONFIG_KEY);
      if (saved) {
        return { ...this.defaultConfig, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Erreur lors de la lecture de la configuration:', error);
    }
    return this.defaultConfig;
  },

  // Sauvegarder la configuration
  saveConfig(config: Partial<Config>): Config {
    if (typeof window === 'undefined') return this.defaultConfig;
    
    try {
      const currentConfig = this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(newConfig));
      return newConfig;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      throw error;
    }
  },

  // Mettre à jour le background
  updateBackground(backgroundData: { backgroundImage?: string | null; backgroundColor?: string }) {
    return this.saveConfig({
      backgroundImage: backgroundData.backgroundImage,
      backgroundColor: backgroundData.backgroundColor
    });
  },

  // Mettre à jour les informations de la boutique
  updateShopInfo(shopData: { shopName?: string; shopDescription?: string; logoUrl?: string }) {
    return this.saveConfig({
      shopName: shopData.shopName,
      shopDescription: shopData.shopDescription,
      logoUrl: shopData.logoUrl
    });
  }
};

export type { Config };