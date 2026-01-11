
import React, { useState } from 'react';
import { User, Role } from '../types';
import { SUPER_ADMIN_EMAIL } from '../constants';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default mock behavior
    let role: Role = 'PATIENT';
    let name = 'Alex Thompson';
    
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

    onLogin({
      id: Date.now().toString(),
      email,
      fullName: name,
      role
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f9f1] text-slate-900 flex flex-col overflow-x-hidden relative">
      {/* Background Animated Pulse - Leafy variant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[1000px] opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-200/50 via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-emerald-900">NextCare</h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-emerald-800/60">
          <a href="#" className="hover:text-emerald-600 transition-colors">Platform</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Intelligence</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">Logistics</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-bounce">
          NEXIS 2.0 BIOMETRIC SYNC ACTIVE
        </div>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-emerald-950">
          HEALTHCARE <br /> 
          <span className="text-emerald-500 italic">INTELLIGENCE</span> <br />
          REIMAGINED.
        </h2>
        <p className="text-emerald-900/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-medium">
          A persistent, unified AI network for bio-telemetry, diagnostic animation, and regional care logistics. Empowering clinicians and patients through spatial awareness.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
          <form onSubmit={handleLogin} className="w-full space-y-4 bg-white/60 p-8 rounded-[2.5rem] border border-emerald-100 backdrop-blur-xl shadow-xl shadow-emerald-900/5">
            <div className="text-left">
               <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-900">Mission Entrance</h3>
               <div className="space-y-4">
                 <input 
                  type="email" 
                  placeholder="Clinical ID / Email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border-emerald-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-emerald-900/30"
                 />
                 <input 
                  type="password" 
                  placeholder="Security Key" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white border-emerald-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-emerald-900/30"
                 />
               </div>
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">
              Sync credentials
            </button>
            <p className="text-[10px] text-emerald-800/40 font-bold uppercase tracking-widest mt-4">
              Tip: Use "{SUPER_ADMIN_EMAIL}" to enter as Super Admin
            </p>
          </form>
        </div>
      </main>

      {/* KPI Section */}
      <section className="relative z-10 bg-white/40 border-y border-emerald-100 py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'Network Latency', val: '42ms', desc: 'Global sync speed' },
            { label: 'Care Efficiency', val: '+22%', desc: 'AI-assisted routing' },
            { label: 'Diagnostic Acc.', val: '99.4%', desc: 'NEXIS 2.0 Engine' },
            { label: 'Active Nodes', val: '1.2k', desc: 'Regional coverage' }
          ].map((kpi, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black text-emerald-600 mb-1">{kpi.val}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/60">{kpi.label}</p>
              <p className="text-[9px] text-emerald-800/40 font-bold uppercase mt-1">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="relative z-10 py-32 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Visual Anatomy', 
              desc: 'High-fidelity 3D clinical animations and diagrams generated in real-time by Gemini & Veo engines.', 
              icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            },
            { 
              title: 'Spatial Logistics', 
              desc: 'Intelligent fleet management and regional health mapping to ensure resources reach the point of care.', 
              icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7'
            },
            { 
              title: 'RACI Security', 
              desc: 'Granular role-based access control ensuring absolute system integrity and data privacy.', 
              icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944'
            }
          ].map((f, i) => (
            <div key={i} className="bg-white/40 p-10 rounded-[3rem] border border-emerald-100 hover:border-emerald-500/50 transition-all group shadow-sm">
               <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
               </div>
               <h4 className="text-xl font-bold mb-4 text-emerald-900">{f.title}</h4>
               <p className="text-emerald-900/50 leading-relaxed text-sm font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-12 border-t border-emerald-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/40">
          © 2024 NextCare AI Platform • End-to-End Encryption AES-256
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
