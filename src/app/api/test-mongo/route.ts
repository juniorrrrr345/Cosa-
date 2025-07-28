import { NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET() {
  try {
    console.log('🧪 API /test-mongo - Test de connexion MongoDB');
    
    // Vérifier quelle URI est utilisée
    const envUri = process.env.MONGODB_URI;
    const fallbackUri = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const actualUri = envUri || fallbackUri;
    
    console.log('🔍 URI Environment Variable:', envUri ? 'DÉFINIE' : 'NON DÉFINIE');
    console.log('🔍 URI utilisée:', actualUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Masquer les credentials
    
    // Identifier quel utilisateur est utilisé
    let userInUri = 'INCONNU';
    if (actualUri.includes('BipCosa:Cosa06')) {
      userInUri = 'BipCosa';
    } else if (actualUri.includes('Junior:Lacrim123')) {
      userInUri = 'Junior';
    } else if (actualUri.includes('cosa_tau_app:CosaTau2024')) {
      userInUri = 'cosa_tau_app';
    }
    
    // Test de connexion
    await mongoService.connect();
    const products = await mongoService.getProducts();
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Connexion MongoDB réussie !',
      details: {
        connected: true,
        productsCount: products.length,
        mongoUri: envUri ? 'Définie via variable d\'environnement' : 'Utilise URI fallback',
        uriSource: envUri ? 'ENVIRONMENT_VARIABLE' : 'FALLBACK_CODE',
        userDetected: userInUri,
        testOperation: 'Lecture des produits réussie',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erreur test MongoDB:', error);
    
    // Analyser le type d'erreur
    let errorType = 'UNKNOWN_ERROR';
    let suggestion = 'Vérifier la configuration MongoDB';
    
    if (error.message?.includes('bad auth') || error.message?.includes('authentication failed')) {
      errorType = 'AUTHENTICATION_FAILED';
      suggestion = 'Vérifier que l\'utilisateur BipCosa existe dans MongoDB Atlas avec le mot de passe Cosa06';
    } else if (error.message?.includes('not authorized')) {
      errorType = 'AUTHORIZATION_FAILED';
      suggestion = 'Vérifier les permissions de l\'utilisateur dans MongoDB Atlas';
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('network')) {
      errorType = 'NETWORK_ERROR';
      suggestion = 'Vérifier la connectivité réseau et l\'URI MongoDB';
    }
    
    // Identifier quel utilisateur était testé
    const envUri = process.env.MONGODB_URI;
    const fallbackUri = 'mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const actualUri = envUri || fallbackUri;
    
    let userInUri = 'INCONNU';
    if (actualUri.includes('BipCosa:Cosa06')) {
      userInUri = 'BipCosa';
    } else if (actualUri.includes('Junior:Lacrim123')) {
      userInUri = 'Junior';
    } else if (actualUri.includes('cosa_tau_app:CosaTau2024')) {
      userInUri = 'cosa_tau_app';
    }
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec de connexion MongoDB',
      errorType,
      suggestion,
      details: {
        errorMessage: error.message,
        errorCode: error.code || 'N/A',
        errorCodeName: error.codeName || 'N/A',
        mongoUri: envUri ? 'Variable d\'environnement définie' : 'Utilise URI fallback',
        uriSource: envUri ? 'ENVIRONMENT_VARIABLE' : 'FALLBACK_CODE',
        userDetected: userInUri,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { testUri } = await request.json();
    
    console.log('🧪 API /test-mongo POST - Test URI personnalisée');
    console.log('🔍 URI à tester:', testUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    if (!testUri) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'URI MongoDB requise pour le test'
      }, { status: 400 });
    }
    
    // Test direct avec l'URI fournie
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(testUri);
    
    await client.connect();
    const db = client.db('bipcosa06');
    const products = await db.collection('products').find({}).toArray();
    await client.close();
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Test URI personnalisée réussi !',
      details: {
        connected: true,
        productsCount: products.length,
        testOperation: 'Connexion et lecture réussies',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erreur test URI personnalisée:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec test URI personnalisée',
      details: {
        errorMessage: error.message,
        errorCode: error.code || 'N/A',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}