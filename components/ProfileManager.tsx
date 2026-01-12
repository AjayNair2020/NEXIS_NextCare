
import React, { useState, useMemo } from 'react';
import { PatientProfile, EmergencyContact, Medication, SecurityProtocol, EHRRecord } from '../types';
import { MOCK_PATIENTS, MOCK_MEDICATIONS, MOCK_SECURITY_PROTOCOLS, MOCK_EHR_RECORDS } from '../constants';
import { GoogleGenAI } from "@google/genai";

const ProfileManager: React.FC = () => {
  const [profiles, setProfiles] = useState<PatientProfile[]>(MOCK_PATIENTS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [ehrRecords, setEhrRecords] = useState<EHRRecord[]>(MOCK_EHR_RECORDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeView, setActiveView] = useState<'profiles' | 'meds' | 'records' | 'security'>('profiles');
  const [isSyncingEHR, setIsSyncingEHR] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const syncWithEHR = () => {
    setIsSyncingEHR(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setIsSyncingEHR(false);
      // In real app, we'd append new records here
    }, 2500);
  };

  const generateAISummary = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze and provide a clear, concise health summary for a patient with these medical records: ${JSON.stringify(ehrRecords)}. 
        Focus on active conditions, recent labs, and key maintenance requirements. Keep it professional and empathetic.`,
        config: {
          systemInstruction: "You are a clinical coordinator at NextCare AI.",
          temperature: 0.4,
        }
      });
      setAiSummary(response.text || "Summary unavailable at this time.");
    } catch (e) {
      setAiSummary("NEXIS: Clinical summarization engine encountered a sync error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const adherencePercentage = useMemo(() => 94, []);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'condition': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'lab': return 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z';
      case 'immunization': return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
      case 'procedure': return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z';
      default: return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'condition': return 'text-rose-500 bg-rose-50';
      case 'lab': return 'text-blue-500 bg-blue-50';
      case 'immunization': return 'text-emerald-500 bg-emerald-50';
      case 'procedure': return 'text-purple-500 bg-purple-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

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
            <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input 
                    type="date" required
                    value={formData.dob}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                  <select 
                    value={formData.bloodType}
                    onChange={e => setFormData({...formData, bloodType: e.target.value})}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
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
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => { setEditingId(null); setIsAdding(false); }} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-8 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 shadow-lg shadow-amber-200">Save Profile</button>
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
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          {['profiles', 'meds', 'records', 'security'].map(view => (
            <button 
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === view ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-amber-600'}`}
            >
              {view === 'records' ? 'Medical Records' : view}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4">
          {profiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-xl ring-4 ring-amber-50/50">
                    {profile.fullName.charAt(0)}
                  </div>
                  {profile.isPrimary && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Primary</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{profile.fullName}</h3>
                <p className="text-sm text-slate-500 mb-4">{calculateAge(profile.dob)} years old • {profile.bloodType} Blood Type</p>
                <div className="space-y-3 pt-4 border-t border-slate-50 text-sm text-slate-600">
                  <div className="flex items-center gap-3"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{profile.email}</div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex gap-3">
                <button onClick={() => handleEdit(profile)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-amber-50 hover:text-amber-600 transition-all">Edit Details</button>
              </div>
            </div>
          ))}
          <button onClick={handleAdd} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-amber-300 hover:text-amber-500 transition-all group">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-50 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
            <p className="font-semibold">Add New Member</p>
          </button>
        </div>
      )}

      {activeView === 'records' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Electronic Health Records</h3>
               <button 
                onClick={syncWithEHR}
                disabled={isSyncingEHR}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all disabled:opacity-50"
               >
                 {isSyncingEHR ? (
                   <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Syncing EHR Hub...
                   </>
                 ) : (
                   <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Sync external EHR
                   </>
                 )}
               </button>
            </div>

            <div className="space-y-4">
              {ehrRecords.map((record) => (
                <div key={record.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-6 hover:shadow-md transition-all group">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getRecordColor(record.type)}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getRecordIcon(record.type)} />
                      </svg>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-bold text-slate-800 truncate">{record.title}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${getRecordColor(record.type)}`}>{record.type}</span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">{record.status}</span>
                      </div>
                      
                      {record.type === 'lab' && record.value && (
                        <div className="bg-slate-50 p-4 rounded-2xl mb-3 flex items-center justify-between border border-slate-100">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Measurement</p>
                              <p className="text-xl font-black text-slate-800">{record.value} <span className="text-sm text-slate-500">{record.unit}</span></p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Reference Range</p>
                              <p className="text-xs font-bold text-slate-600">{record.referenceRange}</p>
                           </div>
                        </div>
                      )}

                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{record.notes}</p>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                         <p className="text-[10px] text-slate-400 font-medium">Facility: <span className="font-bold text-slate-600">{record.facility}</span></p>
                         <p className="text-[10px] text-slate-400 font-medium">Provider: <span className="font-bold text-slate-600">{record.provider}</span></p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   AI Clinical Synthesis
                </h4>
                
                {isAnalyzing ? (
                   <div className="py-10 flex flex-col items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Synthesizing records...</p>
                   </div>
                ) : aiSummary ? (
                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="prose prose-sm prose-invert leading-relaxed text-xs opacity-90 mb-8 whitespace-pre-wrap">{aiSummary}</div>
                      <button onClick={generateAISummary} className="text-[10px] font-black text-amber-400 uppercase tracking-widest hover:underline">Refresh Analysis</button>
                   </div>
                ) : (
                   <div className="text-center py-6">
                      <p className="text-xs text-slate-400 font-medium mb-6">Need a concise summary of your longitudinal medical history?</p>
                      <button 
                        onClick={generateAISummary}
                        className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20"
                      >
                        Generate Clinical Overview
                      </button>
                   </div>
                )}
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Patient Bio-Identity</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-xs font-medium text-slate-500">Primary Clinician</span>
                      <span className="text-xs font-bold text-slate-800">Dr. Sarah Jenkins</span>
                   </div>
                   <div className={`flex justify-between items-center py-3 border-b border-slate-50`}>
                      <span className="text-xs font-medium text-slate-500">Blood Type</span>
                      <span className="text-xs font-bold text-amber-600">A+ Positive</span>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-xs font-medium text-slate-500">Allergies</span>
                      <span className="text-xs font-bold text-rose-500">Peanuts, Penicillin</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeView === 'meds' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Prescriptions</h3>
               <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Daily Goal: 100% Adherence</span>
            </div>
            {medications.map(med => (
              <div key={med.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${med.category === 'maintenance' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
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
                        <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(med.remaining / med.totalQuantity) * 100}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.remaining} Units Left</span>
                  </div>
                </div>
                <div className="text-center px-4 border-l border-slate-50">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Next Dose</p>
                   <p className="text-lg font-bold text-slate-800 mb-3">{med.nextDose}</p>
                   <button 
                    onClick={() => logDose(med.id)}
                    className="w-full py-2 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-slate-200"
                   >
                     Log Dose
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-100 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Adherence Score</h4>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-5xl font-black">{adherencePercentage}%</span>
                   <span className="text-lg font-bold opacity-60">Weekly</span>
                </div>
                <p className="text-amber-50 text-xs leading-relaxed font-medium">Excellent consistency, Alex. Your recovery timeline is 12% faster than baseline predictions due to high adherence.</p>
                <div className="mt-8 flex gap-2">
                   {[1, 2, 3, 4, 5, 6, 7].map(i => (
                     <div key={i} className={`flex-1 h-12 rounded-xl flex items-center justify-center border ${i < 6 ? 'bg-white/20 border-white/30 text-white' : 'border-white/10 text-white/40'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                   ))}
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
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-2xl">
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
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">{proto.standard}</span>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${proto.status === 'certified' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{proto.status}</span>
                          </div>
                       </div>
                       <h4 className="text-lg font-bold mb-2 group-hover/card:text-amber-400 transition-colors">{proto.name}</h4>
                       <p className="text-sm text-slate-400 leading-relaxed font-medium">{proto.description}</p>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
