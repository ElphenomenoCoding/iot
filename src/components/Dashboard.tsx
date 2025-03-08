import React from 'react';
import { Bath, Users, WifiOff, Activity, Timer, Droplet, Wind, Lightbulb, AlertTriangle, ShieldAlert, Package, Wrench as Tool, RefreshCw } from 'lucide-react';
import StatCard from './StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const usageData = [
  { time: '00:00', value: 20 },
  { time: '04:00', value: 10 },
  { time: '08:00', value: 80 },
  { time: '12:00', value: 90 },
  { time: '16:00', value: 85 },
  { time: '20:00', value: 40 },
];

const consumptionData = [
  { name: 'Water', value: 85 },
  { name: 'Soap', value: 65 },
  { name: 'Paper', value: 45 },
  { name: 'Energy', value: 90 },
];

const recentAlerts = [
  {
    id: 1,
    location: 'Terminal A - Block 3',
    type: 'Low Supply',
    item: 'Paper Towels',
    severity: 'high',
    time: '10 minutes ago'
  },
  {
    id: 2,
    location: 'Terminal B - Block 1',
    type: 'Maintenance',
    item: 'Hand Dryer Malfunction',
    severity: 'medium',
    time: '25 minutes ago'
  },
  {
    id: 3,
    location: 'Terminal A - Block 2',
    type: 'Sensor',
    item: 'Water Flow Anomaly',
    severity: 'low',
    time: '45 minutes ago'
  }
];

const maintenanceNeeds = [
  {
    id: 1,
    location: 'Terminal C - Block 4',
    issue: 'Soap Dispenser Replacement',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 2,
    location: 'Terminal A - Block 1',
    issue: 'Light Fixture Maintenance',
    priority: 'medium',
    status: 'scheduled'
  },
  {
    id: 3,
    location: 'Terminal B - Block 2',
    issue: 'Air Freshener Refill',
    priority: 'low',
    status: 'pending'
  }
];

const refillNeeds = [
  {
    id: 1,
    location: 'Terminal A - Block 1',
    item: 'Paper Towels',
    level: '15%',
    estimatedEmpty: '2 hours'
  },
  {
    id: 2,
    location: 'Terminal B - Block 3',
    item: 'Soap',
    level: '20%',
    estimatedEmpty: '3 hours'
  },
  {
    id: 3,
    location: 'Terminal C - Block 2',
    item: 'Toilet Paper',
    level: '25%',
    estimatedEmpty: '4 hours'
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Real-time monitoring of all facilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Toilets"
          value={124}
          change="12%"
          trend="up"
          icon={Bath}
        />
        <StatCard
          title="Active Users"
          value={1432}
          change="8%"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Offline Hubs"
          value={3}
          change="2"
          trend="down"
          icon={WifiOff}
        />
        <StatCard
          title="Daily Usage"
          value="2,847"
          change="5%"
          trend="up"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Usage Pattern</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Consumption</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="space-y-4">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="flex items-start p-4 border rounded-lg">
                <ShieldAlert className={`h-5 w-5 mt-1 ${
                  alert.severity === 'high' ? 'text-red-500' :
                  alert.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{alert.location}</h3>
                  <p className="text-sm text-gray-500">{alert.type}: {alert.item}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Needed</h2>
            <Tool className="h-6 w-6 text-gray-600" />
          </div>
          <div className="space-y-4">
            {maintenanceNeeds.map(need => (
              <div key={need.id} className="flex items-start p-4 border rounded-lg">
                <div className={`h-2 w-2 mt-2 rounded-full ${
                  need.priority === 'high' ? 'bg-red-500' :
                  need.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{need.location}</h3>
                  <p className="text-sm text-gray-500">{need.issue}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    need.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {need.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Water Usage</h3>
            <Droplet className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">847L</p>
          <p className="text-sm text-gray-500 mt-1">Today's consumption</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Air Quality</h3>
            <Wind className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">Good</p>
          <p className="text-sm text-gray-500 mt-1">Average across all facilities</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Energy Usage</h3>
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">284kWh</p>
          <p className="text-sm text-gray-500 mt-1">Today's consumption</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg. Usage Time</h3>
            <Timer className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">4.2min</p>
          <p className="text-sm text-gray-500 mt-1">Per visit</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Supplies Needing Refill</h2>
          <Package className="h-6 w-6 text-gray-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Time Until Empty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refillNeeds.map(need => (
                <tr key={need.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{need.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{need.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: need.level }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{need.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{need.estimatedEmpty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Bath className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">IoT Toilets</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">System Status: Operational</span>
            </div>
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Last updated: Just now</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;