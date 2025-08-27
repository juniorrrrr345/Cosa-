#!/usr/bin/env node

/**
 * Script de test de l'authentification Cloudflare
 */

const fetch = require('node-fetch');
const config = require('./config');

async function testCloudflareAuth() {
  console.log('🔍 Test de l\'authentification Cloudflare\n');
  console.log('Configuration:');
  console.log('- Account ID:', config.cloudflare.accountId);
  console.log('- API Token:', config.cloudflare.apiToken.substring(0, 10) + '...');
  console.log('\n' + '='.repeat(50) + '\n');

  // Test 1: Vérifier le token
  console.log('Test 1: Vérification du token API...');
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Token valide!');
      console.log('  - ID:', data.result.id);
      console.log('  - Status:', data.result.status);
    } else {
      console.log('❌ Token invalide');
      console.log('  Erreurs:', data.errors);
    }
  } catch (error) {
    console.log('❌ Erreur de vérification:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 2: Accès au compte
  console.log('Test 2: Accès au compte Cloudflare...');
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}`, {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Accès au compte réussi!');
      console.log('  - Nom:', data.result.name);
      console.log('  - Type:', data.result.type);
    } else {
      console.log('❌ Impossible d\'accéder au compte');
      console.log('  Status:', response.status);
      console.log('  Erreurs:', data.errors);
    }
  } catch (error) {
    console.log('❌ Erreur d\'accès:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 3: Accès à Stream
  console.log('Test 3: Accès à Cloudflare Stream...');
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream`, {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Accès à Stream réussi!');
      if (data.result && Array.isArray(data.result)) {
        console.log('  - Vidéos existantes:', data.result.length);
      }
    } else {
      console.log('❌ Impossible d\'accéder à Stream');
      console.log('  Status:', response.status);
      console.log('  Erreurs:', data.errors);
    }
  } catch (error) {
    console.log('❌ Erreur Stream:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 4: Accès à Images
  console.log('Test 4: Accès à Cloudflare Images...');
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/images/v1`, {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Accès à Images réussi!');
      if (data.result && data.result.images) {
        console.log('  - Images existantes:', data.result.images.length);
      }
    } else {
      console.log('❌ Impossible d\'accéder à Images');
      console.log('  Status:', response.status);
      console.log('  Erreurs:', data.errors);
    }
  } catch (error) {
    console.log('❌ Erreur Images:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Recommandations
  console.log('📋 RECOMMANDATIONS:\n');
  console.log('Si vous avez des erreurs 403 (Forbidden), vérifiez que votre token API a les permissions suivantes:');
  console.log('  1. Account:Cloudflare Stream:Edit');
  console.log('  2. Account:Cloudflare Images:Edit');
  console.log('  3. Zone:Zone:Read (optionnel)');
  console.log('\nPour créer un nouveau token:');
  console.log('  1. Aller sur https://dash.cloudflare.com/profile/api-tokens');
  console.log('  2. Cliquer sur "Create Token"');
  console.log('  3. Utiliser le template "Custom token"');
  console.log('  4. Ajouter les permissions ci-dessus');
  console.log('  5. Copier le token et le mettre dans config.js');
}

// Exécuter le test
testCloudflareAuth()
  .then(() => {
    console.log('\n✅ Test terminé');
  })
  .catch(error => {
    console.error('\n❌ Erreur fatale:', error);
  });