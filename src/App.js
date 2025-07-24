import React, { useState } from 'react';
import InfoPage from './components/InfoPage';
import AdminPanel from './admin/AdminPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('info');

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  // Vérifier si on doit afficher le panel admin (par exemple avec un paramètre URL secret)
  const showAdmin = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('admin') === 'true' || currentView === 'admin';
  };

  // Fonction pour basculer vers l'admin (peut être appelée via console ou URL)
  const toggleAdmin = () => {
    setCurrentView(currentView === 'admin' ? 'info' : 'admin');
  };

  // Exposer la fonction toggleAdmin globalement pour pouvoir l'appeler depuis la console
  React.useEffect(() => {
    window.toggleAdmin = toggleAdmin;
    
    // Vérifier les paramètres URL au chargement
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setCurrentView('admin');
    }
  }, []);

  if (showAdmin() || currentView === 'admin') {
    return <AdminPanel onBack={() => setCurrentView('info')} />;
  }

  return (
    <div className="App">
      <InfoPage onNavigate={handleNavigation} />
      
      {/* Bouton secret pour accéder à l'admin - invisible mais cliquable */}
      <div
        onClick={toggleAdmin}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '50px',
          height: '50px',
          background: 'transparent',
          cursor: 'pointer',
          zIndex: 9999
        }}
        title="Accès admin (invisible)"
      />
    </div>
  );
}

export default App;