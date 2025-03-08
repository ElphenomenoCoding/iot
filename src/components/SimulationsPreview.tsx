import { CheckSquare, Code, Copy, PlaySquare, Plus, Save, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

const SimulationsPreview = () => {
  // For demo purposes only - simplified version of the full component
  const [simulationName, setSimulationName] = useState('New Simulation');
  const [selectedHubs, setSelectedHubs] = useState(['hub-1-1', 'hub-1-2']);
  const [inputs, setInputs] = useState([
    { id: 'inp-1', name: 'userCount', type: 'int', value: '500', description: 'Number of users per hour' },
    { id: 'inp-2', name: 'waterUsage', type: 'float', value: '1.5', description: 'Average water usage in liters' }
  ]);
  
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

  const formatValueByType = (value: string, type: string) => {
    if (value === '') return null;
    
    switch (type) {
      case 'int':
        return parseInt(value, 10) || 0;
      case 'float':
        return parseFloat(value) || 0.0;
      case 'bool':
        return value.toLowerCase() === 'true' || value === '1';
      default:
        return value;
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h1 className="text-xl font-bold mb-4">Simulation Preview</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
<PlaySquare className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold">Create Simulation</h2>
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

            {/* Hub Selection Preview */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Selected Hubs</label>
              </div>
              
              <div className="border border-gray-300 rounded-md p-2">
                <div className="space-y-2">
                  {selectedHubs.map(hubId => (
                    <div 
                      key={hubId}
                      className="p-2 rounded-md bg-blue-50 border border-blue-300 flex items-center"
                    >
                      <div className="w-3 h-3 rounded-full mr-3 bg-green-500"></div>
                      <div>
                        <div className="font-medium text-gray-900">Hub {hubId.split('-')[2]}</div>
                      </div>
                      <div className="ml-auto">
                        <CheckSquare className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulation Parameters */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Simulation Parameters</label>
                <button className="flex items-center text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Parameter
                </button>
              </div>

              <div className="space-y-4">
                {inputs.map((input, index) => (
                  <div key={input.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700">Parameter {index + 1}</span>
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                          value={input.name}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                        <select
                          className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                          value={input.type}
                          disabled
                        >
                          <option value={input.type}>{input.type}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Value</label>
                        <input
                          type="text"
                          className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                          value={input.value}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input
                          type="text"
                          className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                          value={input.description}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                <Save className="h-4 w-4 mr-2" />
                Save Simulation
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <PlaySquare className="h-4 w-4 mr-2" />
                Run Simulation
              </button>
            </div>
          </div>
        </div>

        {/* JSON Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Code className="h-5 w-5 text-gray-700 mr-2" />
                <h3 className="font-semibold">JSON Preview</h3>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-gray-800 rounded-md p-4 overflow-auto h-64">
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
    </div>
  );
};

export default SimulationsPreview;