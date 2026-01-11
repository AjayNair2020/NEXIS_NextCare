
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_HEALTH_METRICS, MOCK_APPOINTMENTS, MOCK_DOCTORS } from '../constants';
import HealthMap from './HealthMap';

interface DashboardProps {
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [selectedDate, setSelectedDate] = useState('2023-10-24');

  const filteredAppointments = MOCK_APPOINTMENTS.filter(app => app.date === selectedDate);

  const getTreatmentPhase = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 10) return { label: 'Triage', color: 'bg-blue-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };
    if (hour < 12) return { label: 'Consultation', color: 'bg-emerald-500', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' };
    if (hour < 14) return { label: 'Procedure', color: 'bg-amber-500', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' };
    return { label: 'Recovery', color: 'bg-indigo-500', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Welcome back, Alex!</h2>
          <p className="text-slate-500 font-medium">Your physiological vectors are within optimal range. System sync complete.</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl shadow-sm border flex items-center gap-2 group transition-all cursor-default ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Live Bio-Telemetry</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Heart Rate', value: '72', unit: 'bpm', trend: '-2%', color: 'rose', isLive: true, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
          { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', trend: 'Stable', color: 'blue', isLive: false, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { label: 'Avg Steps', value: '9,450', unit: 'steps', trend: '+12%', color: 'emerald', isLive: false, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Throughput', value: '88%', unit: 'eff', trend: '+5%', color: 'indigo', isLive: false, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2rem] shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-50/10 text-${stat.color}-500 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner border border-${stat.color}-500/20`}>
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
              <span className={`text-3xl font-black transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{stat.value}</span>
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

      {/* Clinical Schedule Section */}
      <section className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h3 className={`text-xl font-bold flex items-center gap-3 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                Clinical Calendar
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Operational Triage & Resource Allocation Flow</p>
           </div>
           
           <div className={`flex p-1 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              {[
                { date: '2023-10-23', label: 'MON', d: '23' },
                { date: '2023-10-24', label: 'TUE', d: '24' },
                { date: '2023-10-25', label: 'WED', d: '25' },
                { date: '2023-10-26', label: 'THU', d: '26' },
                { date: '2023-10-27', label: 'FRI', d: '27' },
              ].map(day => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`px-4 py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all min-w-[64px] ${
                    selectedDate === day.date 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105 z-10' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest">{day.label}</span>
                  <span className="text-sm font-black">{day.d}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Schedule Feed */}
           <div className="lg:col-span-3 space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {filteredAppointments.length > 0 ? filteredAppointments.map(app => {
                const phase = getTreatmentPhase(app.time);
                const doctor = MOCK_DOCTORS.find(d => d.id === app.doctorId);
                return (
                  <div key={app.id} className={`p-5 rounded-[2rem] border transition-all group flex items-center gap-6 ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/40' : 'bg-slate-50 border-slate-100 hover:border-emerald-200 shadow-sm'}`}>
                    <div className="text-center min-w-[80px]">
                      <p className={`text-lg font-black tracking-tighter ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{app.time.split(' ')[0]}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.time.split(' ')[1]}</p>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                           <img src={doctor?.image} className="w-8 h-8 rounded-xl border border-white shadow-sm" alt="" />
                           <div>
                              <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{app.doctorName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.specialty}</p>
                           </div>
                        </div>
                        <div className={`px-3 py-1 rounded-xl flex items-center gap-2 border ${phase.color.replace('bg-', 'bg-').replace('500', '10')}/10 ${phase.color.replace('bg-', 'border-').replace('500', '200')}/20 shadow-sm`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${phase.color} animate-pulse`}></div>
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${phase.color.replace('bg-', 'text-')}`}>{phase.label}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 bg-white/5 border border-slate-200/50 rounded-xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Readiness</p>
                          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>98% Optimal</p>
                        </div>
                        <div className="p-2 bg-white/5 border border-slate-200/50 rounded-xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Patient Vector</p>
                          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Arriving: 4m</p>
                        </div>
                        <div className="p-2 bg-white/5 border border-slate-200/50 rounded-xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Complexity</p>
                          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>Moderate</p>
                        </div>
                      </div>
                    </div>

                    <button className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                );
              }) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                  <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-bold text-slate-400">No scheduled interventions for this vector.</p>
                </div>
              )}
           </div>

           {/* Schedule KPIs */}
           <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Daily Efficiency Pulse
                 </h4>
                 <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Wait Time Avg</span>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>12m</span>
                      </div>
                      <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[12%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Room Utilization</span>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>84%</span>
                      </div>
                      <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[84%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Protocol Match</span>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>99.8%</span>
                      </div>
                      <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[99%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      </div>
                    </div>
                 </div>
              </div>

              <div className={`p-6 rounded-3xl border text-white relative overflow-hidden group ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-slate-900 border-slate-800'}`}>
                 <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform"></div>
                 <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Triage Suggestion</h5>
                 <p className="text-[11px] leading-relaxed font-medium opacity-80">
                    High clinical load expected between 14:00 - 16:00. AI suggests opening secondary consultation node in Hub fac-4.
                 </p>
                 <button className="mt-4 text-[9px] font-black text-white hover:text-emerald-400 uppercase tracking-widest underline decoration-emerald-500/50 underline-offset-4 transition-colors">Apply Strategy</button>
              </div>
           </div>
        </div>
      </section>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Intelligence Map */}
        <div className={`rounded-[2.5rem] shadow-sm border overflow-hidden relative group/map transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`p-8 border-b flex items-center justify-between relative z-10 transition-colors ${isDarkMode ? 'border-slate-800 group-hover/map:bg-slate-800/50' : 'border-slate-50 group-hover/map:bg-slate-50/50'}`}>
            <div>
              <h3 className={`text-xl font-bold flex items-center gap-3 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg group-hover/map:rotate-12 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                Regional Intelligence
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">NEXIS 2.0 Spatial Awareness Overlay</p>
            </div>
          </div>
          <div className="h-[450px] w-full relative">
            <HealthMap variant="dashboard" />
          </div>
        </div>

        <div className="space-y-8">
           <div className={`p-8 rounded-[2.5rem] shadow-sm border flex flex-col hover:shadow-lg transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Heart Rate Dynamics</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">7-Day Physiological Pulse</p>
              </div>
              <div className={`flex gap-2 p-1 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} domain={[60, 90]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' }}
                    labelStyle={{ fontWeight: '800', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', color: '#64748b' }}
                  />
                  <Area type="monotone" dataKey="heartRate" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorHr)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`p-8 rounded-[2.5rem] shadow-sm border flex flex-col hover:shadow-lg transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={`text-xl font-bold transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Community Indices</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">San Francisco District Pulse</p>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-xl transition-all ${isDarkMode ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>SA-3 Zone</span>
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
                    <div className={`w-full h-3 rounded-full overflow-hidden border relative shadow-inner transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <div 
                        className={`${item.bg} h-full rounded-full transition-all duration-[2000ms] ease-out relative shadow-[0_0_15px_rgba(0,0,0,0.1)]`} 
                        style={{ width: `${item.val}%` }}
                       >
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
