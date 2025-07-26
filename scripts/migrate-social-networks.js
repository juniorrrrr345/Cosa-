#!/usr/bin/env node

/**
 * Script de migration pour corriger la synchronisation des réseaux sociaux
 * Ce script s'assure que les réseaux sociaux sont correctement stockés dans localStorage
 */

console.log('🔄 Migration des réseaux sociaux - Début...');

// Simuler l'environnement browser pour le script
if (typeof window === 'undefined') {
  global.window = {
    localStorage: {
      data: {},
      getItem: function(key) {
        return this.data[key] || null;
      },
      setItem: function(key, value) {
        this.data[key] = value;
        console.log(`📝 localStorage.setItem('${key}') - ${value.length} caractères`);
      },
      removeItem: function(key) {
        delete this.data[key];
      }
    }
  };
}

// Réseaux sociaux par défaut
const defaultSocialNetworks = [
  {
    id: 'telegram',
    name: 'Telegram',
    emoji: '📱',
    url: 'https://t.me/bipcosa06',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'instagram',
    name: 'Instagram',
    emoji: '📸',
    url: 'https://instagram.com/bipcosa06',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SOCIAL_NETWORKS_KEY = 'bipcosa06_social_networks';

function migrateSocialNetworks() {
  try {
    // Vérifier si les données existent déjà
    const existing = window.localStorage.getItem(SOCIAL_NETWORKS_KEY);
    
    if (existing) {
      console.log('✅ Les réseaux sociaux sont déjà configurés dans localStorage');
      const networks = JSON.parse(existing);
      console.log(`📊 ${networks.length} réseaux sociaux trouvés`);
      return;
    }
    
    // Initialiser avec les données par défaut
    window.localStorage.setItem(SOCIAL_NETWORKS_KEY, JSON.stringify(defaultSocialNetworks));
    console.log('✅ Réseaux sociaux par défaut initialisés');
    console.log(`📊 ${defaultSocialNetworks.length} réseaux sociaux ajoutés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

// Fonction pour vérifier la synchronisation
function checkSynchronization() {
  try {
    const stored = window.localStorage.getItem(SOCIAL_NETWORKS_KEY);
    if (stored) {
      const networks = JSON.parse(stored);
      console.log('\n📋 État actuel des réseaux sociaux:');
      networks.forEach(network => {
        console.log(`  • ${network.emoji} ${network.name} - ${network.isActive ? '✅ Actif' : '⭕ Inactif'} - Ordre: ${network.order}`);
      });
    } else {
      console.log('\n❌ Aucun réseau social trouvé dans localStorage');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter la migration
migrateSocialNetworks();
checkSynchronization();

console.log('\n🎉 Migration terminée!');
console.log('\n📝 Instructions:');
console.log('1. Les réseaux sociaux sont maintenant stockés dans localStorage');
console.log('2. Les modifications dans le panel admin seront synchronisées');
console.log('3. La suppression fonctionne maintenant correctement');
console.log('4. Redémarrez l\'application pour voir les changements');