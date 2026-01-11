
import React, { useState, useEffect } from 'react';
import { Appointment, Doctor, ReminderSettings } from '../types';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '../constants';
import HealthMap from './HealthMap';
import { generatePersonalizedReminder } from '../services/gemini';

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    MOCK_APPOINTMENTS.map(app => ({
      ...app,
      reminderSettings: { pushEnabled: true, emailEnabled: false, minutesBefore: 60 }
    }))
  );
  const [isBooking, setIsBooking] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedJourneyApp, setSelectedJourneyApp] = useState<Appointment | null>(null);
  const [configuringReminderApp, setConfiguringReminderApp] = useState<Appointment | null>(null);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderDraft, setReminderDraft] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    departureAddress: 'Current Location',
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoctor = MOCK_DOCTORS.find(d => d.id === formData.doctorId);
    if (!selectedDoctor) return;

    const distance = (Math.random() * 5 + 1).toFixed(1);
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: formData.date,
      time: formData.time,
      status: 'upcoming',
      patientLocation: { 
        lat: userCoords?.lat || 37.7749, 
        lng: userCoords?.lng || -122.4194, 
        address: formData.departureAddress 
      },
      outcomeMetrics: {
        distanceKm: parseFloat(distance),
        travelTimeMin: Math.round(parseFloat(distance) * 4),
        healthGainScore: 70 + Math.floor(Math.random() * 30),
        predictedRecoveryBoost: 'Optimization of treatment plan based on latest diagnostic tools available at the facility.'
      },
      reminderSettings: { pushEnabled: true, emailEnabled: true, minutesBefore: 60 }
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setIsBooking(false);
    setFormData({ doctorId: '', date: '', time: '', departureAddress: 'Current Location' });
  };

  const updateReminderSettings = (id: string, settings: ReminderSettings) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, reminderSettings: settings } : app
    ));
    setConfiguringReminderApp(null);
  };

  const handleTriggerReminder = async (app: Appointment) => {
    setIsSendingReminder(true);
    setReminderDraft(null);
    const draft = await generatePersonalizedReminder(app);
    setReminderDraft(draft);
    
    // Simulate real dispatch
    setTimeout(() => {
      setIsSendingReminder(false);
      // Actual implementation would call a backend API here
      setAppointments(prev => prev.map(a => 
        a.id === app.id ? { ...a, reminderSettings: { ...a.reminderSettings!, lastSent: new Date().toISOString() } } : a
      ));
    }, 2000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-slate-100 text-slate-600';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500">Plan your visits with integrated logistics and smart reminders.</p>
        </div>
        <button 
          onClick={() => setIsBooking(true)}
          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Book Appointment
        </button>
      </div>

      {isBooking ? (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-800">New Logistics Booking</h3>
              <p className="text-sm text-slate-500">We'll calculate the shortest route and health vector automatically.</p>
            </div>
            <button 
              onClick={() => setIsBooking(false)}
              className="text-slate-400 hover:text-slate-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleBookAppointment} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Provider</label>
              <div className="grid grid-cols-1 gap-3">
                {MOCK_DOCTORS.map(doctor => (
                  <label 
                    key={doctor.id}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.doctorId === doctor.id 
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' 
                        : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" name="doctor" value={doctor.id} required className="hidden"
                      onChange={() => setFormData({...formData, doctorId: doctor.id})}
                    />
                    <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{doctor.name}</p>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{doctor.specialty}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Departure Location</label>
                <input 
                  type="text" required
                  value={formData.departureAddress}
                  onChange={e => setFormData({...formData, departureAddress: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5"
                  placeholder="Enter starting address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" required className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5" onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input type="time" required className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5" onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setIsBooking(false)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">Confirm visit</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {appointments.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-100 relative group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {app.reminderSettings?.pushEnabled && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-slate-800">{app.doctorName}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-emerald-600 text-sm font-medium mb-1">{app.specialty}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {app.time}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={() => setSelectedJourneyApp(app)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  Journey Map
                </button>
                <button 
                  onClick={() => setConfiguringReminderApp(app)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  Smart Reminders
                </button>
                <button 
                  onClick={() => handleTriggerReminder(app)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Now
                </button>
              </div>

              {app.reminderSettings?.lastSent && (
                <p className="text-[9px] text-slate-400 italic">Last reminder sent: {new Date(app.reminderSettings.lastSent).toLocaleTimeString()}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reminder Config Modal */}
      {configuringReminderApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Reminder Preferences</h3>
            <p className="text-sm text-slate-500 mb-8">Personalize how NextCare AI communicates with you for this visit.</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-800">Push Notifications</p>
                   <p className="text-[10px] text-slate-400">Low-latency tactical alerts</p>
                </div>
                <button 
                  onClick={() => setConfiguringReminderApp({
                    ...configuringReminderApp, 
                    reminderSettings: { ...configuringReminderApp.reminderSettings!, pushEnabled: !configuringReminderApp.reminderSettings?.pushEnabled }
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${configuringReminderApp.reminderSettings?.pushEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${configuringReminderApp.reminderSettings?.pushEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                   <p className="text-sm font-bold text-slate-800">Email Updates</p>
                   <p className="text-[10px] text-slate-400">Detailed clinical summary</p>
                </div>
                <button 
                  onClick={() => setConfiguringReminderApp({
                    ...configuringReminderApp, 
                    reminderSettings: { ...configuringReminderApp.reminderSettings!, emailEnabled: !configuringReminderApp.reminderSettings?.emailEnabled }
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${configuringReminderApp.reminderSettings?.emailEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${configuringReminderApp.reminderSettings?.emailEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Time Before Dispatch</label>
                <div className="grid grid-cols-3 gap-2">
                   {[15, 60, 1440].map(m => (
                     <button 
                        key={m}
                        onClick={() => setConfiguringReminderApp({
                          ...configuringReminderApp, 
                          reminderSettings: { ...configuringReminderApp.reminderSettings!, minutesBefore: m }
                        })}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          configuringReminderApp.reminderSettings?.minutesBefore === m 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                        }`}
                     >
                       {m >= 1440 ? '24h' : m >= 60 ? '1h' : `${m}m`}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <button 
                onClick={() => updateReminderSettings(configuringReminderApp.id, configuringReminderApp.reminderSettings!)}
                className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200"
              >
                Save Protocol
              </button>
              <button 
                onClick={() => setConfiguringReminderApp(null)}
                className="w-full py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sending Animation Overlay */}
      {isSendingReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-white/20 text-center flex flex-col items-center gap-6 animate-in zoom-in duration-500 max-w-sm">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-1">Personalizing Alert</h4>
                <p className="text-xs text-slate-500 font-medium">NEXIS Core is drafting a reassuring message based on clinical context...</p>
              </div>
           </div>
        </div>
      )}

      {/* Draft Notification Display */}
      {reminderDraft && !isSendingReminder && (
        <div className="fixed top-8 right-8 z-[200] max-w-xs w-full animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 text-white rounded-3xl shadow-2xl p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Push Alert Dispatched</p>
                  <p className="text-xs font-bold">Clinical Reminder</p>
               </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{reminderDraft}"</p>
            <button 
              onClick={() => setReminderDraft(null)}
              className="mt-6 w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Journey Modal (Existing) */}
      {selectedJourneyApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-bold text-slate-800">Patient Journey Intelligence</h3>
                   <p className="text-sm text-slate-500">Mapping tactical route and predicted health outcome vector.</p>
                </div>
                <button 
                  onClick={() => setSelectedJourneyApp(null)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             </div>
             <div className="flex-1 flex overflow-hidden">
                <div className="w-80 bg-slate-50 p-8 flex flex-col gap-8 overflow-y-auto">
                   <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Journey Data</h4>
                      <div className="space-y-4">
                         <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Origin</p>
                            <p className="text-sm font-bold text-slate-800 line-clamp-2">{selectedJourneyApp.patientLocation?.address}</p>
                         </div>
                         <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Destination</p>
                            <p className="text-sm font-bold text-slate-800">{selectedJourneyApp.doctorName}</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg mt-auto">
                      <h5 className="font-bold text-sm mb-2">Outcome Vector</h5>
                      <p className="text-xs text-blue-100 leading-relaxed">
                        Gemini predicts a <span className="text-white font-bold">{selectedJourneyApp.outcomeMetrics?.healthGainScore}% efficiency boost</span> in clinical recovery.
                      </p>
                   </div>
                </div>
                <div className="flex-1 relative bg-slate-100">
                   <HealthMap variant="journey" activeAppointment={selectedJourneyApp} />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;
