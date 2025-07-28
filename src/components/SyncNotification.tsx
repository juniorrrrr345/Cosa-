'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{ $visible: boolean; $status: 'syncing' | 'synchronized' | 'error' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  padding: 15px;
  background: ${props => {
    switch(props.$status) {
      case 'syncing': return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
      case 'synchronized': return 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
      case 'error': return 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
      default: return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
    }
  }};
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  animation: ${props => props.$visible ? slideIn : slideOut} 0.3s ease-out;
  display: ${props => props.$visible ? 'block' : 'none'};
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Icon = styled.span<{ $status: 'syncing' | 'synchronized' | 'error' }>`
  font-size: 18px;
  ${props => props.$status === 'syncing' && `
    animation: spin 1s linear infinite;
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`;

const Message = styled.span`
  flex: 1;
`;

const Details = styled.div`
  font-size: 12px;
  opacity: 0.9;
  margin-top: 5px;
`;

interface SyncNotificationProps {}

const SyncNotification: React.FC<SyncNotificationProps> = () => {
  const [notification, setNotification] = useState<{
    visible: boolean;
    status: 'syncing' | 'synchronized' | 'error';
    message: string;
    details?: any;
  }>({
    visible: false,
    status: 'syncing',
    message: ''
  });

  useEffect(() => {
    const handleSyncStatus = (event: any) => {
      const { status, message, local, server } = event.detail;
      
      setNotification({
        visible: true,
        status,
        message,
        details: { local, server }
      });

      // Auto-masquer après 3 secondes pour les messages de succès
      if (status === 'synchronized') {
        setTimeout(() => {
          setNotification(prev => ({ ...prev, visible: false }));
        }, 3000);
      }
      
      // Auto-masquer après 5 secondes pour les erreurs
      if (status === 'error') {
        setTimeout(() => {
          setNotification(prev => ({ ...prev, visible: false }));
        }, 5000);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('syncStatusChanged', handleSyncStatus);
      
      return () => {
        window.removeEventListener('syncStatusChanged', handleSyncStatus);
      };
    }
  }, []);

  const getIcon = () => {
    switch(notification.status) {
      case 'syncing': return '🔄';
      case 'synchronized': return '✅';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  const formatDetails = () => {
    if (!notification.details?.local || !notification.details?.server) return null;
    
    const { local, server } = notification.details;
    return (
      <Details>
        Local: {local.products}P / {local.categories}C / {local.farms}F → 
        Serveur: {server.products}P / {server.categories}C / {server.farms}F
      </Details>
    );
  };

  return (
    <NotificationContainer 
      $visible={notification.visible} 
      $status={notification.status}
    >
      <NotificationContent>
        <Icon $status={notification.status}>
          {getIcon()}
        </Icon>
        <Message>{notification.message}</Message>
      </NotificationContent>
      {formatDetails()}
    </NotificationContainer>
  );
};

export default SyncNotification;