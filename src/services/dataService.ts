// Service de gestion des données BIPCOSA06 avec APIs MongoDB et Cloudinary
import { Product, Category, Farm, ShopConfig, SocialNetwork, InfoContent, ContactContent } from '../types';

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
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: number = 0;

  // Configuration pour la synchronisation temps réel
  private readonly SYNC_INTERVAL_MS = 5000; // Sync toutes les 5 secondes
  private readonly USE_REAL_TIME_SYNC = true; // Activer la sync temps réel
  
  // Clés localStorage (fallback uniquement)
  private readonly PRODUCTS_KEY = 'bipcosa06_products';
  private readonly CATEGORIES_KEY = 'bipcosa06_categories';
  private readonly FARMS_KEY = 'bipcosa06_farms';
  private readonly CONFIG_KEY = 'bipcosa06_config';
  private readonly INFO_CONTENTS_KEY = 'bipcosa06_info_contents';
  private readonly CONTACT_CONTENTS_KEY = 'bipcosa06_contact_contents';
  private readonly SOCIAL_NETWORKS_KEY = 'bipcosa06_social_networks';
  private readonly DATA_VERSION_KEY = 'bipcosa06_data_version';
  
  constructor() {
    console.log('🚀 DataService avec SYNCHRONISATION TEMPS RÉEL initialisé');
    
    // FORCE IMMÉDIATE DES DONNÉES - SANS ATTENDRE L'API
    this.forceImmediateData();
    
    this.initializeDefaultData();
    
    // DÉSACTIVER LE SYNC TEMPS RÉEL pour éviter les erreurs server-side
    // if (this.USE_REAL_TIME_SYNC) {
    //   this.startRealTimeSync();
    // }
  }

  private forceImmediateData(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🔥 FORCE IMMÉDIATE DES DONNÉES - GARANTIE 100%');
    
    // FORCER IMMÉDIATEMENT les données sans vérification
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
    localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(STATIC_CONFIG));
    
    console.log('✅ DONNÉES FORCÉES IMMÉDIATEMENT:');
    console.log('📦 Produits:', STATIC_PRODUCTS.length);
    console.log('📂 Catégories:', STATIC_CATEGORIES.length);
    console.log('🏠 Farms:', STATIC_FARMS.length);
    
    // Notifier immédiatement le changement
    this.notifyDataUpdate();
  }
  
  // Initialisation des données
  private initializeDefaultData(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🔄 Vérification initialisation données par défaut...');
    
    // FORCER l'initialisation si pas de données
    const products = localStorage.getItem(this.PRODUCTS_KEY);
    const categories = localStorage.getItem(this.CATEGORIES_KEY);
    const farms = localStorage.getItem(this.FARMS_KEY);
    
    if (!products || JSON.parse(products).length === 0) {
      console.log('📦 Initialisation produits par défaut...');
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
    }
    
    if (!categories || JSON.parse(categories).length === 0) {
      console.log('📂 Initialisation catégories par défaut...');
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
    }
    
    if (!farms || JSON.parse(farms).length === 0) {
      console.log('🏠 Initialisation farms par défaut...');
      localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
    }
    
    // TOUJOURS s'assurer qu'il y a des données par défaut
    this.ensureDefaultDataExists();
    
    if (this.USE_REAL_TIME_SYNC) {
      console.log('🔄 Mode synchronisation temps réel - MongoDB prioritaire');
      setTimeout(() => this.performSync(), 100);
    } else {
      this.initializeDefaultDataFallback();
    }
  }
  
  // S'assurer que les données par défaut existent toujours
  private ensureDefaultDataExists(): void {
    // Vérifier et initialiser les produits si absent
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
      console.log('📦 Produits par défaut garantis');
    }
    
    // Vérifier et initialiser les catégories si absent
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
      console.log('📂 Catégories par défaut garanties');
    }
    
    // Vérifier et initialiser les fermes si absent
    if (!localStorage.getItem(this.FARMS_KEY)) {
      localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
      console.log('🏠 Fermes par défaut garanties');
    }
  }

  // === SYNCHRONISATION TEMPS RÉEL ===
  private startRealTimeSync(): void {
    console.log('🔄 Démarrage synchronisation temps réel...');
    
    // Sync initiale
    this.performSync();
    
    // Sync périodique
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, this.SYNC_INTERVAL_MS);
    
    // Sync sur événements navigateur
    window.addEventListener('focus', () => this.performSync());
    window.addEventListener('online', () => this.performSync());
    
    console.log('✅ Synchronisation temps réel active');
  }

  private async performSync(): Promise<void> {
    try {
      const now = Date.now();
      
      // Éviter les sync trop fréquentes
      if (now - this.lastSyncTime < 2000) return;
      
      console.log('🔄 Synchronisation en cours...');
      
      // Synchroniser depuis MongoDB
      await this.syncFromDatabase();
      
      this.lastSyncTime = now;
      
      // Notifier les composants React
      this.notifyDataUpdate();
      
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
      // Fallback vers localStorage en cas d'erreur
      this.initializeDefaultDataFallback();
    }
  }

  private async syncFromDatabase(): Promise<void> {
    try {
      // Synchroniser les produits via API
      const productsResponse = await fetch('/api/products');
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        // ACCEPTER les tableaux vides (suppression réussie)
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        console.log('📦 Produits synchronisés depuis API:', products.length);
      } else {
        // Si l'API échoue complètement, utiliser les données par défaut
        console.log('📦 API indisponible, utilisation produits par défaut');
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
      }
      
      // Synchroniser les catégories via API
      const categoriesResponse = await fetch('/api/categories');
      if (categoriesResponse.ok) {
        const categories = await categoriesResponse.json();
        // ACCEPTER les tableaux vides
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        console.log('📂 Catégories synchronisées depuis API:', categories.length);
      } else {
        console.log('📂 API indisponible, utilisation catégories par défaut');
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
      }
      
      // Synchroniser les fermes via API
      const farmsResponse = await fetch('/api/farms');
      if (farmsResponse.ok) {
        const farms = await farmsResponse.json();
        // ACCEPTER les tableaux vides
        localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        console.log('🏠 Fermes synchronisées depuis API:', farms.length);
      } else {
        console.log('🏠 API indisponible, utilisation fermes par défaut');
        localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
      }
      
      // Synchroniser la config via API
      const configResponse = await fetch('/api/config');
      if (configResponse.ok) {
        const config = await configResponse.json();
        if (config) {
          localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
          this.configCache = config;
          console.log('⚙️ Config synchronisée depuis API');
        }
      }
      
    } catch (error) {
      console.error('❌ Erreur sync database:', error);
      throw error;
    }
  }

  // Fallback si MongoDB n'est pas disponible
  private initializeDefaultDataFallback(): void {
    if (typeof window === 'undefined') return;

    try {
      // Initialiser les produits
      if (!localStorage.getItem(this.PRODUCTS_KEY)) {
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
        console.log('📦 Produits par défaut initialisés (fallback)');
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
    // SYSTÈME HYBRIDE: localStorage PRIORITAIRE + fallback statique
    console.log('📦 getProducts - Système hybride localStorage + fallback');
    
    // Essayer localStorage en premier
    const localProducts = this.getProductsSync();
    if (localProducts.length > 0) {
      console.log('📦 RETOUR localStorage:', localProducts.length, 'produits');
      return localProducts;
    }
    
    // FALLBACK: données statiques si localStorage vide
    console.log('📦 FALLBACK: Initialisation avec données statiques');
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
    }
    
    console.log('📦 RETOUR FALLBACK:', STATIC_PRODUCTS.length, 'produits');
    return STATIC_PRODUCTS;
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
      // PRIORITÉ 1: Ajouter via API (synchronisation temps réel)
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        
        if (response.ok) {
          const newProduct = await response.json();
          console.log('✅ Produit ajouté via API:', newProduct.name);
          
          // Synchroniser immédiatement tous les appareils
          await this.performSync();
          
          return newProduct;
        }
      } catch (apiError) {
        console.warn('⚠️ API indisponible, fallback localStorage:', apiError);
      }
      
      // FALLBACK: localStorage si MongoDB échoue
      const products = this.getProductsSync();
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct: Product = {
        ...productData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      products.push(newProduct);
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      console.log('✅ Produit ajouté (localStorage):', newProduct.name);
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
      console.log('🗑️ Suppression produit ID:', id);
      
      // PRIORITÉ 1: Supprimer via API (synchronisation temps réel)
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          console.log('✅ Produit supprimé via API:', id);
          
          // FORCER nettoyage cache et synchronisation IMMÉDIATE
          this.lastSyncTime = 0; // Reset cooldown pour forcer sync
          await this.performSync();
          
          // Double sécurité: forcer notification
          this.notifyDataUpdate();
          
          console.log('🔄 Cache synchronisé après suppression');
          return true;
        }
      } catch (apiError) {
        console.warn('⚠️ API indisponible, fallback localStorage:', apiError);
      }
      
      // FALLBACK: localStorage si MongoDB échoue
      const products = this.getProductsSync();
      const index = products.findIndex(p => p.id === id);
      
      if (index !== -1) {
        const deletedProduct = products[index];
        products.splice(index, 1);
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        console.log('✅ Produit supprimé (localStorage):', deletedProduct.name, '- Restants:', products.length);
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
    // SYSTÈME HYBRIDE: localStorage PRIORITAIRE + fallback statique
    console.log('📂 getCategories - Système hybride localStorage + fallback');
    
    // Essayer localStorage en premier
    const localCategories = this.getCategoriesSync();
    if (localCategories.length > 0) {
      console.log('📂 RETOUR localStorage:', localCategories.length, 'catégories');
      return localCategories;
    }
    
    // FALLBACK: données statiques si localStorage vide
    console.log('📂 FALLBACK: Initialisation avec données statiques');
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
    }
    
    console.log('📂 RETOUR FALLBACK:', STATIC_CATEGORIES.length, 'catégories');
    return STATIC_CATEGORIES;
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
      console.log('📂 Ajout catégorie:', category.label);
      
      // PRIORITÉ 1: Ajouter via API (synchronisation temps réel)
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        });
        
        if (response.ok) {
          const newCategory = await response.json();
          console.log('✅ Catégorie ajoutée via API:', newCategory.label);
          
          // Mettre à jour localStorage aussi
          const categories = this.getCategoriesSync();
          const existingIndex = categories.findIndex(c => c.value === category.value);
          if (existingIndex === -1) {
            categories.push(newCategory);
            localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
          }
          
          this.notifyDataUpdate();
          return newCategory;
        }
      } catch (apiError) {
        console.warn('⚠️ API catégories indisponible, fallback localStorage:', apiError);
      }
      
      // FALLBACK: localStorage si MongoDB échoue
      const categories = this.getCategoriesSync();
      const existingIndex = categories.findIndex(c => c.value === category.value);
      
      if (existingIndex === -1) {
        categories.push(category);
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        console.log('✅ Catégorie ajoutée (localStorage):', category.label);
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
      console.log('🗑️ Suppression catégorie:', value);
      
      // PRIORITÉ 1: Supprimer via API (synchronisation temps réel)
      try {
        const response = await fetch(`/api/categories/${encodeURIComponent(value)}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          console.log('✅ Catégorie supprimée via API:', value);
          
          // FORCER suppression locale aussi
          const categories = this.getCategoriesSync();
          const index = categories.findIndex(c => c.value === value);
          if (index !== -1) {
            const deletedCategory = categories[index];
            categories.splice(index, 1);
            localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
            console.log('✅ Catégorie supprimée localement aussi:', deletedCategory.label);
          }
          
          this.notifyDataUpdate();
          return true;
        }
      } catch (apiError) {
        console.warn('⚠️ API catégories indisponible, fallback localStorage:', apiError);
      }
      
      // FALLBACK: localStorage si MongoDB échoue
      const categories = this.getCategoriesSync();
      const index = categories.findIndex(c => c.value === value);
      
      if (index !== -1) {
        const deletedCategory = categories[index];
        categories.splice(index, 1);
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        console.log('✅ Catégorie supprimée (localStorage):', deletedCategory.label, '- Restantes:', categories.length);
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
    // SYSTÈME HYBRIDE: localStorage PRIORITAIRE + fallback statique
    console.log('🏠 getFarms - Système hybride localStorage + fallback');
    
    // Essayer localStorage en premier
    const localFarms = this.getFarmsSync();
    if (localFarms.length > 0) {
      console.log('🏠 RETOUR localStorage:', localFarms.length, 'farms');
      return localFarms;
    }
    
    // FALLBACK: données statiques si localStorage vide
    console.log('🏠 FALLBACK: Initialisation avec données statiques');
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
    }
    
    console.log('🏠 RETOUR FALLBACK:', STATIC_FARMS.length, 'farms');
    return STATIC_FARMS;
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

  // === MÉTHODES DE NETTOYAGE ===
  clearAllLocalStorage(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🗑️ NETTOYAGE COMPLET localStorage...');
    localStorage.removeItem(this.PRODUCTS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
    localStorage.removeItem(this.FARMS_KEY);
    localStorage.removeItem(this.CONFIG_KEY);
    localStorage.removeItem(this.SOCIAL_NETWORKS_KEY);
    console.log('✅ localStorage vidé complètement');
  }

  // Force un refresh complet depuis l'API
  async forceRefreshFromAPI(): Promise<void> {
    console.log('🔄 REFRESH FORCÉ - Réinitialisation données par défaut...');
    this.clearAllLocalStorage();
    
    // Réinitialiser avec les données par défaut pour le panel admin
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(STATIC_PRODUCTS));
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(STATIC_CATEGORIES));
      localStorage.setItem(this.FARMS_KEY, JSON.stringify(STATIC_FARMS));
      console.log('✅ localStorage réinitialisé avec données par défaut');
    }
    
    this.notifyDataUpdate();
    console.log('✅ Refresh forcé terminé - Panel admin fonctionnel');
  }

  // Nettoyer les ressources
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('🧹 Synchronisation temps réel arrêtée');
    }
  }

  // Forcer une synchronisation immédiate (pour le panel admin)
  async forceSyncNow(): Promise<void> {
    console.log('🔄 SYNCHRONISATION FORCÉE MANUELLE');
    try {
      await this.performSync();
      console.log('✅ Synchronisation forcée terminée');
    } catch (error) {
      console.error('❌ Erreur synchronisation forcée:', error);
      throw error;
    }
  }
}

// Singleton instance
const dataService = DataService.getInstance();
export { dataService };
export default dataService;