
import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import HealthAssistant from './components/HealthAssistant';
import ProfileManager from './components/ProfileManager';
import AppointmentManager from './components/AppointmentManager';
import HealthMap from './components/HealthMap';
import TaxonomyExplorer from './components/TaxonomyExplorer';
import OperationsManager from './components/OperationsManager';
import OperationalOptimizer from './components/OperationalOptimizer';
import RBACManager from './components/RBACManager';
import RightPanel from './components/RightPanel';
import LandingPage from './components/LandingPage';
import { User, DynamicRACI } from './types';
import { INITIAL_RACI } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [raciConfig, setRaciConfig] = useState<DynamicRACI>(INITIAL_RACI);
  const mainScrollRef = useRef<HTMLElement>(null);
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
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h3>
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
        return <Dashboard />;
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
      case 'map':
        return <HealthMap />;
      case 'taxonomy':
        return <TaxonomyExplorer />;
      case 'rbac':
        return <RBACManager raciConfig={raciConfig} onUpdateRACI={setRaciConfig} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex overflow-hidden transition-all duration-500 ${isAlertActive ? 'ring-[12px] ring-rose-500/20' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
        raciConfig={raciConfig}
      />
      
      {/* Main Workspace */}
      <main 
        ref={mainScrollRef}
        className="flex-1 ml-64 mr-80 p-8 h-screen overflow-y-auto custom-scrollbar relative"
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
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Global System Search..."
                className="bg-transparent border-none focus:ring-0 text-slate-600 placeholder:text-slate-400 w-64 font-medium text-sm"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{user.fullName}</p>
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

          {renderContent()}
        </div>
      </main>

      {/* Persistent Right Intelligence Panel */}
      <RightPanel 
        user={user}
        setActiveTab={setActiveTab} 
        mainScrollRef={mainScrollRef} 
        onTriggerAlert={triggerAlert}
      />
    </div>
  );
};

export default App;
