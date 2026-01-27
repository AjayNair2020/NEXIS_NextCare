
import React, { useState } from 'react';

const StripeLogo = () => (
  <svg className="w-12 h-5" viewBox="0 0 40 16" fill="#635bff"><path d="M40 8.6c0-2.8-1.3-4.5-3.6-4.5-2.1 0-3.5 1.4-3.5 3.7 0 3.2 2 4.4 4.3 4.4 1 0 2-.2 2.7-.6v-2.1c-.7.3-1.4.4-2.1.4-1.3 0-2.3-.5-2.4-1.8h7c0-.1.1-.3.1-.5zm-4.6-2.1c0-1 .6-1.5 1.1-1.5s1.1.5 1.1 1.5h-2.2zm-9.3-2.2c-1.1 0-1.8.5-2.1.9l-.1-.7h-2.3v10.9h2.5v-7c.4-.7 1.2-1 1.9-1 .1 0 .3 0 .4.1V4.3h-.3zm-6 3.5c0-2-1.3-3.7-3.5-3.7-1.1 0-1.9.5-2.2 1l-.1-.7h-2.3V14h2.5V11.2c.4.6 1.1 1.1 2.3 1.1 2.1 0 3.3-1.6 3.3-3.6zm-2.5.1c0 1.2-.7 1.9-1.5 1.9s-1.4-.7-1.4-1.9c0-1.3.6-2 1.4-2s1.5.7 1.5 2zM11.3 5.4c-.6-.7-1.4-1.1-2.4-1.1-2.1 0-3.4 1.7-3.4 3.7 0 2.2 1.4 3.7 3.5 3.7 1 0 1.7-.3 2.3-.9v3h2.5V4.3h-2.5v1.1zm-2.3 4c-1 0-1.4-.8-1.4-1.7s.5-1.7 1.4-1.7 1.4.8 1.4 1.7-.5 1.7-1.4 1.7zM4.1 3.5V1.2C3.3 1.3 2.5 1.8 2.5 3.3V4h-1.3v2h1.3v4.6c0 1.5.8 2.3 2.2 2.3.5 0 1-.1 1.4-.2v-2c-.3 0-.5.1-.7.1-.5 0-.7-.2-.7-.7V6h1.4V4h-1.4c-.1-.2-.1-.4-.1-.5z" /></svg>
);

const PaypalLogo = () => (
  <svg className="w-12 h-6" viewBox="0 0 24 24" fill="#003087"><path d="M20.067 6.378c.496 2.487.132 4.41-1.135 5.892-1.215 1.423-2.937 2.124-5.12 2.115l-.43-.002-.562.001-.84 5.31-.05.31-.01.07h-3.435l.01-.06.84-5.32c.045-.285.29-.49.578-.49H11.5c3.27 0 5.462-1.536 6.136-4.636.216-.99.19-1.834-.075-2.534-.23-.61-.61-.95-1.15-1.16-.27-.11-.64-.2-1.03-.24l.03-.18h3.84c.32 0 .58.21.64.52l.22 1.11z" /><path fill="#009cde" d="M11.5 13.684l-.578 3.655h.442l.578-3.655H11.5z" /></svg>
);

const GooglePayLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
    </svg>
    <span className="font-bold text-xs text-slate-900">Pay</span>
  </div>
);

const ApplePayLogo = () => (
  <div className="flex items-center gap-1">
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05 1.78-3.4 1.78-1.32 0-1.78-.85-3.48-.85s-2.18.82-3.48.82c-1.32 0-2.52-.92-3.55-2.42-2.12-3.05-1.62-7.52.42-10.42 1.02-1.45 2.52-2.35 4.12-2.35 1.25 0 2.42.88 3.2 1.05 1 .2 2.38-1.02 3.82-1.02 1.6 0 2.92.85 3.7 2 .1.12-1.52.88-1.52 2.65 0 2.12 1.72 2.88 1.72 2.88a7.02 7.02 0 0 1-.95 2.72c-.52.75-1.08 1.5-2.1 2.5zM12.02 5.5c-.1.01-1.32.18-2.22-1.12-1-1.45-.18-2.88-.12-2.98.15-.15 1.45-.1 2.38 1.15.82 1.12.05 2.85-.04 2.95z" />
    </svg>
    <span className="font-bold text-xs text-slate-900">Pay</span>
  </div>
);

const PriceModelManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'status'>('explorer');
  const [enrollmentTarget, setEnrollmentTarget] = useState<any>(null);
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');

  const tiers = [
    {
      id: 'foundation',
      name: 'Foundation',
      level: 'Bronze Tier',
      price: '$2,499',
      unit: 'per node / month',
      description: 'Ideal for local clinics and small medical SME networks.',
      features: [
        'Core Patient Dashboard',
        'Profile Management',
        'Standard Appointments',
        'AI Assistant (Standard)',
        'Basic Health Mapping'
      ],
      raciAccess: ['Dashboard', 'Profile', 'Appointments', 'Assistant', 'Preventive Health'],
      color: 'amber'
    },
    {
      id: 'regional',
      name: 'Regional',
      level: 'Silver Tier',
      price: '$8,999',
      unit: 'per hub / month',
      description: 'Integrated intelligence for regional hospitals and dispatch centers.',
      features: [
        'Everything in Foundation',
        'Operational Management',
        'Full System Map Overlay',
        'Medical Knowledge Hub',
        'Real-time Fleet Tracking'
      ],
      raciAccess: ['Operations', 'Map', 'Taxonomy', 'Planning'],
      highlight: true,
      color: 'emerald'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      level: 'Gold Tier',
      price: '$24,500',
      unit: 'per cluster / month',
      description: 'Advanced simulation and supply chain power for national health networks.',
      features: [
        'Everything in Regional',
        'AI Strategy Optimizer',
        'Pharma Industry MES/ERP',
        'Full Healthcare Supply Chain',
        'Strategic Regional Planning'
      ],
      raciAccess: ['Strategy', 'Supply Chain', 'Pharma Industry'],
      color: 'blue'
    },
    {
      id: 'global',
      name: 'Global partner',
      level: 'Diamond Tier',
      price: 'Custom',
      unit: 'Institutional Quote',
      description: 'Full autonomy for core platform stakeholders and global regulators.',
      features: [
        'Full Platform Sovereignty',
        'RBAC Console Admin',
        'System Integrity Logs',
        'Custom AI Synth Models',
        'Direct NEXIS Core API'
      ],
      raciAccess: ['RBAC Console', 'Integrity Logs', 'API Access'],
      color: 'slate'
    }
  ];

  const handleInitializeEnrollment = (tier: any) => {
    setEnrollmentTarget(tier);
    setStep('selection');
  };

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase italic">Enterprise Intelligence Model</h2>
          <p className="text-slate-500 font-medium">Configure tiered biometric access and regional synchronization protocols.</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-xl overflow-x-auto">
          {[
            { id: 'explorer', label: 'Tier Explorer', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10' },
            { id: 'status', label: 'Initialize Enrollment', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-amber-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'explorer' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4">
            {tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`relative flex flex-col p-8 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 group overflow-hidden ${
                  tier.highlight 
                    ? 'bg-slate-900 text-white border-slate-800 shadow-2xl scale-105' 
                    : 'bg-white text-slate-800 border-slate-100 shadow-xl'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute top-6 right-6 px-4 py-1 bg-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full text-white shadow-lg">
                    Most Deployed
                  </div>
                )}

                <div className="mb-8">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${tier.highlight ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {tier.level}
                  </p>
                  <h3 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter">{tier.price}</span>
                    <span className={`text-[10px] font-bold uppercase ${tier.highlight ? 'text-slate-400' : 'text-slate-400'}`}>{tier.unit}</span>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed mb-8 font-medium ${tier.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tier.description}
                </p>

                <div className="space-y-8 flex-1">
                  <div>
                    <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 border-b pb-2 ${tier.highlight ? 'border-slate-800 text-slate-400' : 'border-slate-50 text-slate-400'}`}>Functional Scope</h4>
                    <ul className="space-y-3">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3">
                           <svg className={`w-4 h-4 shrink-0 ${tier.highlight ? 'text-emerald-400' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                           <span className="text-xs font-bold leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 border-b pb-2 ${tier.highlight ? 'border-slate-800 text-slate-400' : 'border-slate-50 text-slate-400'}`}>RACI Access Map</h4>
                    <div className="flex flex-wrap gap-2">
                       {tier.raciAccess.map((access, aIdx) => (
                         <span key={aIdx} className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                           tier.highlight ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'
                         }`}>
                           {access}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleInitializeEnrollment(tier)}
                  className={`mt-10 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${
                  tier.highlight 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}>
                  Initialize Enrollment
                </button>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-5xl rounded-[3rem] p-12 border transition-all duration-500 overflow-hidden relative group bg-[#FFF8F0] border-amber-100">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
             <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-amber-500/30 shrink-0">
                   <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-2xl font-black tracking-tight text-slate-800 mb-4">Enterprise Governance & Compliance</h3>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Each price tier is governed by a synchronous RBAC synchronization protocol. Access revokes propagate across the global cluster with sub-millisecond latency, ensuring enterprise data integrity and HIPAA/GDPR regulatory adherence at every scale.
                   </p>
                </div>
                <button className="px-8 py-4 bg-white border border-amber-200 text-amber-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-50 transition-all shadow-lg whitespace-nowrap">
                   Download Governance PDF
                </button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="px-4 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                 <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                    <div className="flex justify-between items-start mb-10">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Active Enrollment</p>
                             <h3 className="text-3xl font-black tracking-tighter uppercase italic">Regional <span className="text-slate-400">(Silver Tier)</span></h3>
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                Biometric Link: Synchronized
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Billing Cycle</p>
                          <p className="text-sm font-black text-slate-800">Monthly</p>
                          <p className="text-xs text-slate-400 font-bold mt-1">Next: Nov 24, 2024</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-50">
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group/item transition-all hover:bg-emerald-50 hover:border-emerald-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover/item:text-emerald-600">Active Nodes</p>
                          <p className="text-2xl font-black text-slate-800">12 Clusters</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group/item transition-all hover:bg-amber-50 hover:border-amber-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover/item:text-amber-600">Data Throughput</p>
                          <p className="text-2xl font-black text-slate-800">4.2 PB / Day</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-[#FFF8F0] rounded-[3rem] p-10 border border-amber-100 shadow-sm relative group overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                       <div className="flex-1">
                          <h4 className="text-xl font-black uppercase italic mb-2">Initialize Update</h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                             Ready to scale your regional capabilities? Initialize an update to modify cluster counts, adjust functional access, or upgrade to the Enterprise (Gold) tier.
                          </p>
                       </div>
                       <button 
                        onClick={() => handleInitializeEnrollment(tiers[2])}
                        className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3"
                       >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Initialize Protocol Update
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Access Integrity Health</h4>
                    <div className="space-y-8">
                       {[
                         { label: 'RBAC Latency', value: '0.2ms', status: 'Optimal' },
                         { label: 'Encryption Key Rotation', value: 'Active', status: 'Secure' },
                         { label: 'Audit Trail Connectivity', value: '100%', status: 'Nominal' },
                         { label: 'Biometric Vector Drift', value: '< 0.01%', status: 'Calibrated' }
                       ].map(item => (
                         <div key={item.label}>
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-xs font-bold text-slate-600">{item.label}</span>
                               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{item.status}</span>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 w-full"></div>
                               </div>
                               <span className="text-[10px] font-black text-slate-800">{item.value}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-8 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform"></div>
                    <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4 italic">NextCare Directive</h4>
                    <p className="text-xs leading-relaxed opacity-80 font-medium">
                       "Current regional throughput suggests a capacity bottleneck in SA-3. Initializing a node update to Gold Tier is advised for sustained operational integrity."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {enrollmentTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10 text-center">
              {step === 'selection' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 bg-[#FF9933]/10 text-[#FF9933] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">Enroll in {enrollmentTarget.name}</h3>
                  <p className="text-slate-500 text-sm mb-10 font-medium px-8">Confirm your enterprise subscription level to begin neural biometric synchronization.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                      onClick={handlePayment}
                      className="flex flex-col items-center justify-center p-6 bg-[#F8FAFC] border border-slate-100 rounded-[2.5rem] hover:border-[#FF9933] hover:shadow-lg transition-all group"
                    >
                      <StripeLogo />
                      <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-[#FF9933] mt-3">Stripe Gateway</span>
                    </button>
                    <button 
                      onClick={handlePayment}
                      className="flex flex-col items-center justify-center p-6 bg-[#F8FAFC] border border-slate-100 rounded-[2.5rem] hover:border-[#FF9933] hover:shadow-lg transition-all group"
                    >
                      <PaypalLogo />
                      <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-[#FF9933] mt-3">PayPal Sync</span>
                    </button>
                    <button 
                      onClick={handlePayment}
                      className="flex flex-col items-center justify-center p-6 bg-[#F8FAFC] border border-slate-100 rounded-[2.5rem] hover:border-[#FF9933] hover:shadow-lg transition-all group"
                    >
                      <ApplePayLogo />
                      <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-[#FF9933] mt-3">Apple Pay Secure</span>
                    </button>
                    <button 
                      onClick={handlePayment}
                      className="flex flex-col items-center justify-center p-6 bg-[#F8FAFC] border border-slate-100 rounded-[2.5rem] hover:border-[#FF9933] hover:shadow-lg transition-all group"
                    >
                      <GooglePayLogo />
                      <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-[#FF9933] mt-3">G-Pay Identity</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => setEnrollmentTarget(null)}
                    className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 tracking-[0.2em] transition-colors"
                  >
                    Cancel Enrollment
                  </button>
                </div>
              )}

              {step === 'processing' && (
                <div className="py-20 flex flex-col items-center animate-in fade-in duration-500">
                  <div className="relative mb-10">
                    <div className="w-24 h-24 bg-[#FF9933]/10 rounded-full flex items-center justify-center border-4 border-[#FF9933]/20">
                      <svg className="w-12 h-12 text-[#FF9933] animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping bg-[#FF9933]/10"></div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">Syncing Bio-Credentials</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest animate-pulse">Establishing Secure Payment Link...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="animate-in zoom-in duration-500 py-10">
                  <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-4">Enrollment Active</h3>
                  <p className="text-slate-500 text-sm font-medium mb-10 px-10">Your enterprise node has been successfully integrated into the NextCare global cluster.</p>
                  <button 
                    onClick={() => setEnrollmentTarget(null)}
                    className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all"
                  >
                    Enter Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceModelManager;
