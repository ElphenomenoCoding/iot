import { Bath, Club as Hub, LayoutDashboard, PlaySquare, Settings, Users } from 'lucide-react';
import React from 'react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'hubs', name: 'Hubs', icon: Hub },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'simulations', name: 'Simulations', icon: PlaySquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Bath className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">IoT Toilets</span>
          </div>
          
          <div className="hidden md:flex space-x-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => onTabChange('logout')}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;