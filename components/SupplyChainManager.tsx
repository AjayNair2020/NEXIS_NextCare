
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_INVENTORY, MOCK_PRODUCTION_ORDERS, MOCK_FULFILLMENTS, MOCK_FACILITIES } from '../constants';
import HealthMap from './HealthMap';

interface SupplyChainManagerProps {
  isDarkMode?: boolean;
}

const DEMAND_FORECAST_DATA = [
  { name: 'Mon', demand: 400, stock: 600 },
  { name: 'Tue', demand: 300, stock: 580 },
  { name: 'Wed', demand: 500, stock: 550 },
  { name: 'Thu', demand: 280, stock: 520 },
  { name: 'Fri', demand: 590, stock: 650 },
  { name: 'Sat', demand: 320, stock: 630 },
  { name: 'Sun', demand: 210, stock: 600 },
];

const SupplyChainManager: React.FC<SupplyChainManagerProps> = ({ isDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'kpi' | 'inventory' | 'stock' | 'production' | 'fulfillment'>('kpi');

  const supplyChainStats = [
    { label: 'Total Value Managed', val: '$4.2M', unit: 'USD', trend: '+5.4%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Fulfillment Rate', val: '98.5%', unit: 'success', trend: '+0.2%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Stock Stability', val: '94.2', unit: 'index', trend: 'Optimal', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Active Shipments', val: '14', unit: 'units', trend: 'Nominal', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Healthcare Supply Chain</h2>
          <p className="text-slate-500 font-medium italic">Integrated Logistics Command (NEXIS LogiCore)</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          {['kpi', 'inventory', 'stock', 'production', 'fulfillment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSubTab === tab 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'kpi' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supplyChainStats.map((stat, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{stat.val}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.unit}</span>
                </div>
                <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 rounded-[2.5rem] border shadow-sm p-8 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold">Demand vs. Stock Velocity</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase">7-Day Predictive Cycle</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Stock</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Demand</span>
                     </div>
                  </div>
               </div>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DEMAND_FORECAST_DATA}>
                      <defs>
                        <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }} />
                      <Area type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                      <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
            
            <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden h-full relative transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
               <div className="absolute top-6 left-6 z-[20] bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Live Flow</p>
                  <p className="text-sm font-bold text-slate-800">Regional Med Logistics Hubs</p>
               </div>
               <HealthMap variant="operations" />
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'inventory' && (
        <div className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h3 className="text-xl font-bold">Facility Resource Inventory</h3>
             <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">Export Manifest</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Supply Health</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_INVENTORY.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">{item.category}</p>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                    {MOCK_FACILITIES.find(f => f.id === item.locationId)?.name || 'Central Stock'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.status === 'optimal' ? 'bg-emerald-500' : item.status === 'low' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${item.status === 'optimal' ? 85 : item.status === 'low' ? 30 : 10}%` }}></div>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${item.status === 'optimal' ? 'text-emerald-600' : item.status === 'low' ? 'text-amber-600' : 'text-rose-600'}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all">Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'stock' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
           {MOCK_INVENTORY.map(item => (
             <div key={item.id} className={`p-8 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.category === 'pharma' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                   </div>
                   <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${item.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {item.status}
                   </div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{item.category} • SKU-{item.id.toUpperCase()}</p>
                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-4xl font-black text-slate-900">{item.quantity}</span>
                   <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{item.unit}</span>
                </div>
                <div className="pt-6 border-t border-slate-50">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Restock Status</p>
                   <p className="text-xs font-bold text-slate-700">Last restock: {item.lastRestocked}</p>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeSubTab === 'production' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTION_ORDERS.map(order => (
            <div key={order.id} className={`p-8 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'in-production' ? 'bg-blue-100 text-blue-600' : 
                    order.status === 'pending' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {order.status}
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest ${order.priority === 'high' ? 'text-rose-500' : 'text-slate-400'}`}>
                    {order.priority} priority
                  </div>
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-2">{order.itemName}</h4>
               <p className="text-3xl font-black text-slate-900 mb-6">{order.quantity} <span className="text-sm text-slate-400 font-bold uppercase">Units</span></p>
               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Completion</p>
                    <p className="text-sm font-bold text-slate-700">{order.eta}</p>
                  </div>
                  <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'fulfillment' && (
        <div className="space-y-6">
          {MOCK_FULFILLMENTS.map(ff => (
            <div key={ff.id} className={`p-8 rounded-[3rem] border shadow-sm flex items-center gap-10 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${ff.status === 'in-transit' ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-700 shadow-slate-200'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">Batch {ff.id}</h4>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">{ff.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Facility</p>
                        <p className="text-sm font-bold text-slate-700">{MOCK_FACILITIES.find(f => f.id === ff.destinationFacilityId)?.name}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics Carrier</p>
                        <p className="text-sm font-bold text-slate-700">{ff.carrier}</p>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Network Sync</p>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                     <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Tracking</span>
                  </div>
               </div>
            </div>
          ))}
          <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Waiting for incoming fulfillment requests...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainManager;
