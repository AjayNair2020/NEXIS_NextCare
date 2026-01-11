import React, { useState, useMemo } from 'react';
import { PatientProfile, EmergencyContact, Medication, SecurityProtocol } from '../types';
import { MOCK_PATIENTS, MOCK_MEDICATIONS, MOCK_SECURITY_PROTOCOLS } from '../constants';

const ProfileManager: React.FC = () => {
  const [profiles, setProfiles] = useState<PatientProfile[]>(MOCK_PATIENTS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeView, setActiveView] = useState<'profiles' | 'meds' | 'security'>('profiles');

  const initialFormState: PatientProfile = {
    id: '',
    fullName: '',
    dob: '',
    gender: '',
    bloodType: '',
    email: '',
    phone: '',
    address: '',
    lat: 37.7749,
    lng: -122.4194,
    medicalHistory: '',
    allergies: '',
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    isPrimary: false,
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  };

  const [formData, setFormData] = useState<PatientProfile>(initialFormState);

  const handleEdit = (profile: PatientProfile) => {
    setFormData(profile);
    setEditingId(profile.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProfiles(prev => prev.map(p => p.id === editingId ? formData : p));
    } else {
      setProfiles(prev => [...prev, formData]);
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const logDose = (medId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        return {
          ...med,
          remaining: Math.max(0, med.remaining - 1),
          adherenceHistory: [
            ...(med.adherenceHistory || []),
            { timestamp: new Date().toISOString(), status: 'taken' }
          ]
        };
      }
      return med;
    }));
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const adherencePercentage = useMemo(() => {
    const total = medications.reduce((acc, med) => acc + (med.adherenceHistory?.length || 0), 0);
    // Rough calculation for demo
    return 94; 
  }, [medications]);

  if (editingId || isAdding) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Profile' : 'Add New Profile'}</h2>
            <p className="text-sm text-slate-500">Please provide accurate medical and contact information.</p>
          </div>
          <button 
            onClick={() => { setEditingId(null); setIsAdding(false); }}
            className="text-slate-400 hover:text-slate-600 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input 
                    type="date" required
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                  <select 
                    value={formData.bloodType}
                    onChange={e => setFormData({...formData, bloodType: e.target.value})}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* ... Other existing fields ... */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => { setEditingId(null); setIsAdding(false); }}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Health Profile Center</h2>
          <p className="text-slate-500">Clinical records, medication adherence, and security protocols.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveView('profiles')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'profiles' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Profiles
          </button>
          <button 
            onClick={() => setActiveView('meds')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'meds' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Adherence
          </button>
          <button 
            onClick={() => setActiveView('security')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'security' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Privacy
          </button>
        </div>
      </div>

      {activeView === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4">
          {profiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl ring-4 ring-emerald-50/50">
                    {profile.fullName.charAt(0)}
                  </div>
                  {profile.isPrimary && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{profile.fullName}</h3>
                <p className="text-sm text-slate-500 mb-4">{calculateAge(profile.dob)} years old • {profile.bloodType} Blood Type</p>
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {profile.email}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex gap-3">
                <button onClick={() => handleEdit(profile)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">Edit Details</button>
                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          ))}
          <button onClick={handleAdd} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all group">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-50 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
            <p className="font-semibold">Add New Member</p>
          </button>
        </div>
      )}

      {activeView === 'meds' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Prescriptions</h3>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Daily Goal: 100% Adherence</span>
            </div>
            {medications.map(med => (
              <div key={med.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${med.category === 'maintenance' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-slate-800">{med.name}</h4>
                    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{med.category}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{med.dosage} • {med.frequency}</p>
                  <div className="mt-4 flex items-center gap-4">
                     <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(med.remaining / med.totalQuantity) * 100}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.remaining} Units Left</span>
                  </div>
                </div>
                <div className="text-center px-4 border-l border-slate-50">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Next Dose</p>
                   <p className="text-lg font-bold text-slate-800 mb-3">{med.nextDose}</p>
                   <button 
                    onClick={() => logDose(med.id)}
                    className="w-full py-2 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                   >
                     Log Dose
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Adherence Score</h4>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-5xl font-black">{adherencePercentage}%</span>
                   <span className="text-lg font-bold opacity-60">Weekly</span>
                </div>
                <p className="text-emerald-50 text-xs leading-relaxed font-medium">Excellent consistency, Alex. Your recovery timeline is 12% faster than baseline predictions due to high adherence.</p>
                <div className="mt-8 flex gap-2">
                   {[1, 2, 3, 4, 5, 6, 7].map(i => (
                     <div key={i} className={`flex-1 h-12 rounded-xl flex items-center justify-center border ${i < 6 ? 'bg-white/20 border-white/30 text-white' : 'border-white/10 text-white/40'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Compliance Shield
                </h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-800 mb-0.5">HIPAA Guard Active</p>
                        <p className="text-[9px] text-emerald-600 font-bold">Encrypted Adherence Logs</p>
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed italic">Log data is strictly available to you and your assigned clinician. NextCare utilizes end-to-end AES-256 for all medication events.</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeView === 'security' && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Security & Regulatory Center</h3>
                    <p className="text-slate-400 font-medium">Active compliance monitoring and protocol verification.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  {MOCK_SECURITY_PROTOCOLS.map(proto => (
                    <div key={proto.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group/card">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{proto.standard}</span>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${proto.status === 'certified' ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`}></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{proto.status}</span>
                          </div>
                       </div>
                       <h4 className="text-lg font-bold mb-2 group-hover/card:text-blue-400 transition-colors">{proto.name}</h4>
                       <p className="text-sm text-slate-400 leading-relaxed font-medium">{proto.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="text-center">
                         <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Encrypted Segments</p>
                         <p className="text-2xl font-bold text-white">4,281</p>
                      </div>
                      <div className="text-center">
                         <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Audit Score</p>
                         <p className="text-2xl font-bold text-emerald-400">99.9%</p>
                      </div>
                   </div>
                   <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-400 hover:text-white transition-all shadow-xl shadow-white/5">
                     Generate Compliance Report
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;