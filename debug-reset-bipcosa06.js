// === SCRIPT DE DEBUG ET RESET BIPCOSA06 ===
// Exécuter dans la console du navigateur sur https://bipcosa06.vercel.app/

console.log('🚀 SCRIPT DEBUG BIPCOSA06 - Démarrage...');

// Fonction pour afficher l'état actuel
function debugStatus() {
  console.log('📊 ÉTAT ACTUEL DES DONNÉES:');
  
  const keys = [
    'bipcosa06_config',
    'bipcosa06_products', 
    'bipcosa06_categories',
    'bipcosa06_farms',
    'bipcosa06_social_networks'
  ];
  
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`✅ ${key}:`, Array.isArray(parsed) ? `${parsed.length} éléments` : 'objet', parsed);
      } catch (e) {
        console.log(`❌ ${key}: erreur parsing`, data);
      }
    } else {
      console.log(`❌ ${key}: absent`);
    }
  });
}

// Fonction pour reset complet
function resetComplet() {
  console.log('🔄 RESET COMPLET BIPCOSA06...');
  
  // Supprimer toutes les données
  const keys = [
    'bipcosa06_config',
    'bipcosa06_products',
    'bipcosa06_categories', 
    'bipcosa06_farms',
    'bipcosa06_social_networks',
    'bipcosa06_info_content',
    'bipcosa06_contact_content'
  ];
  
  keys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Supprimé: ${key}`);
  });
  
  console.log('✅ Reset terminé - Rechargez la page pour réinitialiser');
}

// Fonction pour initialiser manuellement les données d'exemple
function initDonneesExemple() {
  console.log('📦 Initialisation manuelle des données d\'exemple...');
  
  // Catégories
  const categories = [
    { value: 'indica', label: 'Indica' },
    { value: 'sativa', label: 'Sativa' },
    { value: 'hybrid', label: 'Hybride' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' }
  ];
  
  // Fermes
  const farms = [
    { value: 'holland', label: 'Holland', country: '🇳🇱' },
    { value: 'espagne', label: 'Espagne', country: '🇪🇸' },
    { value: 'calispain', label: 'Calispain', country: '🏴‍☠️' },
    { value: 'premium', label: 'Premium', country: '⭐' }
  ];
  
  // Produits d'exemple
  const products = [
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
      ]
    },
    {
      id: 2,
      name: "POWER HAZE",
      quality: "Qualité Mid",
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
      description: "Indica puissante aux tons violets caractéristiques. Effets relaxants profonds et arômes fruités.",
      prices: [
        { id: "1", weight: "1g", price: "15€" },
        { id: "2", weight: "3.5g", price: "50€" },
        { id: "3", weight: "7g", price: "95€" },
        { id: "4", weight: "14g", price: "180€" },
        { id: "5", weight: "28g", price: "340€" }
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
      description: "Hybride équilibré avec des effets cérébraux créatifs et une relaxation corporelle douce. Goût de myrtille.",
      prices: [
        { id: "1", weight: "1g", price: "18€" },
        { id: "2", weight: "3.5g", price: "60€" },
        { id: "3", weight: "7g", price: "110€" },
        { id: "4", weight: "14g", price: "200€" },
        { id: "5", weight: "28g", price: "380€" }
      ]
    },
    {
      id: 5,
      name: "GREEN CRACK",
      quality: "Qualité Top",
      image: "https://images.unsplash.com/photo-1585567679103-dd8e4fec5df3?w=400&h=300&fit=crop&crop=center",
      flagColor: "#4CAF50",
      flagText: "🌱 OUTDOOR",
      category: "sativa",
      farm: "espagne",
      description: "Sativa énergisante parfaite pour la journée. Cultivation outdoor avec des saveurs citronnées.",
      prices: [
        { id: "1", weight: "1g", price: "9€" },
        { id: "2", weight: "3.5g", price: "28€" },
        { id: "3", weight: "7g", price: "50€" },
        { id: "4", weight: "14g", price: "90€" },
        { id: "5", weight: "28g", price: "170€" }
      ]
    },
    {
      id: 6,
      name: "WHITE WIDOW",
      quality: "Qualité Premium",
      image: "https://images.unsplash.com/photo-1616680214084-22670de1bc82?w=400&h=300&fit=crop&crop=center",
      flagColor: "#FF9800",
      flagText: "🏠 INDOOR",
      category: "hybrid",
      farm: "holland",
      description: "Classique hollandaise indoor. Hybride équilibré avec une couche de résine blanche caractéristique.",
      prices: [
        { id: "1", weight: "1g", price: "14€" },
        { id: "2", weight: "3.5g", price: "45€" },
        { id: "3", weight: "7g", price: "85€" },
        { id: "4", weight: "14g", price: "160€" },
        { id: "5", weight: "28g", price: "300€" }
      ]
    }
  ];
  
  // Configuration par défaut
  const config = {
    backgroundType: 'gradient',
    backgroundImage: '',
    backgroundUrl: '',
    shopName: 'BIPCOSA06',
    description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon'
  };
  
  // Sauvegarder tout
  localStorage.setItem('bipcosa06_categories', JSON.stringify(categories));
  localStorage.setItem('bipcosa06_farms', JSON.stringify(farms));
  localStorage.setItem('bipcosa06_products', JSON.stringify(products));
  localStorage.setItem('bipcosa06_config', JSON.stringify(config));
  
  console.log('✅ Données d\'exemple initialisées:');
  console.log('📂 Catégories:', categories.length);
  console.log('🏠 Fermes:', farms.length);
  console.log('🛍️ Produits:', products.length);
  console.log('⚙️ Config:', config);
  
  console.log('🔄 Rechargez la page pour voir les changements');
}

// Fonction pour tester les filtres
function testFiltres() {
  console.log('🧪 TEST DES FILTRES...');
  
  const products = JSON.parse(localStorage.getItem('bipcosa06_products') || '[]');
  const categories = JSON.parse(localStorage.getItem('bipcosa06_categories') || '[]');
  const farms = JSON.parse(localStorage.getItem('bipcosa06_farms') || '[]');
  
  console.log('📊 Répartition par catégorie:');
  categories.forEach(cat => {
    const count = products.filter(p => p.category === cat.value).length;
    console.log(`  ${cat.label}: ${count} produits`);
  });
  
  console.log('📊 Répartition par ferme:');
  farms.forEach(farm => {
    const count = products.filter(p => p.farm === farm.value).length;
    console.log(`  ${farm.label}: ${count} produits`);
  });
}

// === COMMANDES DISPONIBLES ===
console.log('📋 COMMANDES DISPONIBLES:');
console.log('  debugStatus()          - Afficher l\'état actuel');
console.log('  resetComplet()         - Reset complet + rechargement requis');
console.log('  initDonneesExemple()   - Initialiser les données d\'exemple');
console.log('  testFiltres()          - Tester la répartition des filtres');

// Afficher l'état actuel au démarrage
debugStatus();