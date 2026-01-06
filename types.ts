
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
  PHARMACIST = 'Pharmacist',
  RECEPTIONIST = 'Receptionist',
  ACCOUNTANT = 'Accountant',
  PATIENT = 'Patient'
}

export enum AppointmentSource {
  ONLINE = 'Online',
  WALK_IN = 'Walk-in'
}

export enum BillingCategory {
  OPD = 'OPD Consultation',
  IPD = 'IPD Admission',
  LAB = 'Laboratory',
  RADIOLOGY = 'Radiology',
  PHARMACY = 'Pharmacy',
  INSURANCE = 'Insurance Claim'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Settings & Security Types
export interface HospitalSettings {
  name: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logoUrl?: string;
  opdTimings: string;
}

export interface EmergencyNumber {
  id: string;
  label: string;
  number: string;
  department: string;
}

export interface PaymentGateway {
  id: string;
  provider: string;
  merchantId: string;
  status: 'Active' | 'Inactive' | 'Testing';
  methods: string[];
}

export interface BackupLog {
  id: string;
  timestamp: string;
  size: string;
  status: 'Success' | 'Failed';
  type: 'Automated' | 'Manual';
}

export interface SecuritySetting {
  id: string;
  label: string;
  description: string;
  isEnabled: boolean;
  category: 'Access' | 'Data' | 'Network';
}

// Communication System Types
export interface InternalAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  targetAudience: 'All Staff' | 'Doctors' | 'Nurses' | 'Admin';
  date: string;
  author: string;
}

export interface SMSLog {
  id: string;
  patientName: string;
  phoneNumber: string;
  message: string;
  status: 'Sent' | 'Delivered' | 'Failed';
  timestamp: string;
  type: 'Appointment' | 'Billing' | 'General';
}

export interface EmailLog {
  id: string;
  patientName?: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  content: string;
  status: 'Sent' | 'Opened' | 'Bounced' | 'Received';
  timestamp: string;
  direction: 'Incoming' | 'Outgoing';
  type: 'Lab Result' | 'Prescription' | 'Newsletter' | 'General';
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
}

export interface CMSBlog {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  status: 'Published' | 'Draft';
}

export interface CMSSlider {
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
}

export interface CMSSEOSetting {
  id: string;
  pageName: string;
  titleTag: string;
  metaDescription: string;
  keywords: string;
}

// Analytics Types
export interface PatientGrowthEntry {
  month: string;
  newPatients: number;
  discharges: number;
}

export interface CustomReport {
  id: string;
  name: string;
  type: 'Revenue' | 'Clinical' | 'Operational';
  dateRange: string;
  filters: string;
  createdBy: string;
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

export interface PharmacyItem {
  id: string;
  name: string;
  category: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Other';
  stock: number;
  minStockLevel: number;
  price: number;
  expiryDate: string;
  supplierId: string;
}

export interface PharmacySale {
  id: string;
  patientName: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  date: string;
  paymentStatus: 'Paid' | 'Pending';
}

export interface PharmacySupplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface InsurancePanel {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  settlementPeriod: number; // Days
  status: 'Active' | 'Inactive';
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  patientName: string;
  panelId: string;
  panelName: string;
  invoiceId: string;
  claimAmount: number;
  approvedAmount?: number;
  status: 'Pending' | 'Approved' | 'Settled' | 'Rejected';
  submissionDate: string;
  settlementDate?: string;
  remarks?: string;
}

export interface PatientCoverage {
  id: string;
  patientId: string;
  panelId: string;
  policyNumber: string;
  totalLimit: number;
  consumedLimit: number;
  expiryDate: string;
  status: 'Verified' | 'Expired' | 'Pending Verification';
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  category: BillingCategory;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Cancelled';
  paymentMethod: 'Cash' | 'Card' | 'Insurance' | 'UPI';
  insuranceProvider?: string;
  insuranceStatus?: 'Pending' | 'Approved' | 'Rejected';
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
  // CMS Fields
  publicBio?: string;
  displayOnWeb?: boolean;
  profileImage?: string;
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
