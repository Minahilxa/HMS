
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
  mockRadiologyOrders
} from './mockData';
import { DashboardStats, PatientStatus, User, UserRole, LeaveRequest, DoctorPerformance, Patient, EHRRecord, Prescription, Appointment, HospitalDepartment, HospitalService, TimeSlot, LabTest, LabSample, AccessHistory, RadiologyOrder } from '../types';

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
