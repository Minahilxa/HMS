
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
  PATIENT_COVERAGE: 'healsync_db_patient_coverage',
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

  private seedDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
        { id: 'u1', name: 'System Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password123' },
        { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah@healsync.com', role: UserRole.DOCTOR, username: 'doctor', password: 'password123' }
      ]));

      // Seed Panels
      localStorage.setItem(DB_KEYS.INSURANCE_PANELS, JSON.stringify([
        { id: 'PNL-1', name: 'HealthFirst Insurance', code: 'HF01', contactPerson: 'Jane Smith', email: 'jane@healthfirst.com', phone: '555-0202', settlementPeriod: 30, status: 'Active' },
        { id: 'PNL-2', name: 'Global Care Net', code: 'GCN', contactPerson: 'Mike Ross', email: 'mike@gcn.com', phone: '555-0303', settlementPeriod: 45, status: 'Active' }
      ]));

      // Seed Claims
      localStorage.setItem(DB_KEYS.INSURANCE_CLAIMS, JSON.stringify([
        { id: 'CLM-101', patientId: 'P1001', patientName: 'John Doe', panelId: 'PNL-1', panelName: 'HealthFirst Insurance', invoiceId: 'INV-101', claimAmount: 165, status: 'Pending', submissionDate: '2024-05-18' }
      ]));

      // Seed Coverage
      localStorage.setItem(DB_KEYS.PATIENT_COVERAGE, JSON.stringify([
        { id: 'COV-1', patientId: 'P1001', panelId: 'PNL-1', policyNumber: 'HF-998822', totalLimit: 5000, consumedLimit: 1200, expiryDate: '2025-12-31', status: 'Verified' }
      ]));

      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([
        { id: 'P1001', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Chronic Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] }
      ]));

      localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify([
        { id: 'INV-101', patientId: 'P1001', patientName: 'John Doe', date: '2024-05-18', category: BillingCategory.OPD, amount: 150, tax: 15, discount: 0, total: 165, status: 'Paid', paymentMethod: 'Insurance' }
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
  // Fix: Maintaining the database-linked implementation of getLeaveRequests.
  async getLeaveRequests(): Promise<LeaveRequest[]> { return this.getDB(DB_KEYS.LEAVES); }
  async getSlots(): Promise<TimeSlot[]> { return this.getDB(DB_KEYS.SLOTS); }
  async getDoctorPerformance(): Promise<DoctorPerformance[]> { return this.getDB(DB_KEYS.PERFORMANCE); }
  async getAccessHistory(): Promise<AccessHistory[]> { return this.getDB(DB_KEYS.ACCESS_HISTORY); }
  
  // --- INSURANCE & PANELS CRUD ---
  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getDB(DB_KEYS.INSURANCE_PANELS); }
  
  async createInsurancePanel(data: Partial<InsurancePanel>): Promise<InsurancePanel> {
    const panels = this.getDB<InsurancePanel>(DB_KEYS.INSURANCE_PANELS);
    const newPanel = { ...data, id: 'PNL-' + Date.now(), status: data.status || 'Active' } as InsurancePanel;
    this.saveDB(DB_KEYS.INSURANCE_PANELS, [...panels, newPanel]);
    return newPanel;
  }

  async updateInsurancePanel(id: string, updates: Partial<InsurancePanel>): Promise<InsurancePanel> {
    const panels = this.getDB<InsurancePanel>(DB_KEYS.INSURANCE_PANELS);
    const idx = panels.findIndex(p => p.id === id);
    if (idx > -1) {
      panels[idx] = { ...panels[idx], ...updates };
      this.saveDB(DB_KEYS.INSURANCE_PANELS, panels);
      return panels[idx];
    }
    throw new Error('Panel not found');
  }

  async deleteInsurancePanel(id: string): Promise<boolean> {
    const panels = this.getDB<InsurancePanel>(DB_KEYS.INSURANCE_PANELS);
    const filtered = panels.filter(p => p.id !== id);
    this.saveDB(DB_KEYS.INSURANCE_PANELS, filtered);
    return true;
  }

  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return this.getDB(DB_KEYS.INSURANCE_CLAIMS); }
  
  async updateClaimStatus(id: string, updates: Partial<InsuranceClaim>): Promise<boolean> {
    const claims = this.getDB<InsuranceClaim>(DB_KEYS.INSURANCE_CLAIMS);
    const idx = claims.findIndex(c => c.id === id);
    if (idx > -1) {
      claims[idx] = { ...claims[idx], ...updates };
      this.saveDB(DB_KEYS.INSURANCE_CLAIMS, claims);
      return true;
    }
    return false;
  }

  async getPatientCoverage(patientId: string): Promise<PatientCoverage[]> {
    const coverage = this.getDB<PatientCoverage>(DB_KEYS.PATIENT_COVERAGE);
    return coverage.filter(c => c.patientId === patientId);
  }

  async createPatientCoverage(data: Partial<PatientCoverage>): Promise<PatientCoverage> {
    const coverage = this.getDB<PatientCoverage>(DB_KEYS.PATIENT_COVERAGE);
    const newCov = { ...data, id: 'COV-' + Date.now(), status: 'Verified' } as PatientCoverage;
    this.saveDB(DB_KEYS.PATIENT_COVERAGE, [...coverage, newCov]);
    return newCov;
  }

  // --- BILLING CRUD ---
  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const invs = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const amount = data.amount || 0;
    const tax = amount * 0.1; 
    const discount = data.discount || 0;
    const total = amount + tax - discount;

    const newInv = {
      ...data,
      id: 'INV-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      tax,
      total,
      status: data.paymentMethod === 'Insurance' ? 'Unpaid' : 'Paid',
      insuranceStatus: data.paymentMethod === 'Insurance' ? 'Pending' : undefined
    } as Invoice;

    this.saveDB(DB_KEYS.INVOICES, [...invs, newInv]);
    return newInv;
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
      return true;
    }
    return false;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const patients = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const doctors = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const invoices = this.getDB<Invoice>(DB_KEYS.INVOICES);
    return {
      dailyAppointments: 0,
      opdPatients: patients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: patients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: 0,
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

  // STUBS & OTHER METHODS
  async getCMSPages(): Promise<CMSPage[]> { return []; }
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return []; }
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
  async updateCMSPage(id: string, d: any) { return true; }
  async runManualBackup() { return { status: 'Success' }; }
  async toggleSecuritySetting(id: string) { return true; }
  async createAnnouncement(d: any) { return true; }
  async deleteAnnouncement(id: string) { return true; }
  async sendSMS(d: any) { return true; }
  async createRadiologyOrder(d: any) { return true; }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return true; }
  async updateCMSBlog(id: string, d: any) { return true; }
  async updateCMSSlider(id: string, d: any) { return true; }
  async updateDoctorCMS(id: string, d: any) { return true; }
  async deleteCustomReport(id: string) { return true; }
  async updateDoctorStatus(id: string, s: string) { return true; }
  async createAppointment(d: any) { return { id: 'a1' } as any; }
  async createSlot(d: any) { return {}; }
  async updateAppointmentStatus(id: string, s: string) { return true; }
  async updatePatient(id: string, d: any) { return true; }
  async registerPatient(d: any) { return {}; }
  async addEHRRecord(id: string, d: any) { return true; }
  async addPrescription(id: string, d: any) { return true; }
  async updateDepartment(id: string, d: any) { return true; }
  async createDepartment(d: any) { return {}; }
  async updateService(id: string, d: any) { return true; }
  async createService(d: any) { return {}; }
  async deleteService(id: string) { return true; }
  async updatePharmacyItem(id: string, d: any) { return true; }
  async createPharmacyItem(d: any) { return {}; }
  async deletePharmacyItem(id: string) { return true; }
  async updatePharmacySale(id: string, d: any) { return true; }
  async createPharmacySale(d: any) { return {}; }
  async deletePharmacySale(id: string) { return true; }
  async updatePharmacySupplier(id: string, d: any) { return true; }
  async createPharmacySupplier(d: any) { return {}; }
  async deletePharmacySupplier(id: string) { return true; }
  async createDoctor(d: any) { return {}; }
  async updateDoctor(id: string, d: any) { return true; }
  async updateLeaveStatus(id: string, s: string) { return true; }
  async updateHospitalSettings(d: any) { return true; }
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return []; }
  async getPharmacySales(): Promise<PharmacySale[]> { return []; }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return []; }
  // Fix: Removed duplicate stub getLeaveRequests implementation here (previously line 305).
}

export const apiService = new ApiService();
