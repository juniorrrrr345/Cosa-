// Service de gestion des données BIPCOSA06
export interface Product {
  id: number;
  name: string;
  quality: string;
  image: string;
  flagColor: string;
  flagText: string;
  category: string;
  farm: string;
  description: string;
  prices: Array<{ weight: string; price: string }>;
  video?: string;
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

export interface ShopConfig {
  backgroundType: 'gradient' | 'image';
  backgroundColor: string;
  backgroundImage?: string;
  shopName: string;
  description: string;
}

class DataService {
  private static instance: DataService;
  private products: Product[] = [];
  private categories: Category[] = [];
  private farms: Farm[] = [];
  private lastUpdate: number = 0;
  private config: ShopConfig = {
    backgroundType: 'gradient',
    backgroundColor: '#000000',
    shopName: 'BIPCOSA06',
    description: 'Boutique Cannabis Premium'
  };

  private constructor() {
    this.loadFromLocalStorage();
    this.initializeData();
  }

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private initializeData() {
    // Initialiser les catégories
    this.categories = [
      { value: 'all', label: 'Toutes les catégories' },
      { value: 'indica', label: 'Indica' },
      { value: 'sativa', label: 'Sativa' },
      { value: 'hybrid', label: 'Hybride' }
    ];

    // Initialiser les farms
    this.farms = [
      { value: 'all', label: 'Toutes les farms', country: '' },
      { value: 'holland', label: 'Holland', country: '🇳🇱' },
      { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
      { value: 'calispain', label: 'Calispain', country: '🇺🇸🇪🇸' },
      { value: 'premium', label: 'Premium', country: '⭐' }
    ];

    // Initialiser les produits
    this.products = [
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
          { weight: "1g", price: "12€" },
          { weight: "3.5g", price: "40€" },
          { weight: "7g", price: "75€" },
          { weight: "14g", price: "140€" },
          { weight: "28g", price: "260€" }
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
          { weight: "1g", price: "10€" },
          { weight: "3.5g", price: "32€" },
          { weight: "7g", price: "60€" },
          { weight: "14g", price: "110€" },
          { weight: "28g", price: "200€" }
        ],
        video: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        id: 3,
        name: "NINE LIONS",
        quality: "Qualité A+++",
        image: "https://images.unsplash.com/photo-1574899420662-b4f36025552a?w=400&h=300&fit=crop&crop=center",
        flagColor: "#333333",
        flagText: "🇺🇸🇪🇸 CALISPAIN",
        category: "hybrid",
        farm: "calispain",
        description: "Hybride équilibré de Californie et d'Espagne. Combinaison parfaite d'euphorie et de relaxation.",
        prices: [
          { weight: "1g", price: "15€" },
          { weight: "3.5g", price: "50€" },
          { weight: "7g", price: "95€" },
          { weight: "14g", price: "180€" },
          { weight: "28g", price: "340€" }
        ],
        video: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        id: 4,
        name: "BUBBLEGUM GELATO",
        quality: "Qualité Premium",
        image: "https://images.unsplash.com/photo-1545139813-4e3e9ac2dbb2?w=400&h=300&fit=crop&crop=center",
        flagColor: "#333333",
        flagText: "PREMIUM",
        category: "hybrid",
        farm: "premium",
        description: "Variété premium avec des saveurs de bubble-gum et gelato. Expérience gustative unique et effets équilibrés.",
        prices: [
          { weight: "1g", price: "18€" },
          { weight: "3.5g", price: "60€" },
          { weight: "7g", price: "110€" },
          { weight: "14g", price: "200€" },
          { weight: "28g", price: "380€" }
        ],
        video: "https://www.w3schools.com/html/mov_bbb.mp4"
      }
    ];
  }

  // Getters with intelligent refresh
  getProducts(): Product[] {
    // Only reload if data seems stale (more than 1 second old)
    const lastUpdate = this.getLastUpdateTime();
    if (Date.now() - lastUpdate > 1000) {
      this.loadFromLocalStorage();
    }
    return [...this.products];
  }

  getCategories(): Category[] {
    // Only reload if data seems stale
    const lastUpdate = this.getLastUpdateTime();
    if (Date.now() - lastUpdate > 1000) {
      this.loadFromLocalStorage();
    }
    return [...this.categories];
  }

  getFarms(): Farm[] {
    // Only reload if data seems stale
    const lastUpdate = this.getLastUpdateTime();
    if (Date.now() - lastUpdate > 1000) {
      this.loadFromLocalStorage();
    }
    return [...this.farms];
  }

  getConfig(): ShopConfig {
    // Only reload if data seems stale
    const lastUpdate = this.getLastUpdateTime();
    if (Date.now() - lastUpdate > 1000) {
      this.loadFromLocalStorage();
    }
    return { ...this.config };
  }

  // Products management
  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct = {
      ...product,
      id: Math.max(...this.products.map(p => p.id), 0) + 1
    };
    this.products.push(newProduct);
    this.saveToLocalStorage();
    this.notifyDataUpdate();
    return newProduct;
  }

  updateProduct(id: number, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = { ...this.products[index], ...updates };
    this.saveToLocalStorage();
    this.notifyDataUpdate();
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    this.saveToLocalStorage();
    this.notifyDataUpdate();
    return true;
  }

  // Categories management
  addCategory(category: Category): void {
    if (!this.categories.find(c => c.value === category.value)) {
      this.categories.push(category);
    }
  }

  updateCategory(oldValue: string, newCategory: Category): boolean {
    const index = this.categories.findIndex(c => c.value === oldValue);
    if (index === -1) return false;
    
    this.categories[index] = newCategory;
    return true;
  }

  deleteCategory(value: string): boolean {
    if (value === 'all') return false; // Can't delete "all"
    
    const index = this.categories.findIndex(c => c.value === value);
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }

  // Farms management
  addFarm(farm: Farm): void {
    if (!this.farms.find(f => f.value === farm.value)) {
      this.farms.push(farm);
    }
  }

  updateFarm(oldValue: string, newFarm: Farm): boolean {
    const index = this.farms.findIndex(f => f.value === oldValue);
    if (index === -1) return false;
    
    this.farms[index] = newFarm;
    return true;
  }

  deleteFarm(value: string): boolean {
    if (value === 'all') return false; // Can't delete "all"
    
    const index = this.farms.findIndex(f => f.value === value);
    if (index === -1) return false;
    
    this.farms.splice(index, 1);
    return true;
  }

  // Config management
  updateConfig(newConfig: Partial<ShopConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveToLocalStorage();
    this.notifyConfigUpdate();
  }

  // Force global sync
  forceSync(): void {
    this.loadFromLocalStorage();
    this.notifyDataUpdate();
    this.notifyConfigUpdate();
  }

  // Get last update timestamp
  private getLastUpdateTime(): number {
    return this.lastUpdate;
  }

  // Update timestamp
  private updateTimestamp(): void {
    this.lastUpdate = Date.now();
  }

  // Notification system for real-time sync
  private notifyDataUpdate(): void {
    if (typeof window !== 'undefined') {
      // Force immediate sync with small delay to ensure all operations complete
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { 
            timestamp: Date.now(),
            products: this.products.length,
            source: 'dataService'
          }
        }));
        console.log('🔄 Data update notification sent:', this.products.length, 'products');
      }, 100);
    }
  }

  private notifyConfigUpdate(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('configUpdated', { 
          detail: { 
            config: this.config, 
            timestamp: Date.now(),
            source: 'dataService'
          }
        }));
        console.log('🔄 Config update notification sent');
      }, 100);
    }
  }

  // Persistance localStorage
  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      this.updateTimestamp();
      const data = {
        products: this.products,
        categories: this.categories,
        farms: this.farms,
        config: this.config,
        timestamp: this.lastUpdate
      };
      localStorage.setItem('bipcosa06-data', JSON.stringify(data));
      console.log('💾 Données sauvegardées dans localStorage:', data.products.length, 'produits');
    }
  }

  private loadFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bipcosa06-data');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.products) {
            this.products = data.products;
            console.log('📦 Products loaded from localStorage:', this.products.length);
          }
          if (data.categories) this.categories = data.categories;
          if (data.farms) this.farms = data.farms;
          if (data.config) this.config = data.config;
          if (data.timestamp) this.lastUpdate = data.timestamp;
        } catch (error) {
          console.warn('Erreur chargement données localStorage:', error);
        }
      }
    }
  }
}

export const dataService = DataService.getInstance();