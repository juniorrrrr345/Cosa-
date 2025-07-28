#!/bin/bash

# =============================================================================
# SCRIPT D'INSTALLATION DES VARIABLES D'ENVIRONNEMENT BIPCOSA06
# =============================================================================

echo "🔧 INSTALLATION DES VARIABLES D'ENVIRONNEMENT POUR COSA-TAU"
echo "=============================================================="

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

echo "🔐 Connexion à Vercel (si nécessaire)..."
vercel login

echo "📝 Ajout des variables d'environnement..."

# MongoDB
echo "🗄️ Configuration MongoDB..."
echo "mongodb+srv://BipCosa:Cosa06@cluster0.itciznm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" | vercel env add MONGODB_URI production preview development

# Cloudinary Serveur
echo "☁️ Configuration Cloudinary (Serveur)..."
echo "dvsy5mfhu" | vercel env add CLOUDINARY_CLOUD_NAME production preview development
echo "485987511825452" | vercel env add CLOUDINARY_API_KEY production preview development
echo "TCJrWZuCJ6r_BLhO4i6afg3F6JU" | vercel env add CLOUDINARY_API_SECRET production preview development

# Cloudinary Client
echo "🌐 Configuration Cloudinary (Client)..."
echo "dvsy5mfhu" | vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production preview development
echo "485987511825452" | vercel env add NEXT_PUBLIC_CLOUDINARY_API_KEY production preview development
echo "bipcosa06_preset" | vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET production preview development

# Application
echo "🚀 Configuration Application..."
echo "https://cosa-tau.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production preview development

# Sécurité
echo "🔐 Configuration Sécurité..."
echo "bipcosa06-super-secret-key-production-2024-secure-jwt-token-encryption-cosa-tau-vercel" | vercel env add NEXTAUTH_SECRET production preview development
echo "https://cosa-tau.vercel.app" | vercel env add NEXTAUTH_URL production preview development

# Environnement
echo "🛠️ Configuration Environnement..."
echo "production" | vercel env add NODE_ENV production
echo "info" | vercel env add LOG_LEVEL production preview development

echo ""
echo "✅ VARIABLES INSTALLÉES AVEC SUCCÈS !"
echo "======================================"
echo ""
echo "📋 PROCHAINES ÉTAPES :"
echo "1. 🔧 Créez le preset 'bipcosa06_preset' dans Cloudinary"
echo "   → https://console.cloudinary.com/settings/upload"
echo "   → Mode: Unsigned, Folder: bipcosa06"
echo ""
echo "2. 🌐 Autorisez toutes les IPs dans MongoDB"
echo "   → https://cloud.mongodb.com/v2/674e9b0f71d46a7aa5b7b9b5#/security/network/accessList"
echo "   → Ajoutez: 0.0.0.0/0"
echo ""
echo "3. 🚀 Redéployez le projet"
echo "   → vercel --prod"
echo ""
echo "4. ✅ Testez l'application"
echo "   → Upload d'image dans le panel admin"
echo "   → Création/suppression de produit"
echo ""
echo "🎯 Variables Vercel Dashboard:"
echo "https://vercel.com/dashboard/[username]/cosa-tau/settings/environment-variables"