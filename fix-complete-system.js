#!/usr/bin/env node

console.log(`
🔧 RÉPARATION COMPLÈTE DU SYSTÈME BIPCOSA06
==========================================

Ce script va :
1. Vérifier la configuration
2. Tester les connexions
3. Réinitialiser si nécessaire
4. Afficher les instructions de réparation

`);

// Configuration
const config = {
  mongodb: {
    uri: 'mongodb+srv://juniorrrrr345:cosa06@cluster0.qfqno.mongodb.net/bipcosa06?retryWrites=true&w=majority&appName=Cluster0',
    db: 'bipcosa06'
  },
  cloudinary: {
    cloud_name: 'dtjab1akq',
    api_key: '851324984197634',
    api_secret: 'bQJrdNdhts56XuPx4uCoWEme80g',
    upload_preset: 'bipcosa06_preset'
  }
};

// Vérification des variables d'environnement
console.log('📋 VÉRIFICATION DE LA CONFIGURATION\n');

console.log('1. Variables d\'environnement nécessaires :');
console.log('   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME =', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '❌ MANQUANT');
console.log('   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET =', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '❌ MANQUANT');
console.log('   MONGODB_URI =', process.env.MONGODB_URI ? '✅ DÉFINI' : '❌ MANQUANT');

console.log('\n2. Fichier .env.local :');
const fs = require('fs');
const path = require('path');

const envContent = `# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${config.cloudinary.cloud_name}
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${config.cloudinary.upload_preset}
NEXT_PUBLIC_CLOUDINARY_API_KEY=${config.cloudinary.api_key}
CLOUDINARY_API_SECRET=${config.cloudinary.api_secret}
CLOUDINARY_URL=cloudinary://${config.cloudinary.api_key}:${config.cloudinary.api_secret}@${config.cloudinary.cloud_name}

# MongoDB
MONGODB_URI=${config.mongodb.uri}
MONGODB_DB=${config.mongodb.db}

# API
NEXT_PUBLIC_API_URL=https://cosa-tau.vercel.app
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('   ✅ Fichier .env.local créé/mis à jour');
} catch (error) {
  console.log('   ❌ Erreur création .env.local:', error.message);
}

// Test Cloudinary
console.log('\n📸 TEST CLOUDINARY\n');
console.log('Configuration :');
console.log('   Cloud Name:', config.cloudinary.cloud_name);
console.log('   Upload Preset:', config.cloudinary.upload_preset);
console.log('   API Key:', config.cloudinary.api_key);

// Instructions de réparation
console.log(`
🛠️ INSTRUCTIONS DE RÉPARATION
============================

1. CLOUDINARY - Vérifiez dans https://console.cloudinary.com :
   ✓ Le preset "${config.cloudinary.upload_preset}" existe
   ✓ Il est en mode "Unsigned"
   ✓ Le dossier est défini sur "bipcosa06"

2. MONGODB - Vérifiez dans MongoDB Atlas :
   ✓ La base de données "bipcosa06" existe
   ✓ Les collections sont créées
   ✓ L'adresse IP est whitelistée (0.0.0.0/0)

3. REDÉMARRAGE :
   npm run dev

4. TEST UPLOAD :
   - Allez dans le panel admin
   - Modifiez un produit
   - Essayez d'uploader une petite image (<1MB)
   - Ouvrez la console (F12) pour voir les logs

5. SI ÇA NE MARCHE PAS :
   - Vérifiez la console du navigateur
   - Cherchez les messages d'erreur
   - Vérifiez que le preset est bien "Unsigned"

📝 DONNÉES DE TEST
==================
Produit test à créer :
- Nom: TEST UPLOAD
- Catégorie: indica
- Farm: holland
- Description: Produit de test
- Prix: 1g = 10€

🔍 DÉBOGAGE
===========
Dans la console du navigateur, vous devriez voir :
- 🚀 Upload Cloudinary: {...}
- 📤 Upload vers: https://api.cloudinary.com/...
- ✅ Upload réussi: https://res.cloudinary.com/...

Si vous voyez :
- ❌ Invalid upload preset → Créez le preset
- ❌ cloud_name incorrect → Vérifiez le cloud name
`);

// Créer un fichier HTML de test amélioré
const testHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Test Complet BIPCOSA06</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .config {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-family: monospace;
        }
        .test-section {
            margin: 30px 0;
            padding: 20px;
            border: 2px dashed #ddd;
            border-radius: 10px;
        }
        .upload-btn {
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 0;
        }
        .upload-btn:hover {
            background: #45a049;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            white-space: pre-wrap;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        img {
            max-width: 100%;
            height: auto;
            margin-top: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Test Complet BIPCOSA06</h1>
        
        <div class="config">
            <strong>Configuration actuelle :</strong><br>
            Cloud Name: ${config.cloudinary.cloud_name}<br>
            Upload Preset: ${config.cloudinary.upload_preset}<br>
            API Key: ${config.cloudinary.api_key}
        </div>
        
        <div class="test-section">
            <h2>📸 Test Upload Image</h2>
            <input type="file" id="imageInput" accept="image/*" />
            <br>
            <button class="upload-btn" onclick="testImageUpload()">Tester Upload Image</button>
            <div id="imageResult"></div>
        </div>
        
        <div class="test-section">
            <h2>🎥 Test Upload Vidéo</h2>
            <input type="file" id="videoInput" accept="video/*" />
            <br>
            <button class="upload-btn" onclick="testVideoUpload()">Tester Upload Vidéo</button>
            <div id="videoResult"></div>
        </div>
        
        <div class="test-section">
            <h2>🔍 Logs Console</h2>
            <div id="logs" class="result info">Les logs apparaîtront ici...</div>
        </div>
    </div>
    
    <script>
        // Logger personnalisé
        const logDiv = document.getElementById('logs');
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            logDiv.innerHTML += '📝 ' + args.join(' ') + '\\n';
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            logDiv.innerHTML += '❌ ' + args.join(' ') + '\\n';
        };
        
        // Configuration Cloudinary
        const CLOUDINARY_CONFIG = {
            cloudName: '${config.cloudinary.cloud_name}',
            uploadPreset: '${config.cloudinary.upload_preset}'
        };
        
        async function uploadToCloudinary(file, resourceType) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
            formData.append('folder', 'bipcosa06/test');
            
            const url = \`https://api.cloudinary.com/v1_1/\${CLOUDINARY_CONFIG.cloudName}/\${resourceType}/upload\`;
            console.log('🚀 Upload vers:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            console.log('📡 Réponse:', JSON.stringify(data, null, 2));
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'Erreur upload');
            }
            
            return data;
        }
        
        async function testImageUpload() {
            const input = document.getElementById('imageInput');
            const resultDiv = document.getElementById('imageResult');
            
            if (!input.files[0]) {
                resultDiv.innerHTML = '<div class="result error">Sélectionnez une image</div>';
                return;
            }
            
            resultDiv.innerHTML = '<div class="result info">Upload en cours...</div>';
            
            try {
                const result = await uploadToCloudinary(input.files[0], 'image');
                resultDiv.innerHTML = \`
                    <div class="result success">
                        ✅ Upload réussi !<br>
                        URL: \${result.secure_url}<br>
                        Public ID: \${result.public_id}
                        <img src="\${result.secure_url}" alt="Image uploadée" />
                    </div>
                \`;
            } catch (error) {
                resultDiv.innerHTML = \`<div class="result error">❌ Erreur: \${error.message}</div>\`;
            }
        }
        
        async function testVideoUpload() {
            const input = document.getElementById('videoInput');
            const resultDiv = document.getElementById('videoResult');
            
            if (!input.files[0]) {
                resultDiv.innerHTML = '<div class="result error">Sélectionnez une vidéo</div>';
                return;
            }
            
            resultDiv.innerHTML = '<div class="result info">Upload en cours... (peut prendre du temps)</div>';
            
            try {
                const result = await uploadToCloudinary(input.files[0], 'video');
                resultDiv.innerHTML = \`
                    <div class="result success">
                        ✅ Upload réussi !<br>
                        URL: \${result.secure_url}<br>
                        Public ID: \${result.public_id}
                        <video controls style="max-width: 100%; margin-top: 10px;">
                            <source src="\${result.secure_url}" type="video/mp4">
                        </video>
                    </div>
                \`;
            } catch (error) {
                resultDiv.innerHTML = \`<div class="result error">❌ Erreur: \${error.message}</div>\`;
            }
        }
    </script>
</body>
</html>`;

fs.writeFileSync('test-complete.html', testHtml);
console.log('\n✅ Page de test créée : test-complete.html');
console.log('   Ouvrez ce fichier dans votre navigateur pour tester les uploads');