
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
import PharmaIndustryManager from './components/PharmaIndustryManager';
import PreventiveHealthManager from './components/PreventiveHealthManager';
import RBACManager from './components/RBACManager';
import PriceModelManager from './components/PriceModelManager';
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
  const [isGISBotOpen, setIsGISBotOpen] = useState(false);
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

  // Permission Check
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
            className="mt-8 px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} />;
      case 'assistant':
        return <HealthAssistant />;
      case 'profile':
        return <ProfileManager />;
      case 'appointments':
        return <AppointmentManager />;
      case 'operations':
        return (
          <div className="space-y-8 h-full">
            <OperationsManager />
            <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
               <HealthMap variant="operations" />
            </div>
          </div>
        );
      case 'strategy':
        return <OperationalOptimizer />;
      case 'planning':
        return <PlanningManager isDarkMode={isDarkMode} />;
      case 'supplyChain':
        return <SupplyChainManager isDarkMode={isDarkMode} />;
      case 'pharmaIndustry':
        return <PharmaIndustryManager isDarkMode={isDarkMode} />;
      case 'preventiveHealth':
        return <PreventiveHealthManager isDarkMode={isDarkMode} />;
      case 'map':
        return <HealthMap />;
      case 'taxonomy':
        return <TaxonomyExplorer />;
      case 'priceModel':
        return <PriceModelManager />;
      case 'rbac':
        return <RBACManager raciConfig={raciConfig} onUpdateRACI={setRaciConfig} />;
      default:
        return <Dashboard isDarkMode={isDarkMode} />;
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
      
      {/* Main Workspace */}
      <main 
        ref={mainScrollRef}
        className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} mr-80 p-8 h-screen overflow-y-auto custom-scrollbar relative transition-all duration-500`}
      >
        {isAlertActive && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
            <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Emergency Protocol: Area SA-3 High Inflow</span>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className={`flex items-center justify-between mb-8 sticky top-0 backdrop-blur-md z-[60] py-2 transition-colors ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-50/80'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl shadow-sm border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Global System Search..."
                className={`bg-transparent border-none focus:ring-0 text-sm font-medium w-64 placeholder:text-slate-400 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-600'}`}
              />
            </div>
            
            <div className="flex items-center gap-4">
              {/* GIS Toggle in Header */}
              <button 
                onClick={() => setIsGISBotOpen(!isGISBotOpen)}
                className={`p-2.5 rounded-xl border transition-all duration-300 group ${
                  isGISBotOpen 
                    ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                    : (isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-500 hover:bg-slate-800' : 'bg-white border-slate-200 text-amber-500 hover:bg-amber-50')
                }`}
                title="Toggle GIS Analysis Intelligence"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  <circle cx="12" cy="12" r="3" strokeWidth={2} />
                </svg>
              </button>

              {/* Theme Toggle Button */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-xl border transition-all duration-300 group ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 17.95l.707-.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="flex items-center gap-3 pl-4">
                <div className="text-right">
                  <p className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{user.fullName}</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black text-xs shadow-lg border border-white/10">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>

          <div className={isDarkMode ? 'dark-theme-content' : ''}>
            {renderContent()}
          </div>
        </div>

        {/* Global GeoBot Intelligence Drawer - Outside Map Window */}
        <div 
          className={`fixed bottom-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isGISBotOpen 
              ? 'left-[260px] right-[340px] h-[55vh]' 
              : 'left-[260px] right-[340px] h-0'
          } ${isSidebarCollapsed ? 'left-[100px]' : 'left-[260px]'}`}
        >
          {isGISBotOpen && (
            <div className="flex flex-col h-full bg-white rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] border-t border-x border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-700">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-[#FFF9F2] backdrop-blur-md">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tighter text-slate-800 italic">GIS AI Analysis Intelligence</h3>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.15em]">Sovereign Geospatial Pipeline • geobots.xyz</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black uppercase text-emerald-600">Active Syncing</span>
                    <span className="text-[9px] font-bold text-slate-400">Regional Cluster SF-04</span>
                  </div>
                  <button 
                    onClick={() => setIsGISBotOpen(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-200/50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-[#F8FAFC]">
                <iframe 
                  src="https://geobots.xyz/" 
                  className="w-full h-full border-none"
                  title="GIS Analysis Bot"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Right Intelligence Panel */}
      <RightPanel 
        user={user}
        setActiveTab={setActiveTab} 
        mainScrollRef={mainScrollRef} 
        onTriggerAlert={triggerAlert}
        isDarkMode={isDarkMode}
      />

      {/* Persistent AI Chatbot */}
      <FloatingChatBot isDarkMode={isDarkMode} />
    </div>
  );
};

export default App;
