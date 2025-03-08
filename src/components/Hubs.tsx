import {
    AlertCircle,
    ArrowRight,
    Bath,
    ChevronRight,
    Droplet,
    Eye,
    MapPin,
    Minus,
    Plus,
    RefreshCw,
    Scissors,
    Search,
    Settings,
    Thermometer,
    User,
    Wifi,
    WifiOff,
    Wind,
    X
} from 'lucide-react';
import React, { useState } from 'react';

// Types
interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    x: number;
    y: number;
  };
  hubCount: number;
}

interface Equipment {
  id: string;
  type: 'toilet_paper' | 'soap' | 'paper_towel' | 'water_sensor' | 'air_quality' | 'temperature';
  name: string;
  status: 'online' | 'offline' | 'warning';
  currentLevel?: number;
  capacity?: number;
  lastReading?: {
    value: number;
    unit: string;
    timestamp: string;
  };
}

interface Alert {
  id: string;
  timestamp: string;
  type: 'low_level' | 'offline' | 'malfunction' | 'maintenance_needed';
  equipmentId: string;
  equipmentName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolvedAt?: string;
}

interface Intervention {
  id: string;
  timestamp: string;
  employeeId: string;
  employeeName: string;
  type: 'refill' | 'repair' | 'inspection' | 'cleaning';
  equipmentId: string;
  equipmentName: string;
  notes: string;
  duration: number; // minutes
}

interface Hub {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastActive: string;
  equipments: Equipment[];
  alerts: Alert[];
  interventions: Intervention[];
}

interface EquipmentType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  unit?: string;
}

// Sample data
const mockLocations: Location[] = [
  { 
    id: '1', 
    name: 'Airport Terminal A', 
    address: '123 Airport Way, Terminal A', 
    coordinates: { x: 150, y: 120 }, 
    hubCount: 6 
  },
  { 
    id: '2', 
    name: 'Airport Terminal B', 
    address: '123 Airport Way, Terminal B',
    coordinates: { x: 280, y: 100 }, 
    hubCount: 4 
  },
  { 
    id: '3', 
    name: 'Central Train Station', 
    address: '45 Railway Ave, Central Station',
    coordinates: { x: 100, y: 220 },
    hubCount: 8 
  },
  { 
    id: '4', 
    name: 'North Train Station', 
    address: '22 North Line, Train Station',
    coordinates: { x: 320, y: 180 },
    hubCount: 5 
  },
  { 
    id: '5', 
    name: 'Grand Hotel', 
    address: '1 Luxury Boulevard, Downtown',
    coordinates: { x: 220, y: 250 },
    hubCount: 12 
  },
  { 
    id: '6', 
    name: 'Plaza Hotel', 
    address: '34 Plaza Street, Downtown',
    coordinates: { x: 380, y: 260 },
    hubCount: 7 
  },
  { 
    id: '7', 
    name: 'Shopping Mall Central', 
    address: '67 Shopping Center Blvd',
    coordinates: { x: 160, y: 320 },
    hubCount: 9 
  },
  { 
    id: '8', 
    name: 'Metro Station Main', 
    address: '89 Underground Street',
    coordinates: { x: 300, y: 350 },
    hubCount: 6 
  }
];

const equipmentTypes: EquipmentType[] = [
  { 
    id: 'toilet_paper', 
    name: 'Toilet Paper Sensor', 
    icon: <Bath className="h-6 w-6" />,
    description: 'Monitors toilet paper roll levels and alerts when replacement is needed.',
    unit: 'rolls'
  },
  { 
    id: 'soap', 
    name: 'Soap Dispenser Sensor',
    icon: <Droplet className="h-6 w-6" />,
    description: 'Tracks soap dispenser levels and usage patterns.',
    unit: 'ml'
  },
  { 
    id: 'paper_towel', 
    name: 'Paper Towel Sensor',
    icon: <Scissors className="h-6 w-6" />,
    description: 'Monitors paper towel availability and consumption rates.',
    unit: 'sheets'
  },
  { 
    id: 'water_sensor', 
    name: 'Water Flow Sensor',
    icon: <Droplet className="h-6 w-6" />,
    description: 'Measures water usage and detects potential leaks or abnormal flows.',
    unit: 'L/h'
  },
  { 
    id: 'air_quality', 
    name: 'Air Quality Sensor',
    icon: <Wind className="h-6 w-6" />,
    description: 'Monitors air quality, humidity, and detects odors.',
    unit: 'AQI'
  },
  { 
    id: 'temperature', 
    name: 'Temperature Sensor',
    icon: <Thermometer className="h-6 w-6" />,
    description: 'Tracks ambient temperature for comfort and energy management.',
    unit: '°C'
  }
];

// Create test hub with all equipment types and statuses
const createTestHub = (): Hub => {
  return {
    id: 'hub-1-1', 
    name: 'Terminal A Hub 1 (Test)',
    status: 'warning',
    lastActive: '2 minutes ago',
    equipments: [
      // Online equipment
      { 
        id: 'eq-1-1-1', 
        type: 'toilet_paper', 
        name: 'Toilet Paper Sensor 1', 
        status: 'online', 
        currentLevel: 78,
        capacity: 100
      },
      { 
        id: 'eq-1-1-2', 
        type: 'soap', 
        name: 'Soap Dispenser 1', 
        status: 'online', 
        currentLevel: 820,
        capacity: 1000
      },
      { 
        id: 'eq-1-1-3', 
        type: 'water_sensor', 
        name: 'Water Flow 1', 
        status: 'online', 
        lastReading: { 
          value: 123, 
          unit: 'L/h', 
          timestamp: '2 minutes ago' 
        }
      },
      // Warning equipment
      { 
        id: 'eq-1-1-4', 
        type: 'paper_towel', 
        name: 'Paper Towel Sensor 1', 
        status: 'warning', 
        currentLevel: 15,
        capacity: 100
      },
      { 
        id: 'eq-1-1-5', 
        type: 'soap', 
        name: 'Soap Dispenser 2', 
        status: 'warning', 
        currentLevel: 120,
        capacity: 1000
      },
      // Offline equipment
      { 
        id: 'eq-1-1-6', 
        type: 'air_quality', 
        name: 'Air Quality Monitor 1', 
        status: 'offline',
        lastReading: { 
          value: 45, 
          unit: 'AQI', 
          timestamp: '2 hours ago' 
        }
      },
      { 
        id: 'eq-1-1-7', 
        type: 'temperature', 
        name: 'Temperature Sensor 1', 
        status: 'offline',
        lastReading: { 
          value: 22.5, 
          unit: '°C', 
          timestamp: '2 hours ago' 
        }
      }
    ],
    alerts: [
      {
        id: 'alert-1',
        timestamp: '2023-07-15T08:30:00Z',
        type: 'low_level',
        equipmentId: 'eq-1-1-4',
        equipmentName: 'Paper Towel Sensor 1',
        message: 'Paper towel level below 20%',
        severity: 'medium',
        resolved: false
      },
      {
        id: 'alert-2',
        timestamp: '2023-07-15T06:45:00Z',
        type: 'low_level',
        equipmentId: 'eq-1-1-5',
        equipmentName: 'Soap Dispenser 2',
        message: 'Soap level below 15%',
        severity: 'medium',
        resolved: false
      },
      {
        id: 'alert-3',
        timestamp: '2023-07-14T22:15:00Z',
        type: 'offline',
        equipmentId: 'eq-1-1-6',
        equipmentName: 'Air Quality Monitor 1',
        message: 'Device went offline',
        severity: 'high',
        resolved: false
      },
      {
        id: 'alert-4',
        timestamp: '2023-07-14T22:14:00Z',
        type: 'offline',
        equipmentId: 'eq-1-1-7',
        equipmentName: 'Temperature Sensor 1',
        message: 'Device went offline',
        severity: 'high',
        resolved: false
      },
      {
        id: 'alert-5',
        timestamp: '2023-07-14T14:30:00Z',
        type: 'low_level',
        equipmentId: 'eq-1-1-2',
        equipmentName: 'Soap Dispenser 1',
        message: 'Soap level below 10%',
        severity: 'medium',
        resolved: true,
        resolvedAt: '2023-07-14T16:45:00Z'
      }
    ],
    interventions: [
      {
        id: 'interv-1',
        timestamp: '2023-07-14T16:30:00Z',
        employeeId: 'emp-1',
        employeeName: 'John Smith',
        type: 'refill',
        equipmentId: 'eq-1-1-2',
        equipmentName: 'Soap Dispenser 1',
        notes: 'Refilled soap dispenser to full capacity',
        duration: 15
      },
      {
        id: 'interv-2',
        timestamp: '2023-07-14T10:15:00Z',
        employeeId: 'emp-2',
        employeeName: 'Maria Garcia',
        type: 'inspection',
        equipmentId: 'eq-1-1-3',
        equipmentName: 'Water Flow 1',
        notes: 'Routine inspection, all systems working correctly',
        duration: 25
      },
      {
        id: 'interv-3',
        timestamp: '2023-07-13T14:45:00Z',
        employeeId: 'emp-3',
        employeeName: 'David Chen',
        type: 'cleaning',
        equipmentId: 'eq-1-1-1',
        equipmentName: 'Toilet Paper Sensor 1',
        notes: 'Cleaned sensor and surrounding area',
        duration: 20
      },
      {
        id: 'interv-4',
        timestamp: '2023-07-12T09:30:00Z',
        employeeId: 'emp-1',
        employeeName: 'John Smith',
        type: 'repair',
        equipmentId: 'eq-1-1-6',
        equipmentName: 'Air Quality Monitor 1',
        notes: 'Replaced faulty sensor component',
        duration: 45
      }
    ]
  };
};

// Create the full mock hubs data with the test hub
const mockHubs: Record<string, Hub[]> = {
  '1': [
    createTestHub(),
    { 
      id: 'hub-1-2', 
      name: 'Terminal A Hub 2',
      status: 'warning',
      lastActive: '5 minutes ago',
      equipments: [
        { id: 'eq-1-2-1', type: 'toilet_paper', name: 'Toilet Paper Sensor 2', status: 'warning', currentLevel: 15, capacity: 100 },
        { id: 'eq-1-2-2', type: 'paper_towel', name: 'Paper Towel Sensor 1', status: 'online', currentLevel: 68, capacity: 100 }
      ],
      alerts: [],
      interventions: []
    },
    { 
      id: 'hub-1-3', 
      name: 'Terminal A Hub 3',
      status: 'offline',
      lastActive: '2 hours ago',
      equipments: [
        { id: 'eq-1-3-1', type: 'air_quality', name: 'Air Quality Monitor 1', status: 'offline' },
        { id: 'eq-1-3-2', type: 'temperature', name: 'Temperature Sensor 1', status: 'offline' }
      ],
      alerts: [],
      interventions: []
    }
  ],
  '5': [
    { 
      id: 'hub-5-1', 
      name: 'Grand Hotel Hub 1',
      status: 'online',
      lastActive: '1 minute ago',
      equipments: [
        { id: 'eq-5-1-1', type: 'toilet_paper', name: 'Toilet Paper Sensor 1', status: 'online', currentLevel: 91, capacity: 100 },
        { id: 'eq-5-1-2', type: 'soap', name: 'Soap Dispenser 1', status: 'online', currentLevel: 870, capacity: 1000 },
        { id: 'eq-5-1-3', type: 'temperature', name: 'Temperature Sensor 1', status: 'online', lastReading: { value: 22.5, unit: '°C', timestamp: '1 minute ago' } }
      ],
      alerts: [],
      interventions: []
    }
  ]
};

const Hubs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(mockLocations[0]); // Default to first location
  const [selectedHub, setSelectedHub] = useState<Hub | null>(mockHubs[mockLocations[0].id][0]); // Default to first hub
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [newEquipmentType, setNewEquipmentType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'equipment' | 'alerts' | 'interventions'>('equipment');

  // Filter locations based on search term
  const filteredLocations = mockLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get hubs for selected location
  const locationHubs = selectedLocation ? (mockHubs[selectedLocation.id] || []) : [];

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    const firstHub = mockHubs[location.id]?.[0] || null;
    setSelectedHub(firstHub);
    setSelectedEquipment(null);
  };

  const handleHubSelect = (hub: Hub) => {
    setSelectedHub(hub);
    setShowAddEquipment(false);
    setSelectedEquipment(null);
  };

  const handleAddEquipment = () => {
    setShowAddEquipment(true);
  };

  const handleEquipmentTypeSelect = (typeId: string) => {
    setNewEquipmentType(typeId);
    setIsAddingEquipment(true);
  };

  const handleAddEquipmentConfirm = () => {
    // In a real app, this would save the new equipment to the backend
    setShowAddEquipment(false);
    setIsAddingEquipment(false);
    setNewEquipmentType('');
    
    // Show notification of success
    alert('New equipment added successfully!');
  };

  const handleRemoveEquipment = () => {
    if (window.confirm('Are you sure you want to remove this equipment?')) {
      // In a real app, this would remove the equipment from the backend
      alert('Equipment removed successfully!');
    }
  };

  const handleEquipmentSelect = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Equipment config component
  const EquipmentConfig = () => {
    if (!newEquipmentType) return null;
    
    const selectedType = equipmentTypes.find(type => type.id === newEquipmentType);
    if (!selectedType) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Configure {selectedType.name}</h2>
            <button onClick={() => setIsAddingEquipment(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                placeholder={`New ${selectedType.name}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Description</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g., Restroom 3, North Wall"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold (%)</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="20"
                  className="flex-grow mr-3"
                />
                <span className="text-sm w-10">20%</span>
              </div>
            </div>
            
            {selectedType.unit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity ({selectedType.unit})</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  placeholder={`Capacity in ${selectedType.unit}`}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Polling Frequency</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddEquipmentConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Equipment
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get the consumable level status
  const getConsumableLevelStatus = (currentLevel: number, capacity: number) => {
    const percentage = (currentLevel / capacity) * 100;
    if (percentage <= 15) return 'low';
    if (percentage <= 30) return 'medium';
    return 'good';
  };

  // Get color class for consumable level
  const getConsumableLevelColor = (status: string) => {
    switch(status) {
      case 'low': return 'text-red-600';
      case 'medium': return 'text-amber-500';
      case 'good': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8 px-8">
        <h1 className="text-2xl font-bold text-gray-900">Hub Management</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor and manage IoT hubs and connected equipment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Location Selection */}
        <div className="lg:col-span-1 px-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Location</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search locations..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredLocations.map(location => (
                <div 
                  key={location.id}
                  className={`p-3 rounded-md cursor-pointer mb-2 flex items-center justify-between ${
                    selectedLocation?.id === location.id 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <div>
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.address}</div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">{location.hubCount} hubs</div>
                </div>
              ))}
            </div>
          </div>

          {selectedLocation && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{selectedLocation.name}</h2>
                <p className="text-sm text-gray-500">{selectedLocation.address}</p>
              </div>
              
              <h3 className="text-md font-medium mb-3">Available Hubs</h3>
              {locationHubs.length > 0 ? (
                <div className="space-y-3">
                  {locationHubs.map(hub => (
                    <div 
                      key={hub.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedHub?.id === hub.id 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleHubSelect(hub)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{hub.name}</div>
                        <div className={`flex items-center ${
                          hub.status === 'online' ? 'text-green-600' : 
                          hub.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {hub.status === 'online' ? (
                            <Wifi className="h-4 w-4 mr-1" />
                          ) : (
                            <WifiOff className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-sm capitalize">{hub.status}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Last active: {hub.lastActive}
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-gray-500">
                          {hub.equipments.length} devices
                        </div>
                        {hub.alerts.filter(a => !a.resolved).length > 0 && (
                          <div className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                            {hub.alerts.filter(a => !a.resolved).length} alerts
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No hubs available at this location.</div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Equipment and History Details */}
        <div className="lg:col-span-4 pr-8">
          {selectedHub ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selectedHub.name}</h2>
                  <div className={`flex items-center text-sm mt-1 ${
                    selectedHub.status === 'online' ? 'text-green-600' : 
                    selectedHub.status === 'warning' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {selectedHub.status === 'online' ? (
                      <Wifi className="h-4 w-4 mr-1" />
                    ) : (
                      <WifiOff className="h-4 w-4 mr-1" />
                    )}
                    <span className="capitalize">{selectedHub.status}</span>
                    <span className="text-gray-500 ml-2">Last active: {selectedHub.lastActive}</span>
                  </div>
                </div>
                <button 
                  onClick={handleAddEquipment}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Equipment
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('equipment')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'equipment'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Equipment ({selectedHub.equipments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'alerts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Alerts ({selectedHub.alerts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('interventions')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'interventions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Interventions ({selectedHub.interventions.length})
                  </button>
                </nav>
              </div>

              {/* Equipment Tab Content */}
              {activeTab === 'equipment' && (
                <>
                  {/* Equipment Status Overview */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h3 className="text-green-800 font-medium mb-2">Online</h3>
                      <div className="text-3xl font-bold text-green-600">
                        {selectedHub.equipments.filter(e => e.status === 'online').length}
                      </div>
                      <p className="text-sm text-green-700 mt-1">Fully operational</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <h3 className="text-amber-800 font-medium mb-2">Warning</h3>
                      <div className="text-3xl font-bold text-amber-600">
                        {selectedHub.equipments.filter(e => e.status === 'warning').length}
                      </div>
                      <p className="text-sm text-amber-700 mt-1">Require attention</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <h3 className="text-red-800 font-medium mb-2">Offline</h3>
                      <div className="text-3xl font-bold text-red-600">
                        {selectedHub.equipments.filter(e => e.status === 'offline').length}
                      </div>
                      <p className="text-sm text-red-700 mt-1">Not responding</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Connected Equipment</h3>
                  
                  {/* Categorized Equipment Display */}
                  {['warning', 'offline', 'online'].map(status => {
                    const equipmentsByStatus = selectedHub.equipments.filter(e => e.status === status);
                    if (equipmentsByStatus.length === 0) return null;
                    
                    return (
                      <div key={status} className="mb-6">
                        <h4 className={`font-medium mb-3 flex items-center ${
                          status === 'online' ? 'text-green-700' :
                          status === 'warning' ? 'text-amber-700' : 'text-red-700'
                        }`}>
                          {status === 'online' ? (
                            <Wifi className="h-4 w-4 mr-2" />
                          ) : status === 'warning' ? (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          ) : (
                            <WifiOff className="h-4 w-4 mr-2" />
                          )}
                          <span className="capitalize">{status}</span>&nbsp;Equipment
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {equipmentsByStatus.map((equipment: Equipment) => {
                            const equipType = equipmentTypes.find(type => type.id === equipment.type);
                            
                            return (
                              <div 
                                key={equipment.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                  status === 'warning' ? 'border-amber-300 bg-amber-50' :
                                  status === 'offline' ? 'border-red-300 bg-red-50' :
                                  'border-green-300 bg-green-50'
                                } ${
                                  selectedEquipment?.id === equipment.id ? 'shadow-md transform scale-105' : 'hover:shadow-sm'
                                }`}
                                onClick={() => handleEquipmentSelect(equipment)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start">
                                    <div className={`p-3 rounded-full mr-3 ${
                                      status === 'online' ? 'bg-green-100' : 
                                      status === 'warning' ? 'bg-amber-100' : 'bg-red-100'
                                    }`}>
                                      {equipType?.icon || <Settings className="h-6 w-6" />}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{equipment.name}</div>
                                      <div className="text-sm text-gray-600 mt-1">{equipType?.name || 'Unknown Device'}</div>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      handleRemoveEquipment();
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                  >
                                    <Minus className="h-5 w-5" />
                                  </button>
                                </div>
                                
                                {/* Consumable Level Display */}
                                {equipment.currentLevel !== undefined && equipment.capacity !== undefined && (
                                  <div className="mt-4">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-medium">
                                        Current Level:
                                      </span>
                                      <span className={`text-sm font-medium ${
                                        getConsumableLevelColor(getConsumableLevelStatus(equipment.currentLevel, equipment.capacity))
                                      }`}>
                                        {Math.round((equipment.currentLevel / equipment.capacity) * 100)}% 
                                        ({equipment.currentLevel} {equipType?.unit})
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div 
                                        className={`h-2.5 rounded-full ${
                                          getConsumableLevelStatus(equipment.currentLevel, equipment.capacity) === 'good' ? 'bg-green-500' :
                                          getConsumableLevelStatus(equipment.currentLevel, equipment.capacity) === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${(equipment.currentLevel / equipment.capacity) * 100}%` }}
                                      ></div>
                                    </div>
                                    {getConsumableLevelStatus(equipment.currentLevel, equipment.capacity) !== 'good' && (
                                      <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        <span>
                                          {getConsumableLevelStatus(equipment.currentLevel, equipment.capacity) === 'low' 
                                            ? 'Refill needed soon!' 
                                            : 'Consider scheduling a refill'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Sensor Reading Display */}
                                {equipment.lastReading && (
                                  <div className="mt-3 text-sm text-gray-700 bg-white p-2 rounded border">
                                    <div className="font-medium">Last Reading:</div>
                                    <div className="flex justify-between mt-1">
                                      <span>{equipment.lastReading.value} {equipment.lastReading.unit}</span>
                                      <span className="text-gray-500">{equipment.lastReading.timestamp}</span>
                                    </div>
                                  </div>
                                )}

                                {equipment.status === 'online' && (
                                  <div className="mt-3">
                                    <button className="w-full flex justify-center items-center text-sm px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                                      <RefreshCw className="h-3 w-3 mr-2" />
                                      Update Status
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              {/* Alerts Tab Content */}
              {activeTab === 'alerts' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Alert History</h3>
                    <div className="flex space-x-2">
                      <button className="flex items-center text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        <span>All</span>
                      </button>
                      <button className="flex items-center text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                        <span>Unresolved</span>
                      </button>
                      <button className="flex items-center text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                        <span>Resolved</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedHub.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(alert => (
                          <tr key={alert.id} className={alert.resolved ? 'bg-gray-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(alert.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {alert.equipmentName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {alert.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center text-xs ${
                                alert.resolved ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {alert.resolved ? (
                                  <>
                                    <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                                    Resolved {alert.resolvedAt && `(${formatDate(alert.resolvedAt)})`}
                                  </>
                                ) : (
                                  <>
                                    <span className="w-2 h-2 mr-1.5 rounded-full bg-red-500"></span>
                                    Unresolved
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {!alert.resolved && (
                                <button className="text-blue-600 hover:text-blue-800">
                                  Resolve
                                </button>
                              )}
                              {alert.resolved && (
                                <button className="text-gray-500">
                                  View details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Interventions Tab Content */}
              {activeTab === 'interventions' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Intervention History</h3>
                    <button className="flex items-center text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Log New Intervention
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedHub.interventions
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(intervention => (
                        <div key={intervention.id} className="bg-white p-4 rounded-lg border shadow-sm">
                          <div className="flex justify-between">
                            <div className="flex items-start">
                              <div className={`p-2 rounded-full mr-3 ${
                                intervention.type === 'refill' ? 'bg-green-100' :
                                intervention.type === 'repair' ? 'bg-red-100' :
                                intervention.type === 'inspection' ? 'bg-blue-100' :
                                'bg-purple-100'
                              }`}>
                                {intervention.type === 'refill' ? (
                                  <RefreshCw className="h-5 w-5 text-green-600" />
                                ) : intervention.type === 'repair' ? (
                                  <Settings className="h-5 w-5 text-red-600" />
                                ) : intervention.type === 'inspection' ? (
                                  <Eye className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Settings className="h-5 w-5 text-purple-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1)}: {intervention.equipmentName}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {formatDate(intervention.timestamp)} • {intervention.duration} minutes
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                  <User className="h-4 w-4 mr-1" />
                                  <span>{intervention.employeeName}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                  {intervention.notes}
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                <span>Details</span>
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
              <MapPin className="h-12 w-12 text-blue-200 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Hub Selected</h3>
              <p className="text-gray-500 text-center">
                Please select a location and hub from the left panel to view equipment details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Palette - shows when adding equipment */}
      {showAddEquipment && (
        <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg z-40 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Add Equipment</h3>
            <button 
              onClick={() => setShowAddEquipment(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {equipmentTypes.map(type => (
              <div 
                key={type.id}
                className="border rounded-md p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleEquipmentTypeSelect(type.id)}
              >
                <div className="flex items-center">
                  <div className="p-1 rounded-full bg-blue-100">
                    {type.icon}
                  </div>
                  <div className="ml-3 font-medium">{type.name}</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{type.description}</p>
                {type.unit && (
                  <div className="mt-1 text-xs text-blue-600">Measures in: {type.unit}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Configuration Modal */}
      {isAddingEquipment && <EquipmentConfig />}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        `
      }} />
    </div>
  );
};

export default Hubs;