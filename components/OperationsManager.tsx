
import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_TRANSPORTS, MOCK_SERVICES, MOCK_FACILITIES } from '../constants';
import { InventoryItem, TransportVehicle, OperationalService } from '../types';
import { getVehicleStatusReport } from '../services/gemini';

const OperationsManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'inventory' | 'transports' | 'services'>('inventory');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [vehicleReport, setVehicleReport] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'available': case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'low': case 'en-route': case 'limited': return 'bg-amber-100 text-amber-700';
      case 'critical': case 'maintenance': case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getFacilityName = (id: string) => MOCK_FACILITIES.find(f => f.id === id)?.name || 'Unknown Location';

  const handleVehicleClick = async (unit: TransportVehicle) => {
    setIsSyncing(true);
    setVehicleReport(null);
    setSelectedVehicle(unit);
    
    // Fetch dynamic status report using AI
    const report = await getVehicleStatusReport(unit);
    setVehicleReport(report);
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Management</h2>
          <p className="text-slate-500">Real-time oversight of resources, logistics, and facility capabilities.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {['inventory', 'transports', 'services'].map(view => (
            <button 
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeView === view ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {activeView === 'inventory' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Last Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_INVENTORY.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{item.name}</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">{item.category}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>{item.status}</span></td>
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TRANSPORTS.map(unit => (
                <tr key={unit.id} onClick={() => handleVehicleClick(unit)} className="hover:bg-slate-50 cursor-pointer group transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-800">{unit.plate}</td>
                  <td className="px-8 py-6 text-xs font-medium text-slate-600 capitalize">{unit.type.replace('-', ' ')}</td>
                  <td className="px-8 py-6"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(unit.status)}`}>{unit.status}</span></td>
                  <td className="px-8 py-6 text-right"><span className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:underline">Open Telemetry</span></td>
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
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialty</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_SERVICES.map(srv => (
                <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">{srv.name}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-400">{srv.specialty}</td>
                  <td className="px-6 py-4 text-right"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(srv.status)}`}>{srv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detailed Vehicle Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg></div>
                <div><h3 className="text-2xl font-bold text-slate-800">Unit ID: {selectedVehicle.plate}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedVehicle.type}</p></div>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {isSyncing ? (
                <div className="py-20 flex flex-col items-center gap-6 animate-pulse">
                   <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Authenticating Real-time Vector...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Assigned Operator</p>
                      <p className="text-lg font-bold text-slate-800">{selectedVehicle.driverName || 'NEXIS Core'}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-2">Payload Details</p>
                      <p className="text-lg font-bold text-slate-800">{selectedVehicle.currentPayload || 'Operational Ready'}</p>
                    </div>
                  </div>

                  {vehicleReport && (
                    <div className="p-8 rounded-[2.5rem] bg-blue-50 border border-blue-100">
                       <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">AI Integrity Summary</h4>
                       <p className="text-sm leading-relaxed text-blue-800 font-medium italic">"{vehicleReport}"</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>Telemetry Coordinates</h4>
                    <div className="bg-slate-900 text-emerald-400 p-5 rounded-3xl font-mono text-sm shadow-inner flex justify-between"><span>LAT: {selectedVehicle.lat.toFixed(6)}</span><span>LNG: {selectedVehicle.lng.toFixed(6)}</span></div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Fleet Maintenance History</h4>
                    <div className="space-y-3">
                      {selectedVehicle.maintenanceLogs?.map((log, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">✓</div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{log.description}</p>
                            <p className="text-xs text-slate-400 font-medium">{log.date} • {log.technician}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsManager;
