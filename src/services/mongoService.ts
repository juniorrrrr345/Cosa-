import { MongoClient, Db, Collection } from 'mongodb';
import { Product, Category, Farm, ShopConfig, InfoContent, ContactContent } from './dataService';

class MongoService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.connectionPromise = this.connect();
  }

  private async connect() {
    try {
      if (!process.env.MONGODB_URI) {
        console.warn('MongoDB URI non configurée, utilisation des données en mémoire');
        return;
      }

      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db('bipcosa06');
      this.isConnected = true;
      console.log('✅ Connexion MongoDB établie');
      
      // Initialiser les données par défaut si les collections sont vides
      await this.initializeDefaultData();
    } catch (error) {
      console.error('❌ Erreur de connexion MongoDB:', error);
      this.isConnected = false;
    }
  }

  // Nouvelle méthode pour s'assurer que la connexion est établie
  private async ensureConnection(): Promise<void> {
    if (this.connectionPromise) {
      await this.connectionPromise;
      this.connectionPromise = null;
    }
    
    if (!this.isConnected) {
      // Tentative de reconnexion
      await this.connect();
    }
  }

  private async initializeDefaultData() {
    if (!this.db || !this.isConnected) {
      console.log('⚠️ MongoDB non connecté pour initialisation');
      return;
    }

    try {
      console.log('🔄 Vérification/Initialisation des données MongoDB...');
      
      // TOUJOURS vérifier et initialiser si vide
      const productsCount = await this.db.collection('products').countDocuments();
      const categoriesCount = await this.db.collection('categories').countDocuments();
      const farmsCount = await this.db.collection('farms').countDocuments();
      
      console.log(`📊 État actuel: ${productsCount} produits, ${categoriesCount} catégories, ${farmsCount} farms`);
      
      // Insérer les catégories si vides
      if (categoriesCount === 0) {
        console.log('📦 Initialisation catégories...');
        await this.db.collection('categories').insertMany([
          { value: 'indica', label: 'Indica' },
          { value: 'sativa', label: 'Sativa' },
          { value: 'hybrid', label: 'Hybride' },
          { value: 'indoor', label: 'Indoor' },
          { value: 'outdoor', label: 'Outdoor' }
        ]);
        console.log('✅ Catégories initialisées');
      }

      // Insérer les farms si vides
      if (farmsCount === 0) {
        console.log('📦 Initialisation farms...');
        await this.db.collection('farms').insertMany([
          { value: 'holland', label: 'Holland', country: '🇳🇱' },
          { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
          { value: 'calispain', label: 'Calispain', country: '🏴‍☠️' },
          { value: 'premium', label: 'Premium', country: '⭐' }
        ]);
        console.log('✅ Farms initialisées');
      }

      // Insérer les produits si vides
      if (productsCount === 0) {
        console.log('📦 Initialisation produits...');
        await this.db.collection('products').insertMany([
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
            name: "AMNESIA",
            quality: "Qualité Top",
            image: "https://images.unsplash.com/photo-1583065173640-8ad0c93a1b5a?w=400&h=300&fit=crop&crop=center",
            flagColor: "#FF9800",
            flagText: "🏴‍☠️ CALISPAIN",
            category: "hybrid",
            farm: "calispain",
            description: "Hybride équilibré avec des effets puissants et durables.",
            prices: [
              { id: "1", weight: "1g", price: "15€" },
              { id: "2", weight: "3.5g", price: "50€" },
              { id: "3", weight: "7g", price: "90€" }
            ]
          },
          {
            id: 4,
            name: "BLUE DREAM",
            quality: "Qualité Premium",
            image: "https://images.unsplash.com/photo-1582017719274-34a06d53caa3?w=400&h=300&fit=crop&crop=center",
            flagColor: "#9C27B0",
            flagText: "⭐ PREMIUM",
            category: "sativa",
            farm: "premium",
            description: "Sativa premium avec des arômes de myrtille et des effets créatifs.",
            prices: [
              { id: "1", weight: "1g", price: "18€" },
              { id: "2", weight: "3.5g", price: "60€" },
              { id: "3", weight: "7g", price: "110€" }
            ]
          }
        ]);
        console.log('✅ Produits initialisés');
      }

      // Initialiser la config si elle n'existe pas
      const configCount = await this.db.collection('config').countDocuments();
      if (configCount === 0) {
        console.log('📦 Initialisation config...');
        await this.db.collection('config').insertOne({
          name: "BiP Cosa",
          description: "Votre boutique de qualité premium",
          logo: "/logo.png",
          primaryColor: "#4CAF50",
          secondaryColor: "#2196F3",
          backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center",
          themeMode: "dark"
        });
        console.log('✅ Config initialisée');
      }

      console.log('🚀 Initialisation MongoDB terminée avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation MongoDB:', error);
    }
  }

  // Méthodes pour les produits
  async getProducts(): Promise<Product[]> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return [];
    
    try {
      const products = await this.db.collection('products').find({}).sort({ createdAt: -1 }).toArray();
      return products.map(p => ({ ...p, _id: p._id.toString() }));
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return null;
    
    try {
      const product = await this.db.collection('products').findOne({
        $or: [{ _id: id }, { id: parseInt(id) }]
      });
      
      return product ? { ...product, _id: product._id.toString() } : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return null;
    }
  }

  async addProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const newProduct = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await this.db.collection('products').insertOne(newProduct);
      return { ...newProduct, _id: result.insertedId.toString() };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      throw error;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      const result = await this.db.collection('products').findOneAndUpdate(
        { $or: [{ _id: id }, { id: parseInt(id) }] },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      return result.value ? { ...result.value, _id: result.value._id.toString() } : null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('products').deleteOne({
        $or: [{ _id: id }, { id: parseInt(id) }]
      });
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return [];
    
    try {
      return await this.db.collection('categories').find({}).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  }

  async addCategory(category: Category): Promise<Category> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      await this.db.collection('categories').insertOne(category);
      return category;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      throw error;
    }
  }

  async deleteCategory(value: string): Promise<boolean> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('categories').deleteOne({ value });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }

  // Méthodes pour les farms
  async getFarms(): Promise<Farm[]> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return [];
    
    try {
      return await this.db.collection('farms').find({}).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des farms:', error);
      return [];
    }
  }

  async addFarm(farm: Farm): Promise<Farm> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      await this.db.collection('farms').insertOne(farm);
      return farm;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la farm:', error);
      throw error;
    }
  }

  async deleteFarm(value: string): Promise<boolean> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('farms').deleteOne({ value });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Erreur lors de la suppression de la farm:', error);
      throw error;
    }
  }

  // Méthodes pour la configuration
  async getConfig(): Promise<ShopConfig> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) {
      return {
        backgroundType: 'gradient',
        backgroundColor: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        shopName: 'BIPCOSA06',
        description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
      };
    }
    
    try {
      const config = await this.db.collection('config').findOne({});
      return config || {
        backgroundType: 'gradient',
        backgroundColor: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        shopName: 'BIPCOSA06',
        description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la config:', error);
      return {
        backgroundType: 'gradient',
        backgroundColor: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        shopName: 'BIPCOSA06',
        description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
      };
    }
  }

  async updateConfig(config: Partial<ShopConfig>): Promise<ShopConfig> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const updateData = {
        ...config,
        updatedAt: new Date()
      };
      
      const result = await this.db.collection('config').findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, returnDocument: 'after' }
      );
      
      return result.value || config as ShopConfig;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la config:', error);
      throw error;
    }
  }

  // Méthode publique pour forcer la réinitialisation
  async forceInitializeData(): Promise<void> {
    console.log('🔄 Réinitialisation forcée des données MongoDB...');
    await this.ensureConnection();
    await this.initializeDefaultData();
  }

  // Méthode de fermeture de connexion
  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Connexion MongoDB fermée');
    }
  }

  // Getter pour vérifier l'état de la connexion
  get connected(): boolean {
    return this.isConnected;
  }
}

// Export singleton
export const mongoService = new MongoService();
export default mongoService;