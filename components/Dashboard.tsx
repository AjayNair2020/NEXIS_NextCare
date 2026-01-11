import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_HEALTH_METRICS } from '../constants';
import HealthMap from './HealthMap';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, Alex!</h2>
          <p className="text-slate-500 font-medium">Your physiological vectors are within optimal range. System sync complete.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 group hover:border-emerald-200 transition-all cursor-default">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Bio-Telemetry</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Heart Rate', value: '72', unit: 'bpm', trend: '-2%', color: 'rose', isLive: true, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
          { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', trend: 'Stable', color: 'blue', isLive: false, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { label: 'Avg Steps', value: '9,450', unit: 'steps', trend: '+12%', color: 'emerald', isLive: false, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Sleep Quality', value: '7.8', unit: 'hrs', trend: '+5%', color: 'indigo', isLive: false, icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              {stat.isLive && (
                <div className="px-2 py-1 bg-rose-50 rounded-lg flex items-center gap-1.5 border border-rose-100 animate-pulse">
                  <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
                  <span className="text-[8px] font-black text-rose-600 uppercase tracking-tighter">Live</span>
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-black text-slate-800">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.unit}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 
                stat.trend === 'Stable' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.trend.startsWith('+') && <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>}
                {stat.trend.startsWith('-') && <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>}
                {stat.trend}
              </div>
              <span className="text-[9px] text-slate-400 font-medium">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Large Tactical Views */}
      <div className="space-y-8">
        {/* Regional Intelligence Map */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative group/map">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white relative z-10 transition-colors group-hover/map:bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500 group-hover/map:rotate-12 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                Regional Health Intelligence
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">NEXIS 2.0 Spatial Awareness • Real-time Epidemiology</p>
            </div>
            <button className="text-[10px] font-black text-emerald-600 hover:text-white hover:bg-emerald-600 uppercase tracking-[0.2em] px-6 py-3 bg-emerald-50 rounded-2xl transition-all shadow-sm">
              Global Overlay
            </button>
          </div>
          <div className="h-[450px] w-full relative">
            <HealthMap variant="dashboard" />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Heart Rate Dynamics</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">7-Day Physiological Pulse</p>
              </div>
              <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                 <button className="text-[9px] font-black text-emerald-600 bg-white px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider">Live</button>
                 <button className="text-[9px] font-black text-slate-400 px-3 py-1.5 rounded-lg uppercase tracking-wider hover:text-slate-600 transition-colors">History</button>
              </div>
            </div>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_HEALTH_METRICS}>
                  <defs>
                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} domain={[60, 90]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    labelStyle={{ fontWeight: '800', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', color: '#64748b' }}
                  />
                  <Area type="monotone" dataKey="heartRate" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorHr)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-shadow">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Community Indices</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">San Francisco District Pulse</p>
                </div>
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-indigo-100">SA-3 Zone</span>
             </div>
             <div className="flex-1 flex flex-col justify-center space-y-8">
                {[
                  { label: 'Transmission Risk', val: 12, max: 100, color: 'rose', bg: 'bg-rose-500' },
                  { label: 'Facility Readiness', val: 94, max: 100, color: 'emerald', bg: 'bg-emerald-500' },
                  { label: 'Supply Stability', val: 78, max: 100, color: 'blue', bg: 'bg-blue-500' },
                ].map((item, i) => (
                  <div key={i} className="group/item">
                    <div className="flex justify-between items-end text-[10px] font-black mb-3">
                       <span className="text-slate-400 uppercase tracking-[0.2em] group-hover/item:text-slate-600 transition-colors">{item.label}</span>
                       <span className={`text-${item.color}-600 tracking-tighter text-sm`}>{item.val}%</span>
                    </div>
                    <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100 relative shadow-inner">
                       <div 
                        className={`${item.bg} h-full rounded-full transition-all duration-[2000ms] ease-out relative shadow-[0_0_15px_rgba(0,0,0,0.1)]`} 
                        style={{ width: `${item.val}%` }}
                       >
                          {/* Animated sheen effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;