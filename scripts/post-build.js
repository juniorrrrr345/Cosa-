#!/usr/bin/env node

// Script post-build pour BIPCOSA06 sur Vercel
const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');
const outDir = path.join(process.cwd(), 'out');

// Créer le dossier out s'il n'existe pas
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copier les manifests depuis .next vers out
const sourceRoutesManifest = path.join(nextDir, 'routes-manifest.json');
const targetRoutesManifest = path.join(outDir, 'routes-manifest.json');

if (fs.existsSync(sourceRoutesManifest)) {
  fs.copyFileSync(sourceRoutesManifest, targetRoutesManifest);
  console.log('✅ routes-manifest.json copié vers out/');
} else {
  // Créer routes-manifest.json si manquant
  const routesManifest = {
    version: 3,
    pages404: true,
    basePath: "",
    redirects: [],
    rewrites: [],
    headers: [],
    staticRoutes: [
      {
        page: "/",
        regex: "^\\/$"
      },
      {
        page: "/_not-found",
        regex: "^\\/_not-found$"
      }
    ],
    dynamicRoutes: []
  };

  fs.writeFileSync(targetRoutesManifest, JSON.stringify(routesManifest, null, 2));
  console.log('✅ routes-manifest.json créé dans out/');
}

// Copier prerender-manifest
const sourcePrerenderManifest = path.join(nextDir, 'prerender-manifest.json');
const targetPrerenderManifest = path.join(outDir, 'prerender-manifest.json');

if (fs.existsSync(sourcePrerenderManifest)) {
  fs.copyFileSync(sourcePrerenderManifest, targetPrerenderManifest);
  console.log('✅ prerender-manifest.json copié vers out/');
} else {
  // Créer prerender-manifest.json si manquant
  const prerenderManifest = {
    version: 4,
    routes: {
      "/": {
        initialRevalidateSeconds: false,
        srcRoute: "/",
        dataRoute: null
      }
    },
    dynamicRoutes: {},
    notFoundRoutes: [],
    preview: {
      previewModeId: "",
      previewModeSigningKey: "",
      previewModeEncryptionKey: ""
    }
  };

  fs.writeFileSync(targetPrerenderManifest, JSON.stringify(prerenderManifest, null, 2));
  console.log('✅ prerender-manifest.json créé dans out/');
}

// Copier le fichier HTML principal si il existe
const sourceHtml = path.join(nextDir, 'server', 'app', 'index.html');
const targetHtml = path.join(outDir, 'index.html');

if (fs.existsSync(sourceHtml)) {
  fs.copyFileSync(sourceHtml, targetHtml);
  console.log('✅ index.html copié vers out/');
}

// Copier les ressources statiques
const staticDir = path.join(nextDir, 'static');
const outStaticDir = path.join(outDir, '_next', 'static');

if (fs.existsSync(staticDir)) {
  fs.mkdirSync(path.dirname(outStaticDir), { recursive: true });
  
  function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(item => {
        copyRecursive(path.join(src, item), path.join(dest, item));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  copyRecursive(staticDir, outStaticDir);
  console.log('✅ Ressources statiques copiées vers out/');
}

console.log('🚀 BIPCOSA06 - Post-build completed successfully!');