
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'assistant', label: 'AI Assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'operations', label: 'Operations', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'strategy', label: 'AI Optimizer', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'map', label: 'Health Map', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'taxonomy', label: 'Knowledge Hub', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'profile', label: 'Health Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* NEXIS Branding Section */}
      <div className="p-8 flex flex-col items-center border-b border-slate-50">
        <div className="relative group mb-4">
          {/* Stylized "N" / Infinity Logo using CSS to match uploaded asset */}
          <div className="w-16 h-12 relative flex items-center justify-center">
             {/* Left Loop */}
             <div className="absolute left-0 w-8 h-8 rounded-full border-4 border-transparent border-t-cyan-400 border-l-cyan-400 -rotate-45"></div>
             {/* Right Loop */}
             <div className="absolute right-0 w-8 h-8 rounded-full border-4 border-transparent border-b-purple-500 border-r-purple-500 -rotate-45"></div>
             {/* Intersection / N-path overlay */}
             <div className="absolute w-12 h-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full rotate-[-35deg] opacity-80 blur-[1px]"></div>
             {/* Orange Accent - Top */}
             <div className="absolute top-0 right-2 w-4 h-4 bg-orange-400 rounded-full blur-[2px] opacity-90 animate-pulse"></div>
             {/* Orange Accent - Bottom */}
             <div className="absolute bottom-0 left-2 w-4 h-4 bg-orange-400 rounded-full blur-[2px] opacity-90 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        <h1 className="text-2xl font-black text-blue-600 tracking-tighter uppercase">Nexis</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] -mt-1">Health AI</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Session Active</p>
          <p className="text-sm font-bold text-slate-700">Alex Thompson</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">System Secure</span>
          </div>
          <button className="text-xs text-blue-600 mt-3 hover:underline font-bold">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
