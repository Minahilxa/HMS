
import { Patient, Appointment, Doctor, PatientStatus, EmergencyCase, RevenueData, User, UserRole, LeaveRequest, DoctorPerformance, EHRRecord, Prescription, AppointmentSource, HospitalDepartment, HospitalService, TimeSlot, LabTest, LabSample, AccessHistory, RadiologyOrder, PharmacyItem, PharmacySale, PharmacySupplier, Invoice, BillingCategory, InsurancePanel, InsuranceClaim, PatientCoverage, CMSPage, CMSBlog, CMSSlider, CMSSEOSetting, PatientGrowthEntry, CustomReport, InternalAnnouncement, SMSLog, EmailLog, HospitalSettings, EmergencyNumber, PaymentGateway, BackupLog, SecuritySetting } from '../types';

export const mockUsers: User[] = [
  { id: 'U1', name: 'John Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN },
  { id: 'U2', name: 'Dr. Sarah Wilson', email: 'sarah.w@healsync.com', role: UserRole.DOCTOR },
  { id: 'U3', name: 'Robert Accountant', email: 'robert.a@healsync.com', role: UserRole.ACCOUNTANT },
  { id: 'U4', name: 'Nurse Joy', email: 'joy.n@healsync.com', role: UserRole.NURSE },
  { id: 'U5', name: 'Mark Lab', email: 'mark.l@healsync.com', role: UserRole.LAB_TECH },
  { id: 'U6', name: 'Alice Reception', email: 'alice.r@healsync.com', role: UserRole.RECEPTIONIST },
];

export const mockHospitalSettings: HospitalSettings = {
  name: 'HealSync General Hospital',
  tagline: 'Excellence in Clinical Care',
  address: '123 Medical Plaza, Wellness District, Metropolis 54001',
  email: 'info@healsync.com',
  phone: '+1 (555) 000-HIS-1',
  website: 'www.healsync-medical.com',
  opdTimings: 'Mon-Sat: 08:00 AM - 08:00 PM, Sun: Emergency Only',
};

export const mockEmergencyNumbers: EmergencyNumber[] = [
  { id: 'EN1', label: 'Main Emergency Line', number: '911-HIS-00', department: 'Emergency' },
  { id: 'EN2', label: 'Cardiac Ambulance', number: '911-HIS-CAR', department: 'Cardiology' },
  { id: 'EN3', label: 'Trauma Response', number: '911-HIS-TRM', department: 'Surgical' },
];

export const mockPaymentGateways: PaymentGateway[] = [
  { id: 'PG1', provider: 'Stripe', merchantId: 'mch_stripe_554', status: 'Active', methods: ['Card', 'Apple Pay', 'Google Pay'] },
  { id: 'PG2', provider: 'Razorpay', merchantId: 'rzp_live_his92', status: 'Active', methods: ['UPI', 'Net Banking', 'Wallet'] },
  { id: 'PG3', provider: 'PayPal', merchantId: 'pp_biz_healsync', status: 'Testing', methods: ['PayPal Credit', 'International'] },
];

export const mockBackupLogs: BackupLog[] = [
  { id: 'B1', timestamp: '2024-05-21 02:00 AM', size: '4.2 GB', status: 'Success', type: 'Automated' },
  { id: 'B2', timestamp: '2024-05-20 02:00 AM', size: '4.1 GB', status: 'Success', type: 'Automated' },
  { id: 'B3', timestamp: '2024-05-20 04:30 PM', size: '4.1 GB', status: 'Success', type: 'Manual' },
];

export const mockSecuritySettings: SecuritySetting[] = [
  { id: 'SEC1', label: 'Two-Factor Authentication (2FA)', description: 'Require staff to verify login via mobile app.', isEnabled: true, category: 'Access' },
  { id: 'SEC2', label: 'EHR Encryption at Rest', description: 'AES-256 encryption for all patient clinical data.', isEnabled: true, category: 'Data' },
  { id: 'SEC3', label: 'IP Whitelisting', description: 'Restrict admin panel access to hospital network IPs.', isEnabled: false, category: 'Network' },
  { id: 'SEC4', label: 'Automatic Session Timeout', description: 'Logout inactive users after 15 minutes.', isEnabled: true, category: 'Access' },
];

export const mockAnnouncements: InternalAnnouncement[] = [
  { id: 'ANN1', title: 'New Hospital Management Protocol', content: 'Starting June 1st, all IPD entries must be validated by the head nurse.', priority: 'High', targetAudience: 'All Staff', date: '2024-05-20', author: 'Super Admin' },
  { id: 'ANN2', title: 'Staff Cafeteria Maintenance', content: 'The cafeteria will be closed for maintenance on Saturday from 2 PM to 6 PM.', priority: 'Low', targetAudience: 'All Staff', date: '2024-05-21', author: 'Admin' },
  { id: 'ANN3', title: 'Doctor Training: LIS Integration', content: 'Mandatory training for the new Lab Information System module in Cabin 101.', priority: 'Medium', targetAudience: 'Doctors', date: '2024-05-22', author: 'IT Dept' },
];

export const mockSMSLogs: SMSLog[] = [
  { id: 'SMS1', patientName: 'John Doe', phoneNumber: '+1 555-0101', message: 'Your appointment with Dr. Sarah is confirmed for tomorrow at 10 AM.', status: 'Delivered', timestamp: '2024-05-20 04:30 PM', type: 'Appointment' },
  { id: 'SMS2', patientName: 'Jane Smith', phoneNumber: '+1 555-0202', message: 'Bill for Invoice #INV-1002 is generated. Amount: $2650.', status: 'Sent', timestamp: '2024-05-21 09:15 AM', type: 'Billing' },
];

export const mockEmailLogs: EmailLog[] = [
  { id: 'EM1', patientName: 'John Doe', email: 'john.doe@example.com', subject: 'Lab Report Ready - CBC', status: 'Opened', timestamp: '2024-05-21 05:00 PM', type: 'Lab Result' },
  { id: 'EM2', patientName: 'Robert Brown', email: 'robert.b@example.com', subject: 'Your E-Prescription from HealSync', status: 'Sent', timestamp: '2024-05-22 10:00 AM', type: 'Prescription' },
];

export const mockPatientGrowth: PatientGrowthEntry[] = [
  { month: 'Jan', newPatients: 45, discharges: 38 },
  { month: 'Feb', newPatients: 52, discharges: 42 },
  { month: 'Mar', newPatients: 61, discharges: 50 },
  { month: 'Apr', newPatients: 58, discharges: 55 },
  { month: 'May', newPatients: 75, discharges: 60 },
  { month: 'Jun', newPatients: 82, discharges: 68 },
];

export const mockCustomReports: CustomReport[] = [
  { id: 'REP1', name: 'Q2 Revenue Audit', type: 'Revenue', dateRange: 'Apr-Jun 2024', filters: 'Category: IPD, OPD', createdBy: 'Super Admin' },
  { id: 'REP2', name: 'Surgical Dept Efficiency', type: 'Operational', dateRange: 'May 2024', filters: 'Dept: Surgery', createdBy: 'Admin' },
];

export const mockCMSPages: CMSPage[] = [
  { id: 'PAGE1', title: 'About Us', slug: '/about', content: 'HealSync is a leading provider of healthcare services...', status: 'Published', lastUpdated: '2024-05-10' },
  { id: 'PAGE2', title: 'Contact Support', slug: '/contact', content: 'Reach out to us via email or 24/7 hotline...', status: 'Draft', lastUpdated: '2024-05-15' },
];

export const mockCMSBlogs: CMSBlog[] = [
  { id: 'BLOG1', title: 'Managing Heart Health', author: 'Dr. Elena Rossi', category: 'Health Tips', date: '2024-05-20', image: 'heart.jpg', excerpt: 'Learn the key daily habits to maintain cardiac health...', status: 'Published' },
  { id: 'BLOG2', title: 'COVID-19 Vaccination Updates', author: 'Dr. David Chen', category: 'News', date: '2024-05-22', image: 'vax.jpg', excerpt: 'Stay informed on the latest booster requirements...', status: 'Draft' },
];

export const mockCMSSliders: CMSSlider[] = [
  { id: 'SLIDE1', title: '24/7 Emergency Care', subTitle: 'Top-tier specialists always available.', imageUrl: 'banner1.jpg', buttonText: 'Find a Doctor', buttonLink: '/doctors', order: 1, isActive: true },
  { id: 'SLIDE2', title: 'Modern Diagnostics', subTitle: 'Advanced lab results in under 24 hours.', imageUrl: 'banner2.jpg', buttonText: 'View Services', buttonLink: '/services', order: 2, isActive: true },
];

export const mockCMSSEO: CMSSEOSetting[] = [
  { id: 'SEO1', pageName: 'Homepage', titleTag: 'HealSync HIS - Premium Healthcare Solutions', metaDescription: 'Access best-in-class hospital management and clinical services.', keywords: 'hospital, medicine, doctors, health' },
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

export const mockPharmacyInventory: PharmacyItem[] = [
  { id: 'MED1', name: 'Paracetamol', category: 'Tablet', stock: 1500, minStockLevel: 200, price: 0.5, expiryDate: '2025-12-31', supplierId: 'SUP1' },
  { id: 'MED2', name: 'Amoxicillin', category: 'Capsule', stock: 45, minStockLevel: 50, price: 1.2, expiryDate: '2024-06-15', supplierId: 'SUP2' },
  { id: 'MED3', name: 'Cough Syrup (Plus)', category: 'Syrup', stock: 80, minStockLevel: 20, price: 5.5, expiryDate: '2024-09-20', supplierId: 'SUP1' },
  { id: 'MED4', name: 'Insulin Glargine', category: 'Injection', stock: 15, minStockLevel: 25, price: 45.0, expiryDate: '2024-05-30', supplierId: 'SUP3' },
];

export const mockPharmacySales: PharmacySale[] = [
  { id: 'SALE1', patientName: 'John Doe', items: [{ itemId: 'MED1', itemName: 'Paracetamol', quantity: 10, price: 0.5 }], totalAmount: 5.0, date: '2024-05-20', paymentStatus: 'Paid' },
  { id: 'SALE2', patientName: 'Emily White', items: [{ itemId: 'MED3', itemName: 'Cough Syrup (Plus)', quantity: 1, price: 5.5 }], totalAmount: 5.5, date: '2024-05-21', paymentStatus: 'Pending' },
];

export const mockPharmacySuppliers: PharmacySupplier[] = [
  { id: 'SUP1', name: 'MediPlus Pharma', contactPerson: 'Sarah Jenkins', phone: '555-9001', email: 'orders@mediplus.com', address: '123 Health Ave, Pharma City' },
  { id: 'SUP2', name: 'BioCure Supplies', contactPerson: 'Mark Watson', phone: '555-9002', email: 'sales@biocure.com', address: '456 Biotech Blvd, Science Park' },
  { id: 'SUP3', name: 'LifeCare Logistics', contactPerson: '闖na Smith', phone: '555-9003', email: 'logistics@lifecare.com', address: '789 Care Road, Wellness Dist' },
];

export const mockInvoices: Invoice[] = [
  { id: 'INV-1001', patientId: '1', patientName: 'John Doe', date: '2024-05-20', category: BillingCategory.OPD, amount: 150, tax: 15, discount: 0, total: 165, status: 'Paid', paymentMethod: 'Card' },
  { id: 'INV-1002', patientId: '2', patientName: 'Jane Smith', date: '2024-05-21', category: BillingCategory.IPD, amount: 2500, tax: 250, discount: 100, total: 2650, status: 'Unpaid', paymentMethod: 'Insurance', insuranceProvider: 'Aetna Health', insuranceStatus: 'Pending' },
  { id: 'INV-1003', patientId: '3', patientName: 'Robert Brown', date: '2024-05-21', category: BillingCategory.LAB, amount: 45, tax: 4.5, discount: 0, total: 49.5, status: 'Paid', paymentMethod: 'UPI' },
  { id: 'INV-1004', patientId: '4', patientName: 'Emily White', date: '2024-05-22', category: BillingCategory.RADIOLOGY, amount: 200, tax: 20, discount: 20, total: 200, status: 'Partially Paid', paymentMethod: 'Cash' },
  { id: 'INV-1005', patientId: '5', patientName: 'Michael Johnson', date: '2024-05-22', category: BillingCategory.INSURANCE, amount: 500, tax: 50, discount: 0, total: 550, status: 'Unpaid', paymentMethod: 'Insurance', insuranceProvider: 'Cigna', insuranceStatus: 'Approved' },
];

export const mockInsurancePanels: InsurancePanel[] = [
  { id: 'PANEL1', name: 'Aetna Health', code: 'AETNA-01', contactPerson: 'Michael Scott', email: 'corp@aetna.com', phone: '1-800-AETNA', settlementPeriod: 30, status: 'Active' },
  { id: 'PANEL2', name: 'Cigna Global', code: 'CIGNA-99', contactPerson: 'Pam Beesly', email: 'claims@cigna.com', phone: '1-800-CIGNA', settlementPeriod: 45, status: 'Active' },
  { id: 'PANEL3', name: 'Blue Shield', code: 'BS-45', contactPerson: 'Jim Halpert', email: 'panels@blueshield.com', phone: '1-800-BLUE', settlementPeriod: 15, status: 'Active' },
];

export const mockInsuranceClaims: InsuranceClaim[] = [
  { id: 'CLAIM-501', patientId: '2', patientName: 'Jane Smith', panelId: 'PANEL1', panelName: 'Aetna Health', invoiceId: 'INV-1002', claimAmount: 2650, status: 'Pending', submissionDate: '2024-05-21' },
  { id: 'CLAIM-502', patientId: '5', patientName: 'Michael Johnson', panelId: 'PANEL2', panelName: 'Cigna Global', invoiceId: 'INV-1005', claimAmount: 550, approvedAmount: 500, status: 'Approved', submissionDate: '2024-05-22' },
];

export const mockPatientCoverage: PatientCoverage[] = [
  { id: 'COV1', patientId: '2', panelId: 'PANEL1', policyNumber: 'POL-123456', totalLimit: 10000, consumedLimit: 2650, expiryDate: '2025-01-01', status: 'Verified' },
  { id: 'COV2', patientId: '5', panelId: 'PANEL2', policyNumber: 'POL-998877', totalLimit: 5000, consumedLimit: 550, expiryDate: '2024-12-31', status: 'Verified' },
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

export const mockAppointments: Appointment[] = [
  { id: 'APT-1', patientName: 'John Doe', doctorId: 'D1', doctorName: 'Dr. Sarah Wilson', time: '10:00 AM', date: '2024-05-21', type: 'General Checkup', source: AppointmentSource.ONLINE, status: 'Scheduled' },
  { id: 'APT-2', patientName: 'Jane Smith', doctorId: 'D2', doctorName: 'Dr. James Miller', time: '11:30 AM', date: '2024-05-21', type: 'Dermatology', source: AppointmentSource.WALK_IN, status: 'Checked-in' },
  { id: 'APT-3', patientName: 'Robert Brown', doctorId: 'D1', doctorName: 'Dr. Sarah Wilson', time: '02:00 PM', date: '2024-05-21', type: 'Follow-up', source: AppointmentSource.ONLINE, status: 'Scheduled' },
];

export const mockDoctors: Doctor[] = [
  { id: 'D1', name: 'Dr. Sarah Wilson', specialization: 'General Physician', department: 'General Medicine', status: 'On Duty', room: 'Cabin 101', experience: '12 Years', schedules: [{ day: 'Monday', startTime: '09:00 AM', endTime: '02:00 PM', limit: 20 }, { day: 'Wednesday', startTime: '10:00 AM', endTime: '04:00 PM', limit: 25 }], publicBio: 'Expert in primary care and preventative medicine.', displayOnWeb: true },
  { id: 'D2', name: 'Dr. James Miller', specialization: 'Dermatologist', department: 'Dermatology', status: 'On Duty', room: 'Cabin 202', experience: '8 Years', schedules: [{ day: 'Tuesday', startTime: '08:00 AM', endTime: '12:00 PM', limit: 15 }], publicBio: 'Skin health and aesthetic specialist with 8 years of practice.', displayOnWeb: true },
  { id: 'D3', name: 'Dr. Elena Rossi', specialization: 'Cardiologist', department: 'Cardiology', status: 'On Break', room: 'Cabin 305', experience: '15 Years', displayOnWeb: true },
  { id: 'D4', name: 'Dr. David Chen', specialization: 'Pediatrician', department: 'Pediatrics', status: 'Off Duty', room: 'Cabin 108', experience: '5 Years', displayOnWeb: false },
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
