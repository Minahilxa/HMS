
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
        { id: 'u1', name: 'System Admin', email: 'abbasminahil1@gmail.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password123' },
        { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah@healsync.com', role: UserRole.DOCTOR, username: 'doctor', password: 'password123' }
      ]));

      localStorage.setItem(DB_KEYS.EMAIL_LOGS, JSON.stringify([
        { 
          id: 'eml-1', direction: 'Incoming', senderEmail: 'patient_doe@example.com', recipientEmail: 'abbasminahil1@gmail.com', 
          subject: 'Appointment Inquiry', content: 'Hi Admin, I wanted to confirm my appointment for tomorrow.', 
          status: 'Received', timestamp: '2024-05-20 10:15 AM', type: 'General' 
        },
        { 
          id: 'eml-2', direction: 'Incoming', senderEmail: 'staff_hr@healsync.com', recipientEmail: 'abbasminahil1@gmail.com', 
          subject: 'Monthly Staff Report', content: 'The staff performance reports for April are ready for review.', 
          status: 'Received', timestamp: '2024-05-21 09:00 AM', type: 'General' 
        }
      ]));

      // Seed CMS
      localStorage.setItem(DB_KEYS.CMS_PAGES, JSON.stringify([
        { id: 'p1', title: 'About Us', slug: 'about-us', content: 'HealSync is a leading provider...', status: 'Published', lastUpdated: '2024-05-01' },
        { id: 'p2', title: 'Contact Support', slug: 'contact', content: 'Get in touch with our helpdesk...', status: 'Published', lastUpdated: '2024-05-10' }
      ]));

      localStorage.setItem(DB_KEYS.CMS_BLOGS, JSON.stringify([
        { id: 'b1', title: 'Top 10 Cardiac Tips', author: 'Dr. Sarah Wilson', category: 'Health', date: '2024-05-15', image: '', excerpt: 'Heart health is vital...', status: 'Published' }
      ]));

      localStorage.setItem(DB_KEYS.CMS_SLIDERS, JSON.stringify([
        { id: 's1', title: 'World Class Healthcare', subTitle: 'Available 24/7', imageUrl: '', buttonText: 'Book Now', buttonLink: '/book', order: 1, isActive: true }
      ]));

      localStorage.setItem(DB_KEYS.CMS_SEO, JSON.stringify([
        { id: 'seo1', pageName: 'Home', titleTag: 'HealSync HIS - Best Hospital Management', metaDescription: 'Premier healthcare management system.', keywords: 'hospital, health, records' }
      ]));

      localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify([
        { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years', displayOnWeb: true, publicBio: 'Expert in cardiology.' },
        { id: 'd2', name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years', displayOnWeb: true, publicBio: 'Specialist in neurology.' }
      ]));

      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([
        { id: 'P1001', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Chronic Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] }
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
    return { stats, revenue: [], doctors, emergencyCases: [] };
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
  
  // --- CMS CRUD ---
  async getCMSPages(): Promise<CMSPage[]> { return this.getDB(DB_KEYS.CMS_PAGES); }
  async createCMSPage(data: Partial<CMSPage>): Promise<CMSPage> {
    const pages = this.getDB<CMSPage>(DB_KEYS.CMS_PAGES);
    const newPage = { ...data, id: 'p' + Date.now(), lastUpdated: new Date().toISOString().split('T')[0] } as CMSPage;
    this.saveDB(DB_KEYS.CMS_PAGES, [...pages, newPage]);
    return newPage;
  }
  async updateCMSPage(id: string, updates: Partial<CMSPage>): Promise<boolean> {
    const pages = this.getDB<CMSPage>(DB_KEYS.CMS_PAGES);
    const idx = pages.findIndex(p => p.id === id);
    if (idx > -1) {
      pages[idx] = { ...pages[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
      this.saveDB(DB_KEYS.CMS_PAGES, pages);
      return true;
    }
    return false;
  }
  async deleteCMSPage(id: string): Promise<boolean> {
    const pages = this.getDB<CMSPage>(DB_KEYS.CMS_PAGES);
    this.saveDB(DB_KEYS.CMS_PAGES, pages.filter(p => p.id !== id));
    return true;
  }

  async getCMSBlogs(): Promise<CMSBlog[]> { return this.getDB(DB_KEYS.CMS_BLOGS); }
  async createCMSBlog(data: Partial<CMSBlog>): Promise<CMSBlog> {
    const blogs = this.getDB<CMSBlog>(DB_KEYS.CMS_BLOGS);
    const newBlog = { ...data, id: 'b' + Date.now(), date: new Date().toISOString().split('T')[0] } as CMSBlog;
    this.saveDB(DB_KEYS.CMS_BLOGS, [...blogs, newBlog]);
    return newBlog;
  }
  async updateCMSBlog(id: string, updates: Partial<CMSBlog>): Promise<boolean> {
    const blogs = this.getDB<CMSBlog>(DB_KEYS.CMS_BLOGS);
    const idx = blogs.findIndex(b => b.id === id);
    if (idx > -1) {
      blogs[idx] = { ...blogs[idx], ...updates };
      this.saveDB(DB_KEYS.CMS_BLOGS, blogs);
      return true;
    }
    return false;
  }
  async deleteCMSBlog(id: string): Promise<boolean> {
    const blogs = this.getDB<CMSBlog>(DB_KEYS.CMS_BLOGS);
    this.saveDB(DB_KEYS.CMS_BLOGS, blogs.filter(b => b.id !== id));
    return true;
  }

  async getCMSSliders(): Promise<CMSSlider[]> { return this.getDB(DB_KEYS.CMS_SLIDERS); }
  async createCMSSlider(data: Partial<CMSSlider>): Promise<CMSSlider> {
    const sliders = this.getDB<CMSSlider>(DB_KEYS.CMS_SLIDERS);
    const newSlider = { ...data, id: 's' + Date.now(), order: (data.order || sliders.length + 1) } as CMSSlider;
    this.saveDB(DB_KEYS.CMS_SLIDERS, [...sliders, newSlider]);
    return newSlider;
  }
  async updateCMSSlider(id: string, updates: Partial<CMSSlider>): Promise<boolean> {
    const sliders = this.getDB<CMSSlider>(DB_KEYS.CMS_SLIDERS);
    const idx = sliders.findIndex(s => s.id === id);
    if (idx > -1) {
      sliders[idx] = { ...sliders[idx], ...updates };
      this.saveDB(DB_KEYS.CMS_SLIDERS, sliders);
      return true;
    }
    return false;
  }
  async deleteCMSSlider(id: string): Promise<boolean> {
    const sliders = this.getDB<CMSSlider>(DB_KEYS.CMS_SLIDERS);
    this.saveDB(DB_KEYS.CMS_SLIDERS, sliders.filter(s => s.id !== id));
    return true;
  }

  async getCMSSEO(): Promise<CMSSEOSetting[]> { return this.getDB(DB_KEYS.CMS_SEO); }
  async createCMSSEO(data: Partial<CMSSEOSetting>): Promise<CMSSEOSetting> {
    const seo = this.getDB<CMSSEOSetting>(DB_KEYS.CMS_SEO);
    const newSeo = { ...data, id: 'seo' + Date.now() } as CMSSEOSetting;
    this.saveDB(DB_KEYS.CMS_SEO, [...seo, newSeo]);
    return newSeo;
  }
  async updateCMSSEO(id: string, updates: Partial<CMSSEOSetting>): Promise<boolean> {
    const seo = this.getDB<CMSSEOSetting>(DB_KEYS.CMS_SEO);
    const idx = seo.findIndex(s => s.id === id);
    if (idx > -1) {
      seo[idx] = { ...seo[idx], ...updates };
      this.saveDB(DB_KEYS.CMS_SEO, seo);
      return true;
    }
    return false;
  }
  async deleteCMSSEO(id: string): Promise<boolean> {
    const seo = this.getDB<CMSSEOSetting>(DB_KEYS.CMS_SEO);
    this.saveDB(DB_KEYS.CMS_SEO, seo.filter(s => s.id !== id));
    return true;
  }

  async updateDoctorCMS(id: string, updates: Partial<Doctor>): Promise<boolean> {
    const doctors = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const idx = doctors.findIndex(d => d.id === id);
    if (idx > -1) {
      doctors[idx] = { ...doctors[idx], ...updates };
      this.saveDB(DB_KEYS.DOCTORS, doctors);
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

  async getRevenueSummary(): Promise<RevenueData[]> { return []; }
  async getHospitalSettings(): Promise<HospitalSettings> { 
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
  }

  // --- Fix Billing Management Methods ---
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    const invoices = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const idx = invoices.findIndex(i => i.id === id);
    if (idx > -1) {
      invoices[idx] = { ...invoices[idx], ...updates };
      this.saveDB(DB_KEYS.INVOICES, invoices);
      return true;
    }
    return false;
  }

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    const invoices = this.getDB<Invoice>(DB_KEYS.INVOICES);
    const amount = data.amount || 0;
    const tax = amount * 0.1;
    const discount = data.discount || 0;
    const total = amount + tax - discount;
    const newInvoice = { 
      ...data, 
      id: 'inv' + Date.now(), 
      date: new Date().toISOString().split('T')[0],
      tax,
      total,
      status: data.status || 'Unpaid'
    } as Invoice;
    this.saveDB(DB_KEYS.INVOICES, [...invoices, newInvoice]);
    return newInvoice;
  }

  // --- Fix Insurance Management Methods ---
  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getDB(DB_KEYS.INSURANCE_PANELS); }
  async createInsurancePanel(data: Partial<InsurancePanel>): Promise<InsurancePanel> {
    const panels = this.getDB<InsurancePanel>(DB_KEYS.INSURANCE_PANELS);
    const newPanel = { ...data, id: 'pan' + Date.now() } as InsurancePanel;
    this.saveDB(DB_KEYS.INSURANCE_PANELS, [...panels, newPanel]);
    return newPanel;
  }
  async updateInsurancePanel(id: string, updates: Partial<InsurancePanel>): Promise<boolean> {
    const panels = this.getDB<InsurancePanel>(DB_KEYS.INSURANCE_PANELS);
    const idx = panels.findIndex(p => p.id === id);
    if (idx > -1) {
      panels[idx] = { ...panels[idx], ...updates };
      this.saveDB(DB_KEYS.INSURANCE_PANELS, panels);
      return true;
    }
    return false;
  }
  async deleteInsurancePanel(id: string): Promise<boolean> {
    const panels = this.getDB<InsurancePanel>(DB_KEYS.INSURANCE_PANELS);
    this.saveDB(DB_KEYS.INSURANCE_PANELS, panels.filter(p => p.id !== id));
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
    const all = this.getDB<PatientCoverage>(DB_KEYS.PATIENT_COVERAGE);
    return all.filter(c => c.patientId === patientId);
  }
  async createPatientCoverage(data: Partial<PatientCoverage>): Promise<PatientCoverage> {
    const coverages = this.getDB<PatientCoverage>(DB_KEYS.PATIENT_COVERAGE);
    const newCoverage = { ...data, id: 'cov' + Date.now(), status: 'Verified' } as PatientCoverage;
    this.saveDB(DB_KEYS.PATIENT_COVERAGE, [...coverages, newCoverage]);
    return newCoverage;
  }

  // --- Fix Pharmacy Management Methods ---
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getDB(DB_KEYS.PHARMACY_INV); }
  async createPharmacyItem(data: Partial<PharmacyItem>): Promise<PharmacyItem> {
    const items = this.getDB<PharmacyItem>(DB_KEYS.PHARMACY_INV);
    const newItem = { ...data, id: 'inv' + Date.now() } as PharmacyItem;
    this.saveDB(DB_KEYS.PHARMACY_INV, [...items, newItem]);
    return newItem;
  }
  async updatePharmacyItem(id: string, updates: Partial<PharmacyItem>): Promise<boolean> {
    const items = this.getDB<PharmacyItem>(DB_KEYS.PHARMACY_INV);
    const idx = items.findIndex(i => i.id === id);
    if (idx > -1) {
      items[idx] = { ...items[idx], ...updates };
      this.saveDB(DB_KEYS.PHARMACY_INV, items);
      return true;
    }
    return false;
  }
  async deletePharmacyItem(id: string): Promise<boolean> {
    const items = this.getDB<PharmacyItem>(DB_KEYS.PHARMACY_INV);
    this.saveDB(DB_KEYS.PHARMACY_INV, items.filter(i => i.id !== id));
    return true;
  }

  async getPharmacySales(): Promise<PharmacySale[]> { return this.getDB(DB_KEYS.PHARMACY_SALES); }
  async createPharmacySale(data: Partial<PharmacySale>): Promise<PharmacySale> {
    const sales = this.getDB<PharmacySale>(DB_KEYS.PHARMACY_SALES);
    const newSale = { ...data, id: 'sale' + Date.now(), date: new Date().toISOString().split('T')[0] } as PharmacySale;
    this.saveDB(DB_KEYS.PHARMACY_SALES, [...sales, newSale]);
    return newSale;
  }
  async updatePharmacySale(id: string, updates: Partial<PharmacySale>): Promise<boolean> {
    const sales = this.getDB<PharmacySale>(DB_KEYS.PHARMACY_SALES);
    const idx = sales.findIndex(s => s.id === id);
    if (idx > -1) {
      sales[idx] = { ...sales[idx], ...updates };
      this.saveDB(DB_KEYS.PHARMACY_SALES, sales);
      return true;
    }
    return false;
  }
  async deletePharmacySale(id: string): Promise<boolean> {
    const sales = this.getDB<PharmacySale>(DB_KEYS.PHARMACY_SALES);
    this.saveDB(DB_KEYS.PHARMACY_SALES, sales.filter(s => s.id !== id));
    return true;
  }

  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return this.getDB(DB_KEYS.PHARMACY_SUPP); }
  async createPharmacySupplier(data: Partial<PharmacySupplier>): Promise<PharmacySupplier> {
    const suppliers = this.getDB<PharmacySupplier>(DB_KEYS.PHARMACY_SUPP);
    const newSupplier = { ...data, id: 'sup' + Date.now() } as PharmacySupplier;
    this.saveDB(DB_KEYS.PHARMACY_SUPP, [...suppliers, newSupplier]);
    return newSupplier;
  }
  async updatePharmacySupplier(id: string, updates: Partial<PharmacySupplier>): Promise<boolean> {
    const suppliers = this.getDB<PharmacySupplier>(DB_KEYS.PHARMACY_SUPP);
    const idx = suppliers.findIndex(s => s.id === id);
    if (idx > -1) {
      suppliers[idx] = { ...suppliers[idx], ...updates };
      this.saveDB(DB_KEYS.PHARMACY_SUPP, suppliers);
      return true;
    }
    return false;
  }
  async deletePharmacySupplier(id: string): Promise<boolean> {
    const suppliers = this.getDB<PharmacySupplier>(DB_KEYS.PHARMACY_SUPP);
    this.saveDB(DB_KEYS.PHARMACY_SUPP, suppliers.filter(s => s.id !== id));
    return true;
  }

  // --- Communication Hub ---
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return this.getDB(DB_KEYS.ANNOUNCEMENTS); }
  async createAnnouncement(data: Partial<InternalAnnouncement>): Promise<boolean> {
    const items = this.getDB<InternalAnnouncement>(DB_KEYS.ANNOUNCEMENTS);
    const newItem = { ...data, id: 'ann' + Date.now(), date: new Date().toISOString().split('T')[0], author: 'System Admin' } as InternalAnnouncement;
    this.saveDB(DB_KEYS.ANNOUNCEMENTS, [...items, newItem]);
    return true;
  }
  async deleteAnnouncement(id: string): Promise<boolean> {
    const items = this.getDB<InternalAnnouncement>(DB_KEYS.ANNOUNCEMENTS);
    this.saveDB(DB_KEYS.ANNOUNCEMENTS, items.filter(i => i.id !== id));
    return true;
  }

  async getSMSLogs(): Promise<SMSLog[]> { return this.getDB(DB_KEYS.SMS_LOGS); }
  async sendSMS(data: Partial<SMSLog>): Promise<boolean> {
    const logs = this.getDB<SMSLog>(DB_KEYS.SMS_LOGS);
    const newLog = { ...data, id: 'sms' + Date.now(), timestamp: new Date().toLocaleString(), status: 'Sent' } as SMSLog;
    this.saveDB(DB_KEYS.SMS_LOGS, [...logs, newLog]);
    return true;
  }

  async getEmailLogs(): Promise<EmailLog[]> { return this.getDB(DB_KEYS.EMAIL_LOGS); }
  async sendEmail(data: Partial<EmailLog>): Promise<boolean> {
    const logs = this.getDB<EmailLog>(DB_KEYS.EMAIL_LOGS);
    const newLog = { 
      ...data, 
      id: 'eml' + Date.now(), 
      timestamp: new Date().toLocaleString(), 
      status: 'Sent',
      direction: 'Outgoing'
    } as EmailLog;
    this.saveDB(DB_KEYS.EMAIL_LOGS, [...logs, newLog]);
    return true;
  }

  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> { return []; }
  async getCustomReports(): Promise<CustomReport[]> { return []; }
  async getEmergencyCases(): Promise<EmergencyCase[]> { return []; }
  async getEmergencyNumbers(): Promise<EmergencyNumber[]> { return []; }
  async getPaymentGateways(): Promise<PaymentGateway[]> { return []; }
  async getBackupLogs(): Promise<BackupLog[]> { return []; }
  async getSecuritySettings(): Promise<SecuritySetting[]> { return []; }
  async updateUserRole(id: string, r: any) { return true; }
  async runManualBackup() { return { status: 'Success' }; }
  async toggleSecuritySetting(id: string) { return true; }
  async createRadiologyOrder(d: any) { return true; }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return true; }
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
  async createDoctor(d: any) { return {}; }
  async updateDoctor(id: string, d: any) { return true; }
  async updateLeaveStatus(id: string, s: string) { return true; }
  async updateHospitalSettings(d: any) { return true; }
  async updateSampleStatus(id: string, status: any, result?: string) { return true; }
  async getPatientGrowth(): Promise<PatientGrowthEntry[]> { return []; }
  async getCustomReport(id: string): Promise<CustomReport | null> { return null; }
  async getReports(): Promise<CustomReport[]> { return []; }
}

export const apiService = new ApiService();
