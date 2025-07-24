// Service de gestion des données BIPCOSA06 avec APIs MongoDB et Cloudinary
import { Product, Category, Farm, ShopConfig, SocialNetwork, InfoContent, ContactContent } from '../types';
import { mongoService } from './mongoService';

// Données statiques qui fonctionnent TOUJOURS
const STATIC_CATEGORIES: Category[] = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybride' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' }
];

const STATIC_FARMS: Farm[] = [
  { value: 'holland', label: 'Holland', country: '🇳🇱' },
  { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
  { value: 'calispain', label: 'Calispain', country: '🏴‍☠️' },
  { value: 'premium', label: 'Premium', country: '⭐' }
];

const STATIC_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "ANIMAL COOKIES",
    quality: "Qualité Top",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    flagColor: "#333333",
    flagText: "🇳🇱 HOLLAND",
    category: "indica",
    farm: "holland",
    description: "Une variété indica premium avec des arômes sucrés et terreux.",
    prices: [
      { id: "1", weight: "1g", price: "12€" },
      { id: "2", weight: "3.5g", price: "40€" },
      { id: "3", weight: "7g", price: "75€" }
    ]
  },
  {
    id: 2,
    name: "POWER HAZE",
    quality: "Qualité Mid",
    image: "https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=400&h=300&fit=crop&crop=center",
    flagColor: "#4CAF50",
    flagText: "🇪🇸 ESPAGNE",
    category: "sativa",
    farm: "espagne",
    description: "Sativa énergisante avec des effets cérébraux puissants.",
    prices: [
      { id: "1", weight: "1g", price: "10€" },
      { id: "2", weight: "3.5g", price: "32€" },
      { id: "3", weight: "7g", price: "60€" }
    ]
  },
  {
    id: 3,
    name: "PURPLE KUSH",
    quality: "Qualité Top",
    image: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=300&fit=crop&crop=center",
    flagColor: "#6a1b9a",
    flagText: "🏴‍☠️ CALISPAIN",
    category: "indica",
    farm: "calispain",
    description: "Indica puissante aux tons violets caractéristiques.",
    prices: [
      { id: "1", weight: "1g", price: "15€" },
      { id: "2", weight: "3.5g", price: "50€" }
    ]
  },
  {
    id: 4,
    name: "BLUE DREAM",
    quality: "Qualité Premium",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=300&fit=crop&crop=center",
    flagColor: "#2196F3",
    flagText: "⭐ PREMIUM",
    category: "hybrid",
    farm: "premium",
    description: "Hybride équilibré avec des effets cérébraux créatifs.",
    prices: [
      { id: "1", weight: "1g", price: "18€" },
      { id: "2", weight: "3.5g", price: "60€" }
    ]
  }
];

const defaultSocialNetworks: SocialNetwork[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '📱',
    url: 'https://t.me/bipcosa06',
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    url: 'https://instagram.com/bipcosa06',
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class DataService {
  private static instance: DataService;
  private configCache: ShopConfig | null = null;
  
  constructor() {
    console.log('🚀 DataService SIMPLE initialisé');
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // === PRODUITS ===
  async getProducts(): Promise<Product[]> {
    console.log('📦 getProducts - Retour données statiques');
    return [...STATIC_PRODUCTS];
  }

  getProductsSync(): Product[] {
    return [...STATIC_PRODUCTS];
  }

  async addProduct(productData: any): Promise<Product> {
    const newId = Math.max(...STATIC_PRODUCTS.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    STATIC_PRODUCTS.push(newProduct);
    this.notifyDataUpdate();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    const index = STATIC_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      STATIC_PRODUCTS[index] = { ...STATIC_PRODUCTS[index], ...updates };
      this.notifyDataUpdate();
      return STATIC_PRODUCTS[index];
    }
    return null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = STATIC_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      STATIC_PRODUCTS.splice(index, 1);
      this.notifyDataUpdate();
      return true;
    }
    return false;
  }

  // === CATÉGORIES ===
  async getCategories(): Promise<Category[]> {
    console.log('📂 getCategories - Retour données statiques:', STATIC_CATEGORIES);
    return [...STATIC_CATEGORIES];
  }

  getCategoriesSync(): Category[] {
    return [...STATIC_CATEGORIES];
  }

  async addCategory(category: Category): Promise<Category> {
    const existingIndex = STATIC_CATEGORIES.findIndex(c => c.value === category.value);
    if (existingIndex === -1) {
      STATIC_CATEGORIES.push(category);
      this.notifyDataUpdate();
    }
    return category;
  }

  async updateCategory(value: string, updates: Partial<Category>): Promise<Category | null> {
    const index = STATIC_CATEGORIES.findIndex(c => c.value === value);
    if (index !== -1) {
      STATIC_CATEGORIES[index] = { ...STATIC_CATEGORIES[index], ...updates };
      this.notifyDataUpdate();
      return STATIC_CATEGORIES[index];
    }
    return null;
  }

  async deleteCategory(value: string): Promise<boolean> {
    const index = STATIC_CATEGORIES.findIndex(c => c.value === value);
    if (index !== -1) {
      STATIC_CATEGORIES.splice(index, 1);
      this.notifyDataUpdate();
      return true;
    }
    return false;
  }

  // === FERMES ===
  async getFarms(): Promise<Farm[]> {
    console.log('🏠 getFarms - Retour données statiques:', STATIC_FARMS);
    return [...STATIC_FARMS];
  }

  getFarmsSync(): Farm[] {
    return [...STATIC_FARMS];
  }

  async addFarm(farm: Farm): Promise<Farm> {
    const existingIndex = STATIC_FARMS.findIndex(f => f.value === farm.value);
    if (existingIndex === -1) {
      STATIC_FARMS.push(farm);
      this.notifyDataUpdate();
    }
    return farm;
  }

  async updateFarm(value: string, updates: Partial<Farm>): Promise<Farm | null> {
    const index = STATIC_FARMS.findIndex(f => f.value === value);
    if (index !== -1) {
      STATIC_FARMS[index] = { ...STATIC_FARMS[index], ...updates };
      this.notifyDataUpdate();
      return STATIC_FARMS[index];
    }
    return null;
  }

  async deleteFarm(value: string): Promise<boolean> {
    const index = STATIC_FARMS.findIndex(f => f.value === value);
    if (index !== -1) {
      STATIC_FARMS.splice(index, 1);
      this.notifyDataUpdate();
      return true;
    }
    return false;
  }

  // === CONFIGURATION ===
  async getConfig(): Promise<ShopConfig> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bipcosa06_config');
      if (stored) {
        try {
          this.configCache = JSON.parse(stored);
          return this.configCache;
        } catch (e) {
          console.error('Erreur config localStorage');
        }
      }
    }
    
    this.configCache = {
      backgroundType: 'gradient',
      backgroundImage: '',
      backgroundUrl: '',
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
    };
    return this.configCache;
  }

  getConfigSync(): ShopConfig {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bipcosa06_config');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Erreur config localStorage');
        }
      }
    }
    
    return {
      backgroundType: 'gradient',
      backgroundImage: '',
      backgroundUrl: '',
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
    };
  }

  async updateConfig(updates: Partial<ShopConfig>): Promise<ShopConfig> {
    const currentConfig = this.configCache || this.getConfigSync();
    const updatedConfig = { ...currentConfig, ...updates };
    
    this.configCache = updatedConfig;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('bipcosa06_config', JSON.stringify(updatedConfig));
    }
    
    this.notifyConfigUpdate(updatedConfig);
    return updatedConfig;
  }

  // === RÉSEAUX SOCIAUX ===
  getSocialNetworks(): Promise<SocialNetwork[]> {
    return Promise.resolve([...defaultSocialNetworks]);
  }

  getSocialNetworksSync(): SocialNetwork[] {
    return [...defaultSocialNetworks];
  }

  addSocialNetwork(network: Omit<SocialNetwork, 'id' | 'createdAt' | 'updatedAt'>): SocialNetwork {
    const newNetwork: SocialNetwork = {
      ...network,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    defaultSocialNetworks.push(newNetwork);
    this.notifyDataUpdate();
    return newNetwork;
  }

  updateSocialNetwork(id: string, updates: Partial<SocialNetwork>): SocialNetwork | null {
    const index = defaultSocialNetworks.findIndex(n => n.id === id);
    if (index !== -1) {
      defaultSocialNetworks[index] = { ...defaultSocialNetworks[index], ...updates, updatedAt: new Date() };
      this.notifyDataUpdate();
      return defaultSocialNetworks[index];
    }
    return null;
  }

  deleteSocialNetwork(id: string): boolean {
    const index = defaultSocialNetworks.findIndex(n => n.id === id);
    if (index !== -1) {
      defaultSocialNetworks.splice(index, 1);
      this.notifyDataUpdate();
      return true;
    }
    return false;
  }

  // === CONTENU INFO ===
  getInfoContents(): Promise<InfoContent[]> {
    return Promise.resolve([
      {
        id: 'main-info',
        title: '🌟 BIPCOSA06 - Votre Boutique de Confiance',
        description: 'Découvrez notre sélection premium de produits de qualité. Livraison rapide et service client exceptionnel.',
        additionalInfo: 'Qualité garantie - Satisfaction 100%'
      }
    ]);
  }

  getInfoContentsSync(): InfoContent[] {
    return [
      {
        id: 'main-info',
        title: '🌟 BIPCOSA06 - Votre Boutique de Confiance',
        description: 'Découvrez notre sélection premium de produits de qualité. Livraison rapide et service client exceptionnel.',
        additionalInfo: 'Qualité garantie - Satisfaction 100%'
      }
    ];
  }

  updateInfoContent(id: string, updates: Partial<InfoContent>): InfoContent {
    return {
      id,
      title: updates.title || '🌟 BIPCOSA06 - Votre Boutique de Confiance',
      description: updates.description || 'Découvrez notre sélection premium.',
      additionalInfo: updates.additionalInfo || 'Qualité garantie'
    };
  }

  // === CONTENU CONTACT ===
  getContactContents(): Promise<ContactContent[]> {
    return Promise.resolve([
      {
        id: 'main-contact',
        title: '📱 Contact BIPCOSA06',
        description: 'Contactez-nous facilement via Telegram pour vos commandes',
        telegramUsername: '@bipcosa06',
        telegramLink: 'https://t.me/bipcosa06',
        additionalInfo: 'Réponse rapide garantie - Service 7j/7'
      }
    ]);
  }

  getContactContentsSync(): ContactContent[] {
    return [
      {
        id: 'main-contact',
        title: '📱 Contact BIPCOSA06',
        description: 'Contactez-nous facilement via Telegram pour vos commandes',
        telegramUsername: '@bipcosa06',
        telegramLink: 'https://t.me/bipcosa06',
        additionalInfo: 'Réponse rapide garantie - Service 7j/7'
      }
    ];
  }

  updateContactContent(id: string, updates: Partial<ContactContent>): ContactContent {
    return {
      id,
      title: updates.title || '📱 Contact BIPCOSA06',
      description: updates.description || 'Contactez-nous via Telegram',
      telegramUsername: updates.telegramUsername || '@bipcosa06',
      telegramLink: updates.telegramLink || 'https://t.me/bipcosa06',
      additionalInfo: updates.additionalInfo || 'Service 7j/7'
    };
  }

  // === NOTIFICATIONS ===
  private notifyDataUpdate(): void {
    console.log('🔔 DataService - Notification mise à jour données');
    if (typeof window !== 'undefined') {
      // Délai court pour éviter les conflits de state
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        window.dispatchEvent(new CustomEvent('bipcosa06DataChanged'));
        console.log('📢 Événements dataUpdated envoyés');
      }, 10);
    }
  }

  private notifyConfigUpdate(config: ShopConfig): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('configUpdated'));
      window.dispatchEvent(new CustomEvent('bipcosa06ConfigChanged', { detail: config }));
    }
  }

  // === MÉTHODES DE MAINTENANCE ===
  forceResetAllData(): void {
    console.log('🔄 RESET COMPLET');
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.configCache = null;
    this.notifyDataUpdate();
    console.log('✅ Reset terminé');
  }
}

// Singleton instance
const dataService = DataService.getInstance();
export { dataService };
export default dataService;