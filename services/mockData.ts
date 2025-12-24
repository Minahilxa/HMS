
import { Patient, Appointment, Doctor, PatientStatus, EmergencyCase, RevenueData, User, UserRole, LeaveRequest, DoctorPerformance, EHRRecord, Prescription, AppointmentSource, HospitalDepartment, HospitalService, TimeSlot, LabTest, LabSample, AccessHistory, RadiologyOrder } from '../types';

export const mockUsers: User[] = [
  { id: 'U1', name: 'John Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN },
  { id: 'U2', name: 'Dr. Sarah Wilson', email: 'sarah.w@healsync.com', role: UserRole.DOCTOR },
  { id: 'U3', name: 'Robert Accountant', email: 'robert.a@healsync.com', role: UserRole.ACCOUNTANT },
  { id: 'U4', name: 'Nurse Joy', email: 'joy.n@healsync.com', role: UserRole.NURSE },
  { id: 'U5', name: 'Mark Lab', email: 'mark.l@healsync.com', role: UserRole.LAB_TECH },
  { id: 'U6', name: 'Alice Reception', email: 'alice.r@healsync.com', role: UserRole.RECEPTIONIST },
];

export const mockLabTests: LabTest[] = [
  { id: 'LT1', name: 'CBC (Complete Blood Count)', category: 'Hematology', price: 25, description: 'Measures blood components like RBC, WBC, and Platelets.' },
  { id: 'LT2', name: 'Lipid Profile', category: 'Biochemistry', price: 40, description: 'Tests for cholesterol and triglycerides.' },
  { id: 'LT3', name: 'Blood Glucose (Fasting)', category: 'Biochemistry', price: 15, description: 'Tests blood sugar levels after fasting.' },
  { id: 'LT4', name: 'COVID-19 RT-PCR', category: 'Virology', price: 60, description: 'Molecular test for SARS-CoV-2 detection.' },
];

export const mockLabSamples: LabSample[] = [
  { id: 'LS1', patientId: '1', patientName: 'John Doe', testId: 'LT1', testName: 'CBC', collectionDate: '2024-05-21', status: 'Completed', result: 'WBC: 7.5k, RBC: 5.2M, PLT: 240k' },
  { id: 'LS2', patientId: '2', patientName: 'Jane Smith', testId: 'LT2', testName: 'Lipid Profile', collectionDate: '2024-05-22', status: 'In Progress' },
  { id: 'LS3', patientId: '3', patientName: 'Robert Brown', testId: 'LT3', testName: 'Blood Glucose', collectionDate: '2024-05-22', status: 'Pending' },
];

export const mockRadiologyOrders: RadiologyOrder[] = [
  { id: 'RAD1', patientId: '1', patientName: 'John Doe', type: 'X-Ray', bodyPart: 'Chest PA', priority: 'STAT', status: 'Completed', requestDate: '2024-05-21', radiologistNotes: 'Clear lungs, normal cardiac silhouette.', reportUrl: 'rep_001.pdf' },
  { id: 'RAD2', patientId: '2', patientName: 'Jane Smith', type: 'MRI', bodyPart: 'Brain w/ Contrast', priority: 'Urgent', status: 'Scheduled', requestDate: '2024-05-22' },
  { id: 'RAD3', patientId: '3', patientName: 'Robert Brown', type: 'CT Scan', bodyPart: 'Abdomen/Pelvis', priority: 'Routine', status: 'Requested', requestDate: '2024-05-22' },
];

export const mockAccessHistory: AccessHistory[] = [
  { id: 'AH1', patientName: 'John Doe', action: 'Report Viewed', timestamp: '2024-05-21 04:30 PM', device: 'Chrome on MacOS' },
  { id: 'AH2', patientName: 'Jane Smith', action: 'Login', timestamp: '2024-05-22 09:15 AM', device: 'Safari on iPhone' },
  { id: 'AH3', patientName: 'John Doe', action: 'Report Downloaded', timestamp: '2024-05-21 04:35 PM', device: 'Chrome on MacOS' },
];

const generateEHR = (): EHRRecord[] => [
  { id: 'EHR1', date: '2023-12-10', condition: 'Common Cold', treatment: 'Antipyretics', notes: 'Patient had high fever but recovered well.' },
  { id: 'EHR2', date: '2024-02-15', condition: 'Type 2 Diabetes', treatment: 'Metformin', notes: 'Routine checkup. Sugar levels stable.' }
];

const generatePrescriptions = (): Prescription[] => [
  { 
    id: 'P1', date: '2024-05-20', doctorName: 'Dr. Sarah Wilson', 
    medications: [
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '3 days' },
      { name: 'Amoxicillin', dosage: '250mg', frequency: 'Thrice daily', duration: '5 days' }
    ],
    notes: 'Take after meals.'
  }
];

export const mockPatients: Patient[] = [
  { id: '1', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-20', diagnosis: 'Flu Symptoms', phone: '555-0101', email: 'john.doe@example.com', medicalHistory: generateEHR(), prescriptions: generatePrescriptions() },
  { id: '2', name: 'Jane Smith', age: 32, gender: 'Female', status: PatientStatus.IPD, room: 'A-102', admissionDate: '2024-05-18', diagnosis: 'Post-Surgery Recovery', phone: '555-0202', email: 'jane.smith@example.com', medicalHistory: [], prescriptions: [] },
  { id: '3', name: 'Robert Brown', age: 67, gender: 'Male', status: PatientStatus.IPD, room: 'B-205', admissionDate: '2024-05-15', diagnosis: 'Cardiovascular Monitoring', phone: '555-0303', medicalHistory: generateEHR(), prescriptions: generatePrescriptions() },
  { id: '4', name: 'Emily White', age: 29, gender: 'Female', status: PatientStatus.OPD, admissionDate: '2024-05-21', diagnosis: 'Skin Allergy', medicalHistory: [], prescriptions: [] },
  { id: '5', name: 'Michael Johnson', age: 54, gender: 'Male', status: PatientStatus.EMERGENCY, admissionDate: '2024-05-21', diagnosis: 'Fracture', medicalHistory: [], prescriptions: [] },
];

// Define and export mockAppointments to fix the error in apiService.ts
export const mockAppointments: Appointment[] = [
  { id: 'APT-1', patientName: 'John Doe', doctorId: 'D1', doctorName: 'Dr. Sarah Wilson', time: '10:00 AM', date: '2024-05-21', type: 'General Checkup', source: AppointmentSource.ONLINE, status: 'Scheduled' },
  { id: 'APT-2', patientName: 'Jane Smith', doctorId: 'D2', doctorName: 'Dr. James Miller', time: '11:30 AM', date: '2024-05-21', type: 'Dermatology', source: AppointmentSource.WALK_IN, status: 'Checked-in' },
  { id: 'APT-3', patientName: 'Robert Brown', doctorId: 'D1', doctorName: 'Dr. Sarah Wilson', time: '02:00 PM', date: '2024-05-21', type: 'Follow-up', source: AppointmentSource.ONLINE, status: 'Scheduled' },
];

export const mockDoctors: Doctor[] = [
  { id: 'D1', name: 'Dr. Sarah Wilson', specialization: 'General Physician', department: 'General Medicine', status: 'On Duty', room: 'Cabin 101', experience: '12 Years', schedules: [{ day: 'Monday', startTime: '09:00 AM', endTime: '02:00 PM', limit: 20 }, { day: 'Wednesday', startTime: '10:00 AM', endTime: '04:00 PM', limit: 25 }] },
  { id: 'D2', name: 'Dr. James Miller', specialization: 'Dermatologist', department: 'Dermatology', status: 'On Duty', room: 'Cabin 202', experience: '8 Years', schedules: [{ day: 'Tuesday', startTime: '08:00 AM', endTime: '12:00 PM', limit: 15 }] },
  { id: 'D3', name: 'Dr. Elena Rossi', specialization: 'Cardiologist', department: 'Cardiology', status: 'On Break', room: 'Cabin 305', experience: '15 Years' },
  { id: 'D4', name: 'Dr. David Chen', specialization: 'Pediatrician', department: 'Pediatrics', status: 'Off Duty', room: 'Cabin 108', experience: '5 Years' },
];

export const mockDepartments: HospitalDepartment[] = [
  { id: 'DEPT1', name: 'General Medicine', description: 'Primary healthcare and diagnostics.', headDoctorId: 'D1', staffCount: 15, status: 'Active' },
  { id: 'DEPT2', name: 'Cardiology', description: 'Heart related diagnostics and treatments.', headDoctorId: 'D3', staffCount: 8, status: 'Active' },
  { id: 'DEPT3', name: 'Dermatology', description: 'Skin and aesthetic treatments.', headDoctorId: 'D2', staffCount: 5, status: 'Active' },
  { id: 'DEPT4', name: 'Pediatrics', description: 'Child healthcare and immunization.', headDoctorId: 'D4', staffCount: 12, status: 'Active' },
];

export const mockServices: HospitalService[] = [
  { id: 'SERV1', name: 'Full Body Checkup', description: 'Comprehensive health screening package.', cost: 150, category: 'Diagnostic', isAvailable: true },
  { id: 'SERV2', name: 'ECG', description: 'Electrocardiogram test for heart activity.', cost: 45, category: 'Diagnostic', isAvailable: true },
  { id: 'SERV3', name: 'Laser Skin Therapy', description: 'Advanced laser treatment for various skin conditions.', cost: 200, category: 'Therapeutic', isAvailable: true },
  { id: 'SERV4', name: 'Emergency Trauma Care', description: '24/7 critical care for accidents.', cost: 500, category: 'Emergency', isAvailable: true },
];

export const mockSlots: TimeSlot[] = [
  { id: 'S1', doctorId: 'D1', day: 'Monday', startTime: '09:00 AM', endTime: '09:30 AM', isAvailable: true },
  { id: 'S2', doctorId: 'D1', day: 'Monday', startTime: '09:30 AM', endTime: '10:00 AM', isAvailable: false },
  { id: 'S3', doctorId: 'D1', day: 'Monday', startTime: '10:00 AM', endTime: '10:30 AM', isAvailable: true },
  { id: 'S4', doctorId: 'D2', day: 'Tuesday', startTime: '08:00 AM', endTime: '08:30 AM', isAvailable: true },
];

export const mockLeaves: LeaveRequest[] = [
  { id: 'L1', doctorId: 'D3', doctorName: 'Dr. Elena Rossi', type: 'Annual', startDate: '2024-06-01', endDate: '2024-06-10', reason: 'Family Vacation', status: 'Pending' },
  { id: 'L2', doctorId: 'D4', doctorName: 'Dr. David Chen', type: 'Sick', startDate: '2024-05-22', endDate: '2024-05-23', reason: 'High Fever', status: 'Approved' },
];

export const mockPerformances: DoctorPerformance[] = [
  { doctorId: 'D1', patientsSeen: 450, surgeriesPerformed: 5, rating: 4.8, attendanceRate: 98 },
  { doctorId: 'D2', patientsSeen: 320, surgeriesPerformed: 0, rating: 4.5, attendanceRate: 95 },
  { doctorId: 'D3', patientsSeen: 210, surgeriesPerformed: 12, rating: 4.9, attendanceRate: 92 },
];

export const mockEmergency: EmergencyCase[] = [
  { id: 'E1', patientName: 'Michael Johnson', arrivalType: 'Ambulance', priority: 'Critical', timestamp: '2024-05-21 08:30 AM', assignedDoctor: 'Dr. Sarah Wilson' },
  { id: 'E2', patientName: 'Linda Thompson', arrivalType: 'Walk-in', priority: 'Severe', timestamp: '2024-05-21 09:15 AM', assignedDoctor: 'Dr. Elena Rossi' },
];

export const mockRevenue: RevenueData[] = [
  { date: '2024-05-15', amount: 12500, category: 'OPD' },
  { date: '2024-05-16', amount: 45000, category: 'IPD' },
  { date: '2024-05-17', amount: 8000, category: 'Pharmacy' },
  { date: '2024-05-18', amount: 15000, category: 'OPD' },
  { date: '2024-05-19', amount: 52000, category: 'IPD' },
  { date: '2024-05-20', amount: 11000, category: 'Lab' },
  { date: '2024-05-21', amount: 25000, category: 'OPD' },
];
