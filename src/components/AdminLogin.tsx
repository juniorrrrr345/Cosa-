'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface AdminLoginProps {
  onLogin: () => void;
}

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(0,0,0,0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  margin: 0 0 30px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #333, #555);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(135deg, #444, #666);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff6b6b;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    border-color: rgba(255,255,255,0.4);
    color: white;
  }
`;

const ADMIN_PASSWORD = 'AdminJunior123';

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'une vérification async
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Stocker l'authentification
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminSessionTime', Date.now().toString());
        onLogin();
      } else {
        setError('Mot de passe incorrect. Veuillez réessayer.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleBackToShop = () => {
    window.location.href = '/';
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>🔐 ADMIN BIPCOSA06</Title>
        <Subtitle>Accès sécurisé au panel d'administration</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Mot de passe administrateur</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe admin"
              disabled={isLoading}
              autoFocus
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading || !password.trim()}>
            {isLoading ? '🔄 Vérification...' : '🚀 Accéder au Panel'}
          </LoginButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>

        <BackButton onClick={handleBackToShop}>
          ← Retour à la boutique
        </BackButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;