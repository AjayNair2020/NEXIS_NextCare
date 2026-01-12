
import React, { useState } from 'react';
import { User, Role } from '../types';
import { SUPER_ADMIN_EMAIL } from '../constants';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'staff' | 'patient'>('patient');

  const handleLogin = (e?: React.FormEvent, type?: 'sso' | 'social') => {
    if (e) e.preventDefault();
    
    let role: Role = 'PATIENT';
    let name = 'Guest User';
    
    if (type === 'sso') {
      role = 'CLINICAL_LEAD';
      name = 'Dr. Sarah Jenkins';
    } else if (type === 'social') {
      role = 'PATIENT';
      name = 'Alex Thompson';
    } else {
      // Manual fallback
      if (email === SUPER_ADMIN_EMAIL) {
        role = 'SUPER_ADMIN';
        name = 'Super Admin Ajay';
      } else if (email.includes('clinical')) {
        role = 'CLINICAL_LEAD';
        name = 'Dr. Sarah Jenkins';
      } else if (email.includes('logistics')) {
        role = 'LOGISTICS_CHIEF';
        name = 'Chief Marcus Wright';
      }
    }

    onLogin({
      id: Date.now().toString(),
      email: email || `${role.toLowerCase()}@nextcare.internal`,
      fullName: name,
      role
    });
  };

  return (
    <div className="min-h-screen bg-[#fffcf5] text-slate-900 flex flex-col overflow-x-hidden relative">
      {/* Background Animated Pulse */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[1000px] opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/50 via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-amber-950">NextCare</h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-amber-800/60">
          <a href="#" className="hover:text-amber-600 transition-colors">Platform</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Intelligence</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Security</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-24 max-w-6xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          NEXIS 2.0 BIOMETRIC SYNC ACTIVE
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6 text-amber-950">
          SECURE <span className="text-amber-500 italic">IDENTITY</span> <br />
          HEALTHCARE ACCESS.
        </h2>
        
        {/* Authentication Switcher */}
        <div className="flex bg-white/40 p-1 rounded-2xl border border-amber-100 backdrop-blur-md mb-8">
          <button 
            onClick={() => setLoginMode('patient')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMode === 'patient' ? 'bg-white text-amber-600 shadow-xl' : 'text-amber-800/40 hover:text-amber-600'}`}
          >
            Patient Access
          </button>
          <button 
            onClick={() => setLoginMode('staff')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginMode === 'staff' ? 'bg-slate-900 text-white shadow-xl' : 'text-amber-800/40 hover:text-amber-600'}`}
          >
            Clinical Command
          </button>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Main Auth Panel */}
          <div className={`p-10 rounded-[3rem] border transition-all duration-500 text-left ${loginMode === 'staff' ? 'bg-slate-900 border-slate-800 text-white shadow-2xl' : 'bg-white/70 border-amber-100 text-amber-950 shadow-xl backdrop-blur-xl'}`}>
            <h3 className="text-xl font-black uppercase tracking-widest mb-2 italic">
              {loginMode === 'staff' ? 'Staff Portal' : 'Patient Login'}
            </h3>
            <p className={`text-sm mb-8 font-medium ${loginMode === 'staff' ? 'text-slate-400' : 'text-amber-800/60'}`}>
              {loginMode === 'staff' ? 'Integrated Clinical IAM / OAuth Gateway' : 'Access your health records and AI diagnostics'}
            </p>

            <div className="space-y-4">
              {loginMode === 'staff' ? (
                <button 
                  onClick={() => handleLogin(undefined, 'sso')}
                  className="w-full py-5 bg-amber-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Sync Corporate SSO
                </button>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { name: 'Google', icon: 'M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.136-1.248 1.248-3.224 2.632-6.912 2.632-6.112 0-10.832-4.944-10.832-11.056s4.72-11.056 10.832-11.056c3.44 0 5.856 1.36 7.664 3.072l2.312-2.312C20.152 1.632 17.176 0 12.48 0 5.48 0 0 5.48 0 12.48s5.48 12.48 12.48 12.48c3.704 0 6.632-1.216 8.984-3.608 2.392-2.392 3.136-5.736 3.136-8.384 0-.848-.064-1.648-.192-2.432H12.48z' },
                    { name: 'Apple', icon: 'M12.152 6.896c-.548 0-1.411-.516-1.411-1.354 0-.775.663-1.354 1.411-1.354.748 0 1.391.579 1.391 1.354 0 .838-.843 1.354-1.391 1.354zm.051 7.39c-1.738 0-3.144-1.406-3.144-3.144 0-1.738 1.406-3.144 3.144-3.144 1.737 0 3.144 1.406 3.144 3.144 0 1.738-1.407 3.144-3.144 3.144z' },
                    { name: 'Microsoft', icon: 'M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z' }
                  ].map((soc) => (
                    <button 
                      key={soc.name}
                      onClick={() => handleLogin(undefined, 'social')}
                      className="flex flex-col items-center justify-center p-4 bg-white border border-amber-100 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all group"
                    >
                      <svg className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d={soc.icon} />
                      </svg>
                      <span className="text-[9px] font-black uppercase text-amber-800/40">{soc.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative py-4 flex items-center">
                <div className={`flex-grow border-t ${loginMode === 'staff' ? 'border-slate-800' : 'border-amber-100'}`}></div>
                <span className={`flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest ${loginMode === 'staff' ? 'text-slate-600' : 'text-amber-800/30'}`}>Or Traditional Sync</span>
                <div className={`flex-grow border-t ${loginMode === 'staff' ? 'border-slate-800' : 'border-amber-100'}`}></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="email" 
                  placeholder="ID / Registered Email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 transition-all ${loginMode === 'staff' ? 'bg-slate-800 text-white placeholder:text-slate-600 focus:ring-amber-500/20' : 'bg-white border-amber-100 text-amber-950 placeholder:text-amber-900/20 focus:ring-amber-500/20'}`}
                />
                <input 
                  type="password" 
                  placeholder="Security Token" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 transition-all ${loginMode === 'staff' ? 'bg-slate-800 text-white placeholder:text-slate-600 focus:ring-amber-500/20' : 'bg-white border-amber-100 text-amber-950 placeholder:text-amber-900/20 focus:ring-amber-500/20'}`}
                />
                <button type="submit" className={`w-full py-4 font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl ${loginMode === 'staff' ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-500/20'}`}>
                  Initiate Sync
                </button>
              </form>
            </div>
          </div>

          {/* Context Panel */}
          <div className="hidden md:flex flex-col gap-6">
            <div className={`p-8 rounded-[2.5rem] border bg-white/40 border-amber-100 text-left transition-all ${loginMode === 'staff' ? 'opacity-40 grayscale' : 'opacity-100 scale-105 shadow-xl shadow-amber-900/5'}`}>
               <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <h4 className="text-xl font-bold mb-2">Patient Records</h4>
               <p className="text-sm text-amber-900/60 leading-relaxed">Patients use Social Profiles (Google/Apple) to link their health history to the NEXIS Intelligence network instantly.</p>
            </div>

            <div className={`p-8 rounded-[2.5rem] border text-left transition-all ${loginMode === 'patient' ? 'opacity-40 grayscale' : 'opacity-100 scale-105 bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-900/40'}`}>
               <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10" /></svg>
               </div>
               <h4 className="text-xl font-bold mb-2">IAM/SSO Pipeline</h4>
               <p className="text-sm text-slate-400 leading-relaxed">Enterprise staff authentication via SAML/OAuth 2.0. Roles and Dynamic RACI permissions are synced via IAM directory groups.</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-amber-800/40 font-bold uppercase tracking-widest mt-12 animate-pulse">
           Super Admin entry: "{SUPER_ADMIN_EMAIL}"
        </p>
      </main>

      <footer className="relative z-10 py-12 border-t border-amber-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/40">
          © 2024 NextCare AI Platform • NIST Compliant • End-to-End Encryption AES-256
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
