
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_HEALTH_METRICS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_PROGRAMS } from '../constants';
import HealthMap from './HealthMap';

interface DashboardProps {
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [selectedDate, setSelectedDate] = useState('2023-10-24');

  const filteredAppointments = MOCK_APPOINTMENTS.filter(app => app.date === selectedDate);

  const getTreatmentPhase = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 10) return { label: 'Triage', color: 'bg-amber-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };
    if (hour < 12) return { label: 'Consultation', color: 'bg-amber-600', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' };
    if (hour < 14) return { label: 'Procedure', color: 'bg-amber-400', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' };
    return { label: 'Recovery', color: 'bg-amber-700', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' };
  };

  const currentHeartRate = MOCK_HEALTH_METRICS[MOCK_HEALTH_METRICS.length - 1].heartRate;
  const currentSleep = MOCK_HEALTH_METRICS[MOCK_HEALTH_METRICS.length - 1].sleep;
  const currentSteps = MOCK_HEALTH_METRICS[MOCK_HEALTH_METRICS.length - 1].steps;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Welcome back, Alex!</h2>
          <p className="text-slate-500 font-medium">Your physiological vectors are within optimal range. System sync complete.</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl shadow-sm border flex items-center gap-2 group transition-all cursor-default ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50' : 'bg-white border-slate-100 hover:border-amber-200'}`}>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Live Bio-Telemetry</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Heart Rate Card */}
        <div className={`p-6 rounded-[2rem] shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg animate-heartbeat`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="px-2 py-1 bg-amber-50 rounded-lg flex items-center gap-1.5 border border-amber-100">
              <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">Live Sensor</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heart Rate</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className={`text-4xl font-black transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{currentHeartRate}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">bpm</span>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HEALTH_METRICS}>
                <Area type="monotone" dataKey="heartRate" stroke="#f59e0b" fill="#fef3c7" fillOpacity={0.4} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Quality Card */}
        <div className={`p-6 rounded-[2rem] shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div className="relative w-8 h-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={88} strokeDashoffset={88 * (1 - currentSleep / 10)} className="text-blue-500 transition-all duration-1000" />
                </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sleep Quality</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className={`text-4xl font-black transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{currentSleep}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">hours</span>
          </div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase mt-4">92% Restored</p>
          <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: '92%' }}></div>
          </div>
        </div>

        {/* Steps Card */}
        <div className={`p-6 rounded-[2rem] shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-lg`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Steps</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className={`text-4xl font-black transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{currentSteps.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">steps</span>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HEALTH_METRICS}>
                <Area type="step" dataKey="steps" stroke="#10b981" fill="#dcfce7" fillOpacity={0.4} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure Card */}
        <div className={`p-6 rounded-[2rem] shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center transition-transform group-hover:scale-95 shadow-lg`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Stable</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Pressure</p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className={`text-3xl font-black transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>118/76</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">mmHg</span>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_HEALTH_METRICS}>
                <Line type="monotone" dataKey="bloodPressure" stroke="#f43f5e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Program Lifecycle Planner (Gantt Chart) */}
      <section className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
           <div>
              <h3 className={`text-xl font-bold flex items-center gap-3 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                </div>
                NEXIS Program Lifecycle Planner
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Cross-domain strategic roadmap and milestone tracking</p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled</span>
              </div>
           </div>
        </div>

        <div className="p-8 overflow-x-auto custom-scrollbar">
           <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="grid grid-cols-[240px_1fr] border-b border-slate-100 pb-4 mb-4">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Unit</div>
                 <div className="grid grid-cols-7 gap-1 text-center">
                    {daysOfWeek.map((day, i) => (
                       <div key={i} className={`text-[10px] font-black uppercase tracking-widest ${i === 1 ? 'text-amber-600' : 'text-slate-400'}`}>
                          {day}
                          {i === 1 && <div className="text-[8px] mt-0.5">Current</div>}
                       </div>
                    ))}
                 </div>
              </div>

              {/* Task Rows */}
              <div className="space-y-4">
                 {MOCK_PROGRAMS.map((task) => (
                    <div key={task.id} className="grid grid-cols-[240px_1fr] items-center group">
                       <div className="pr-4">
                          <h4 className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} group-hover:text-amber-600`}>{task.name}</h4>
                          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">Lead: {task.owner}</p>
                       </div>
                       <div className="grid grid-cols-7 gap-1 h-8 relative">
                          {/* Grid lines */}
                          <div className="absolute inset-0 grid grid-cols-7 gap-1 pointer-events-none opacity-20">
                             {[...Array(7)].map((_, i) => (
                                <div key={i} className={`border-r border-slate-300 h-full ${i === 6 ? 'border-r-0' : ''}`}></div>
                             ))}
                          </div>

                          {/* Task Bar */}
                          <div 
                             className={`h-full rounded-lg absolute transition-all duration-500 ease-out group-hover:shadow-lg group-hover:scale-[1.02] flex items-center px-3 overflow-hidden ${
                                task.status === 'completed' ? 'bg-emerald-500 shadow-sm' :
                                task.status === 'in-progress' ? 'bg-amber-500 shadow-amber-200/50 shadow-md' :
                                'bg-slate-200 opacity-60'
                             }`}
                             style={{
                                left: `calc(${(task.startDay / 7) * 100}% + 2px)`,
                                width: `calc(${(task.durationDays / 7) * 100}% - 4px)`
                             }}
                          >
                             {task.progress > 0 && (
                                <div className="absolute left-0 top-0 bottom-0 bg-black/10 transition-all duration-1000" style={{ width: `${task.progress}%` }}></div>
                             )}
                             <span className="text-[9px] font-black text-white relative z-10 truncate uppercase tracking-widest">
                                {task.status === 'in-progress' ? `${task.progress}% Sync` : task.status}
                             </span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
        
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">NEXIS AI is dynamically optimizing 12 parallel workstreams based on clinical load telemetry.</p>
           <button className="text-[9px] font-black text-amber-600 hover:underline uppercase tracking-widest">View Detailed Roadmap</button>
        </div>
      </section>

      {/* Clinical Schedule Section */}
      <section className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h3 className={`text-xl font-bold flex items-center gap-3 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                Clinical Calendar
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Operational Triage & Resource Allocation Flow</p>
           </div>
           
           <div className={`flex p-1 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              {[
                { date: '2023-10-23', label: 'MON', d: '23' },
                { date: '2023-10-24', label: 'TUE', d: '24' },
                { date: '2023-10-25', label: 'WED', d: '25' },
                { date: '2023-10-26', label: 'THU', d: '26' },
                { date: '2023-10-27', label: 'FRI', d: '27' },
              ].map(day => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`px-4 py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all min-w-[64px] ${
                    selectedDate === day.date 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105 z-10' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest">{day.label}</span>
                  <span className="text-sm font-black">{day.d}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Schedule Feed */}
           <div className="lg:col-span-3 space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {filteredAppointments.length > 0 ? filteredAppointments.map(app => {
                const phase = getTreatmentPhase(app.time);
                const doctor = MOCK_DOCTORS.find(d => d.id === app.doctorId);
                return (
                  <div key={app.id} className={`p-5 rounded-[2rem] border transition-all group flex items-center gap-6 ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-amber-500/40' : 'bg-slate-50 border-slate-100 hover:border-amber-200 shadow-sm'}`}>
                    <div className="text-center min-w-[80px]">
                      <p className={`text-lg font-black tracking-tighter ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{app.time.split(' ')[0]}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.time.split(' ')[1]}</p>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                           <img src={doctor?.image} className="w-8 h-8 rounded-xl border border-white shadow-sm" alt="" />
                           <div>
                              <p className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{app.doctorName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.specialty}</p>
                           </div>
                        </div>
                        <div className={`px-3 py-1 rounded-xl flex items-center gap-2 border ${phase.color.replace('bg-', 'bg-').replace('500', '10')}/10 ${phase.color.replace('bg-', 'border-').replace('500', '200')}/20 shadow-sm`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${phase.color} animate-pulse`}></div>
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${phase.color.replace('bg-', 'text-')}`}>{phase.label}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 bg-white/5 border border-slate-200/50 rounded-xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Readiness</p>
                          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>98% Optimal</p>
                        </div>
                        <div className="p-2 bg-white/5 border border-slate-200/50 rounded-xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Patient Vector</p>
                          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Arriving: 4m</p>
                        </div>
                        <div className="p-2 bg-white/5 border border-slate-200/50 rounded-xl">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Complexity</p>
                          <p className={`text-[10px] font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Moderate</p>
                        </div>
                      </div>
                    </div>

                    <button className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-400 hover:text-amber-600 shadow-sm border border-slate-100'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                );
              }) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                  <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm font-bold text-slate-400">No scheduled interventions for this vector.</p>
                </div>
              )}
           </div>

           {/* Schedule KPIs */}
           <div className="space-y-6">
              <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    Daily Efficiency Pulse
                 </h4>
                 <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Wait Time Avg</span>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>12m</span>
                      </div>
                      <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[12%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Room Utilization</span>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>84%</span>
                      </div>
                      <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[84%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Protocol Match</span>
                        <span className={`text-xs font-black ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>99.8%</span>
                      </div>
                      <div className="w-full bg-slate-200/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[99%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      </div>
                    </div>
                 </div>
              </div>

              <div className={`p-6 rounded-3xl border text-white relative overflow-hidden group ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-slate-900 border-slate-800'}`}>
                 <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform"></div>
                 <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">Triage Suggestion</h5>
                 <p className="text-[11px] leading-relaxed font-medium opacity-80">
                    High clinical load expected between 14:00 - 16:00. AI suggests opening secondary consultation node in Hub fac-4.
                 </p>
                 <button className="mt-4 text-[9px] font-black text-white hover:text-amber-400 uppercase tracking-widest underline decoration-amber-500/50 underline-offset-4 transition-colors">Apply Strategy</button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
