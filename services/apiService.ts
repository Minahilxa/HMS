
import { 
  DashboardStats, User, Patient, Doctor, Appointment, 
  RevenueData, EmergencyCase, UserRole, HospitalDepartment,
  HospitalService, LabTest, LabSample, RadiologyOrder, 
  PharmacyItem, PharmacySale, PharmacySupplier, Invoice, 
  InsurancePanel, InsuranceClaim, PatientCoverage, CMSPage, 
  CMSBlog, CMSSlider, CMSSEOSetting, LeaveRequest, 
  DoctorPerformance, InternalAnnouncement, SMSLog, EmailLog, 
  HospitalSettings, EmergencyNumber, PaymentGateway, BackupLog, 
  SecuritySetting, AccessHistory, TimeSlot, CustomReport, PatientGrowthEntry,
  PatientStatus, AppointmentSource, BillingCategory, EHRRecord, Prescription
} from '../types';

const DB_KEYS = {
  USERS: 'healsync_db_users',
  PATIENTS: 'healsync_db_patients',
  DOCTORS: 'healsync_db_doctors',
  APPOINTMENTS: 'healsync_db_appointments',
  DEPARTMENTS: 'healsync_db_departments',
  SERVICES: 'healsync_db_services',
  INVOICES: 'healsync_db_invoices',
  LAB_TESTS: 'healsync_db_lab_tests',
  LAB_SAMPLES: 'healsync_db_lab_samples',
  RADIO_ORDERS: 'healsync_db_radio_orders',
  PHARMACY_INV: 'healsync_db_pharmacy_inv',
  PHARMACY_SALES: 'healsync_db_pharmacy_sales',
  PHARMACY_SUPP: 'healsync_db_pharmacy_supp',
  INSURANCE_PANELS: 'healsync_db_insurance_panels',
  INSURANCE_CLAIMS: 'healsync_db_insurance_claims',
  CMS_PAGES: 'healsync_db_cms_pages',
  ANNOUNCEMENTS: 'healsync_db_announcements',
  SETTINGS: 'healsync_db_settings',
  LEAVES: 'healsync_db_leaves',
  PERFORMANCE: 'healsync_db_performance',
  SLOTS: 'healsync_db_slots',
  ACCESS_HISTORY: 'healsync_db_access_logs'
};

class ApiService {
  constructor() {
    this.seedDatabase();
  }

  // Seeding initial pharmacy data and other missing resources
  private seedDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      // Seed Initial Users
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
        { id: 'u1', name: 'System Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password123' },
        { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah@healsync.com', role: UserRole.DOCTOR, username: 'doctor', password: 'password123' }
      ]));

      // Seed Initial Lab Samples
      localStorage.setItem(DB_KEYS.LAB_SAMPLES, JSON.stringify([
        { id: 'SMP-101', patientId: 'P1001', patientName: 'John Doe', testId: 'srv-2', testName: 'Complete Blood Count', collectionDate: '2024-05-20', status: 'Pending' },
        { id: 'SMP-102', patientId: 'P1001', patientName: 'John Doe', testId: 'srv-1', testName: 'Glucose Fasting', collectionDate: '2024-05-21', status: 'Completed', result: '95 mg/dL' }
      ]));

      // Seed Initial Access Logs
      localStorage.setItem(DB_KEYS.ACCESS_HISTORY, JSON.stringify([
        { id: 'LOG-1', patientName: 'John Doe', action: 'Login', timestamp: '2024-05-20 09:00 AM', device: 'Chrome / Windows' },
        { id: 'LOG-2', patientName: 'John Doe', action: 'Report Viewed', timestamp: '2024-05-21 11:30 AM', device: 'Safari / iPhone' }
      ]));

      // Seed Initial Doctors
      localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify([
        { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years', displayOnWeb: true, publicBio: 'Expert in cardiology.' },
        { id: 'd2', name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years', displayOnWeb: true, publicBio: 'Specialist in neurology.' }
      ]));

      localStorage.setItem(DB_KEYS.PERFORMANCE, JSON.stringify([
        { doctorId: 'd1', patientsSeen: 450, surgeriesPerformed: 12, rating: 4.8, attendanceRate: 98 },
        { doctorId: 'd2', patientsSeen: 320, surgeriesPerformed: 5, rating: 4.5, attendanceRate: 92 }
      ]));

      localStorage.setItem(DB_KEYS.LEAVES, JSON.stringify([
        { id: 'L1', doctorId: 'd1', doctorName: 'Dr. Sarah Wilson', type: 'Sick', startDate: '2024-06-01', endDate: '2024-06-03', reason: 'Flu symptoms', status: 'Pending' }
      ]));

      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([
        { id: 'P1001', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Chronic Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] }
      ]));

      localStorage.setItem(DB_KEYS.SLOTS, JSON.stringify([
        { id: 'SL1', doctorId: 'd1', day: 'Monday', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: 'SL2', doctorId: 'd1', day: 'Tuesday', startTime: '14:00', endTime: '17:00', isAvailable: true }
      ]));

      localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify([
        { id: 'INV-101', patientId: 'P1001', patientName: 'John Doe', date: '2024-05-18', category: BillingCategory.OPD, amount: 150, tax: 15, discount: 0, total: 165, status: 'Paid', paymentMethod: 'Cash' }
      ]));

      localStorage.setItem(DB_KEYS.DEPARTMENTS, JSON.stringify([
        { id: 'dept-1', name: 'Cardiology', description: 'Advanced cardiac care.', headDoctorId: 'd1', staffCount: 15, status: 'Active' },
        { id: 'dept-2', name: 'Neurology', description: 'Nervous system disorders.', headDoctorId: 'd2', staffCount: 10, status: 'Active' }
      ]));

      localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify([
        { id: 'srv-1', name: 'General Consultation', description: 'Standard health checkup.', cost: 50, category: 'Therapeutic', isAvailable: true },
        { id: 'srv-2', name: 'Blood Panel', description: 'Full CBC and metabolic panel.', cost: 120, category: 'Diagnostic', isAvailable: true }
      ]));

      // Added pharmacy seed data
      localStorage.setItem(DB_KEYS.PHARMACY_INV, JSON.stringify([
        { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Tablet', stock: 500, minStockLevel: 100, price: 5.50, expiryDate: '2025-12-01', supplierId: 'SUP-001' },
        { id: 'MED-002', name: 'Amoxicillin 250mg', category: 'Capsule', stock: 45, minStockLevel: 50, price: 12.00, expiryDate: '2024-08-15', supplierId: 'SUP-002' }
      ]));

      localStorage.setItem(DB_KEYS.PHARMACY_SUPP, JSON.stringify([
        { id: 'SUP-001', name: 'Global Pharma Solutions', contactPerson: 'Mark Evans', phone: '555-0202', email: 'sales@globalpharma.com', address: '456 Industrial Way' },
        { id: 'SUP-002', name: 'HealthCare Medics', contactPerson: 'Alice Wong', phone: '555-0303', email: 'alice@healthcaremedics.com', address: '789 Biotech Park' }
      ]));

      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({
        name: 'HealSync General Hospital', tagline: 'Excellence in Clinical Care', address: '123 Medical Blvd, Health City', email: 'info@healsync.com', phone: '+1 234 567 890', website: 'www.healsync.com', opdTimings: 'Mon-Sat: 08:00 AM - 08:00 PM'
      }));
    }
  }

  private getDB<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveDB<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async login(credentials: any): Promise<{ user: User; token: string }> {
    const users = this.getDB<any>(DB_KEYS.USERS);
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
    if (user) {
      const { password, ...userSafe } = user;
      return { user: userSafe as User, token: 'session_token_' + Date.now() };
    }
    throw new Error('Access Denied: Invalid credentials.');
  }

  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    const stats = await this.getDashboardStats();
    const doctors = await this.getDoctors();
    const revenue = await this.getRevenueSummary();
    return { stats, revenue, doctors, emergencyCases: [] };
  }

  async getPatients(): Promise<Patient[]> { return this.getDB(DB_KEYS.PATIENTS); }
  async getDoctors(): Promise<Doctor[]> { return this.getDB(DB_KEYS.DOCTORS); }
  async getUsers(): Promise<User[]> { return this.getDB(DB_KEYS.USERS); }
  async getAppointments(): Promise<Appointment[]> { return this.getDB(DB_KEYS.APPOINTMENTS); }
  async getDepartments(): Promise<HospitalDepartment[]> { return this.getDB(DB_KEYS.DEPARTMENTS); }
  async getServices(): Promise<HospitalService[]> { return this.getDB(DB_KEYS.SERVICES); }
  async getInvoices(): Promise<Invoice[]> { return this.getDB(DB_KEYS.INVOICES); }
  async getLabTests(): Promise<LabTest[]> { return this.getDB(DB_KEYS.LAB_TESTS); }
  async getLabSamples(): Promise<LabSample[]> { return this.getDB(DB_KEYS.LAB_SAMPLES); }
  async getRadiologyOrders(): Promise<RadiologyOrder[]> { return this.getDB(DB_KEYS.RADIO_ORDERS); }
  async getLeaveRequests(): Promise<LeaveRequest[]> { return this.getDB(DB_KEYS.LEAVES); }
  async getSlots(): Promise<TimeSlot[]> { return this.getDB(DB_KEYS.SLOTS); }
  async getDoctorPerformance(): Promise<DoctorPerformance[]> { return this.getDB(DB_KEYS.PERFORMANCE); }
  async getAccessHistory(): Promise<AccessHistory[]> { return this.getDB(DB_KEYS.ACCESS_HISTORY); }
  
  // Fix for error in PharmacyManagement.tsx: Added missing getPharmacyInventory method
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getDB(DB_KEYS.PHARMACY_INV); }
  
  async getHospitalSettings(): Promise<HospitalSettings> { 
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
  }

  async updateSampleStatus(id: string, status: LabSample['status'], result?: string): Promise<boolean> {
    const samples = this.getDB<LabSample>(DB_KEYS.LAB_SAMPLES);
    const idx = samples.findIndex(s => s.id === id);
    if (idx > -1) {
      samples[idx].status = status;
      if (result !== undefined) samples[idx].result = result;
      this.saveDB(DB_KEYS.LAB_SAMPLES, samples);
      
      // Log this action
      this.createAccessLog({
        patientName: samples[idx].patientName,
        action: status === 'Completed' ? 'Report Downloaded' : 'Report Viewed',
        device: 'Laboratory System / Automatic'
      });

      return true;
    }
    return false;
  }

  async createAccessLog(log: Partial<AccessHistory>): Promise<boolean> {
    const logs = this.getDB<AccessHistory>(DB_KEYS.ACCESS_HISTORY);
    const newLog = {
      ...log,
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toLocaleString()
    } as AccessHistory;
    this.saveDB(DB_KEYS.ACCESS_HISTORY, [newLog, ...logs].slice(0, 100)); // Keep last 100 logs
    return true;
  }

  // --- CRUD METHODS ---
  async createDepartment(data: Partial<HospitalDepartment>): Promise<HospitalDepartment> {
    const depts = this.getDB<HospitalDepartment>(DB_KEYS.DEPARTMENTS);
    const newDept = { ...data, id: 'dept-' + Date.now(), staffCount: 0, status: 'Active' } as HospitalDepartment;
    this.saveDB(DB_KEYS.DEPARTMENTS, [...depts, newDept]);
    return newDept;
  }

  async updateDepartment(id: string, updates: Partial<HospitalDepartment>): Promise<HospitalDepartment> {
    const depts = this.getDB<HospitalDepartment>(DB_KEYS.DEPARTMENTS);
    const idx = depts.findIndex(d => d.id === id);
    if (idx > -1) {
      depts[idx] = { ...depts[idx], ...updates };
      this.saveDB(DB_KEYS.DEPARTMENTS, depts);
      return depts[idx];
    }
    throw new Error('Department not found');
  }

  async createService(data: Partial<HospitalService>): Promise<HospitalService> {
    const services = this.getDB<HospitalService>(DB_KEYS.SERVICES);
    const newSrv = { ...data, id: 'srv-' + Date.now(), isAvailable: true } as HospitalService;
    this.saveDB(DB_KEYS.SERVICES, [...services, newSrv]);
    return newSrv;
  }

  async updateService(id: string, updates: Partial<HospitalService>): Promise<HospitalService> {
    const services = this.getDB<HospitalService>(DB_KEYS.SERVICES);
    const idx = services.findIndex(s => s.id === id);
    if (idx > -1) {
      services[idx] = { ...services[idx], ...updates };
      this.saveDB(DB_KEYS.SERVICES, services);
      return services[idx];
    }
    throw new Error('Service not found');
  }

  async deleteService(id: string): Promise<boolean> {
    const services = this.getDB<HospitalService>(DB_KEYS.SERVICES);
    const filtered = services.filter(s => s.id !== id);
    if (filtered.length !== services.length) {
      this.saveDB(DB_KEYS.SERVICES, filtered);
      return true;
    }
    return false;
  }

  async createDoctor(data: Partial<Doctor>): Promise<Doctor> {
    const docs = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const newDoc = { ...data, id: 'd' + (docs.length + 1), status: 'Off Duty' } as Doctor;
    this.saveDB(DB_KEYS.DOCTORS, [...docs, newDoc]);
    return newDoc;
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    const docs = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const idx = docs.findIndex(d => d.id === id);
    if (idx > -1) {
      docs[idx] = { ...docs[idx], ...updates };
      this.saveDB(DB_KEYS.DOCTORS, docs);
      return docs[idx];
    }
    throw new Error('Doctor not found');
  }

  async updateDoctorStatus(id: string, status: Doctor['status']): Promise<boolean> {
    const docs = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const idx = docs.findIndex(d => d.id === id);
    if (idx > -1) {
      docs[idx].status = status;
      this.saveDB(DB_KEYS.DOCTORS, docs);
      return true;
    }
    return false;
  }

  async createSlot(data: Partial<TimeSlot>): Promise<TimeSlot> {
    const slots = this.getDB<TimeSlot>(DB_KEYS.SLOTS);
    const newSlot = { ...data, id: 'SL' + Date.now(), isAvailable: true } as TimeSlot;
    this.saveDB(DB_KEYS.SLOTS, [...slots, newSlot]);
    return newSlot;
  }

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const newPt = { ...data, id: 'P' + (1000 + pts.length + 1), medicalHistory: [], prescriptions: [] } as Patient;
    this.saveDB(DB_KEYS.PATIENTS, [...pts, newPt]);
    return newPt;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const idx = pts.findIndex(p => p.id === id);
    if (idx > -1) {
      pts[idx] = { ...pts[idx], ...updates };
      this.saveDB(DB_KEYS.PATIENTS, pts);
      return pts[idx];
    }
    throw new Error('Patient record not found');
  }

  async createAppointment(data: any): Promise<Appointment> {
    const apts = this.getDB<Appointment>(DB_KEYS.APPOINTMENTS);
    const newApt = { ...data, id: 'APT' + Date.now(), status: 'Scheduled' };
    this.saveDB(DB_KEYS.APPOINTMENTS, [...apts, newApt]);
    return newApt;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    const apts = this.getDB<Appointment>(DB_KEYS.APPOINTMENTS);
    const idx = apts.findIndex(a => a.id === id);
    if (idx > -1) {
      apts[idx].status = status as any;
      this.saveDB(DB_KEYS.APPOINTMENTS, apts);
      return true;
    }
    return false;
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    const invs = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const idx = invs.findIndex(i => i.id === id);
    if (idx > -1) {
      invs[idx] = { ...invs[idx], ...updates };
      this.saveDB(DB_KEYS.INVOICES, invs);
      return true;
    }
    return false;
  }

  async updateLeaveStatus(id: string, status: string): Promise<boolean> {
    const leaves = this.getDB<LeaveRequest>(DB_KEYS.LEAVES);
    const idx = leaves.findIndex(l => l.id === id);
    if (idx > -1) {
      leaves[idx].status = status as any;
      this.saveDB(DB_KEYS.LEAVES, leaves);
      return true;
    }
    return false;
  }

  async updateHospitalSettings(data: any): Promise<boolean> { 
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(data));
    return true; 
  }

  async addEHRRecord(patientId: string, record: Partial<EHRRecord>): Promise<boolean> {
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const idx = pts.findIndex(p => p.id === patientId);
    if (idx > -1) {
      const newRecord = { ...record, id: 'EHR' + Date.now(), date: record.date || new Date().toISOString().split('T')[0] } as EHRRecord;
      pts[idx].medicalHistory = [...(pts[idx].medicalHistory || []), newRecord];
      this.saveDB(DB_KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }

  async addPrescription(patientId: string, prescription: Partial<Prescription>): Promise<boolean> {
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const idx = pts.findIndex(p => p.id === patientId);
    if (idx > -1) {
      const newPres = { ...prescription, id: 'RX' + Date.now(), date: prescription.date || new Date().toISOString().split('T')[0] } as Prescription;
      pts[idx].prescriptions = [...(pts[idx].prescriptions || []), newPres];
      this.saveDB(DB_KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const patients = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const doctors = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const invoices = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const apts = this.getDB<Appointment>(DB_KEYS.APPOINTMENTS);
    return {
      dailyAppointments: apts.length,
      opdPatients: patients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: patients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: patients.filter(p => p.status === PatientStatus.EMERGENCY).length,
      totalRevenue: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0),
      doctorsOnDuty: doctors.filter(d => d.status === 'On Duty').length
    };
  }

  async getRevenueSummary(): Promise<RevenueData[]> {
    return [
      { date: '2024-05-18', amount: 5100, category: 'Pharmacy' },
      { date: '2024-05-19', amount: 3200, category: 'OPD' },
      { date: '2024-05-20', amount: 4150, category: 'IPD' }
    ];
  }

  // --- STUBS ---
  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getDB(DB_KEYS.INSURANCE_PANELS); }
  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return this.getDB(DB_KEYS.INSURANCE_CLAIMS); }
  async getCMSPages(): Promise<CMSPage[]> { return this.getDB(DB_KEYS.CMS_PAGES); }
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return this.getDB(DB_KEYS.ANNOUNCEMENTS); }
  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> { return []; }
  async getCustomReports(): Promise<CustomReport[]> { return []; }
  async getSMSLogs(): Promise<SMSLog[]> { return []; }
  async getEmailLogs(): Promise<EmailLog[]> { return []; }
  async getCMSBlogs(): Promise<CMSBlog[]> { return []; }
  async getCMSSliders(): Promise<CMSSlider[]> { return []; }
  async getCMSSEO(): Promise<CMSSEOSetting[]> { return []; }
  async getEmergencyCases(): Promise<EmergencyCase[]> { return []; }
  async getEmergencyNumbers(): Promise<EmergencyNumber[]> { return []; }
  async getPaymentGateways(): Promise<PaymentGateway[]> { return []; }
  async getBackupLogs(): Promise<BackupLog[]> { return []; }
  async getSecuritySettings(): Promise<SecuritySetting[]> { return []; }
  async updateUserRole(id: string, r: any) { return true; }
  async updateClaimStatus(id: string, d: any) { return true; }
  async updateCMSPage(id: string, d: any) { return true; }
  async runManualBackup() { return { status: 'Success' }; }
  async toggleSecuritySetting(id: string) { return true; }
  async createAnnouncement(d: any) { return true; }
  async deleteAnnouncement(id: string) { return true; }
  async sendSMS(d: any) { return true; }
  async createRadiologyOrder(d: any) { return true; }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return true; }
  async getPharmacySales(): Promise<PharmacySale[]> { return this.getDB(DB_KEYS.PHARMACY_SALES); }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return this.getDB(DB_KEYS.PHARMACY_SUPP); }
  async getPatientCoverage(id: string): Promise<PatientCoverage[]> { return []; }
  async updateCMSBlog(id: string, d: any) { return true; }
  async updateCMSSlider(id: string, d: any) { return true; }
  async updateDoctorCMS(id: string, d: any) { return true; }
  async deleteCustomReport(id: string) { return true; }
}

export const apiService = new ApiService();
