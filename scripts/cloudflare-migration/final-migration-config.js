/**
 * Configuration FINALE avec les VRAIS tokens Cloudflare
 * BIPCOSA06 - Migration complète
 */

module.exports = {
  boutique: {
    name: 'BIPCOSA06',
    github_repo: 'bipcosa06',
    folder_prefix: 'bipcosa06'
  },

  cloudflare: {
    accountId: '7979421604bd07b3bd34d3ed96222512',
    
    // TOKEN VIDÉO (Stream)
    videoToken: 'v1.0-0adb38df485d3d0888b0b922-5ac29b791eaf12b48dea2d5f3c1bf0680c0c8ab85b0b2d7f0edbf7b9684f79d71d4c3b8a9ebe8df4ec7ab5fcd2862fc01d1caf666e306b8d40f405a52926a3ce108bf1484f9ba3ade5',
    
    // TOKEN IMAGE
    imageToken: '8_sayjltoEjPdiyyPTDcr3YI7ikZpRypVmli5bOl',
    
    // URLs de base
    stream: {
      baseUrl: 'https://api.cloudflare.com/client/v4',
      iframeBaseUrl: 'https://iframe.videodelivery.net',
      uploadEndpoint: '/stream'
    },
    
    images: {
      baseUrl: 'https://api.cloudflare.com/client/v4',
      deliveryBaseUrl: 'https://imagedelivery.net',
      uploadEndpoint: '/images/v1'
    }
  }
};