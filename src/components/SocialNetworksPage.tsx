import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SocialNetwork } from '@/models/SocialNetwork';
import { ShopConfig } from '@/services/dataService';
import dataService from '@/services/dataService';

const SocialContainer = styled.div<{ $bgType?: string; $bgColor?: string; $bgImage?: string; $bgUrl?: string }>`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  
  ${({ $bgType, $bgColor, $bgImage, $bgUrl }) => {
    if ($bgType === 'url' && $bgUrl) {
      return `background: url('${$bgUrl}') center/cover;`;
    }
    if ($bgType === 'image' && $bgImage) {
      return `background: url('${$bgImage}') center/cover;`;
    }
    return `background: ${$bgColor || 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'};`;
  }}
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
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
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-bottom: 30px;

  &:hover {
    background: rgba(255,255,255,0.2);
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
  }, []);

  const loadData = async () => {
    try {
      const [networksData, configData] = await Promise.all([
        dataService.getSocialNetworks(),
        dataService.getConfig()
      ]);
      
      setSocialNetworks(networksData);
      setConfig(configData);
    } catch (error) {
      console.error('❌ Erreur chargement réseaux sociaux:', error);
      // Fallback sur les données par défaut
      setSocialNetworks(dataService.getSocialNetworksSync());
      setConfig(dataService.getConfigSync());
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
    if (config.backgroundType === 'url' && config.backgroundUrl) {
      return { backgroundImage: `url('${config.backgroundUrl}')` };
    }
    if (config.backgroundType === 'image' && config.backgroundImage) {
      return { backgroundImage: `url('${config.backgroundImage}')` };
    }
    return { 
      background: config.backgroundColor || 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' 
    };
  };

  return (
    <SocialContainer 
      style={getBackgroundStyle()}
      $bgType={config.backgroundType}
      $bgColor={config.backgroundColor}
      $bgImage={config.backgroundImage}
      $bgUrl={config.backgroundUrl}
    >
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
    </SocialContainer>
  );
};

export default SocialNetworksPage;