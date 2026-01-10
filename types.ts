
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface HealthMetric {
  date: string;
  heartRate: number;
  bloodPressure: number;
  steps: number;
  sleep: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  remaining: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  bloodType: string;
  email: string;
  phone: string;
  address: string;
  medicalHistory: string;
  allergies: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  emergencyContact: EmergencyContact;
  isPrimary: boolean;
}

export interface HealthIncident {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'contained' | 'spreading' | 'monitoring';
  lat: number;
  lng: number;
  description: string;
  detectedAt: string;
  cases: number;
  originId?: string; // For lineage tracking
  causalFactor?: string; // e.g., "Environmental", "Viral", "Water-borne"
  taxonomyId?: string; // Link to knowledge taxonomy
}

export interface TaxonomyNode {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  children?: TaxonomyNode[];
  category: 'infectious' | 'environmental' | 'lifestyle' | 'genetic';
  icon?: string;
}
