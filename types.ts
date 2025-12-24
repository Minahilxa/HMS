
export enum PatientStatus {
  OPD = 'OPD',
  IPD = 'IPD',
  EMERGENCY = 'Emergency',
  DISCHARGED = 'Discharged'
}

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  LAB_TECH = 'Lab Technician',
  RADIOLOGIST = 'Radiologist',
  RECEPTIONIST = 'Receptionist',
  ACCOUNTANT = 'Accountant',
  PATIENT = 'Patient'
}

export enum AppointmentSource {
  ONLINE = 'Online',
  WALK_IN = 'Walk-in'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface EHRRecord {
  id: string;
  date: string;
  condition: string;
  treatment: string;
  notes: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes?: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface LabSample {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  collectionDate: string;
  status: 'Pending' | 'Collected' | 'In Progress' | 'Completed';
  result?: string;
}

export interface RadiologyOrder {
  id: string;
  patientId: string;
  patientName: string;
  type: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound';
  bodyPart: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  status: 'Requested' | 'Scheduled' | 'Completed' | 'Reported';
  requestDate: string;
  radiologistNotes?: string;
  reportUrl?: string;
}

export interface AccessHistory {
  id: string;
  patientName: string;
  action: 'Login' | 'Report Viewed' | 'Report Downloaded';
  timestamp: string;
  device: string;
}

export interface DischargeSummary {
  admissionDate: string;
  dischargeDate: string;
  finalDiagnosis: string;
  treatmentSummary: string;
  followUpInstructions: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: PatientStatus;
  room?: string;
  admissionDate: string;
  diagnosis: string;
  email?: string;
  phone?: string;
  medicalHistory: EHRRecord[];
  prescriptions: Prescription[];
  dischargeSummary?: DischargeSummary;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  time: string;
  date: string;
  type: string;
  source: AppointmentSource;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Checked-in';
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface HospitalDepartment {
  id: string;
  name: string;
  description: string;
  headDoctorId?: string;
  staffCount: number;
  status: 'Active' | 'Under Maintenance';
}

export interface HospitalService {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'Diagnostic' | 'Therapeutic' | 'Emergency' | 'Surgery';
  isAvailable: boolean;
}

export interface OPDSchedule {
  day: string;
  startTime: string;
  endTime: string;
  limit: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  status: 'On Duty' | 'Off Duty' | 'On Break';
  room: string;
  experience?: string;
  schedules?: OPDSchedule[];
}

export interface LeaveRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  type: 'Sick' | 'Casual' | 'Annual';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface DoctorPerformance {
  doctorId: string;
  patientsSeen: number;
  surgeriesPerformed: number;
  rating: number;
  attendanceRate: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  category: string;
}

export interface EmergencyCase {
  id: string;
  patientName: string;
  arrivalType: 'Ambulance' | 'Walk-in';
  priority: 'Critical' | 'Stable' | 'Severe';
  timestamp: string;
  assignedDoctor: string;
}

export interface DashboardStats {
  dailyAppointments: number;
  opdPatients: number;
  ipdPatients: number;
  emergencyCases: number;
  totalRevenue: number;
  doctorsOnDuty: number;
}
