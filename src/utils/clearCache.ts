// Fonction pour vider complètement le cache localStorage
export const clearAllCache = () => {
  const keysToRemove = [
    'bipcosa06_products',
    'bipcosa06_categories', 
    'bipcosa06_farms',
    'bipcosa06_config',
    'bipcosa06_socialNetworks',
    'bipcosa06_infoContents'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('✅ Cache localStorage vidé complètement');
};

// Fonction pour forcer le rechargement depuis MongoDB
export const forceReloadFromMongoDB = () => {
  clearAllCache();
  window.location.reload();
};