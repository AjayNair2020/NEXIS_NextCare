
export type Role = 'SUPER_ADMIN' | 'CLINICAL_LEAD' | 'LOGISTICS_CHIEF' | 'PATIENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
}

export type DynamicRACI = {
  [key in keyof RACIMapping]: Role[];
};

export interface RACIMapping {
  dashboard: Role[];
  assistant: Role[];
  appointments: Role[];
  operations: Role[];
  strategy: Role[];
  map: Role[];
  taxonomy: Role[];
  profile: Role[];
  rbac: Role[];
  planning: Role[];
  supplyChain: Role[];
  preventiveHealth: Role[];
}

export interface ProgramTask {
  id: string;
  name: string;
  menuId: string;
  startDay: number; // 0 (Mon) to 6 (Sun)
  durationDays: number;
  status: 'completed' | 'in-progress' | 'scheduled';
  progress: number;
  owner: string;
}

export interface EHRRecord {
  id: string;
  patientId: string;
  type: 'condition' | 'medication' | 'lab' | 'immunization' | 'procedure' | 'visit';
  title: string;
  date: string;
  status: 'active' | 'resolved' | 'final' | 'completed' | 'pending';
  provider: string;
  facility: string;
  notes?: string;
  value?: string; // Lab results value
  unit?: string;  // Lab results unit
  referenceRange?: string; // Lab reference range
}

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

export interface AdherenceLog {
  timestamp: string;
  status: 'taken' | 'skipped' | 'late';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  remaining: number;
  totalQuantity: number;
  nextDose: string;
  adherenceHistory?: AdherenceLog[];
  category?: 'maintenance' | 'acute' | 'supplement';
}

export interface SecurityProtocol {
  id: string;
  name: string;
  status: 'active' | 'certified' | 'monitoring';
  description: string;
  standard: 'HIPAA' | 'PII' | 'AES-256' | 'GDPR' | 'SOC2';
}

export interface ReminderSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  minutesBefore: number;
  lastSent?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  patientLocation?: { lat: number; lng: number; address: string };
  outcomeMetrics?: {
    distanceKm: number;
    travelTimeMin: number;
    healthGainScore: number;
    predictedRecoveryBoost: string;
  };
  reminderSettings?: ReminderSettings;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  location: { lat: number; lng: number };
  facilityId?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'logistics' | 'hub';
  lat: number;
  lng: number;
  status?: string;
  capacity?: number;
  storageLevel?: number; // 0-100
  connectedHubId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'pharma' | 'equipment' | 'supply';
  quantity: number;
  unit: string;
  status: 'optimal' | 'low' | 'critical';
  locationId: string;
  lastRestocked: string;
}

export interface ProductionOrder {
  id: string;
  itemName: string;
  quantity: number;
  status: 'pending' | 'in-production' | 'completed' | 'shipped';
  priority: 'low' | 'medium' | 'high';
  eta: string;
}

export interface Fulfillment {
  id: string;
  orderId: string;
  destinationFacilityId: string;
  status: 'processing' | 'in-transit' | 'delivered';
  shippedAt?: string;
  carrier: string;
}

export interface MaintenanceLog {
  date: string;
  description: string;
  technician: string;
}

export interface TransportVehicle {
  id: string;
  type: 'ambulance' | 'logistics-truck' | 'rapid-response';
  plate: string;
  status: 'available' | 'en-route' | 'maintenance';
  lat: number;
  lng: number;
  currentPayload?: string;
  driverName?: string;
  lastMaintenanceDate?: string;
  maintenanceLogs?: MaintenanceLog[];
}

export interface OperationalService {
  id: string;
  name: string;
  facilityId: string;
  status: 'active' | 'limited' | 'offline';
  specialty: string;
}

export interface OptimizationScenario {
  id: string;
  name: string;
  type: 'surge' | 'shortage' | 'disruption' | 'routine';
  description: string;
  variables: {
    expectedInflow: number;
    staffingLevel: number;
    supplyChainStability: number;
  };
  aiRecommendations?: {
    strategy: string;
    resourceShift: string;
    efficiencyGain: number;
  };
}

export interface ServiceArea {
  id: string;
  name: string;
  responsibleFacilityId: string;
  populationServed: number;
  criticalIncidentCount: number;
  avgResponseTimeMin: number;
  efficiencyScore: number;
  lat: number;
  lng: number;
  radius: number; // in meters
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
  lat: number;
  lng: number;
  medicalHistory: string;
  allergies: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  emergencyContact: EmergencyContact;
  isPrimary: boolean;
  assignedDoctorId?: string;
  incidentId?: string;
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
  originId?: string;
  causalFactor?: string;
  taxonomyId?: string;
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

export type LineageRelationship = 'CARE' | 'SUPPLY' | 'SPREAD' | 'AFFECTED' | 'ASSIGNMENT' | 'KNOWLEDGE';
