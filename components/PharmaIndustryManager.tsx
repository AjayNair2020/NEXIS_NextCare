
import React, { useState } from 'react';
import { MOCK_PRODUCTION_ORDERS, MOCK_INVENTORY, MOCK_FACILITIES, MOCK_TRANSPORTS } from '../constants';
import { ProductionOrder, InventoryItem, TransportVehicle } from '../types';
import HealthMap from './HealthMap';

interface PharmaIndustryManagerProps {
  isDarkMode?: boolean;
}

const PharmaIndustryManager: React.FC<PharmaIndustryManagerProps> = ({ isDarkMode }) => {
  const [activeSection, setActiveSection] = useState<'mes' | 'erp' | 'scm' | 'assets'>('mes');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-production': case 'optimal': case 'active': return 'bg-emerald-500 text-white shadow-emerald-500/20';
      case 'pending': case 'low': return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'critical': case 'maintenance': return 'bg-rose-600 text-white shadow-rose-500/20';
      default: return 'bg-slate-400 text-white';
    }
  };

  const handleSimulatePlan = () => {
    setIsSimulationRunning(true);
    setTimeout(() => setIsSimulationRunning(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-blue-50' : 'text-slate-800'}`}>Pharma Industry Intelligence</h2>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed italic">
            Integrated Manufacturing Execution (MES), Resource Planning (ERP), and Supply Chain (SCM) for regional health nodes.
          </p>
        </div>
        <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-x-auto">
          {[
            { id: 'mes', label: 'Manufacturing (MES)', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
            { id: 'erp', label: 'Resources (ERP)', icon: 'M9 17v-2a2 2 0 012-2h3m4 9V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.667' },
            { id: 'scm', label: 'Logistics (SCM)', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7' },
            { id: 'assets', label: 'Regional Assets', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSection === tab.id 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-amber-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeSection === 'mes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-8 rounded-[2.5rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-bold mb-1">Execution Pipeline</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Production Batches & Machine Telemetry</p>
                </div>
                <button 
                  onClick={handleSimulatePlan}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  {isSimulationRunning && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {isSimulationRunning ? 'Running Optimizers...' : 'Optimize Batch Flow'}
                </button>
              </div>

              <div className="space-y-4">
                {MOCK_PRODUCTION_ORDERS.map(order => (
                  <div key={order.id} className={`p-6 rounded-3xl border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${getStatusColor(order.status)}`}>
                             {order.itemName.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">{order.itemName}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Priority: {order.priority}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                         {order.status}
                       </span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Quantity</p>
                          <p className="text-lg font-black">{order.quantity.toLocaleString()} units</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">Fulfillment %</p>
                          <p className="text-lg font-black">{order.status === 'completed' ? '100%' : '64%'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase">ETA Distribution</p>
                          <p className="text-lg font-black text-amber-500">{order.eta}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Equipment Lifecycle</h4>
                <div className="space-y-6">
                   {[
                     { name: 'Cold-Chain Synthesis Unit A', health: 98, status: 'Optimal' },
                     { name: 'Automated Lab Packager B1', health: 84, status: 'Review Needed' },
                     { name: 'Bio-Reactor Node 4', health: 92, status: 'Steady' },
                     { name: 'Centrifuge Grid Gamma', health: 12, status: 'Maintenance' }
                   ].map(eq => (
                     <div key={eq.name} className="group cursor-default">
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-xs font-bold truncate pr-2">{eq.name}</span>
                           <span className={`text-[10px] font-black uppercase ${eq.health < 20 ? 'text-rose-500' : 'text-emerald-500'}`}>{eq.health}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                              className={`h-full transition-all duration-1000 ${eq.health > 80 ? 'bg-emerald-500' : eq.health > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                              style={{ width: `${eq.health}%` }} 
                           />
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mt-2 tracking-tighter">{eq.status}</p>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Open Equipment Console</button>
             </div>

             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform"></div>
                <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">Industrial Directive</h5>
                <p className="text-xs leading-relaxed opacity-80 font-medium italic">
                  "NEXIS AI suggests shifting 12% of synthesis load from Node B1 to Synthesis Unit A to preempt thermal degradation during the upcoming surge."
                </p>
             </div>
          </div>
        </div>
      )}

      {activeSection === 'erp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total CapEx Allocated', val: '$14.2M', trend: '+2.1%', sub: 'Q4 Budget' },
            { label: 'Procurement Cycle', val: '4.2 Days', trend: '-18%', sub: 'Avg Lead Time' },
            { label: 'Workforce Efficiency', val: '94.8%', trend: 'Steady', sub: 'Regional Average' },
            { label: 'Regulatory Compliance', val: '100%', trend: 'Locked', sub: 'Audit Ready' }
          ].map((stat, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h4 className="text-3xl font-black mb-1">{stat.val}</h4>
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">{stat.sub}</span>
                 <span className={`text-[10px] font-black uppercase ${stat.trend.includes('+') || stat.trend === 'Locked' ? 'text-emerald-500' : 'text-blue-500'}`}>{stat.trend}</span>
              </div>
            </div>
          ))}

          <div className={`lg:col-span-4 p-8 rounded-[2.5rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
             <h3 className="text-xl font-bold mb-6">Financial Allocation & Resource Modeling</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                     Strategic resource planning for the next fiscal quarter emphasizes decentralized logistics and pharmaceutical stock-piling in Area SA-2.
                   </p>
                   <div className="space-y-4">
                      {['R&D / Bio-synthesis', 'Regional Logistics', 'Clinical Support Assets', 'Emergency Reserves'].map((p, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                           <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-emerald-500' : idx === 2 ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                           <span className="text-xs font-bold flex-1">{p}</span>
                           <span className="text-xs font-black text-slate-400">{[40, 25, 20, 15][idx]}%</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex items-center justify-center">
                   <div className="text-center">
                      <div className="w-32 h-32 rounded-full border-[12px] border-blue-500 border-r-emerald-500 border-b-amber-500 border-l-slate-200 flex items-center justify-center mb-4 mx-auto">
                        <span className="text-lg font-black text-slate-800">100%</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Budget Health</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeSection === 'scm' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-[3rem] border shadow-sm overflow-hidden h-[500px] relative transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="absolute top-8 left-8 z-[20] flex flex-col gap-2">
                 <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Logistics Flow</p>
                   <h3 className="text-sm font-black text-slate-800 uppercase italic">Real-time SCM Asset Tracking</h3>
                 </div>
              </div>
              <HealthMap variant="operations" />
            </div>
          </div>
          
          <div className="space-y-6">
             <div className={`p-8 rounded-[2.5rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Logistics Fleet</h4>
                <div className="space-y-4">
                   {MOCK_TRANSPORTS.filter(t => t.type === 'logistics-truck').map(unit => (
                     <div key={unit.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4 group hover:border-blue-200 transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-black truncate">{unit.plate}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">{unit.status}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${unit.status === 'available' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`}></span>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">Open Fleet Command</button>
             </div>

             <div className={`p-8 rounded-[2.5rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Asset Capacity Pulse</h4>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Hub 1 (Primary)</span>
                         <span className="text-[10px] font-black">92% Full</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[92%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Hub 2 (Reserve)</span>
                         <span className="text-[10px] font-black">24% Full</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[24%]"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeSection === 'assets' && (
        <div className="space-y-8">
           <div className={`p-10 rounded-[3rem] border shadow-sm transition-colors ${isDarkMode ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Regional Health Assets</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Census & Global Stock Levels</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Asset Diversity</p>
                       <p className="text-xl font-black">124 Types</p>
                    </div>
                    <div className="text-right border-l pl-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Audit Status</p>
                       <p className="text-xl font-black text-emerald-500">Verified</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_INVENTORY.map(item => (
                  <div key={item.id} className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:shadow-xl hover:bg-white hover:border-emerald-200 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-110 ${getStatusColor(item.status)}`}>
                           {item.name.charAt(0)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                           {item.status}
                        </span>
                     </div>
                     <h4 className="text-lg font-bold mb-1 truncate">{item.name}</h4>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{item.category}</p>
                     
                     <div className="pt-6 border-t border-slate-200/50 flex justify-between items-center">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase">Regional Qty</p>
                           <p className="text-2xl font-black">{item.quantity.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-black text-slate-400 uppercase">Unit Type</p>
                           <p className="text-sm font-bold text-slate-600">{item.unit}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PharmaIndustryManager;
