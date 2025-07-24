// Service de gestion des données BIPCOSA06 avec APIs MongoDB et Cloudinary
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
  backgroundColor: string;
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
  
  // Cache pour optimiser les performances côté client
  private productsCache: Product[] = [];
  private categoriesCache: Category[] = [];
  private farmsCache: Farm[] = [];
  private configCache: ShopConfig | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5000; // 5 secondes pour une sync plus rapide
  
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
      title: '✉️ Nous Contacter',
      description: 'Pour passer commande ou obtenir des informations, contactez-nous directement via Telegram.',
      telegramUsername: '@bipcosa06',
      telegramLink: 'https://t.me/bipcosa06',
      additionalInfo: '📍 Zone de livraison : Lyon et alentours (69, 71, 01, 42, 38)\n🕒 Réponse rapide 24h/7j'
    }
  ];

  private constructor() {
    // Le constructeur ne fait plus d'initialisation synchrone
    this.refreshCache();
    this.loadContentFromStorage();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Méthode pour rafraîchir le cache
  private async refreshCache(): Promise<void> {
    try {
      const now = Date.now();
      if (now - this.cacheTimestamp < this.CACHE_DURATION && this.productsCache.length > 0) {
        return; // Cache encore valide
      }

      console.log('🔄 Actualisation du cache des données...');
      
      // Récupérer les données depuis les APIs
      const [productsData, categoriesData, farmsData, configData] = await Promise.all([
        this.fetchProducts(),
        this.fetchCategories(), 
        this.fetchFarms(),
        this.fetchConfig()
      ]);
      
      this.productsCache = productsData;
      this.categoriesCache = categoriesData;
      this.farmsCache = farmsData;
      this.configCache = configData;
      
      this.cacheTimestamp = now;
      console.log('✅ Cache actualisé');
    } catch (error) {
      console.error('❌ Erreur lors de l\'actualisation du cache:', error);
      // En cas d'erreur, utiliser les données de fallback
      this.useFallbackData();
    }
  }

  // Méthodes d'appel aux APIs
  private async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Erreur API products');
      return await response.json();
    } catch (error) {
      console.error('Erreur fetch products:', error);
      return this.getFallbackProducts();
    }
  }

  private async fetchCategories(): Promise<Category[]> {
    // TOUJOURS utiliser les données statiques (pas de MongoDB)
    console.log('📂 Utilisation des catégories statiques (sans MongoDB)');
    return this.getStaticCategories();
  }

  private async fetchFarms(): Promise<Farm[]> {
    // TOUJOURS utiliser les données statiques (pas de MongoDB)
    console.log('🏭 Utilisation des fermes statiques (sans MongoDB)');
    return this.getStaticFarms();
  }

  private async fetchConfig(): Promise<ShopConfig> {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Erreur API config');
      return await response.json();
    } catch (error) {
      console.error('Erreur fetch config:', error);
      return this.getFallbackConfig();
    }
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
    const stored = this.loadCategoriesFromStorage();
    if (stored.length > 0) return stored;
    
    return [
      { value: 'all', label: 'Toutes catégories' },
      { value: 'indica', label: 'Indica' },
      { value: 'sativa', label: 'Sativa' },
      { value: 'hybrid', label: 'Hybride' },
      { value: 'indoor', label: 'Indoor' },
      { value: 'outdoor', label: 'Outdoor' }
    ];
  }

  private getStaticFarms(): Farm[] {
    const stored = this.loadFarmsFromStorage();
    if (stored.length > 0) return stored;
    
    return [
      { value: 'all', label: 'Toutes fermes' },
      { value: 'holland', label: 'Holland', country: '🇳🇱' },
      { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
      { value: 'calispain', label: 'Calispain', country: '🇺🇸🇪🇸' },
      { value: 'premium', label: 'Premium', country: '⭐' }
    ];
  }

  private getFallbackConfig(): ShopConfig {
    return {
      backgroundType: 'gradient',
      backgroundColor: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      backgroundImage: '', // Image Cloudinary
      backgroundUrl: '', // URL d'image externe (Imgur, etc.)
      shopName: 'BIPCOSA06',
      description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
    };
  }

  private useFallbackData() {
    console.log('⚠️ Utilisation des données de fallback');
    this.productsCache = this.getFallbackProducts();
    this.categoriesCache = this.getStaticCategories(); // Corrigé
    this.farmsCache = this.getStaticFarms(); // Corrigé
    this.configCache = this.getFallbackConfig();
  }

  // === MÉTHODES PUBLIQUES ===

  // Produits
  async getProducts(): Promise<Product[]> {
    await this.refreshCache();
    return [...this.productsCache];
  }

  getProductsSync(): Product[] {
    return [...this.productsCache];
  }

  async addProduct(productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'ajout');
      }

      const createdProduct = await response.json();
      
      // Actualiser le cache
      await this.refreshCache();
      this.notifyDataUpdate();
      
      return createdProduct;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  }

  async updateProduct(id: string | number, updates: Partial<Product>): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      const updatedProduct = await response.json();
      
      // Actualiser le cache
      await this.refreshCache();
      this.notifyDataUpdate();
      
      return updatedProduct;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  async deleteProduct(id: string | number): Promise<boolean> {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      // Actualiser le cache
      await this.refreshCache();
      this.notifyDataUpdate();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  // Catégories
  async getCategories(): Promise<Category[]> {
    await this.refreshCache();
    return [{ value: 'all', label: 'Toutes les catégories' }, ...this.categoriesCache];
  }

  getCategoriesSync(): Category[] {
    return [{ value: 'all', label: 'Toutes les catégories' }, ...this.categoriesCache];
  }

  async addCategory(category: Category): Promise<Category> {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'ajout');
      }

      const createdCategory = await response.json();
      await this.refreshCache();
      this.notifyDataUpdate();
      return createdCategory;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      throw error;
    }
  }

  async deleteCategory(value: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/categories/${value}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      await this.refreshCache();
      this.notifyDataUpdate();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }

  // Farms
  async getFarms(): Promise<Farm[]> {
    await this.refreshCache();
    return [{ value: 'all', label: 'Toutes les farms', country: '' }, ...this.farmsCache];
  }

  getFarmsSync(): Farm[] {
    return [{ value: 'all', label: 'Toutes les farms', country: '' }, ...this.farmsCache];
  }

  async addFarm(farm: Farm): Promise<Farm> {
    try {
      const response = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farm)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'ajout');
      }

      const createdFarm = await response.json();
      await this.refreshCache();
      this.notifyDataUpdate();
      return createdFarm;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la farm:', error);
      throw error;
    }
  }

  async deleteFarm(value: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/farms/${value}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      await this.refreshCache();
      this.notifyDataUpdate();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la farm:', error);
      throw error;
    }
  }

  // Configuration
  async getConfig(): Promise<ShopConfig> {
    await this.refreshCache();
    return this.configCache || this.getFallbackConfig();
  }

  getConfigSync(): ShopConfig {
    return this.configCache || this.getFallbackConfig();
  }

  async updateConfig(updates: Partial<ShopConfig>): Promise<ShopConfig> {
    try {
      // Essayer l'API d'abord
      try {
        const response = await fetch('/api/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });

        if (response.ok) {
          const updatedConfig = await response.json();
          await this.refreshCache();
          this.notifyConfigUpdate();
          return updatedConfig;
        }
      } catch (apiError) {
        console.log('⚠️ API config non disponible, utilisation cache local');
      }

      // Fallback : mise à jour du cache local
      const currentConfig = this.configCache || this.getFallbackConfig();
      const updatedConfig = { ...currentConfig, ...updates };
      
      // Mettre à jour le cache
      this.configCache = updatedConfig;
      
      // Sauvegarder dans localStorage pour persistance
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('bipcosa06_config', JSON.stringify(updatedConfig));
          console.log('💾 Configuration sauvegardée dans localStorage');
        } catch (storageError) {
          console.error('❌ Erreur localStorage:', storageError);
        }
      }

      // Notifier la mise à jour
      this.notifyConfigUpdate();
      console.log('✅ Configuration mise à jour (cache local):', updates);
      
      return updatedConfig;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la config:', error);
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
    this.cacheTimestamp = 0; // Force la mise à jour des données principales
    this.infoCacheTimestamp = 0; // Force la mise à jour du contenu Info
    this.contactCacheTimestamp = 0; // Force la mise à jour du contenu Contact
    await this.refreshCache();
    this.loadContentFromStorage(); // Recharger les contenus depuis localStorage
    this.notifyDataUpdate(); // Notifier tous les composants
  }

  // Méthode pour synchroniser instantanément
  forceSyncContent(): void {
    this.loadContentFromStorage();
    this.notifyDataUpdate();
    console.log('🔄 Synchronisation forcée des contenus Info/Contact');
  }

  // === GESTION DES CATÉGORIES ===
  private loadCategoriesFromStorage(): Category[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bipcosa06_categories');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('❌ Erreur chargement catégories:', error);
        return [];
      }
    }
    return [];
  }

  private saveCategoriestoStorage(categories: Category[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bipcosa06_categories', JSON.stringify(categories));
        console.log('💾 Catégories sauvegardées');
      } catch (error) {
        console.error('❌ Erreur sauvegarde catégories:', error);
      }
    }
  }

  addCategory(category: Omit<Category, 'value'>): Category {
    const newCategory: Category = {
      value: category.label.toLowerCase().replace(/\s+/g, '_'),
      ...category
    };

    const categories = this.getStaticCategories();
    categories.push(newCategory);
    this.categoriesCache = categories;
    this.saveCategoriestoStorage(categories);
    this.notifyDataUpdate();
    
    console.log('✅ Catégorie ajoutée:', newCategory);
    return newCategory;
  }

  updateCategory(value: string, updates: Partial<Category>): Category | null {
    const categories = this.getStaticCategories();
    const index = categories.findIndex(cat => cat.value === value);
    
    if (index === -1) return null;
    
    categories[index] = { ...categories[index], ...updates };
    this.categoriesCache = categories;
    this.saveCategoriestoStorage(categories);
    this.notifyDataUpdate();
    
    console.log('✅ Catégorie modifiée:', categories[index]);
    return categories[index];
  }

  deleteCategory(value: string): boolean {
    if (value === 'all') return false; // Ne pas supprimer "Toutes catégories"
    
    const categories = this.getStaticCategories();
    const filteredCategories = categories.filter(cat => cat.value !== value);
    
    if (filteredCategories.length === categories.length) return false;
    
    this.categoriesCache = filteredCategories;
    this.saveCategoriestoStorage(filteredCategories);
    this.notifyDataUpdate();
    
    console.log('✅ Catégorie supprimée:', value);
    return true;
  }

  // === GESTION DES FERMES ===
  private loadFarmsFromStorage(): Farm[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bipcosa06_farms');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('❌ Erreur chargement fermes:', error);
        return [];
      }
    }
    return [];
  }

  private saveFarmsToStorage(farms: Farm[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bipcosa06_farms', JSON.stringify(farms));
        console.log('💾 Fermes sauvegardées');
      } catch (error) {
        console.error('❌ Erreur sauvegarde fermes:', error);
      }
    }
  }

  addFarm(farm: Omit<Farm, 'value'>): Farm {
    const newFarm: Farm = {
      value: farm.label.toLowerCase().replace(/\s+/g, '_'),
      ...farm
    };

    const farms = this.getStaticFarms();
    farms.push(newFarm);
    this.farmsCache = farms;
    this.saveFarmsToStorage(farms);
    this.notifyDataUpdate();
    
    console.log('✅ Ferme ajoutée:', newFarm);
    return newFarm;
  }

  updateFarm(value: string, updates: Partial<Farm>): Farm | null {
    const farms = this.getStaticFarms();
    const index = farms.findIndex(farm => farm.value === value);
    
    if (index === -1) return null;
    
    farms[index] = { ...farms[index], ...updates };
    this.farmsCache = farms;
    this.saveFarmsToStorage(farms);
    this.notifyDataUpdate();
    
    console.log('✅ Ferme modifiée:', farms[index]);
    return farms[index];
  }

  deleteFarm(value: string): boolean {
    if (value === 'all') return false; // Ne pas supprimer "Toutes fermes"
    
    const farms = this.getStaticFarms();
    const filteredFarms = farms.filter(farm => farm.value !== value);
    
    if (filteredFarms.length === farms.length) return false;
    
    this.farmsCache = filteredFarms;
    this.saveFarmsToStorage(filteredFarms);
    this.notifyDataUpdate();
    
    console.log('✅ Ferme supprimée:', value);
    return true;
  }
}

// Singleton instance
export const dataService = DataService.getInstance();
export default dataService;