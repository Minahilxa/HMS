
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
  PatientStatus
} from '../types';
import { API_BASE, getHeaders, handleResponse } from '../api_config';

class ApiService {
  // --- AUTHENTICATION ---
  async login(credentials: any): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  }

  // --- DASHBOARD ---
  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    const response = await fetch(`${API_BASE}/init-dashboard`, { headers: getHeaders() });
    return handleResponse(response);
  }

  // --- CORE MODULES ---
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE}/patients`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getDoctors(): Promise<Doctor[]> {
    const response = await fetch(`${API_BASE}/doctors`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE}/appointments`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getDepartments(): Promise<HospitalDepartment[]> {
    const response = await fetch(`${API_BASE}/departments`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getHospitalSettings(): Promise<HospitalSettings> {
    const response = await fetch(`${API_BASE}/settings/hospital`, { headers: getHeaders() });
    return handleResponse(response);
  }

  // --- CRUD WRITERS ---
  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  }

  async createAppointment(data: any): Promise<Appointment> {
    const response = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    await handleResponse(response);
    return true;
  }

  async addEHRRecord(pId: string, data: any): Promise<boolean> {
    const response = await fetch(`${API_BASE}/patients/${pId}/ehr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    await handleResponse(response);
    return true;
  }

  async addPrescription(pId: string, data: any): Promise<boolean> {
    const response = await fetch(`${API_BASE}/patients/${pId}/prescriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    await handleResponse(response);
    return true;
  }

  // --- SPECIALIZED MODULES ---
  async getLabTests(): Promise<LabTest[]> {
    const response = await fetch(`${API_BASE}/lab/tests`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getLabSamples(): Promise<LabSample[]> {
    const response = await fetch(`${API_BASE}/lab/samples`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateSampleStatus(id: string, status: string, result?: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/lab/samples/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, result })
    });
    await handleResponse(response);
    return true;
  }

  async getRadiologyOrders(): Promise<RadiologyOrder[]> {
    const response = await fetch(`${API_BASE}/radiology/orders`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async createRadiologyOrder(data: any): Promise<any> {
    const response = await fetch(`${API_BASE}/radiology/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  async updateRadiologyStatus(id: string, status: string, notes?: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/radiology/orders/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    await handleResponse(response);
    return true;
  }

  async getPharmacyInventory(): Promise<PharmacyItem[]> {
    const response = await fetch(`${API_BASE}/pharmacy/inventory`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getInvoices(): Promise<Invoice[]> {
    const response = await fetch(`${API_BASE}/billing/invoices`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    const response = await fetch(`${API_BASE}/billing/invoices/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    await handleResponse(response);
    return true;
  }

  async getInsurancePanels(): Promise<InsurancePanel[]> {
    const response = await fetch(`${API_BASE}/insurance/panels`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    const response = await fetch(`${API_BASE}/insurance/claims`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateClaimStatus(id: string, data: any): Promise<boolean> {
    const response = await fetch(`${API_BASE}/insurance/claims/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    await handleResponse(response);
    return true;
  }

  async getCMSPages(): Promise<CMSPage[]> {
    const response = await fetch(`${API_BASE}/cms/pages`, { headers: getHeaders() });
    return handleResponse(response);
  }

  async updateCMSPage(id: string, data: any): Promise<boolean> {
    const response = await fetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    await handleResponse(response);
    return true;
  }

  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    const response = await fetch(`${API_BASE}/communication/announcements`, { headers: getHeaders() });
    return handleResponse(response);
  }

  // --- PLACEHOLDERS / TO BE IMPLEMENTED AS NEEDED ---
  async getDashboardStats(): Promise<DashboardStats> { return (await this.getInitDashboard()).stats; }
  async getRevenueSummary(): Promise<any[]> { return (await this.getInitDashboard()).revenue; }
  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> { return []; }
  async getDoctorPerformance(): Promise<DoctorPerformance[]> { return []; }
  async getCustomReports(): Promise<CustomReport[]> { return []; }
  async getSMSLogs(): Promise<SMSLog[]> { return []; }
  async getEmailLogs(): Promise<EmailLog[]> { return []; }
  async getCMSBlogs(): Promise<CMSBlog[]> { return []; }
  async getCMSSliders(): Promise<CMSSlider[]> { return []; }
  async getCMSSEO(): Promise<CMSSEOSetting[]> { return []; }
  async getLeaveRequests(): Promise<LeaveRequest[]> { return []; }
  async getEmergencyCases(): Promise<EmergencyCase[]> { return []; }
  async getSlots(): Promise<TimeSlot[]> { return []; }
  async getServices(): Promise<HospitalService[]> { return []; }
  async getAccessHistory(): Promise<AccessHistory[]> { return []; }
  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> { return true; }
  async updateLeaveStatus(id: string, status: string): Promise<boolean> { return true; }
  async updateHospitalSettings(data: any): Promise<boolean> { 
    const response = await fetch(`${API_BASE}/settings/hospital`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    await handleResponse(response);
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
  async getPharmacySales(): Promise<PharmacySale[]> { return []; }
  async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return []; }
  async getPatientCoverage(pId: string): Promise<PatientCoverage[]> { return []; }
  async updateCMSBlog(id: string, data: any): Promise<boolean> { return true; }
  async updateCMSSlider(id: string, data: any): Promise<boolean> { return true; }
  async updateDoctorCMS(id: string, data: any): Promise<boolean> { return true; }
  async updateService(id: string, data: any): Promise<boolean> { return true; }
  async deleteCustomReport(id: string): Promise<boolean> { return true; }
}

export const apiService = new ApiService();
