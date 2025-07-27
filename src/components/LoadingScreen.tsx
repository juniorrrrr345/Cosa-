'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { dataService, ShopConfig } from '@/services/dataService';

// Animation de rotation pour le loader
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Animation de pulsation pour le logo
const pulse = keyframes`
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
`;

// Animation de fade-in pour les éléments
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Container principal avec le même système de background que HomePage
const LoadingContainer = styled.div<{ $backgroundStyle: React.CSSProperties }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => props.$backgroundStyle.background || 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

// Overlay pour assurer la lisibilité
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3));
  z-index: -1;
`;

// Content container
const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  text-align: center;
  padding: 20px;
  max-width: 400px;
  
  /* Mobile */
  @media (max-width: 480px) {
    gap: 25px;
    padding: 15px;
    max-width: 300px;
  }
`;

// Logo avec animation
const LogoContainer = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Logo = styled.img`
  height: 120px;
  width: auto;
  filter: drop-shadow(0 0 30px rgba(0,0,0,0.9));
  
  /* Mobile */
  @media (max-width: 480px) {
    height: 100px;
  }
`;

// Titre de chargement
const LoadingTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 20px rgba(255,255,255,0.3);
  animation: ${fadeIn} 1s ease-out;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

// Sous-titre
const LoadingSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  color: rgba(255,255,255,0.9);
  animation: ${fadeIn} 1s ease-out 0.3s both;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

// Container du loader
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: ${fadeIn} 1s ease-out 0.6s both;
`;

// Spinner de chargement
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid #4ecdc4;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  
  /* Mobile */
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    border-width: 2px;
  }
`;

// Texte de progression
const ProgressText = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.5px;
  
  /* Mobile */
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

// Points de chargement animés
const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: ${keyframes`
      0%, 20% { content: ''; }
      40% { content: '.'; }
      60% { content: '..'; }
      80%, 100% { content: '...'; }
    `} 1.5s infinite;
  }
`;

// Fonction pour obtenir le style de background (identique à HomePage)
const getBackgroundStyle = (config?: ShopConfig): React.CSSProperties => {
  console.log('🎨 LoadingScreen getBackgroundStyle - Config reçue:', config);
  
  if (!config) {
    return {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    };
  }
  
  let backgroundValue = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
  
  // URL externe (Imgur, etc.) - PRIORITÉ 1
  if (config.backgroundType === 'url' && config.backgroundUrl && config.backgroundUrl.trim()) {
    const safeUrl = config.backgroundUrl.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 LoadingScreen - Background URL externe:', safeUrl);
  }
  // Image Cloudinary - PRIORITÉ 2
  else if (config.backgroundType === 'image' && config.backgroundImage && config.backgroundImage.trim()) {
    const safeUrl = config.backgroundImage.replace(/['"]/g, '');
    backgroundValue = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${safeUrl}")`;
    console.log('🎨 LoadingScreen - Background Image Cloudinary:', safeUrl);
  }
  // Dégradé - PRIORITÉ 3
  else if (config.backgroundType === 'gradient') {
    backgroundValue = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)';
    console.log('🎨 LoadingScreen - Background dégradé');
  }
  
  return {
    background: backgroundValue,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  };
};

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  shopName?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete, 
  shopName = "BIPCOSA06" 
}) => {
  const [config, setConfig] = useState<ShopConfig>({} as ShopConfig);
  const [loadingText, setLoadingText] = useState('Chargement');
  const [progress, setProgress] = useState(0);

  // Charger la configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configData = await dataService.getConfig();
        setConfig(configData);
        console.log('✅ LoadingScreen - Config chargée:', configData);
      } catch (error) {
        console.error('❌ LoadingScreen - Erreur chargement config:', error);
      }
    };
    
    loadConfig();
  }, []);

  // Simulation du chargement avec étapes
  useEffect(() => {
    const loadingSteps = [
      { text: 'Initialisation', duration: 800 },
      { text: 'Chargement des données', duration: 1000 },
      { text: 'Configuration de l\'interface', duration: 700 },
      { text: 'Préparation de la boutique', duration: 900 },
      { text: 'Finalisation', duration: 600 }
    ];

    let currentStep = 0;
    let totalProgress = 0;

    const executeStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);
        
        // Animation de progression
        const stepProgress = 100 / loadingSteps.length;
        const startProgress = totalProgress;
        const endProgress = totalProgress + stepProgress;
        
        let currentProgress = startProgress;
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= endProgress) {
            currentProgress = endProgress;
            clearInterval(progressInterval);
          }
          setProgress(currentProgress);
        }, 50);

        setTimeout(() => {
          totalProgress += stepProgress;
          currentStep++;
          executeStep();
        }, step.duration);
      } else {
        // Chargement terminé
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    };

    // Démarrer le processus de chargement
    const startDelay = setTimeout(executeStep, 500);

    return () => {
      clearTimeout(startDelay);
    };
  }, [onLoadingComplete]);

  const backgroundStyle = getBackgroundStyle(config);

  return (
    <LoadingContainer $backgroundStyle={backgroundStyle}>
      <Overlay />
      
      <LoadingContent>
        <LogoContainer>
          <Logo 
            src="https://i.imgur.com/b1O92qz.jpeg" 
            alt={`${shopName} Logo`}
            onError={(e) => {
              // Fallback si l'image ne charge pas
              e.currentTarget.style.display = 'none';
            }}
          />
        </LogoContainer>

        <LoadingTitle>
          {config.shopName || shopName}
        </LoadingTitle>

        <LoadingSubtitle>
          Votre boutique de confiance
        </LoadingSubtitle>

        <LoaderContainer>
          <Spinner />
          
          <ProgressText>
            {loadingText}<LoadingDots />
          </ProgressText>

          {/* Barre de progression optionnelle */}
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4ecdc4',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </LoaderContainer>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default LoadingScreen;