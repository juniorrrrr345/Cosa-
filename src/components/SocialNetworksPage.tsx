import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SocialNetwork } from '@/models/SocialNetwork';
import { ShopConfig } from '@/services/dataService';
import dataService from '@/services/dataService';

// Fonction pour obtenir le style de background directement
const getBackgroundStyle = (config?: ShopConfig): React.CSSProperties => {
  console.log('🎨 SocialNetworksPage getBackgroundStyle - Config reçue:', config);
  
  if (!config) {
    console.log('🎨 SocialNetworksPage - Pas de config, background transparent');
    return {
      background: 'transparent',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    };
  }
  
  let backgroundValue = 'transparent';
  
  // URL externe (Imgur, etc.) - PRIORITÉ 1
  if (config.backgroundType === 'url' && config.backgroundUrl && config.backgroundUrl.trim()) {
    const safeUrl = config.backgroundUrl.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 SocialNetworksPage - Background URL externe:', safeUrl);
  }
  // Image Cloudinary - PRIORITÉ 2
  else if (config.backgroundType === 'image' && config.backgroundImage && config.backgroundImage.trim()) {
    const safeUrl = config.backgroundImage.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 SocialNetworksPage - Background Image Cloudinary:', safeUrl);
  }
  // Dégradé - PRIORITÉ 3
  else if (config.backgroundType === 'gradient') {
    backgroundValue = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
    console.log('🎨 SocialNetworksPage - Background dégradé');
  }
  
  return {
    background: backgroundValue,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
    paddingBottom: '80px',
    overflowX: 'hidden',
    boxSizing: 'border-box'
  };
};

const PageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  background: transparent;
  border-bottom: none;
  position: relative;
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 10px 15px;
  }
`;

const LogoImage = styled.img`
  height: 120px;
  max-width: 500px;
  width: auto;
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.9));
  transition: transform 0.3s ease, filter 0.3s ease;
  
  /* Tablette */
  @media (max-width: 768px) {
    height: 100px;
    max-width: 400px;
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    height: 80px;
    max-width: 300px;
  }
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 30px rgba(0,0,0,1));
  }
`;

const Content = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: calc(100vh - 200px);
  justify-content: center;
  align-items: center;
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 20px 15px;
    gap: 20px;
  }
`;

const SocialSection = styled.div`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 30px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 600px;

  &:hover {
    background: rgba(0,0,0,0.8);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 20px;
    margin: 0 10px;
  }
`;

const SocialHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  /* Mobile */
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SocialTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: white;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
  text-align: center;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 20px;
    margin: 0 0 15px 0;
  }
`;

const SocialDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  margin: 0 0 20px 0;
  text-align: center;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 14px;
    margin: 0 0 15px 0;
  }
`;

const SocialGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  
  /* Mobile */
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const SocialCard = styled.a`
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 20px;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: #4ecdc4;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(78, 205, 196, 0.2);
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    padding: 15px;
    gap: 12px;
    border-radius: 12px;
  }
`;

const SocialEmoji = styled.div`
  font-size: 32px;
  min-width: 50px;
  text-align: center;
  flex-shrink: 0;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 28px;
    min-width: 45px;
  }
`;

const SocialInfo = styled.div`
  flex: 1;
`;

const SocialName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: white;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 15px;
    margin: 0 0 4px 0;
  }
`;

const SocialCardDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
  line-height: 1.4;
`;

const SocialLink = styled.div`
  font-size: 12px;
  color: #4ecdc4;
  margin-top: 5px;
  word-break: break-word;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 11px;
    margin-top: 4px;
  }
`;

const BackButton = styled.button`
  background: rgba(0,0,0,0.7);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 8px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: absolute;
  left: 20px;
  top: 15px;
  z-index: 1000;
  
  &:hover {
    background: rgba(0,0,0,0.9);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
  }
  
  /* Mobile */
  @media (max-width: 480px) {
    left: 15px;
    top: 10px;
    padding: 6px 12px;
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(0,0,0,0.5);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  
  h3 {
    font-size: 24px;
    margin-bottom: 15px;
    color: rgba(255,255,255,0.9);
  }
  
  p {
    font-size: 16px;
    color: rgba(255,255,255,0.7);
  }
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: 15px;
  }
`;

const EmptyText = styled.p`
  color: rgba(255,255,255,0.8);
  font-size: 16px;
  margin: 0;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

interface SocialNetworksPageProps {
  onBack: () => void;
}

const SocialNetworksPage: React.FC<SocialNetworksPageProps> = ({ onBack }) => {
  // Démarrer complètement vide - AUCUN contenu par défaut
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);

  useEffect(() => {
    loadData();

    // Écouter UNIQUEMENT les changements de configuration depuis le panel admin
    const handleConfigChanged = (event: any) => {
      console.log('🔄 SocialNetworksPage - Config changée via panel admin:', event.detail);
      setConfig(event.detail);
      // FORCER le re-render immédiat
      setTimeout(() => {
        console.log('⚡ SocialNetworksPage - Forçage du refresh UI');
        setConfig({ ...event.detail }); // Force une nouvelle référence
      }, 50);
    };
    
    window.addEventListener('bipcosa06ConfigChanged', handleConfigChanged);
    window.addEventListener('dataUpdated', loadData);
    
    return () => {
      window.removeEventListener('bipcosa06ConfigChanged', handleConfigChanged);
      window.removeEventListener('dataUpdated', loadData);
    };
  }, []);

  // Charger les données depuis l'API MongoDB
  const loadData = async () => {
    try {
      console.log('📥 SocialNetworksPage - Chargement depuis API MongoDB...');
      
      // Charger depuis l'API MongoDB, pas localStorage
      const [configRes, socialRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/social-networks')
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);
        console.log('⚙️ Config chargée depuis MongoDB');
      }

      if (socialRes.ok) {
        const socialData = await socialRes.json();
        setSocialNetworks(socialData);
        console.log('📱 Réseaux sociaux chargés depuis MongoDB:', socialData.length);
      }
      
      console.log('✅ SocialNetworksPage - Données chargées depuis MongoDB');
    } catch (error) {
      console.error('❌ Erreur chargement réseaux sociaux depuis API:', error);
    }
  };

  const activeSocialNetworks = socialNetworks
    .filter(network => network.isActive)
    .sort((a, b) => a.order - b.order);

  const getSocialDescription = (network: SocialNetwork): string => {
    // Utiliser UNIQUEMENT la description du panel admin
    return network.description || '';
  };

  const handleSocialClick = (url: string, name: string) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      console.log(`🔗 Ouverture ${name}:`, url);
    } catch (error) {
      console.error('❌ Erreur ouverture lien:', error);
    }
  };

  // Déterminer le style de fond
  const getBackgroundStyle = () => {
    console.log('🎨 SocialNetworksPage getBackgroundStyle - Config:', config);
    
    if (config.backgroundType === 'url' && config.backgroundUrl) {
      console.log('🎨 SocialNetworksPage - Background URL externe:', config.backgroundUrl);
      return { 
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${config.backgroundUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    if (config.backgroundType === 'image' && config.backgroundImage) {
      console.log('🎨 SocialNetworksPage - Background Image Cloudinary:', config.backgroundImage);
      return { 
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${config.backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    console.log('🎨 SocialNetworksPage - Background dégradé par défaut, type:', config.backgroundType);
    return { 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' 
    };
  };

  return (
    <div style={getBackgroundStyle(config)}>
      {/* Header avec logo */}
      <PageHeader>
        <LogoImage src="https://i.imgur.com/b1O92qz.jpeg" alt="Logo" />
        <BackButton onClick={onBack}>
          ← Retour à la boutique
        </BackButton>
      </PageHeader>
      
      <Content>
        {activeSocialNetworks.length > 0 ? (
          <SocialSection>
            <SocialGrid>
              {activeSocialNetworks.map((network) => (
                  <SocialCard
                    key={network.id}
                    onClick={() => handleSocialClick(network.url, network.name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSocialClick(network.url, network.name);
                      }
                    }}
                  >
                    <SocialEmoji>{network.emoji}</SocialEmoji>
                    <SocialInfo>
                      <SocialName>{network.name}</SocialName>
                                          <SocialCardDescription>
                      {getSocialDescription(network)}
                    </SocialCardDescription>
                      <SocialLink>
                        {network.url.replace(/^https?:\/\//, '')}
                      </SocialLink>
                    </SocialInfo>
                  </SocialCard>
                                ))}
              </SocialGrid>
          </SocialSection>
        ) : null}
      </Content>
    </div>
  );
};

export default SocialNetworksPage;