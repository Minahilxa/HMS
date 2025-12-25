
import { API_BASE, handleResponse, getHeaders } from '../api_config';
import { 
  DashboardStats, PatientStatus, User, UserRole, LeaveRequest, 
  DoctorPerformance, Patient, EHRRecord, Prescription, Appointment, 
  HospitalDepartment, HospitalService, TimeSlot, LabTest, LabSample, 
  AccessHistory, RadiologyOrder, PharmacyItem, PharmacySale, 
  PharmacySupplier, Invoice, BillingCategory, InsurancePanel, 
  InsuranceClaim, PatientCoverage, CMSPage, CMSBlog, CMSSlider, 
  CMSSEOSetting, Doctor, PatientGrowthEntry, CustomReport, 
  InternalAnnouncement, SMSLog, EmailLog, HospitalSettings, 
  EmergencyNumber, PaymentGateway, BackupLog, SecuritySetting,
  EmergencyCase
} from '../types';

class ApiService {
  // Authentication
  async login(credentials: any): Promise<{ user: User; token: string }> {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse);
  }

  // Dashboard & Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    return fetch(`${API_BASE}/analytics/dashboard-stats`, { headers: getHeaders() }).then(handleResponse);
  }

  async getRevenueSummary(): Promise<any[]> {
    return fetch(`${API_BASE}/analytics/revenue`, { headers: getHeaders() }).then(handleResponse);
  }

  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> {
    return fetch(`${API_BASE}/analytics/patient-growth`, { headers: getHeaders() }).then(handleResponse);
  }

  async getDoctorPerformance(): Promise<DoctorPerformance[]> {
    return fetch(`${API_BASE}/analytics/doctor-performance`, { headers: getHeaders() }).then(handleResponse);
  }

  // Custom Reports CRUD
  async getCustomReports(): Promise<CustomReport[]> {
    return fetch(`${API_BASE}/reports`, { headers: getHeaders() }).then(handleResponse);
  }

  async createCustomReport(report: Partial<CustomReport>): Promise<CustomReport> {
    return fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(report),
    }).then(handleResponse);
  }

  async deleteCustomReport(id: string): Promise<boolean> {
    return fetch(`${API_BASE}/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.ok);
  }

  // Settings & Security CRUD
  async getHospitalSettings(): Promise<HospitalSettings> {
    return fetch(`${API_BASE}/settings/hospital`, { headers: getHeaders() }).then(handleResponse);
  }

  async updateHospitalSettings(updates: Partial<HospitalSettings>): Promise<boolean> {
    return fetch(`${API_BASE}/settings/hospital`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getEmergencyNumbers(): Promise<EmergencyNumber[]> {
    return fetch(`${API_BASE}/settings/emergency`, { headers: getHeaders() }).then(handleResponse);
  }

  async updateEmergencyNumber(id: string, updates: Partial<EmergencyNumber>): Promise<boolean> {
    return fetch(`${API_BASE}/settings/emergency/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getPaymentGateways(): Promise<PaymentGateway[]> {
    return fetch(`${API_BASE}/settings/payments`, { headers: getHeaders() }).then(handleResponse);
  }

  async updatePaymentGateway(id: string, updates: Partial<PaymentGateway>): Promise<boolean> {
    return fetch(`${API_BASE}/settings/payments/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getBackupLogs(): Promise<BackupLog[]> {
    return fetch(`${API_BASE}/security/backups`, { headers: getHeaders() }).then(handleResponse);
  }

  async runManualBackup(): Promise<BackupLog> {
    return fetch(`${API_BASE}/security/backups/run`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(handleResponse);
  }

  async getSecuritySettings(): Promise<SecuritySetting[]> {
    return fetch(`${API_BASE}/security/settings`, { headers: getHeaders() }).then(handleResponse);
  }

  async toggleSecuritySetting(id: string): Promise<boolean> {
    return fetch(`${API_BASE}/security/settings/${id}/toggle`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(res => res.ok);
  }

  // Communication CRUD
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    return fetch(`${API_BASE}/communication/announcements`, { headers: getHeaders() }).then(handleResponse);
  }

  async createAnnouncement(data: Partial<InternalAnnouncement>): Promise<InternalAnnouncement> {
    return fetch(`${API_BASE}/communication/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return fetch(`${API_BASE}/communication/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.ok);
  }

  async getSMSLogs(): Promise<SMSLog[]> {
    return fetch(`${API_BASE}/communication/sms-logs`, { headers: getHeaders() }).then(handleResponse);
  }

  async sendSMS(data: Partial<SMSLog>): Promise<SMSLog> {
    return fetch(`${API_BASE}/communication/send-sms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  }

  async getEmailLogs(): Promise<EmailLog[]> {
    return fetch(`${API_BASE}/communication/email-logs`, { headers: getHeaders() }).then(handleResponse);
  }

  // Patient Management CRUD
  async getPatients(): Promise<Patient[]> {
    return fetch(`${API_BASE}/patients`, { headers: getHeaders() }).then(handleResponse);
  }

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    return fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    return fetch(`${API_BASE}/patients/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(handleResponse);
  }

  // Clinical Records
  async addEHRRecord(patientId: string, record: Partial<EHRRecord>): Promise<boolean> {
    return fetch(`${API_BASE}/patients/${patientId}/ehr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(record),
    }).then(res => res.ok);
  }

  async addPrescription(patientId: string, prescription: Partial<Prescription>): Promise<boolean> {
    return fetch(`${API_BASE}/patients/${patientId}/prescriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(prescription),
    }).then(res => res.ok);
  }

  // Doctor & Staff CRUD
  async getDoctors(): Promise<Doctor[]> {
    return fetch(`${API_BASE}/doctors`, { headers: getHeaders() }).then(handleResponse);
  }

  async getDepartments(): Promise<HospitalDepartment[]> {
    return fetch(`${API_BASE}/departments`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing createDepartment method
  async createDepartment(data: Partial<HospitalDepartment>): Promise<HospitalDepartment> {
    return fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  }

  async updateDepartment(id: string, updates: Partial<HospitalDepartment>): Promise<boolean> {
    return fetch(`${API_BASE}/departments/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  // LIS & RIS
  async getLabTests(): Promise<LabTest[]> {
    return fetch(`${API_BASE}/laboratory/tests`, { headers: getHeaders() }).then(handleResponse);
  }

  async getLabSamples(): Promise<LabSample[]> {
    return fetch(`${API_BASE}/laboratory/samples`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateSampleStatus method
  async updateSampleStatus(id: string, status: LabSample['status'], result?: string): Promise<boolean> {
    return fetch(`${API_BASE}/laboratory/samples/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, result }),
    }).then(res => res.ok);
  }

  async getRadiologyOrders(): Promise<RadiologyOrder[]> {
    return fetch(`${API_BASE}/radiology/orders`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing createRadiologyOrder method
  async createRadiologyOrder(data: Partial<RadiologyOrder>): Promise<RadiologyOrder> {
    return fetch(`${API_BASE}/radiology/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  }

  // Fix: Add missing updateRadiologyStatus method
  async updateRadiologyStatus(id: string, status: RadiologyOrder['status'], notes?: string): Promise<boolean> {
    return fetch(`${API_BASE}/radiology/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes }),
    }).then(res => res.ok);
  }

  // Pharmacy CRUD
  async getPharmacyInventory(): Promise<PharmacyItem[]> {
    return fetch(`${API_BASE}/pharmacy/inventory`, { headers: getHeaders() }).then(handleResponse);
  }

  async createPharmacyItem(item: Partial<PharmacyItem>): Promise<PharmacyItem> {
    return fetch(`${API_BASE}/pharmacy/inventory`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item),
    }).then(handleResponse);
  }

  // Fix: Add missing getPharmacySales method
  async getPharmacySales(): Promise<PharmacySale[]> {
    return fetch(`${API_BASE}/pharmacy/sales`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing getPharmacySuppliers method
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> {
    return fetch(`${API_BASE}/pharmacy/suppliers`, { headers: getHeaders() }).then(handleResponse);
  }

  // Billing & Insurance
  async getInvoices(): Promise<Invoice[]> {
    return fetch(`${API_BASE}/billing/invoices`, { headers: getHeaders() }).then(handleResponse);
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    return fetch(`${API_BASE}/billing/invoices/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getInsurancePanels(): Promise<InsurancePanel[]> {
    return fetch(`${API_BASE}/insurance/panels`, { headers: getHeaders() }).then(handleResponse);
  }

  async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    return fetch(`${API_BASE}/insurance/claims`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateClaimStatus method
  async updateClaimStatus(id: string, updates: Partial<InsuranceClaim>): Promise<boolean> {
    return fetch(`${API_BASE}/insurance/claims/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  // Fix: Add missing getPatientCoverage method
  async getPatientCoverage(patientId: string): Promise<PatientCoverage[]> {
    return fetch(`${API_BASE}/insurance/coverage/${patientId}`, { headers: getHeaders() }).then(handleResponse);
  }

  // CMS CRUD
  async getCMSPages(): Promise<CMSPage[]> {
    return fetch(`${API_BASE}/cms/pages`, { headers: getHeaders() }).then(handleResponse);
  }

  async updateCMSPage(id: string, updates: Partial<CMSPage>): Promise<boolean> {
    return fetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getCMSBlogs(): Promise<CMSBlog[]> {
    return fetch(`${API_BASE}/cms/blogs`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateCMSBlog method
  async updateCMSBlog(id: string, updates: Partial<CMSBlog>): Promise<boolean> {
    return fetch(`${API_BASE}/cms/blogs/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getCMSSliders(): Promise<CMSSlider[]> {
    return fetch(`${API_BASE}/cms/sliders`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateCMSSlider method
  async updateCMSSlider(id: string, updates: Partial<CMSSlider>): Promise<boolean> {
    return fetch(`${API_BASE}/cms/sliders/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getCMSSEO(): Promise<CMSSEOSetting[]> {
    return fetch(`${API_BASE}/cms/seo`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateDoctorCMS method
  async updateDoctorCMS(id: string, updates: Partial<Doctor>): Promise<boolean> {
    return fetch(`${API_BASE}/cms/doctors/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  async getUsers(): Promise<User[]> {
    return fetch(`${API_BASE}/users`, { headers: getHeaders() }).then(handleResponse);
  }

  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    return fetch(`${API_BASE}/users/${userId}/role`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role: newRole }),
    }).then(res => res.ok);
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return fetch(`${API_BASE}/staff/leaves`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateLeaveStatus method
  async updateLeaveStatus(id: string, status: 'Approved' | 'Rejected'): Promise<boolean> {
    return fetch(`${API_BASE}/staff/leaves/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    }).then(res => res.ok);
  }

  async getAppointments(): Promise<Appointment[]> {
    return fetch(`${API_BASE}/appointments`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing createAppointment method
  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    return fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    return fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    }).then(res => res.ok);
  }

  // Fix: Add missing getEmergencyCases method
  async getEmergencyCases(): Promise<EmergencyCase[]> {
    return fetch(`${API_BASE}/emergency/cases`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing getSlots method
  async getSlots(): Promise<TimeSlot[]> {
    return fetch(`${API_BASE}/appointments/slots`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing getServices method
  async getServices(): Promise<HospitalService[]> {
    return fetch(`${API_BASE}/services`, { headers: getHeaders() }).then(handleResponse);
  }

  // Fix: Add missing updateService method
  async updateService(id: string, updates: Partial<HospitalService>): Promise<boolean> {
    return fetch(`${API_BASE}/services/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }).then(res => res.ok);
  }

  // Fix: Add missing getAccessHistory method
  async getAccessHistory(): Promise<AccessHistory[]> {
    return fetch(`${API_BASE}/laboratory/access-history`, { headers: getHeaders() }).then(handleResponse);
  }
}

export const apiService = new ApiService();
