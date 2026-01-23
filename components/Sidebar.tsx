
import React, { useState } from 'react';
import { User, DynamicRACI, Role } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  raciConfig: DynamicRACI;
  isDarkMode?: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

type OperationalStatus = 'active' | 'maintenance' | 'scheduled';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  status: OperationalStatus;
}

const ROLES: Role[] = ['SUPER_ADMIN', 'CLINICAL_LEAD', 'LOGISTICS_CHIEF', 'PATIENT'];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, raciConfig, isDarkMode, isCollapsed, setIsCollapsed }) => {
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [isAccessMenuExpanded, setIsAccessMenuExpanded] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', status: 'active', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'assistant', label: 'AI Assistant', status: 'active', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'preventiveHealth', label: 'Preventive Health', status: 'scheduled', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { id: 'planning', label: 'NextCare Planning', status: 'active', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
    { id: 'supplyChain', label: 'Healthcare SupplyChain', status: 'maintenance', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'pharmaIndustry', label: 'Pharma Industry', status: 'active', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'appointments', label: 'Appointments', status: 'active', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'operations', label: 'Operations', status: 'active', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10' },
    { id: 'strategy', label: 'AI Optimizer', status: 'scheduled', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'map', label: 'Health Map', status: 'active', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'taxonomy', label: 'Knowledge Hub', status: 'active', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'profile', label: 'Health Profile', status: 'active', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const filteredItems = menuItems.filter(item => {
    const roles = raciConfig[item.id as keyof DynamicRACI];
    return roles?.includes(user.role);
  });

  const getStatusConfig = (status: OperationalStatus) => {
    switch (status) {
      case 'active': return { color: 'bg-emerald-500', label: 'Active' };
      case 'maintenance': return { color: 'bg-rose-500', label: 'Maint' };
      case 'scheduled': return { color: 'bg-amber-500', label: 'Sched' };
      default: return { color: 'bg-slate-400', label: 'Unknown' };
    }
  };

  const canAccessRBAC = raciConfig.rbac?.includes(user.role);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} border-r flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-500 ease-in-out group ${isDarkMode ? 'bg-[#111d2b] border-blue-900/40 shadow-[4px_0_40px_rgba(0,0,0,0.3)]' : 'bg-white border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]'}`}>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-8 w-6 h-6 rounded-full border bg-white flex items-center justify-center shadow-md text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-all z-50 ${isCollapsed ? 'rotate-180' : ''}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={`p-6 flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center px-4' : ''}`}>
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200 shrink-0 ring-4 ring-amber-500/10 transition-transform hover:scale-110">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {!isCollapsed && (
          <h1 className={`text-xl font-black tracking-tighter uppercase italic transition-all duration-300 animate-in fade-in slide-in-from-left-2 ${isDarkMode ? 'text-blue-50' : 'text-slate-800'}`}>NextCare</h1>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                activeTab === item.id
                  ? (isDarkMode ? 'bg-blue-600/30 text-blue-100 font-bold border border-blue-500/30' : 'bg-amber-50 text-amber-700 font-bold shadow-sm')
                  : (isDarkMode ? 'text-blue-400 hover:bg-white/5 hover:text-blue-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700')
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? `${item.label} (${statusConfig.label})` : ''}
            >
              <div className={`p-2 rounded-lg transition-colors shrink-0 relative ${activeTab === item.id ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : (isDarkMode ? 'bg-[#1a263e] text-blue-400 group-hover:bg-[#233554] group-hover:text-blue-100' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600')}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {isCollapsed && (
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white ${statusConfig.color} shadow-sm`}></div>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="text-sm truncate mr-2">{item.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-blue-300/40' : 'text-slate-400'}`}>
                      {statusConfig.label}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.color} ${item.status === 'active' ? 'animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]' : ''}`}></div>
                  </div>
                </div>
              )}
              {isCollapsed && activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`p-4 border-t transition-all ${isDarkMode ? 'border-blue-900/30' : 'border-slate-100'}`}>
        <div className={`rounded-[1.5rem] p-5 border relative overflow-hidden group shadow-inner transition-all duration-500 ${isDarkMode ? 'bg-[#1a263e] border-blue-800' : 'bg-slate-50 border-slate-100'} ${isCollapsed ? 'p-3 items-center flex flex-col gap-4' : ''}`}>
          
          {!isCollapsed && (
            <button 
              onClick={() => setIsProfileExpanded(!isProfileExpanded)}
              className={`absolute top-4 right-4 text-slate-400 hover:text-amber-500 transition-colors z-10`}
              title={isProfileExpanded ? "Minimize Profile" : "Expand Profile"}
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${isProfileExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                 <div className="w-8 h-8 rounded-lg bg-[#23324a] border border-blue-700/30 flex items-center justify-center text-white font-black text-[10px]">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                 </div>
                 {isProfileExpanded && (
                   <div className="animate-in fade-in slide-in-from-left-1">
                     <p className={`text-sm font-bold truncate transition-colors ${isDarkMode ? 'text-blue-50' : 'text-slate-800'}`}>{user.fullName}</p>
                     <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
                   </div>
                 )}
              </div>

              {isProfileExpanded && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-widest mb-1">Session Protocol</p>
                    <p className={`text-[10px] font-medium italic ${isDarkMode ? 'text-blue-200/40' : 'text-slate-500'}`}>Biometric Lock: Active</p>
                  </div>
                  
                  {canAccessRBAC && (
                    <div className="space-y-1">
                      <button 
                        onClick={() => setIsAccessMenuExpanded(!isAccessMenuExpanded)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAccessMenuExpanded ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : (isDarkMode ? 'bg-white/5 text-blue-200 hover:text-amber-400' : 'bg-slate-50 text-slate-500 hover:text-amber-600')}`}
                      >
                        <div className="flex items-center gap-2">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                           </svg>
                           Access Matrix
                        </div>
                        <svg className={`w-3 h-3 transition-transform ${isAccessMenuExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isAccessMenuExpanded && (
                        <div className="pl-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                          {ROLES.map(role => (
                            <button
                              key={role}
                              onClick={() => setActiveTab('rbac')}
                              className={`w-full text-left py-1.5 text-[9px] font-black uppercase tracking-tighter transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-100' : 'text-slate-400 hover:text-slate-800'}`}
                            >
                              • {role.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={onLogout}
                    className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 group/logout"
                  >
                    Terminate Session
                    <svg className="w-3 h-3 group-hover/logout:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-[#23324a] flex items-center justify-center text-white font-black text-[10px]">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              {canAccessRBAC && (
                <button 
                  onClick={() => setActiveTab('rbac')}
                  title="Access Matrix"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === 'rbac' ? 'bg-amber-500 text-white shadow-lg' : (isDarkMode ? 'bg-[#1a263e] text-blue-300 border border-blue-700' : 'bg-white border border-slate-200 text-slate-400 hover:text-amber-600')}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
              )}
              <button 
                onClick={onLogout}
                title="Terminate Session"
                className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
