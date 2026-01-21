
import { API_BASE, getHeaders, handleResponse } from '../api_config';
import {
  DashboardStats, User, Patient, Doctor, Appointment,
  RevenueData, EmergencyCase, UserRole, HospitalDepartment,
  HospitalService, LabTest, LabSample, RadiologyOrder,
  PharmacyItem, PharmacySale, PharmacySupplier, Invoice,
  InsurancePanel, InsuranceClaim, PatientCoverage, CMSPage,
  CMSBlog, CMSSlider, CMSSEOSetting, LeaveRequest,
  DoctorPerformance, InternalAnnouncement, SMSLog, EmailLog,
  HospitalSettings, EmergencyNumber, PaymentGateway, BackupLog,
  SecuritySetting, AccessHistory, TimeSlot, CustomReport, PatientGrowthEntry
} from '../types';

class ApiService {
  async login(credentials: any): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  }

  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    const response = await fetch(`${API_BASE}/init-dashboard`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE}/stats`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getRevenueSummary(): Promise<RevenueData[]> {
    const response = await fetch(`${API_BASE}/revenue`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> {
    const response = await fetch(`${API_BASE}/analytics/growth`, { headers: getHeaders() });
    return handleResponse(response);
  }

  // --- USER MANAGEMENT ---
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateUserRole(id: string, role: UserRole) {
    const response = await fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  }

  async sendUserInvitation(email: string, role: UserRole): Promise<boolean> {
    const response = await fetch(`${API_BASE}/users/invite`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, role }),
    });
    return (await handleResponse(response)).message === 'Invitation sent successfully.';
  }

  // --- PATIENT MANAGEMENT ---
  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE}/patients`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async registerPatient(data: any): Promise<Patient> {
    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updatePatient(id: string, data: any) {
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async addEHRRecord(id: string, data: any) {
    const response = await fetch(`${API_BASE}/patients/${id}/ehr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async addPrescription(id: string, data: any) {
    const response = await fetch(`${API_BASE}/patients/${id}/prescriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  // --- DOCTOR MANAGEMENT ---
  async getDoctors(): Promise<Doctor[]> {
    const response = await fetch(`${API_BASE}/doctors`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createDoctor(data: any): Promise<Doctor> {
    const response = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateDoctor(id: string, data: any) {
    const response = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateDoctorStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE}/doctors/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_BASE}/leaves`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateLeaveStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE}/leaves/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  }

  async getDoctorPerformance(): Promise<DoctorPerformance[]> {
    const response = await fetch(`${API_BASE}/doctors/performance`, { headers: getHeaders() });
    return handleResponse(response);
  }

  // --- APPOINTMENTS ---
  async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE}/appointments`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createAppointment(data: any): Promise<Appointment> {
    const response = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateAppointmentStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  }

  async getSlots(): Promise<TimeSlot[]> {
    const response = await fetch(`${API_BASE}/slots`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createSlot(data: any): Promise<TimeSlot> {
    const response = await fetch(`${API_BASE}/slots`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  // --- DEPARTMENTS & SERVICES ---
  async getDepartments(): Promise<HospitalDepartment[]> {
    const response = await fetch(`${API_BASE}/departments`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createDepartment(data: any): Promise<HospitalDepartment> {
    const response = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateDepartment(id: string, data: any) {
    const response = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async getServices(): Promise<HospitalService[]> {
    const response = await fetch(`${API_BASE}/services`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createService(data: any): Promise<HospitalService> {
    const response = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateService(id: string, data: any) {
    const response = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteService(id: string) {
    const response = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  // --- BILLING & INVOICES ---
  async getInvoices(): Promise<Invoice[]> {
    const response = await fetch(`${API_BASE}/invoices`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createInvoice(data: any): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateInvoice(id: string, data: any) {
    const response = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  // --- LABORATORY ---
  async getLabTests(): Promise<LabTest[]> {
    const response = await fetch(`${API_BASE}/lab/tests`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getLabSamples(): Promise<LabSample[]> {
    const response = await fetch(`${API_BASE}/lab/samples`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateSampleStatus(id: string, status: string, result?: string) {
    const response = await fetch(`${API_BASE}/lab/samples/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, result }),
    });
    return handleResponse(response);
  }

  // --- RADIOLOGY ---
  async getRadiologyOrders(): Promise<RadiologyOrder[]> {
    const response = await fetch(`${API_BASE}/radiology/orders`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createRadiologyOrder(data: any): Promise<RadiologyOrder> {
    const response = await fetch(`${API_BASE}/radiology/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateRadiologyStatus(id: string, status: string, notes?: string) {
    const response = await fetch(`${API_BASE}/radiology/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  }

  // --- PHARMACY ---
  async getPharmacyInventory(): Promise<PharmacyItem[]> {
    const response = await fetch(`${API_BASE}/pharmacy/inventory`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createPharmacyItem(data: any): Promise<PharmacyItem> {
    const response = await fetch(`${API_BASE}/pharmacy/inventory`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updatePharmacyItem(id: string, data: any) {
    const response = await fetch(`${API_BASE}/pharmacy/inventory/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deletePharmacyItem(id: string) {
    const response = await fetch(`${API_BASE}/pharmacy/inventory/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getPharmacySales(): Promise<PharmacySale[]> {
    const response = await fetch(`${API_BASE}/pharmacy/sales`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createPharmacySale(data: any): Promise<PharmacySale> {
    const response = await fetch(`${API_BASE}/pharmacy/sales`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updatePharmacySale(id: string, data: any) {
    const response = await fetch(`${API_BASE}/pharmacy/sales/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deletePharmacySale(id: string) {
    const response = await fetch(`${API_BASE}/pharmacy/sales/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getPharmacySuppliers(): Promise<PharmacySupplier[]> {
    const response = await fetch(`${API_BASE}/pharmacy/suppliers`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createPharmacySupplier(data: any): Promise<PharmacySupplier> {
    const response = await fetch(`${API_BASE}/pharmacy/suppliers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updatePharmacySupplier(id: string, data: any) {
    const response = await fetch(`${API_BASE}/pharmacy/suppliers/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deletePharmacySupplier(id: string) {
    const response = await fetch(`${API_BASE}/pharmacy/suppliers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  // --- INSURANCE ---
  async getInsurancePanels(): Promise<InsurancePanel[]> {
    const response = await fetch(`${API_BASE}/insurance/panels`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createInsurancePanel(data: any): Promise<InsurancePanel> {
    const response = await fetch(`${API_BASE}/insurance/panels`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateInsurancePanel(id: string, data: any) {
    const response = await fetch(`${API_BASE}/insurance/panels/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteInsurancePanel(id: string) {
    const response = await fetch(`${API_BASE}/insurance/panels/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    const response = await fetch(`${API_BASE}/insurance/claims`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateClaimStatus(id: string, data: any) {
    const response = await fetch(`${API_BASE}/insurance/claims/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async getPatientCoverage(id: string): Promise<PatientCoverage[]> {
    const response = await fetch(`${API_BASE}/insurance/coverage/${id}`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createPatientCoverage(data: any): Promise<PatientCoverage> {
    const response = await fetch(`${API_BASE}/insurance/coverage`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  // --- CMS MANAGEMENT ---
  async getCMSPages(): Promise<CMSPage[]> {
    const response = await fetch(`${API_BASE}/cms/pages`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createCMSPage(data: any): Promise<CMSPage> {
    const response = await fetch(`${API_BASE}/cms/pages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateCMSPage(id: string, data: any) {
    const response = await fetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteCMSPage(id: string) {
    const response = await fetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getCMSBlogs(): Promise<CMSBlog[]> {
    const response = await fetch(`${API_BASE}/cms/blogs`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createCMSBlog(data: any): Promise<CMSBlog> {
    const response = await fetch(`${API_BASE}/cms/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateCMSBlog(id: string, data: any) {
    const response = await fetch(`${API_BASE}/cms/blogs/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteCMSBlog(id: string) {
    const response = await fetch(`${API_BASE}/cms/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getCMSSliders(): Promise<CMSSlider[]> {
    const response = await fetch(`${API_BASE}/cms/sliders`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createCMSSlider(data: any): Promise<CMSSlider> {
    const response = await fetch(`${API_BASE}/cms/sliders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateCMSSlider(id: string, data: any) {
    const response = await fetch(`${API_BASE}/cms/sliders/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteCMSSlider(id: string) {
    const response = await fetch(`${API_BASE}/cms/sliders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getCMSSEO(): Promise<CMSSEOSetting[]> {
    const response = await fetch(`${API_BASE}/cms/seo`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createCMSSEO(data: any): Promise<CMSSEOSetting> {
    const response = await fetch(`${API_BASE}/cms/seo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateCMSSEO(id: string, data: any) {
    const response = await fetch(`${API_BASE}/cms/seo/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteCMSSEO(id: string) {
    const response = await fetch(`${API_BASE}/cms/seo/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async updateDoctorCMS(id: string, data: any) {
    const response = await fetch(`${API_BASE}/doctors/${id}/cms`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  // --- COMMUNICATION ---
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    const response = await fetch(`${API_BASE}/communications/announcements`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createAnnouncement(data: any): Promise<InternalAnnouncement> {
    const response = await fetch(`${API_BASE}/communications/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteAnnouncement(id: string) {
    const response = await fetch(`${API_BASE}/communications/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getSMSLogs(): Promise<SMSLog[]> {
    const response = await fetch(`${API_BASE}/communications/sms`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async sendSMS(data: any): Promise<SMSLog> {
    const response = await fetch(`${API_BASE}/communications/sms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async getEmailLogs(): Promise<EmailLog[]> {
    const response = await fetch(`${API_BASE}/emails`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async sendEmail(data: any): Promise<EmailLog> {
    const response = await fetch(`${API_BASE}/emails/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  // --- EMERGENCY MANAGEMENT ---
  async getEmergencyNumbers(): Promise<EmergencyNumber[]> {
    const response = await fetch(`${API_BASE}/settings/emergency-numbers`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createEmergencyNumber(data: Partial<EmergencyNumber>): Promise<EmergencyNumber> {
    const response = await fetch(`${API_BASE}/settings/emergency-numbers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateEmergencyNumber(id: string, data: Partial<EmergencyNumber>) {
    const response = await fetch(`${API_BASE}/settings/emergency-numbers/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteEmergencyNumber(id: string) {
    const response = await fetch(`${API_BASE}/settings/emergency-numbers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getEmergencyCases(): Promise<EmergencyCase[]> {
    const response = await fetch(`${API_BASE}/emergency/cases`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createEmergencyCase(data: Partial<EmergencyCase>): Promise<EmergencyCase> {
    const response = await fetch(`${API_BASE}/emergency/cases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateEmergencyCase(id: string, data: Partial<EmergencyCase>) {
    const response = await fetch(`${API_BASE}/emergency/cases/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteEmergencyCase(id: string) {
    const response = await fetch(`${API_BASE}/emergency/cases/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  // --- SETTINGS & SECURITY ---
  async getHospitalSettings(): Promise<HospitalSettings> {
    const response = await fetch(`${API_BASE}/settings/hospital`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateHospitalSettings(data: Partial<HospitalSettings>) {
    const response = await fetch(`${API_BASE}/settings/hospital`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async getPaymentGateways(): Promise<PaymentGateway[]> {
    const response = await fetch(`${API_BASE}/settings/payments`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createPaymentGateway(data: Partial<PaymentGateway>): Promise<PaymentGateway> {
    const response = await fetch(`${API_BASE}/settings/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updatePaymentGateway(id: string, data: Partial<PaymentGateway>) {
    const response = await fetch(`${API_BASE}/settings/payments/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deletePaymentGateway(id: string) {
    const response = await fetch(`${API_BASE}/settings/payments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getSecuritySettings(): Promise<SecuritySetting[]> {
    const response = await fetch(`${API_BASE}/settings/security`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createSecuritySetting(data: Partial<SecuritySetting>): Promise<SecuritySetting> {
    const response = await fetch(`${API_BASE}/settings/security`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async updateSecuritySetting(id: string, data: Partial<SecuritySetting>) {
    const response = await fetch(`${API_BASE}/settings/security/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }

  async deleteSecuritySetting(id: string) {
    const response = await fetch(`${API_BASE}/settings/security/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async toggleSecuritySetting(id: string) {
    const response = await fetch(`${API_BASE}/settings/security/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getBackupLogs(): Promise<BackupLog[]> {
    const response = await fetch(`${API_BASE}/settings/backups`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async runManualBackup() {
    const response = await fetch(`${API_BASE}/settings/backups/run`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async deleteBackup(id: string) {
    const response = await fetch(`${API_BASE}/settings/backups/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }

  async getAccessHistory(): Promise<AccessHistory[]> {
    const response = await fetch(`${API_BASE}/analytics/access-history`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getCustomReports(): Promise<CustomReport[]> {
    const response = await fetch(`${API_BASE}/analytics/reports`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async deleteCustomReport(id: string) {
    const response = await fetch(`${API_BASE}/analytics/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
}

export const apiService = new ApiService();
