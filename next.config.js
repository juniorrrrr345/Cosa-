/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Désactivé pour permettre les API routes
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // distDir: 'out', // Utilisera .next par défaut
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'unsplash.com', 'res.cloudinary.com']
  },
  compiler: {
    styledComponents: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig