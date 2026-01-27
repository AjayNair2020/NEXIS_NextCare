
import React, { useState } from 'react';
import { User, Role } from '../types';
import { SUPER_ADMIN_EMAIL } from '../constants';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

const GoogleLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
  </svg>
);

const AppleLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05 1.78-3.4 1.78-1.32 0-1.78-.85-3.48-.85s-2.18.82-3.48.82c-1.32 0-2.52-.92-3.55-2.42-2.12-3.05-1.62-7.52.42-10.42 1.02-1.45 2.52-2.35 4.12-2.35 1.25 0 2.42.88 3.2 1.05 1 .2 2.38-1.02 3.82-1.02 1.6 0 2.92.85 3.7 2 .1.12-1.52.88-1.52 2.65 0 2.12 1.72 2.88 1.72 2.88a7.02 7.02 0 0 1-.95 2.72c-.52.75-1.08 1.5-2.1 2.5zM12.02 5.5c-.1.01-1.32.18-2.22-1.12-1-1.45-.18-2.88-.12-2.98.15-.15 1.45-.1 2.38 1.15.82 1.12.05 2.85-.04 2.95z" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#7fba00" d="M12 1h10v10H12z" />
    <path fill="#00a1f1" d="M1 12h10v10H1z" />
    <path fill="#ffb900" d="M12 12h10v10H12z" />
  </svg>
);

const StripeLogo = () => (
  <svg className="w-12 h-5" viewBox="0 0 40 16" fill="#635bff"><path d="M40 8.6c0-2.8-1.3-4.5-3.6-4.5-2.1 0-3.5 1.4-3.5 3.7 0 3.2 2 4.4 4.3 4.4 1 0 2-.2 2.7-.6v-2.1c-.7.3-1.4.4-2.1.4-1.3 0-2.3-.5-2.4-1.8h7c0-.1.1-.3.1-.5zm-4.6-2.1c0-1 .6-1.5 1.1-1.5s1.1.5 1.1 1.5h-2.2zm-9.3-2.2c-1.1 0-1.8.5-2.1.9l-.1-.7h-2.3v10.9h2.5v-7c.4-.7 1.2-1 1.9-1 .1 0 .3 0 .4.1V4.3h-.3zm-6 3.5c0-2-1.3-3.7-3.5-3.7-1.1 0-1.9.5-2.2 1l-.1-.7h-2.3V14h2.5V11.2c.4.6 1.1 1.1 2.3 1.1 2.1 0 3.3-1.6 3.3-3.6zm-2.5.1c0 1.2-.7 1.9-1.5 1.9s-1.4-.7-1.4-1.9c0-1.3.6-2 1.4-2s1.5.7 1.5 2zM11.3 5.4c-.6-.7-1.4-1.1-2.4-1.1-2.1 0-3.4 1.7-3.4 3.7 0 2.2 1.4 3.7 3.5 3.7 1 0 1.7-.3 2.3-.9v3h2.5V4.3h-2.5v1.1zm-2.3 4c-1 0-1.4-.8-1.4-1.7s.5-1.7 1.4-1.7 1.4.8 1.4 1.7-.5 1.7-1.4 1.7zM4.1 3.5V1.2C3.3 1.3 2.5 1.8 2.5 3.3V4h-1.3v2h1.3v4.6c0 1.5.8 2.3 2.2 2.3.5 0 1-.1 1.4-.2v-2c-.3 0-.5.1-.7.1-.5 0-.7-.2-.7-.7V6h1.4V4h-1.4c-.1-.2-.1-.4-.1-.5z" /></svg>
);

const PaypalLogo = () => (
  <svg className="w-12 h-6" viewBox="0 0 24 24" fill="#003087"><path d="M20.067 6.378c.496 2.487.132 4.41-1.135 5.892-1.215 1.423-2.937 2.124-5.12 2.115l-.43-.002-.562.001-.84 5.31-.05.31-.01.07h-3.435l.01-.06.84-5.32c.045-.285.29-.49.578-.49H11.5c3.27 0 5.462-1.536 6.136-4.636.216-.99.19-1.834-.075-2.534-.23-.61-.61-.95-1.15-1.16-.27-.11-.64-.2-1.03-.24l.03-.18h3.84c.32 0 .58.21.64.52l.22 1.11z" /><path fill="#009cde" d="M11.5 13.684l-.578 3.655h.442l.578-3.655H11.5z" /></svg>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'staff' | 'patient'>('patient');
  const [registrationStep, setRegistrationStep] = useState<'login' | 'details' | 'tiers' | 'payment'>('login');
  const [fullName, setFullName] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let role: Role = 'PATIENT';
    let name = fullName || 'Guest User';
    
    if (email === SUPER_ADMIN_EMAIL) {
      role = 'SUPER_ADMIN';
      name = 'Admin Ajay';
    } else if (email.includes('clinical')) {
      role = 'CLINICAL_LEAD';
      name = 'Dr. Sarah Jenkins';
    } else if (email.includes('logistics')) {
      role = 'LOGISTICS_CHIEF';
      name = 'Chief Marcus Wright';
    }

    onLogin({
      id: Date.now().toString(),
      email: email || `${role.toLowerCase()}@nextcare.internal`,
      fullName: name,
      role
    });
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple' | 'Microsoft') => {
    const simulatedEmail = email || (provider === 'Google' ? 'oauth.user@gmail.com' : provider === 'Apple' ? 'oauth.user@icloud.com' : 'oauth.user@outlook.com');
    
    let role: Role = 'PATIENT';
    let name = provider + ' User';

    if (simulatedEmail === SUPER_ADMIN_EMAIL) {
      role = 'SUPER_ADMIN';
      name = 'Admin Ajay';
    }

    onLogin({
      id: `social-${Date.now()}`,
      email: simulatedEmail,
      fullName: name,
      role,
      avatar: `https://i.pravatar.cc/150?u=${provider}`
    });
  };

  const tiers = [
    { id: 'foundation', name: 'Foundation', price: '$2,499', features: ['Core Dashboard', 'Assistant'] },
    { id: 'regional', name: 'Regional', price: '$8,999', features: ['All Foundation', 'Fleet Tracking'] },
    { id: 'enterprise', name: 'Enterprise', price: '$24,500', features: ['All Regional', 'SCM Access'] },
  ];

  const renderContent = () => {
    if (registrationStep === 'details') {
      return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          <input 
            type="text" 
            placeholder="Legal Identity Name" 
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]/50 transition-all outline-none"
          />
          <input 
            type="email" 
            placeholder="ID Vector / Email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]/50 transition-all outline-none"
          />
          <button 
            onClick={() => setRegistrationStep('tiers')}
            className="w-full py-5 font-black uppercase tracking-[0.3em] rounded-2xl bg-[#FF9933] text-white hover:bg-[#E68A2E] shadow-xl transition-all"
          >
            Select Plan
          </button>
          <button onClick={() => setRegistrationStep('login')} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors">Back to Sync</button>
        </div>
      );
    }

    if (registrationStep === 'tiers') {
      return (
        <div className="space-y-4 animate-in slide-in-from-right duration-500">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Enterprise Tiers</h4>
          {tiers.map(tier => (
            <button 
              key={tier.id}
              onClick={() => { setSelectedTier(tier.id); setRegistrationStep('payment'); }}
              className="w-full p-6 bg-white border border-slate-100 rounded-3xl text-left hover:border-[#FF9933] hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black uppercase italic text-slate-900">{tier.name}</span>
                <span className="text-sm font-black text-[#FF9933]">{tier.price}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{tier.features.join(' • ')}</p>
            </button>
          ))}
          <button onClick={() => setRegistrationStep('details')} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors mt-4">Edit Details</button>
        </div>
      );
    }

    if (registrationStep === 'payment') {
      return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Protocol Selected: {selectedTier?.toUpperCase()}</p>
          </div>
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Secure Payment Gateway</h4>
          
          <div className="grid grid-cols-2 gap-4">
             {[
               { id: 'stripe', icon: <StripeLogo />, label: 'Stripe' },
               { id: 'paypal', icon: <PaypalLogo />, label: 'PayPal' },
               { id: 'apple', icon: <div className="flex items-center gap-1"><AppleLogo /><span className="font-bold text-[10px] text-slate-900">Pay</span></div>, label: 'Apple Pay' },
               { id: 'google', icon: <div className="flex items-center gap-1"><GoogleLogo /><span className="font-bold text-[10px] text-slate-900">Pay</span></div>, label: 'Google Pay' },
             ].map(gate => (
               <button 
                key={gate.id}
                onClick={() => handleLogin()}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:border-[#FF9933] hover:shadow-xl transition-all group"
               >
                 <div className="mb-2 group-hover:scale-110 transition-transform">
                   {gate.icon}
                 </div>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#FF9933] transition-colors">{gate.label}</span>
               </button>
             ))}
          </div>

          <button onClick={() => setRegistrationStep('tiers')} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-colors mt-4 text-center">Change Tier</button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {loginMode === 'staff' ? (
          <button 
            onClick={() => handleSocialAuth('Microsoft')}
            className="w-full py-5 bg-[#F8FAFC] border border-slate-200 text-slate-900 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-4 group"
          >
            <MicrosoftLogo />
            AD SSO Pipeline
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { id: 'Google', component: <GoogleLogo /> },
              { id: 'Apple', component: <div className="text-slate-900"><AppleLogo /></div> },
              { id: 'Microsoft', component: <MicrosoftLogo /> }
            ].map((soc) => (
              <button 
                key={soc.id}
                onClick={() => handleSocialAuth(soc.id as any)}
                className="flex flex-col items-center justify-center p-5 bg-[#F8FAFC] border border-slate-200 rounded-[2rem] hover:bg-white hover:border-[#FF9933] hover:shadow-lg transition-all group"
              >
                <div className="group-hover:scale-110 transition-transform mb-2">
                  {soc.component}
                </div>
                <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-[#FF9933] transition-colors">{soc.id}</span>
              </button>
            ))}
          </div>
        )}

        <div className="relative py-4 flex items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            {loginMode === 'staff' ? 'Admin Gateway' : 'Identity Sync'}
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="ID Vector / Email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]/50 transition-all outline-none"
          />
          <input 
            type="password" 
            placeholder="Security Token" 
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]/50 transition-all outline-none"
          />
          <button type="submit" className={`w-full py-5 font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl group relative overflow-hidden ${loginMode === 'staff' ? 'bg-[#FF9933] text-white hover:bg-[#E68A2E]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
            <span className="relative z-10">Initiate Neural Sync</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-slate-900 flex flex-col overflow-x-hidden relative font-['Inter']">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2080" 
          alt="Healthcare background" 
          className="w-full h-full object-cover opacity-10 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-white/40 to-[#FF9933]/5"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF9933] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#FF9933]/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">NextCare</h1>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          <a href="#" className="hover:text-[#FF9933] transition-colors">Intelligence Hub</a>
          <a href="#" className="hover:text-[#FF9933] transition-colors">Biometric Security</a>
          <a href="#" className="hover:text-[#FF9933] transition-colors">Global Network</a>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-24 max-w-7xl mx-auto text-center">
        <div className="inline-block px-5 py-2 rounded-full bg-white border border-[#FF9933]/20 text-[#FF9933] text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-sm backdrop-blur-md">
          Synchronizing Health Vectors v2.4
        </div>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 text-slate-900">
          THE FUTURE OF <br />
          <span className="text-[#FF9933] italic">PERSONALIZED</span> CARE.
        </h2>
        
        {/* Auth Toggle */}
        <div className="flex bg-white/60 p-1.5 rounded-2xl border border-[#FF9933]/10 backdrop-blur-2xl mb-12 shadow-xl">
          <button 
            onClick={() => { setLoginMode('patient'); setRegistrationStep('login'); }}
            className={`px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${loginMode === 'patient' && registrationStep === 'login' ? 'bg-white text-slate-900 shadow-md border border-[#FF9933]/10' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Patient Portal
          </button>
          <button 
            onClick={() => { setLoginMode('staff'); setRegistrationStep('login'); }}
            className={`px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${loginMode === 'staff' ? 'bg-[#FF9933] text-white shadow-[0_10px_25px_rgba(255,153,51,0.3)]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Clinical Command
          </button>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual Column Left */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
            <div className="group relative flex-1 rounded-[3rem] overflow-hidden border border-[#FF9933]/10 shadow-xl transition-all hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000" 
                alt="AI Diagnostics" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F0]/90 via-[#FFF8F0]/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-left">
                <p className="text-[#FF9933] text-[10px] font-black uppercase tracking-widest mb-2">NextGen Diagnostics</p>
                <h4 className="text-xl font-bold text-slate-900 leading-tight">AI-Powered <br />Symptom Mapping</h4>
              </div>
            </div>
            <div className="h-48 rounded-[2.5rem] bg-[#FF9933] p-8 text-left relative overflow-hidden group shadow-xl transition-all hover:scale-[1.02]">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-2">Regional Connectivity</p>
               <h4 className="text-xl font-black text-white italic leading-tight">98.4% Network <br />Uptime Active</h4>
            </div>
          </div>

          {/* Center Form Column */}
          <div className={`lg:col-span-4 p-10 rounded-[3.5rem] border transition-all duration-700 text-left backdrop-blur-3xl shadow-2xl ${loginMode === 'staff' ? 'bg-white/95 border-[#FF9933]/30' : 'bg-white/90 border-[#FF9933]/20'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black uppercase tracking-widest italic text-slate-900">
                {registrationStep === 'payment' ? 'Authorize Sync' : registrationStep === 'tiers' ? 'Configure Tier' : registrationStep === 'details' ? 'Enroll' : loginMode === 'staff' ? 'IAM Gateway' : 'Sync Bio-ID'}
              </h3>
              {loginMode === 'patient' && registrationStep === 'login' && (
                <button 
                  onClick={() => setRegistrationStep('details')}
                  className="text-[10px] font-black uppercase text-[#FF9933] hover:underline underline-offset-4"
                >
                  New Identity?
                </button>
              )}
            </div>
            <p className="text-xs mb-10 font-medium text-slate-500 leading-relaxed">
              {registrationStep === 'payment' ? 'Complete transaction to activate biometric profile' : registrationStep === 'tiers' ? 'Select your healthcare access level' : registrationStep === 'details' ? 'Create your global healthcare biometric profile' : loginMode === 'staff' ? 'Enterprise Secure Access for Clinical Personnel' : 'Access your longitudinal health history instantly'}
            </p>

            {renderContent()}
          </div>

          {/* Visual Column Right */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
            <div className="group relative h-64 rounded-[3rem] overflow-hidden border border-[#FF9933]/10 shadow-xl transition-all hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1000" 
                alt="Medical Tech" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-white/20"></div>
              <div className="absolute top-8 right-8 text-right">
                <div className="w-12 h-12 bg-[#FF9933]/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-[#FF9933] mb-4 ml-auto border border-[#FF9933]/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
                </div>
                <p className="text-slate-900 text-xs font-bold uppercase tracking-widest">NIST Compliant</p>
              </div>
            </div>

            <div className="flex-1 group relative rounded-[3rem] overflow-hidden border border-[#FF9933]/10 shadow-xl transition-all hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1586773860418-d374a55ae417?auto=format&fit=crop&q=80&w=1000" 
                alt="Health Monitoring" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFF8F0]/90"></div>
              <div className="absolute bottom-10 left-10 text-left">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 italic">BIO-IDENTITY <br />VERIFIED</h4>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Real-time Integrity Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
           <div className="flex items-center gap-3"><span className="text-[#FF9933]">0.2ms</span> LATENCY</div>
           <div className="flex items-center gap-3"><span className="text-[#FF9933]">AES-256</span> ENCRYPTION</div>
           <div className="flex items-center gap-3"><span className="text-[#FF9933]">HIPAA</span> CERTIFIED</div>
        </div>
      </main>

      <footer className="relative z-10 py-12 border-t border-slate-200 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
          © 2024 NEXTCARE INTELLIGENCE SYSTEMS • GLOBAL CORE CLUSTER 01
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
