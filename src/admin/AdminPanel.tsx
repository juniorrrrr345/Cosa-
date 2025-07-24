'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { configService, Config } from '@/services/configService';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const AdminHeader = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const ConfigSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 50px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-right: 10px;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PreviewButton = styled(Button)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
`;

const PreviewContainer = styled.div<{ $backgroundImage?: string | null; $backgroundColor?: string }>`
  background: ${props => props.$backgroundImage 
    ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${props.$backgroundImage})`
    : props.$backgroundColor || '#1a1a1a'};
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  padding: 30px;
  color: white;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PreviewLogo = styled.div`
  font-size: 60px;
  font-weight: 900;
  background: linear-gradient(45deg, #ffd700, #ffed4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
`;

const PreviewTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 5px;
  letter-spacing: 1px;
`;

const PreviewSubtitle = styled.p`
  opacity: 0.8;
  font-size: 14px;
`;

const BackButton = styled(Button)`
  background: linear-gradient(135deg, #fc466b 0%, #3f5efb 100%);
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
`;

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [config, setConfig] = useState<Config>(configService.getConfig());
  const [previewMode, setPreviewMode] = useState(false);

  // États pour les formulaires
  const [shopName, setShopName] = useState(config.shopName);
  const [shopDescription, setShopDescription] = useState(config.shopDescription);
  const [backgroundColor, setBackgroundColor] = useState(config.backgroundColor);
  const [backgroundImage, setBackgroundImage] = useState(config.backgroundImage);

  useEffect(() => {
    const loadedConfig = configService.getConfig();
    setConfig(loadedConfig);
    setShopName(loadedConfig.shopName);
    setShopDescription(loadedConfig.shopDescription);
    setBackgroundColor(loadedConfig.backgroundColor);
    setBackgroundImage(loadedConfig.backgroundImage);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      const newConfig = configService.saveConfig({
        shopName,
        shopDescription,
        backgroundColor,
        backgroundImage
      });
      setConfig(newConfig);
      alert('Configuration sauvegardée avec succès !');
    } catch (error) {
      alert('Erreur lors de la sauvegarde : ' + (error as Error).message);
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(null);
  };

  return (
    <AdminContainer>
      <BackButton onClick={onBack}>← Retour</BackButton>
      
      <AdminHeader>
        <Title>🛠️ Panel d&apos;Administration</Title>
        <Subtitle>Configurez l&apos;apparence de votre boutique CANAGOOD 69</Subtitle>
      </AdminHeader>

      <ConfigSection>
        <SectionTitle>🏪 Informations de la Boutique</SectionTitle>
        
        <FormGroup>
          <Label>Nom de la boutique</Label>
          <Input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="CANAGOOD 69"
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Input
            type="text"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            placeholder="mini-application"
          />
        </FormGroup>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>🎨 Configuration du Background</SectionTitle>
        
        <FormGroup>
          <Label>Couleur de fond (utilisée si aucune image n&apos;est définie)</Label>
          <ColorInput
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Image de fond (optionnel)</Label>
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {backgroundImage && (
            <div style={{ marginTop: '10px' }}>
              <small style={{ color: '#666' }}>Image chargée</small>
              <Button onClick={handleRemoveBackground} style={{ marginLeft: '10px', fontSize: '12px', padding: '6px 12px' }}>
                Supprimer
              </Button>
            </div>
          )}
        </FormGroup>

        <div style={{ marginTop: '30px' }}>
          <PreviewButton onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? 'Masquer l\'aperçu' : 'Aperçu'}
          </PreviewButton>
          <SaveButton onClick={handleSave}>
            Sauvegarder
          </SaveButton>
        </div>
      </ConfigSection>

      {previewMode && (
        <ConfigSection>
          <SectionTitle>👀 Aperçu</SectionTitle>
          <PreviewContainer 
            $backgroundImage={backgroundImage}
            $backgroundColor={backgroundColor}
          >
            <PreviewLogo>69</PreviewLogo>
            <PreviewTitle>{shopName}</PreviewTitle>
            <PreviewSubtitle>{shopDescription}</PreviewSubtitle>
          </PreviewContainer>
        </ConfigSection>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;