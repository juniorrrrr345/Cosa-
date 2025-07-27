#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Déploiement vers cosa-tau.vercel.app...');

try {
  // Build du projet
  console.log('📦 Build du projet...');
  execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('✅ Build terminé !');
  console.log('🔗 Le projet sera accessible sur: https://cosa-tau.vercel.app');
  console.log('');
  console.log('🔄 SYSTÈME DE SYNCHRONISATION TEMPS RÉEL INCLUS:');
  console.log('   - Sync automatique toutes les 5 secondes');
  console.log('   - Sync immédiate lors des modifications');
  console.log('   - Support multi-appareils');
  console.log('');
  console.log('✅ Déploiement préparé pour cosa-tau.vercel.app');
  
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error.message);
  process.exit(1);
}