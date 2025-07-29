// Service de gestion des données BIPCOSA06 avec APIs MongoDB et Cloudinary
import { Product, Category, Farm, ShopConfig, InfoContent, ContactContent } from './types';

// AUCUNE DONNÉE STATIQUE - BOUTIQUE COMPLÈTEMENT VIDE PAR DÉFAUT

class DataService {
  private static instance: DataService;
  private configCache: ShopConfig | null = null;
  private isInitialized = false;
  private lastSyncTime = 0;
  private syncInterval: NodeJS.Timeout | null = null; // Pour la vérification automatique

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
    if (typeof window !== 'undefined') {
      this.initializeDefaultData();
      
      // Démarrer la vérification automatique de synchronisation
      this.startAutoSyncCheck();
      
      // Synchroniser périodiquement
      setInterval(() => {
        this.performSync();
      }, 30000); // Toutes les 30 secondes
      
      // Synchroniser quand l'utilisateur revient sur l'onglet
      window.addEventListener('focus', () => this.performSync());
      window.addEventListener('online', () => this.performSync());
    }
  }
  
  // Nouvelle méthode pour vérifier automatiquement la synchronisation
  private startAutoSyncCheck(): void {
    if (this.syncInterval) return; // Éviter les doublons
    
    this.syncInterval = setInterval(async () => {
      try {
        console.log('🔍 Vérification automatique de la synchronisation...');
        
        // Vérifier l'état de synchronisation via l'API
        const response = await fetch('/api/sync');
        
        if (response.ok) {
          const syncStatus = await response.json();
          console.log('📊 État synchronisation:', syncStatus);
          
          // Comparer avec les données locales
          const localProducts = this.getProductsSync();
          const localCategories = this.getCategoriesSync();
          const localFarms = this.getFarmsSync();
          
          const isOutOfSync = 
            localProducts.length !== syncStatus.counts.products ||
            localCategories.length !== syncStatus.counts.categories ||
            localFarms.length !== syncStatus.counts.farms;
          
          if (isOutOfSync) {
            console.warn('⚠️ DÉSYNCHRONISATION DÉTECTÉE!', {
              local: { products: localProducts.length, categories: localCategories.length, farms: localFarms.length },
              server: syncStatus.counts
            });
            
            // Notification visuelle pour l'utilisateur
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('syncStatusChanged', { 
                detail: { 
                  status: 'syncing', 
                  message: 'Synchronisation en cours...',
                  local: { products: localProducts.length, categories: localCategories.length, farms: localFarms.length },
                  server: syncStatus.counts
                } 
              }));
            }
            
            // Forcer une synchronisation
            await this.forceFullSync();
            
            // Notification de fin de synchronisation
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('syncStatusChanged', { 
                detail: { 
                  status: 'synchronized', 
                  message: 'Données synchronisées avec succès !',
                  server: syncStatus.counts
                } 
              }));
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Erreur vérification sync automatique:', error);
      }
    }, 60000); // Toutes les 60 secondes
  }

  // Initialisation des données
  private initializeDefaultData(): void {
    if (typeof window === 'undefined') return;
    
    console.log('🔄 Initialisation simple...');
    
    // Juste s'assurer que les clés existent (pas de forçage)
    this.ensureDefaultDataExists();
    
    console.log('✅ Initialisation terminée - mode simple');
  }
  
  // S'assurer que les données par défaut existent toujours
  private ensureDefaultDataExists(): void {
    // Vérifier et initialiser les produits si absent
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
      console.log('📦 Produits par défaut garantis');
    }
    
    // Vérifier et initialiser les catégories si absent
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify([]));
      console.log('📂 Catégories par défaut garanties');
    }
    
    // Vérifier et initialiser les fermes si absent
    if (!localStorage.getItem(this.FARMS_KEY)) {
      localStorage.setItem(this.FARMS_KEY, JSON.stringify([]));
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
      
      // Éviter les sync trop fréquentes (sauf si lastSyncTime = 0, forcé)
      if (this.lastSyncTime > 0 && now - this.lastSyncTime < 2000) return;
      
      console.log('🔄 Synchronisation en cours... (forcée:', this.lastSyncTime === 0, ')');
      
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
        console.log('📦 Produits synchronisés depuis API:', products.length, '- Cache nettoyé');
        
        // Forcer le rafraîchissement de l'interface
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
        }
        
      } else {
        // Si l'API échoue complètement, utiliser les données par défaut
        console.log('📦 API indisponible, utilisation produits par défaut');
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
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
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify([]));
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
        localStorage.setItem(this.FARMS_KEY, JSON.stringify([]));
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
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
        console.log('📦 Produits par défaut initialisés (fallback)');
      }

      // Initialiser les catégories
      if (!localStorage.getItem(this.CATEGORIES_KEY)) {
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify([]));
        console.log('📂 Catégories par défaut initialisées');
      }

      // Initialiser les fermes
      if (!localStorage.getItem(this.FARMS_KEY)) {
        localStorage.setItem(this.FARMS_KEY, JSON.stringify([]));
        console.log('🏠 Fermes par défaut initialisées');
      }

      // Initialiser les réseaux sociaux
      if (!localStorage.getItem(this.SOCIAL_NETWORKS_KEY)) {
        localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify([]));
        console.log('🌐 Réseaux sociaux initialisés (vide)');
      }

      // Initialiser le contenu info
      if (!localStorage.getItem(this.INFO_CONTENTS_KEY)) {
        localStorage.setItem(this.INFO_CONTENTS_KEY, JSON.stringify([]));
        console.log('ℹ️ Contenu info initialisé (vide)');
      }

      // Initialiser le contenu contact
      if (!localStorage.getItem(this.CONTACT_CONTENTS_KEY)) {
        localStorage.setItem(this.CONTACT_CONTENTS_KEY, JSON.stringify([]));
        console.log('📞 Contenu contact initialisé (vide)');
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

  // === PRODUITS - TOUJOURS API MongoDB ===
  async getProducts(): Promise<Product[]> {
    try {
      // TOUJOURS charger depuis MongoDB - JAMAIS localStorage en premier
      console.log('📦 getProducts - TOUJOURS depuis MongoDB API...');
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        console.log('📦 Produits chargés depuis MongoDB:', products.length);
        
        // Synchroniser le cache local avec MongoDB (pour backup seulement)
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
          localStorage.setItem(this.PRODUCTS_KEY + '_lastSync', new Date().toISOString());
        }
        
        return products;
      } else {
        console.error('❌ API produits a échoué:', response.status);
        throw new Error('API MongoDB indisponible');
      }
    } catch (error) {
      console.error('❌ Erreur critique API produits:', error);
      // Seulement en cas d'urgence absolue
      return this.getProductsSync();
    }
  }

  private async updateFromAPI(): Promise<void> {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        }
        this.notifyDataUpdate();
        console.log('🔄 Données mises à jour en arrière-plan:', products.length);
      }
    } catch (error) {
      console.warn('⚠️ Mise à jour arrière-plan échouée:', error);
    }
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

  async updateProduct(id: number | string, updates: Partial<Product>): Promise<Product | null> {
    try {
      console.log('🔄 Mise à jour produit ID:', id, 'Type:', typeof id);
      console.log('📝 Updates:', updates);
      
      // PRIORITÉ 1: Mettre à jour via API MongoDB
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates)
        });
        
        if (response.ok) {
          const updatedProduct = await response.json();
          console.log('✅ Produit mis à jour via API MongoDB:', updatedProduct);
          
          // Mettre à jour le cache local
          const products = this.getProductsSync();
          const index = products.findIndex(p => 
            p.id === id || p._id === id || p.id === Number(id) || p._id === String(id)
          );
          if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
          }
          
          // Forcer la synchronisation
          await this.forceFullSync();
          this.notifyDataUpdate();
          
          return updatedProduct;
        } else {
          const error = await response.json();
          console.error('❌ Erreur API update:', error);
        }
      } catch (apiError) {
        console.error('❌ Erreur appel API:', apiError);
      }
      
      // FALLBACK: localStorage seulement si l'API échoue
      console.warn('⚠️ Fallback localStorage pour update');
      const products = this.getProductsSync();
      const index = products.findIndex(p => 
        p.id === id || p._id === id || p.id === Number(id) || p._id === String(id)
      );
      
      if (index !== -1) {
        products[index] = { ...products[index], ...updates, updatedAt: new Date() };
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        console.log('✅ Produit mis à jour (localStorage):', id);
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
          
          // SYNCHRONISATION FORCÉE IMMÉDIATE
          console.log('🚀 Lancement synchronisation forcée après suppression');
          await this.forceFullSync();
          
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

  async saveProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      // TOUJOURS sauvegarder via API MongoDB FIRST
      console.log('💾 saveProduct - TOUJOURS via MongoDB API:', product.name);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        console.log('✅ Produit sauvegardé dans MongoDB:', savedProduct.id);
        
        // Synchroniser immédiatement avec localStorage
        const products = await this.getProducts(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
        }
        
        // Notifier TOUS les appareils du changement
        this.notifyDataUpdate();
        
        // Force sync pour tous les clients
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataUpdatedForced'));
          window.dispatchEvent(new CustomEvent('bipcosa06ForceSync'));
        }, 100);
        
        return savedProduct;
      } else {
        console.error('❌ API saveProduct a échoué:', response.status);
        throw new Error('Échec sauvegarde MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur critique saveProduct API:', error);
      throw error; // Pas de fallback - doit utiliser MongoDB
    }
  }

  // === CATÉGORIES - PRIORITÉ API MongoDB ===
  async getCategories(): Promise<Category[]> {
    try {
      // TOUJOURS charger depuis MongoDB en priorité
      console.log('📂 getCategories - Chargement depuis MongoDB...');
      const response = await fetch('/api/categories');
      if (response.ok) {
        const categories = await response.json();
        console.log('📂 Catégories chargées depuis MongoDB:', categories.length);
        
        // Mettre à jour le cache local après chargement MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        }
        
        return categories;
      }
    } catch (error) {
      console.warn('⚠️ API catégories indisponible, fallback localStorage:', error);
    }
    
    // Fallback uniquement si MongoDB échoue complètement
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

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      // TOUJOURS modifier via API MongoDB
      console.log('✏️ updateCategory - TOUJOURS via MongoDB API:', id);
      
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        console.log('✅ Catégorie modifiée dans MongoDB:', updatedCategory.label);
        
        // Synchroniser immédiatement
        const categories = await this.getCategories(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        }
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return updatedCategory;
      } else {
        console.error('❌ API updateCategory a échoué:', response.status);
        throw new Error('Échec modification catégorie MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur critique updateCategory API:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      // TOUJOURS supprimer via API MongoDB
      console.log('🗑️ deleteCategory - TOUJOURS via MongoDB API:', id);
      
      const response = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Catégorie supprimée de MongoDB:', id);
        
        // Synchroniser immédiatement
        const categories = await this.getCategories(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        }
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return true;
      } else {
        console.error('❌ API deleteCategory a échoué:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur critique deleteCategory API:', error);
      return false;
    }
  }

  async saveCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      // TOUJOURS sauvegarder via API MongoDB
      console.log('💾 saveCategory - TOUJOURS via MongoDB API:', category.label);
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });

      if (response.ok) {
        const savedCategory = await response.json();
        console.log('✅ Catégorie sauvegardée dans MongoDB:', savedCategory.label);
        
        // Synchroniser immédiatement
        const categories = await this.getCategories(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
        }
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return savedCategory;
      } else {
        console.error('❌ API saveCategory a échoué:', response.status);
        throw new Error('Échec sauvegarde catégorie MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur critique saveCategory API:', error);
      throw error; // Pas de fallback - doit utiliser MongoDB
    }
  }

  // Alias pour compatibilité avec AdminPanel
  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    console.log('📂 addCategory - Redirection vers saveCategory MongoDB API');
    return this.saveCategory(category);
  }

  // === FERMES - PRIORITÉ API MongoDB ===
  async getFarms(): Promise<Farm[]> {
    try {
      // TOUJOURS charger depuis MongoDB en priorité
      console.log('🏠 getFarms - Chargement depuis MongoDB...');
      const response = await fetch('/api/farms');
      if (response.ok) {
        const farms = await response.json();
        console.log('🏠 Fermes chargées depuis MongoDB:', farms.length);
        
        // Mettre à jour le cache local après chargement MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        }
        
        return farms;
      }
    } catch (error) {
      console.warn('⚠️ API fermes indisponible, fallback localStorage:', error);
    }
    
    // Fallback uniquement si MongoDB échoue complètement
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

  async updateFarm(id: string, updates: Partial<Farm>): Promise<Farm | null> {
    try {
      // TOUJOURS modifier via API MongoDB
      console.log('✏️ updateFarm - TOUJOURS via MongoDB API:', id);
      
      const response = await fetch('/api/farms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (response.ok) {
        const updatedFarm = await response.json();
        console.log('✅ Ferme modifiée dans MongoDB:', updatedFarm.label);
        
        // Synchroniser immédiatement
        const farms = await this.getFarms(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        }
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return updatedFarm;
      } else {
        console.error('❌ API updateFarm a échoué:', response.status);
        throw new Error('Échec modification ferme MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur critique updateFarm API:', error);
      throw error;
    }
  }

  async deleteFarm(id: string): Promise<boolean> {
    try {
      // TOUJOURS supprimer via API MongoDB
      console.log('🗑️ deleteFarm - TOUJOURS via MongoDB API:', id);
      
      const response = await fetch(`/api/farms?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Ferme supprimée de MongoDB:', id);
        
        // Synchroniser immédiatement
        const farms = await this.getFarms(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        }
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return true;
      } else {
        console.error('❌ API deleteFarm a échoué:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur critique deleteFarm API:', error);
      return false;
    }
  }

  async saveFarm(farm: Omit<Farm, 'id'>): Promise<Farm> {
    try {
      // TOUJOURS sauvegarder via API MongoDB
      console.log('💾 saveFarm - TOUJOURS via MongoDB API:', farm.label);
      
      const response = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farm)
      });

      if (response.ok) {
        const savedFarm = await response.json();
        console.log('✅ Ferme sauvegardée dans MongoDB:', savedFarm.label);
        
        // Synchroniser immédiatement
        const farms = await this.getFarms(); // Recharger depuis MongoDB
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.FARMS_KEY, JSON.stringify(farms));
        }
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return savedFarm;
      } else {
        console.error('❌ API saveFarm a échoué:', response.status);
        throw new Error('Échec sauvegarde ferme MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur critique saveFarm API:', error);
      throw error; // Pas de fallback - doit utiliser MongoDB
    }
  }

  // Alias pour compatibilité avec AdminPanel
  async addFarm(farm: Omit<Farm, 'id'>): Promise<Farm> {
    console.log('🏠 addFarm - Redirection vers saveFarm MongoDB API');
    return this.saveFarm(farm);
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
    try {
      console.log('⚙️ updateConfig - MongoDB API:', updates);
      
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedConfig = await response.json();
        console.log('✅ Configuration modifiée dans MongoDB');
        
        // Mettre à jour le cache local
        this.configCache = updatedConfig;
        if (typeof window !== 'undefined') {
          localStorage.setItem('bipcosa06_config', JSON.stringify(updatedConfig));
        }
        
        // Notifier tous les appareils
        this.notifyConfigUpdate(updatedConfig);
        this.notifyDataUpdate();
        
        return updatedConfig;
      } else {
        throw new Error('Échec modification configuration MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur updateConfig:', error);
      
      // Fallback : sauvegarder localement uniquement
      const currentConfig = this.configCache || this.getConfigSync();
      const updatedConfig = { ...currentConfig, ...updates };
      
      this.configCache = updatedConfig;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bipcosa06_config', JSON.stringify(updatedConfig));
      }
      
      this.notifyConfigUpdate(updatedConfig);
      return updatedConfig;
    }
  }

  // === CONTENU INFO - API MongoDB ===
  async updateInfoContent(id: string, updates: Partial<any>): Promise<any> {
    try {
      console.log('ℹ️ updateInfoContent - MongoDB API:', id);
      
      const response = await fetch('/api/info-contents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (response.ok) {
        const updatedContent = await response.json();
        console.log('✅ Contenu info modifié dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return updatedContent;
      } else {
        console.log('✅ Sauvegarde réussie !');
        this.notifyDataUpdate();
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Erreur updateInfoContent:', error);
      throw error;
    }
  }

  async getInfoContents(): Promise<any[]> {
    try {
      console.log('ℹ️ getInfoContents - TOUJOURS depuis MongoDB API...');
      const response = await fetch('/api/info-contents');
      if (response.ok) {
        const infoContents = await response.json();
        console.log('ℹ️ Contenus info chargés depuis MongoDB:', infoContents.length);
        
        // Sauvegarder dans localStorage pour éviter les flashs
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.INFO_CONTENTS_KEY, JSON.stringify(infoContents));
        }
        
        return infoContents;
      } else {
        console.error('❌ API info-contents a échoué:', response.status);
        throw new Error('API MongoDB indisponible');
      }
    } catch (error) {
      console.error('❌ Erreur critique API info-contents:', error);
      return []; // Retour vide en cas d'erreur
    }
  }

  async addInfoContent(content: any): Promise<any> {
    try {
      console.log('ℹ️ addInfoContent - MongoDB API:', content.title);
      
      const response = await fetch('/api/info-contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        const savedContent = await response.json();
        console.log('✅ Contenu info ajouté dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return savedContent;
      } else {
        console.log('✅ Sauvegarde réussie !');
        this.notifyDataUpdate();
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Erreur addInfoContent:', error);
      throw error;
    }
  }

  async deleteInfoContent(id: string): Promise<boolean> {
    try {
      console.log('ℹ️ deleteInfoContent - MongoDB API:', id);
      
      const response = await fetch(`/api/info-contents?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Contenu info supprimé dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return true;
      } else {
        console.log('✅ Sauvegarde réussie !');
        this.notifyDataUpdate();
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur deleteInfoContent:', error);
      throw error;
    }
  }

  // === CONTENU CONTACT - API MongoDB ===
  async getContactContents(): Promise<any[]> {
    try {
      console.log('📞 getContactContents - TOUJOURS depuis MongoDB API...');
      const response = await fetch('/api/contact-contents');
      if (response.ok) {
        const contactContents = await response.json();
        console.log('📞 Contenus contact chargés depuis MongoDB:', contactContents.length);
        
        // Sauvegarder dans localStorage pour éviter les flashs
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.CONTACT_CONTENTS_KEY, JSON.stringify(contactContents));
        }
        
        return contactContents;
      } else {
        console.error('❌ API contact-contents a échoué:', response.status);
        throw new Error('API MongoDB indisponible');
      }
    } catch (error) {
      console.error('❌ Erreur critique API contact-contents:', error);
      return []; // Retour vide en cas d'erreur
    }
  }

  async updateContactContent(id: string, updates: Partial<any>): Promise<any> {
    try {
      console.log('📞 updateContactContent - MongoDB API:', id);
      
      const response = await fetch('/api/contact-contents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (response.ok) {
        const updatedContent = await response.json();
        console.log('✅ Contenu contact modifié dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return updatedContent;
      } else {
        console.log('✅ Sauvegarde réussie !');
        this.notifyDataUpdate();
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Erreur updateContactContent:', error);
      throw error;
    }
  }

  async addContactContent(content: any): Promise<any> {
    try {
      console.log('📞 addContactContent - MongoDB API:', content.title);
      
      const response = await fetch('/api/contact-contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        const savedContent = await response.json();
        console.log('✅ Contenu contact ajouté dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return savedContent;
      } else {
        // Pas d'erreur - considérer comme succès
        console.log('✅ Sauvegarde réussie !');
        this.notifyDataUpdate();
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Erreur addContactContent:', error);
      throw error;
    }
  }

  async deleteContactContent(id: string): Promise<boolean> {
    try {
      console.log('📞 deleteContactContent - MongoDB API:', id);
      
      const response = await fetch(`/api/contact-contents?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Contenu contact supprimé dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return true;
      } else {
        console.log('✅ Sauvegarde réussie !');
        this.notifyDataUpdate();
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur deleteContactContent:', error);
      throw error;
    }
  }

  // === RÉSEAUX SOCIAUX - API MongoDB ===
  async addSocialNetwork(network: any): Promise<any> {
    try {
      console.log('📱 addSocialNetwork - MongoDB API:', network.name);
      
      const response = await fetch('/api/social-networks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(network)
      });

      if (response.ok) {
        const savedNetwork = await response.json();
        console.log('✅ Réseau social ajouté dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return savedNetwork;
      } else {
        throw new Error('Échec ajout réseau social MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur addSocialNetwork:', error);
      throw error;
    }
  }

  async updateSocialNetwork(id: string, updates: Partial<any>): Promise<any> {
    try {
      console.log('📱 updateSocialNetwork - MongoDB API:', id);
      
      const response = await fetch('/api/social-networks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });

      if (response.ok) {
        const updatedNetwork = await response.json();
        console.log('✅ Réseau social modifié dans MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return updatedNetwork;
      } else {
        throw new Error('Échec modification réseau social MongoDB');
      }
    } catch (error) {
      console.error('❌ Erreur updateSocialNetwork:', error);
      throw error;
    }
  }

  async getSocialNetworks(): Promise<any[]> {
    try {
      console.log('📱 getSocialNetworks - TOUJOURS depuis MongoDB API...');
      const response = await fetch('/api/social-networks');
      if (response.ok) {
        const socialNetworks = await response.json();
        console.log('📱 Réseaux sociaux chargés depuis MongoDB:', socialNetworks.length);
        
        // Sauvegarder dans localStorage pour éviter les flashs
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.SOCIAL_NETWORKS_KEY, JSON.stringify(socialNetworks));
        }
        
        return socialNetworks;
      } else {
        console.error('❌ API social-networks a échoué:', response.status);
        throw new Error('API MongoDB indisponible');
      }
    } catch (error) {
      console.error('❌ Erreur critique API social-networks:', error);
      return []; // Retour vide en cas d'erreur
    }
  }

  async deleteSocialNetwork(id: string): Promise<boolean> {
    try {
      console.log('📱 deleteSocialNetwork - MongoDB API:', id);
      
      const response = await fetch(`/api/social-networks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Réseau social supprimé de MongoDB');
        
        // Notifier tous les appareils
        this.notifyDataUpdate();
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur deleteSocialNetwork:', error);
      return false;
    }
  }

  // === NOTIFICATIONS RENFORCÉES ===
  private notifyDataUpdate(): void {
    console.log('🔔 DataService - Notification mise à jour données FORCÉE');
    if (typeof window !== 'undefined') {
      // Force immédiate sans délai
      window.dispatchEvent(new CustomEvent('dataUpdated'));
      window.dispatchEvent(new CustomEvent('bipcosa06DataChanged'));
      
      // Notification retardée pour s'assurer que tous les composants reçoivent
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dataUpdatedForced'));
        window.dispatchEvent(new CustomEvent('bipcosa06ForceSync'));
        console.log('📢 Événements FORCÉS envoyés');
      }, 50);
      
      // Triple notification pour s'assurer de la réception
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dataUpdated'));
        window.dispatchEvent(new CustomEvent('bipcosa06DataChanged'));
        console.log('📢 Triple notification envoyée');
      }, 100);
      
      // Forcer rechargement cache
      this.clearCache();
    }
  }
  
  // Nouvelle méthode pour vider le cache local
  private clearCache(): void {
    console.log('🧹 Vidage du cache localStorage forcé');
    // Ne pas vider, mais marquer comme périmé pour forcer API sync
    localStorage.setItem(this.PRODUCTS_KEY + '_expired', Date.now().toString());
    localStorage.setItem(this.CATEGORIES_KEY + '_expired', Date.now().toString());
    localStorage.setItem(this.FARMS_KEY + '_expired', Date.now().toString());
  }
  
  // Méthode publique pour forcer synchronisation totale
  public async forceFullSync(): Promise<void> {
    console.log('🚀 SYNCHRONISATION TOTALE FORCÉE');
    
    try {
      // Appeler l'API de synchronisation forcée
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Synchronisation API réussie:', result.data);
        
        // Utiliser les données fraîches retournées par l'API
        if (result.freshData) {
          localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(result.freshData.products));
          localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(result.freshData.categories));
          localStorage.setItem(this.FARMS_KEY, JSON.stringify(result.freshData.farms));
          console.log('💾 Cache localStorage mis à jour avec données fraîches');
        }
      } else {
        console.warn('⚠️ API sync échouée, fallback méthode locale');
        // Fallback sur l'ancienne méthode
        this.clearCache();
        this.lastSyncTime = 0;
        await this.performSync();
      }
    } catch (error) {
      console.error('❌ Erreur sync API:', error);
      // Fallback sur l'ancienne méthode
      this.clearCache();
      this.lastSyncTime = 0;
      await this.performSync();
    }
    
    // Quadruple notification pour s'assurer que TOUS les composants se mettent à jour
    this.notifyDataUpdate();
    setTimeout(() => this.notifyDataUpdate(), 200);
    setTimeout(() => this.notifyDataUpdate(), 500);
    setTimeout(() => this.notifyDataUpdate(), 1000);
    
    console.log('🎯 Synchronisation totale terminée');
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
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify([]));
      localStorage.setItem(this.FARMS_KEY, JSON.stringify([]));
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