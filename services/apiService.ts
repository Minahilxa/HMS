
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

  private seedDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
        { id: 'u1', name: 'System Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password123' },
        { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah@healsync.com', role: UserRole.DOCTOR, username: 'doctor', password: 'password123' }
      ]));

      localStorage.setItem(DB_KEYS.LAB_SAMPLES, JSON.stringify([
        { id: 'SMP-101', patientId: 'P1001', patientName: 'John Doe', testId: 'srv-2', testName: 'Complete Blood Count', collectionDate: '2024-05-20', status: 'Pending' },
        { id: 'SMP-102', patientId: 'P1001', patientName: 'John Doe', testId: 'srv-1', testName: 'Glucose Fasting', collectionDate: '2024-05-21', status: 'Completed', result: '95 mg/dL' }
      ]));

      localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify([
        { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years', displayOnWeb: true, publicBio: 'Expert in cardiology.' },
        { id: 'd2', name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years', displayOnWeb: true, publicBio: 'Specialist in neurology.' }
      ]));

      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([
        { id: 'P1001', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Chronic Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] }
      ]));

      localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify([
        { id: 'INV-101', patientId: 'P1001', patientName: 'John Doe', date: '2024-05-18', category: BillingCategory.OPD, amount: 150, tax: 15, discount: 0, total: 165, status: 'Paid', paymentMethod: 'Cash' }
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
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getDB(DB_KEYS.PHARMACY_INV); }
  async getPharmacySales(): Promise<PharmacySale[]> { return this.getDB(DB_KEYS.PHARMACY_SALES); }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return this.getDB(DB_KEYS.PHARMACY_SUPP); }
  
  // --- BILLING CRUD ---
  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const invs = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const amount = data.amount || 0;
    const tax = amount * 0.1; // 10% standard tax
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

  // --- OTHER METHODS ---
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

  // STUBS
  async getInsurancePanels(): Promise<InsurancePanel[]> { return []; }
  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return []; }
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
  async updateClaimStatus(id: string, d: any) { return true; }
  async updateCMSPage(id: string, d: any) { return true; }
  async runManualBackup() { return { status: 'Success' }; }
  async toggleSecuritySetting(id: string) { return true; }
  async createAnnouncement(d: any) { return true; }
  async deleteAnnouncement(id: string) { return true; }
  async sendSMS(d: any) { return true; }
  async createRadiologyOrder(d: any) { return true; }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return true; }
  async getPatientCoverage(id: string): Promise<PatientCoverage[]> { return []; }
  async updateCMSBlog(id: string, d: any) { return true; }
  async updateCMSSlider(id: string, d: any) { return true; }
  async updateDoctorCMS(id: string, d: any) { return true; }
  async deleteCustomReport(id: string) { return true; }
  async updateDoctorStatus(id: string, s: string) { return true; }
  async createAppointment(d: any) { return { id: 'a1' } as any; }
  // Fix: Removed duplicate getSlots implementation from stubs section
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
}

export const apiService = new ApiService();
