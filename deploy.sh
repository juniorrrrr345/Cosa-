#!/bin/bash

# 🚀 Script de déploiement automatique BIPCOSA06 sur Vercel

echo "🌿 BIPCOSA06 - Déploiement sur Vercel"
echo "======================================"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js et npm détectés"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 Déploiement sur Vercel..."

# Déploiement en production
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌐 Votre application BIPCOSA06 est maintenant en ligne !"
echo ""
echo "📱 Fonctionnalités déployées :"
echo "   • Boutique avec photos réelles"
echo "   • Pages détail avec vidéos"
echo "   • Filtres par catégories/farms"
echo "   • Commande Telegram intégrée"
echo "   • Pages Info et Contact complètes"
echo ""
echo "🎉 BIPCOSA06 est prêt pour les clients !"