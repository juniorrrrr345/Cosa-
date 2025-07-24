// Service de gestion des données BIPCOSA06 avec APIs MongoDB et Cloudinary
import { SocialNetwork, defaultSocialNetworks } from '@/models/SocialNetwork';

export interface Product {
  _id?: string;
  id: number;
  name: string;
  quality: string;
  image: string;
  imagePublicId?: string; // ID Cloudinary pour l'image
  flagColor: string;
  flagText: string;
  category: string;
  farm: string;
  description: string;
  prices: Array<{ 
    weight: string; 
    price: string; 
    id?: string; // ID unique pour la gestion
  }>;
  video?: string;
  videoPublicId?: string; // ID Cloudinary pour la vidéo
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  value: string;
  label: string;
}

export interface Farm {
  value: string;
  label: string;
  country: string;
}

export interface InfoContent {
  id: string;
  title: string;
  description: string;
  items?: string[];
}

export interface ContactContent {
  id: string;
  title: string;
  description: string;
  telegramUsername?: string;
  telegramLink?: string;
  additionalInfo?: string;
}

export interface ShopConfig {
  _id?: string;
  backgroundType: 'gradient' | 'image' | 'url';
  backgroundImage?: string; // Cloudinary ou upload local
  backgroundUrl?: string; // URL externe (Imgur, etc.)
  backgroundImagePublicId?: string; // ID Cloudinary pour l'image de fond
  shopName: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class DataService {
  private static instance: DataService;
  
  // Cache simplifié - SEUL le panel admin contrôle
  private productsCache: Product[] = [];
  private categoriesCache: Category[] = [];
  private farmsCache: Farm[] = [];
  private configCache: ShopConfig | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 1000; // 1 seconde pour une sync ultra rapide
  
  // Cache pour les contenus Info et Contact
  private infoCacheTimestamp = 0;
  private contactCacheTimestamp = 0;
  private readonly CONTENT_CACHE_KEY_INFO = 'bipcosa06_info_content';
  private readonly CONTENT_CACHE_KEY_CONTACT = 'bipcosa06_contact_content';

  // Données statiques pour Info et Contact
  private infoContents: InfoContent[] = [
    {
      id: 'main-info',
      title: '📋 Informations Boutique',
      description: 'Votre boutique BIPCOSA06 - Service professionnel et livraison rapide.',
      items: [
        '✅ Livraison dans les zones : 69, 71, 01, 42, 38',
        '🕒 Horaires de livraison : 10h - 22h',
        '📱 Commandes via Telegram uniquement',
        '🔒 Service discret et professionnel',
        '⚡ Livraison rapide (30-60 min)',
        '💎 Produits de qualité premium'
      ]
    }
  ];

  private contactContents: ContactContent[] = [
    {
      id: 'main-contact',
      title: '📱 Contact BIPCOSA06',
      description: 'Contactez-nous facilement via Telegram pour vos commandes',
      telegramUsername: '@bipcosa06',
      telegramLink: 'https://t.me/bipcosa06',
      additionalInfo: 'Réponse rapide garantie - Service 7j/7 de 10h à 22h'
    }
  ];

  // Social Networks Cache
  private socialNetworksCache: SocialNetwork[] = [];
  private socialNetworksCacheTimestamp = 0;

  constructor() {
    console.log('🚀 DataService initialisé');
    
    // NETTOYAGE COMPLET du cache au démarrage
    this.clearAllCache();
    
    // Charger les contenus depuis localStorage
    this.loadContentFromStorage();
    
    // Charger les catégories et fermes depuis localStorage ou utiliser les défauts
    this.loadCategoriesFromStorage();
    this.loadFarmsFromStorage();
    this.loadSocialNetworksFromStorage();
    this.loadProductsFromStorage();
    
    // Initialiser avec les données de base
    this.initializeDefaultData();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // NETTOYAGE COMPLET du cache
  private clearAllCache(): void {
    console.log('🧹 NETTOYAGE COMPLET du cache...');
    
    if (typeof window !== 'undefined') {
      // NE PAS supprimer les données persistantes importantes
      const keysToKeep = [
        'bipcosa06_config',
        'bipcosa06_products',
        'bipcosa06_categories', 
        'bipcosa06_farms',
        'bipcosa06_social_networks',
        'bipcosa06_info_content',
        'bipcosa06_contact_content'
      ];
      
      // Supprimer uniquement les caches temporaires
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('bipcosa06_cache_') || key.startsWith('bipcosa06_temp_')) {
          localStorage.removeItem(key);
          console.log(`🗑️ Supprimé cache temporaire: ${key}`);
        }
      });
    }
    
    // Reset des caches mémoire
    this.cacheTimestamp = 0;
    this.infoCacheTimestamp = 0;
    this.contactCacheTimestamp = 0;
    this.socialNetworksCacheTimestamp = 0;
    
    console.log('✅ Cache temporaire nettoyé');
  }

  private initializeDefaultData(): void {
    // Initialiser avec des données de base si rien en localStorage
    if (this.categoriesCache.length === 0) {
      this.categoriesCache = this.getStaticCategories();
      this.saveCategoriesFromStorage();
    }
    
    if (this.farmsCache.length === 0) {
      this.farmsCache = this.getStaticFarms();
      this.saveFarmsFromStorage();
    }
    
    if (this.socialNetworksCache.length === 0) {
      this.socialNetworksCache = [...defaultSocialNetworks];
      this.saveSocialNetworksToStorage();
    }

    if (this.productsCache.length === 0) {
      this.productsCache = this.getFallbackProducts();
      this.saveProductsToStorage();
    }
  }

  // === GESTION LOCALE DES PRODUITS ===
  private loadProductsFromStorage(): Product[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bipcosa06_products');
        if (stored) {
          const products = JSON.parse(stored);
          this.productsCache = products;
          console.log('📦 Produits chargés depuis localStorage:', products.length);
          return products;
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des produits depuis localStorage:', error);
      }
    }
    return [];
  }

  private saveProductsToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bipcosa06_products', JSON.stringify(this.productsCache));
        console.log('💾 Produits sauvegardés dans localStorage:', this.productsCache.length);
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde des produits:', error);
      }
    }
  }

  // Cache simplifié - actualisation uniquement si nécessaire
  private async refreshCache(): Promise<void> {
    const now = Date.now();
    
    // Vérifier si le cache est encore valide
    if (now - this.cacheTimestamp < this.CACHE_DURATION && this.configCache) {
      return; // Cache encore valide
    }
    
    console.log('🔄 Actualisation du cache...');
    
    try {
      // Charger UNIQUEMENT depuis l'API pour la config, le reste depuis localStorage
      const configData = await this.fetchConfig();
      
      this.configCache = configData;
      this.cacheTimestamp = now;
      
      console.log('✅ Cache actualisé avec config:', configData);
    } catch (error) {
      console.error('❌ Erreur lors de l\'actualisation du cache:', error);
      // En cas d'erreur, utiliser UNIQUEMENT le configCache existant
      if (!this.configCache) {
        this.configCache = this.getMinimalFallbackConfig();
      }
    }
  }

  // Méthodes d'appel aux APIs
  private async fetchProducts(): Promise<Product[]> {
    // TOUJOURS utiliser localStorage pour les produits
    return this.productsCache;
  }

  private async fetchCategories(): Promise<Category[]> {
    // TOUJOURS utiliser les données du cache local
    return this.categoriesCache;
  }

  private async fetchFarms(): Promise<Farm[]> {
    // TOUJOURS utiliser les données du cache local
    return this.farmsCache;
  }

  private async fetchConfig(): Promise<ShopConfig> {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Erreur API config');
      const config = await response.json();
      
      // Sauvegarder immédiatement en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bipcosa06_config', JSON.stringify(config));
      }
      
      return config;
    } catch (error) {
      console.error('Erreur fetch config:', error);
      
      // Essayer de récupérer depuis localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bipcosa06_config');
        if (stored) {
          console.log('📥 Config récupérée depuis localStorage');
          return JSON.parse(stored);
        }
      }
      
      return this.getMinimalFallbackConfig();
    }
  }

  // Configuration de fallback MINIMALE (pas de background par défaut)
  private getMinimalFallbackConfig(): ShopConfig {
    return {
      backgroundType: 'gradient',
      backgroundImage: '',
      backgroundUrl: '',
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
    };
  }

  // Données de fallback si les APIs ne sont pas disponibles
  private getFallbackProducts(): Product[] {
    return [
      {
        id: 1,
        name: "ANIMAL COOKIES",
        quality: "Qualité Top",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
        flagColor: "#333333",
        flagText: "🇳🇱 HOLLAND",
        category: "indica",
        farm: "holland",
        description: "Une variété indica premium avec des arômes sucrés et terreux. Parfaite pour la relaxation en soirée.",
        prices: [
          { id: "1", weight: "1g", price: "12€" },
          { id: "2", weight: "3.5g", price: "40€" },
          { id: "3", weight: "7g", price: "75€" },
          { id: "4", weight: "14g", price: "140€" },
          { id: "5", weight: "28g", price: "260€" }
        ],
        video: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        id: 2,
        name: "POWER HAZE",
        quality: "Qualité mid",
        image: "https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=400&h=300&fit=crop&crop=center",
        flagColor: "#333333",
        flagText: "🇪🇸 ESPAGNOL",
        category: "sativa",
        farm: "espagne",
        description: "Sativa énergisante avec des effets cérébraux puissants. Idéale pour la créativité et l'activité diurne.",
        prices: [
          { id: "1", weight: "1g", price: "10€" },
          { id: "2", weight: "3.5g", price: "32€" },
          { id: "3", weight: "7g", price: "60€" },
          { id: "4", weight: "14g", price: "110€" },
          { id: "5", weight: "28g", price: "200€" }
        ],
        video: "https://www.w3schools.com/html/mov_bbb.mp4"
      }
    ];
  }

  // Méthodes pour données statiques (catégories et fermes) - maintenant modifiables
  private getStaticCategories(): Category[] {
    return [
      { value: 'indica', label: 'Indica' },
      { value: 'sativa', label: 'Sativa' },
      { value: 'hybrid', label: 'Hybride' },
      { value: 'indoor', label: 'Indoor' },
      { value: 'outdoor', label: 'Outdoor' }
    ];
  }

  private getStaticFarms(): Farm[] {
    return [
      { value: 'holland', label: 'Holland', country: '🇳🇱' },
      { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
      { value: 'calispain', label: 'Calispain', country: '🏴‍☠️' },
      { value: 'premium', label: 'Premium', country: '⭐' }
    ];
  }

  // === MÉTHODES PUBLIQUES ===

  // Produits - GESTION LOCALE COMPLETE
  async getProducts(): Promise<Product[]> {
    // Toujours depuis localStorage
    this.loadProductsFromStorage();
    return [...this.productsCache];
  }

  getProductsSync(): Product[] {
    return [...this.productsCache];
  }

  async addProduct(productData: any): Promise<Product> {
    try {
      console.log('➕ Ajout produit LOCAL:', productData);
      
      // Générer un nouvel ID
      const newId = Math.max(...this.productsCache.map(p => p.id), 0) + 1;
      
      const newProduct: Product = {
        ...productData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Ajouter au cache
      this.productsCache.push(newProduct);
      
      // Sauvegarder dans localStorage
      this.saveProductsToStorage();
      
      // Notifier la mise à jour
      this.notifyDataUpdate();
      
      console.log('✅ Produit ajouté avec succès:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  }

  async updateProduct(id: string | number, updates: Partial<Product>): Promise<Product | null> {
    try {
      console.log('✏️ Modification produit LOCAL:', id, updates);
      
      const index = this.productsCache.findIndex(p => p.id === Number(id));
      if (index === -1) {
        throw new Error(`Produit avec l'ID ${id} non trouvé`);
      }
      
      // Mettre à jour le produit
      this.productsCache[index] = {
        ...this.productsCache[index],
        ...updates,
        updatedAt: new Date()
      };
      
      // Sauvegarder dans localStorage
      this.saveProductsToStorage();
      
      // Notifier la mise à jour
      this.notifyDataUpdate();
      
      console.log('✅ Produit modifié avec succès:', this.productsCache[index]);
      return this.productsCache[index];
    } catch (error) {
      console.error('❌ Erreur lors de la modification du produit:', error);
      throw error;
    }
  }

  async deleteProduct(id: string | number): Promise<boolean> {
    try {
      console.log('🗑️ Suppression produit LOCAL:', id);
      
      const index = this.productsCache.findIndex(p => p.id === Number(id));
      if (index === -1) {
        throw new Error(`Produit avec l'ID ${id} non trouvé`);
      }
      
      // Supprimer le produit
      this.productsCache.splice(index, 1);
      
      // Sauvegarder dans localStorage
      this.saveProductsToStorage();
      
      // Notifier la mise à jour
      this.notifyDataUpdate();
      
      console.log('✅ Produit supprimé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  // Catégories - GESTION LOCALE
  async getCategories(): Promise<Category[]> {
    this.loadCategoriesFromStorage();
    console.log('📂 getCategories - categoriesCache:', this.categoriesCache);
    return this.categoriesCache;
  }

  getCategoriesSync(): Category[] {
    console.log('📂 getCategoriesSync - categoriesCache:', this.categoriesCache);
    return this.categoriesCache;
  }

  async addCategory(category: Category): Promise<Category> {
    try {
      console.log('➕ Ajout catégorie LOCAL:', category);
      
      // Vérifier si la catégorie existe déjà
      const existingIndex = this.categoriesCache.findIndex(c => c.value === category.value);
      if (existingIndex !== -1) {
        throw new Error('Cette catégorie existe déjà');
      }
      
      // Ajouter la catégorie
      this.categoriesCache.push(category);
      
      // Sauvegarder
      this.saveCategoriesFromStorage();
      this.notifyDataUpdate();
      
      console.log('✅ Catégorie ajoutée avec succès:', category);
      return category;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la catégorie:', error);
      throw error;
    }
  }

  async updateCategory(value: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      console.log('✏️ Modification catégorie LOCAL:', value, updates);
      
      const index = this.categoriesCache.findIndex(c => c.value === value);
      if (index === -1) {
        throw new Error(`Catégorie avec la valeur ${value} non trouvée`);
      }
      
      // Mettre à jour la catégorie
      this.categoriesCache[index] = { ...this.categoriesCache[index], ...updates };
      
      // Sauvegarder
      this.saveCategoriesFromStorage();
      this.notifyDataUpdate();
      
      console.log('✅ Catégorie modifiée avec succès:', this.categoriesCache[index]);
      return this.categoriesCache[index];
    } catch (error) {
      console.error('❌ Erreur lors de la modification de la catégorie:', error);
      throw error;
    }
  }

  async deleteCategory(value: string): Promise<boolean> {
    try {
      console.log('🗑️ Suppression catégorie LOCAL:', value);
      
      const index = this.categoriesCache.findIndex(c => c.value === value);
      if (index === -1) {
        throw new Error(`Catégorie avec la valeur ${value} non trouvée`);
      }
      
      // Supprimer la catégorie
      this.categoriesCache.splice(index, 1);
      
      // Sauvegarder
      this.saveCategoriesFromStorage();
      this.notifyDataUpdate();
      
      console.log('✅ Catégorie supprimée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }

  // Farms - GESTION LOCALE
  async getFarms(): Promise<Farm[]> {
    this.loadFarmsFromStorage();
    console.log('🏠 getFarms - farmsCache:', this.farmsCache);
    return this.farmsCache;
  }

  getFarmsSync(): Farm[] {
    console.log('🏠 getFarmsSync - farmsCache:', this.farmsCache);
    return this.farmsCache;
  }

  async addFarm(farm: Farm): Promise<Farm> {
    try {
      console.log('➕ Ajout farm LOCAL:', farm);
      
      // Vérifier si la farm existe déjà
      const existingIndex = this.farmsCache.findIndex(f => f.value === farm.value);
      if (existingIndex !== -1) {
        throw new Error('Cette farm existe déjà');
      }
      
      // Ajouter la farm
      this.farmsCache.push(farm);
      
      // Sauvegarder
      this.saveFarmsFromStorage();
      this.notifyDataUpdate();
      
      console.log('✅ Farm ajoutée avec succès:', farm);
      return farm;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la farm:', error);
      throw error;
    }
  }

  async updateFarm(value: string, updates: Partial<Farm>): Promise<Farm | null> {
    try {
      console.log('✏️ Modification farm LOCAL:', value, updates);
      
      const index = this.farmsCache.findIndex(f => f.value === value);
      if (index === -1) {
        throw new Error(`Farm avec la valeur ${value} non trouvée`);
      }
      
      // Mettre à jour la farm
      this.farmsCache[index] = { ...this.farmsCache[index], ...updates };
      
      // Sauvegarder
      this.saveFarmsFromStorage();
      this.notifyDataUpdate();
      
      console.log('✅ Farm modifiée avec succès:', this.farmsCache[index]);
      return this.farmsCache[index];
    } catch (error) {
      console.error('❌ Erreur lors de la modification de la farm:', error);
      throw error;
    }
  }

  async deleteFarm(value: string): Promise<boolean> {
    try {
      console.log('🗑️ Suppression farm LOCAL:', value);
      
      const index = this.farmsCache.findIndex(f => f.value === value);
      if (index === -1) {
        throw new Error(`Farm avec la valeur ${value} non trouvée`);
      }
      
      // Supprimer la farm
      this.farmsCache.splice(index, 1);
      
      // Sauvegarder
      this.saveFarmsFromStorage();
      this.notifyDataUpdate();
      
      console.log('✅ Farm supprimée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la farm:', error);
      throw error;
    }
  }

  // Configuration - SEUL CONTROLE DEPUIS LE PANEL ADMIN
  async getConfig(): Promise<ShopConfig> {
    console.log('🔍 getConfig() appelée');
    
    // TOUJOURS essayer localStorage en premier (cache du panel admin)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bipcosa06_config');
      if (stored) {
        try {
          const config = JSON.parse(stored);
          this.configCache = config;
          console.log('⚙️ Config depuis localStorage (panel admin):', config);
          return config;
        } catch (e) {
          console.error('❌ Erreur parsing config localStorage');
        }
      }
    }
    
    // Sinon, essayer l'API
    await this.refreshCache();
    const config = this.configCache || this.getMinimalFallbackConfig();
    console.log('⚙️ Config retournée:', config);
    return config;
  }

  getConfigSync(): ShopConfig {
    console.log('🔍 getConfigSync() appelée');
    
    // TOUJOURS essayer localStorage en premier
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bipcosa06_config');
      if (stored) {
        try {
          const config = JSON.parse(stored);
          this.configCache = config;
          console.log('⚙️ ConfigSync depuis localStorage:', config);
          return config;
        } catch (e) {
          console.error('❌ Erreur parsing config localStorage');
        }
      }
    }
    
    const config = this.configCache || this.getMinimalFallbackConfig();
    console.log('⚙️ ConfigSync retournée:', config);
    return config;
  }

  async updateConfig(updates: Partial<ShopConfig>): Promise<ShopConfig> {
    try {
      console.log('📤 updateConfig appelée avec:', updates);
      
      // Récupérer la config actuelle
      const currentConfig = this.configCache || this.getMinimalFallbackConfig();
      const updatedConfig = { ...currentConfig, ...updates };
      
      // FORCER la mise à jour du cache immédiatement
      this.configCache = updatedConfig;
      
      // FORCER la sauvegarde dans localStorage IMMÉDIATEMENT
      if (typeof window !== 'undefined') {
        localStorage.setItem('bipcosa06_config', JSON.stringify(updatedConfig));
        console.log('💾 Config FORCÉE dans localStorage:', updatedConfig);
      }
      
      // Essayer de sauvegarder via API (sans attendre)
      try {
        const response = await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        
        if (response.ok) {
          console.log('✅ Config sauvegardée aussi via API');
        }
      } catch (apiError) {
        console.log('⚠️ API config non disponible, localStorage utilisé');
      }
      
      // FORCER la notification globale
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bipcosa06ConfigChanged', { 
          detail: updatedConfig 
        }));
        
        // Événement de backup pour forcer le reload
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('configUpdated'));
          window.dispatchEvent(new CustomEvent('dataUpdated'));
        }, 100);
      }
      
      console.log('🎯 Config FORCÉE et événements envoyés:', updatedConfig);
      return updatedConfig;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la configuration:', error);
      throw error;
    }
  }

  // Info et Contact avec mise à jour
  getInfoContents(): InfoContent[] {
    return [...this.infoContents];
  }

  getContactContents(): ContactContent[] {
    return [...this.contactContents];
  }

  updateInfoContent(content: Partial<InfoContent>): void {
    const index = this.infoContents.findIndex(info => info.id === 'main-info');
    if (index !== -1) {
      this.infoContents[index] = { ...this.infoContents[index], ...content };
    } else {
      this.infoContents.push({ id: 'main-info', title: '', description: '', items: [], ...content });
    }
    
    // Sauvegarder dans localStorage pour persistance
    this.saveContentToStorage();
    
    // Invalider le cache
    this.infoCacheTimestamp = 0;
    
    // Notifier la mise à jour
    this.notifyDataUpdate();
    console.log('📝 Info content mis à jour et sauvegardé:', content);
  }

  updateContactContent(content: Partial<ContactContent>): void {
    const index = this.contactContents.findIndex(contact => contact.id === 'main-contact');
    if (index !== -1) {
      this.contactContents[index] = { ...this.contactContents[index], ...content };
    } else {
      this.contactContents.push({ id: 'main-contact', title: '', description: '', ...content });
    }
    
    // Sauvegarder dans localStorage pour persistance
    this.saveContentToStorage();
    
    // Invalider le cache
    this.contactCacheTimestamp = 0;
    
    // Notifier la mise à jour
    this.notifyDataUpdate();
    console.log('📧 Contact content mis à jour et sauvegardé:', content);
  }

  // Méthodes de persistance localStorage
  private saveContentToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.CONTENT_CACHE_KEY_INFO, JSON.stringify(this.infoContents));
        localStorage.setItem(this.CONTENT_CACHE_KEY_CONTACT, JSON.stringify(this.contactContents));
        console.log('💾 Contenus sauvegardés dans localStorage');
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde localStorage:', error);
      }
    }
  }

  private loadContentFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedInfo = localStorage.getItem(this.CONTENT_CACHE_KEY_INFO);
        const storedContact = localStorage.getItem(this.CONTENT_CACHE_KEY_CONTACT);
        const storedConfig = localStorage.getItem('bipcosa06_config');
        
        if (storedInfo) {
          this.infoContents = JSON.parse(storedInfo);
          console.log('📥 Info content chargé depuis localStorage');
        }
        
        if (storedContact) {
          this.contactContents = JSON.parse(storedContact);
          console.log('📥 Contact content chargé depuis localStorage');
        }
        
        if (storedConfig) {
          this.configCache = JSON.parse(storedConfig);
          console.log('📥 Configuration chargée depuis localStorage');
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement localStorage:', error);
      }
    }
  }

  // Méthodes de notification pour la synchronisation temps réel
  private notifyDataUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dataUpdated'));
    }
  }

  private notifyConfigUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('configUpdated'));
    }
  }

  // Méthode pour forcer l'actualisation du cache
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refresh du cache...');
    this.cacheTimestamp = 0; // Force la mise à jour des données principales
    this.infoCacheTimestamp = 0; // Force la mise à jour du contenu Info
    this.contactCacheTimestamp = 0; // Force la mise à jour du contenu Contact
    
    await this.refreshCache();
    this.loadContentFromStorage(); // Recharger les contenus depuis localStorage
    
    // Notifier TOUS les composants de la mise à jour
    this.notifyDataUpdate();
    this.notifyConfigUpdate();
    
    console.log('✅ Cache forcé et composants notifiés');
  }

  // Méthode pour synchroniser instantanément
  forceSyncContent(): void {
    this.loadContentFromStorage();
    this.notifyDataUpdate();
    console.log('🔄 Synchronisation forcée des contenus Info/Contact');
  }

  // === GESTION DES CATÉGORIES - LOCALSTORAGE ===
  private loadCategoriesFromStorage(): Category[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bipcosa06_categories');
        if (stored) {
          const categories = JSON.parse(stored);
          this.categoriesCache = categories;
          console.log('📂 Catégories chargées depuis localStorage:', categories.length);
          return categories;
        }
      } catch (error) {
        console.error('❌ Erreur chargement catégories:', error);
      }
    }
    return [];
  }

  private saveCategoriesFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bipcosa06_categories', JSON.stringify(this.categoriesCache));
        console.log('💾 Catégories sauvegardées dans localStorage:', this.categoriesCache.length);
      } catch (error) {
        console.error('❌ Erreur sauvegarde catégories:', error);
      }
    }
  }

  // === GESTION DES FERMES - LOCALSTORAGE ===
  private loadFarmsFromStorage(): Farm[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bipcosa06_farms');
        if (stored) {
          const farms = JSON.parse(stored);
          this.farmsCache = farms;
          console.log('🏠 Fermes chargées depuis localStorage:', farms.length);
          return farms;
        }
      } catch (error) {
        console.error('❌ Erreur chargement fermes:', error);
      }
    }
    return [];
  }

  private saveFarmsFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bipcosa06_farms', JSON.stringify(this.farmsCache));
        console.log('💾 Fermes sauvegardées dans localStorage:', this.farmsCache.length);
      } catch (error) {
        console.error('❌ Erreur sauvegarde fermes:', error);
      }
    }
  }

  // === GESTION DES RÉSEAUX SOCIAUX ===
  private loadSocialNetworksFromStorage(): SocialNetwork[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bipcosa06_socialNetworks');
        return stored ? JSON.parse(stored) : [...defaultSocialNetworks];
      } catch (error) {
        console.error('❌ Erreur chargement réseaux sociaux:', error);
        return [...defaultSocialNetworks];
      }
    }
    return [...defaultSocialNetworks];
  }

  private saveSocialNetworksToStorage(socialNetworks: SocialNetwork[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bipcosa06_socialNetworks', JSON.stringify(socialNetworks));
        console.log('💾 Réseaux sociaux sauvegardés:', socialNetworks.length);
      } catch (error) {
        console.error('❌ Erreur sauvegarde réseaux sociaux:', error);
      }
    }
  }

  // Méthodes publiques pour les réseaux sociaux
  getSocialNetworks(): Promise<SocialNetwork[]> {
    return Promise.resolve(this.getSocialNetworksSync());
  }

  getSocialNetworksSync(): SocialNetwork[] {
    const now = Date.now();
    if (now - this.socialNetworksCacheTimestamp > this.CACHE_DURATION) {
      this.socialNetworksCache = this.loadSocialNetworksFromStorage();
      this.socialNetworksCacheTimestamp = now;
    }
    return [...this.socialNetworksCache];
  }

  addSocialNetwork(network: Omit<SocialNetwork, 'id' | 'createdAt' | 'updatedAt'>): SocialNetwork {
    const currentNetworks = this.getSocialNetworksSync();
    const maxOrder = Math.max(...currentNetworks.map(n => n.order), 0);
    
    const newNetwork: SocialNetwork = {
      ...network,
      id: Date.now().toString(),
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedNetworks = [...currentNetworks, newNetwork];
    this.socialNetworksCache = updatedNetworks;
    this.saveSocialNetworksToStorage(updatedNetworks);
    this.notifyDataUpdate();

    console.log('✅ Réseau social ajouté:', newNetwork.name);
    return newNetwork;
  }

  updateSocialNetwork(id: string, updates: Partial<SocialNetwork>): SocialNetwork | null {
    const currentNetworks = this.getSocialNetworksSync();
    const networkIndex = currentNetworks.findIndex(n => n.id === id);
    
    if (networkIndex === -1) {
      console.error('❌ Réseau social non trouvé:', id);
      return null;
    }

    const updatedNetwork = {
      ...currentNetworks[networkIndex],
      ...updates,
      updatedAt: new Date()
    };

    const updatedNetworks = [...currentNetworks];
    updatedNetworks[networkIndex] = updatedNetwork;

    this.socialNetworksCache = updatedNetworks;
    this.saveSocialNetworksToStorage(updatedNetworks);
    this.notifyDataUpdate();

    console.log('✅ Réseau social mis à jour:', updatedNetwork.name);
    return updatedNetwork;
  }

  deleteSocialNetwork(id: string): boolean {
    const currentNetworks = this.getSocialNetworksSync();
    const filteredNetworks = currentNetworks.filter(n => n.id !== id);
    
    if (filteredNetworks.length === currentNetworks.length) {
      console.error('❌ Réseau social non trouvé pour suppression:', id);
      return false;
    }

    this.socialNetworksCache = filteredNetworks;
    this.saveSocialNetworksToStorage(filteredNetworks);
    this.notifyDataUpdate();

    console.log('✅ Réseau social supprimé:', id);
    return true;
  }

  reorderSocialNetworks(orderedIds: string[]): void {
    const currentNetworks = this.getSocialNetworksSync();
    const reorderedNetworks = orderedIds.map((id, index) => {
      const network = currentNetworks.find(n => n.id === id);
      return network ? { ...network, order: index + 1 } : null;
    }).filter(Boolean) as SocialNetwork[];

    this.socialNetworksCache = reorderedNetworks;
    this.saveSocialNetworksToStorage(reorderedNetworks);
    this.notifyDataUpdate();

    console.log('✅ Réseaux sociaux réordonnés');
  }
}

// Singleton instance
export const dataService = DataService.getInstance();
export default dataService;