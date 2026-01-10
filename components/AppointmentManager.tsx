
import React, { useState } from 'react';
import { Appointment, Doctor } from '../types';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '../constants';

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoctor = MOCK_DOCTORS.find(d => d.id === formData.doctorId);
    if (!selectedDoctor) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: formData.date,
      time: formData.time,
      status: 'upcoming',
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setIsBooking(false);
    setFormData({ doctorId: '', date: '', time: '' });
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
          <p className="text-slate-500">View and manage your scheduled medical visits.</p>
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
              <h3 className="text-xl font-bold text-slate-800">Book New Appointment</h3>
              <p className="text-sm text-slate-500">Choose your provider and preferred time slot.</p>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Specialist</label>
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
                      type="radio" 
                      name="doctor" 
                      value={doctor.id}
                      required
                      className="hidden"
                      onChange={() => setFormData({...formData, doctorId: doctor.id})}
                    />
                    <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <p className="font-bold text-slate-800">{doctor.name}</p>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{doctor.specialty}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                <select 
                  required
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">Choose a time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setIsBooking(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
              >
                Confirm Booking
              </button>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-slate-800">{app.doctorName}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-emerald-600 text-sm font-medium mb-4">{app.specialty}</p>
                  
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {app.time}
                    </div>
                  </div>
                </div>
              </div>
              
              {app.status === 'upcoming' && (
                <div className="mt-6 pt-4 border-t border-slate-50 flex gap-3">
                  <button className="flex-1 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors py-2 uppercase tracking-wider">
                    Reschedule
                  </button>
                  <button className="flex-1 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors py-2 uppercase tracking-wider">
                    Cancel visit
                  </button>
                </div>
              )}
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No appointments found</p>
              <button 
                onClick={() => setIsBooking(true)}
                className="mt-4 text-emerald-500 font-bold hover:underline"
              >
                Book your first visit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;
