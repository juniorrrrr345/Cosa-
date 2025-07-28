import { NextResponse } from 'next/server';
import mongoService from '@/services/mongoService';

export async function GET() {
  try {
    console.log('🧪 Test de connexion MongoDB démarré...');
    
    // Tester la connexion
    await mongoService.connect();
    
    console.log('✅ Connexion MongoDB réussie !');
    
    // Tester une opération simple
    const testResult = await mongoService.getProducts();
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Connexion MongoDB réussie !',
      details: {
        connected: mongoService.isConnected,
        timestamp: new Date().toISOString(),
        productsCount: testResult.length,
        mongoUri: process.env.MONGODB_URI ? 'Définie via variable d\'environnement' : 'Utilise URI par défaut',
        testOperation: 'Lecture des produits réussie'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Test MongoDB échoué:', error);
    
    // Analyser le type d'erreur
    let errorType = 'UNKNOWN';
    let suggestion = 'Vérifier les logs pour plus de détails';
    
    if (error.message?.includes('authentication failed')) {
      errorType = 'AUTHENTICATION_FAILED';
      suggestion = 'Vérifier que l\'utilisateur Junior existe dans MongoDB Atlas avec le bon mot de passe';
    } else if (error.message?.includes('ENOTFOUND')) {
      errorType = 'DNS_RESOLUTION_FAILED';
      suggestion = 'Vérifier l\'URI MongoDB et la connectivité réseau';
    } else if (error.message?.includes('connection refused')) {
      errorType = 'CONNECTION_REFUSED';
      suggestion = 'Vérifier que le cluster MongoDB Atlas est actif';
    } else if (error.message?.includes('timeout')) {
      errorType = 'TIMEOUT';
      suggestion = 'Problème de réseau ou cluster surchargé';
    }
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec de connexion MongoDB',
      errorType,
      suggestion,
      details: {
        errorMessage: error.message,
        errorCode: error.code,
        errorCodeName: error.codeName,
        mongoUri: process.env.MONGODB_URI ? 'Variable d\'environnement définie' : 'Utilise URI par défaut',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// Route POST pour tester avec une URI personnalisée
export async function POST(request: Request) {
  try {
    const { testUri } = await request.json();
    
    if (!testUri) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'URI de test requise'
      }, { status: 400 });
    }
    
    console.log('🧪 Test avec URI personnalisée...');
    
    // Import dynamique pour tester avec une URI spécifique
    const { MongoClient } = require('mongodb');
    
    const client = new MongoClient(testUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    console.log('✅ Connexion test réussie !');
    
    // Test simple
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    await client.close();
    
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Test URI personnalisée réussi !',
      details: {
        collectionsFound: collections.length,
        collectionNames: collections.map(c => c.name),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Test URI personnalisée échoué:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Échec test URI personnalisée',
      details: {
        errorMessage: error.message,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}