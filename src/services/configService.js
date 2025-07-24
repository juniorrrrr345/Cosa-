// Service pour gérer la configuration de l'application
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
  },

  // Obtenir la configuration
  getConfig() {
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
  saveConfig(config) {
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
  updateBackground(backgroundData) {
    return this.saveConfig({
      backgroundImage: backgroundData.backgroundImage,
      backgroundColor: backgroundData.backgroundColor
    });
  },

  // Mettre à jour les informations de la boutique
  updateShopInfo(shopData) {
    return this.saveConfig({
      shopName: shopData.shopName,
      shopDescription: shopData.shopDescription,
      logoUrl: shopData.logoUrl
    });
  }
};