
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
  SLOTS: 'healsync_db_slots'
};

class ApiService {
  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      // Seed Initial Users
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
        { id: 'u1', name: 'System Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password123' },
        { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah@healsync.com', role: UserRole.DOCTOR, username: 'doctor', password: 'password123' }
      ]));

      // Seed Initial Doctors
      localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify([
        { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years', displayOnWeb: true, publicBio: 'Expert in cardiology.' },
        { id: 'd2', name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years', displayOnWeb: true, publicBio: 'Specialist in neurology.' }
      ]));

      // Seed Initial Patients
      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([
        { id: 'P1001', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Chronic Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] }
      ]));

      // Seed Initial Slots
      localStorage.setItem(DB_KEYS.SLOTS, JSON.stringify([
        { id: 'SL1', doctorId: 'd1', day: 'Monday', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: 'SL2', doctorId: 'd1', day: 'Tuesday', startTime: '14:00', endTime: '17:00', isAvailable: true },
        { id: 'SL3', doctorId: 'd2', day: 'Monday', startTime: '10:00', endTime: '13:00', isAvailable: false }
      ]));

      // Seed Initial Invoices
      localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify([
        { id: 'INV-101', patientId: 'P1001', patientName: 'John Doe', date: '2024-05-18', category: BillingCategory.OPD, amount: 150, tax: 15, discount: 0, total: 165, status: 'Paid', paymentMethod: 'Cash' }
      ]));

      // Seed Hospital Settings
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

  // --- AUTHENTICATION ---
  async login(credentials: any): Promise<{ user: User; token: string }> {
    const users = this.getDB<any>(DB_KEYS.USERS);
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
    
    if (user) {
      const { password, ...userSafe } = user;
      return { user: userSafe as User, token: 'session_token_' + Date.now() };
    }
    throw new Error('Access Denied: Invalid credentials. (Hint: admin / password123)');
  }

  // --- DASHBOARD ANALYTICS ---
  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    const patients = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const doctors = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const invoices = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const apts = this.getDB<Appointment>(DB_KEYS.APPOINTMENTS);

    const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0);

    const stats: DashboardStats = {
      dailyAppointments: apts.length,
      opdPatients: patients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: patients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: patients.filter(p => p.status === PatientStatus.EMERGENCY).length,
      totalRevenue,
      doctorsOnDuty: doctors.filter(d => d.status === 'On Duty').length
    };

    return {
      stats,
      revenue: [
        { date: '2024-05-18', amount: 5100, category: 'Pharmacy' },
        { date: '2024-05-19', amount: 3200, category: 'OPD' },
        { date: '2024-05-20', amount: 4150, category: 'IPD' }
      ],
      doctors,
      emergencyCases: []
    };
  }

  // --- CORE DATA ACCESS ---
  async getPatients(): Promise<Patient[]> { return this.getDB(DB_KEYS.PATIENTS); }
  async getDoctors(): Promise<Doctor[]> { return this.getDB(DB_KEYS.DOCTORS); }
  async getUsers(): Promise<User[]> { return this.getDB(DB_KEYS.USERS); }
  async getAppointments(): Promise<Appointment[]> { return this.getDB(DB_KEYS.APPOINTMENTS); }
  async getDepartments(): Promise<HospitalDepartment[]> { return this.getDB(DB_KEYS.DEPARTMENTS); }
  async getInvoices(): Promise<Invoice[]> { return this.getDB(DB_KEYS.INVOICES); }
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getDB(DB_KEYS.PHARMACY_INV); }
  async getLabTests(): Promise<LabTest[]> { return this.getDB(DB_KEYS.LAB_TESTS); }
  async getLabSamples(): Promise<LabSample[]> { return this.getDB(DB_KEYS.LAB_SAMPLES); }
  async getRadiologyOrders(): Promise<RadiologyOrder[]> { return this.getDB(DB_KEYS.RADIO_ORDERS); }
  async getLeaveRequests(): Promise<LeaveRequest[]> { return this.getDB(DB_KEYS.LEAVES); }
  async getSlots(): Promise<TimeSlot[]> { return this.getDB(DB_KEYS.SLOTS); }
  
  async getHospitalSettings(): Promise<HospitalSettings> { 
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
  }

  // --- CRUD OPERATIONS ---
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

  async updateSampleStatus(id: string, status: string, result?: string): Promise<boolean> {
    const samples = this.getDB<LabSample>(DB_KEYS.LAB_SAMPLES);
    const idx = samples.findIndex(s => s.id === id);
    if (idx > -1) {
      samples[idx].status = status as any;
      if (result) samples[idx].result = result;
      this.saveDB(DB_KEYS.LAB_SAMPLES, samples);
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
      const newRecord = { 
        ...record, 
        id: 'EHR' + Date.now(), 
        date: record.date || new Date().toISOString().split('T')[0] 
      } as EHRRecord;
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
      const newPres = { 
        ...prescription, 
        id: 'RX' + Date.now(), 
        date: prescription.date || new Date().toISOString().split('T')[0] 
      } as Prescription;
      pts[idx].prescriptions = [...(pts[idx].prescriptions || []), newPres];
      this.saveDB(DB_KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }

  // --- STUBBED METHODS (For non-core modules) ---
  async getDashboardStats() { return (await this.getInitDashboard()).stats; }
  async getRevenueSummary() { return (await this.getInitDashboard()).revenue; }
  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getDB(DB_KEYS.INSURANCE_PANELS); }
  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return this.getDB(DB_KEYS.INSURANCE_CLAIMS); }
  async getCMSPages(): Promise<CMSPage[]> { return this.getDB(DB_KEYS.CMS_PAGES); }
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return this.getDB(DB_KEYS.ANNOUNCEMENTS); }
  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> { return []; }
  async getDoctorPerformance(): Promise<DoctorPerformance[]> { return []; }
  async getCustomReports(): Promise<CustomReport[]> { return []; }
  async getSMSLogs(): Promise<SMSLog[]> { return []; }
  async getEmailLogs(): Promise<EmailLog[]> { return []; }
  async getCMSBlogs(): Promise<CMSBlog[]> { return []; }
  async getCMSSliders(): Promise<CMSSlider[]> { return []; }
  async getCMSSEO(): Promise<CMSSEOSetting[]> { return []; }
  async getEmergencyCases(): Promise<EmergencyCase[]> { return []; }
  async getServices(): Promise<HospitalService[]> { return this.getDB(DB_KEYS.SERVICES); }
  async getAccessHistory(): Promise<AccessHistory[]> { return []; }
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
  async createDepartment(d: any) { return true; }
  async updateDepartment(id: string, d: any) { return true; }
  async createRadiologyOrder(d: any) { return true; }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return true; }
  async getPharmacySales(): Promise<PharmacySale[]> { return []; }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return []; }
  async getPatientCoverage(id: string): Promise<PatientCoverage[]> { return []; }
  async updateCMSBlog(id: string, d: any) { return true; }
  async updateCMSSlider(id: string, d: any) { return true; }
  async updateDoctorCMS(id: string, d: any) { return true; }
  async updateService(id: string, d: any) { return true; }
  async deleteCustomReport(id: string) { return true; }
}

export const apiService = new ApiService();
