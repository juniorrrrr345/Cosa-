/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'unsplash.com']
  },
  // Optimisations pour Vercel (sans optimizeCss qui cause des problèmes)
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Variables d'environnement avec valeurs par défaut
  env: {
    VERCEL_URL: process.env.VERCEL_URL || '',
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || ''
  },
  // Désactiver les headers pour l'export statique
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig