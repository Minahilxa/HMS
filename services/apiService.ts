
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
  PatientStatus, AppointmentSource, BillingCategory
} from '../types';

// STORAGE KEYS
const KEYS = {
  USERS: 'his_db_users',
  PATIENTS: 'his_db_patients',
  DOCTORS: 'his_db_doctors',
  APPOINTMENTS: 'his_db_appointments',
  DEPARTMENTS: 'his_db_departments',
  SERVICES: 'his_db_services',
  LAB_TESTS: 'his_db_lab_tests',
  LAB_SAMPLES: 'his_db_lab_samples',
  RADIO_ORDERS: 'his_db_radio_orders',
  PHARMACY_INV: 'his_db_pharmacy_inv',
  PHARMACY_SALES: 'his_db_pharmacy_sales',
  PHARMACY_SUPP: 'his_db_pharmacy_supp',
  INVOICES: 'his_db_invoices',
  INSURANCE_PANELS: 'his_db_insurance_panels',
  INSURANCE_CLAIMS: 'his_db_insurance_claims',
  INSURANCE_COV: 'his_db_insurance_cov',
  CMS_PAGES: 'his_db_cms_pages',
  CMS_BLOGS: 'his_db_cms_blogs',
  CMS_SLIDERS: 'his_db_cms_sliders',
  CMS_SEO: 'his_db_cms_seo',
  ANNOUNCEMENTS: 'his_db_announcements',
  SMS_LOGS: 'his_db_sms_logs',
  EMAIL_LOGS: 'his_db_email_logs',
  SETTINGS: 'his_db_settings',
  LEAVES: 'his_db_leaves',
  PERFORMANCE: 'his_db_performance',
  ACCESS_LOGS: 'his_db_access_logs',
  REPORTS: 'his_db_reports'
};

class ApiService {
  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([
        { id: 'u1', name: 'System Admin', email: 'admin@healsync.com', role: UserRole.SUPER_ADMIN, username: 'admin', password: 'password' }
      ]));
      
      localStorage.setItem(KEYS.DOCTORS, JSON.stringify([
        { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years', displayOnWeb: true, publicBio: 'Expert in non-invasive cardiology.' },
        { id: 'd2', name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years', displayOnWeb: true, publicBio: 'Specialist in neuro-degenerative disorders.' }
      ]));

      localStorage.setItem(KEYS.PATIENTS, JSON.stringify([
        { id: 'p1', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] },
        { id: 'p2', name: 'Jane Smith', age: 29, gender: 'Female', status: PatientStatus.IPD, admissionDate: '2024-05-18', diagnosis: 'Acute Appendicitis', phone: '555-0102', medicalHistory: [], prescriptions: [] }
      ]));

      localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify([
        { id: 'dept1', name: 'Cardiology', description: 'Specialized heart care and diagnostics.', headDoctorId: 'd1', staffCount: 15, status: 'Active' },
        { id: 'dept2', name: 'Neurology', description: 'Brain and nervous system treatment.', headDoctorId: 'd2', staffCount: 12, status: 'Active' }
      ]));

      localStorage.setItem(KEYS.SETTINGS, JSON.stringify({
        name: 'HealSync General Hospital', tagline: 'Excellence in Care', address: '123 Medical Blvd, Health City', email: 'info@healsync.com', phone: '+1 234 567 890', website: 'www.healsync.com', opdTimings: 'Mon-Sat: 08:00 AM - 08:00 PM'
      }));
    }
  }

  private getData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveData<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- AUTHENTICATION ---
  async login(credentials: any): Promise<{ user: User; token: string }> {
    const users = this.getData<any>(KEYS.USERS);
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
    
    if (user) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 400));
      return { user, token: 'simulated_jwt_token_' + Date.now() };
    }
    throw new Error('Invalid credentials. Hint: use admin/password');
  }

  // --- OPTIMIZED DASHBOARD ---
  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    const apts = this.getData<Appointment>(KEYS.APPOINTMENTS);
    const patients = this.getData<Patient>(KEYS.PATIENTS);
    const doctors = this.getData<Doctor>(KEYS.DOCTORS).filter(d => d.status === 'On Duty');
    
    const stats: DashboardStats = {
      dailyAppointments: apts.length,
      opdPatients: patients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: patients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: 0,
      totalRevenue: 0,
      doctorsOnDuty: doctors.length
    };

    return {
      stats,
      revenue: [
        { date: '2024-05-10', amount: 4500, category: 'OPD' },
        { date: '2024-05-12', amount: 6200, category: 'IPD' },
        { date: '2024-05-14', amount: 3800, category: 'Lab' },
        { date: '2024-05-16', amount: 8400, category: 'Surgery' },
        { date: '2024-05-18', amount: 5100, category: 'Pharmacy' }
      ],
      doctors,
      emergencyCases: []
    };
  }

  // --- CRUD METHODS (SIMULATED) ---
  async getUsers(): Promise<User[]> { return this.getData<User>(KEYS.USERS); }
  async getPatients(): Promise<Patient[]> { return this.getData<Patient>(KEYS.PATIENTS); }
  async getDoctors(): Promise<Doctor[]> { return this.getData<Doctor>(KEYS.DOCTORS); }
  async getAppointments(): Promise<Appointment[]> { return this.getData<Appointment>(KEYS.APPOINTMENTS); }
  async getDepartments(): Promise<HospitalDepartment[]> { return this.getData<HospitalDepartment>(KEYS.DEPARTMENTS); }
  async getHospitalSettings(): Promise<HospitalSettings> { 
    const s = localStorage.getItem(KEYS.SETTINGS);
    return s ? JSON.parse(s) : { name: 'HealSync General Hospital' };
  }

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    const patients = this.getData<Patient>(KEYS.PATIENTS);
    const newPatient = { ...data, id: 'p' + (patients.length + 1), medicalHistory: [], prescriptions: [] } as Patient;
    this.saveData(KEYS.PATIENTS, [...patients, newPatient]);
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const patients = this.getData<Patient>(KEYS.PATIENTS);
    const idx = patients.findIndex(p => p.id === id);
    if (idx > -1) {
      patients[idx] = { ...patients[idx], ...updates };
      this.saveData(KEYS.PATIENTS, patients);
      return patients[idx];
    }
    throw new Error('Patient not found');
  }

  async createAppointment(data: any): Promise<Appointment> {
    const apts = this.getData<Appointment>(KEYS.APPOINTMENTS);
    const newApt = { ...data, id: 'apt' + (apts.length + 1), status: 'Scheduled' };
    this.saveData(KEYS.APPOINTMENTS, [...apts, newApt]);
    return newApt;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    const apts = this.getData<Appointment>(KEYS.APPOINTMENTS);
    const idx = apts.findIndex(a => a.id === id);
    if (idx > -1) {
      apts[idx].status = status as any;
      this.saveData(KEYS.APPOINTMENTS, apts);
      return true;
    }
    return false;
  }

  // --- FALLBACKS ---
  async getDashboardStats(): Promise<DashboardStats> { return (await this.getInitDashboard()).stats; }
  async getRevenueSummary(): Promise<any[]> { return (await this.getInitDashboard()).revenue; }
  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> { return []; }
  async getDoctorPerformance(): Promise<DoctorPerformance[]> { return []; }
  async getCustomReports(): Promise<CustomReport[]> { return []; }
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return this.getData(KEYS.ANNOUNCEMENTS); }
  async getSMSLogs(): Promise<SMSLog[]> { return this.getData(KEYS.SMS_LOGS); }
  async getEmailLogs(): Promise<EmailLog[]> { return this.getData(KEYS.EMAIL_LOGS); }
  async getLabTests(): Promise<LabTest[]> { return this.getData(KEYS.LAB_TESTS); }
  async getLabSamples(): Promise<LabSample[]> { return this.getData(KEYS.LAB_SAMPLES); }
  async getRadiologyOrders(): Promise<RadiologyOrder[]> { return this.getData(KEYS.RADIO_ORDERS); }
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getData(KEYS.PHARMACY_INV); }
  async getInvoices(): Promise<Invoice[]> { return this.getData(KEYS.INVOICES); }
  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getData(KEYS.INSURANCE_PANELS); }
  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return this.getData(KEYS.INSURANCE_CLAIMS); }
  async getCMSPages(): Promise<CMSPage[]> { return this.getData(KEYS.CMS_PAGES); }
  async getCMSBlogs(): Promise<CMSBlog[]> { return this.getData(KEYS.CMS_BLOGS); }
  async getCMSSliders(): Promise<CMSSlider[]> { return this.getData(KEYS.CMS_SLIDERS); }
  async getCMSSEO(): Promise<CMSSEOSetting[]> { return this.getData(KEYS.CMS_SEO); }
  async getLeaveRequests(): Promise<LeaveRequest[]> { return this.getData(KEYS.LEAVES); }
  async getEmergencyCases(): Promise<EmergencyCase[]> { return []; }
  async getSlots(): Promise<TimeSlot[]> { return []; }
  async getServices(): Promise<HospitalService[]> { return this.getData(KEYS.SERVICES); }
  async getAccessHistory(): Promise<AccessHistory[]> { return this.getData(KEYS.ACCESS_LOGS); }
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> { return true; }
  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> { return true; }
  async updateLeaveStatus(id: string, status: string): Promise<boolean> { return true; }
  async addEHRRecord(pId: string, data: any): Promise<boolean> { 
    const pts = this.getData<Patient>(KEYS.PATIENTS);
    const p = pts.find(p => p.id === pId);
    if (p) {
      p.medicalHistory.push({ ...data, id: 'ehr' + Date.now(), date: new Date().toISOString().split('T')[0] });
      this.saveData(KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }
  async addPrescription(pId: string, data: any): Promise<boolean> { 
    const pts = this.getData<Patient>(KEYS.PATIENTS);
    const p = pts.find(p => p.id === pId);
    if (p) {
      p.prescriptions.push({ ...data, id: 'pres' + Date.now(), date: new Date().toISOString().split('T')[0] });
      this.saveData(KEYS.PATIENTS, pts);
      return true;
    }
    return false;
  }
  async updateHospitalSettings(data: any): Promise<boolean> { 
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data));
    return true; 
  }
  async getEmergencyNumbers(): Promise<EmergencyNumber[]> { return []; }
  async getPaymentGateways(): Promise<PaymentGateway[]> { return []; }
  async getBackupLogs(): Promise<BackupLog[]> { return []; }
  async getSecuritySettings(): Promise<SecuritySetting[]> { return []; }
  async runManualBackup(): Promise<any> { return { status: 'Success' }; }
  async toggleSecuritySetting(id: string): Promise<boolean> { return true; }
  async createAnnouncement(data: any): Promise<any> { return true; }
  async deleteAnnouncement(id: string): Promise<boolean> { return true; }
  async sendSMS(data: any): Promise<any> { return true; }
  async createDepartment(data: any): Promise<any> { return true; }
  async updateDepartment(id: string, data: any): Promise<boolean> { return true; }
  async updateSampleStatus(id: string, status: string, result?: string): Promise<boolean> { return true; }
  async createRadiologyOrder(data: any): Promise<any> { return true; }
  async updateRadiologyStatus(id: string, status: string, notes?: string): Promise<boolean> { return true; }
  async getPharmacySales(): Promise<PharmacySale[]> { return []; }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return []; }
  async updateClaimStatus(id: string, data: any): Promise<boolean> { return true; }
  async getPatientCoverage(pId: string): Promise<PatientCoverage[]> { return []; }
  async updateCMSPage(id: string, data: any): Promise<boolean> { return true; }
  async updateCMSBlog(id: string, data: any): Promise<boolean> { return true; }
  async updateCMSSlider(id: string, data: any): Promise<boolean> { return true; }
  async updateDoctorCMS(id: string, data: any): Promise<boolean> { return true; }
  async updateService(id: string, data: any): Promise<boolean> { return true; }
  async deleteCustomReport(id: string): Promise<boolean> { return true; }
}

export const apiService = new ApiService();
