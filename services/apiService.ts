
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

// DATA KEYS FOR LOCAL STORAGE
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
  SETTINGS: 'healsync_db_settings'
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

      localStorage.setItem(DB_KEYS.DOCTORS, JSON.stringify([
        { id: 'd1', name: 'Dr. Sarah Wilson', specialization: 'Cardiology', department: 'Cardiology', status: 'On Duty', room: '302', experience: '12 Years', displayOnWeb: true, publicBio: 'Expert in cardiology.' },
        { id: 'd2', name: 'Dr. James Miller', specialization: 'Neurology', department: 'Neurology', status: 'On Duty', room: '105', experience: '8 Years', displayOnWeb: true, publicBio: 'Specialist in neurology.' }
      ]));

      localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify([
        { id: 'p1', name: 'John Doe', age: 45, gender: 'Male', status: PatientStatus.OPD, admissionDate: '2024-05-15', diagnosis: 'Hypertension', phone: '555-0101', medicalHistory: [], prescriptions: [] }
      ]));

      localStorage.setItem(DB_KEYS.LAB_TESTS, JSON.stringify([
        { id: 't1', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 45, description: 'Basic screening test' },
        { id: 't2', name: 'HBA1C', category: 'Biochemistry', price: 65, description: 'Diabetes monitoring' }
      ]));

      localStorage.setItem(DB_KEYS.DEPARTMENTS, JSON.stringify([
        { id: 'dept1', name: 'Cardiology', description: 'Heart care', staffCount: 12, status: 'Active', headDoctorId: 'd1' },
        { id: 'dept2', name: 'Emergency', description: '24/7 Trauma', staffCount: 24, status: 'Active' }
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

  // --- AUTH ---
  async login(credentials: any): Promise<{ user: User; token: string }> {
    const users = this.getDB<any>(DB_KEYS.USERS);
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
    
    if (user) {
      const { password, ...userSafe } = user;
      return { user: userSafe as User, token: 'token_' + Date.now() };
    }
    throw new Error('Invalid credentials. (Hint: admin / password123)');
  }

  // --- DASHBOARD ---
  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    const patients = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const doctors = this.getDB<Doctor>(DB_KEYS.DOCTORS);
    const apts = this.getDB<Appointment>(DB_KEYS.APPOINTMENTS);

    const stats: DashboardStats = {
      dailyAppointments: apts.length,
      opdPatients: patients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: patients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: 0,
      totalRevenue: 12450,
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

  // --- CORE CRUD ---
  async getPatients(): Promise<Patient[]> { return this.getDB(DB_KEYS.PATIENTS); }
  async getDoctors(): Promise<Doctor[]> { return this.getDB(DB_KEYS.DOCTORS); }
  async getUsers(): Promise<User[]> { return this.getDB(DB_KEYS.USERS); }
  async getAppointments(): Promise<Appointment[]> { return this.getDB(DB_KEYS.APPOINTMENTS); }
  async getDepartments(): Promise<HospitalDepartment[]> { return this.getDB(DB_KEYS.DEPARTMENTS); }
  async getHospitalSettings(): Promise<HospitalSettings> { 
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
  }

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    const pts = this.getDB<Patient>(DB_KEYS.PATIENTS);
    const newPt = { ...data, id: 'P' + Date.now(), medicalHistory: [], prescriptions: [] } as Patient;
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
    throw new Error('Patient not found');
  }

  async createAppointment(data: any): Promise<Appointment> {
    const apts = this.getDB<Appointment>(DB_KEYS.APPOINTMENTS);
    const newApt = { ...data, id: 'APT' + Date.now(), status: 'Scheduled' };
    this.saveDB(DB_KEYS.APPOINTMENTS, [...apts, newApt]);
    return newApt;
  }

  // --- STUBS ---
  async getLabTests(): Promise<LabTest[]> { return this.getDB(DB_KEYS.LAB_TESTS); }
  async getLabSamples(): Promise<LabSample[]> { return this.getDB(DB_KEYS.LAB_SAMPLES); }
  async getRadiologyOrders(): Promise<RadiologyOrder[]> { return this.getDB(DB_KEYS.RADIO_ORDERS); }
  async getPharmacyInventory(): Promise<PharmacyItem[]> { return this.getDB(DB_KEYS.PHARMACY_INV); }
  async getInvoices(): Promise<Invoice[]> { return this.getDB(DB_KEYS.INVOICES); }
  async getInsurancePanels(): Promise<InsurancePanel[]> { return this.getDB(DB_KEYS.INSURANCE_PANELS); }
  async getInsuranceClaims(): Promise<InsuranceClaim[]> { return this.getDB(DB_KEYS.INSURANCE_CLAIMS); }
  async getCMSPages(): Promise<CMSPage[]> { return this.getDB(DB_KEYS.CMS_PAGES); }
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return this.getDB(DB_KEYS.ANNOUNCEMENTS); }
  
  // Method stubs to prevent UI errors
  async updateAppointmentStatus(id: string, s: string) { return true; }
  async updateInvoice(id: string, u: any) { return true; }
  async updateUserRole(id: string, r: any) { return true; }
  async updateClaimStatus(id: string, d: any) { return true; }
  async updateCMSPage(id: string, d: any) { return true; }
  // Fix: added missing updateLeaveStatus stub used in DoctorManagement.tsx
  async updateLeaveStatus(id: string, s: string) { return true; }
  async updateHospitalSettings(d: any) { 
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(d));
    return true; 
  }
  async getDashboardStats() { return (await this.getInitDashboard()).stats; }
  async getRevenueSummary() { return (await this.getInitDashboard()).revenue; }
  async getPatientGrowthStats() { return []; }
  async getDoctorPerformance() { return []; }
  async getCustomReports() { return []; }
  async getSMSLogs() { return []; }
  async getEmailLogs() { return []; }
  async getCMSBlogs() { return []; }
  async getCMSSliders() { return []; }
  async getCMSSEO() { return []; }
  async getLeaveRequests() { return []; }
  async getEmergencyCases() { return []; }
  async getSlots() { return []; }
  async getServices() { return []; }
  async getAccessHistory() { return []; }
  async getEmergencyNumbers() { return []; }
  async getPaymentGateways() { return []; }
  async getBackupLogs() { return []; }
  async getSecuritySettings() { return []; }
  async runManualBackup() { return { status: 'Success' }; }
  async toggleSecuritySetting(id: string) { return true; }
  async addEHRRecord(id: string, d: any) { return true; }
  async addPrescription(id: string, d: any) { return true; }
  async createAnnouncement(d: any) { return true; }
  async deleteAnnouncement(id: string) { return true; }
  async sendSMS(d: any) { return true; }
  async createDepartment(d: any) { return true; }
  async updateDepartment(id: string, d: any) { return true; }
  async updateSampleStatus(id: string, s: string, r?: string) { return true; }
  async createRadiologyOrder(d: any) { return true; }
  async updateRadiologyStatus(id: string, s: string, n?: string) { return true; }
  async getPharmacySales() { return []; }
  async getPharmacySuppliers() { return []; }
  async getPatientCoverage(id: string) { return []; }
  async updateCMSBlog(id: string, d: any) { return true; }
  async updateCMSSlider(id: string, d: any) { return true; }
  async updateDoctorCMS(id: string, d: any) { return true; }
  async updateService(id: string, d: any) { return true; }
  async deleteCustomReport(id: string) { return true; }
}

export const apiService = new ApiService();
