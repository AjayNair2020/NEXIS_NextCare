import React, { useState, useEffect } from 'react';
import { Appointment, Doctor } from '../types';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '../constants';
import HealthMap from './HealthMap';

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isBooking, setIsBooking] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedJourneyApp, setSelectedJourneyApp] = useState<Appointment | null>(null);
  
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

    // Simulate outcome calculation
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
      }
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setIsBooking(false);
    setFormData({ doctorId: '', date: '', time: '', departureAddress: 'Current Location' });
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
          <p className="text-slate-500">Plan your visits with integrated logistics and health vectors.</p>
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
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Location</p>
                      <p className="text-xs text-slate-600 font-medium">San Francisco, CA</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Departure Location</label>
                <div className="relative">
                  <input 
                    type="text" required
                    value={formData.departureAddress}
                    onChange={e => setFormData({...formData, departureAddress: e.target.value})}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Enter starting address"
                  />
                  <svg className="w-5 h-5 text-emerald-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
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
            <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-slate-800">{app.doctorName}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-emerald-600 text-sm font-medium mb-2">{app.specialty}</p>
                  
                  {app.patientLocation && (
                    <div className="mb-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold text-slate-600">From:</span> {app.patientLocation.address}
                      </div>
                      <button 
                        onClick={() => setSelectedJourneyApp(app)}
                        className="text-left text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest mt-1 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        View Journey Map
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {app.outcomeMetrics && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {app.outcomeMetrics.healthGainScore}% Health Gain
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Journey Modal */}
      {selectedJourneyApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-bold text-slate-800">Patient Journey Intelligence</h3>
                   <p className="text-sm text-slate-500">Mapping tactical route and predicted health outcome vector for {selectedJourneyApp.doctorName}.</p>
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
                            <p className="text-xs text-slate-500">{selectedJourneyApp.specialty}</p>
                         </div>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Logistics Metrics</h4>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-white p-4 rounded-2xl border border-slate-200">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Distance</p>
                            <p className="text-lg font-bold text-slate-800">{selectedJourneyApp.outcomeMetrics?.distanceKm} km</p>
                         </div>
                         <div className="bg-white p-4 rounded-2xl border border-slate-200">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Est. Time</p>
                            <p className="text-lg font-bold text-slate-800">{selectedJourneyApp.outcomeMetrics?.travelTimeMin} min</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-blue-100 mt-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                           </svg>
                        </div>
                        <h5 className="font-bold text-sm">Outcome Vector</h5>
                      </div>
                      <p className="text-xs text-blue-100 leading-relaxed mb-4">
                        Gemini predicts a <span className="text-white font-bold">{selectedJourneyApp.outcomeMetrics?.healthGainScore}% efficiency boost</span> in clinical recovery post-visit.
                      </p>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-white h-full" style={{ width: `${selectedJourneyApp.outcomeMetrics?.healthGainScore}%` }}></div>
                      </div>
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