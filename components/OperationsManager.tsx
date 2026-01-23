
import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_TRANSPORTS, MOCK_SERVICES, MOCK_FACILITIES, MOCK_COMPLIANCE_KPIs } from '../constants';
import { InventoryItem, TransportVehicle, OperationalService, ComplianceKPI } from '../types';
import { getVehicleStatusReport } from '../services/gemini';

const OperationsManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'inventory' | 'transports' | 'services' | 'compliance'>('inventory');
  const [activeCompliance, setActiveCompliance] = useState<ComplianceKPI['category']>('EHS');
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [vehicleReport, setVehicleReport] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'available': case 'active': case 'compliant': return 'bg-emerald-100 text-emerald-700';
      case 'low': case 'en-route': case 'limited': case 'warning': return 'bg-amber-100 text-amber-700';
      case 'critical': case 'maintenance': case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleVehicleClick = async (unit: TransportVehicle) => {
    setIsSyncing(true);
    setVehicleReport(null);
    setSelectedVehicle(unit);
    
    // Fetch dynamic status report using AI
    const report = await getVehicleStatusReport(unit);
    setVehicleReport(report);
    setIsSyncing(false);
  };

  const filteredCompliance = MOCK_COMPLIANCE_KPIs.filter(kpi => kpi.category === activeCompliance);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Management</h2>
          <p className="text-slate-500">Real-time oversight of resources, logistics, and compliance frameworks.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {['inventory', 'transports', 'services', 'compliance'].map(view => (
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

      {activeView === 'compliance' && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-top-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(['EHS', 'ESG', 'ISO', 'HIPAA', 'GDPR', 'GRI'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCompliance(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                  activeCompliance === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
                }`}
              >
                {cat} Requirements
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompliance.map(kpi => (
              <div key={kpi.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.category} KPI</p>
                    <h4 className="text-lg font-bold text-slate-800">{kpi.name}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(kpi.status)}`}>
                    {kpi.status}
                  </span>
                </div>
                
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-black text-slate-900">{kpi.value}</span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${kpi.trend === 'up' ? 'text-emerald-500' : kpi.trend === 'down' ? 'text-rose-500' : 'text-blue-500'}`}>
                    <svg className={`w-3 h-3 ${kpi.trend === 'down' ? 'rotate-180' : kpi.trend === 'stable' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7 7 7" /></svg>
                    {kpi.trend}
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium italic">"{kpi.description}"</p>
                
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Last Verification</span>
                  <span className="text-[10px] font-black text-slate-700">{kpi.lastAudit}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform"></div>
            <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
               Compliance Integrity Protocol
            </h5>
            <p className="text-xs leading-relaxed opacity-80 font-medium italic">
              "NEXIS AI confirms that all regional nodes are currently operating within the established {activeCompliance} boundary. Continuous monitoring of data ingress vectors ensures 100% adherence to global regulatory standards."
            </p>
          </div>
        </div>
      )}

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
