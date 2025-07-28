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

  private async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      // Utiliser la variable d'environnement pour l'URI MongoDB
      const uri = process.env.MONGODB_URI || 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/bipcosa06';
      
      if (!uri) {
        throw new Error('MONGODB_URI non définie dans les variables d\'environnement');
      }
      
      console.log('🔗 Connexion MongoDB...');
      
      this.client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();
      this.db = this.client.db('bipcosa06');
      this.isConnected = true;
      
      console.log('✅ MongoDB connecté avec succès !');
    } catch (error) {
      console.error('❌ Erreur de connexion MongoDB:', error);
      throw error;
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

  // Alias pour compatibilité avec l'API config
  async getShopConfig(): Promise<ShopConfig> {
    return this.getConfig();
  }

  async updateShopConfig(config: Partial<ShopConfig>): Promise<ShopConfig> {
    return this.updateConfig(config);
  }

  // Méthode publique pour forcer la réinitialisation
  async forceInitializeData(): Promise<void> {
    console.log('🔄 Réinitialisation forcée des données MongoDB...');
    await this.ensureConnection();
    await this.initializeDefaultData();
  }

  // === MÉTHODES DE SAUVEGARDE MANQUANTES ===
  
  async saveCategory(category: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      console.log('💾 Sauvegarde catégorie MongoDB:', category.label);
      const result = await this.db.collection('categories').insertOne({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { ...category, _id: result.insertedId };
    } catch (error) {
      console.error('❌ Erreur sauvegarde catégorie:', error);
      throw error;
    }
  }

  async saveFarm(farm: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      console.log('💾 Sauvegarde ferme MongoDB:', farm.label);
      const result = await this.db.collection('farms').insertOne({
        ...farm,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { ...farm, _id: result.insertedId };
    } catch (error) {
      console.error('❌ Erreur sauvegarde ferme:', error);
      throw error;
    }
  }

  async saveInfoContent(content: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      console.log('💾 Sauvegarde contenu info MongoDB:', content.title);
      const result = await this.db.collection('info_contents').insertOne({
        ...content,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { ...content, _id: result.insertedId };
    } catch (error) {
      console.error('❌ Erreur sauvegarde contenu info:', error);
      throw error;
    }
  }

  async saveContactContent(content: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      console.log('💾 Sauvegarde contenu contact MongoDB:', content.title);
      const result = await this.db.collection('contact_contents').insertOne({
        ...content,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { ...content, _id: result.insertedId };
    } catch (error) {
      console.error('❌ Erreur sauvegarde contenu contact:', error);
      throw error;
    }
  }

  async saveSocialNetwork(network: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      console.log('💾 Sauvegarde réseau social MongoDB:', network.name);
      const result = await this.db.collection('social_networks').insertOne({
        ...network,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return { ...network, _id: result.insertedId };
    } catch (error) {
      console.error('❌ Erreur sauvegarde réseau social:', error);
      throw error;
    }
  }

  async getInfoContents(): Promise<any[]> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return [];
    
    try {
      const contents = await this.db.collection('info_contents').find({}).toArray();
      console.log('📖 Info contents récupérés:', contents.length);
      return contents;
    } catch (error) {
      console.error('❌ Erreur récupération info contents:', error);
      return [];
    }
  }

  async getContactContents(): Promise<any[]> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return [];
    
    try {
      const contents = await this.db.collection('contact_contents').find({}).toArray();
      console.log('📞 Contact contents récupérés:', contents.length);
      return contents;
    } catch (error) {
      console.error('❌ Erreur récupération contact contents:', error);
      return [];
    }
  }

  async getSocialNetworks(): Promise<any[]> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) return [];
    
    try {
      const networks = await this.db.collection('social_networks').find({}).toArray();
      console.log('📱 Réseaux sociaux récupérés:', networks.length);
      return networks;
    } catch (error) {
      console.error('❌ Erreur récupération réseaux sociaux:', error);
      return [];
    }
  }

  // Méthodes de mise à jour
  async updateCategory(id: string, updates: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('categories').findOneAndUpdate(
        { $or: [{ _id: id }, { value: id }] },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      console.error('❌ Erreur mise à jour catégorie:', error);
      throw error;
    }
  }

  async updateFarm(id: string, updates: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('farms').findOneAndUpdate(
        { $or: [{ _id: id }, { value: id }] },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      console.error('❌ Erreur mise à jour ferme:', error);
      throw error;
    }
  }

  async updateInfoContent(id: string, updates: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('info_contents').findOneAndUpdate(
        { $or: [{ _id: id }, { id: id }] },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      console.error('❌ Erreur mise à jour info content:', error);
      throw error;
    }
  }

  async updateContactContent(id: string, updates: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      console.log('🔄 updateContactContent - ID:', id, 'Updates:', updates);
      
      // Utiliser updateOne au lieu de findOneAndUpdate pour éviter les problèmes de result.value null
      const updateResult = await this.db.collection('contact_contents').updateOne(
        { $or: [{ _id: id }, { id: id }] },
        { $set: { ...updates, updatedAt: new Date() } }
      );
      
      console.log('🔄 updateContactContent - UpdateResult:', updateResult);
      
      if (updateResult.matchedCount === 0) {
        console.error('❌ Document non trouvé avec ID:', id);
        throw new Error('Document non trouvé');
      }
      
      if (updateResult.modifiedCount === 0) {
        console.log('⚠️ Document trouvé mais pas modifié (peut-être déjà à jour)');
      }
      
      // Récupérer le document mis à jour
      const updatedDoc = await this.db.collection('contact_contents').findOne(
        { $or: [{ _id: id }, { id: id }] }
      );
      
      console.log('✅ Document après mise à jour:', updatedDoc);
      return updatedDoc;
      
    } catch (error) {
      console.error('❌ Erreur mise à jour contact content:', error);
      throw error;
    }
  }

  async updateSocialNetwork(id: string, updates: any): Promise<any> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('social_networks').findOneAndUpdate(
        { $or: [{ _id: id }, { id: id }] },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      console.error('❌ Erreur mise à jour réseau social:', error);
      throw error;
    }
  }

  // Méthodes de suppression
  async deleteInfoContent(id: string): Promise<boolean> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('info_contents').deleteOne(
        { $or: [{ _id: id }, { id: id }] }
      );
      return result.deletedCount > 0;
    } catch (error) {
      console.error('❌ Erreur suppression info content:', error);
      throw error;
    }
  }

  async deleteContactContent(id: string): Promise<boolean> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('contact_contents').deleteOne(
        { $or: [{ _id: id }, { id: id }] }
      );
      return result.deletedCount > 0;
    } catch (error) {
      console.error('❌ Erreur suppression contact content:', error);
      throw error;
    }
  }

  async deleteSocialNetwork(id: string): Promise<boolean> {
    await this.ensureConnection();
    if (!this.isConnected || !this.db) throw new Error('MongoDB non connecté');
    
    try {
      const result = await this.db.collection('social_networks').deleteOne(
        { $or: [{ _id: id }, { id: id }] }
      );
      return result.deletedCount > 0;
    } catch (error) {
      console.error('❌ Erreur suppression réseau social:', error);
      throw error;
    }
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