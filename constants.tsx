
import { HealthMetric, Appointment, Medication, PatientProfile, Doctor, HealthIncident, TaxonomyNode } from './types';

export const MOCK_HEALTH_METRICS: HealthMetric[] = [
  { date: 'Mon', heartRate: 72, bloodPressure: 118, steps: 8400, sleep: 7.2 },
  { date: 'Tue', heartRate: 75, bloodPressure: 120, steps: 10200, sleep: 6.8 },
  { date: 'Wed', heartRate: 70, bloodPressure: 115, steps: 7800, sleep: 8.1 },
  { date: 'Thu', heartRate: 78, bloodPressure: 122, steps: 11000, sleep: 7.5 },
  { date: 'Fri', heartRate: 74, bloodPressure: 119, steps: 9500, sleep: 7.9 },
  { date: 'Sat', heartRate: 68, bloodPressure: 116, steps: 12500, sleep: 8.5 },
  { date: 'Sun', heartRate: 71, bloodPressure: 117, steps: 6000, sleep: 8.2 },
];

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', image: 'https://i.pravatar.cc/150?u=d1' },
  { id: 'd2', name: 'Dr. Michael Chen', specialty: 'General Physician', image: 'https://i.pravatar.cc/150?u=d2' },
  { id: 'd3', name: 'Dr. Emily Rodriguez', specialty: 'Dermatologist', image: 'https://i.pravatar.cc/150?u=d3' },
  { id: 'd4', name: 'Dr. James Wilson', specialty: 'Neurologist', image: 'https://i.pravatar.cc/150?u=d4' },
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
  },
  {
    id: '2',
    doctorId: 'd2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'General Physician',
    date: '2023-10-15',
    time: '02:00 PM',
    status: 'completed',
  },
];

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'm1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once Daily',
    remaining: 14,
  },
  {
    id: 'm2',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Every Morning',
    remaining: 45,
  },
];

export const MOCK_PROFILES: PatientProfile[] = [
  {
    id: 'p1',
    fullName: 'Alex Thompson',
    dob: '1990-05-12',
    gender: 'Male',
    bloodType: 'A+',
    email: 'alex.t@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Health Ave, Wellness City, CA 90210',
    medicalHistory: 'Mild hypertension, seasonal allergies.',
    allergies: 'Peanuts, Penicillin',
    insuranceProvider: 'BlueCross Shield',
    policyNumber: 'BCS-9920331',
    groupNumber: 'GRP-552',
    isPrimary: true,
    emergencyContact: {
      name: 'Sarah Thompson',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
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
    description: 'Secondary cluster in Financial District office complex.',
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
    description: 'Community outbreak in residential Mission District.',
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
    description: 'Disorders caused by organisms — such as bacteria, viruses, fungi or parasites.',
    category: 'infectious',
    children: [
      {
        id: 'tax-2',
        name: 'Respiratory Infections',
        description: 'Infectious diseases that affect the respiratory system.',
        parentId: 'tax-1',
        category: 'infectious',
        children: [
          {
            id: 'tax-3-1',
            name: 'Influenza (Flu)',
            description: 'A viral infection that attacks your respiratory system — your nose, throat and lungs.',
            parentId: 'tax-2',
            category: 'infectious'
          },
          {
            id: 'tax-3-2',
            name: 'Pneumonia',
            description: 'Infection that inflames air sacs in one or both lungs, which may fill with fluid.',
            parentId: 'tax-2',
            category: 'infectious'
          }
        ]
      },
      {
        id: 'tax-4',
        name: 'Vector-borne Diseases',
        description: 'Diseases transmitted by vectors such as mosquitoes or ticks.',
        parentId: 'tax-1',
        category: 'infectious',
        children: [
          {
            id: 'tax-4-1',
            name: 'Malaria',
            description: 'A disease caused by a parasite, transmitted by the bite of infected mosquitoes.',
            parentId: 'tax-4',
            category: 'infectious'
          }
        ]
      }
    ]
  },
  {
    id: 'tax-5',
    name: 'Environmental Health',
    description: 'Health impacts of the physical, chemical, and biological factors external to a person.',
    category: 'environmental',
    children: [
      {
        id: 'tax-6',
        name: 'Pollution Related',
        description: 'Illnesses caused by exposure to pollutants in air, water, or soil.',
        parentId: 'tax-5',
        category: 'environmental',
        children: [
          {
            id: 'tax-6-1',
            name: 'Asthma Exacerbation',
            description: 'Worsening of asthma symptoms due to particulate matter or ozone.',
            parentId: 'tax-6',
            category: 'environmental'
          }
        ]
      }
    ]
  }
];
