
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
];

const RBACManager: React.FC<RBACManagerProps> = ({ raciConfig, onUpdateRACI }) => {
  const togglePermission = (moduleId: keyof DynamicRACI, role: Role) => {
    // Prevent locking Super Admin out of RBAC Admin
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">System Integrity Console</h2>
        <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
          Manage the NEXIS 2.0 Dynamic RACI Matrix. Changes here propagate instantly across the platform, 
          enabling or restricting module visibility for specific biometric credential levels.
        </p>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/3">Application Module</th>
                {ROLES.map(role => (
                  <th key={role} className="px-6 py-6 text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{role.replace('_', ' ')}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Level {ROLES.indexOf(role) + 1}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MODULES.map((module) => (
                <tr key={module.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{module.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">{module.desc}</span>
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
                            isEnabled ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-slate-200'
                          } ${isRestricted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
            System Integrity Log
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            All RACI changes are logged with biometric timestamps. Access revokes will immediately disconnect 
            active sessions if the module is currently being viewed by a restricted credential level.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8">
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Live Security Propagation
          </h4>
          <div className="flex items-center gap-4">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
             <p className="text-sm text-emerald-700 font-bold">Synchronous RBAC Sync: 100% Signal Strength</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RBACManager;
