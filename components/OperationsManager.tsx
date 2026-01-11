import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_TRANSPORTS, MOCK_SERVICES, MOCK_FACILITIES } from '../constants';
import { InventoryItem, TransportVehicle, OperationalService } from '../types';

const OperationsManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'inventory' | 'transports' | 'services'>('inventory');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'available': case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'low': case 'en-route': case 'limited': return 'bg-amber-100 text-amber-700';
      case 'critical': case 'maintenance': case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getFacilityName = (id: string) => MOCK_FACILITIES.find(f => f.id === id)?.name || 'Unknown Location';

  const handleVehicleClick = (unit: TransportVehicle) => {
    setSelectedVehicle(unit);
  };

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
                <tr 
                  key={unit.id} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleVehicleClick(unit)}
                >
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
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">Details & History</button>
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

      {/* Detailed Vehicle Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Vehicle Unit: {selectedVehicle.plate}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(selectedVehicle.status)}`}>
                      {selectedVehicle.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedVehicle.type}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Assigned Operator</p>
                  <p className="text-lg font-bold text-slate-800">{selectedVehicle.driverName || 'Unassigned'}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Payload Context</p>
                  <p className="text-lg font-bold text-slate-800">{selectedVehicle.currentPayload || 'Operational Ready'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Real-time Coordinate Vector
                </h4>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs shadow-inner">
                  <div className="flex justify-between">
                    <span>LAT: {selectedVehicle.lat.toFixed(6)}</span>
                    <span>LNG: {selectedVehicle.lng.toFixed(6)}</span>
                  </div>
                  <div className="mt-1 text-[10px] opacity-60">GEOSPATIAL SYNC: ACTIVE (REFRESH: 2s)</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Fleet Maintenance History
                </h4>
                <div className="space-y-3">
                  {selectedVehicle.maintenanceLogs?.map((log, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-slate-800">{log.description}</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{log.date}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Technician: {log.technician}</p>
                      </div>
                    </div>
                  ))}
                  {!selectedVehicle.maintenanceLogs?.length && (
                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-400 font-medium italic">No recent maintenance records found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-white sticky bottom-0 z-10">
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Return to Operational Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsManager;