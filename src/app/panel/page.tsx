'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '@/admin/AdminPanel';

export default function PanelPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  useEffect(() => {
    // Marquer que nous sommes en mode admin
    localStorage.setItem('adminMode', 'true');
    
    // Optionnel: nettoyer quand on quitte la page
    return () => {
      localStorage.removeItem('adminMode');
    };
  }, []);

  return <AdminPanel onBack={handleBack} />;
}