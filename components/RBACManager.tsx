
import React from 'react';
import { DynamicRACI, Role } from '../types';

interface RBACManagerProps {
  raciConfig: DynamicRACI;
  onUpdateRACI: (config: DynamicRACI) => void;
}

const ROLES: Role[] = ['SUPER_ADMIN', 'CLINICAL_LEAD', 'LOGISTICS_CHIEF', 'PATIENT'];

const MODULES: { id: keyof DynamicRACI; label: string; desc: string }[] = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Central command for health metrics and active alerts.' },
  { id: 'assistant', label: 'AI Assistant', desc: 'Clinical context engine for triage and research.' },
  { id: 'appointments', label: 'Appointments', desc: 'Logistics-integrated visit planning.' },
  { id: 'operations', label: 'Operations', desc: 'Real-time supply chain and fleet tracking.' },
  { id: 'strategy', label: 'AI Optimizer', desc: 'Advanced simulation for resource reallocation.' },
  { id: 'map', label: 'Health Map', desc: 'Spatial intelligence and epidemiological views.' },
  { id: 'taxonomy', label: 'Knowledge Hub', desc: 'Hierarchical medical encyclopedia.' },
  { id: 'profile', label: 'Health Profile', desc: 'Personal records and medication compliance.' },
  { id: 'rbac', label: 'RBAC Admin', desc: 'Security console for system-wide access control.' },
  { id: 'planning', label: 'Strategic Planning', desc: 'Geospatial health BI and regional modeling.' },
  { id: 'supplyChain', label: 'Supply Chain', desc: 'Integrated inventory and fulfillment command.' },
  { id: 'preventiveHealth', label: 'Preventive Ecosystem', desc: 'Wellness monitoring and proactive maintenance.' },
];

const RBACManager: React.FC<RBACManagerProps> = ({ raciConfig, onUpdateRACI }) => {
  const togglePermission = (moduleId: keyof DynamicRACI, role: Role) => {
    if (moduleId === 'rbac' && role === 'SUPER_ADMIN') return;

    const currentRoles = raciConfig[moduleId] || [];
    let nextRoles: Role[];

    if (currentRoles.includes(role)) {
      nextRoles = currentRoles.filter(r => r !== role);
    } else {
      nextRoles = [...currentRoles, role];
    }

    onUpdateRACI({
      ...raciConfig,
      [moduleId]: nextRoles
    });
  };

  const toggleAllForRole = (role: Role) => {
    const isCurrentlyFull = MODULES.every(mod => (raciConfig[mod.id] || []).includes(role));
    const newConfig = { ...raciConfig };

    MODULES.forEach(mod => {
      if (mod.id === 'rbac' && role === 'SUPER_ADMIN') return; // Keep super admin enabled for RBAC
      
      const currentRoles = [...(newConfig[mod.id] || [])];
      if (isCurrentlyFull) {
        // Disable all (except essential)
        newConfig[mod.id] = currentRoles.filter(r => r !== role);
      } else {
        // Enable all
        if (!currentRoles.includes(role)) {
          newConfig[mod.id] = [...currentRoles, role];
        }
      }
    });

    onUpdateRACI(newConfig);
  };

  const isDark = true;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col gap-2">
        <h2 className={`text-3xl font-bold tracking-tight transition-colors ${isDark ? 'text-blue-50' : 'text-slate-800'}`}>System Integrity Console</h2>
        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
          Manage the NEXIS 2.0 Dynamic RACI Matrix. Changes here propagate instantly across the platform, 
          enabling or restricting module visibility for specific biometric credential levels.
        </p>
      </header>

      <div className={`rounded-[2.5rem] shadow-2xl border overflow-hidden transition-all ${isDark ? 'bg-[#23324a] border-blue-800' : 'bg-white border-slate-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors ${isDark ? 'bg-[#111d2b]/50 border-blue-800' : 'bg-slate-50/80 border-slate-100'}`}>
                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">Application Module</th>
                {ROLES.map(role => (
                  <th key={role} className="px-6 py-8 text-center min-w-[120px]">
                    <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-3 transition-colors ${isDark ? 'text-blue-300' : 'text-slate-600'}`}>{role.replace('_', ' ')}</p>
                    <button 
                      onClick={() => toggleAllForRole(role)}
                      className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded border transition-all ${isDark ? 'text-blue-400 border-blue-800 hover:text-white hover:bg-blue-800' : 'text-slate-400 border-slate-200 hover:bg-slate-100'}`}
                    >
                      Master Toggle
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors ${isDark ? 'divide-blue-900/30' : 'divide-slate-50'}`}>
              {MODULES.map((module) => (
                <tr key={module.id} className={`group transition-colors ${isDark ? 'hover:bg-[#1a263e]/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold transition-colors ${isDark ? 'text-blue-50 group-hover:text-amber-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>{module.label}</span>
                      <span className={`text-[10px] font-medium leading-relaxed mt-0.5 ${isDark ? 'text-blue-300/40' : 'text-slate-400'}`}>{module.desc}</span>
                    </div>
                  </td>
                  {ROLES.map(role => {
                    const isEnabled = (raciConfig[module.id] || []).includes(role);
                    const isRestricted = module.id === 'rbac' && role === 'SUPER_ADMIN';
                    
                    return (
                      <td key={role} className="px-6 py-6 text-center">
                        <button
                          onClick={() => togglePermission(module.id, role)}
                          disabled={isRestricted}
                          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                            isEnabled 
                              ? (isDark ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]') 
                              : (isDark ? 'bg-blue-900/40 border border-blue-800/50' : 'bg-slate-200')
                          } ${isRestricted ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
                            isEnabled ? 'left-7' : 'left-1'
                          }`}></div>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl transition-all ${isDark ? 'bg-[#111d2b] border border-blue-800' : 'bg-slate-900'}`}>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-6 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
            System Integrity Log
          </h4>
          <p className="text-sm text-blue-100/70 leading-relaxed font-medium">
            All RACI changes are logged with biometric timestamps. Access revokes will immediately disconnect 
            active sessions if the module is currently being viewed by a restricted credential level.
          </p>
        </div>
        <div className={`rounded-[2.5rem] p-10 transition-all border ${isDark ? 'bg-[#23324a] border-blue-800 text-blue-50' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
          <h4 className={`text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3 ${isDark ? 'text-amber-500' : 'text-emerald-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Live Security Propagation
          </h4>
          <div className="flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full animate-ping ${isDark ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
             <p className={`text-sm font-bold ${isDark ? 'text-blue-100' : 'text-emerald-700'}`}>Synchronous RBAC Sync: 100% Signal Strength</p>
          </div>
          <p className={`mt-4 text-xs opacity-60 italic leading-relaxed ${isDark ? 'text-blue-300' : 'text-emerald-600'}`}>Platform telemetry indicates 0.2ms latency in permission propagation across regional nodes.</p>
        </div>
      </div>
    </div>
  );
};

export default RBACManager;
