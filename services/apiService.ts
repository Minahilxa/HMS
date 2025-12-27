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
import { API_BASE, getHeaders, handleResponse } from '../api_config';

class ApiService {
  /**
   * Universal fetch wrapper with detailed diagnostic logging
   */
  private async safeFetch(url: string, options: RequestInit = {}) {
    console.debug(`[API CALL] Requesting: ${url}`, options.method || 'GET');
    try {
      const response = await fetch(url, options);
      console.debug(`[API STATUS] ${url} returned ${response.status} ${response.statusText}`);
      return await handleResponse(response);
    } catch (error: any) {
      console.error(`[API ERROR] ${url} failed:`, error.message);
      
      if (error.message === 'Failed to fetch') {
        throw new Error("Unable to connect to the Clinical Server. Ensure the backend process is running on port 5000.");
      }
      throw error;
    }
  }

  // --- AUTHENTICATION ---
  async login(credentials: any): Promise<{ user: User; token: string }> {
    return this.safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  }

  // --- DASHBOARD ---
  async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
    return this.safeFetch(`${API_BASE}/init-dashboard`, { headers: getHeaders() });
  }

  // --- CORE MODULES ---
  async getUsers(): Promise<User[]> {
    return this.safeFetch(`${API_BASE}/users`, { headers: getHeaders() });
  }

  async getPatients(): Promise<Patient[]> {
    return this.safeFetch(`${API_BASE}/patients`, { headers: getHeaders() });
  }

  async getDoctors(): Promise<Doctor[]> {
    return this.safeFetch(`${API_BASE}/doctors`, { headers: getHeaders() });
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.safeFetch(`${API_BASE}/appointments`, { headers: getHeaders() });
  }

  async getDepartments(): Promise<HospitalDepartment[]> {
    return this.safeFetch(`${API_BASE}/departments`, { headers: getHeaders() });
  }

  async getHospitalSettings(): Promise<HospitalSettings> {
    return this.safeFetch(`${API_BASE}/settings/hospital`, { headers: getHeaders() });
  }

  // --- CRUD WRITERS ---
  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    return this.safeFetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    return this.safeFetch(`${API_BASE}/patients/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
  }

  async createAppointment(data: any): Promise<Appointment> {
    return this.safeFetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return true;
  }

  async addEHRRecord(pId: string, data: any): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/patients/${pId}/ehr`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return true;
  }

  async addPrescription(pId: string, data: any): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/patients/${pId}/prescriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return true;
  }

  // --- SPECIALIZED MODULES ---
  async getLabTests(): Promise<LabTest[]> {
    return this.safeFetch(`${API_BASE}/lab/tests`, { headers: getHeaders() });
  }

  async getLabSamples(): Promise<LabSample[]> {
    return this.safeFetch(`${API_BASE}/lab/samples`, { headers: getHeaders() });
  }

  async updateSampleStatus(id: string, status: string, result?: string): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/lab/samples/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, result })
    });
    return true;
  }

  async getRadiologyOrders(): Promise<RadiologyOrder[]> {
    return this.safeFetch(`${API_BASE}/radiology/orders`, { headers: getHeaders() });
  }

  async createRadiologyOrder(data: any): Promise<any> {
    return this.safeFetch(`${API_BASE}/radiology/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async updateRadiologyStatus(id: string, status: string, notes?: string): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/radiology/orders/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return true;
  }

  async getPharmacyInventory(): Promise<PharmacyItem[]> {
    return this.safeFetch(`${API_BASE}/pharmacy/inventory`, { headers: getHeaders() });
  }

  async getInvoices(): Promise<Invoice[]> {
    return this.safeFetch(`${API_BASE}/billing/invoices`, { headers: getHeaders() });
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/billing/invoices/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return true;
  }

  async getInsurancePanels(): Promise<InsurancePanel[]> {
    return this.safeFetch(`${API_BASE}/insurance/panels`, { headers: getHeaders() });
  }

  async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    return this.safeFetch(`${API_BASE}/insurance/claims`, { headers: getHeaders() });
  }

  async updateClaimStatus(id: string, data: any): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/insurance/claims/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return true;
  }

  async getCMSPages(): Promise<CMSPage[]> {
    return this.safeFetch(`${API_BASE}/cms/pages`, { headers: getHeaders() });
  }

  async updateCMSPage(id: string, data: any): Promise<boolean> {
    await this.safeFetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return true;
  }

  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    return this.safeFetch(`${API_BASE}/communication/announcements`, { headers: getHeaders() });
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
    await this.safeFetch(`${API_BASE}/settings/hospital`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
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