/**
 * Composant d'upload vers Cloudflare pour le panel admin
 * BIPCOSA06
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface CloudflareUploaderProps {
  onUploadSuccess: (data: any) => void;
  productName?: string;
  acceptVideo?: boolean;
  acceptImage?: boolean;
}

const UploaderContainer = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
  }
  
  &.dragging {
    border-color: #2196F3;
    background: rgba(33, 150, 243, 0.1);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 8px 0;
`;

const UploadHint = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress}%;
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #2196F3);
    transition: width 0.3s ease;
  }
`;

const StatusMessage = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  
  ${props => {
    switch(props.$type) {
      case 'success':
        return `
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          border: 1px solid #4CAF50;
        `;
      case 'error':
        return `
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
          border: 1px solid #f44336;
        `;
      default:
        return `
          background: rgba(33, 150, 243, 0.2);
          color: #2196F3;
          border: 1px solid #2196F3;
        `;
    }
  }}
`;

const PreviewContainer = styled.div`
  margin-top: 20px;
  
  img, video {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
  }
  
  iframe {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 8px;
    border: none;
  }
`;

const UploadedInfo = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  text-align: left;
  
  h4 {
    color: #4CAF50;
    margin: 0 0 12px 0;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
    
    .value {
      color: white;
      font-size: 14px;
      font-family: monospace;
      word-break: break-all;
    }
  }
`;

const CopyButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  
  &:hover {
    background: #45a049;
  }
`;

export default function CloudflareUploader({
  onUploadSuccess,
  productName,
  acceptVideo = true,
  acceptImage = true
}: CloudflareUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Vérifier le type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (isVideo && !acceptVideo) {
      setStatus({ type: 'error', message: 'Les vidéos ne sont pas acceptées' });
      return;
    }

    if (isImage && !acceptImage) {
      setStatus({ type: 'error', message: 'Les images ne sont pas acceptées' });
      return;
    }

    if (!isVideo && !isImage) {
      setStatus({ type: 'error', message: 'Type de fichier non supporté' });
      return;
    }

    // Reset state
    setStatus(null);
    setUploadedData(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      setStatus({ type: 'info', message: `Upload vers Cloudflare ${isVideo ? 'Stream' : 'Images'}...` });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', isVideo ? 'video' : 'image');
      if (productName) {
        formData.append('productName', productName);
      }

      // Simuler la progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/upload/cloudflare', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        setStatus({ type: 'success', message: `✅ ${isVideo ? 'Vidéo' : 'Image'} uploadée avec succès!` });
        setUploadedData(result);
        onUploadSuccess(result);
      } else {
        throw new Error(result.error || 'Erreur upload');
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: `❌ Erreur: ${error.message}` });
      console.error('Erreur upload:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setStatus({ type: 'success', message: '✅ Copié dans le presse-papier!' });
    setTimeout(() => setStatus(null), 2000);
  };

  const getAcceptTypes = () => {
    const types: string[] = [];
    if (acceptVideo) types.push('video/*');
    if (acceptImage) types.push('image/*');
    return types.join(',');
  };

  return (
    <div>
      <UploaderContainer
        className={isDragging ? 'dragging' : ''}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <UploadIcon>
          {isUploading ? '⏳' : '☁️'}
        </UploadIcon>
        
        <UploadText>
          {isUploading 
            ? 'Upload en cours...' 
            : 'Cliquez ou glissez un fichier ici'
          }
        </UploadText>
        
        <UploadHint>
          {acceptVideo && acceptImage && 'Vidéos et images acceptées'}
          {acceptVideo && !acceptImage && 'Vidéos uniquement'}
          {!acceptVideo && acceptImage && 'Images uniquement'}
        </UploadHint>
        
        {productName && (
          <UploadHint>
            Produit: <strong>{productName}</strong>
          </UploadHint>
        )}
        
        {uploadProgress > 0 && (
          <ProgressBar $progress={uploadProgress} />
        )}
      </UploaderContainer>

      {status && (
        <StatusMessage $type={status.type}>
          {status.message}
        </StatusMessage>
      )}

      {uploadedData && (
        <>
          <PreviewContainer>
            {uploadedData.type === 'video' ? (
              <iframe
                src={uploadedData.url}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Vidéo uploadée"
              />
            ) : (
              <img src={uploadedData.url} alt="Image uploadée" />
            )}
          </PreviewContainer>

          <UploadedInfo>
            <h4>🎉 Upload réussi!</h4>
            
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">
                {uploadedData.type === 'video' ? '📹 Vidéo' : '🖼️ Image'}
              </span>
            </div>
            
            <div className="info-row">
              <span className="label">ID:</span>
              <span className="value">
                {uploadedData.id}
                <CopyButton onClick={() => copyToClipboard(uploadedData.id)}>
                  Copier
                </CopyButton>
              </span>
            </div>
            
            <div className="info-row">
              <span className="label">URL:</span>
              <span className="value">
                {uploadedData.url.substring(0, 50)}...
                <CopyButton onClick={() => copyToClipboard(uploadedData.url)}>
                  Copier
                </CopyButton>
              </span>
            </div>
            
            {uploadedData.type === 'image' && uploadedData.variants && (
              <>
                <div className="info-row">
                  <span className="label">Thumbnail:</span>
                  <span className="value">
                    <CopyButton onClick={() => copyToClipboard(uploadedData.variants.thumbnail)}>
                      Copier URL
                    </CopyButton>
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="label">Large:</span>
                  <span className="value">
                    <CopyButton onClick={() => copyToClipboard(uploadedData.variants.large)}>
                      Copier URL
                    </CopyButton>
                  </span>
                </div>
              </>
            )}
          </UploadedInfo>
        </>
      )}
    </div>
  );
}