import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🧹 API /clear-cache - Instruction de nettoyage cache');
    
    // Cette API retourne les instructions pour nettoyer le cache côté client
    // Le vrai nettoyage se fait côté client via JavaScript
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Instructions de nettoyage cache générées',
      instructions: {
        localStorage: [
          'bipcosa06_products',
          'bipcosa06_categories',
          'bipcosa06_farms',
          'bipcosa06_lastSync'
        ],
        actions: [
          'Vider localStorage',
          'Recharger données depuis MongoDB',
          'Synchroniser cache',
          'Forcer actualisation UI'
        ]
      },
      clientScript: `
// Script à exécuter côté client pour nettoyer le cache
localStorage.removeItem('bipcosa06_products');
localStorage.removeItem('bipcosa06_categories');
localStorage.removeItem('bipcosa06_farms');
localStorage.removeItem('bipcosa06_lastSync');
console.log('🧹 Cache localStorage nettoyé');
window.location.reload();
      `.trim(),
      recommendation: 'Exécuter le clientScript dans la console du navigateur après le nettoyage MongoDB',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Erreur génération instructions cache:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec génération instructions cache',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'INFO',
    message: 'API de nettoyage cache',
    usage: 'Utiliser POST pour obtenir les instructions de nettoyage',
    note: 'Le nettoyage du cache localStorage se fait côté client',
    apis: {
      'POST /api/clear-cache': 'Obtenir instructions de nettoyage',
      'POST /api/clear-db': 'Nettoyer MongoDB complètement',
      'GET /api/clear-db': 'Voir contenu MongoDB actuel'
    }
  });
}