
import React, { useState } from 'react';
import { PatientProfile, EmergencyContact } from '../types';
// Fixed: changed MOCK_PROFILES to MOCK_PATIENTS as exported from constants.tsx
import { MOCK_PATIENTS } from '../constants';

const ProfileManager: React.FC = () => {
  // Fixed: use MOCK_PATIENTS instead of MOCK_PROFILES
  const [profiles, setProfiles] = useState<PatientProfile[]>(MOCK_PATIENTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialFormState: PatientProfile = {
    id: '',
    fullName: '',
    dob: '',
    gender: '',
    bloodType: '',
    email: '',
    phone: '',
    address: '',
    // Fixed: added missing lat and lng properties required by PatientProfile interface
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

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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
          {/* Section: Basic Information */}
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

          {/* Section: Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address</label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Insurance */}
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Insurance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
                <input 
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={e => setFormData({...formData, insuranceProvider: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Policy Number</label>
                <input 
                  type="text"
                  value={formData.policyNumber}
                  onChange={e => setFormData({...formData, policyNumber: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Group Number</label>
                <input 
                  type="text"
                  value={formData.groupNumber}
                  onChange={e => setFormData({...formData, groupNumber: e.target.value})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Medical History */}
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Medical Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medical History</label>
                <textarea 
                  rows={3}
                  value={formData.medicalHistory}
                  onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                  placeholder="Chronic conditions, past surgeries, etc."
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
                <textarea 
                  rows={3}
                  value={formData.allergies}
                  onChange={e => setFormData({...formData, allergies: e.target.value})}
                  placeholder="Drug or food allergies..."
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Emergency Contact */}
          <div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input 
                  type="text" required
                  value={formData.emergencyContact.name}
                  onChange={e => setFormData({...formData, emergencyContact: {...formData.emergencyContact, name: e.target.value}})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                <input 
                  type="text" required
                  value={formData.emergencyContact.relationship}
                  onChange={e => setFormData({...formData, emergencyContact: {...formData.emergencyContact, relationship: e.target.value}})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" required
                  value={formData.emergencyContact.phone}
                  onChange={e => setFormData({...formData, emergencyContact: {...formData.emergencyContact, phone: e.target.value}})}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

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
          <h2 className="text-2xl font-bold text-slate-800">Health Profiles</h2>
          <p className="text-slate-500">Manage medical records for yourself and family members.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all overflow-hidden group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl">
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
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {profile.phone}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex gap-3">
              <button 
                onClick={() => handleEdit(profile)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
              >
                Edit Details
              </button>
              <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Empty State Card */}
        <button 
          onClick={handleAdd}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition-all group"
        >
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="font-semibold">Add New Member</p>
        </button>
      </div>
    </div>
  );
};

export default ProfileManager;
