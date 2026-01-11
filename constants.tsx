
import { HealthMetric, Appointment, Medication, PatientProfile, Doctor, HealthIncident, TaxonomyNode, Facility, InventoryItem, TransportVehicle, OperationalService, ServiceArea, OptimizationScenario, SecurityProtocol, DynamicRACI, Role } from './types';

export const SUPER_ADMIN_EMAIL = "ajaybinduarti@gmail.com";

export const INITIAL_RACI: DynamicRACI = {
  dashboard: ['SUPER_ADMIN', 'CLINICAL_LEAD', 'LOGISTICS_CHIEF', 'PATIENT'],
  assistant: ['SUPER_ADMIN', 'CLINICAL_LEAD', 'PATIENT'],
  appointments: ['SUPER_ADMIN', 'CLINICAL_LEAD', 'PATIENT'],
  operations: ['SUPER_ADMIN', 'LOGISTICS_CHIEF'],
  strategy: ['SUPER_ADMIN', 'CLINICAL_LEAD', 'LOGISTICS_CHIEF'],
  map: ['SUPER_ADMIN', 'CLINICAL_LEAD', 'LOGISTICS_CHIEF'],
  taxonomy: ['SUPER_ADMIN', 'CLINICAL_LEAD'],
  profile: ['SUPER_ADMIN', 'PATIENT'],
  rbac: ['SUPER_ADMIN']
};

export const MOCK_FACILITIES: Facility[] = [
  { id: 'fac-1', name: 'UCSF Medical Center', type: 'hospital', lat: 37.7631, lng: -122.4578, status: '92% Occupancy', capacity: 500, storageLevel: 85, connectedHubId: 'log-1' },
  { id: 'fac-2', name: 'Zuckerberg SF General', type: 'hospital', lat: 37.7558, lng: -122.4047, status: 'Critical Load', capacity: 400, storageLevel: 60, connectedHubId: 'log-2' },
  { id: 'fac-3', name: 'Walgreens Pharmacy Hub', type: 'pharmacy', lat: 37.7712, lng: -122.4344, status: 'Active Dispatch', connectedHubId: 'log-1', storageLevel: 45 },
  { id: 'fac-4', name: 'Mission Health Clinic', type: 'hospital', lat: 37.7599, lng: -122.4148, status: 'Nominal', storageLevel: 90, connectedHubId: 'log-1' },
  { id: 'log-1', name: 'Bay Area Med Logistics', type: 'logistics', lat: 37.7831, lng: -122.4182, status: 'Full Stock', storageLevel: 95 },
  { id: 'log-2', name: 'South SF Supply Hub', type: 'logistics', lat: 37.7411, lng: -122.3965, status: 'Emergency Protocol', storageLevel: 30 },
];

export const MOCK_SERVICE_AREAS: ServiceArea[] = [
  { id: 'sa-1', name: 'Mission / Castro District', responsibleFacilityId: 'fac-4', populationServed: 45000, criticalIncidentCount: 12, avgResponseTimeMin: 8.2, efficiencyScore: 88, lat: 37.7600, lng: -122.4200, radius: 1500 },
  { id: 'sa-2', name: 'Financial District', responsibleFacilityId: 'fac-1', populationServed: 25000, criticalIncidentCount: 3, avgResponseTimeMin: 12.5, efficiencyScore: 92, lat: 37.7900, lng: -122.4000, radius: 1000 },
  { id: 'sa-3', name: 'SoMa / Market', responsibleFacilityId: 'fac-2', populationServed: 38000, criticalIncidentCount: 22, avgResponseTimeMin: 15.4, efficiencyScore: 65, lat: 37.7750, lng: -122.4100, radius: 1800 },
];

export const MOCK_SCENARIOS: OptimizationScenario[] = [
  {
    id: 'scen-1',
    name: 'H1N1 Community Surge',
    type: 'surge',
    description: 'A 40% increase in respiratory complaints in the SoMa district over 48 hours.',
    variables: { expectedInflow: 140, staffingLevel: 85, supplyChainStability: 90 },
    aiRecommendations: {
      strategy: 'Activate secondary triage in Mission Clinic; redirect non-emergency cardiac from General to UCSF.',
      resourceShift: 'Move 500 units of Amoxicillin from Hub 1 to Pharmacy Hub 3.',
      efficiencyGain: 22
    }
  },
  {
    id: 'scen-2',
    name: 'Logistics Node Maintenance',
    type: 'disruption',
    description: 'Planned maintenance on Bay Area Med Logistics Hub reduces dispatch capacity by 50%.',
    variables: { expectedInflow: 100, staffingLevel: 100, supplyChainStability: 50 },
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Insulin Glargine', category: 'pharma', quantity: 450, unit: 'vials', status: 'optimal', locationId: 'fac-3', lastRestocked: '2023-10-15' },
  { id: 'inv-2', name: 'Amoxicillin 500mg', category: 'pharma', quantity: 120, unit: 'packs', status: 'low', locationId: 'fac-3', lastRestocked: '2023-09-20' },
  { id: 'inv-3', name: 'Ventilator G-Series', category: 'equipment', quantity: 12, unit: 'units', status: 'critical', locationId: 'fac-1', lastRestocked: '2023-08-10' },
  { id: 'inv-4', name: 'Portable MRI', category: 'equipment', quantity: 2, unit: 'units', status: 'optimal', locationId: 'fac-2', lastRestocked: '2023-07-05' },
  { id: 'inv-5', name: 'Surgical Gloves', category: 'supply', quantity: 5000, unit: 'pairs', status: 'optimal', locationId: 'log-1', lastRestocked: '2023-10-18' },
];

export const MOCK_TRANSPORTS: TransportVehicle[] = [
  { 
    id: 'v-1', 
    type: 'ambulance', 
    plate: 'MED-012', 
    status: 'en-route', 
    lat: 37.7680, 
    lng: -122.4300, 
    currentPayload: 'Critical Cardiac Patient',
    driverName: 'Officer Marcus Wright',
    lastMaintenanceDate: '2023-09-12',
    maintenanceLogs: [
      { date: '2023-09-12', description: 'Brake pad replacement and oil change.', technician: 'Robert S.' },
      { date: '2023-06-05', description: 'Tire rotation and signal lighting check.', technician: 'Marcus K.' }
    ]
  },
  { 
    id: 'v-2', 
    type: 'ambulance', 
    plate: 'MED-045', 
    status: 'available', 
    lat: 37.7558, 
    lng: -122.4047,
    driverName: 'Nurse Elena Rodriguez',
    lastMaintenanceDate: '2023-10-01',
    maintenanceLogs: [
      { date: '2023-10-01', description: 'Full medical inventory restock and sanitization.', technician: 'Hospital Team A' }
    ]
  },
  { 
    id: 'v-3', 
    type: 'logistics-truck', 
    plate: 'LOG-772', 
    status: 'available', 
    lat: 37.7831, 
    lng: -122.4182,
    driverName: 'David H. Thompson',
    lastMaintenanceDate: '2023-08-20',
    maintenanceLogs: [
      { date: '2023-08-20', description: 'Engine diagnostic and transmission fluid flush.', technician: 'SF Fleet Service' }
    ]
  },
  { 
    id: 'v-4', 
    type: 'rapid-response', 
    plate: 'RRP-003', 
    status: 'maintenance', 
    lat: 37.7411, 
    lng: -122.3965,
    driverName: 'Technician Sarah Miller',
    lastMaintenanceDate: '2023-10-18',
    maintenanceLogs: [
      { date: '2023-10-18', description: 'Emergency electrical system repair.', technician: 'Sarah Miller (Self)' }
    ]
  },
];

export const MOCK_SERVICES: OperationalService[] = [
  { id: 'srv-1', name: 'Trauma Unit Level 1', facilityId: 'fac-1', status: 'active', specialty: 'Emergency' },
  { id: 'srv-2', name: 'Radiology & Diagnostics', facilityId: 'fac-2', status: 'limited', specialty: 'Imaging' },
  { id: 'srv-3', name: 'Cold-Chain Pharmacy', facilityId: 'fac-3', status: 'active', specialty: 'Distribution' },
];

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', image: 'https://i.pravatar.cc/150?u=d1', location: { lat: 37.7631, lng: -122.4578 }, facilityId: 'fac-1' },
  { id: 'd2', name: 'Dr. Michael Chen', specialty: 'General Physician', image: 'https://i.pravatar.cc/150?u=d2', location: { lat: 37.7558, lng: -122.4047 }, facilityId: 'fac-2' },
  { id: 'd3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', image: 'https://i.pravatar.cc/150?u=d3', location: { lat: 37.7712, lng: -122.4344 }, facilityId: 'fac-3' },
  { id: 'd4', name: 'Dr. James Wilson', specialty: 'Neurologist', image: 'https://i.pravatar.cc/150?u=d4', location: { lat: 37.7831, lng: -122.4182 }, facilityId: 'fac-1' },
];

export const MOCK_PATIENTS: PatientProfile[] = [
  {
    id: 'p-1',
    fullName: 'Alex Thompson',
    dob: '1990-05-12',
    gender: 'Male',
    bloodType: 'A+',
    email: 'alex.t@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Health Ave, SF',
    lat: 37.7749,
    lng: -122.4194,
    medicalHistory: 'Mild hypertension',
    allergies: 'Peanuts',
    insuranceProvider: 'BlueCross',
    policyNumber: 'BCS-992',
    groupNumber: 'GRP-55',
    isPrimary: true,
    assignedDoctorId: 'd1',
    incidentId: 'inc-1',
    emergencyContact: { name: 'Sarah', relationship: 'Spouse', phone: '555-0101' }
  },
  {
    id: 'p-2',
    fullName: 'Jordan Lee',
    dob: '1985-11-20',
    gender: 'Non-binary',
    bloodType: 'O-',
    email: 'jordan.l@example.com',
    phone: '+1 (555) 444-5555',
    address: '456 Mission St, SF',
    lat: 37.7588,
    lng: -122.4121,
    medicalHistory: 'Asthma',
    allergies: 'None',
    insuranceProvider: 'Kaiser',
    policyNumber: 'KAI-881',
    groupNumber: 'GRP-12',
    isPrimary: false,
    assignedDoctorId: 'd2',
    incidentId: 'inc-3',
    emergencyContact: { name: 'Pat', relationship: 'Partner', phone: '555-0202' }
  }
];

export const MOCK_INCIDENTS: HealthIncident[] = [
  {
    id: 'inc-1',
    type: 'Seasonal Influenza (H1N1)',
    severity: 'medium',
    status: 'monitoring',
    lat: 37.7749,
    lng: -122.4194,
    description: 'Initial cluster detected at public transit hub.',
    detectedAt: '2023-10-01',
    cases: 12,
    causalFactor: 'Viral / Transmission',
    taxonomyId: 'tax-3-1'
  },
  {
    id: 'inc-2',
    type: 'Seasonal Influenza (H1N1)',
    severity: 'high',
    status: 'spreading',
    lat: 37.7858,
    lng: -122.4008,
    description: 'Secondary cluster in Financial District.',
    detectedAt: '2023-10-05',
    cases: 45,
    originId: 'inc-1',
    causalFactor: 'Commuter Spread',
    taxonomyId: 'tax-3-1'
  },
  {
    id: 'inc-3',
    type: 'Seasonal Influenza (H1N1)',
    severity: 'critical',
    status: 'spreading',
    lat: 37.7612,
    lng: -122.4344,
    description: 'Community outbreak in Mission District.',
    detectedAt: '2023-10-12',
    cases: 128,
    originId: 'inc-2',
    causalFactor: 'Localized Community Spread',
    taxonomyId: 'tax-3-1'
  }
];

export const MOCK_TAXONOMY: TaxonomyNode[] = [
  {
    id: 'tax-1',
    name: 'Infectious Diseases',
    description: 'Viral and Bacterial outbreaks.',
    category: 'infectious',
    children: [
      {
        id: 'tax-3-1',
        name: 'Influenza (Flu)',
        description: 'Viral respiratory infection.',
        parentId: 'tax-1',
        category: 'infectious'
      }
    ]
  }
];

export const MOCK_HEALTH_METRICS: HealthMetric[] = [
  { date: 'Mon', heartRate: 72, bloodPressure: 118, steps: 8400, sleep: 7.2 },
  { date: 'Tue', heartRate: 75, bloodPressure: 120, steps: 10200, sleep: 6.8 },
  { date: 'Wed', heartRate: 70, bloodPressure: 115, steps: 7800, sleep: 8.1 },
  { date: 'Thu', heartRate: 78, bloodPressure: 122, steps: 11000, sleep: 7.5 },
  { date: 'Fri', heartRate: 74, bloodPressure: 119, steps: 9500, sleep: 7.9 },
  { date: 'Sat', heartRate: 68, bloodPressure: 116, steps: 12500, sleep: 8.5 },
  { date: 'Sun', heartRate: 71, bloodPressure: 117, steps: 6000, sleep: 8.2 },
];

export const MOCK_MEDICATIONS: Medication[] = [
  { 
    id: 'm1', 
    name: 'Lisinopril', 
    dosage: '10mg', 
    frequency: 'Once Daily', 
    remaining: 14, 
    totalQuantity: 30, 
    nextDose: '09:00 AM',
    category: 'maintenance',
    adherenceHistory: [
      { timestamp: '2023-10-20T09:05:00', status: 'taken' },
      { timestamp: '2023-10-21T09:12:00', status: 'taken' },
      { timestamp: '2023-10-22T10:30:00', status: 'late' },
    ]
  },
  { 
    id: 'm2', 
    name: 'Vitamin D3', 
    dosage: '2000 IU', 
    frequency: 'Every Morning', 
    remaining: 45, 
    totalQuantity: 60, 
    nextDose: '08:30 AM',
    category: 'supplement',
    adherenceHistory: [
      { timestamp: '2023-10-20T08:35:00', status: 'taken' },
      { timestamp: '2023-10-21T08:32:00', status: 'taken' },
      { timestamp: '2023-10-22T08:45:00', status: 'taken' },
    ]
  },
];

export const MOCK_SECURITY_PROTOCOLS: SecurityProtocol[] = [
  { 
    id: 'sec-1', 
    name: 'HIPAA Compliance', 
    status: 'certified', 
    standard: 'HIPAA',
    description: 'All Personal Health Information (PHI) is encrypted at rest and in transit.'
  },
  { 
    id: 'sec-2', 
    name: 'AES-256 Storage', 
    status: 'active', 
    standard: 'AES-256',
    description: 'Military-grade encryption for local database and cloud sync.'
  },
  { 
    id: 'sec-3', 
    name: 'PII Shield', 
    status: 'monitoring', 
    standard: 'PII',
    description: 'Strict access controls and audit logging for Personally Identifiable Information.'
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    date: '2023-10-24',
    time: '10:30 AM',
    status: 'upcoming',
    patientLocation: { lat: 37.7749, lng: -122.4194, address: 'Home (Mission St)' },
    outcomeMetrics: {
      distanceKm: 4.2,
      travelTimeMin: 15,
      healthGainScore: 85,
      predictedRecoveryBoost: 'Optimization of treatment plan based on latest diagnostic tools available at the facility.'
    }
  }
];
