
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
  CMS_BLOGS: 'healsync_db_cms_blogs',
  CMS_SLIDERS: 'healsync_db_cms_sliders',
  CMS_SEO: 'healsync_db_cms_seo',
  ANNOUNCEMENTS: 'healsync_db_announcements',
  SMS_LOGS: 'healsync_db_sms_logs',
  EMAIL_LOGS: 'healsync_db_email_logs',
  SETTINGS: 'healsync_db_settings',
  EMERGENCY_NUMS: 'healsync_db_emergency_nums',
  EMERGENCY_CASES: 'healsync_db_emergency_cases',
  PAYMENTS: 'healsync_db_payments',
  BACKUPS: 'healsync_db_backups',
  SECURITY: 'healsync_db_security',
  LEAVES: 'healsync_db_leaves',
  PERFORMANCE: 'healsync_db_performance',
  SLOTS: 'healsync_db_slots',
  ACCESS_HISTORY: 'healsync_db_access_logs',
  INVITATIONS: 'healsync_db_invitations'
};

class ApiService {
  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([
        { id: 'u1', name: 'System Admin', email: 'abbasminahil1@gmail.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password123' },
        { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah@healsync.com', role: UserRole.DOCTOR, username: 'doctor', password: 'password123' }
      ]));

      localStorage.setItem(DB_KEYS.EMAIL_LOGS, JSON.stringify([
        { 
          id: 'eml-1', direction: 'Incoming', senderEmail: 'patient_doe@example.com', recipientEmail: 'abbasminahil1@gmail.com', 
          subject: 'Appointment Inquiry', content: 'Hi Admin, I wanted to confirm my appointment for tomorrow.', 
          status: 'Received', timestamp: '2024-05-20 10:15 AM', type: 'General' 
        }
      ]));

      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({
        name: 'HealSync General Hospital', tagline: 'Excellence in Clinical Care', address: '123 Medical Blvd, Health City', email: 'info@healsync.com', phone: '+1 234 567 890', website: 'www.healsync.com', opdTimings: 'Mon-Sat: 08:00 AM - 08:00 PM'
      }));

      localStorage.setItem(DB_KEYS.EMERGENCY_NUMS, JSON.stringify([
        { id: 'en1', label: 'Main Emergency Line', number: '911-001', department: 'General' },
        { id: 'en2', label: 'Cardiac ER', number: '911-005', department: 'Cardiology' }
      ]));

      localStorage.setItem(DB_KEYS.EMERGENCY_CASES, JSON.stringify([
        { id: 'ec1', patientName: 'Unknown Male', arrivalType: 'Ambulance', priority: 'Critical', timestamp: new Date().toLocaleString(), assignedDoctor: 'Dr. Sarah Wilson' }
      ]));

      localStorage.setItem(DB_KEYS.PAYMENTS, JSON.stringify([
        { id: 'pay1', provider: 'Stripe Corporate', merchantId: 'm_stripe_001', status: 'Active', methods: ['Card', 'UPI'] }
      ]));

      localStorage.setItem(DB_KEYS.SECURITY, JSON.stringify([
        { id: 'sec1', label: 'Two-Factor Authentication', description: 'Require staff to verify login via SMS.', isEnabled: true, category: 'Access' },
        { id: 'sec2', label: 'Encrypted EHR Exports', description: 'Automatic encryption for clinical data exports.', isEnabled: false, category: 'Data' }
      ]));
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
    const emergencyCases = await this.getEmergencyCases();
    const revenue = await this.getRevenueSummary();
    return { stats, revenue, doctors, emergencyCases };
  }

  // --- CRUD HELPERS ---
  private async create<T>(key: string, data: Partial<T>, prefix: string): Promise<T> {
    const items = this.getDB<any>(key);
    const newItem = { ...data, id: `${prefix}-${Date.now()}` } as any;
    this.saveDB(key, [...items, newItem]);
    return newItem as T;
  }

  private async update<T>(key: string, id: string, updates: Partial<T>): Promise<boolean> {
    const items = this.getDB<any>(key);
    const idx = items.findIndex((i: any) => i.id === id);
    if (idx > -1) {
      items[idx] = { ...items[idx], ...updates };
      this.saveDB(key, items);
      return true;
    }
    return false;
  }

  private async remove(key: string, id: string): Promise<boolean> {
    const items = this.getDB<any>(key);
    this.saveDB(key, items.filter((i: any) => i.id !== id));
    return true;
  }

  // --- ENTITY METHODS ---
  async getUsers(): Promise<User[]> { return this.getDB(DB_KEYS.USERS); }
  async updateUserRole(id: string, r: any) { return this.update(DB_KEYS.USERS, id, { role: r }); }
  
  async sendUserInvitation(email: string, role: UserRole): Promise<boolean> {
    const invitations = this.getDB<any>(DB_KEYS.INVITATIONS);
    const newInvitation = {
      id: `INV-${Date.now()}`,
      email,
      role,
      status: 'Sent',
      timestamp: new Date().toLocaleString()
    };
    this.saveDB(DB_KEYS.INVITATIONS, [...invitations, newInvitation]);
    
    // Also log it as an email if applicable
    await this.sendEmail({
      senderEmail: 'abbasminahil1@gmail.com',
      recipientEmail: email,
      subject: 'Hospital System Invitation',
      content: `You have been invited to join the HealSync HIS as a ${role}. Please use this link to set up your account.`,
      direction: 'Outgoing',
      type: 'General'
    });

    return true;
  }

  async getPatients(): Promise<Patient[]> { return this.getDB(DB_KEYS.PATIENTS); }
  async getDoctors(): Promise<Doctor[]> { return this.getDB(DB_KEYS.DOCTORS); }
  async getAppointments(): Promise<Appointment[]> { return this.getDB(DB_KEYS.APPOINTMENTS); }
  async getDepartments(): Promise<HospitalDepartment[]> { return this.getDB(DB_KEYS.DEPARTMENTS); }
  async getServices(): Promise<HospitalService[]> { return this.getDB(DB_KEYS.SERVICES); }
  async getInvoices(): Promise<Invoice[]> { return this.getDB(DB_KEYS.INVOICES); }
  async getLabSamples(): Promise<LabSample[]> { return this.getDB(DB_KEYS.LAB_SAMPLES); }
  async getRadiologyOrders(): Promise<RadiologyOrder[]> { return this.getDB(DB_KEYS.RADIO_ORDERS); }
  async getLeaveRequests(): Promise<LeaveRequest[]> { return this.getDB(DB_KEYS.LEAVES); }
  async getSlots(): Promise<TimeSlot[]> { return this.getDB(DB_KEYS.SLOTS); }
  async getDoctorPerformance(): Promise<DoctorPerformance[]> { return this.getDB(DB_KEYS.PERFORMANCE); }
  async getAccessHistory(): Promise<AccessHistory[]> { return this.getDB(DB_KEYS.ACCESS_HISTORY); }
  
  // --- EMERGENCY CRUD ---
  async getEmergencyNumbers(): Promise<EmergencyNumber[]> { return this.getDB(DB_KEYS.EMERGENCY_NUMS); }
  async createEmergencyNumber(d: Partial<EmergencyNumber>): Promise<EmergencyNumber> { return this.create<EmergencyNumber>(DB_KEYS.EMERGENCY_NUMS, d, 'EN'); }
  async updateEmergencyNumber(id: string, d: Partial<EmergencyNumber>) { return this.update(DB_KEYS.EMERGENCY_NUMS, id, d); }
  async deleteEmergencyNumber(id: string) { return this.remove(DB_KEYS.EMERGENCY_NUMS, id); }

  async getEmergencyCases(): Promise<EmergencyCase[]> { return this.getDB(DB_KEYS.EMERGENCY_CASES); }
  async createEmergencyCase(d: Partial<EmergencyCase>): Promise<EmergencyCase> { return this.create<EmergencyCase>(DB_KEYS.EMERGENCY_CASES, { ...d, timestamp: new Date().toLocaleString() }, 'EC'); }
  async updateEmergencyCase(id: string, d: Partial<EmergencyCase>) { return this.update(DB_KEYS.EMERGENCY_CASES, id, d); }
  async deleteEmergencyCase(id: string) { return this.remove(DB_KEYS.EMERGENCY_CASES, id); }

  // --- PAYMENTS CRUD ---
  async getPaymentGateways(): Promise<PaymentGateway[]> { return this.getDB(DB_KEYS.PAYMENTS); }
  async createPaymentGateway(d: Partial<PaymentGateway>): Promise<PaymentGateway> { return this.create<PaymentGateway>(DB_KEYS.PAYMENTS, d, 'GW'); }
  async updatePaymentGateway(id: string, d: Partial<PaymentGateway>) { return this.update(DB_KEYS.PAYMENTS, id, d); }
  async deletePaymentGateway(id: string) { return this.remove(DB_KEYS.PAYMENTS, id); }

  // --- SECURITY CRUD ---
  async getSecuritySettings(): Promise<SecuritySetting[]> { return this.getDB(DB_KEYS.SECURITY); }
  async createSecuritySetting(d: Partial<SecuritySetting>): Promise<SecuritySetting> { return this.create<SecuritySetting>(DB_KEYS.SECURITY, d, 'SEC'); }
  async updateSecuritySetting(id: string, d: Partial<SecuritySetting>) { return this.update(DB_KEYS.SECURITY, id, d); }
  async deleteSecuritySetting(id: string) { return this.remove(DB_KEYS.SECURITY, id); }
  async toggleSecuritySetting(id: string) {
    const items = this.getDB<SecuritySetting>(DB_KEYS.SECURITY);
    const item = items.find(i => i.id === id);
    if (item) return this.update(DB_KEYS.SECURITY, id, { isEnabled: !item.isEnabled });
    return false;
  }

  // --- BACKUPS ---
  async getBackupLogs(): Promise<BackupLog[]> { return this.getDB(DB_KEYS.BACKUPS); }
  async runManualBackup() {
    const logs = this.getDB<BackupLog>(DB_KEYS.BACKUPS);
    const newLog = { 
      id: `BK-${Date.now()}`, 
      timestamp: new Date().toLocaleString(), 
      size: `${(Math.random() * 50 + 10).toFixed(2)} MB`, 
      status: 'Success', 
      type: 'Manual' 
    } as BackupLog;
    this.saveDB(DB_KEYS.BACKUPS, [newLog, ...logs]);
    return { status: 'Success' };
  }
  async deleteBackup(id: string) { return this.remove(DB_KEYS.BACKUPS, id); }

  // --- SETTINGS ---
  async getHospitalSettings(): Promise<HospitalSettings> { 
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
  }
  async updateHospitalSettings(d: Partial<HospitalSettings>) {
    const current = await this.getHospitalSettings();
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({ ...current, ...d }));
    return true;
  }

  // --- DASHBOARD ---
  async getDashboardStats(): Promise<DashboardStats> {
    const patients = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const doctors = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const invoices = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const cases = this.getDB<EmergencyCase>(DB_KEYS.EMERGENCY_CASES);
    return {
      dailyAppointments: 0,
      opdPatients: patients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: patients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: cases.length,
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

  // STUBS FOR OTHER MODULES
  async getCMSPages(): Promise<CMSPage[]> { return this.getDB(DB_KEYS.CMS_PAGES); }
  async getCMSBlogs(): Promise<CMSBlog[]> { return this.getDB(DB_KEYS.CMS_BLOGS); }
  async getCMSSliders(): Promise<CMSSlider[]> { return this.getDB(DB_KEYS.CMS_SLIDERS); }
  async getCMSSEO(): Promise<CMSSEOSetting[]> { return this.getDB(DB_KEYS.CMS_SEO); }
  async createCMSPage(d: any): Promise<CMSPage> { return this.create<CMSPage>(DB_KEYS.CMS_PAGES, d, 'PG'); }
  async updateCMSPage(id: string, d: any) { return this.update(DB_KEYS.CMS_PAGES, id, d); }
  async deleteCMSPage(id: string) { return this.remove(DB_KEYS.CMS_PAGES, id); }
  async createCMSBlog(d: any): Promise<CMSBlog> { return this.create<CMSBlog>(DB_KEYS.CMS_BLOGS, d, 'BL'); }
  async updateCMSBlog(id: string, d: any) { return this.update(DB_KEYS.CMS_BLOGS, id, d); }
  async deleteCMSBlog(id: string) { return this.remove(DB_KEYS.CMS_BLOGS, id); }
  async createCMSSlider(d: any): Promise<CMSSlider> { return this.create<CMSSlider>(DB_KEYS.CMS_SLIDERS, d, 'SL'); }
  async updateCMSSlider(id: string, d: any) { return this.update(DB_KEYS.CMS_SLIDERS, id, d); }
  async deleteCMSSlider(id: string) { return this.remove(DB_KEYS.CMS_SLIDERS, id); }
  async createCMSSEO(d: any): Promise<CMSSEOSetting> { return this.create<CMSSEOSetting>(DB_KEYS.CMS_SEO, d, 'SEO'); }
  async updateCMSSEO(id: string, d: any) { return this.update(DB_KEYS.CMS_SEO, id, d); }
  async deleteCMSSEO(id: string) { return this.remove(DB_KEYS.CMS_SEO, id); }
  async updateDoctorCMS(id: string, d: any) { return this.update(DB_KEYS.DOCTORS, id, d); }

  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return this.getDB(DB_KEYS.ANNOUNCEMENTS); }
  async createAnnouncement(d: any): Promise<InternalAnnouncement> { return this.create<InternalAnnouncement>(DB_KEYS.ANNOUNCEMENTS, d, 'ANN'); }
  async deleteAnnouncement(id: string) { return this.remove(DB_KEYS.ANNOUNCEMENTS, id); }
  async getSMSLogs(): Promise<SMSLog[]> { return this.getDB(DB_KEYS.SMS_LOGS); }
  async sendSMS(d: any): Promise<SMSLog> { return this.create<SMSLog>(DB_KEYS.SMS_LOGS, d, 'SMS'); }
  async getEmailLogs(): Promise<EmailLog[]> { return this.getDB(DB_KEYS.EMAIL_LOGS); }
  async sendEmail(d: any): Promise<EmailLog> { return this.create<EmailLog>(DB_KEYS.EMAIL_LOGS, d, 'EML'); }

  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getDB(DB_KEYS.INSURANCE_PANELS); }
  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return this.getDB(DB_KEYS.INSURANCE_CLAIMS); }
  async createInsurancePanel(d: any): Promise<InsurancePanel> { return this.create<InsurancePanel>(DB_KEYS.INSURANCE_PANELS, d, 'PAN'); }
  async updateInsurancePanel(id: string, d: any) { return this.update(DB_KEYS.INSURANCE_PANELS, id, d); }
  async deleteInsurancePanel(id: string) { return this.remove(DB_KEYS.INSURANCE_PANELS, id); }
  async updateClaimStatus(id: string, d: any) { return this.update(DB_KEYS.INSURANCE_CLAIMS, id, d); }
  async getPatientCoverage(id: string): Promise<PatientCoverage[]> { return this.getDB<PatientCoverage>(DB_KEYS.PATIENT_COVERAGE).filter((c: any) => c.patientId === id); }
  async createPatientCoverage(d: any): Promise<PatientCoverage> { return this.create<PatientCoverage>(DB_KEYS.PATIENT_COVERAGE, d, 'COV'); }

  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getDB(DB_KEYS.PHARMACY_INV); }
  async createPharmacyItem(d: any): Promise<PharmacyItem> { return this.create<PharmacyItem>(DB_KEYS.PHARMACY_INV, d, 'DRG'); }
  async updatePharmacyItem(id: string, d: any) { return this.update(DB_KEYS.PHARMACY_INV, id, d); }
  async deletePharmacyItem(id: string) { return this.remove(DB_KEYS.PHARMACY_INV, id); }
  async getPharmacySales(): Promise<PharmacySale[]> { return this.getDB(DB_KEYS.PHARMACY_SALES); }
  async createPharmacySale(d: any): Promise<PharmacySale> { return this.create<PharmacySale>(DB_KEYS.PHARMACY_SALES, d, 'SL'); }
  async updatePharmacySale(id: string, d: any) { return this.update(DB_KEYS.PHARMACY_SALES, id, d); }
  async deletePharmacySale(id: string) { return this.remove(DB_KEYS.PHARMACY_SALES, id); }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return this.getDB(DB_KEYS.PHARMACY_SUPP); }
  async createPharmacySupplier(d: any): Promise<PharmacySupplier> { return this.create<PharmacySupplier>(DB_KEYS.PHARMACY_SUPP, d, 'SUP'); }
  async updatePharmacySupplier(id: string, d: any) { return this.update(DB_KEYS.PHARMACY_SUPP, id, d); }
  async deletePharmacySupplier(id: string) { return this.remove(DB_KEYS.PHARMACY_SUPP, id); }

  async getLabTests(): Promise<LabTest[]> { return this.getDB(DB_KEYS.LAB_TESTS); }
  async createRadiologyOrder(d: any): Promise<RadiologyOrder> { return this.create<RadiologyOrder>(DB_KEYS.RADIO_ORDERS, d, 'RAD'); }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return this.update(DB_KEYS.RADIO_ORDERS, id, { status: s as any, radiologistNotes: n }); }
  async updateSampleStatus(id: string, s: string, r?: string) { return this.update(DB_KEYS.LAB_SAMPLES, id, { status: s as any, result: r }); }
  async registerPatient(d: any): Promise<Patient> { return this.create<Patient>(DB_KEYS.PATIENTS, d, 'P'); }
  async updatePatient(id: string, d: any) { return this.update(DB_KEYS.PATIENTS, id, d); }
  async addEHRRecord(id: string, d: any) { 
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const pt = pts.find(p => p.id === id);
    if (pt) {
      pt.medicalHistory.push({ ...d, id: `EHR-${Date.now()}` });
      this.saveDB(DB_KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }
  async addPrescription(id: string, d: any) {
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const pt = pts.find(p => p.id === id);
    if (pt) {
      pt.prescriptions.push({ ...d, id: `PR-${Date.now()}` });
      this.saveDB(DB_KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }
  async createDepartment(d: any): Promise<HospitalDepartment> { return this.create<HospitalDepartment>(DB_KEYS.DEPARTMENTS, d, 'DEP'); }
  async updateDepartment(id: string, d: any) { return this.update(DB_KEYS.DEPARTMENTS, id, d); }
  async createService(d: any): Promise<HospitalService> { return this.create<HospitalService>(DB_KEYS.SERVICES, d, 'SRV'); }
  async updateService(id: string, d: any) { return this.update(DB_KEYS.SERVICES, id, d); }
  async deleteService(id: string) { return this.remove(DB_KEYS.SERVICES, id); }
  async createDoctor(d: any): Promise<Doctor> { return this.create<Doctor>(DB_KEYS.DOCTORS, d, 'D'); }
  async updateDoctor(id: string, d: any) { return this.update(DB_KEYS.DOCTORS, id, d); }
  async updateDoctorStatus(id: string, s: string) { return this.update(DB_KEYS.DOCTORS, id, { status: s as any }); }
  async createAppointment(d: any): Promise<Appointment> { return this.create<Appointment>(DB_KEYS.APPOINTMENTS, d, 'APT'); }
  async updateAppointmentStatus(id: string, s: string) { return this.update(DB_KEYS.APPOINTMENTS, id, { status: s as any }); }
  async createSlot(d: any): Promise<TimeSlot> { return this.create<TimeSlot>(DB_KEYS.SLOTS, d, 'SLT'); }
  async updateLeaveStatus(id: string, s: string) { return this.update(DB_KEYS.LEAVES, id, { status: s as any }); }
  async updateInvoice(id: string, d: any) { return this.update(DB_KEYS.INVOICES, id, d); }
  async createInvoice(d: any): Promise<Invoice> { 
    const items = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const amount = d.amount || 0;
    const tax = amount * 0.1;
    const total = amount + tax - (d.discount || 0);
    const newInv = { ...d, id: `INV-${Date.now()}`, date: new Date().toISOString().split('T')[0], tax, total, status: 'Unpaid' } as Invoice;
    this.saveDB(DB_KEYS.INVOICES, [...items, newInv]);
    return newInv;
  }
  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> { return []; }
  async getCustomReports(): Promise<CustomReport[]> { return []; }
  async deleteCustomReport(id: string) { return true; }
}

export const apiService = new ApiService();
