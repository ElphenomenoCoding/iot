import { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Hubs from './components/Hubs';
import Navigation from './components/Navigation';
import Settings from './components/Settings';
import Simulations from './components/Simulations';
import UserManagement from './components/UserManagement';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'logout') {
      setIsLoggedIn(false);
    } else {
      setCurrentTab(tab);
    }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
      {currentTab === 'dashboard' && <Dashboard />}
      {currentTab === 'hubs' && <Hubs />}
      {currentTab === 'users' && <UserManagement />}
      {currentTab === 'simulations' && <Simulations />}
      {currentTab === 'settings' && <Settings />}
    </div>
  );
}

export default App;