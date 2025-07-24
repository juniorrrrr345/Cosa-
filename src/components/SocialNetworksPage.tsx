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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
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
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
    paddingBottom: '80px'
  };
};

const PageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  background: transparent;
  border-bottom: none;
  
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

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 160px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
`;

const SocialGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SocialCard = styled.a`
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 25px;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    border-color: #4ecdc4;
    box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const SocialEmoji = styled.div`
  font-size: 40px;
  min-width: 60px;
  text-align: center;
`;

const SocialInfo = styled.div`
  flex: 1;
`;

const SocialName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: white;
`;

const SocialDescription = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  margin: 0;
`;

const SocialLink = styled.div`
  font-size: 12px;
  color: #4ecdc4;
  margin-top: 5px;
  word-break: break-all;
`;

const BackButton = styled.button`
  background: rgba(0,0,0,0.7);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0,0,0,0.9);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  color: rgba(255,255,255,0.8);
  font-size: 16px;
  margin: 0;
`;

interface SocialNetworksPageProps {
  onBack: () => void;
}

const SocialNetworksPage: React.FC<SocialNetworksPageProps> = ({ onBack }) => {
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

  // Fonction pour charger les données avec priorité localStorage pour config
  const loadData = async () => {
    try {
      console.log('📥 SocialNetworksPage - Chargement des données...');
      
      // Charger config en priorité depuis localStorage (panel admin)
      let configData;
      if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('bipcosa06_config');
        if (storedConfig) {
          try {
            configData = JSON.parse(storedConfig);
            console.log('📥 SocialNetworksPage - Config depuis localStorage (panel admin):', configData);
          } catch (e) {
            console.error('❌ Erreur parsing config localStorage');
          }
        }
      }
      
      // Si pas de config localStorage, utiliser l'API
      if (!configData) {
        configData = await dataService.getConfig();
        console.log('📥 SocialNetworksPage - Config depuis API:', configData);
      }
      
      const socialData = dataService.getSocialNetworksSync();
      
      setConfig(configData);
      setSocialNetworks(socialData);
      
      console.log('✅ SocialNetworksPage - Données chargées:', {
        config: configData,
        socialNetworks: socialData.length
      });
    } catch (error) {
      console.error('❌ SocialNetworksPage - Erreur lors du chargement:', error);
      setSocialNetworks([]);
    }
  };

  const activeSocialNetworks = socialNetworks
    .filter(network => network.isActive)
    .sort((a, b) => a.order - b.order);

  const getSocialDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      'Telegram': 'Contactez-nous directement sur Telegram',
      'WhatsApp': 'Discutez avec nous sur WhatsApp',
      'Instagram': 'Suivez-nous sur Instagram',
      'Discord': 'Rejoignez notre serveur Discord',
      'Facebook': 'Aimez notre page Facebook',
      'Twitter': 'Suivez-nous sur Twitter',
      'TikTok': 'Nos vidéos sur TikTok',
      'Snapchat': 'Ajoutez-nous sur Snapchat'
    };
    
    return descriptions[name] || `Retrouvez-nous sur ${name}`;
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
      </PageHeader>
      
      <ContentWrapper>
        <BackButton onClick={onBack}>
          ← Retour à la boutique
        </BackButton>

        <Header>
          <Title>🌐 Nos Réseaux Sociaux</Title>
          <Subtitle>
            Suivez-nous et restez connectés avec {config.shopName || 'BIPCOSA06'}
          </Subtitle>
        </Header>

        {activeSocialNetworks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📱</EmptyIcon>
            <EmptyText>
              Aucun réseau social configuré pour le moment.<br />
              Revenez bientôt pour nous suivre !
            </EmptyText>
          </EmptyState>
        ) : (
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
                  <SocialDescription>
                    {getSocialDescription(network.name)}
                  </SocialDescription>
                  <SocialLink>
                    {network.url.replace(/^https?:\/\//, '')}
                  </SocialLink>
                </SocialInfo>
              </SocialCard>
                    ))}
      </SocialGrid>
    )}
    </ContentWrapper>
  </div>
);
};

export default SocialNetworksPage;