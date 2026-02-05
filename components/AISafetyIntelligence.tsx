
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_SIEM_EVENTS, MOCK_NIST_CSF } from '../constants';
import { SIEMEvent, NISTCategory } from '../types';

interface AISafetyIntelligenceProps {
  isDarkMode?: boolean;
}

const INTEGRITY_TREND = [
  { date: '00:00', score: 98.2 },
  { date: '04:00', score: 98.5 },
  { date: '08:00', score: 97.4 },
  { date: '12:00', score: 99.1 },
  { date: '16:00', score: 98.8 },
  { date: '20:00', score: 98.2 },
  { date: '23:59', score: 98.9 },
];

const AISafetyIntelligence: React.FC<AISafetyIntelligenceProps> = ({ isDarkMode }) => {
  const [selectedEvent, setSelectedEvent] = useState<SIEMEvent | null>(null);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Global System Integrity</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-500">98.9%</span>
            <span className="text-[10px] font-bold text-slate-400">NOMINAL</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[98.9%]" />
          </div>
        </div>
        <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Threat Mitigation Speed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-500">12ms</span>
            <span className="text-[10px] font-bold text-slate-400">AVG LATENCY</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[92%]" />
          </div>
        </div>
        <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active NIST Controls</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-500">101/101</span>
            <span className="text-[10px] font-bold text-slate-400">LOCKED</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SIEM Monitoring Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">SIEM Live Ingress</h3>
            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Real-time Sync
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_SIEM_EVENTS.map(event => (
              <button 
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`w-full text-left p-5 rounded-3xl border transition-all group ${
                  selectedEvent?.id === event.id 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xl' 
                    : (isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-blue-100 shadow-sm')
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    selectedEvent?.id === event.id ? 'bg-white/20 border-white/30 text-white' : getSeverityStyle(event.severity)
                  }`}>
                    {event.severity}
                  </span>
                  <span className={`text-[8px] font-bold ${selectedEvent?.id === event.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold mb-1 truncate">{event.description}</h4>
                <p className={`text-[9px] font-medium uppercase tracking-tighter ${selectedEvent?.id === event.id ? 'text-blue-100/70' : 'text-slate-400'}`}>
                  Source: {event.source}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* NIST CSF Compliance & Trend Analysis */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trend Curve */}
          <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold">System Integrity Curve</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">24-Hour Behavioral Baseline</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-500">Integrity Score</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INTEGRITY_TREND}>
                  <defs>
                    <linearGradient id="integrityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '700'}} />
                  <YAxis domain={[95, 100]} hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                      padding: '12px', 
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff' 
                    }} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#integrityGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NIST CSF Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-8 rounded-[2.5rem] border shadow-sm lg:col-span-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-bold">NIST CSF Dashboard</h3>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cybersecurity Framework Compliance Tier 4</p>
                </div>
                <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Audit Evidence</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {MOCK_NIST_CSF.map(cat => (
                  <div key={cat.id} className={`p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">{cat.name}</p>
                    <div className="flex items-center justify-center mb-4">
                       <div className="relative w-16 h-16">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={176} strokeDashoffset={176 * (1 - cat.score / 100)} className="text-blue-500 transition-all duration-1000" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800">{cat.score}%</span>
                       </div>
                    </div>
                    <p className="text-[9px] text-center font-bold text-slate-500 uppercase">{cat.controls} Controls</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDarkMode ? 'bg-[#1a263e] border-blue-900/40' : 'bg-slate-900 text-white border-slate-800'}`}>
               <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4 italic">Security Advisor Directive</h4>
               <p className="text-xs leading-relaxed opacity-80 font-medium">
                  "NEXIS AI has identified a 1.2% integrity drift in regional node SF-04. Recommend rolling rotate of AES-256 cluster keys and re-triggering NIST control PR.AC-1 verification."
               </p>
            </div>

            <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50 border-emerald-100'}`}>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Defense Matrix</p>
               <h4 className="text-2xl font-black text-emerald-800 mb-2">ACTIVE GUARD</h4>
               <p className="text-xs text-emerald-700/70 font-medium">Global AI Guardian clusters are at 100% operational readiness. Zero undetected vectors in last 72 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISafetyIntelligence;
