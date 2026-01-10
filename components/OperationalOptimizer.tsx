import React, { useState } from 'react';
import { MOCK_SCENARIOS, MOCK_SERVICE_AREAS, MOCK_FACILITIES, MOCK_INVENTORY } from '../constants';
import { OptimizationScenario, ServiceArea } from '../types';
import { optimizeHealthcareOperations } from '../services/gemini';

const OperationalOptimizer: React.FC = () => {
  const [scenarios, setScenarios] = useState<OptimizationScenario[]>(MOCK_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<OptimizationScenario | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'areas'>('scenarios');

  const runOptimization = async (scenario: OptimizationScenario) => {
    setIsOptimizing(true);
    // Prepare a snapshot of the current system state for the AI
    const systemState = {
      facilities: MOCK_FACILITIES.map(f => ({ id: f.id, load: f.status, cap: f.capacity })),
      inventory: MOCK_INVENTORY.map(i => ({ id: i.id, name: i.name, qty: i.quantity, loc: i.locationId })),
      serviceAreas: MOCK_SERVICE_AREAS
    };

    const result = await optimizeHealthcareOperations(scenario, systemState);
    if (result) {
      setScenarios(prev => prev.map(s => s.id === scenario.id ? { ...s, aiRecommendations: result } : s));
      setSelectedScenario({ ...scenario, aiRecommendations: result });
    }
    setIsOptimizing(false);
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Strategy Hub</h2>
          <p className="text-slate-500">AI-powered optimization for care delivery and service area resilience.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('scenarios')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'scenarios' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500'}`}
          >
            Sim Scenarios
          </button>
          <button 
            onClick={() => setActiveTab('areas')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'areas' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500'}`}
          >
            Service Areas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Scenarios List / Area Table */}
        <div className="lg:col-span-1 space-y-4">
          {activeTab === 'scenarios' ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Simulated Scenarios</h3>
              {scenarios.map(scen => (
                <button
                  key={scen.id}
                  onClick={() => setSelectedScenario(scen)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all ${
                    selectedScenario?.id === scen.id 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-indigo-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      scen.type === 'surge' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {scen.type}
                    </span>
                    {scen.aiRecommendations && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Optimized
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{scen.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{scen.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Service Area Coverage</h3>
               {MOCK_SERVICE_AREAS.map(area => (
                 <div key={area.id} className="bg-white p-5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm">{area.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Population: {area.populationServed.toLocaleString()}</p>
                       </div>
                       <div className={`text-sm font-bold ${getEfficiencyColor(area.efficiencyScore)}`}>
                          {area.efficiencyScore}% Eff
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Response</p>
                          <p className="text-xs font-bold text-slate-700">{area.avgResponseTimeMin}m</p>
                       </div>
                       <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Incidents</p>
                          <p className="text-xs font-bold text-rose-500">{area.criticalIncidentCount}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Right: Optimization Engine View */}
        <div className="lg:col-span-2">
          {selectedScenario ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col min-h-0 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start mb-10 pb-8 border-b border-slate-50">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{selectedScenario.name}</h2>
                  <p className="text-slate-500 leading-relaxed max-w-xl">{selectedScenario.description}</p>
                </div>
                <button 
                  onClick={() => runOptimization(selectedScenario)}
                  disabled={isOptimizing}
                  className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold transition-all ${
                    isOptimizing ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                  }`}
                >
                  {isOptimizing ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {selectedScenario.aiRecommendations ? 'Re-Run AI Optimization' : 'Generate AI Strategy'}
                </button>
              </div>

              {selectedScenario.aiRecommendations ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Predicted Gain</p>
                      <h4 className="text-3xl font-bold text-emerald-800">+{selectedScenario.aiRecommendations.efficiencyGain}%</h4>
                    </div>
                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 col-span-2">
                       <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-3">AI Strategic Recommendation</p>
                       <p className="text-slate-700 font-medium leading-relaxed">{selectedScenario.aiRecommendations.strategy}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Resource Reallocation Plan
                      </h4>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-7 font-medium whitespace-pre-wrap">
                        {selectedScenario.aiRecommendations.resourceShift}
                      </div>
                    </div>
                    <div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Detected Bottlenecks
                      </h4>
                      <div className="space-y-3">
                         {(selectedScenario.aiRecommendations as any).bottlenecks?.map((b: string, i: number) => (
                           <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                              <span className="text-xs font-bold text-slate-700">{b}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                   <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mb-8 animate-pulse">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Awaiting Analysis</h3>
                   <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                     The Operational Optimizer uses Gemini Pro to evaluate multi-domain impacts including clinical load, supply chain, and transport logistics. Click the generate button to start.
                   </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 h-full flex flex-col items-center justify-center text-center">
               <svg className="w-16 h-16 text-slate-200 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
               <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Strategy Canvas</h3>
               <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                 Select a simulation scenario from the left to view detailed AI optimization models. You can also monitor real-time Service Area efficiency scores.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationalOptimizer;