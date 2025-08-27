const fetch = require('node-fetch');
const config = require('./config');

async function listVideos() {
  console.log('📹 Listing all videos on Cloudflare Stream for BIPCOSA06\n');
  
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/stream?per_page=100`,
    {
      headers: {
        'Authorization': `Bearer ${config.cloudflare.apiToken}`
      }
    }
  );
  
  const data = await response.json();
  
  if (response.ok && data.result) {
    console.log(`Total videos: ${data.result.length}\n`);
    
    // Grouper par boutique si possible
    const byBoutique = {};
    
    data.result.forEach(video => {
      const name = video.meta?.name || video.uid;
      const boutique = video.meta?.boutique || 'non-classé';
      
      if (!byBoutique[boutique]) {
        byBoutique[boutique] = [];
      }
      
      byBoutique[boutique].push({
        name: name,
        id: video.uid,
        url: `https://iframe.videodelivery.net/${video.uid}`,
        uploaded: video.uploaded,
        duration: video.duration,
        size: video.size
      });
    });
    
    // Afficher par boutique
    Object.keys(byBoutique).forEach(boutique => {
      console.log(`\n📁 ${boutique.toUpperCase()} (${byBoutique[boutique].length} vidéos)`);
      console.log('='.repeat(50));
      
      byBoutique[boutique].slice(0, 5).forEach(video => {
        console.log(`  📹 ${video.name}`);
        console.log(`     ID: ${video.id}`);
        console.log(`     URL: ${video.url}`);
        if (video.duration) {
          console.log(`     Durée: ${Math.round(video.duration)}s`);
        }
        console.log('');
      });
      
      if (byBoutique[boutique].length > 5) {
        console.log(`  ... et ${byBoutique[boutique].length - 5} autres vidéos`);
      }
    });
    
    // Sauvegarder la liste complète
    const fs = require('fs').promises;
    await fs.writeFile(
      'cloudflare-videos-list.json',
      JSON.stringify(data.result, null, 2)
    );
    console.log('\n✅ Liste complète sauvegardée dans cloudflare-videos-list.json');
  }
}

listVideos().catch(console.error);
