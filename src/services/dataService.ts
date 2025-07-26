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
    emoji: '📱',
    url: 'https://t.me/bipcosa06',
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'instagram',
    name: 'Instagram',
    emoji: '📸',
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

  // Clés localStorage
  private readonly PRODUCTS_KEY = 'bipcosa06_products';
  private readonly CATEGORIES_KEY = 'bipcosa06_categories';
  private readonly FARMS_KEY = 'bipcosa06_farms';
  private readonly CONFIG_KEY = 'bipcosa06_config';
  private readonly INFO_CONTENTS_KEY = 'bipcosa06_info_contents';
  private readonly CONTACT_CONTENTS_KEY = 'bipcosa06_contact_contents';
  private readonly SOCIAL_NETWORKS_KEY = 'bipcosa06_social_networks';
  
  constructor() {
    console.log('🚀 DataService DYNAMIQUE initialisé');
    this.initializeDefaultData();
  }

  // Initialiser les données par défaut si localStorage est vide
  private initializeDefaultData(): void {
    if (typeof window === 'undefined') return;

    try {
      // Initialiser les produits
      if (!localStorage.getItem(this.PRODUCTS_KEY)) {
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
        console.log('📦 Produits par défaut initialisés');
      }

      // Initialiser les catégories
      if (!localStorage.getItem(this.CATEGORIES_KEY)) {
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
        console.log('📂 Catégories par défaut initialisées');
      }

      // Initialiser les fermes
      if (!localStorage.getItem(this.FARMS_KEY)) {
        localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
        console.log('🏠 Fermes par défaut initialisées');
      }

      // Initialiser les réseaux sociaux
      if (!localStorage.getItem(this.SOCIAL_NETWORKS_KEY)) {
        localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify(defaultSocialNetworks));
        console.log('🌐 Réseaux sociaux par défaut initialisés');
      }

      // Initialiser le contenu info
      const defaultInfoContents = [{
        id: 'main-info',
        title: '🌟 BIPCOSA06 - Votre Boutique de Confiance',
        description: 'Découvrez notre sélection premium de produits de qualité. Livraison rapide et service client exceptionnel.',
        additionalInfo: 'Qualité garantie - Satisfaction 100%'
      }];
      if (!localStorage.getItem(this.INFO_CONTENTS_KEY)) {
        localStorage.setItem(this.INFO_CONTENTS_KEY, JSON.stringify(defaultInfoContents));
        console.log('ℹ️ Contenu info par défaut initialisé');
      }

      // Initialiser le contenu contact
      const defaultContactContents = [{
        id: 'main-contact',
        title: '📱 Contact BIPCOSA06',
        description: 'Contactez-nous facilement via Telegram pour vos commandes',
        telegramUsername: '@bipcosa06',
        telegramLink: 'https://t.me/bipcosa06',
        additionalInfo: 'Réponse rapide garantie - Service 7j/7'
      }];
      if (!localStorage.getItem(this.CONTACT_CONTENTS_KEY)) {
        localStorage.setItem(this.CONTACT_CONTENTS_KEY, JSON.stringify(defaultContactContents));
        console.log('📞 Contenu contact par défaut initialisé');
      }

      console.log('✅ DataService - Données par défaut initialisées');
    } catch (error) {
      console.error('❌ Erreur initialisation données par défaut:', error);
    }
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // === PRODUITS - SYSTÈME DYNAMIQUE ===
  async getProducts(): Promise<Product[]> {
    return this.getProductsSync();
  }

  getProductsSync(): Product[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        console.log('📦 getProductsSync - Produits depuis localStorage:', products.length);
        return products;
      }
      
      console.log('📦 getProductsSync - Aucun produit trouvé');
      return [];
    } catch (error) {
      console.error('❌ Erreur lecture produits:', error);
      return [];
    }
  }

  async addProduct(productData: any): Promise<Product> {
    try {
      const products = this.getProductsSync();
      
      // Générer un nouvel ID
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct: Product = {
        ...productData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      products.push(newProduct);
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      console.log('✅ Produit ajouté:', newProduct.name);
      this.notifyDataUpdate();
      
      return newProduct;
    } catch (error) {
      console.error('❌ Erreur ajout produit:', error);
      throw error;
    }
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    try {
      const products = this.getProductsSync();
      const index = products.findIndex(p => p.id === id);
      
      if (index !== -1) {
        products[index] = { ...products[index], ...updates, updatedAt: new Date() };
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        console.log('✅ Produit mis à jour:', id);
        this.notifyDataUpdate();
        return products[index];
      }
      
      console.log('❌ Produit non trouvé pour mise à jour:', id);
      return null;
    } catch (error) {
      console.error('❌ Erreur mise à jour produit:', error);
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const products = this.getProductsSync();
      const index = products.findIndex(p => p.id === id);
      
      if (index !== -1) {
        const deletedProduct = products[index];
        products.splice(index, 1);
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        console.log('✅ Produit supprimé:', deletedProduct.name, '- Restants:', products.length);
        this.notifyDataUpdate();
        return true;
      }
      
      console.log('❌ Produit non trouvé pour suppression:', id);
      return false;
    } catch (error) {
      console.error('❌ Erreur suppression produit:', error);
      return false;
    }
  }

  // === CATÉGORIES - SYSTÈME DYNAMIQUE ===
  async getCategories(): Promise<Category[]> {
    return this.getCategoriesSync();
  }

  getCategoriesSync(): Category[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.CATEGORIES_KEY);
      if (stored) {
        const categories = JSON.parse(stored);
        console.log('📂 getCategoriesSync - Catégories depuis localStorage:', categories.length);
        return categories;
      }
      
      console.log('📂 getCategoriesSync - Aucune catégorie trouvée');
      return [];
    } catch (error) {
      console.error('❌ Erreur lecture catégories:', error);
      return [];
    }
  }

  async addCategory(category: Category): Promise<Category> {
    try {
      const categories = this.getCategoriesSync();
      const existingIndex = categories.findIndex(c => c.value === category.value);
      
      if (existingIndex === -1) {
        categories.push(category);
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        console.log('✅ Catégorie ajoutée:', category.label);
        this.notifyDataUpdate();
      }
      
      return category;
    } catch (error) {
      console.error('❌ Erreur ajout catégorie:', error);
      throw error;
    }
  }

  async updateCategory(value: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const categories = this.getCategoriesSync();
      const index = categories.findIndex(c => c.value === value);
      
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates };
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        console.log('✅ Catégorie mise à jour:', value);
        this.notifyDataUpdate();
        return categories[index];
      }
      
      console.log('❌ Catégorie non trouvée pour mise à jour:', value);
      return null;
    } catch (error) {
      console.error('❌ Erreur mise à jour catégorie:', error);
      return null;
    }
  }

  async deleteCategory(value: string): Promise<boolean> {
    try {
      const categories = this.getCategoriesSync();
      const index = categories.findIndex(c => c.value === value);
      
      if (index !== -1) {
        const deletedCategory = categories[index];
        categories.splice(index, 1);
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
                console.log('✅ Catégorie supprimée:', deletedCategory.label, '- Restantes:', categories.length);
        this.notifyDataUpdate();
        return true;
      }
      
      console.log('❌ Catégorie non trouvée pour suppression:', value);
      return false;
    } catch (error) {
      console.error('❌ Erreur suppression catégorie:', error);
      return false;
    }
  }

  // === FERMES - SYSTÈME DYNAMIQUE ===
  async getFarms(): Promise<Farm[]> {
    return this.getFarmsSync();
  }

  getFarmsSync(): Farm[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.FARMS_KEY);
      if (stored) {
        const farms = JSON.parse(stored);
        console.log('🏠 getFarmsSync - Fermes depuis localStorage:', farms.length);
        return farms;
      }
      
      console.log('🏠 getFarmsSync - Aucune ferme trouvée');
      return [];
    } catch (error) {
      console.error('❌ Erreur lecture fermes:', error);
      return [];
    }
  }

  async addFarm(farm: Farm): Promise<Farm> {
    try {
      const farms = this.getFarmsSync();
      const existingIndex = farms.findIndex(f => f.value === farm.value);
      
      if (existingIndex === -1) {
        farms.push(farm);
        localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        console.log('✅ Ferme ajoutée:', farm.label);
        this.notifyDataUpdate();
      }
      
      return farm;
    } catch (error) {
      console.error('❌ Erreur ajout ferme:', error);
      throw error;
    }
  }

  async updateFarm(value: string, updates: Partial<Farm>): Promise<Farm | null> {
    try {
      const farms = this.getFarmsSync();
      const index = farms.findIndex(f => f.value === value);
      
      if (index !== -1) {
        farms[index] = { ...farms[index], ...updates };
        localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        console.log('✅ Ferme mise à jour:', value);
        this.notifyDataUpdate();
        return farms[index];
      }
      
      console.log('❌ Ferme non trouvée pour mise à jour:', value);
      return null;
    } catch (error) {
      console.error('❌ Erreur mise à jour ferme:', error);
      return null;
    }
  }

  async deleteFarm(value: string): Promise<boolean> {
    try {
      const farms = this.getFarmsSync();
      const index = farms.findIndex(f => f.value === value);
      
      if (index !== -1) {
        const deletedFarm = farms[index];
        farms.splice(index, 1);
        localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        console.log('✅ Ferme supprimée:', deletedFarm.label, '- Restantes:', farms.length);
        this.notifyDataUpdate();
        return true;
      }
      
      console.log('❌ Ferme non trouvée pour suppression:', value);
      return false;
    } catch (error) {
      console.error('❌ Erreur suppression ferme:', error);
      return false;
    }
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
      description: 'Boutique BIPCOSA06 - Votre référence qualité'
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
      description: 'Boutique BIPCOSA06 - Votre référence qualité'
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
    return Promise.resolve(this.getSocialNetworksSync());
  }

  getSocialNetworksSync(): SocialNetwork[] {
    try {
      if (typeof window === 'undefined') return [...defaultSocialNetworks];
      
      const stored = localStorage.getItem(this.SOCIAL_NETWORKS_KEY);
      if (stored) {
        const networks = JSON.parse(stored);
        console.log('🌐 getSocialNetworksSync - Réseaux depuis localStorage:', networks.length);
        return networks;
      }
      
      console.log('🌐 getSocialNetworksSync - Réseaux par défaut');
      return [...defaultSocialNetworks];
    } catch (error) {
      console.error('❌ Erreur lecture réseaux sociaux:', error);
      return [...defaultSocialNetworks];
    }
  }

  addSocialNetwork(network: Omit<SocialNetwork, 'id' | 'createdAt' | 'updatedAt'>): SocialNetwork {
    const newNetwork: SocialNetwork = {
      ...network,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const networks = this.getSocialNetworksSync();
    networks.push(newNetwork);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify(networks));
    }
    
    console.log('✅ Réseau social ajouté:', newNetwork.name);
    this.notifyDataUpdate();
    return newNetwork;
  }

  updateSocialNetwork(id: string, updates: Partial<SocialNetwork>): SocialNetwork | null {
    const networks = this.getSocialNetworksSync();
    const index = networks.findIndex(n => n.id === id);
    
    if (index !== -1) {
      networks[index] = { ...networks[index], ...updates, updatedAt: new Date() };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify(networks));
      }
      
      console.log('✅ Réseau social mis à jour:', networks[index].name);
      this.notifyDataUpdate();
      return networks[index];
    }
    return null;
  }

  deleteSocialNetwork(id: string): boolean {
    const networks = this.getSocialNetworksSync();
    const index = networks.findIndex(n => n.id === id);
    
    if (index !== -1) {
      const deletedNetwork = networks[index];
      networks.splice(index, 1);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify(networks));
      }
      
      console.log('✅ Réseau social supprimé:', deletedNetwork.name);
      this.notifyDataUpdate();
      return true;
    }
    return false;
  }

  // Méthode pour réinitialiser les réseaux sociaux (utile pour le debug)
  resetSocialNetworks(): SocialNetwork[] {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify(defaultSocialNetworks));
    }
    console.log('🔄 Réseaux sociaux réinitialisés aux valeurs par défaut');
    this.notifyDataUpdate();
    return [...defaultSocialNetworks];
  }

  // === CONTENU INFO - SYSTÈME DYNAMIQUE ===
  async getInfoContents(): Promise<InfoContent[]> {
    return this.getInfoContentsSync();
  }

  getInfoContentsSync(): InfoContent[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.INFO_CONTENTS_KEY);
      if (stored) {
        const contents = JSON.parse(stored);
        console.log('ℹ️ getInfoContentsSync - Contenus depuis localStorage:', contents.length);
        return contents;
      }
      
      console.log('ℹ️ getInfoContentsSync - Aucun contenu trouvé');
      return [];
    } catch (error) {
      console.error('❌ Erreur lecture contenu info:', error);
      return [];
    }
  }

  async updateInfoContent(id: string, updates: Partial<InfoContent>): Promise<InfoContent | null> {
    try {
      const contents = this.getInfoContentsSync();
      const index = contents.findIndex(c => c.id === id);
      
      if (index !== -1) {
        contents[index] = { ...contents[index], ...updates };
        localStorage.setItem(this.INFO_CONTENTS_KEY, JSON.stringify(contents));
        console.log('✅ Contenu info mis à jour:', id);
        this.notifyDataUpdate();
        return contents[index];
      } else {
        // Si le contenu n'existe pas, le créer
        const newContent: InfoContent = {
          id,
          title: updates.title || '🌟 BIPCOSA06 - Votre Boutique de Confiance',
          description: updates.description || 'Découvrez notre sélection premium.',
          additionalInfo: updates.additionalInfo || 'Qualité garantie'
        };
        contents.push(newContent);
        localStorage.setItem(this.INFO_CONTENTS_KEY, JSON.stringify(contents));
        console.log('✅ Contenu info créé:', id);
        this.notifyDataUpdate();
        return newContent;
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour contenu info:', error);
      throw error;
    }
  }

  // === CONTENU CONTACT - SYSTÈME DYNAMIQUE ===
  async getContactContents(): Promise<ContactContent[]> {
    return this.getContactContentsSync();
  }

  getContactContentsSync(): ContactContent[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.CONTACT_CONTENTS_KEY);
      if (stored) {
        const contents = JSON.parse(stored);
        console.log('📞 getContactContentsSync - Contenus depuis localStorage:', contents.length);
        return contents;
      }
      
      console.log('📞 getContactContentsSync - Aucun contenu trouvé');
      return [];
    } catch (error) {
      console.error('❌ Erreur lecture contenu contact:', error);
      return [];
    }
  }

  async updateContactContent(id: string, updates: Partial<ContactContent>): Promise<ContactContent | null> {
    try {
      const contents = this.getContactContentsSync();
      const index = contents.findIndex(c => c.id === id);
      
      if (index !== -1) {
        contents[index] = { ...contents[index], ...updates };
        localStorage.setItem(this.CONTACT_CONTENTS_KEY, JSON.stringify(contents));
        console.log('✅ Contenu contact mis à jour:', id);
        this.notifyDataUpdate();
        return contents[index];
      } else {
        // Si le contenu n'existe pas, le créer
        const newContent: ContactContent = {
          id,
          title: updates.title || '📱 Contact BIPCOSA06',
          description: updates.description || 'Contactez-nous via Telegram',
          telegramUsername: updates.telegramUsername || '@bipcosa06',
          telegramLink: updates.telegramLink || 'https://t.me/bipcosa06',
          additionalInfo: updates.additionalInfo || 'Service 7j/7'
        };
        contents.push(newContent);
        localStorage.setItem(this.CONTACT_CONTENTS_KEY, JSON.stringify(contents));
        console.log('✅ Contenu contact créé:', id);
        this.notifyDataUpdate();
        return newContent;
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour contenu contact:', error);
      throw error;
    }
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