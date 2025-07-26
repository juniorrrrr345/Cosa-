#!/bin/bash

# 🔄 SCRIPT DE DUPLICATION BOUTIQUE BIPCOSA06
# Ce script aide à préparer une copie indépendante

echo "🚀 DUPLICATION BOUTIQUE BIPCOSA06"
echo "================================="
echo ""

# Demander le nom du nouveau projet
read -p "📝 Nom du nouveau projet (ex: BIPCOSA06-Copy) : " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    PROJECT_NAME="BIPCOSA06-Copy"
fi

# Demander l'URL du nouveau repository
read -p "🔗 URL du nouveau repository GitHub (ex: https://github.com/username/repo.git) : " REPO_URL

echo ""
echo "📋 Configuration :"
echo "   Projet : $PROJECT_NAME"
echo "   Repository : $REPO_URL"
echo ""

read -p "✅ Continuer avec cette configuration ? (y/N) : " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Annulé"
    exit 1
fi

echo ""
echo "🔄 Préparation de la duplication..."

# Créer le dossier du nouveau projet
mkdir -p "../$PROJECT_NAME"
cd "../$PROJECT_NAME"

echo "📁 Dossier créé : ../$PROJECT_NAME"

# Copier tous les fichiers sauf .git
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='out' ../Cosa-/ ./

echo "📄 Fichiers copiés"

# Modifier package.json
if [ -f "package.json" ]; then
    sed -i.bak "s/\"name\": \"bipcosa06\"/\"name\": \"$(echo $PROJECT_NAME | tr '[:upper:]' '[:lower:]')\"/g" package.json
    sed -i.bak "s/BIPCOSA06 - Application Next.js Boutique Premium/$PROJECT_NAME - Application Next.js Boutique Premium/g" package.json
    rm package.json.bak 2>/dev/null
    echo "✅ package.json modifié"
fi

# Modifier le README
if [ -f "README.md" ]; then
    cat > README.md << EOF
# $PROJECT_NAME - Boutique Premium

**🚀 Version indépendante de BIPCOSA06**

Cette version est une copie complètement séparée avec :
- Panel admin sécurisé (mot de passe: AdminJunior123)
- Système localStorage dynamique
- Logo personnalisé
- Aucune synchronisation avec l'original

## 🚀 Déploiement

1. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

2. Lancer en développement :
\`\`\`bash
npm run dev
\`\`\`

3. Builder pour production :
\`\`\`bash
npm run build
\`\`\`

## 🔐 Panel Admin

- URL : \`/panel\`
- Mot de passe : \`AdminJunior123\`

## 📱 Fonctionnalités

- ✅ Boutique e-commerce complète
- ✅ Panel admin sécurisé
- ✅ Système localStorage dynamique
- ✅ Logo personnalisé
- ✅ Design responsive
- ✅ Commande Telegram intégrée

EOF
    echo "✅ README.md modifié"
fi

# Modifier les métadonnées si le fichier existe
if [ -f "src/app/layout.tsx" ]; then
    sed -i.bak "s/BIPCOSA06 - Boutique Premium/$PROJECT_NAME - Boutique Premium/g" src/app/layout.tsx
    sed -i.bak "s/BIPCOSA06 - Votre boutique de confiance/$PROJECT_NAME - Votre boutique de confiance/g" src/app/layout.tsx
    rm src/app/layout.tsx.bak 2>/dev/null
    echo "✅ Métadonnées modifiées"
fi

# Initialiser Git
git init
git add .
git commit -m "🚀 Initial commit - $PROJECT_NAME indépendante"

echo "✅ Git initialisé avec commit initial"

# Ajouter le remote si fourni
if [ ! -z "$REPO_URL" ]; then
    git remote add origin "$REPO_URL"
    echo "✅ Remote ajouté : $REPO_URL"
    
    read -p "🚀 Pousser vers GitHub maintenant ? (y/N) : " PUSH_NOW
    if [[ $PUSH_NOW =~ ^[Yy]$ ]]; then
        git branch -M main
        git push -u origin main
        echo "✅ Code poussé vers GitHub"
    else
        echo "ℹ️  Pour pousser plus tard : git push -u origin main"
    fi
fi

echo ""
echo "🎉 DUPLICATION TERMINÉE !"
echo "========================"
echo ""
echo "📁 Projet créé dans : ../$PROJECT_NAME"
echo "🔗 Repository : $REPO_URL"
echo ""
echo "📋 PROCHAINES ÉTAPES :"
echo "1. cd ../$PROJECT_NAME"
echo "2. npm install"
echo "3. npm run dev (pour tester localement)"
echo "4. Déployer sur Vercel :"
echo "   - Aller sur vercel.com"
echo "   - Import Git Repository"
echo "   - Sélectionner votre nouveau repo"
echo "   - Deploy"
echo ""
echo "🔐 Panel Admin :"
echo "   - URL : /panel"
echo "   - Mot de passe : AdminJunior123"
echo ""
echo "✅ La boutique est maintenant COMPLÈTEMENT INDÉPENDANTE !"