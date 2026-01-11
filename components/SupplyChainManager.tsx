
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_INVENTORY, MOCK_PRODUCTION_ORDERS, MOCK_FULFILLMENTS, MOCK_FACILITIES, MOCK_TRANSPORTS } from '../constants';
import { ProductionOrder, InventoryItem, Fulfillment, TransportVehicle } from '../types';
import { getVehicleStatusReport } from '../services/gemini';
import HealthMap from './HealthMap';

interface SupplyChainManagerProps {
  isDarkMode?: boolean;
}

const PERFORMANCE_DATA = [
  { name: 'Mon', demand: 400, stock: 600, fulfillmentTime: 4.5 },
  { name: 'Tue', demand: 300, stock: 580, fulfillmentTime: 4.2 },
  { name: 'Wed', demand: 500, stock: 550, fulfillmentTime: 4.8 },
  { name: 'Thu', demand: 280, stock: 520, fulfillmentTime: 3.9 },
  { name: 'Fri', demand: 590, stock: 650, fulfillmentTime: 5.1 },
  { name: 'Sat', demand: 320, stock: 630, fulfillmentTime: 4.0 },
  { name: 'Sun', demand: 210, stock: 600, fulfillmentTime: 3.8 },
];

const SupplyChainManager: React.FC<SupplyChainManagerProps> = ({ isDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'kpi' | 'inventory' | 'stock' | 'production' | 'fulfillment' | 'logistics'>('kpi');
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(MOCK_PRODUCTION_ORDERS);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicle | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [vehicleReport, setVehicleReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newOrder, setNewOrder] = useState<Partial<ProductionOrder>>({
    status: 'pending',
    priority: 'medium',
    quantity: 0,
    itemName: '',
    eta: ''
  });

  const supplyChainStats = [
    { label: 'Total Inventory Value', val: '$4.28M', unit: 'USD', trend: '+5.4%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
    { label: 'Avg. Fulfillment Time', val: '4.2h', unit: 'per order', trend: '-12.4%', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'On-Time Delivery', val: '98.5%', unit: 'rate', trend: '+0.2%', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Active Shipments', val: MOCK_FULFILLMENTS.length.toString(), unit: 'units', trend: 'Nominal', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  const handleVehicleClick = async (unit: TransportVehicle) => {
    setIsSyncing(true);
    setVehicleReport(null);
    setSelectedVehicle(unit);
    
    const report = await getVehicleStatusReport(unit);
    setVehicleReport(report);
    setIsSyncing(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.itemName || !newOrder.quantity || !newOrder.eta) return;
    const order: ProductionOrder = {
      id: `po-${Date.now()}`,
      itemName: newOrder.itemName,
      quantity: newOrder.quantity,
      status: 'pending',
      priority: 'medium',
      eta: newOrder.eta
    };
    setProductionOrders(prev => [order, ...prev]);
    setIsCreatingOrder(false);
    setNewOrder({ status: 'pending', priority: 'medium', quantity: 0, itemName: '', eta: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'available': case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'low': case 'en-route': case 'limited': return 'bg-amber-100 text-amber-700';
      case 'critical': case 'maintenance': case 'offline': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredInventory = MOCK_INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Healthcare Supply Chain</h2>
          <p className="text-slate-500 font-medium italic">NEXIS LogiCore Integrated Command</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          {['kpi', 'inventory', 'stock', 'production', 'fulfillment', 'logistics'].map((tab) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supplyChainStats.map((stat, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{stat.val}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`lg:col-span-1 rounded-[2.5rem] border shadow-sm overflow-hidden min-h-[400px] relative transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
             <div className="absolute top-6 left-6 z-[20] bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Live Flow</p>
               <p className="text-sm font-bold text-slate-800">Logistics Hubs</p>
             </div>
             <HealthMap variant="operations" />
          </div>

          <div className={`lg:col-span-2 rounded-[2.5rem] border shadow-sm p-8 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
             <h3 className="text-xl font-bold mb-8 transition-colors">Demand vs. Fulfillment Velocity</h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }} />
                    <Area type="monotone" dataKey="stock" name="Stock" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                    <Area type="monotone" dataKey="fulfillmentTime" name="Fulfillment Time" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
                  </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {(activeSubTab === 'inventory' || activeSubTab === 'stock') && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Resource Inventory Control</h3>
              <p className="text-sm text-slate-500 font-medium">Real-time stock levels across all facilities.</p>
            </div>
            <div className={`flex items-center px-4 py-2 border rounded-xl shadow-sm max-w-sm w-full ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <svg className="w-4 h-4 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Filter by resource or category..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map(item => {
              const location = MOCK_FACILITIES.find(f => f.id === item.locationId);
              return (
                <div key={item.id} className={`p-6 rounded-[2rem] border shadow-sm transition-all hover:shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Restock</p>
                      <p className="text-[11px] font-bold text-slate-600">{item.lastRestocked}</p>
                    </div>
                  </div>
                  
                  <h4 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{item.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{item.category}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-black">{item.quantity} <span className="text-sm text-slate-400 font-bold uppercase">{item.unit}</span></p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-500'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${item.status === 'optimal' ? 'bg-emerald-500' : item.status === 'low' ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        style={{ width: `${item.status === 'optimal' ? '85%' : item.status === 'low' ? '25%' : '10%'}` }}
                      ></div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                       <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       <p className="text-[11px] font-bold text-slate-500">{location?.name || 'In Transit'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'fulfillment' && (
        <div className="grid grid-cols-1 gap-6">
          {MOCK_FULFILLMENTS.map((ff: Fulfillment) => (
            <div key={ff.id} className={`p-8 rounded-[2.5rem] border shadow-sm flex items-center gap-10 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${ff.status === 'in-transit' ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-700 shadow-slate-200'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
               </div>
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`text-lg font-black uppercase tracking-tighter italic ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Batch {ff.id}</h4>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">{ff.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Facility</p><p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{MOCK_FACILITIES.find(f => f.id === ff.destinationFacilityId)?.name}</p></div>
                     <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics Carrier</p><p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{ff.carrier}</p></div>
                  </div>
               </div>
               <div className="text-right">
                  {ff.status === 'in-transit' ? (
                    <button 
                      onClick={() => {
                        const unit = MOCK_TRANSPORTS.find(v => v.currentPayload?.includes(ff.id) || v.type === 'logistics-truck');
                        if (unit) handleVehicleClick(unit);
                      }}
                      className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                    >
                      Track Unit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full"></div><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stationary</span></div>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'logistics' && (
        <div className={`bg-white rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h3 className="text-xl font-bold">Global Transport Fleet</h3>
             <div className="flex gap-4">
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active Sync: 100%</span>
             </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Plate</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TRANSPORTS.map(unit => (
                <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-800">{unit.plate}</td>
                  <td className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">{unit.type.replace('-', ' ')}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(unit.status)}`}>{unit.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleVehicleClick(unit)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Telemetric View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'production' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Active Production Pipeline</h3>
             <button onClick={() => setIsCreatingOrder(true)} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">Initialize New Batch</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productionOrders.map(order => (
              <div key={order.id} className={`p-8 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                 <div className="flex justify-between items-start mb-6"><div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'in-production' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>{order.status}</div></div>
                 <h4 className="text-xl font-bold mb-2">{order.itemName}</h4>
                 <p className="text-3xl font-black mb-6">{order.quantity} <span className="text-sm text-slate-400 font-bold uppercase">Units</span></p>
                 <div className="pt-6 border-t border-slate-50"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">ETA: {order.eta}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedVehicle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-slate-950 border border-slate-800' : 'bg-white'}`}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg></div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Unit: {selectedVehicle.plate}</h3>
                  <div className="flex items-center gap-2 mt-1"><span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(selectedVehicle.status)}`}>{selectedVehicle.status}</span></div>
                </div>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-colors">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {isSyncing ? (
                <div className="py-20 flex flex-col items-center gap-6 animate-pulse">
                   <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NEXIS Real-time Sync Active...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Operator</p>
                       <p className="text-lg font-bold">{selectedVehicle.driverName || 'NEXIS Autonomous Node'}</p>
                    </div>
                    <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payload Context</p>
                       <p className="text-lg font-bold">{selectedVehicle.currentPayload || 'Operational Ready'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Geospatial Vector</h4>
                    <div className="bg-slate-900 text-emerald-400 p-6 rounded-3xl font-mono text-sm shadow-inner flex justify-between">
                       <span>LAT: {selectedVehicle.lat.toFixed(6)}</span>
                       <span>LNG: {selectedVehicle.lng.toFixed(6)}</span>
                    </div>
                  </div>

                  {vehicleReport && (
                    <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                       <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">AI Tactical Report</h4>
                       <div className="prose prose-sm leading-relaxed text-slate-600 italic whitespace-pre-wrap">{vehicleReport}</div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>Maintenance History</h4>
                    <div className="space-y-3">
                      {selectedVehicle.maintenanceLogs?.map((log, i) => (
                        <div key={i} className={`p-5 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <div className="flex-1">
                             <p className="text-sm font-bold">{log.description}</p>
                             <p className="text-[10px] text-slate-400 font-medium">Technician: {log.technician} • {log.date}</p>
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

      {isCreatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-bold mb-8">Initialize Production Batch</h3>
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Resource Name</label><input type="text" required value={newOrder.itemName} onChange={e => setNewOrder({...newOrder, itemName: e.target.value})} className="w-full px-5 py-3 rounded-xl border bg-slate-50 focus:ring-2 focus:ring-emerald-500/20 transition-all" /></div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Target Quantity</label><input type="number" required value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})} className="w-full px-5 py-3 rounded-xl border bg-slate-50" /></div>
                <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">ETA Delivery</label><input type="date" required value={newOrder.eta} onChange={e => setNewOrder({...newOrder, eta: e.target.value})} className="w-full px-5 py-3 rounded-xl border bg-slate-50" /></div>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-500 text-white font-black uppercase rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200">Commit to Pipeline</button>
              <button type="button" onClick={() => setIsCreatingOrder(false)} className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 py-2">Discard Batch</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainManager;
