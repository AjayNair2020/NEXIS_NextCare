import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_TRANSPORTS, MOCK_SERVICES, MOCK_FACILITIES } from '../constants';
import { InventoryItem, TransportVehicle, OperationalService } from '../types';

const OperationsManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'inventory' | 'transports' | 'services'>('inventory');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'available': case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'low': case 'en-route': case 'limited': return 'bg-amber-100 text-amber-700';
      case 'critical': case 'maintenance': case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getFacilityName = (id: string) => MOCK_FACILITIES.find(f => f.id === id)?.name || 'Unknown Location';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Management</h2>
          <p className="text-slate-500">Real-time oversight of resources, logistics, and facility capabilities.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveView('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'inventory' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveView('transports')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'transports' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Logistics
          </button>
          <button 
            onClick={() => setActiveView('services')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'services' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Services
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {activeView === 'inventory' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Last Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_INVENTORY.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{getFacilityName(item.locationId)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-slate-400">{item.lastRestocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeView === 'transports' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payload Context</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TRANSPORTS.map(unit => (
                <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{unit.plate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-medium text-slate-600 capitalize">{unit.type.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(unit.status)}`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic">
                    {unit.currentPayload || 'No active cargo'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">Track GPS</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeView === 'services' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Unit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facility</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialty</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational State</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Staffing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_SERVICES.map(srv => (
                <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{srv.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{getFacilityName(srv.facilityId)}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{srv.specialty}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(srv.status)}`}>
                      {srv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-emerald-600">Full Coverage</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Total Fleet Activity</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">In Motion</span>
            <span className="font-bold">2 Units</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[50%]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 italic">Next logistics sync in 2:45m</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Critical Stock Alerts</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-sm font-bold text-slate-700">Ventilator G-Series</span>
              <span className="text-[10px] ml-auto text-rose-600 font-bold uppercase">Restock now</span>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <h4 className="text-xs font-bold text-emerald-600 uppercase mb-4">Storage Efficiency</h4>
          <p className="text-2xl font-bold text-emerald-800">82.4%</p>
          <p className="text-xs text-emerald-600 mt-2">Optimal throughput across all 6 hubs.</p>
        </div>
      </div>
    </div>
  );
};

export default OperationsManager;