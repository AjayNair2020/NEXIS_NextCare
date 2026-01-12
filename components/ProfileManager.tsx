
import React, { useState, useMemo } from 'react';
import { PatientProfile, EmergencyContact, Medication, SecurityProtocol, EHRRecord } from '../types';
import { MOCK_PATIENTS, MOCK_MEDICATIONS, MOCK_SECURITY_PROTOCOLS, MOCK_EHR_RECORDS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { getMedicationSafetyReview, optimizeClinicalNote } from '../services/gemini';

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
  
  // New AI states
  const [safetyReview, setSafetyReview] = useState<string | null>(null);
  const [isReviewingMeds, setIsReviewingMeds] = useState(false);
  const [isOptimizingNoteId, setIsOptimizingNoteId] = useState<string | null>(null);

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
    setTimeout(() => {
      setIsSyncingEHR(false);
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

  const handleSafetyReview = async () => {
    setIsReviewingMeds(true);
    const review = await getMedicationSafetyReview(medications);
    setSafetyReview(review);
    setIsReviewingMeds(false);
  };

  const handleOptimizeNote = async (recordId: string, currentNote: string) => {
    setIsOptimizingNoteId(recordId);
    const optimized = await optimizeClinicalNote(currentNote);
    setEhrRecords(prev => prev.map(rec => rec.id === recordId ? { ...rec, notes: optimized } : rec));
    setIsOptimizingNoteId(null);
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

  const getRecordColor = (type: string, isDark: boolean) => {
    switch (type) {
      case 'condition': return isDark ? 'text-rose-400 bg-rose-950/40 border border-rose-800/40' : 'text-rose-500 bg-rose-50';
      case 'lab': return isDark ? 'text-blue-400 bg-blue-950/40 border border-blue-800/40' : 'text-blue-500 bg-blue-50';
      case 'immunization': return isDark ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : 'text-emerald-500 bg-emerald-50';
      case 'procedure': return isDark ? 'text-purple-400 bg-purple-950/40 border border-purple-800/40' : 'text-purple-500 bg-purple-50';
      default: return isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-50';
    }
  };

  const isDark = true; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isDark ? 'text-blue-50' : 'text-slate-800'}`}>Health Profile Center</h2>
          <p className="text-slate-500">Clinical records, medication adherence, and security protocols.</p>
        </div>
        <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-blue-800/30 overflow-x-auto">
          {['profiles', 'meds', 'records', 'security'].map(view => (
            <button 
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === view ? 'bg-amber-500 text-white shadow-lg' : 'text-blue-300/60 hover:text-amber-400'}`}
            >
              {view === 'records' ? 'Medical Records' : view}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4">
          {profiles.map(profile => (
            <div key={profile.id} className="bg-[#23324a] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-blue-800 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 font-bold text-xl ring-4 ring-amber-500/5">
                    {profile.fullName.charAt(0)}
                  </div>
                  {profile.isPrimary && (
                    <span className="bg-amber-100/10 text-amber-500 border border-amber-500/30 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Primary</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-blue-50 mb-1">{profile.fullName}</h3>
                <p className="text-sm text-blue-300/60 mb-4">{calculateAge(profile.dob)} years old • {profile.bloodType} Blood Type</p>
                <div className="space-y-3 pt-4 border-t border-blue-800/50 text-sm text-blue-200/80">
                  <div className="flex items-center gap-3"><svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" /></svg>{profile.email}</div>
                </div>
              </div>
              <div className="bg-[#1b263b] px-6 py-4 flex gap-3 border-t border-blue-800">
                <button onClick={() => handleEdit(profile)} className="flex-1 bg-[#23324a] border border-blue-700 text-blue-100 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-all shadow-sm">Edit Details</button>
              </div>
            </div>
          ))}
          <button onClick={handleAdd} className="border-2 border-dashed border-blue-800 rounded-2xl p-6 flex flex-col items-center justify-center text-blue-500/40 hover:border-amber-500/40 hover:text-amber-500 transition-all group bg-[#23324a]/20">
            <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-950/20 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
            <p className="font-semibold text-sm">Add New Member</p>
          </button>
        </div>
      )}

      {activeView === 'records' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-black text-blue-300/50 uppercase tracking-widest">Electronic Health Records</h3>
               <button 
                onClick={syncWithEHR}
                disabled={isSyncingEHR}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-amber-500/5"
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
                <div key={record.id} className="bg-[#23324a] p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-blue-800 flex gap-6 hover:shadow-2xl hover:border-blue-700 transition-all group">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getRecordColor(record.type, true)}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getRecordIcon(record.type)} />
                      </svg>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-bold text-blue-50 truncate">{record.title}</h4>
                        <div className="flex items-center gap-3">
                           <button 
                            onClick={() => handleOptimizeNote(record.id, record.notes || '')}
                            disabled={isOptimizingNoteId === record.id}
                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isOptimizingNoteId === record.id ? 'bg-amber-500/20 text-amber-500 cursor-wait' : 'bg-white/5 text-blue-400 hover:bg-amber-500 hover:text-white'}`}
                           >
                              {isOptimizingNoteId === record.id ? 'Refining...' : 'AI Refine Note'}
                           </button>
                           <span className="text-[10px] font-black text-blue-300/40 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${getRecordColor(record.type, true)}`}>{record.type}</span>
                         <span className="text-[10px] text-blue-400/70 font-bold uppercase">{record.status}</span>
                      </div>
                      
                      {record.type === 'lab' && record.value && (
                        <div className="bg-[#1b263b] p-4 rounded-2xl mb-3 flex items-center justify-between border border-blue-800/50">
                           <div>
                              <p className="text-[9px] font-black text-blue-400/40 uppercase mb-0.5">Measurement</p>
                              <p className="text-xl font-black text-blue-50">{record.value} <span className="text-sm text-blue-400/60">{record.unit}</span></p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black text-blue-400/40 uppercase mb-0.5">Reference Range</p>
                              <p className="text-xs font-bold text-blue-300">{record.referenceRange}</p>
                           </div>
                        </div>
                      )}

                      <p className="text-sm text-blue-200/60 font-medium leading-relaxed">{record.notes}</p>
                      <div className="mt-4 pt-4 border-t border-blue-800/50 flex justify-between items-center">
                         <p className="text-[10px] text-blue-400/40 font-medium uppercase tracking-tight">Facility: <span className="font-bold text-blue-200">{record.facility}</span></p>
                         <p className="text-[10px] text-blue-400/40 font-medium uppercase tracking-tight">Provider: <span className="font-bold text-blue-200">{record.provider}</span></p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-[#23324a] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl border border-blue-700/50">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
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
                      <button onClick={generateAISummary} className="text-[10px] font-black text-amber-400 uppercase tracking-widest hover:underline decoration-amber-500/50">Refresh Analysis</button>
                   </div>
                ) : (
                   <div className="text-center py-6">
                      <p className="text-xs text-blue-200/60 font-medium mb-6">Need a concise summary of your longitudinal medical history?</p>
                      <button 
                        onClick={generateAISummary}
                        className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20"
                      >
                        Generate Clinical Overview
                      </button>
                   </div>
                )}
             </div>

             <div className="bg-[#23324a] p-6 rounded-3xl shadow-lg border border-blue-800">
                <h4 className="text-[10px] font-black text-blue-300/40 uppercase tracking-widest mb-6">Patient Bio-Identity</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                      <span className="text-xs font-medium text-blue-300/60">Primary Clinician</span>
                      <span className="text-xs font-bold text-blue-50">Dr. Sarah Jenkins</span>
                   </div>
                   <div className={`flex justify-between items-center py-3 border-b border-blue-800/50`}>
                      <span className="text-xs font-medium text-blue-300/60">Blood Type</span>
                      <span className="text-xs font-bold text-amber-500">A+ Positive</span>
                   </div>
                   <div className="flex justify-between items-center py-3 border-b border-blue-800/50">
                      <span className="text-xs font-medium text-blue-300/60">Allergies</span>
                      <span className="text-xs font-bold text-rose-400">Peanuts, Penicillin</span>
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
               <h3 className="text-sm font-black text-blue-300/60 uppercase tracking-widest">Active Prescriptions</h3>
               <button 
                onClick={handleSafetyReview}
                disabled={isReviewingMeds}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
               >
                 {isReviewingMeds ? (
                   <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Reviewing safety...
                   </>
                 ) : (
                   <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" /></svg>
                    Safety Interaction Check
                   </>
                 )}
               </button>
            </div>

            {medications.map(med => (
              <div key={med.id} className="bg-[#23324a] p-6 rounded-3xl shadow-sm border border-blue-800 flex items-center gap-6 group hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${med.category === 'maintenance' ? 'bg-blue-900/40 text-blue-400' : 'bg-amber-950/30 text-amber-500'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-blue-50">{med.name}</h4>
                    <span className="text-[10px] font-black uppercase text-blue-300/40 bg-white/5 px-2 py-0.5 rounded">{med.category}</span>
                  </div>
                  <p className="text-sm text-blue-200/60 font-medium">{med.dosage} • {med.frequency}</p>
                  <div className="mt-4 flex items-center gap-4">
                     <div className="flex-1 bg-blue-900/40 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(med.remaining / med.totalQuantity) * 100}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{med.remaining} Units Left</span>
                  </div>
                </div>
                <div className="text-center px-4 border-l border-blue-800/50">
                   <p className="text-[10px] text-blue-300/40 font-black uppercase mb-1">Next Dose</p>
                   <p className="text-lg font-bold text-blue-50 mb-3">{med.nextDose}</p>
                   <button 
                    onClick={() => logDose(med.id)}
                    className="w-full py-2 px-4 bg-white/5 text-blue-200 text-xs font-bold rounded-xl hover:bg-amber-600 hover:text-white transition-colors border border-white/5"
                   >
                     Log Dose
                   </button>
                </div>
              </div>
            ))}

            {safetyReview && (
              <div className="mt-10 p-8 rounded-[2.5rem] bg-rose-950/20 border border-rose-900/30 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       AI Safety Review Summary
                    </h4>
                    <button onClick={() => setSafetyReview(null)} className="text-[9px] font-bold text-rose-400 uppercase hover:underline">Dismiss Report</button>
                 </div>
                 <div className="prose prose-sm prose-invert leading-relaxed text-blue-100 whitespace-pre-wrap text-sm italic opacity-90">
                    {safetyReview}
                 </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-900/10 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Adherence Score</h4>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-5xl font-black">{adherencePercentage}%</span>
                   <span className="text-lg font-bold opacity-60">Weekly</span>
                </div>
                <p className="text-amber-50 text-xs leading-relaxed font-medium">Excellent consistency, Alex. Your recovery timeline is 12% faster than baseline predictions due to high adherence.</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
