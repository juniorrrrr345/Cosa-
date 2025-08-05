const { Config, SocialNetwork } = require('./models');

// Configuration par défaut
const defaultConfig = {
  welcomeMessage: "Bienvenue {firstname} ! 🎉\n\nJe suis votre assistant personnel. Utilisez les boutons ci-dessous pour naviguer.",
  welcomePhoto: null,
  infoText: "ℹ️ Information\n\nCe bot a été créé pour vous aider. N'hésitez pas à explorer toutes les fonctionnalités disponibles.",
  maintenanceMode: false,
  maintenanceMessage: "🔧 Le bot est actuellement en maintenance. Veuillez réessayer plus tard.",
  broadcastEnabled: true,
  statsEnabled: true,
  autoDeleteMessages: true,
  deleteDelay: 30, // secondes
  maxMessageLength: 4096,
  allowedCommands: ['start', 'help', 'info', 'admin', 'stats'],
  webhookEnabled: false
};

// Réseaux sociaux par défaut
const defaultSocialNetworks = [
  { name: 'Instagram', url: 'https://instagram.com', emoji: '📸', order: 1 },
  { name: 'Telegram', url: 'https://t.me', emoji: '💬', order: 2 },
  { name: 'YouTube', url: 'https://youtube.com', emoji: '📺', order: 3 },
  { name: 'Twitter', url: 'https://twitter.com', emoji: '🐦', order: 4 }
];

class ConfigManager {
  // Initialiser la configuration
  static async initialize() {
    try {
      // Vérifier et créer la configuration par défaut
      for (const [key, value] of Object.entries(defaultConfig)) {
        const existing = await Config.findOne({ key });
        if (!existing) {
          await Config.create({ key, value });
        }
      }

      // Vérifier et créer les réseaux sociaux par défaut
      const socialCount = await SocialNetwork.countDocuments();
      if (socialCount === 0) {
        await SocialNetwork.insertMany(defaultSocialNetworks);
      }

      console.log('✅ Configuration initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la configuration:', error);
    }
  }

  // Obtenir une valeur de configuration
  static async get(key) {
    try {
      const config = await Config.findOne({ key });
      return config ? config.value : defaultConfig[key];
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return defaultConfig[key];
    }
  }

  // Définir une valeur de configuration
  static async set(key, value) {
    try {
      await Config.findOneAndUpdate(
        { key },
        { value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de ${key}:`, error);
      return false;
    }
  }

  // Obtenir toute la configuration
  static async getAll() {
    try {
      const configs = await Config.find({});
      const result = { ...defaultConfig };
      
      configs.forEach(config => {
        result[config.key] = config.value;
      });
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration:', error);
      return defaultConfig;
    }
  }

  // Réinitialiser la configuration
  static async reset() {
    try {
      await Config.deleteMany({});
      await SocialNetwork.deleteMany({});
      await this.initialize();
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      return false;
    }
  }

  // Gestion des réseaux sociaux
  static async getSocialNetworks() {
    try {
      return await SocialNetwork.find({ isActive: true }).sort('order');
    } catch (error) {
      console.error('Erreur lors de la récupération des réseaux sociaux:', error);
      return [];
    }
  }

  static async addSocialNetwork(name, url, emoji = '🔗') {
    try {
      const maxOrder = await SocialNetwork.findOne().sort('-order');
      const order = maxOrder ? maxOrder.order + 1 : 1;
      
      return await SocialNetwork.create({ name, url, emoji, order });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du réseau social:', error);
      return null;
    }
  }

  static async updateSocialNetwork(id, updates) {
    try {
      return await SocialNetwork.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du réseau social:', error);
      return null;
    }
  }

  static async deleteSocialNetwork(id) {
    try {
      return await SocialNetwork.findByIdAndDelete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du réseau social:', error);
      return null;
    }
  }
}

module.exports = ConfigManager;