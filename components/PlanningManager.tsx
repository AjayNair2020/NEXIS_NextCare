
import React, { useState } from 'react';
import { MOCK_SERVICE_AREAS, MOCK_FACILITIES, MOCK_INVENTORY, MOCK_TRANSPORTS } from '../constants';
import HealthMap from './HealthMap';

interface PlanningManagerProps {
  isDarkMode?: boolean;
}

const PlanningManager: React.FC<PlanningManagerProps> = ({ isDarkMode }) => {
  const [activeLayer, setActiveLayer] = useState<'population' | 'capacity' | 'logistics'>('population');
  const [isStressTesting, setIsStressTesting] = useState(false);

  const planningStats = [
    { label: 'Population Served', val: '108k', unit: 'residents', trend: '+1.2%', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Clinical Capacity', val: '840', unit: 'beds', trend: 'Stable', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Logistics Reach', val: '98.2%', unit: 'coverage', trend: '+0.5%', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { label: 'Resource Density', val: '4.2', unit: 'hub/sqkm', trend: 'Optimal', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
  ];

  const handleStressTest = () => {
    setIsStressTesting(true);
    setTimeout(() => setIsStressTesting(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>NextCare Strategic Planning</h2>
          <p className="text-slate-500 font-medium">ESRI-powered geospatial health BI and regional resource modeling.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleStressTest}
            disabled={isStressTesting}
            className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
              isStressTesting 
                ? 'bg-rose-500/10 text-rose-500 cursor-not-allowed border border-rose-500/20' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10'
            }`}
          >
            {isStressTesting && <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>}
            Run Regional Stress Test
          </button>
        </div>
      </header>

      {/* High Density KPI Rail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planningStats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
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
              stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Spatial BI Engine (Map View) */}
        <div className={`lg:col-span-2 rounded-[2.5rem] border shadow-sm overflow-hidden relative group transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="absolute top-6 left-6 z-[20] flex flex-col gap-2">
            {[
              { id: 'population', label: 'Demographics Heatmap', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857' },
              { id: 'capacity', label: 'Clinical Bed Utilization', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16' },
              { id: 'logistics', label: 'Logistics Reach Isochrones', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7' }
            ].map(layer => (
              <button 
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as any)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md shadow-lg ${
                  activeLayer === layer.id 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : (isDarkMode ? 'bg-slate-950/80 text-slate-400 border-slate-800' : 'bg-white/80 text-slate-600 border-slate-100')
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={layer.icon} /></svg>
                {layer.label}
              </button>
            ))}
          </div>

          <div className="w-full h-full relative">
            <HealthMap variant="optimizer" />
            {isStressTesting && (
              <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[1px] pointer-events-none z-[30] flex items-center justify-center">
                 <div className="bg-rose-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce border border-rose-400">
                    <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Regional Overload: Simulating Surge Impact</span>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Planning Panel */}
        <div className={`rounded-[2.5rem] border shadow-sm p-8 overflow-y-auto custom-scrollbar transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="mb-8">
            <h3 className={`text-xl font-bold mb-1 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Optimization Targets</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Prioritized System Improvements</p>
          </div>

          <div className="space-y-4">
            {MOCK_SERVICE_AREAS.map(area => {
              const stress = area.efficiencyScore < 80 ? 'high' : area.efficiencyScore < 90 ? 'med' : 'low';
              return (
                <div key={area.id} className={`p-5 rounded-3xl border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className={`text-sm font-black transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{area.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">District Area SA-3</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      stress === 'high' ? 'bg-rose-500/10 text-rose-500' : stress === 'med' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {stress} Load
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resource Gap</span>
                      <span className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{100 - area.efficiencyScore}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                       <div className={`h-full transition-all duration-1000 ${
                         stress === 'high' ? 'bg-rose-500' : stress === 'med' ? 'bg-amber-500' : 'bg-emerald-500'
                       }`} style={{ width: `${100 - area.efficiencyScore}%` }}></div>
                    </div>
                  </div>

                  <button className={`w-full mt-6 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30' : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-500'
                  }`}>
                    Allocate Resources
                  </button>
                </div>
              );
            })}
          </div>

          <div className={`mt-8 p-6 rounded-3xl border transition-colors ${isDarkMode ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
             <h5 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Planning Insight
             </h5>
             <p className={`text-[11px] leading-relaxed font-medium transition-colors ${isDarkMode ? 'text-blue-200/70' : 'text-blue-800/70'}`}>
               Predictive models suggest a <span className="font-bold underline">14% population increase</span> in Mission District over the next 18 months. New primary care hub fac-4 expansion recommended.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningManager;
