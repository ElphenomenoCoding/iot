import {
    CheckSquare,
    ChevronDown,
    Clock,
    Code,
    Copy,
    PlaySquare,
    Plus,
    RotateCw,
    Save,
    Server,
    Tag,
    Trash2,
    X
} from 'lucide-react';
import React, { useState } from 'react';

// Types
interface Location {
  id: string;
  name: string;
  address: string;
}

interface Hub {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
}

// C Language-like type options
type CDataType = 'int' | 'float' | 'double' | 'char' | 'string' | 'bool' | 'long' | 'short' | 'unsigned int';

interface SimulationInput {
  id: string;
  name: string;
  type: CDataType;
  value: string;
  description: string;
}

interface SimulationConfig {
  id: string;
  name: string;
  hubs: string[];
  inputs: SimulationInput[];
  createdAt: string;
  lastRun?: string;
}

// Mock data
const mockLocations: Location[] = [
  { id: '1', name: 'Airport Terminal A', address: '123 Airport Way, Terminal A' },
  { id: '2', name: 'Airport Terminal B', address: '123 Airport Way, Terminal B' },
  { id: '3', name: 'Central Train Station', address: '45 Railway Ave, Central Station' },
  { id: '4', name: 'North Train Station', address: '22 North Line, Train Station' },
  { id: '5', name: 'Grand Hotel', address: '1 Luxury Boulevard, Downtown' },
  { id: '6', name: 'Plaza Hotel', address: '34 Plaza Street, Downtown' },
  { id: '7', name: 'Shopping Mall Central', address: '67 Shopping Center Blvd' },
  { id: '8', name: 'Metro Station Main', address: '89 Underground Street' }
];

const mockHubs: Hub[] = [
  { id: 'hub-1-1', name: 'Terminal A Hub 1', location: '1', status: 'online' },
  { id: 'hub-1-2', name: 'Terminal A Hub 2', location: '1', status: 'warning' },
  { id: 'hub-1-3', name: 'Terminal A Hub 3', location: '1', status: 'offline' },
  { id: 'hub-2-1', name: 'Terminal B Hub 1', location: '2', status: 'online' },
  { id: 'hub-2-2', name: 'Terminal B Hub 2', location: '2', status: 'online' },
  { id: 'hub-3-1', name: 'Central Station Hub 1', location: '3', status: 'online' },
  { id: 'hub-3-2', name: 'Central Station Hub 2', location: '3', status: 'online' },
  { id: 'hub-5-1', name: 'Grand Hotel Hub 1', location: '5', status: 'online' }
];

// Saved simulations
const savedSimulations: SimulationConfig[] = [
  {
    id: 'sim-1',
    name: 'High Traffic Simulation',
    hubs: ['hub-1-1', 'hub-1-2'],
    inputs: [
      { id: 'inp-1', name: 'userCount', type: 'int', value: '500', description: 'Number of users per hour' },
      { id: 'inp-2', name: 'waterUsage', type: 'float', value: '1.5', description: 'Average water usage in liters' },
      { id: 'inp-3', name: 'soapConsumption', type: 'float', value: '0.75', description: 'Soap used per visit (ml)' }
    ],
    createdAt: '2023-07-01T10:30:00Z',
    lastRun: '2023-07-10T15:45:00Z'
  },
  {
    id: 'sim-2',
    name: 'Low Resource Scenario',
    hubs: ['hub-5-1'],
    inputs: [
      { id: 'inp-1', name: 'paperLevel', type: 'int', value: '15', description: 'Initial paper level (%)' },
      { id: 'inp-2', name: 'soapLevel', type: 'int', value: '25', description: 'Initial soap level (%)' },
      { id: 'inp-3', name: 'refillDelay', type: 'int', value: '120', description: 'Minutes until refill' }
    ],
    createdAt: '2023-07-05T09:15:00Z'
  }
];

const dataTypeOptions: { value: CDataType; label: string }[] = [
  { value: 'int', label: 'Integer (int)' },
  { value: 'float', label: 'Float (float)' },
  { value: 'double', label: 'Double (double)' },
  { value: 'char', label: 'Character (char)' },
  { value: 'string', label: 'String (char*)' },
  { value: 'bool', label: 'Boolean (bool)' },
  { value: 'long', label: 'Long Integer (long)' },
  { value: 'short', label: 'Short Integer (short)' },
  { value: 'unsigned int', label: 'Unsigned Integer (unsigned int)' }
];

const Simulations: React.FC = () => {
  // Component state
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedHubs, setSelectedHubs] = useState<string[]>([]);
  const [simulationName, setSimulationName] = useState<string>('New Simulation');
  const [inputs, setInputs] = useState<SimulationInput[]>([]);
  const [showSavedSimulations, setShowSavedSimulations] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSimulationId, setCurrentSimulationId] = useState<string | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState<boolean>(true);

  // Get available hubs for selected location
  const availableHubs = selectedLocation 
    ? mockHubs.filter(hub => hub.location === selectedLocation)
    : [];

  // Filter locations based on search term
  const filteredLocations = mockLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate unique ID
  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Add new input field
  const handleAddInput = () => {
    const newInput: SimulationInput = {
      id: generateId('inp'),
      name: `param${inputs.length + 1}`,
      type: 'int',
      value: '',
      description: ''
    };
    setInputs([...inputs, newInput]);
  };

  // Remove input field
  const handleRemoveInput = (id: string) => {
    setInputs(inputs.filter(input => input.id !== id));
  };

  // Update input field
  const handleInputChange = (id: string, field: keyof SimulationInput, value: string) => {
    setInputs(inputs.map(input => 
      input.id === id ? { ...input, [field]: value } : input
    ));
  };

  // Toggle hub selection
  const handleHubToggle = (hubId: string) => {
    if (selectedHubs.includes(hubId)) {
      setSelectedHubs(selectedHubs.filter(id => id !== hubId));
    } else {
      setSelectedHubs([...selectedHubs, hubId]);
    }
  };

  // Select all hubs in location
  const handleSelectAllHubs = () => {
    setSelectedHubs(availableHubs.map(hub => hub.id));
  };

  // Deselect all hubs
  const handleDeselectAllHubs = () => {
    setSelectedHubs([]);
  };

  // Load a saved simulation
  const handleLoadSimulation = (simulation: SimulationConfig) => {
    const locationId = mockHubs.find(hub => simulation.hubs.includes(hub.id))?.location || '';
    
    setSelectedLocation(locationId);
    setSelectedHubs(simulation.hubs);
    setSimulationName(simulation.name);
    setInputs(simulation.inputs);
    setCurrentSimulationId(simulation.id);
    setIsEditing(true);
    setShowSavedSimulations(false);
  };

  // Create new simulation
  const handleNewSimulation = () => {
    setSelectedLocation('');
    setSelectedHubs([]);
    setSimulationName('New Simulation');
    setInputs([]);
    setCurrentSimulationId(null);
    setIsEditing(false);
  };

  // Save simulation
  const handleSaveSimulation = () => {
    // In a real app, this would save to a backend
    alert(`Simulation "${simulationName}" saved successfully!`);
  };

  // Run simulation
  const handleRunSimulation = () => {
    // In a real app, this would trigger the simulation on the backend
    alert(`Running simulation "${simulationName}" on ${selectedHubs.length} hubs...`);
  };

  // Generate current simulation JSON
  const generateSimulationJson = () => {
    const simulationData = {
      name: simulationName,
      hubs: selectedHubs,
      inputs: inputs.map(input => ({
        name: input.name,
        type: input.type,
        value: formatValueByType(input.value, input.type)
      })),
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(simulationData, null, 2);
  };

  // Format value based on type for JSON preview
  const formatValueByType = (value: string, type: CDataType) => {
    if (value === '') return null;
    
    switch (type) {
      case 'int':
      case 'long':
      case 'short':
      case 'unsigned int':
        return parseInt(value, 10) || 0;
      case 'float':
      case 'double':
        return parseFloat(value) || 0.0;
      case 'bool':
        return value.toLowerCase() === 'true' || value === '1';
      case 'char':
        return value.charAt(0) || '';
      default:
        return value;
    }
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(generateSimulationJson())
      .then(() => {
        alert('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8 px-8">
        <h1 className="text-2xl font-bold text-gray-900">Simulation Management</h1>
        <p className="mt-1 text-sm text-gray-500">Create and run simulations for your IoT hubs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <PlaySquare className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold">{isEditing ? 'Edit Simulation' : 'Create New Simulation'}</h2>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleNewSimulation}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  New
                </button>
                <button 
                  onClick={() => setShowSavedSimulations(true)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Load
                </button>
              </div>
            </div>

            {/* Simulation Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Simulation Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
              />
            </div>

            {/* Location Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setSelectedHubs([]);
                  }}
                >
                  <option value="">Select a location</option>
                  {filteredLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              </div>
            </div>

            {/* Hub Selection */}
            {selectedLocation && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Select Hubs</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSelectAllHubs}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                    <button 
                      onClick={handleDeselectAllHubs}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {availableHubs.length > 0 ? (
                    <div className="space-y-2">
                      {availableHubs.map(hub => (
                        <div 
                          key={hub.id}
                          className={`p-2 rounded-md cursor-pointer flex items-center ${
                            selectedHubs.includes(hub.id) 
                              ? 'bg-blue-50 border border-blue-300' 
                              : 'hover:bg-gray-50 border border-transparent'
                          }`}
                          onClick={() => handleHubToggle(hub.id)}
                        >
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            hub.status === 'online' ? 'bg-green-500' : 
                            hub.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-medium text-gray-900">{hub.name}</div>
                          </div>
                          <div className="ml-auto">
                            {selectedHubs.includes(hub.id) && (
                              <CheckSquare className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm p-2">No hubs available at this location.</div>
                  )}
                </div>

                {selectedHubs.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {selectedHubs.length} hub{selectedHubs.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            )}

            {/* Simulation Parameters */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Simulation Parameters</label>
                <button 
                  onClick={handleAddInput}
                  className="flex items-center text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Parameter
                </button>
              </div>

              {inputs.length > 0 ? (
                <div className="space-y-4">
                  {inputs.map((input, index) => (
                    <div key={input.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="font-medium text-gray-700">Parameter {index + 1}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveInput(input.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Name</label>
                          <input
                            type="text"
                            className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                            value={input.name}
                            onChange={(e) => handleInputChange(input.id, 'name', e.target.value)}
                            placeholder="paramName"
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Type</label>
                          <select
                            className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                            value={input.type}
                            onChange={(e) => handleInputChange(input.id, 'type', e.target.value as CDataType)}
                          >
                            {dataTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Value</label>
                          <input
                            type={input.type === 'int' || input.type === 'long' || input.type === 'short' || input.type === 'unsigned int' ? 'number' : 
                                  input.type === 'float' || input.type === 'double' ? 'number' : 'text'}
                            step={input.type === 'float' || input.type === 'double' ? '0.01' : '1'}
                            className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                            value={input.value}
                            onChange={(e) => handleInputChange(input.id, 'value', e.target.value)}
                            placeholder={`Enter ${input.type} value`}
                          />
                        </div>
                        <div className="col-span-4 md:col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            type="text"
                            className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                            value={input.description}
                            onChange={(e) => handleInputChange(input.id, 'description', e.target.value)}
                            placeholder="Parameter description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">No parameters added yet</p>
                  <button 
                    onClick={handleAddInput}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Your First Parameter
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleSaveSimulation}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                disabled={!selectedLocation || selectedHubs.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Simulation
              </button>
              <button 
                onClick={handleRunSimulation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!selectedLocation || selectedHubs.length === 0}
              >
                <PlaySquare className="h-4 w-4 mr-2" />
                Run Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - JSON Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Code className="h-5 w-5 text-gray-700 mr-2" />
                <h3 className="font-semibold">JSON Preview</h3>
              </div>
              <button 
                onClick={handleCopyJson}
                className="text-blue-600 hover:text-blue-800"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-gray-800 rounded-md p-4 overflow-auto max-h-[600px]">
              <pre className="text-xs text-green-400 whitespace-pre-wrap">
                {generateSimulationJson()}
              </pre>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              This JSON will be sent to the simulation engine when you run the simulation.
            </div>
          </div>
        </div>
      </div>

      {/* Load Simulation Modal */}
      {showSavedSimulations && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Load Saved Simulation</h2>
              <button 
                onClick={() => setShowSavedSimulations(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {savedSimulations.length > 0 ? (
                <div className="space-y-4">
                  {savedSimulations.map(simulation => (
                    <div 
                      key={simulation.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLoadSimulation(simulation)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{simulation.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                              <Server className="h-4 w-4 mr-1" />
                              {simulation.hubs.length} hub{simulation.hubs.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center mt-1">
                              <Tag className="h-4 w-4 mr-1" />
                              {simulation.inputs.length} parameter{simulation.inputs.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Created: {formatDate(simulation.createdAt)}
                          </div>
                          {simulation.lastRun && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <RotateCw className="h-3 w-3 mr-1" />
                              Last run: {formatDate(simulation.lastRun)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No saved simulations found</p>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 flex justify-end">
              <button 
                onClick={() => setShowSavedSimulations(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulations;