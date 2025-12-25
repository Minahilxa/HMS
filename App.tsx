
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DoctorManagement from './pages/DoctorManagement';
import PatientManagement from './pages/PatientManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import LaboratoryManagement from './pages/LaboratoryManagement';
import RadiologyManagement from './pages/RadiologyManagement';
import PharmacyManagement from './pages/PharmacyManagement';
import BillingManagement from './pages/BillingManagement';
import InsuranceManagement from './pages/InsuranceManagement';
import CMSManagement from './pages/CMSManagement';
import ReportsManagement from './pages/ReportsManagement';
import CommunicationManagement from './pages/CommunicationManagement';
import SettingsSecurity from './pages/SettingsSecurity';
import { apiService } from './services/apiService';
import { 
  Patient, 
  Appointment, 
  Doctor, 
  EmergencyCase, 
  RevenueData, 
  DashboardStats, 
  User, 
  UserRole 
} from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, r, d, e] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRevenueSummary(),
        apiService.getDoctors(),
        apiService.getEmergencyCases()
      ]);
      setStats(s);
      setRevenue(r);
      setDoctors(d);
      setEmergencyCases(e);
    } catch (error) {
      console.error('Failed to load HIS data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user: string, pass: string) => {
    let role = UserRole.SUPER_ADMIN;
    if (user === 'doctor') role = UserRole.DOCTOR;
    if (user === 'accountant') role = UserRole.ACCOUNTANT;
    if (user === 'receptionist') role = UserRole.RECEPTIONIST;
    if (user === 'lab' || user === 'mark') role = UserRole.LAB_TECH;
    if (user === 'radio') role = UserRole.RADIOLOGIST;
    if (user === 'pharmacy') role = UserRole.PHARMACIST;

    setCurrentUser({
      id: 'U1',
      name: user.charAt(0).toUpperCase() + user.slice(1),
      email: `${user}@healsync.com`,
      role: role
    });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="text-slate-500 font-medium">Syncing Hospital Infrastructure...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveTab={setActiveTab} revenue={revenue} />;
      case 'apt-mgmt':
        return <AppointmentManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <ListSection title="Doctors on Duty" data={doctors} type="doctor" />;
      case 'doctor-mgmt':
        return <DoctorManagement />;
      case 'dept-mgmt':
        return <DepartmentManagement />;
      case 'lab-mgmt':
        return <LaboratoryManagement />;
      case 'radio-mgmt':
        return <RadiologyManagement />;
      case 'pharmacy-mgmt':
        return <PharmacyManagement />;
      case 'billing-mgmt':
        return <BillingManagement />;
      case 'insurance-mgmt':
        return <InsuranceManagement />;
      case 'cms-mgmt':
        return <CMSManagement />;
      case 'reports-mgmt':
        return <ReportsManagement />;
      case 'comm-mgmt':
        return <CommunicationManagement />;
      case 'settings-mgmt':
        return <SettingsSecurity />;
      case 'emergency':
        return <ListSection title="Emergency Cases" data={emergencyCases} type="emergency" />;
      case 'revenue':
        return <RevenueDetail revenue={revenue} />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard stats={stats} setActiveTab={setActiveTab} revenue={revenue} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      currentUser={currentUser}
    >
      {renderContent()}
    </Layout>
  );
};

// Sub-component for listing items generically (Simple fallback)
const ListSection: React.FC<{ title: string; data: any[]; type: string }> = ({ title, data, type }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {type === 'doctor' && (
                <>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Doctor Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Specialization</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Room</th>
                </>
              )}
              {type === 'emergency' && (
                <>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Arrival</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                {type === 'doctor' && (
                  <>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{item.specialization}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-bold">{item.room}</td>
                  </>
                )}
                {type === 'emergency' && (
                  <>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.patientName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                        item.priority === 'Critical' ? 'bg-red-600 text-white' : 
                        item.priority === 'Severe' ? 'bg-orange-50 text-orange-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>{item.priority}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{item.arrivalType}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{item.assignedDoctor}</td>
                    <td className="px-6 py-4 text-slate-400 text-[10px] font-bold">{item.timestamp}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RevenueDetail: React.FC<{ revenue: RevenueData[] }> = ({ revenue }) => {
  const total = revenue.reduce((acc, curr) => acc + curr.amount, 0);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Financial Intelligence</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
            Download Statements
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100">
            Generate Invoices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Gross Revenue</p>
          <p className="text-4xl font-black text-slate-800">${total.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">OPD Contribution</p>
          <p className="text-4xl font-black text-sky-600">${revenue.filter(r => r.category === 'OPD').reduce((a,c) => a+c.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">IPD Contribution</p>
          <p className="text-4xl font-black text-purple-600">${revenue.filter(r => r.category === 'IPD').reduce((a,c) => a+c.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Audit Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue Center</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Ledger Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {revenue.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-700 font-bold">{item.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500`}>{item.category}</span>
                </td>
                <td className="px-6 py-4 font-black text-slate-800">${item.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                   <span className="flex items-center text-[10px] font-black text-green-600 uppercase">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      Finalized
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
