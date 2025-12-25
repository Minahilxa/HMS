
import { 
  mockPatients, 
  mockAppointments, 
  mockDoctors, 
  mockEmergency, 
  mockRevenue,
  mockUsers,
  mockLeaves,
  mockPerformances,
  mockDepartments,
  mockServices,
  mockSlots,
  mockLabTests,
  mockLabSamples,
  mockAccessHistory,
  mockRadiologyOrders,
  mockPharmacyInventory,
  mockPharmacySales,
  mockPharmacySuppliers,
  mockInvoices,
  mockInsurancePanels,
  mockInsuranceClaims,
  mockPatientCoverage,
  mockCMSPages,
  mockCMSBlogs,
  mockCMSSliders,
  mockCMSSEO,
  mockPatientGrowth,
  mockCustomReports,
  mockAnnouncements,
  mockSMSLogs,
  mockEmailLogs,
  mockHospitalSettings,
  mockEmergencyNumbers,
  mockPaymentGateways,
  mockBackupLogs,
  mockSecuritySettings
} from './mockData';
import { DashboardStats, PatientStatus, User, UserRole, LeaveRequest, DoctorPerformance, Patient, EHRRecord, Prescription, Appointment, HospitalDepartment, HospitalService, TimeSlot, LabTest, LabSample, AccessHistory, RadiologyOrder, PharmacyItem, PharmacySale, PharmacySupplier, Invoice, BillingCategory, InsurancePanel, InsuranceClaim, PatientCoverage, CMSPage, CMSBlog, CMSSlider, CMSSEOSetting, Doctor, PatientGrowthEntry, CustomReport, InternalAnnouncement, SMSLog, EmailLog, HospitalSettings, EmergencyNumber, PaymentGateway, BackupLog, SecuritySetting } from '../types';

class ApiService {
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      dailyAppointments: mockAppointments.length,
      opdPatients: mockPatients.filter(p => p.status === PatientStatus.OPD).length,
      ipdPatients: mockPatients.filter(p => p.status === PatientStatus.IPD).length,
      emergencyCases: mockEmergency.length,
      totalRevenue: mockRevenue.reduce((acc, curr) => acc + curr.amount, 0),
      doctorsOnDuty: mockDoctors.filter(d => d.status === 'On Duty').length
    };
  }

  // Settings & Security Module
  async getHospitalSettings(): Promise<HospitalSettings> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...mockHospitalSettings };
  }

  async updateHospitalSettings(updates: Partial<HospitalSettings>): Promise<boolean> {
    Object.assign(mockHospitalSettings, updates);
    return true;
  }

  async getEmergencyNumbers(): Promise<EmergencyNumber[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockEmergencyNumbers];
  }

  async updateEmergencyNumber(id: string, updates: Partial<EmergencyNumber>): Promise<boolean> {
    const idx = mockEmergencyNumbers.findIndex(en => en.id === id);
    if (idx !== -1) {
      mockEmergencyNumbers[idx] = { ...mockEmergencyNumbers[idx], ...updates };
      return true;
    }
    return false;
  }

  async getPaymentGateways(): Promise<PaymentGateway[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPaymentGateways];
  }

  async updatePaymentGateway(id: string, updates: Partial<PaymentGateway>): Promise<boolean> {
    const idx = mockPaymentGateways.findIndex(pg => pg.id === id);
    if (idx !== -1) {
      mockPaymentGateways[idx] = { ...mockPaymentGateways[idx], ...updates };
      return true;
    }
    return false;
  }

  async getBackupLogs(): Promise<BackupLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockBackupLogs];
  }

  async runManualBackup(): Promise<BackupLog> {
    const newBackup: BackupLog = {
      id: `B${mockBackupLogs.length + 1}`,
      timestamp: new Date().toLocaleString(),
      size: '4.1 GB',
      status: 'Success',
      type: 'Manual'
    };
    mockBackupLogs.unshift(newBackup);
    return newBackup;
  }

  async getSecuritySettings(): Promise<SecuritySetting[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockSecuritySettings];
  }

  async toggleSecuritySetting(id: string): Promise<boolean> {
    const setting = mockSecuritySettings.find(s => s.id === id);
    if (setting) {
      setting.isEnabled = !setting.isEnabled;
      return true;
    }
    return false;
  }

  // Communication Module
  async getInternalAnnouncements(): Promise<InternalAnnouncement[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockAnnouncements];
  }

  async createAnnouncement(data: Partial<InternalAnnouncement>): Promise<InternalAnnouncement> {
    const newAnn: InternalAnnouncement = {
      id: `ANN-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      title: data.title || 'Untitled',
      content: data.content || '',
      priority: data.priority || 'Medium',
      targetAudience: data.targetAudience || 'All Staff',
      date: new Date().toISOString().split('T')[0],
      author: 'Super Admin'
    };
    mockAnnouncements.unshift(newAnn);
    return newAnn;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const idx = mockAnnouncements.findIndex(a => a.id === id);
    if (idx !== -1) {
      mockAnnouncements.splice(idx, 1);
      return true;
    }
    return false;
  }

  async getSMSLogs(): Promise<SMSLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockSMSLogs];
  }

  async sendSMS(data: Partial<SMSLog>): Promise<SMSLog> {
    const newLog: SMSLog = {
      id: `SMS-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      patientName: data.patientName || 'Generic Patient',
      phoneNumber: data.phoneNumber || 'N/A',
      message: data.message || '',
      status: 'Sent',
      timestamp: new Date().toLocaleString(),
      type: data.type || 'General'
    };
    mockSMSLogs.unshift(newLog);
    return newLog;
  }

  async getEmailLogs(): Promise<EmailLog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockEmailLogs];
  }

  async sendEmail(data: Partial<EmailLog>): Promise<EmailLog> {
    const newLog: EmailLog = {
      id: `EM-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      patientName: data.patientName || 'Generic Patient',
      email: data.email || 'N/A',
      subject: data.subject || 'HealSync Alert',
      status: 'Sent',
      timestamp: new Date().toLocaleString(),
      type: data.type || 'Newsletter'
    };
    mockEmailLogs.unshift(newLog);
    return newLog;
  }

  // Reports & Analytics Module
  async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPatientGrowth];
  }

  async getCustomReports(): Promise<CustomReport[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCustomReports];
  }

  async createCustomReport(report: Partial<CustomReport>): Promise<CustomReport> {
    const newReport: CustomReport = {
      id: `REP-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: report.name || 'New Analytics View',
      type: report.type || 'Revenue',
      dateRange: report.dateRange || 'Current Month',
      filters: report.filters || 'None',
      createdBy: 'Super Admin'
    };
    mockCustomReports.push(newReport);
    return newReport;
  }

  async deleteCustomReport(id: string): Promise<boolean> {
    const idx = mockCustomReports.findIndex(r => r.id === id);
    if (idx !== -1) {
      mockCustomReports.splice(idx, 1);
      return true;
    }
    return false;
  }

  // CMS Module
  async getCMSPages(): Promise<CMSPage[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCMSPages];
  }

  async updateCMSPage(id: string, updates: Partial<CMSPage>): Promise<boolean> {
    const idx = mockCMSPages.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockCMSPages[idx] = { ...mockCMSPages[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
      return true;
    }
    return false;
  }

  async getCMSBlogs(): Promise<CMSBlog[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCMSBlogs];
  }

  async createCMSBlog(blog: Partial<CMSBlog>): Promise<CMSBlog> {
    const newBlog: CMSBlog = {
      id: `BLOG-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      title: blog.title || 'New Post',
      author: blog.author || 'Admin',
      category: blog.category || 'General',
      date: new Date().toISOString().split('T')[0],
      image: blog.image || 'default.jpg',
      excerpt: blog.excerpt || '',
      status: 'Draft'
    };
    mockCMSBlogs.push(newBlog);
    return newBlog;
  }

  async updateCMSBlog(id: string, updates: Partial<CMSBlog>): Promise<boolean> {
    const idx = mockCMSBlogs.findIndex(b => b.id === id);
    if (idx !== -1) {
      mockCMSBlogs[idx] = { ...mockCMSBlogs[idx], ...updates };
      return true;
    }
    return false;
  }

  async getCMSSliders(): Promise<CMSSlider[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCMSSliders];
  }

  async updateCMSSlider(id: string, updates: Partial<CMSSlider>): Promise<boolean> {
    const idx = mockCMSSliders.findIndex(s => s.id === id);
    if (idx !== -1) {
      mockCMSSliders[idx] = { ...mockCMSSliders[idx], ...updates };
      return true;
    }
    return false;
  }

  async getCMSSEO(): Promise<CMSSEOSetting[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCMSSEO];
  }

  async updateCMSSEO(id: string, updates: Partial<CMSSEOSetting>): Promise<boolean> {
    const idx = mockCMSSEO.findIndex(s => s.id === id);
    if (idx !== -1) {
      mockCMSSEO[idx] = { ...mockCMSSEO[idx], ...updates };
      return true;
    }
    return false;
  }

  async updateDoctorCMS(id: string, updates: Partial<Doctor>): Promise<boolean> {
    const idx = mockDoctors.findIndex(d => d.id === id);
    if (idx !== -1) {
      mockDoctors[idx] = { ...mockDoctors[idx], ...updates };
      return true;
    }
    return false;
  }

  // Insurance Module
  async getInsurancePanels(): Promise<InsurancePanel[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockInsurancePanels];
  }

  async createInsurancePanel(data: Partial<InsurancePanel>): Promise<InsurancePanel> {
    const newPanel: InsurancePanel = {
      id: `PANEL-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: data.name || 'New Panel',
      code: data.code || 'CODE-X',
      contactPerson: data.contactPerson || '',
      email: data.email || '',
      phone: data.phone || '',
      settlementPeriod: data.settlementPeriod || 30,
      status: 'Active'
    };
    mockInsurancePanels.push(newPanel);
    return newPanel;
  }

  async updateInsurancePanel(id: string, updates: Partial<InsurancePanel>): Promise<boolean> {
    const idx = mockInsurancePanels.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockInsurancePanels[idx] = { ...mockInsurancePanels[idx], ...updates };
      return true;
    }
    return false;
  }

  async getInsuranceClaims(): Promise<InsuranceClaim[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockInsuranceClaims];
  }

  async updateClaimStatus(id: string, updates: Partial<InsuranceClaim>): Promise<boolean> {
    const idx = mockInsuranceClaims.findIndex(c => c.id === id);
    if (idx !== -1) {
      mockInsuranceClaims[idx] = { ...mockInsuranceClaims[idx], ...updates };
      return true;
    }
    return false;
  }

  async getPatientCoverage(patientId: string): Promise<PatientCoverage[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPatientCoverage.filter(c => c.patientId === patientId);
  }

  async createPatientCoverage(data: Partial<PatientCoverage>): Promise<PatientCoverage> {
    const newCov: PatientCoverage = {
      id: `COV-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      patientId: data.patientId || '1',
      panelId: data.panelId || 'PANEL1',
      policyNumber: data.policyNumber || 'POL-XYZ',
      totalLimit: data.totalLimit || 5000,
      consumedLimit: 0,
      expiryDate: data.expiryDate || '2025-12-31',
      status: 'Verified'
    };
    mockPatientCoverage.push(newCov);
    return newCov;
  }

  // Billing Module
  async getInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockInvoices];
  }

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const amount = data.amount || 0;
    const tax = amount * 0.1; // Standard 10% tax
    const discount = data.discount || 0;
    const newInv: Invoice = {
      id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      patientId: data.patientId || '1',
      patientName: data.patientName || 'Walk-in',
      date: new Date().toISOString().split('T')[0],
      category: data.category || BillingCategory.OPD,
      amount,
      tax,
      discount,
      total: amount + tax - discount,
      status: data.status || 'Unpaid',
      paymentMethod: data.paymentMethod || 'Cash',
      insuranceProvider: data.insuranceProvider,
      insuranceStatus: data.paymentMethod === 'Insurance' ? 'Pending' : undefined
    };
    mockInvoices.push(newInv);
    return newInv;
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    const idx = mockInvoices.findIndex(inv => inv.id === id);
    if (idx !== -1) {
      mockInvoices[idx] = { ...mockInvoices[idx], ...updates };
      return true;
    }
    return false;
  }

  // Pharmacy Module
  async getPharmacyInventory(): Promise<PharmacyItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPharmacyInventory];
  }

  async updatePharmacyItem(id: string, updates: Partial<PharmacyItem>): Promise<boolean> {
    const idx = mockPharmacyInventory.findIndex(i => i.id === id);
    if (idx !== -1) {
      mockPharmacyInventory[idx] = { ...mockPharmacyInventory[idx], ...updates };
      return true;
    }
    return false;
  }

  async createPharmacyItem(item: Partial<PharmacyItem>): Promise<PharmacyItem> {
    const newItem: PharmacyItem = {
      id: `MED-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: item.name || 'New Medicine',
      category: item.category || 'Tablet',
      stock: item.stock || 0,
      minStockLevel: item.minStockLevel || 10,
      price: item.price || 0,
      expiryDate: item.expiryDate || new Date().toISOString().split('T')[0],
      supplierId: item.supplierId || 'SUP1'
    };
    mockPharmacyInventory.push(newItem);
    return newItem;
  }

  async getPharmacySales(): Promise<PharmacySale[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPharmacySales];
  }

  async createPharmacySale(sale: Partial<PharmacySale>): Promise<PharmacySale> {
    const newSale: PharmacySale = {
      id: `SALE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      patientName: sale.patientName || 'Walk-in',
      items: sale.items || [],
      totalAmount: sale.totalAmount || 0,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid'
    };
    mockPharmacySales.push(newSale);
    return newSale;
  }

  async getPharmacySuppliers(): Promise<PharmacySupplier[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPharmacySuppliers];
  }

  async createPharmacySupplier(supplier: Partial<PharmacySupplier>): Promise<PharmacySupplier> {
    const newSupplier: PharmacySupplier = {
      id: `SUP-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: supplier.name || 'New Supplier',
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || ''
    };
    mockPharmacySuppliers.push(newSupplier);
    return newSupplier;
  }

  // Radiology Module
  async getRadiologyOrders(): Promise<RadiologyOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockRadiologyOrders];
  }

  async createRadiologyOrder(order: Partial<RadiologyOrder>): Promise<RadiologyOrder> {
    const newOrder: RadiologyOrder = {
      id: `RAD-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      patientId: order.patientId || '1',
      patientName: order.patientName || 'Unknown',
      type: order.type || 'X-Ray',
      bodyPart: order.bodyPart || 'Chest',
      priority: order.priority || 'Routine',
      status: 'Requested',
      requestDate: new Date().toISOString().split('T')[0]
    };
    mockRadiologyOrders.push(newOrder);
    return newOrder;
  }

  async updateRadiologyStatus(id: string, status: RadiologyOrder['status'], notes?: string): Promise<boolean> {
    const order = mockRadiologyOrders.find(o => o.id === id);
    if (order) {
      order.status = status;
      if (notes) order.radiologistNotes = notes;
      if (status === 'Completed') order.reportUrl = `report_${id}.pdf`;
      return true;
    }
    return false;
  }

  // Lab Module
  async getLabTests(): Promise<LabTest[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockLabTests];
  }

  async createLabTest(test: Partial<LabTest>): Promise<LabTest> {
    const newTest: LabTest = {
      id: `LT-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: test.name || 'New Test',
      category: test.category || 'General',
      price: test.price || 0,
      description: test.description || ''
    };
    mockLabTests.push(newTest);
    return newTest;
  }

  async getLabSamples(): Promise<LabSample[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockLabSamples];
  }

  async updateSampleStatus(id: string, status: LabSample['status'], result?: string): Promise<boolean> {
    const sample = mockLabSamples.find(s => s.id === id);
    if (sample) {
      sample.status = status;
      if (result) sample.result = result;
      return true;
    }
    return false;
  }

  async getAccessHistory(): Promise<AccessHistory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockAccessHistory];
  }

  async getPatients(type?: PatientStatus): Promise<Patient[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (type) return mockPatients.filter(p => p.status === type);
    return [...mockPatients];
  }

  async registerPatient(patientData: Partial<Patient>): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: patientData.name || 'Unknown',
      age: patientData.age || 0,
      gender: patientData.gender || 'Other',
      status: patientData.status || PatientStatus.OPD,
      admissionDate: new Date().toISOString().split('T')[0],
      diagnosis: patientData.diagnosis || 'General Checkup',
      medicalHistory: [],
      prescriptions: [],
      ...patientData
    };
    mockPatients.push(newPatient);
    return newPatient;
  }

  async updatePatient(patientId: string, updates: Partial<Patient>): Promise<Patient | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPatients.findIndex(p => p.id === patientId);
    if (index !== -1) {
      mockPatients[index] = { ...mockPatients[index], ...updates };
      return mockPatients[index];
    }
    return null;
  }

  // Appointment Management
  async getAppointments(): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockAppointments];
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newApt: Appointment = {
      id: `APT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      patientName: data.patientName || 'Walk-in Patient',
      doctorId: data.doctorId || 'D1',
      doctorName: data.doctorName || 'Dr. Wilson',
      time: data.time || '10:00 AM',
      date: data.date || new Date().toISOString().split('T')[0],
      type: data.type || 'General',
      source: data.source!,
      status: 'Scheduled'
    };
    mockAppointments.push(newApt);
    return newApt;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<boolean> {
    const apt = mockAppointments.find(a => a.id === id);
    if (apt) { apt.status = status; return true; }
    return false;
  }

  // Slot Management
  async getSlots(): Promise<TimeSlot[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockSlots];
  }

  // Department Management
  async getDepartments(): Promise<HospitalDepartment[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockDepartments];
  }

  async updateDepartment(id: string, updates: Partial<HospitalDepartment>): Promise<boolean> {
    const idx = mockDepartments.findIndex(d => d.id === id);
    if (idx !== -1) {
      mockDepartments[idx] = { ...mockDepartments[idx], ...updates };
      return true;
    }
    return false;
  }

  async createDepartment(data: Partial<HospitalDepartment>): Promise<HospitalDepartment> {
    const newDept: HospitalDepartment = {
      id: `DEPT-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: data.name || 'New Dept',
      description: data.description || '',
      staffCount: 0,
      status: 'Active',
      ...data
    };
    mockDepartments.push(newDept);
    return newDept;
  }

  // Service Management
  async getServices(): Promise<HospitalService[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockServices];
  }

  async updateService(id: string, updates: Partial<HospitalService>): Promise<boolean> {
    const idx = mockServices.findIndex(s => s.id === id);
    if (idx !== -1) {
      mockServices[idx] = { ...mockServices[idx], ...updates };
      return true;
    }
    return false;
  }

  async getDoctors() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDoctors;
  }

  async getEmergencyCases() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEmergency;
  }

  async getRevenueSummary() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRevenue;
  }

  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockUsers];
  }

  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      return true;
    }
    return false;
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockLeaves];
  }

  async updateLeaveStatus(leaveId: string, status: 'Approved' | 'Rejected'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const leave = mockLeaves.find(l => l.id === leaveId);
    if (leave) {
      leave.status = status;
      return true;
    }
    return false;
  }

  async getDoctorPerformance(): Promise<DoctorPerformance[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPerformances];
  }

  async addEHRRecord(patientId: string, record: Partial<EHRRecord>): Promise<boolean> {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      patient.medicalHistory.push({ id: Math.random().toString(), date: new Date().toISOString(), condition: '', treatment: '', notes: '', ...record });
      return true;
    }
    return false;
  }

  async addPrescription(patientId: string, prescription: Partial<Prescription>): Promise<boolean> {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      patient.prescriptions.push({ id: Math.random().toString(), date: new Date().toISOString(), doctorName: '', medications: [], ...prescription });
      return true;
    }
    return false;
  }
}

export const apiService = new ApiService();
