
import React, { useState } from 'react';
import { MOCK_FACILITIES, MOCK_INVENTORY, MOCK_TRANSPORTS } from '../constants';

type PreventiveSubTab = 'wholistic' | 'traditional' | 'physical' | 'mental' | 'rehabilitation' | 'geriatric' | 'nutrition' | 'sleep';

interface DomainConfig {
  id: PreventiveSubTab;
  label: string;
  icon: string;
  kpis: { label: string; value: string; trend: string; color: string }[];
  oversight: { unit: string; headCount: number; load: string }[];
  supply: { name: string; level: number; status: string }[];
}

const PREVENTIVE_DOMAINS: DomainConfig[] = [
  {
    id: 'wholistic',
    label: 'Wholistic Medicine',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 17.95l.707-.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z',
    kpis: [
      { label: 'Patient Engagement', value: '78%', trend: '+4%', color: 'emerald' },
      { label: 'Bio-Sync Rate', value: '92%', trend: 'Stable', color: 'blue' }
    ],
    oversight: [{ unit: 'Integrated Care Hub', headCount: 12, load: 'Optimal' }],
    supply: [
      { name: 'Natural Supplement Packs', level: 85, status: 'Optimal' },
      { name: 'Aroma Therapy Kits', level: 42, status: 'Restock Advised' }
    ]
  },
  {
    id: 'traditional',
    label: 'Traditional Medicine',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    kpis: [
      { label: 'Acupuncture Sessions', value: '420', trend: '+12%', color: 'amber' },
      { label: 'Herbal Adherence', value: '88%', trend: '+2%', color: 'emerald' }
    ],
    oversight: [{ unit: 'Eastern Therapies Wing', headCount: 8, load: 'High' }],
    supply: [
      { name: 'Pure Ginseng Extract', level: 12, status: 'Critical' },
      { name: 'Sterile Needle Sets', level: 94, status: 'Surplus' }
    ]
  },
  {
    id: 'physical',
    label: 'Physical Training',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    kpis: [
      { label: 'Active Gym Members', value: '1,240', trend: '+15%', color: 'blue' },
      { label: 'Avg HR Improvement', value: '6bpm', trend: 'Optimal', color: 'emerald' }
    ],
    oversight: [{ unit: 'Peak Performance Lab', headCount: 24, load: 'Peak' }],
    supply: [
      { name: 'HRM Chest Straps', level: 60, status: 'Stable' },
      { name: 'Isotonic Recovery Gel', level: 25, status: 'Low' }
    ]
  },
  {
    id: 'mental',
    label: 'Mental Wellbeing',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    kpis: [
      { label: 'Stress Index Avg', value: '3.2', trend: '-0.8', color: 'emerald' },
      { label: 'Counseling Completion', value: '94%', trend: 'Stable', color: 'indigo' }
    ],
    oversight: [{ unit: 'Mindfulness Sanctuary', headCount: 15, load: 'Optimal' }],
    supply: [
      { name: 'VR Meditation Visors', level: 98, status: 'Surplus' },
      { name: 'Bio-Feedback Sensors', level: 14, status: 'Restock Required' }
    ]
  },
  {
    id: 'geriatric',
    label: 'Geriatric Services',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    kpis: [
      { label: 'Mobility Score', value: '72/100', trend: '+5%', color: 'emerald' },
      { label: 'Cognitive Baseline', value: 'Stable', trend: 'Monitored', color: 'blue' }
    ],
    oversight: [{ unit: 'Senior Wellness Pavilion', headCount: 32, load: 'Steady' }],
    supply: [
      { name: 'Smart Walkers (Gen 4)', level: 45, status: 'Stable' },
      { name: 'Fall Detection Nodes', level: 120, status: 'Optimal' }
    ]
  },
];

const PreventiveHealthManager: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode }) => {
  const [activeDomain, setActiveDomain] = useState<PreventiveSubTab>('wholistic');

  const currentConfig = PREVENTIVE_DOMAINS.find(d => d.id === activeDomain) || PREVENTIVE_DOMAINS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Preventive Ecosystem</h2>
          <p className="text-slate-500 font-medium">Proactive health maintenance and regional wellness monitoring.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">NEXIS Wellness Sync: Active</span>
        </div>
      </header>

      {/* Internal Sub-Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {PREVENTIVE_DOMAINS.map(domain => (
          <button
            key={domain.id}
            onClick={() => setActiveDomain(domain.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeDomain === domain.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={domain.icon} />
            </svg>
            {domain.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Domain Intelligence Center */}
        <div className="lg:col-span-2 space-y-8">
          {/* Domain KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentConfig.kpis.map((kpi, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{kpi.label}</p>
                <div className="flex items-baseline gap-4">
                  <span className={`text-4xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{kpi.value}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                    kpi.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Operational Oversight */}
          <div className={`rounded-[2.5rem] border shadow-sm p-10 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10" /></svg>
                </div>
                Clinical Oversight
              </h3>
              <button className="text-[10px] font-black uppercase text-blue-600 hover:underline tracking-[0.2em]">Deploy Personnel</button>
            </div>

            <div className="space-y-6">
              {currentConfig.oversight.map((unit, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-slate-400">
                      {unit.unit.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{unit.unit}</h4>
                      <p className="text-xs text-slate-500 font-medium">Assigned Practitioners: {unit.headCount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Operational Load</p>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      unit.load === 'Optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {unit.load}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logistics & Asset Supply Chain */}
        <div className="space-y-8">
          <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Domain Assets
            </h3>
            
            <div className="space-y-6">
              {currentConfig.supply.map((item, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${
                      item.status.includes('Critical') ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {item.level}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        item.level > 50 ? 'bg-emerald-500' : item.level > 25 ? 'bg-amber-500' : 'bg-rose-500'
                      }`} 
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">{item.status}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">
              Initialize Domain Restock
            </button>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 italic">Nexis Strategic Suggestion</h4>
            <p className="text-xs leading-relaxed opacity-80 font-medium">
              Engagement in <span className="text-white underline">{currentConfig.label}</span> is outperforming seasonal benchmarks by 14.2%. Recommend reallocation of 20% clinical staff from primary triage to wellness maintenance.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                 <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Confidence 98.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventiveHealthManager;
