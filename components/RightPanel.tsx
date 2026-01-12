
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS } from '../constants';
import { getHealthAssistantResponse } from '../services/gemini';
import { Message, User } from '../types';

interface RightPanelProps {
  user: User;
  setActiveTab: (tab: string) => void;
  mainScrollRef: React.RefObject<HTMLElement | null>;
  onTriggerAlert: () => void;
  isDarkMode?: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ user, setActiveTab, mainScrollRef, onTriggerAlert, isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'NEXIS Core ready. How can I assist with your health intelligence today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Calendar State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2023-10-24')); // Sync with mock data
  const [viewDate, setViewDate] = useState<Date>(new Date('2023-10-01'));
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
    const response = await getHealthAssistantResponse(content, history);
    
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response.text, timestamp: new Date() }]);
    setIsTyping(false);
  };

  const quickFeatures = [
    { label: 'Check Symptoms', prompt: 'I would like to perform a quick symptom analysis. Can you help?', icon: '⚡' },
    { label: 'Explain Labs', prompt: 'Please help me interpret my recent clinical laboratory results.', icon: '🔬' },
    { label: 'Medication Info', prompt: 'I need information about my current prescriptions and side effects.', icon: '💊' },
    { label: 'Daily Briefing', prompt: 'Provide a high-level briefing of my health metrics and agenda for today.', icon: '📊' }
  ];

  // Calendar Logic
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth(viewDate); i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth(viewDate); i++) calendarDays.push(i);

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return MOCK_APPOINTMENTS.filter(app => app.date === dateStr);
  };

  const filteredAppointments = MOCK_APPOINTMENTS.filter(app => {
    const appDate = new Date(app.date);
    return isSameDay(appDate, selectedDate);
  });

  const isLogistics = user.role === 'LOGISTICS_CHIEF' || user.role === 'SUPER_ADMIN';

  return (
    <div className={`w-80 border-l h-screen fixed right-0 top-0 flex flex-col z-10 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]'}`}>
      
      {/* Toast Overlay */}
      {toast && (
        <div className="absolute top-4 -left-64 w-60 z-[200] animate-in fade-in slide-in-from-right duration-300">
           <div className={`backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-2xl transition-colors ${isDarkMode ? 'bg-slate-800/90 text-slate-100 border-slate-700' : 'bg-slate-900/90 text-white border-white/10'}`}>
              {toast}
           </div>
        </div>
      )}

      {/* Side Action Rail */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {[
          { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Sync', onClick: () => { setIsSyncing(true); showToast("Syncing Database..."); setTimeout(() => setIsSyncing(false), 1500); }, color: 'hover:text-emerald-500' },
          { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Triage', onClick: () => { setActiveTab('assistant'); showToast("NEXIS AI Priority Active"); }, color: 'hover:text-amber-500' },
          { icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Alert', onClick: () => { onTriggerAlert(); showToast("Regional Alert Dispatched"); }, color: 'hover:text-rose-500' },
        ].map((action, i) => (
          <button 
            key={i}
            onClick={action.onClick}
            className={`w-10 h-10 border rounded-xl shadow-lg flex items-center justify-center text-slate-400 transition-all group relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} ${action.color} hover:scale-110 active:scale-95`}
          >
            <svg className={`w-5 h-5 ${isSyncing && action.label === 'Sync' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
            </svg>
            <span className="absolute right-full mr-3 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* New AI Assistant Prominent Section */}
        <section className={`p-5 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 shadow-2xl' : 'bg-slate-900 border-slate-800 shadow-xl shadow-slate-200'}`}>
          <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <div>
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.2em]">NEXIS Intelligence</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Proactive Assistance</p>
             </div>
          </div>

          {/* Quick AI Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {quickFeatures.map((feat, i) => (
              <button 
                key={i}
                onClick={() => handleSend(feat.prompt)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-200 transition-all flex items-center gap-2"
              >
                <span>{feat.icon}</span>
                {feat.label}
              </button>
            ))}
          </div>

          {/* Assistant Chat Area */}
          <div ref={scrollRef} className="h-48 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-hide">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-2xl text-[11px] max-w-[90%] leading-relaxed ${
                  m.role === 'user' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-800 text-slate-300 border border-slate-700 shadow-xl'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 ml-1">
                 <div className="flex gap-1">
                   <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
                 <span className="text-[10px] text-amber-400/50 font-black uppercase tracking-widest">Synthesizing...</span>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for help..." 
              className="w-full bg-slate-800 border-none rounded-xl py-2.5 px-4 text-[11px] text-white placeholder:text-slate-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <button type="submit" className="absolute right-2 top-1.5 p-1 text-amber-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </section>

        {/* KPI Section (Admin Only) */}
        {isLogistics && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Operational Pulse</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl border transition-colors group ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Network Load</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>82%</p>
                <div className="w-full bg-slate-200/20 h-1 rounded-full mt-2"><div className="bg-emerald-500 h-full w-[82%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div></div>
              </div>
              <div className={`p-4 rounded-2xl border transition-colors group ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Fleet Sync</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>14/15</p>
                <div className="w-full bg-slate-200/20 h-1 rounded-full mt-2"><div className="bg-blue-500 h-full w-[94%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div></div>
              </div>
            </div>
          </section>
        )}

        {/* Tactical Calendar Section */}
        <section className={`p-5 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700 shadow-sm' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Health Calendar</h3>
            <div className="flex gap-2 bg-white/10 p-1 rounded-lg">
              <button 
                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className={`text-[10px] font-black uppercase min-w-[70px] text-center flex items-center justify-center ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <span key={d} className="text-[8px] font-black text-slate-400 opacity-60">{d}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="aspect-square"></div>;
              
              const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              const dayAppointments = getAppointmentsForDay(day);
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-xl text-[10px] font-bold transition-all relative flex flex-col items-center justify-center ${
                    isSelected 
                      ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-110 z-10' 
                      : isToday 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-white hover:shadow-sm')
                  }`}
                >
                  <span>{day}</span>
                  {dayAppointments.length > 0 && !isSelected && (
                    <div className="absolute bottom-1.5 w-1 h-1 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.8)]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Dynamic Agenda Section */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Agenda: {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('appointments')}
                className="text-[9px] font-black text-emerald-600 hover:underline uppercase tracking-widest"
              >
                Full Access
              </button>
            </div>
            
            <div className="space-y-3">
              {filteredAppointments.length > 0 ? filteredAppointments.map(app => (
                <div key={app.id} className={`p-4 border rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                   <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className={`text-xs font-black truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{app.doctorName}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{app.specialty}</p>
                      </div>
                   </div>
                   <div className={`flex justify-between items-center text-[10px] font-black mt-3 pt-3 border-t transition-colors ${isDarkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                      <span className="text-slate-400 uppercase">{app.time}</span>
                      <span className={`px-2 py-0.5 rounded-lg uppercase tracking-tighter ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Confirmed</span>
                   </div>
                </div>
              )) : (
                <div className={`py-10 text-center rounded-[2rem] border-2 border-dashed ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Tactical Interventions</p>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Information (Meds) */}
          {!isLogistics && (
            <div>
               <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pending Protocol</h3>
                <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase">2 Overdue</span>
              </div>
              <div className="space-y-3">
                {MOCK_MEDICATIONS.map(med => (
                  <div key={med.id} className={`flex items-center gap-3 p-3 border rounded-2xl group transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm'}`}>
                     <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-white border-slate-100 text-slate-400 group-hover:text-emerald-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10" /></svg>
                     </div>
                     <div className="flex-1">
                        <p className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{med.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">Next Dose: {med.nextDose}</p>
                     </div>
                     <button onClick={() => setActiveTab('profile')} className={`w-6 h-6 rounded-full border flex items-center justify-center hover:text-white transition-all ${isDarkMode ? 'border-slate-700 text-slate-500 hover:bg-emerald-600' : 'border-slate-200 text-slate-400 hover:bg-emerald-500'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer Integrity Indicator */}
      <div className={`p-6 border-t transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
        <div className={`border rounded-2xl p-4 flex items-center gap-4 transition-all ${isDarkMode ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100 shadow-inner'}`}>
           <div className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center ring-4 transition-colors ${isDarkMode ? 'bg-slate-900 text-emerald-400 ring-emerald-500/10' : 'bg-white text-emerald-600 ring-emerald-500/10'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
           <div>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${isDarkMode ? 'text-emerald-500' : 'text-emerald-800'}`}>Security Integrity</p>
              <p className={`text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Active Session Guard</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
