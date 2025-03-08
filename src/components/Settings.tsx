import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Clock, 
  Save, 
  AlertTriangle, 
  Droplet, 
  Wind, 
  Battery, 
  Users,
  Send,
  RefreshCcw,
  Gauge,
  ThermometerSun,
  Wifi
} from 'lucide-react';

interface ThresholdSetting {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  description: string;
}

interface DetectionSetting {
  id: string;
  name: string;
  enabled: boolean;
  sensitivity: number;
  icon: React.ReactNode;
  description: string;
}

const Settings: React.FC = () => {
  // Threshold Settings
  const [thresholds, setThresholds] = useState<ThresholdSetting[]>([
    {
      id: 'water-level',
      name: 'Water Level',
      value: 80,
      unit: '%',
      icon: <Droplet className="h-5 w-5" />,
      description: 'Alert when water level drops below threshold'
    },
    {
      id: 'air-quality',
      name: 'Air Quality',
      value: 75,
      unit: 'AQI',
      icon: <Wind className="h-5 w-5" />,
      description: 'Alert when air quality index exceeds threshold'
    },
    {
      id: 'battery',
      name: 'Battery Level',
      value: 20,
      unit: '%',
      icon: <Battery className="h-5 w-5" />,
      description: 'Alert when device battery falls below threshold'
    },
    {
      id: 'occupancy',
      name: 'Occupancy',
      value: 85,
      unit: '%',
      icon: <Users className="h-5 w-5" />,
      description: 'Alert when facility occupancy exceeds threshold'
    },
    {
      id: 'pressure',
      name: 'Water Pressure',
      value: 65,
      unit: 'PSI',
      icon: <Gauge className="h-5 w-5" />,
      description: 'Alert when water pressure falls outside normal range'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      value: 26,
      unit: '°C',
      icon: <ThermometerSun className="h-5 w-5" />,
      description: 'Alert when temperature exceeds comfort threshold'
    }
  ]);

  // Detection Settings
  const [detections, setDetections] = useState<DetectionSetting[]>([
    {
      id: 'motion',
      name: 'Motion Detection',
      enabled: true,
      sensitivity: 70,
      icon: <Users className="h-5 w-5" />,
      description: 'Detect movement in facility areas'
    },
    {
      id: 'leak',
      name: 'Leak Detection',
      enabled: true,
      sensitivity: 90,
      icon: <Droplet className="h-5 w-5" />,
      description: 'Detect water leaks and pipe issues'
    },
    {
      id: 'smoke',
      name: 'Smoke Detection',
      enabled: true,
      sensitivity: 95,
      icon: <Wind className="h-5 w-5" />,
      description: 'Detect smoke or unusual air quality changes'
    },
    {
      id: 'network',
      name: 'Network Monitoring',
      enabled: true,
      sensitivity: 80,
      icon: <Wifi className="h-5 w-5" />,
      description: 'Monitor IoT device connectivity'
    }
  ]);

  // Data Retrieval Settings
  const [dataRetrieval, setDataRetrieval] = useState({
    interval: 5,
    retryAttempts: 3,
    timeout: 30
  });

  // Broadcast Message
  const [broadcastMessage, setBroadcastMessage] = useState({
    message: '',
    priority: 'normal',
    expiration: '1'
  });

  const handleThresholdChange = (id: string, value: number) => {
    setThresholds(prev => prev.map(threshold => 
      threshold.id === id ? { ...threshold, value } : threshold
    ));
  };

  const handleDetectionToggle = (id: string) => {
    setDetections(prev => prev.map(detection =>
      detection.id === id ? { ...detection, enabled: !detection.enabled } : detection
    ));
  };

  const handleSensitivityChange = (id: string, sensitivity: number) => {
    setDetections(prev => prev.map(detection =>
      detection.id === id ? { ...detection, sensitivity } : detection
    ));
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the message to all users
    alert('Broadcast message sent to all users!');
    setBroadcastMessage({ message: '', priority: 'normal', expiration: '1' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure system parameters and notifications</p>
      </div>

      {/* Alarm Thresholds */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
          <h2 className="text-lg font-semibold">Alarm Thresholds</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thresholds.map(threshold => (
            <div key={threshold.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                {threshold.icon}
                <span className="ml-2 font-medium">{threshold.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{threshold.description}</p>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={threshold.value}
                  onChange={(e) => handleThresholdChange(threshold.id, parseInt(e.target.value))}
                  className="flex-1 mr-3"
                />
                <span className="text-sm font-medium w-16">{threshold.value}{threshold.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Detection Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detections.map(detection => (
            <div key={detection.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {detection.icon}
                  <span className="ml-2 font-medium">{detection.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={detection.enabled}
                    onChange={() => handleDetectionToggle(detection.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-3">{detection.description}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sensitivity:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={detection.sensitivity}
                  onChange={(e) => handleSensitivityChange(detection.id, parseInt(e.target.value))}
                  disabled={!detection.enabled}
                  className="flex-1 mr-3"
                />
                <span className="text-sm font-medium w-12">{detection.sensitivity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Retrieval Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <RefreshCcw className="h-6 w-6 text-green-500 mr-2" />
          <h2 className="text-lg font-semibold">Data Retrieval Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Interval (minutes)
            </label>
            <select
              value={dataRetrieval.interval}
              onChange={(e) => setDataRetrieval(prev => ({ ...prev, interval: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retry Attempts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={dataRetrieval.retryAttempts}
              onChange={(e) => setDataRetrieval(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (seconds)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={dataRetrieval.timeout}
              onChange={(e) => setDataRetrieval(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Broadcast Message */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <MessageSquare className="h-6 w-6 text-purple-500 mr-2" />
          <h2 className="text-lg font-semibold">Broadcast Message</h2>
        </div>
        <form onSubmit={handleBroadcastSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={broadcastMessage.message}
                onChange={(e) => setBroadcastMessage(prev => ({ ...prev, message: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Enter message to broadcast to all users..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={broadcastMessage.priority}
                onChange={(e) => setBroadcastMessage(prev => ({ ...prev, priority: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration (hours)
              </label>
              <select
                value={broadcastMessage.expiration}
                onChange={(e) => setBroadcastMessage(prev => ({ ...prev, expiration: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1">1 hour</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;