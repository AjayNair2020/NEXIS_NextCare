
// ... existing imports ...
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import HealthAssistant from './components/HealthAssistant';
import ProfileManager from './components/ProfileManager';
import AppointmentManager from './components/AppointmentManager';
import HealthMap from './components/HealthMap';
import TaxonomyExplorer from './components/TaxonomyExplorer';
import OperationsManager from './components/OperationsManager';
import OperationalOptimizer from './components/OperationalOptimizer';
import PlanningManager from './components/PlanningManager';
import SupplyChainManager from './components/SupplyChainManager';
import PreventiveHealthManager from './components/PreventiveHealthManager';
import RBACManager from './components/RBACManager';
import RightPanel from './components/RightPanel';
import LandingPage from './components/LandingPage';
import FloatingChatBot from './components/FloatingChatBot';
import { User, DynamicRACI } from './types';
import { INITIAL_RACI } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [raciConfig, setRaciConfig] = useState<DynamicRACI>(INITIAL_RACI);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const [isAlertActive, setIsAlertActive] = useState(false);

  const triggerAlert = () => {
    setIsAlertActive(true);
    setTimeout(() => setIsAlertActive(false), 5000);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const hasAccess = (tab: string) => {
    const roles = raciConfig[tab as keyof DynamicRACI];
    return roles?.includes(user.role);
  };

  const renderContent = () => {
    if (!hasAccess(activeTab)) {
      return (
        <div className={`flex flex-col items-center justify-center h-full text-center p-12 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Access Restricted</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            Your current credential level ({user.role.replace('_', ' ')}) is not authorized to access the {activeTab.toUpperCase()} module as per the Dynamic RACI matrix.
          </p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="mt-8 px-6 py-2 bg-red-500 text-white font-bold rounded-xl text-xs uppercase"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard isDarkMode={isDarkMode} />;
      case 'assistant': return <HealthAssistant />;
      case 'profile': return <ProfileManager />;
      case 'appointments': return <AppointmentManager />;
      case 'operations':
        return (
          <div className="space-y-8 h-full">
            <OperationsManager />
            <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
               <HealthMap variant="operations" />
            </div>
          </div>
        );
      case 'strategy': return <OperationalOptimizer />;
      case 'planning': return <PlanningManager isDarkMode={isDarkMode} />;
      case 'supplyChain': return <SupplyChainManager isDarkMode={isDarkMode} />;
      case 'preventiveHealth': return <PreventiveHealthManager isDarkMode={isDarkMode} />;
      case 'map': return <HealthMap />;
      case 'taxonomy': return <TaxonomyExplorer />;
      case 'rbac': return <RBACManager raciConfig={raciConfig} onUpdateRACI={setRaciConfig} />;
      default: return <Dashboard isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen flex overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} ${isAlertActive ? 'ring-[12px] ring-rose-500/20' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
        raciConfig={raciConfig}
        isDarkMode={isDarkMode}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main ref={mainScrollRef} className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} mr-80 p-8 h-screen overflow-y-auto custom-scrollbar relative transition-all duration-500`}>
        {/* Top Bar */}
        <div className={`flex items-center justify-between mb-8 sticky top-0 backdrop-blur-md z-20 py-2 transition-colors ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-50/80'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl shadow-sm border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-red-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" placeholder="Global System Search..." className={`bg-transparent border-none focus:ring-0 text-sm font-medium w-64 placeholder:text-slate-400 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-600'}`} />
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-xl border transition-all duration-300 group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-red-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-red-500 hover:bg-slate-50 shadow-sm'}`}>
              {isDarkMode ? (
                <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 17.95l.707-.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4">
              <div className="text-right">
                <p className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{user.fullName}</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <p className="text-[9px] text-red-600 font-black uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={isDarkMode ? 'dark-theme-content' : ''}>
          {renderContent()}
        </div>
      </main>
      <RightPanel user={user} setActiveTab={setActiveTab} mainScrollRef={mainScrollRef} onTriggerAlert={triggerAlert} isDarkMode={isDarkMode} />
      <FloatingChatBot isDarkMode={isDarkMode} />
    </div>
  );
};

export default App;
